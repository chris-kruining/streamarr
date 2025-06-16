import { isServer } from "solid-js/web";
import {
  ContextProviderProps,
  createContextProvider,
} from "@solid-primitives/context";
import { Accessor, createEffect, on, onMount, Setter } from "solid-js";
import { createStore } from "solid-js/store";
import { createEventListenerMap } from "@solid-primitives/event-listener";
import { createFullscreen } from "@solid-primitives/fullscreen";

type State = "playing" | "paused";

type Volume = {
  value: number;
  muted: boolean;
};

export interface VideoAPI {
  readonly fullscreen: Accessor<boolean>;
  readonly setFullscreen: Setter<boolean>;

  readonly loading: Accessor<boolean>;
  readonly duration: Accessor<number>;
  readonly buffered: Accessor<number>;
  readonly currentTime: Accessor<number>;

  setTime(time: number): void;

  readonly state: {
    readonly state: Accessor<State>;
    readonly setState: Setter<State>;
    pause(): void;
    play(): void;
  };
  readonly volume: {
    readonly value: Accessor<number>;
    readonly muted: Accessor<boolean>;
    readonly setValue: Setter<number>;
    readonly setMuted: Setter<boolean>;
    unmute(): void;
    mute(): void;
  };
}

interface VideoProviderProps extends ContextProviderProps {
  root: HTMLElement | undefined;
  video: HTMLVideoElement | undefined;
  offset?: number;
}

interface VideoStore {
  fullscreen: boolean;
  loading: boolean;
  duration: number;
  buffered: number;
  currentTime: number;
  state: State;
  volume: Volume;
}

export const [VideoProvider, useVideo] = createContextProvider<
  VideoAPI,
  VideoProviderProps
>(
  (props) => {
    const video = props.video;
    const [store, setStore] = createStore<VideoStore>({
      fullscreen: false,
      loading: true,
      duration: 0,
      buffered: 0,
      currentTime: props.offset ?? 0,
      state: "paused",
      volume: {
        value: 0.1,
        muted: false,
      },
    });

    const fullscreen = createFullscreen(
      () => props.root,
      () => store.fullscreen
    );

    const api: VideoAPI = {
      fullscreen,
      setFullscreen: setStore.bind(null, "fullscreen"),

      loading: () => store.loading,

      duration: () => store.duration,
      buffered: () => store.buffered,
      currentTime: () => store.currentTime,

      setTime(time) {
        video!.currentTime = time;
      },

      state: {
        state: () => store.state,
        setState: setStore.bind(null, "state"),

        play() {
          setStore("state", "playing");
        },

        pause() {
          setStore("state", "paused");
        },
      },
      volume: {
        value: () => store.volume.value,
        muted: () => store.volume.muted,

        setValue: setStore.bind(null, "volume", "value"),
        setMuted: setStore.bind(null, "volume", "muted"),

        mute() {
          setStore("volume", "muted", true);
        },
        unmute() {
          setStore("volume", "muted", false);
        },
      },
    };

    console.log(props.root, props.video);

    if (isServer || video === undefined) {
      return api;
    }

    createEffect(
      on(
        () => store.state,
        (state) => {
          video[state === "playing" ? "play" : "pause"]();
        }
      )
    );

    createEffect(() => {
      video.muted = store.volume.muted;
    });

    createEffect(() => {
      video.volume = store.volume.value;
    });

    createEffect(() => {
      console.log(store.currentTime, props.offset);
    });

    onMount(() => {
      setStore("duration", video.duration);
      setStore("currentTime", video.currentTime);
    });

    createEventListenerMap(video, {
      play(e) {
        setStore("state", "playing");
      },
      pause(e) {
        setStore("state", "paused");
      },
      durationchange(e) {
        setStore("duration", video.duration);
      },
      timeupdate(e) {
        setStore("currentTime", video.currentTime);
      },
      volumeChange() {
        setStore("volume", { muted: video.muted, value: video.volume });
      },
      progress(e) {
        const timeRanges = video.buffered;

        setStore(
          "buffered",
          timeRanges.length > 0 ? timeRanges.end(timeRanges.length - 1) : 0
        );
      },
      canplay() {
        console.log("can play!");
        // setStore("loading", false);
      },
      canplaythrough() {
        console.log("can play through!");
        setStore("loading", false);
      },
      waiting() {
        setStore("loading", true);
      },
    });

    return api;
  },
  {
    fullscreen: () => false,
    setFullscreen() {},

    loading: () => false,

    duration: () => 0,
    buffered: () => 0,
    currentTime: () => 0,

    setTime() {},

    state: {
      state: () => "playing",
      setState() {},
      play() {},
      pause() {},
    },
    volume: {
      value: () => 0.5,
      muted: () => false,

      setValue() {},
      setMuted() {},

      mute() {},
      unmute() {},
    },
  }
);
