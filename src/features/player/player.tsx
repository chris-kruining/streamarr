import { createAsync } from "@solidjs/router";
import { Component, For, Show, createMemo, createSignal } from "solid-js";
import {
  FaSolidBackwardStep,
  FaSolidForwardStep,
  FaSolidRotateLeft,
  FaSolidSpinner,
} from "solid-icons/fa";
import { Entry, getPlayerMetadata } from "../content";
import { Fullscreen } from "./controls/fullscreen";
import { PlayState } from "./controls/playState";
import { SeekBar } from "./controls/seekBar";
import { Settings } from "./controls/settings";
import { Volume } from "./controls/volume";
import { VideoProvider, formatTime, useVideo } from "./context";
import css from "./player.module.css";

interface PlayerProps {
  entry: Entry;
}

export const Player: Component<PlayerProps> = (props) => {
  const [player, setPlayer] = createSignal<HTMLElement>();
  const [video, setVideo] = createSignal<HTMLVideoElement>();
  const metadata = createAsync(() => getPlayerMetadata(props.entry.id), {
    deferStream: true,
  });

  return (
    <VideoProvider
      root={player()}
      video={video()}
      metadata={metadata()}
      offset={metadata()?.resumeOffset ?? props.entry["offset"]}
    >
      <PlayerFrame
        entry={props.entry}
        playerRef={setPlayer}
        videoRef={setVideo}
      />
    </VideoProvider>
  );
};

const PlayerFrame: Component<{
  entry: Entry;
  playerRef: (element: HTMLElement) => void;
  videoRef: (element: HTMLVideoElement) => void;
}> = (props) => {
  const player = useVideo();
  const metadata = player.metadata;
  const source = createMemo(
    () => metadata()?.streamUrl ?? `/api/content/${props.entry.id}/stream`,
  );
  const poster = createMemo(
    () => metadata()?.poster ?? String(props.entry.image ?? ""),
  );

  return (
    <figure ref={props.playerRef} class={css.player} tabindex="0">
      <video
        ref={props.videoRef}
        src={`${source()}${metadata()?.resumeOffset ? `#t=${metadata()?.resumeOffset}` : ""}`}
        poster={poster()}
        aria-label={metadata()?.title ?? props.entry.title}
        onError={() => player.showControls("input")}
      >
        <For each={metadata()?.subtitleTracks.filter((track) => track.url)}>
          {(track) => (
            <track
              default={player.selectedSubtitle() === track.id}
              kind="subtitles"
              label={track.label}
              srclang={track.language}
              src={track.url}
              onError={() => player.reportSubtitleError(track.label)}
            />
          )}
        </For>
      </video>

      <OverLay entry={props.entry} />
      <ControlsPanel />
      <SettingsPanel />
    </figure>
  );
};

const OverLay: Component<{ entry: Entry }> = (props) => {
  const player = useVideo();
  const metadata = player.metadata;

  return (
    <figcaption class={css.overlay}>
      <header class={css.header}>
        <h1>{metadata()?.title ?? props.entry.title}</h1>
        <Show when={metadata()?.directPlay.supported === false}>
          <p>
            Direct browser playback may be unsupported for this file. No
            remuxing, transcoding, HLS, or MSE fallback will be started.
          </p>
        </Show>
      </header>

      <section class={css.status} aria-live="polite">
        <Loader />
        <ErrorState />
        <Feedback />
        <ContextualActions />
      </section>
    </figcaption>
  );
};

const ControlsPanel: Component = () => {
  const player = useVideo();

  return (
    <footer class={css.controls} aria-label="Playback controls">
      <SeekBar />
      <div>
        <PreviousNextControls />
        <PlayState />
        <button
          type="button"
          aria-label="Seek backward 10 seconds"
          onClick={() => player.seekBy(-10)}
        >
          <FaSolidRotateLeft />
        </button>
        <Volume />
        <Settings />
        <Fullscreen />
      </div>
    </footer>
  );
};

const Loader: Component = () => {
  const player = useVideo();

  return (
    <Show when={player.loading() || player.buffering()}>
      <span class={css.loader}>
        <FaSolidSpinner />
        {player.buffering() ? "Buffering" : "Loading"}
      </span>
    </Show>
  );
};

const ErrorState: Component = () => {
  const player = useVideo();

  return (
    <Show when={player.error()}>
      {(message) => (
        <div class={css.error} role="alert">
          <strong>{message()}</strong>
          <button type="button" onClick={() => player.state.replay()}>
            Replay
          </button>
        </div>
      )}
    </Show>
  );
};

const Feedback: Component = () => {
  const player = useVideo();

  return (
    <Show when={player.feedback()}>
      {(feedback) => <output class={css.feedback}>{feedback()}</output>}
    </Show>
  );
};

const PreviousNextControls: Component = () => {
  const player = useVideo();

  return (
    <>
      <Show when={player.metadata()?.previous}>
        {(item) => (
          <button
            type="button"
            aria-label={`Play previous episode: ${item().title}`}
            onClick={() => player.playItem(item())}
          >
            <FaSolidBackwardStep />
          </button>
        )}
      </Show>
      <Show when={player.metadata()?.next}>
        {(item) => (
          <button
            type="button"
            aria-label={`Play next episode: ${item().title}`}
            onClick={() => player.playItem(item())}
          >
            <FaSolidForwardStep />
          </button>
        )}
      </Show>
    </>
  );
};

const ContextualActions: Component = () => {
  const player = useVideo();

  return (
    <div class={css.contextualActions}>
      <For each={player.activeActions()}>
        {(action) => (
          <button
            type="button"
            onClick={() => player.runAction(action)}
            aria-label={action.label}
          >
            {action.label}
          </button>
        )}
      </For>
    </div>
  );
};

const SettingsPanel: Component = () => {
  const player = useVideo();
  const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <aside class={css.settingsPanel} aria-label="Playback settings">
      <h2>Settings</h2>

      <section>
        <h3>Audio</h3>

        <select>
          <For each={player.metadata()?.audioTracks ?? []}>
            {(track) => (
              <option
                aria-pressed={player.selectedAudio() === track.id}
                disabled={track.availability === "unavailable"}
                title={track.reason}
              >
                {track.label}
                <Show when={track.reason}>
                  {(reason) => <small>{reason()}</small>}
                </Show>
              </option>
            )}
          </For>
        </select>
      </section>

      <section>
        <h3>Subtitles</h3>

        <select>
          <For each={player.metadata()?.subtitleTracks ?? []}>
            {(track) => (
              <option
                aria-pressed={player.selectedSubtitle() === track.id}
                disabled={track.availability === "unavailable"}
                title={track.reason}
              >
                {track.label}
                <Show when={track.reason}>
                  {(reason) => <small>{reason()}</small>}
                </Show>
              </option>
            )}
          </For>
        </select>
      </section>

      <section>
        <h3>Speed</h3>

        <select>
          <For each={rates}>
            {(rate) => (
              <option aria-pressed={player.playbackRate() === rate}>
                {rate}x
              </option>
            )}
          </For>
        </select>
      </section>

      <section>
        <h3>Diagnostics</h3>
        <p>
          Direct play{" "}
          {player.metadata()?.directPlay.supported
            ? "available"
            : "unavailable"}
          <br />
          {[
            player.metadata()?.directPlay.container,
            player.metadata()?.directPlay.videoCodec,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </section>
    </aside>
  );
};

export { formatTime };
