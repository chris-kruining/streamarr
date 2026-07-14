import { Component, Show } from "solid-js";
import { useVideo } from "../context";
import { FaSolidCompress, FaSolidExpand } from "solid-icons/fa";

export const Fullscreen: Component = () => {
  const video = useVideo();

  return (
    <button
      type="button"
      aria-label={video.fullscreen() ? "Exit fullscreen" : "Enter fullscreen"}
      aria-pressed={video.fullscreen()}
      onClick={() => video.setFullscreen((last) => !last)}
    >
      <Show when={video.fullscreen()} fallback={<FaSolidExpand />}>
        <FaSolidCompress />
      </Show>
    </button>
  );
};
