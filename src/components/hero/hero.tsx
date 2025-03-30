import { Index } from "solid-js";
import { Entry } from "~/features/content";
import css from "./hero.module.css";

type HeroProps = {
  entry: Entry;
};

export function Hero(props: HeroProps) {
  return (
    <div class={css.container}>
      <h2 class={css.title}>{props.entry.title}</h2>

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

      <p class={css.summary}>{props.entry.summary}</p>
    </div>
  );
}
