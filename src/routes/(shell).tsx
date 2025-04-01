
import { Meta } from "@solidjs/meta";
import { createEffect, on, ParentProps } from "solid-js";
import { Shell } from "~/features/shell";
import { useTheme } from "~/features/theme";

export default function ShellPage(props: ParentProps) {
  const themeContext = useTheme();

  createEffect(on(() => themeContext.theme.colorScheme, (colorScheme) => {
    document.documentElement.dataset.theme = colorScheme;
  }));

  return <Shell>
    <Meta name="color-scheme" content={themeContext.theme.colorScheme} />

    {props.children}
  </Shell>;
}
