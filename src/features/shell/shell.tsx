import { RouteSectionProps, A } from '@solidjs/router';
import { css } from 'styled-system/css';
import { Link, LinkProps } from '~/common/components/ui/link';

export function Shell(props: RouteSectionProps) {
  const items = [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Svelte', value: 'svelte', disabled: true },
    { label: 'Vue', value: 'vue' },
  ];

  return (
    <main class={container}>
      <Nav />

      <div class={body}>{props.children}</div>
    </main>
  );
}

function Nav(props) {
  return (
    <nav class={nav}>
      <Link asChild={(props) => <span>kaas</span>}>
        <A href="/">Home</A>
      </Link>
      <A href="/shows">Shows</A>
      <A href="/movies">Movies</A>
      <A href="/library">Library</A>
      <A href="/search">Search</A>
    </nav>
  );
}

const container = css({
  display: 'grid',
  grid: '100% / 100%',

  zIndex: '0',

  overflowInline: 'clip',
  overflowBlock: 'auto',
  containerType: 'inline-size',
});

const body = css({
  gridArea: '1 / 1',
  inlineSize: '100%',
  blockSize: 'fit-content',
  paddingInline: '2em',
  paddingBlockEnd: '5em',
  background:
    'linear-gradient(180deg, transparent, transparent 90vh, #333 90vh, #333)',

  '@container (inline-size >= 600px)': {
    paddingInlineStart: '7.5em',
  },
});

const nav = css({
  gridArea: '1 / 1',
  display: 'none',
  gridAutoFlow: 'row',
  alignContent: 'start',
  inlineSize: '7.5em',
  padding: '1em',
  position: 'sticky',
  insetBlockStart: '0',

  '@container (inline-size >= 600px)': {
    display: 'grid',
  },
});
