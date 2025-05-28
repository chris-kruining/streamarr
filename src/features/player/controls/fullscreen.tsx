import { Component, Show } from "solid-js";
import { useVideo } from "../context";
import { FaSolidCompress, FaSolidExpand } from "solid-icons/fa";

export const Fullscreen: Component<{}> = (props) => {
  const video = useVideo();

  return (
    <button onclick={(e) => video.setFullscreen((last) => !last)}>
      <Show when={video.fullscreen()} fallback={<FaSolidExpand />}>
        <FaSolidCompress />
      </Show>
    </button>
  );
};
