import {
  createAsync,
  json,
  Params,
  query,
  redirect,
  RouteDefinition,
  useParams,
} from "@solidjs/router";
import { Show } from "solid-js";
import { Details } from "~/components/details";
import { createSlug, Entry, getEntry } from "~/features/content";

const healUrl = async (slug: string, entry: Entry) => {
  const actualSlug = createSlug(entry);

  if (slug !== actualSlug) {
    // Not entirely sure a permanent redirect is what we want in this case
    throw redirect(`/details/${actualSlug}`, { status: 308 });
  }
};

interface ItemParams extends Params {
  slug: string;
}

export const route = {
  async preload({ params }) {
    const slug = params.slug;

    if (!slug) {
      return;
    }

    const entry = await getEntry(slug.slice(slug.lastIndexOf("-") + 1));

    if (entry === undefined) {
      return json(null, { status: 404 });
    }

    healUrl(slug, entry);

    return entry;
  },
} satisfies RouteDefinition;

export default function Item() {
  const { slug } = useParams<ItemParams>();
  const id = slug.slice(slug.lastIndexOf("-") + 1);
  const entry = createAsync(() => getEntry(id));

  return (
    <>
      <Show when={entry()} fallback="Some kind of pretty 404 page I guess">{
        entry => <Details entry={entry()} />
      }</Show>
    </>
  );
}
