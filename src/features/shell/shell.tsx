import { ParentComponent } from "solid-js";
import { Top } from "./top";
import { Nav } from "./nav";
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
