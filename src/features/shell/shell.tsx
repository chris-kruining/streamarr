import { ParentComponent } from "solid-js";
import { Top } from "./top";
import { Nav } from "./nav";
import css from "./shell.module.css";
import { User } from "../user";

interface ShellProps {
  user: User | undefined;
}

export const Shell: ParentComponent<ShellProps> = (props) => {
  return (
    <main class={css.container}>
      <Top user={props.user} />
      <Nav />

      <div class={css.body}>
        <div>{props.children}</div>
      </div>
    </main>
  );
};
