import {
  json,
  Params,
  query,
  redirect,
  RouteDefinition,
  useParams,
} from "@solidjs/router";
import { createSlug, getEntry } from "~/features/content";
import { Player } from "~/features/player";
import { toSlug } from "~/utilities";

const healUrl = query(async (slug: string) => {
  const entry = await getEntry(slug.slice(slug.lastIndexOf("-") + 1));

  if (entry === undefined) {
    return json(null, { status: 404 });
  }

  const actualSlug = createSlug(entry);

  if (slug === actualSlug) {
    return;
  }

  throw redirect(`/watch/${actualSlug}`);
}, "watch.heal");

interface ItemParams extends Params {
  slug: string;
}

export const route = {
  async preload({ params }) {
    await healUrl(params.slug);
  },
} satisfies RouteDefinition;

export default function Item() {
  const { slug } = useParams<ItemParams>();
  const id = slug.slice(slug.lastIndexOf("-") + 1);

  return (
    <>
      <Player id={id} />
    </>
  );
}
