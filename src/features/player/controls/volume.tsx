import { Component, createSignal } from "solid-js";
import css from "./volume.module.css";

interface VolumeProps {
  value: number;
}

export const Volume: Component<VolumeProps> = (props) => {
  const [volume, setVolume] = createSignal(props.value);

  return (
    <div class={css.container}>
      <button>mute</button>
      <input type="range" value={volume()} min="0" max="1" step="0.01" />
    </div>
  );
};
