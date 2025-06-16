import { createAsync, json, query } from "@solidjs/router";
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  on,
  Show,
} from "solid-js";
import { Volume } from "./controls/volume";
import { Entry } from "../content";
import { PlayState } from "./controls/playState";
import { useVideo, VideoProvider } from "./context";
import { SeekBar } from "./controls/seekBar";
import { Fullscreen } from "./controls/fullscreen";
import { Settings } from "./controls/settings";
import { FaSolidSpinner } from "solid-icons/fa";
import css from "./player.module.css";

const metadata = query(async (id: string) => {
  "use server";

  // thumbnail sprite image created with
  // ```bash
  // mkdir -p thumbs \
  // && ffmpeg -i SampleVideo_1280x720_10mb.mp4 -r 1 -s 320x180 -f image2 thumbs/thumb-%d.jpg \
  // && montage thumbs/*.jpg -geometry 320x180 -tile 8x overview.jpg \
  // && rm -rf thumbs
  // ```
  //
  // 1. create thumbs directory
  // 2. create image every 1 second
  // 3. create sprite from images
  // 4. remove thumbs

  const path = `${import.meta.dirname}/SampleVideo_1280x720_10mb`;

  return json({
    captions: await Bun.file(`${path}.captions.vtt`).bytes(),
    thumbnails: {
      track: await Bun.file(`${path}.thumbnails.vtt`).text(),
      image: await Bun.file(`${import.meta.dirname}/overview.jpg`).bytes(),
    },
  });
}, "player.metadata");

interface PlayerProps {
  entry: Entry;
}

export const Player: Component<PlayerProps> = (props) => {
  const [player, setPlayer] = createSignal<HTMLElement>(
    undefined as unknown as HTMLElement
  );
  const [video, setVideo] = createSignal<HTMLVideoElement>(
    undefined as unknown as HTMLVideoElement
  );

  const data = createAsync(() => metadata(props.entry.id), {
    deferStream: true,
    initialValue: {} as any,
  });
  const captionUrl = createMemo(() => {
    const { captions } = data();

    return captions !== undefined
      ? URL.createObjectURL(new Blob([captions], { type: "text/vtt" }))
      : "";
  });
  const thumbnails = createMemo(() => {
    const { thumbnails } = data();

    return thumbnails !== undefined
      ? URL.createObjectURL(new Blob([thumbnails.track], { type: "text/vtt" }))
      : "";
  });

  createEffect(on(thumbnails, (thumbnails) => {}));

  return (
    <>
      <figure ref={setPlayer} class={css.player}>
        {/* <h1>{props.entry.title}</h1> */}

        <video
          ref={setVideo}
          src={`/api/content/${props.entry.id}/stream${
            props.entry["offset"] ? `#t=${props.entry["offset"]}` : ""
          }`}
          poster={props.entry.image}
          lang="en"
          autoplay
        >
          <track
            default
            kind="captions"
            label="English"
            srclang="en"
            src={captionUrl()}
          />
          <track default kind="chapters" src={thumbnails()} id="thumbnails" />
          {/* <track kind="captions" />
        <track kind="chapters" />
        <track kind="descriptions" />
        <track kind="metadata" />
        <track kind="subtitles" /> */}
        </video>

        <figcaption>
          <VideoProvider
            root={player()}
            video={video()}
            offset={props.entry["offset"]}
          >
            <header>
              <h1>{props.entry.title}</h1>
            </header>

            <section>
              <Loader />
            </section>

            <footer>
              <section>
                <SeekBar />
              </section>
              <section>
                <Volume />
              </section>
              <section>
                <PlayState />
              </section>
              <section>
                <Fullscreen />
                <Settings />
              </section>
            </footer>
          </VideoProvider>
        </figcaption>
      </figure>
    </>
  );
};

const Loader: Component = () => {
  const video = useVideo();

  return (
    <Show when={video.loading()}>
      <FaSolidSpinner />
    </Show>
  );
};
