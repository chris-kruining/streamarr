import { ParentComponent, Index, mergeProps, Component } from 'solid-js';
import { Hero } from '~/common/components/hero';
import { List } from '~/common/components/list';
import { emptyEntry } from '../content';
import type { Entry, Category } from '../content';
import { css } from 'styled-system/css';

export const ListItem: Component<{ entry: Entry }> = (props) => {
  return (
    <div class={tile}>
      <img src={props.entry.thumbnail} />

      <main>
        <a href={`/content/${props.entry.id}`}>Lets go!</a>
      </main>
    </div>
  );
};

const tile = css({
  '--padding': '2em',

  display: 'grid',
  grid: '100% / 100%',
  placeItems: 'start center',
  position: 'relative',
  inlineSize: 'clamp(15em, 20vw, 30em)',
  aspectRatio: '3 / 5',
  transform: 'translateY(calc(-2 * var(--padding)))',
  zIndex: '1',
  contain: 'layout size style',

  '& > img': {
    gridArea: '1/ 1',
    inlineSize: '100%',
    blockSize: '100%',
    borderRadius: '1em',
    objectFit: 'cover',
    objectPosition: 'center',
    zIndex: '1',

    boxShadow: '0 0 1em #000',
    background: `
      /* Dot */
      radial-gradient(circle at 25% 30%, #7772, #7774 1em, transparent 1em),

      /* Dot */
      radial-gradient(circle at 85% 15%, #7772, #7774 1em, transparent 1em),

      /* Bottom fade */
      linear-gradient(165deg, transparent 60%, #555 60%, #333),

      /* wave dark part */
      radial-gradient(ellipse 5em 2.25em at .5em calc(50% - 1em), #333 100%, transparent 100%),

      /* wave light part */
      radial-gradient(ellipse 5em 2.25em at calc(100% - .5em) calc(50% + 1em), #555 100%, transparent 100%),

      /* Base */
      linear-gradient(to bottom, #333 50%, #555 50%)
    `,

    transformOrigin: '50% 0',
    transform: 'scale(.8) translateY(calc(-4 * var(--padding)))',

    userSelect: 'none',
  },

  '& > main': {
    '--offset': 'calc(1.5 * var(--padding))',
    gridArea: '1/ 1',
    display: 'grid',
    alignContent: 'end',
    position: 'relative',
    inlineSize: 'calc(100% + (3 * var(--padding)))',
    blockSize: 'calc(100% + (4 * var(--padding)))',
    padding: 'calc(.5 * var(--padding))',
    backgroundColor: '#444',
    borderRadius: '.5em',
    transform: 'translate3d(0, 0, 0)',
    clipPath: 'inset(-1em)',
    boxShadow: '0 0 1em #000',
    zIndex: '0',

    '&:focus-within': {
      outline: '1px solid #fff',
      outlineOffset: '10px',
    },
  },

  '@media (prefers-reduced-data: no-preference)': {},

  '@media(hover)': {
    '&:not(:hover):not(:focus-within)': {
      transform: 'translateY(0)',
      zIndex: '0',
      willChange: 'transform',

      '& > img': {
        transform: 'scale(1) translateY(0)',
        willChange: 'transform',
      },

      '& > main': {
        clipPath: 'inset(40%)',
      },
    },

    '@media (prefers-reduced-motion: no-preference)': {
      transition: 'transform .2s linear',

      '& > img': {
        transition: 'transform .2s ease-in-out',
      },

      '& > main': {
        transition: 'clip-path .2s ease-in-out',
      },

      '&:is(:hover, :focus-within)': {
        transitionDelay: '0s, .3s',
        zIndex: '1',

        '& > img': {
          transition: 'transform .2s ease-in-out',
        },
      },
    },
  },
});
