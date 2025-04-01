import { A } from "@solidjs/router";
import {
  FaSolidHouseChimney,
  FaSolidMagnifyingGlass,
  FaSolidStar,
} from "solid-icons/fa";
import { ParentComponent, Component } from "solid-js";
import css from "./shell.module.css";
import { ColorSchemePicker } from "../theme";

export const Shell: ParentComponent = (props) => {
  return (
    <main class={css.container}>
      <Top />
      <Nav />

      <div class={css.body}>
        <div>{props.children}</div>
      </div>
    </main>
  );
};

const Top: Component = (props) => {
  return (
    <aside class={css.top}>
      <ColorSchemePicker />
    </aside>
  );
};

const Nav: Component = (props) => {
  return (
    <nav class={css.nav}>
      <ul>
        <A href="/">
          <FaSolidHouseChimney />
          Home
        </A>
        <A href="/library">
          <FaSolidStar />
          Library
        </A>
        <A href="/search">
          <FaSolidMagnifyingGlass />
          Search
        </A>
      </ul>
    </nav>
  );
};
