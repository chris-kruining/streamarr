import type { paths as v3Paths } from "./sonarr.v3.generated";
import type { paths as v5Paths } from "./sonarr.v5.generated";
import { query } from "@solidjs/router";
import createClient from "openapi-fetch";

const getBaseUrl = () => {
  "use server";

  return process.env.SONARR_BASE_URL;
};

const getQualityProfileId = () => {
  "use server";

  return process.env.SONARR_QUALITY_PROFILE_ID;
};

const getClient = () => {
  "use server";

  return createClient<v3Paths&v5Paths>({
    baseUrl: getBaseUrl(),
    headers: {
      "X-Api-Key": `${process.env.SONARR_API_KEY}`,
      "Content-Type": 'application/json;',
    },
  });
};

const isConfigured = () => {
  "use server";

  return Boolean(getBaseUrl() && process.env.SONARR_API_KEY);
};

export const TEST = query(async () => {
  "use server";

  if (!isConfigured()) {
    return [];
  }

  const { data } = await getClient().GET('/api/v3/series', {
    params: {
      query: {
      }
    }
  });

  return data;
}, 'sonarr.TEST');

export const getByTmdbId = query(async (id: string) => {
  "use server";

  if (!isConfigured()) {
    return;
  }

  const { data } = await getClient().GET('/api/v3/series/lookup', {
    params: {
      query: {
        term: `tmdb:${id}`
      }
    }
  });

  return data?.[0];
}, 'sonarr.getByTmdbId');

export const listIds = query(async () => {
  "use server";

  if (!isConfigured()) {
    return {};
  }

  const { data, error } = await getClient().GET('/api/v3/series');

  return Object.fromEntries(data?.map(({ id, tmdbId }) => ([ `s${tmdbId}`, { sonarr: id } ] as const)) ?? []);
}, 'sonarr.listIds');

export const addSeries = query(async (id: string) => {
  "use server";

  if (!isConfigured()) {
    return;
  }

  // const { data, error } = await getClient().POST('/api/v3/series', {
  //   body: {
        
  //   },
  // });

  return;
}, 'sonarr.add');