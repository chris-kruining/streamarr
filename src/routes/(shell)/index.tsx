import { Title } from "@solidjs/meta";
import { createAsync, query } from "@solidjs/router";
import { Overview } from "~/features/overview";
import { listCategories, getEntry } from "~/features/content";
import { createEffect, Show } from "solid-js";

const load = query(async () => {
  "use server";

  // const response =
}, "home.data");

export const route = {
  preload: async () => ({
    highlight: await getEntry("14"),
    categories: await listCategories(),
  }),
};

export default function Home() {
  const highlight = createAsync(() => getEntry("14"));
  const categories = createAsync(() => listCategories());

  createEffect(() => {
    console.log(highlight(), categories());
  });

  return (
    <>
      <Title>Home</Title>

      <Show when={highlight() && categories()}>
        <Overview highlight={highlight()!} categories={categories()!} />
      </Show>
    </>
  );
}
