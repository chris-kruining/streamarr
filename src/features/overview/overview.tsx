import {
  Component,
  createEffect,
  createSignal,
  Index,
  onMount,
} from "solid-js";
import type { Entry, Category } from "../content";
import { ListItem } from "./list-item";
import { List } from "~/components/list";
import { Hero } from "~/components/hero";
import css from "./overview.module.css";

type OverviewProps = {
  highlight: Entry;
  categories: Category[];
};

export const Overview: Component<OverviewProps> = (props) => {
  const [container, setContainer] = createSignal<HTMLElement>();

  return (
    <div ref={setContainer} class={css.container}>
      <Hero class={css.hero} entry={props.highlight}></Hero>

      <Index each={props.categories}>
        {(category) => (
          <List
            class={css.list}
            label={category().label}
            items={category().entries}
          >
            {(entry) => <ListItem entry={entry()} />}
          </List>
        )}
      </Index>
    </div>
  );
};
