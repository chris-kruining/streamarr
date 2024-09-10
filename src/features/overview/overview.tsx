import { ParentComponent, Index, mergeProps, Component } from 'solid-js';
import { Hero } from '~/common/components/hero';
import { List } from '~/common/components/list';
import { emptyEntry } from '../content';
import type { Entry, Category } from '../content';
import { ListItem } from './list-item';
import { css } from 'styled-system/css';

type OverviewProps = {
  highlight: Entry;
  categories: Category[];
};

export function Overview(props: OverviewProps) {
  const finalProps = mergeProps(
    {
      highlight: emptyEntry,
      categories: [],
    },
    props,
  );

  return (
    <div class={container}>
      <Hero entry={finalProps.highlight}></Hero>

      <Index each={finalProps.categories}>
        {(category) => (
          <List label={category().label} items={category().entries}>
            {(entry) => <ListItem entry={entry()} />}
          </List>
        )}
      </Index>
    </div>
  );
}

const container = css({ display: 'grid', gridAutoFlow: 'row', gap: '2em' });
