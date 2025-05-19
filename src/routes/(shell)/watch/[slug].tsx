import {
  createAsync,
  json,
  Params,
  query,
  redirect,
  RouteDefinition,
  useParams,
} from "@solidjs/router";
import { createSlug, getEntry } from "~/features/content";
import { Player } from "~/features/player";

const healUrl = query(async (slug: string) => {
  const entry = await getEntry(slug.slice(slug.lastIndexOf("-") + 1));

  if (entry === undefined) {
    return json(null, { status: 404 });
  }

  const actualSlug = createSlug(entry);

  if (slug === actualSlug) {
    return;
  }

  // Not entirely sure a permanent redirect is what we want in this case
  throw redirect(`/watch/${actualSlug}`, { status: 308 });
}, "watch.heal");

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

    return getEntry(slug.slice(slug.lastIndexOf("-") + 1));
  },
} satisfies RouteDefinition;

export default function Item() {
  const { slug } = useParams<ItemParams>();
  const id = slug.slice(slug.lastIndexOf("-") + 1);
  const entry = createAsync(() => getEntry(id));

  return (
    <>
      <Player entry={entry} />
    </>
  );
}
