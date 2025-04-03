import { Component, createMemo, Show } from "solid-js";

export const Avatar: Component = (props) => {
  const src = createMemo(() => "");

  return (
    <Show when={src()}>
      <img src={src()} />
    </Show>
  );
};
