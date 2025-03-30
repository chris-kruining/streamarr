import { Component, Index } from "solid-js";
import type { Entry, Category } from "../content";
import { ListItem } from "./list-item";
import { List } from "~/components/list";
import { Hero } from "~/components/hero";
import css from "./overview.module.css";

type OverviewProps = {
  highlight: Entry;
  categories: Category[];
};

export function Overview(props: OverviewProps) {
  return (
    <div class={css.container}>
      <Hero entry={props.highlight}></Hero>

      <Index each={props.categories}>
        {(category) => (
          <List label={category().label} items={category().entries}>
            {(entry) => <ListItem entry={entry()} />}
          </List>
        )}
      </Index>
    </div>
  );
}
