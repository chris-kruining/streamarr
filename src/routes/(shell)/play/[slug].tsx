import {
  createAsync,
  json,
  Params,
  query,
  redirect,
  RouteDefinition,
  useParams,
} from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import { createSlug, getEntryFromSlug } from "~/features/content";
import { Player } from "~/features/player";
import { Title } from "@solidjs/meta";
import css from "./slug.module.css";

const healUrl = query(async (slug: string) => {
  const entry = await getEntryFromSlug(slug);

  if (entry === undefined) {
    return json(null, { status: 404 });
  }

  const actualSlug = createSlug(entry);

  if (slug === actualSlug) {
    return;
  }

  // Not entirely sure a permanent redirect is what we want in this case
  throw redirect(`/play/${actualSlug}`, { status: 308 });
}, "play.heal");

interface ItemParams extends Params {
  slug: string;
}

export const route = {
  async preload({ params }) {
    const slug = params.slug;

    if (!slug) {
      return;
    }

    await healUrl(slug);

    return getEntryFromSlug(slug);
  },
} satisfies RouteDefinition;

export default function Item() {
  const { slug } = useParams<ItemParams>();
  const entry = createAsync(() => getEntryFromSlug(slug));

  return (
    <div class={css.page}>
      <Show when={entry()} fallback="Some kind of pretty 404 page I guess">
        {(entry) => (
          <>
            <Title>{entry().title}</Title>
            <Player entry={entry()} />
          </>
        )}
      </Show>
    </div>
  );
}
