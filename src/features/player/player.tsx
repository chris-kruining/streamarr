import {
  createEventListenerMap,
  createEventSignal,
} from "@solid-primitives/event-listener";
import { query } from "@solidjs/router";
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
  untrack,
} from "solid-js";

interface PlayerProps {
  id: string;
}

export const Player: Component<PlayerProps> = (props) => {
  const [video, setVideo] = createSignal<HTMLVideoElement>(undefined as unknown as HTMLVideoElement);

  const onDurationChange = createEventSignal(video, 'durationchange');
  const onTimeUpdate = createEventSignal(video, 'timeupdate');

  const duration = createMemo(() => {
    onDurationChange();
    onTimeUpdate();

    return video()?.duration ?? 100;
  });

  const currentTime = createMemo(() => {
    onTimeUpdate();

    return video()?.currentTime ?? 0;
  });

  createEffect(() => {
    console.log(duration(), currentTime());
  });

  createEventListenerMap(() => video()!, {
    durationchange(e) {
      console.log("durationchange", e);
    },
    loadeddata(e) {
      console.log("loadeddata", e);
    },
    loadedmetadata(e) {
      console.log("loadedmetadata", e);
    },
    ratechange(e) {
      console.log("ratechange", e);
    },
    seeked(e) {
      console.log("seeked", e);
    },
    seeking(e) {
      console.log("seeking", e);
    },
    stalled(e) {
      console.log("stalled (meaning downloading data failed)", e, video()!.error);
    },

    play(e) {
      console.log("play", e);
    },
    canplay(e) {
      console.log("canplay", e);
    },
    playing(e) {
      console.log("playing", e);
    },
    pause(e) {
      console.log("pause", e);
    },
    suspend(e) {
      console.log("suspend", e);
    },

    volumechange(e) {
      console.log("volumechange", e);
    },

    waiting(e) {
      console.log("waiting", e);
    },

    progress(e) {
      console.log(e);
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
    <>
      <h1>{props.id}</h1>

      <video ref={setVideo} width="1280px" height="720px" muted src="/api/stream/video" />

      <button onclick={toggle}>play/pause</button>

      <span style={{ '--duration': duration(), '--current-time': currentTime() }} />
      <span data-duration={duration()} data-current-time={currentTime()} />

      <progress max={duration()} value={currentTime()} />
    </>
  );
};
