import { isServer } from "solid-js/web";
import {
  ContextProviderProps,
  createContextProvider,
} from "@solid-primitives/context";
import { Accessor, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { createEventListenerMap } from "@solid-primitives/event-listener";

type State = "playing" | "paused";

interface Volume {
  value: number;
  muted: boolean;
}

export interface VideoAPI {
  readonly state: Accessor<State>;
  readonly volume: Accessor<Volume>;

  play(): void;
  pause(): void;
  togglePlayState(): void;
}

interface VideoProviderProps extends ContextProviderProps {
  video: HTMLVideoElement | undefined;
}

interface VideoStore {
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
      state: "paused",
      volume: {
        value: 0.5,
        muted: false,
      },
    });

    const api: VideoAPI = {
      state: createMemo(() => store.state),

      play() {
        setStore("state", "playing");
      },

      pause() {
        setStore("state", "paused");
      },

      togglePlayState() {
        setStore("state", (state) =>
          state === "playing" ? "paused" : "playing"
        );
      },
    };

    if (isServer || video === undefined) {
      return api;
    }

    createEventListenerMap(video, {
      play(e) {
        setStore("state", "playing");
      },
      pause(e) {
        setStore("state", "paused");
      },
    });

    return api;
  },
  { state: () => "paused" }
);
