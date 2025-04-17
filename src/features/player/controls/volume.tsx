import { Component, createEffect, createSignal, Show } from "solid-js";
import css from "./volume.module.css";
import { createStore, unwrap } from "solid-js/store";
import { trackDeep } from "@solid-primitives/deep";

interface VolumeProps {
  value: number;
  muted?: boolean;
  onInput?: (next: { volume: number, muted: boolean }) => any;
}

export const Volume: Component<VolumeProps> = (props) => {
  const [state, setState] = createStore({ volume: props.value, muted: props.muted ?? false });

  createEffect(() => {
    props.onInput?.(unwrap(trackDeep(state)));
  });

  return (
    <div class={css.container}>
      <button onClick={() => setState('muted', m => !m)}><Show when={state.muted} fallback="mute">unmute</Show></button>
      <input type="range" value={state.volume} min="0" max="1" step="0.01" onInput={(e) => setState('volume', e.target.valueAsNumber)} />
    </div>
  );
};
