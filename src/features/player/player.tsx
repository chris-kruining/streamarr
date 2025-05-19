import {
  createEventListenerMap,
  createEventSignal,
} from "@solid-primitives/event-listener";
import { createAsync, json, query } from "@solidjs/router";
import { Component, createEffect, createMemo, createSignal, on } from "solid-js";
import css from "./player.module.css";
import { Volume } from "./controls/volume";
import { Entry, getEntry } from "../content";

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
  const [video, setVideo] = createSignal<HTMLVideoElement>(
    undefined as unknown as HTMLVideoElement,
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

  createEffect(on(thumbnails, (thumbnails) => {
    // console.log(thumbnails, video()!.textTracks.getTrackById("thumbnails")?.cues);

    // const captions = el.addTextTrack("captions", "English", "en");
    // captions.
  }));

  const onDurationChange = createEventSignal(video, "durationchange");
  const onTimeUpdate = createEventSignal(video, "timeupdate");

  const duration = createMemo(() => {
    onDurationChange();

    return video()?.duration ?? 0;
  });

  const currentTime = createMemo(() => {
    onTimeUpdate();

    return video()?.currentTime ?? 0;
  });

  createEventListenerMap(() => video()!, {
    durationchange(e) {
      // console.log("durationchange", e);
    },
    loadeddata(e) {
      // console.log("loadeddata", e);
    },
    loadedmetadata(e) {
      // console.log("loadedmetadata", e);
    },
    ratechange(e) {
      // console.log("ratechange", e);
    },
    seeked(e) {
      // console.log("seeked", e);
    },
    seeking(e) {
      // console.log("seeking", e);
    },
    stalled(e) {
      // console.log(
      //   "stalled (meaning downloading data failed)",
      //   e,
      //   video()!.error,
      // );
    },

    play(e) {
      // console.log("play", e);
    },
    canplay(e) {
      // console.log("canplay", e);
    },
    playing(e) {
      // console.log("playing", e);
    },
    pause(e) {
      // console.log("pause", e);
    },
    suspend(e) {
      // console.log("suspend", e);
    },

    volumechange(e) {
      // console.log("volumechange", e);
    },

    waiting(e) {
      // console.log("waiting", e);
    },

    progress(e) {
      // console.log(e);
    },

    // timeupdate(e) {
    //   console.log("timeupdate", e);
    // },
  });

  const toggle = () => {
    const el = video();

    if (!el) {
      return;
    }

    el[el.paused ? "play" : "pause"]();
  };

  return (
    <figure class={css.player}>
      <h1>{props.entry?.title}</h1>

      <video
        ref={setVideo}
        muted
        autoplay
        controls
        src={`/api/content/stream?id=${props.id}`}
        lang="en"
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
        <Volume value={video()?.volume ?? 0} muted={video()?.muted ?? false} onInput={({ volume, muted }) => {
          video().volume = volume;
          video().muted = muted;
        }} />
      </figcaption>

      <button onclick={toggle}>play/pause</button>

      <span>
        {formatTime(currentTime())} / {formatTime(duration())}
      </span>
      <progress max={duration().toFixed(0)} value={currentTime().toFixed(0)} />
    </figure>
  );
};

const formatTime = (subject: number) => {
  const hours = Math.floor(subject / 3600);
  const minutes = Math.floor((subject % 3600) / 60);
  const seconds = Math.floor(subject % 60);

  const sections = hours !== 0 ? [hours, minutes, seconds] : [minutes, seconds];

  return sections.map((section) => String(section).padStart(2, "0")).join(":");
};
