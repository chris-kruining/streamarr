import { Component, Show } from "solid-js";
import { useVideo } from "../context";
import { FaSolidVolumeOff, FaSolidVolumeXmark } from "solid-icons/fa";
import css from "./volume.module.css";

interface VolumeProps {}

export const Volume: Component<VolumeProps> = (props) => {
  const video = useVideo();

  return (
    <div class={css.container}>
      <button
        type="button"
        aria-label={video.volume.muted() ? "Unmute" : "Mute"}
        aria-pressed={video.volume.muted()}
        onClick={() => video.volume.setMuted((m) => !m)}
      >
        <Show when={video.volume.muted()} fallback={<FaSolidVolumeOff />}>
          <FaSolidVolumeXmark />
        </Show>
      </button>
      <input
        type="range"
        aria-label="Volume"
        value={video.volume.value()}
        min="0"
        max="1"
        step="0.01"
        onInput={(e) => {
          video.volume.setValue(e.target.valueAsNumber);
          video.volume.setMuted(false);
        }}
      />
    </div>
  );
};
