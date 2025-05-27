import { isServer } from "solid-js/web";
import {
  ContextProviderProps,
  createContextProvider,
} from "@solid-primitives/context";
import { Accessor, createEffect, onMount, Setter } from "solid-js";
import { createStore } from "solid-js/store";
import { createEventListenerMap } from "@solid-primitives/event-listener";

type State = "playing" | "paused";

type Volume = {
  value: number;
  muted: boolean;
};

export interface VideoAPI {
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
  video: HTMLVideoElement | undefined;
}

interface VideoStore {
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
      duration: 0,
      buffered: 0,
      currentTime: 0,
      state: "paused",
      volume: {
        value: 0.1,
        muted: false,
      },
    });

    const api: VideoAPI = {
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

    if (isServer || video === undefined) {
      return api;
    }

    createEffect(() => {
      video[store.state === "playing" ? "play" : "pause"]();
    });

    createEffect(() => {
      video.muted = store.volume.muted;
    });

    createEffect(() => {
      video.volume = store.volume.value;
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
    });

    return api;
  },
  {
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
