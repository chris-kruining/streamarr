import { Component } from "solid-js";
import { ColorSchemePicker } from "../theme";
import css from "./top.module.css";

export const Top: Component = (props) => {
  return (
    <aside class={css.top}>
      <ColorSchemePicker />
    </aside>
  );
};
