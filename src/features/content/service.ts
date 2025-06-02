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

const jellyfinUserId = "a9c51af84bf54578a99ab4dd0ebf0763";

const lookupTable = query(async () => listItemIds(), 'content.lookupTable');

export const getHighlights = () => getContinueWatching(jellyfinUserId);
export const getStream = query(async (type: Entry['type'], id: string, range: string) => {
  const table = await lookupTable();

  return getItemStream(table[`${type}-${id}`].jellyfin, range);
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
    const { type, id } = slug.match(/^.+-(?<type>\w+)-(?<id>\w+)$/)?.groups ?? {};

    return getTmdbEntry(type as any, id);
  },
  "content.getFromSlug",
);

export const getEntry = query(
  async (type: Entry['type'], id: Entry["id"]): Promise<Entry | undefined> => {
    return getTmdbEntry(type, id);
  },
  "content.get",
);

export const search = query(async (query: string, page: number = 1) => {
  "use server";
  return searchMulti(query, page);
}, 'content.search');

export { listUsers, getContinueWatching, listItems } from "./apis/jellyfin";
