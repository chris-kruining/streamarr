import { Component, createEffect, createMemo, Show } from "solid-js";
import { ColorSchemePicker } from "../theme";
import { signIn, signOut, useSession } from "~/auth";
import { hash } from "~/utilities";
import css from "./top.module.css";

export const Top: Component = (props) => {
  const session = useSession();
  const hashedEmail = hash("SHA-256", () => session().data?.user.email);

  const login = async () => {
    const response = await signIn.oauth2({
      providerId: "authelia",
      callbackURL: "/",
    });

    console.log("signin response", response);
  };

  const logout = async () => {
    const response = await signOut();

    console.log("signout response", response);
  };

  createEffect(() => {
    console.log(hashedEmail());
  });

  return (
    <aside class={css.top}>
      <Show
        when={session().isPending === false && session().isRefetching === false}
      >
        <Show
          when={session().data?.user}
          fallback={
            <form method="post" onSubmit={login}>
              <button type="submit">Sign in</button>
            </form>
          }
        >
          {(user) => (
            <>
              <div>
                <img
                  src={
                    user().image ??
                    `https://www.gravatar.com/avatar/${hashedEmail()}`
                  }
                />
                <span>{user().name}</span>
                <span>{user().email}</span>
              </div>
              <form method="post" onSubmit={logout}>
                <button type="submit">Log out</button>
              </form>
            </>
          )}
        </Show>
      </Show>
      <ColorSchemePicker />
    </aside>
  );
};
