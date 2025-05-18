import { Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { Overview } from "~/features/overview";
import {
  getHighlights,
  listCategories,
} from "~/features/content";
import { Show } from "solid-js";

export const route = {
  preload: async () => ({
    highlight: await getHighlights(),
    categories: await listCategories(),
  }),
};

export default function Home() {
  const highlights = createAsync(() => getHighlights());
  const categories = createAsync(() => listCategories());
  
  return (
    <>
      <Title>Home</Title>

      <Show when={highlights() && categories()}>
        <Overview highlights={highlights()!} categories={categories()!} />
      </Show>
    </>
  );
}
