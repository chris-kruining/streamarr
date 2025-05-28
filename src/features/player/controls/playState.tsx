import { Component, Show } from "solid-js";
import { useVideo } from "../context";
import { FaSolidPause, FaSolidPlay } from "solid-icons/fa";

export const PlayState: Component<{}> = (props) => {
  const video = useVideo();

  return (
    <button
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
