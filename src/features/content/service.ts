"use server";

import type { Category, Entry } from "./types";
import { query } from "@solidjs/router";
import { entries } from "./data";
import { getContinueWatching, getItem, getRandomItems } from "./apis/jellyfin";
import {
  getDiscovery,
  getRecommendations,
  getEntry as getTmdbEntry,
} from "./apis/tmdb";

const jellyfinUserId = "a9c51af84bf54578a99ab4dd0ebf0763";

// export const getHighlights = () => getRandomItems(jellyfinUserId);
export const getHighlights = () => getContinueWatching(jellyfinUserId);

export const listCategories = query(async (): Promise<Category[]> => {
  return [
    // { label: "Continue", entries: await getContinueWatching(jellyfinUserId) },
    {
      label: "Recommendations (For you?)",
      entries: await getRecommendations(),
    },
    { label: "Discover", entries: await getDiscovery() },
    { label: "Random", entries: await getRandomItems(jellyfinUserId) },
  ];
}, "series.categories.list");

export const getEntry = query(
  async (id: Entry["id"]): Promise<Entry | undefined> => {
    return getTmdbEntry(id);
    // return getItem(jellyfinUserId, id);
  },
  "series.get",
);

export { listUsers, getContinueWatching, listItems } from "./apis/jellyfin";
