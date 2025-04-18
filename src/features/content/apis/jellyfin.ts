import createClient from "openapi-fetch";
import type { paths, components } from "./jellyfin.generated"; // generated by openapi-typescript
import { query } from "@solidjs/router";
import { Entry } from "../types";

// ===============================
'use server';
// ===============================

type ItemImageType = "Primary" | "Art" | "Backdrop" | "Banner" | "Logo" | "Thumb" | "Disc" | "Box" | "Screenshot" | "Menu" | "Chapter" | "BoxRear" | "Profile";

const baseUrl = process.env.JELLYFIN_BASE_URL;
const client = createClient<paths>({
  baseUrl,
  headers: {
    'Authorization': `MediaBrowser DeviceId="Streamarr", Token="${process.env.JELLYFIN_API_KEY}"`,
    'Content-Type': 'application/json; profile="CamelCase"',
  },
});

export const TEST = query(async () => {
  const userId = "a9c51af84bf54578a99ab4dd0ebf0763";
  const itemId = "919dfa97e4dad2758a925d056e590a28";
  const seriesId = "5230ddbcd9400733dc07e5b8cb7a4f49";

  const { data: seriesData } = await client.GET("/UserItems/{itemId}/UserData", {
    params: {
      path: { itemId: seriesId },
      query: { userId }
    }
  });

  const { data: epData } = await client.GET("/UserItems/{itemId}/UserData", {
    params: {
      path: { itemId },
      query: { userId }
    }
  });

  console.log(seriesData, epData)
}, "jellyfin.TEST");

export const getCurrentUser = query(async () => {
  const { data, error, response } = await client.GET("/Users/Public", {
    params: {},
  });

  console.log(data, error, response)

  return data;
}, "jellyfin.getCurrentUser");

export const listUsers = query(async () => {
  const { data, error } = await client.GET("/Users", {
    params: {},
  });

  return data ?? [];
}, "jellyfin.listUsers");

export const getItem = query(async (userId: string, itemId: string): Promise<Entry | undefined> => {
  const { data, error } = await client.GET("/Items/{itemId}", {
    params: {
      path: {
        itemId,
      },
      query: {
        userId,
        hasTmdbInfo: true,
        recursive: true,
        includeItemTypes: ["Movie", "Series"],
        fields: [
          "ProviderIds",
          "Genres",
          "DateLastMediaAdded",
          "DateCreated",
          "MediaSources",
        ],
      },
    },
  });

  if (data === undefined) {
    return undefined;
  }

  return {
    id: data.Id!,
    title: data.Name!,
    thumbnail: new URL(`/Items/${itemId}/Images/Primary`, baseUrl), //await getItemImage(data.Id!, 'Primary'),
  };
}, "jellyfin.getItem");

export const getItemImage = query(async (itemId: string, imageType: ItemImageType): Promise<any | undefined> => {
  const { data, error } = await client.GET("/Items/{itemId}/Images/{imageType}", {
    parseAs: 'blob',
    params: {
      path: {
        itemId,
        imageType
      },
      query: {
      },
    },
  });

  return data;
}, "jellyfin.getItemImage");

export const getItemPlaybackInfo = query(async (userId: string, itemId: string): Promise<any | undefined> => {
  const { data, error, response } = await client.GET("/Items/{itemId}/PlaybackInfo", {
    parseAs: 'text',

    params: {
      path: {
        itemId,
      },
      query: {
        userId,
      },
    },
  });

  return undefined;
}, "jellyfin.getItemPlaybackInfo");

export const queryItems = query(async () => {
  const { data, error } = await client.GET("/Items", {
    params: {
      query: {
        mediaTypes: ["Video"],
        isUnaired: true,
        limit: 10,
        // fields: ["ProviderIds", "Genres"],
        includeItemTypes: ["Series", "Movie"],
        recursive: true,
      },
    },
  });

  console.log(data);

}, 'jellyfin.queryItems');

export const getContinueWatching = query(
  async (userId: string): Promise<Entry[]> => {
    const { data, error } = await client.GET("/UserItems/Resume", {
      params: {
        query: {
          userId,
          mediaTypes: ["Video"],
          // fields: ["ProviderIds", "Genres"],
          // includeItemTypes: ["Series", "Movie"]
        },
      },
    });

    if (Array.isArray(data?.Items) !== true) {
      return [];
    }

    const uniqueIds = new Set<string>(data.Items.map(item => item.Type === 'Episode' ? item.SeriesId! : 'MOVIE_ID'));
    const results = await Promise.allSettled(uniqueIds.values().map(id => getItem(userId, id)).toArray());

    assertNoErrors(results);

    return results.filter((result): result is PromiseFulfilledResult<Entry> => result.value !== undefined).map(({ value }) => value);
  },
  "jellyfin.continueWatching",
);

function assertNoErrors<T>(results: PromiseSettledResult<T>[]): asserts results is PromiseFulfilledResult<T>[] {
  if (results.some(({ status }) => status !== 'fulfilled')) {
    throw new Error('one or more promices failed', { cause: results.filter((r): r is PromiseRejectedResult => r.status === 'rejected').map(r => r.reason) });
  }
}