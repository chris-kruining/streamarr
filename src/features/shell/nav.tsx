import { A } from "@solidjs/router";
import { AiOutlineHome, AiOutlineStar, AiOutlineSearch } from "solid-icons/ai";
import { Component } from "solid-js";
import css from "./nav.module.css";

export const Nav: Component = (props) => {
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
