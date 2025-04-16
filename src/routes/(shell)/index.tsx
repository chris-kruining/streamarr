import { Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { Overview } from "~/features/overview";
import {
  listCategories,
  getEntry,
  getContinueWatching,
} from "~/features/content";
import { Show } from "solid-js";
import { List } from "~/components/list";
import { ListItem } from "~/features/overview/list-item";

export const route = {
  preload: async () => ({
    highlight: await getEntry("14"),
    categories: await listCategories(),
    continue: await getContinueWatching("a9c51af84bf54578a99ab4dd0ebf0763"),
  }),
};

export default function Home() {
  const highlight = createAsync(() => getEntry("14"));
  const categories = createAsync(() => listCategories());
  const continueWatching = createAsync(() =>
    getContinueWatching("a9c51af84bf54578a99ab4dd0ebf0763"),
  );

  return (
    <>
      <Title>Home</Title>

      <Show when={continueWatching()}>{
        entries => <List label="Continue watching" items={entries()}>
          {(item) => <ListItem entry={item()} />}
        </List>
      }</Show>

      <Show when={highlight() && categories()}>
        <Overview highlight={highlight()!} categories={categories()!} />
      </Show>
    </>
  );
}
