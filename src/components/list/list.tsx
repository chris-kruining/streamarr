import { Accessor, Index, JSX } from "solid-js";
import { css } from "./list.module.css";

interface ListProps<T> {
  label: string;
  items: T[];
  children: (item: Accessor<T>) => JSX.Element;
}

export function List<T>(props: ListProps<T>) {
  return (
    <section class={css.container}>
      <b role="heading" class={css.heading}>
        {props.label}
      </b>

      <ul class={css.list}>
        <Index each={props.items}>{(item) => props.children(item)}</Index>
      </ul>
    </section>
  );
}
