import { Meta } from "@solidjs/meta";
import { query, createAsync } from "@solidjs/router";
import { createEffect, on, ParentProps } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import { auth } from "~/auth";
import { Shell } from "~/features/shell";
import { useTheme } from "~/features/theme";
import { User } from "~/features/user";

const load = query(async (): Promise<User | undefined> => {
  "use server";

  const cookies = Object.fromEntries(
    getRequestEvent()!
      .request.headers.get("cookie")!
      .split(";")
      .map((c) => c.trim())
      .map((cookie) => {
        const index = cookie.indexOf("=");

        return [
          cookie.slice(0, index),
          decodeURIComponent(cookie.slice(index + 1)),
        ];
      })
  );

  const session = await auth.api.getSession(getRequestEvent()!.request);

  if (session === null) {
    return undefined;
  }

  const {
    preferred_username,
    name,
    email,
    image = null,
    ...user
  } = session.user;

  return { username: preferred_username, name, email, image };
}, "session");

export const route = {
  async preload() {
    return load();
  },
};

export default function ShellPage(props: ParentProps) {
  const user = createAsync(() => load());
  const themeContext = useTheme();

  createEffect(() => {
    console.log(user());
  });

  createEffect(
    on(
      () => themeContext.theme.colorScheme,
      (colorScheme) => {
        document.documentElement.dataset.theme = colorScheme;
      }
    )
  );

  return (
    <Shell user={user()}>
      <Meta name="color-scheme" content={themeContext.theme.colorScheme} />

      {props.children}
    </Shell>
  );
}
