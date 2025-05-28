import { Component, createSignal, onCleanup, onMount } from "solid-js";
import { Entry } from "~/features/content";
import css from "./details.module.css";

interface DetailsProps {
  entry: Entry;
}

export const Details: Component<DetailsProps> = (props) => {
  const [header, setHeader] = createSignal<HTMLElement>();

  onMount(() => {
    const observer = new ResizeObserver(([entry]) => {
      const _20em = 20 * 16;
      const { inlineSize, blockSize } = entry.contentBoxSize[0];
      console.log(blockSize / inlineSize);

      (entry.target as HTMLElement).style.setProperty(
        "--ratio",
        String(_20em / inlineSize),
      );
    });

    observer.observe(header()!);

    onCleanup(() => observer.disconnect());
  });

  return (
    <div class={css.container}>
      <header ref={setHeader} class={css.header}>
        <img class={css.background} src={props.entry.image} />

        <h1>{props.entry.title}</h1>
      </header>
    </div>
  );
};
