import { Component } from "solid-js";
import { useVideo } from "../context";
import { FaSolidEllipsisVertical } from "solid-icons/fa";

export const Settings: Component = () => {
  const video = useVideo();

  return (
    <button
      type="button"
      aria-label={video.settingsOpen() ? "Close playback settings" : "Open playback settings"}
      aria-expanded={video.settingsOpen()}
      onClick={() => video.setSettingsOpen(!video.settingsOpen())}
    >
      <FaSolidEllipsisVertical />
    </button>
  );
};
