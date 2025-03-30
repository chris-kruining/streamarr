import type { Entry } from "../content";
import { Component } from "solid-js";
import css from "./list-item.module.css";

export const ListItem: Component<{ entry: Entry }> = (props) => {
  return (
    <div class={css.tile}>
      <img src={props.entry.thumbnail} />

      <main>
        <a href={`/content/${props.entry.id}`}>Lets go!</a>
      </main>
    </div>
  );
};
