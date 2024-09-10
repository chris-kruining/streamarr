import { Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { createEffect } from "solid-js";
import { Overview } from '~/features/overview';
import { listCategories, getEntry } from "~/features/content";

export const route = {
  load: () => listCategories(),
};

export default function Index() {
  const highlight = createAsync(() => getEntry(14));
  const categories = createAsync(() => listCategories());

  const title = 'Shows';
  return <>
    <Title>{ title }</Title>
    <Overview highlight={highlight()} categories={categories()}></Overview>
  </>;
}
