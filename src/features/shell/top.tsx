import { Component, Show } from "solid-js";
import { signIn, signOut, client } from "~/auth";
import { Avatar, Profile, User } from "../user";
import { ColorSchemePicker } from "../theme";
import css from "./top.module.css";

interface TopProps {
  user: User | undefined;
}

export const Top: Component<TopProps> = (props) => {
  const login = async (e: SubmitEvent) => {
    e.preventDefault();

    await signIn.oauth2({
      providerId: "authelia",
      callbackURL: "/",
    });
  };

  const logout = async (e: SubmitEvent) => {
    e.preventDefault();

    await signOut();
  };

  return (
    <aside class={css.top}>
      <Show
        when={props.user}
        fallback={
          <form method="post" onSubmit={login}>
            <button type="submit">Sign in</button>
          </form>
        }
      >
        {(user) => (
          <>
            <button
              class={css.accountTrigger}
              id="account-menu-trigger"
              popovertarget="account-menu-popover"
            >
              <Avatar user={user()} />
            </button>
            <div class={css.accountMenu} id="account-menu-popover" popover>
              <Profile user={user()} />
              <a href="/settings">Settings</a>
              <form method="post" onSubmit={logout}>
                <button type="submit">Log out</button>
              </form>
            </div>
          </>
        )}
      </Show>
      <ColorSchemePicker />
    </aside>
  );
};
