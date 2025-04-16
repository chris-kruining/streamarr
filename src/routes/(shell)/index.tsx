import { Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { Overview } from "~/features/overview";
import {
  listCategories,
  getEntry,
  getContinueWatching,
} from "~/features/content";
import { Show } from "solid-js";
import css from "./index.module.css";

export const route = {
  preload: async () => ({
    highlight: await getEntry("14"),
    categories: await listCategories(),
  }),
};

export default function Home() {
  const highlight = createAsync(() => getEntry("14"));
  const categories = createAsync(() => listCategories());

  return (
    <>
      <Title>Home</Title>

      {/* <div class={css.carousel}>
        <header>some category</header>

        <ul>
          <li>
            <figure>
              <img src="https://assets.codepen.io/2585/1.jpg" alt="Item 1" />
            </figure>
          </li>
          <li>
            <figure>
              <img src="https://assets.codepen.io/2585/2.avif" alt="Item 2" />
            </figure>
          </li>
          <li>
            <figure>
              <img src="https://assets.codepen.io/2585/3.avif" alt="Item 3" />
            </figure>
          </li>
          <li>
            <figure>
              <img src="https://assets.codepen.io/2585/4.avif" alt="Item 4" />
            </figure>
          </li>
          <li>
            <figure>
              <img src="https://assets.codepen.io/2585/5.avif" alt="Item 5" />
            </figure>
          </li>
          <li>
            <figure>
              <img src="https://assets.codepen.io/2585/6.avif" alt="Item 6" />
            </figure>
          </li>
          <li>
            <figure>
              <img src="https://assets.codepen.io/2585/7.avif" alt="Item 7" />
            </figure>
          </li>
          <li>
            <figure>
              <img src="https://assets.codepen.io/2585/8.avif" alt="Item 8" />
            </figure>
          </li>
          <li>
            <figure>
              <img src="https://assets.codepen.io/2585/9.avif" alt="Item 9" />
            </figure>
          </li>
        </ul>
      </div> */}

      <Show when={highlight() && categories()}>
        <Overview highlight={highlight()!} categories={categories()!} />
      </Show>
    </>
  );
}
