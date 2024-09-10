import { Index } from 'solid-js';
import { css } from 'styled-system/css';
import { Entry } from '~/features/content';

type HeroProps = {
  entry: Entry;
};

export function Hero(props: HeroProps) {
  return (
    <div class={container}>
      <h2 class={title}>{props.entry.title}</h2>

      <img src={props.entry.thumbnail} class={thumbnail} />
      <img src={props.entry.image} class={background} />

      <span class={detail}>
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

      <p class={summary}>{props.entry.summary}</p>
    </div>
  );
}

const container = css({
  display: 'grid',
  grid: 'repeat(3, auto) / 10em 1fr',
  gridTemplateAreas: `
    "thumbnail ."
    "thumbnail title"
    "thumbnail detail"
    "thumbnail summary"
  `,
  alignContent: 'end',
  gap: '1em',
  blockSize: '80vh',
});

const title = css({
  gridArea: 'title',
  fontSize: '2.5em',
});

const thumbnail = css({
  gridArea: 'thumbnail',
  inlineSize: '15em',
  aspectRatio: '3 / 5',
  borderRadius: '1em',
  objectFit: 'cover',
  objectPosition: 'center',
});

const background = css({
  position: 'fixed',
  inset: '0',
  zIndex: '-1',
  blockSize: '90vh',
  inlineSize: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
});

const detail = css({
  gridArea: 'detail',
});

const summary = css({
  gridArea: 'summary',
  textWrap: 'balance',
});
