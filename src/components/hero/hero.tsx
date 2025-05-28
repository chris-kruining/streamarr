import { Component, createEffect, createMemo, For, Index } from "solid-js";
import { createSlug, Entry } from "~/features/content";
import css from "./hero.module.css";

type HeroProps = {
  entries: Entry[];
  class?: string;
};

export function Hero(props: HeroProps) {
  const entry = createMemo(() => props.entries.at(0)!);
  const slug = createMemo(() => createSlug(entry()));

  return (
    <div class={`${css.container} ${props.class ?? ""}`}>
      <For each={props.entries}>{(entry) => <Page entry={entry} />}</For>
    </div>
  );
}

const Page: Component<{ entry: Entry }> = (props) => {
  const slug = createMemo(() => createSlug(props.entry));

  return (
    <div
      class={`${css.page}`}
      style={{ "--thumb-image": `url(${props.entry.thumbnail})` }}
    >
      <h2 class={css.title}>{props.entry.title}</h2>

      <a class={css.cta} href={`/watch/${slug()}`}>
        Continue
      </a>

      <img src={props.entry.thumbnail} class={css.thumbnail} />
      <img src={props.entry.image} class={css.background} />

      <span class={css.detail}>
        {props.entry.releaseDate}

        <Index each={props.entry.sources ?? []}>
          {(source) => (
            <>
              &nbsp;•&nbsp;
              <a href={source().url.toString()} target="_blank">
                {source().rating.score} {source().label}
              </a>
            </>
          )}
        </Index>
      </span>

      <p class={css.summary}>{props.entry.overview}</p>
    </div>
  );
};
