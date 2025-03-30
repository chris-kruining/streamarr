import { Title } from '@solidjs/meta';
import { createAsync } from '@solidjs/router';
import { Overview } from '~/features/overview';
import { listCategories, getEntry } from '~/features/content';
import { Show } from 'solid-js';

export const route = {
  load: () => ({
    highlight: getEntry(14),
    categories: listCategories(),
  }),
};

export default function Home() {
  const highlight = createAsync(() => getEntry(14));
  const categories = createAsync(() => listCategories());

  console.log('page', highlight()?.id, categories?.length);

  return (
    <>
      <Title>Home</Title>

      <Show when={highlight() && categories()}>
        <Overview highlight={highlight()} categories={categories()} />
      </Show>
    </>
  );
}
