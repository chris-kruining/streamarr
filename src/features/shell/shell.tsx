import { A } from "@solidjs/router";
import {
  AiOutlineHome,
  AiOutlineStar,
  AiOutlineSearch,
} from "solid-icons/ai";
import { ParentComponent, Component } from "solid-js";
import { ColorSchemePicker } from "../theme";
import css from "./shell.module.css";

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
        <A href="/" activeClass={css.active} end={true}>
          <AiOutlineHome />
          <span>Home</span>
        </A>
        <A href="/library" activeClass={css.active}>
          <AiOutlineStar />
          <span>Library</span>
        </A>
        <A href="/search" activeClass={css.active}>
          <AiOutlineSearch />
          <span>Search</span>
        </A>
      </ul>
    </nav>
  );
};
