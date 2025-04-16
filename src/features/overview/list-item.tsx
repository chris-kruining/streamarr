import type { Entry } from "../content";
import { createSlug } from "../content";
import { Component, createMemo } from "solid-js";
import css from "./list-item.module.css";

export const ListItem: Component<{ entry: Entry }> = (props) => {
  const slug = createMemo(() => createSlug(props.entry));

  return (
    <figure class={css.listItem}>
      <img src={props.entry.thumbnail} alt={props.entry.title} />

      <figcaption>
        <strong>{props.entry.title}</strong>

        <a href={`/watch/${slug()}`}>Watch now</a>
      </figcaption>
    </figure>
  );
};
