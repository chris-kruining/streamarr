"use server";

import type { Category, Entry } from "./types";
import { query } from "@solidjs/router";
import { listItemIds, getContinueWatching, getItemStream, getRandomItems } from "./apis/jellyfin";
import {
  getDiscovery,
  getRecommendations,
  getEntry as getTmdbEntry,
  searchMulti,
} from "./apis/tmdb";
import { listIds as listSerieIds } from "./apis/sonarr";
import { listIds as listMovieIds } from "./apis/radarr";
import { merge } from "~/utilities";

const jellyfinUserId = "a9c51af84bf54578a99ab4dd0ebf0763";

const lookupTable = query(async () => {
  'use server';
  const [items, sonarr, radarr] = await Promise.all([
    listItemIds(), listSerieIds(), listMovieIds() ]);

  return merge(items, sonarr, radarr);
}, 'content.lookupTable');

export const getHighlights = () => getContinueWatching(jellyfinUserId);
export const getStream = query(async (id: string, range: string) => {
    const table = await lookupTable();
    const ids = table[id];

    if (ids.jellyfin) {
      return getItemStream(ids.jellyfin, range);
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
    console.log(ids);
    
}, 'content.stream');

export const listCategories = query(async (): Promise<Category[]> => {
  return [
    // { label: "Continue", entries: await getContinueWatching(jellyfinUserId) },
    {
      label: "For you",
      entries: await getRecommendations(),
    },
    { label: "Discover", entries: await getDiscovery() },
    { label: "Random", entries: await getRandomItems(jellyfinUserId) },
  ];
}, "content.categories.list");

export const getEntryFromSlug = query(
  async (slug: string): Promise<Entry | undefined> => {
    const id = slug.match(/\w+$/)![0];

    return getTmdbEntry(id);
  },
  "content.getFromSlug",
);

export const getEntry = query(
  async (id: Entry["id"]): Promise<Entry | undefined> => {
    return getTmdbEntry(id);
  },
  "content.get",
);

export const search = query(async (query: string, page: number = 1) => {
  "use server";
  return searchMulti(query, page);
}, 'content.search');

export { listUsers, getContinueWatching, listItems } from "./apis/jellyfin";
