import { Component, Show } from "solid-js";
import { useVideo } from "../context";
import { FaSolidPause, FaSolidPlay } from "solid-icons/fa";
import css from "./playState.module.css";

export const PlayState: Component<{}> = (props) => {
  const video = useVideo();

  return (
    <button
      class={css.play}
      onclick={(e) =>
        video.state.setState((last) =>
          last === "playing" ? "paused" : "playing"
        )
      }
    >
      <Show when={video.state.state() === "playing"} fallback={<FaSolidPlay />}>
        <FaSolidPause />
      </Show>
    </button>
  );
};
