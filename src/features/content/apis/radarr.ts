import type { paths } from "./radarr.generated";
import { query } from "@solidjs/router";
import createClient from "openapi-fetch";

const getBaseUrl = () => {
  "use server";

  return process.env.RADARR_BASE_URL;
};

const getClient = () => {
  "use server";

  return createClient<paths>({
    baseUrl: getBaseUrl(),
    headers: {
      "X-Api-Key": `${process.env.RADARR_API_KEY}`,
      "Content-Type": 'application/json;',
    },
  });
};

export const get = query(async () => {
  "use server";

  const { data, error } = await getClient().GET('/api/v3/movie');

  return data;
}, 'radarr.get');

export const addMovie = query(async (id: string) => {
  "use server";

  const { data, error } = await getClient().POST('/api/v3/movie', {
    body: {
        
    },
  });

  return data;
}, 'radarr.get');

export const listIds = query(async () => {
  "use server";

  const { data, error } = await getClient().GET('/api/v3/movie');

  return Object.fromEntries(data?.map(({ id, tmdbId }) => ([ `m${tmdbId}`, { radarr: id } ] as const)) ?? []);
}, 'radarr.listIds');