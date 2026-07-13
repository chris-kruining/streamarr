import { Meta } from "@solidjs/meta";
import { query, createAsync } from "@solidjs/router";
import { createEffect, on, ParentProps } from "solid-js";
import { getRequestEvent } from "solid-js/web";
import { getAuthSession } from "~/auth.server";
import { Shell } from "~/features/shell";
import { useTheme } from "~/features/theme";
import { User } from "~/features/user";

const load = query(async (): Promise<User | undefined> => {
  "use server";

  const session = await getAuthSession(getRequestEvent()!.request);

  if (session === null) {
    return undefined;
  }

  const { name, email, image = null } = session.user;
  const username = session.user.username ?? name ?? email;

  return { username, name, email, image };
}, "session");

export const route = {
  async preload() {
    return load();
  },
};

export default function ShellPage(props: ParentProps) {
  const user = createAsync(() => load());
  const themeContext = useTheme();

  // createEffect(
  //   on(
  //     () => themeContext.theme.colorScheme,
  //     (colorScheme) => {
  //       document.documentElement.dataset.theme = colorScheme;
  //     }
  //   )
  // );

  return (
    <Shell user={user()}>
      <Meta name="color-scheme" content={themeContext.theme.colorScheme} />

      {props.children}
    </Shell>
  );
}
