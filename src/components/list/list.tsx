import { Accessor, Index, JSX } from "solid-js";
import css from "./list.module.css";

interface ListProps<T> {
  label: string;
  items: T[];
  class?: string;
  children: (item: Accessor<T>) => JSX.Element;
}

export function List<T>(props: ListProps<T>) {
  return (
    <section class={`${css.container} ${props.class ?? ""}`}>
      <b role="heading" class={css.heading}>
        {props.label}
      </b>

      <sub class={css.metadata}>{props.items.length} result(s)</sub>

      <ul class={css.list}>
        <Index each={props.items}>
          {(item) => <li>{props.children(item)}</li>}
        </Index>
      </ul>
    </section>
  );
}
