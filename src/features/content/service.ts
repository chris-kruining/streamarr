import type { Category, Entry } from "./types";
import { query, revalidate } from "@solidjs/router";
import { getAuthSession } from "~/auth.server";
import { getRequestEvent } from "solid-js/web";
import { listItemIds, getContinueWatching, getItemStream, getRandomItems, getItemUserData, getLinkedUserId } from "./apis/jellyfin";
import {
  getDiscovery,
  getRecommendations,
  getEntry as getTmdbEntry,
  searchMulti,
} from "./apis/tmdb";
import { listIds as listSerieIds, addSeries } from "./apis/sonarr";
import { listIds as listMovieIds, addMovie, TEST } from "./apis/radarr";
import { merge } from "~/utilities";

const getJellyfinUserId = async () => {
  "use server";

  const event = getRequestEvent();

  if (!event) {
    return undefined;
  }

  const session = await getAuthSession(event.request);
  const username = session?.user.username?.trim();

  return username ? getLinkedUserId(username) : undefined;
};

const lookupTable = query(async () => {
  'use server';
  const [items, sonarr, radarr] = await Promise.all([
    listItemIds(), listSerieIds(), listMovieIds() ]);

  return merge(items, sonarr, radarr);
}, 'content.lookupTable');

export const getHighlights = query(async () => {
  'use server';

  const jellyfinUserId = await getJellyfinUserId();

  return jellyfinUserId ? getContinueWatching(jellyfinUserId) : [];
}, "content.highlights");

export const getStream = query(async (id: string, range: string) => {
  'use server';

  const table = await lookupTable();
  const ids = table[id];
  const manager = id[0] === 'm' ? 'radarr' : 'sonarr'
  const jellyfinUserId = await getJellyfinUserId();

  if (ids?.jellyfin) {
    if (!jellyfinUserId) {
      return new Response("Sign in required", { status: 401 });
    }

    return getItemStream(jellyfinUserId, ids.jellyfin, range);
  }

  if (ids?.radarr) {
    console.log(`radarr has the entry '${ids.radarr}', but jellyfin does not (yet) have the file`);
    console.log(await TEST(ids.radarr))
    return;
  }

  if (ids?.sonarr) {
    console.log('sonarr has the entry, but jellyfin does not (yet) have the file');
    return;
  }

  // - If the lookup table has no entry
  //   than this means that we do not have the requested entry at all, 
  //   neither in trackers nor in the media server
  // 
  // - If the lookup table contains a jellyfin id,
  //   than we have the content and can stream straight away
  // 
  // - If we have the radarr or sonarr id,
  //   than we are tracking the entry,
  //   but it is not available for use yet
  console.log(`request the item '${id}' at ${manager}`);

  const res = await ((manager === 'radarr' ? addMovie : addSeries)(id.slice(1)));

  revalidate(lookupTable.keyFor());
}, 'content.stream');

export const listCategories = query(async (): Promise<Category[]> => {
  'use server';

  const jellyfinUserId = await getJellyfinUserId();

  return [
    // { label: "Continue", entries: await getContinueWatching(jellyfinUserId) },
    {
      label: "For you",
      entries: await getRecommendations(),
    },
    { label: "Discover", entries: await getDiscovery() },
    { label: "Random", entries: jellyfinUserId ? await getRandomItems(jellyfinUserId) : [] },
  ];
}, "content.categories.list");

export const getEntryFromSlug = query(
  async (slug: string): Promise<Entry | undefined> => {
    'use server';

    return getEntry(slug.match(/\w+$/)![0]);
  },
  "content.getFromSlug",
);

export const getEntry = query(
  async (id: Entry["id"]): Promise<Entry | undefined> => {
    'use server';

    const [entry, userData] = await Promise.all([
      getTmdbEntry(id),
      getEntryUserData(id)
    ] as const);

    if (entry !== undefined && userData !== undefined) {
      entry['offset'] = ticksToSeconds(userData.playbackPositionTicks ?? 0);
    }
    
    return entry;
  },
  "content.get",
);

export const getEntryUserData = query(
  async (id: string): ReturnType<typeof getItemUserData> => {
    'use server';

    const table = await lookupTable();
    const { jellyfin } = table[id] ?? {};
    const jellyfinUserId = await getJellyfinUserId();

    if (!jellyfin || !jellyfinUserId) {
      return;
    }

    const userData = await getItemUserData(jellyfinUserId, jellyfin);

    return userData;
  },
  "content.getFromSlug",
);

export const search = query(async (query: string, page: number = 1) => {
  "use server";
  return searchMulti(query, page);
}, 'content.search');

export { getContinueWatching, listItems } from "./apis/jellyfin";

// 1s = 10_000_000 ticks
const ticksToSeconds = (ticks: number) => ticks / 10_000_000;