import { ParentComponent, Index } from 'solid-js';
import { css } from 'styled-system/css';

type ListProps<T, U extends JSX.Element> = {
  label: string;
  items: T[];
  children: (item: T) => U;
};

export const List: ParentComponent<{ label: string; items: T[] }> = (props) => {
  return (
    <section class={container}>
      <b role="heading" class={heading}>
        {props.label}
      </b>

      <ul class={list}>
        <Index each={props.items}>{props.children}</Index>
      </ul>
    </section>
  );
};

const container = css({
  display: 'grid',
  gridAutoFlow: 'row',
  inlineSize: '100%',
});

const heading = css({
  fontSize: '2em',
});

const list = css({
  // layout
  display: 'grid',
  gridAutoFlow: 'column',
  //   gridAutoColumns: '',

  // spacing
  gap: '2em',
  padding: '10em 4em 5em',
  scrollPadding: '4em',
  margin: '-10em -4em 0em',
  marginBlockStart: '-10em',

  // scroll
  overflowInline: 'auto',
  overflowBlock: 'visible',
  scrollSnapType: 'inline proximity',

  '@media (hover: none)': {
    '& > *': { scrollSnapAlign: 'start' },
  },
});
