import { Component, Show } from "solid-js";
import { useVideo } from "../context";
import { FaSolidPause, FaSolidPlay } from "solid-icons/fa";

export const PlayState: Component = () => {
  const video = useVideo();

  return (
    <button
      type="button"
      aria-label={video.state.state() === "playing" ? "Pause" : "Play"}
      aria-pressed={video.state.state() === "playing"}
      onClick={() => {
        if (video.state.state() === "playing") {
          video.state.pause();
        } else {
          video.state.play();
        }
      }}
    >
      <Show when={video.state.state() === "playing"} fallback={<FaSolidPlay />}>
        <FaSolidPause />
      </Show>
    </button>
  );
};
