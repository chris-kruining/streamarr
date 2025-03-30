import { RouteSectionProps, A } from "@solidjs/router";
import {
  FaSolidHouseChimney,
  FaSolidMagnifyingGlass,
  FaSolidStar,
} from "solid-icons/fa";
import { Component } from "solid-js";
import css from "./shell.module.css";

export const Shell: Component<RouteSectionProps> = (props) => {
  return (
    <main class={css.container}>
      <Nav />

      <div class={css.body}>{props.children}</div>
    </main>
  );
};

const Nav: Component = (props) => {
  return (
    <nav class={css.nav}>
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
    </nav>
  );
};
