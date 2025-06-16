import type { paths } from "./radarr.generated";
import { query } from "@solidjs/router";
import createClient from "openapi-fetch";

const getBaseUrl = () => {
  "use server";

  return process.env.RADARR_BASE_URL;
};

const getQualityProfileId = () => {
  "use server";

  return Number.parseInt(process.env.RADARR_QUALITY_PROFILE_ID ?? '1');
};

export const getClient = () => {
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

  const { data: rootFolders, error: fError } = await getClient().GET('/api/v3/rootfolder');

  if (fError) {
    console.log(fError);
    return;
  }

  console.log(rootFolders);

  const { data, error } = await getClient().POST('/api/v3/movie', {
    body: { 
      tmdbId: Number.parseInt(id), 
      qualityProfileId: getQualityProfileId(), 
      path: '', 
      rootFolderPath: rootFolders?.[0].path, 
      monitored: true,
      addOptions: {
        searchForMovie: true,
      },
    },
  });

  if (error) {
    console.log(error);

    return;
  }

  console.log(data);

  return;
}, 'radarr.add');

export const listIds = query(async () => {
  "use server";

  const { data, error } = await getClient().GET('/api/v3/movie');

  return Object.fromEntries(data?.map(({ id, tmdbId }) => ([ `m${tmdbId}`, { radarr: id } ] as const)) ?? []);
}, 'radarr.listIds');