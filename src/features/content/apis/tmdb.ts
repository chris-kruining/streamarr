import createClient from "openapi-fetch";
import { query } from "@solidjs/router";
import { Entry, SearchResult } from "../types";
import { paths as pathsV3 } from "./tmdb.generated";
import { paths as pathsV4 } from "./tmdb.not.generated";

const getClients = () => {
  "use server";

  const baseUrl = process.env.TMDB_BASE_URL;
  const clientV3 = createClient<pathsV3>({
    baseUrl: `${baseUrl}/3`,
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      "Content-Type": "application/json;",
    },
  });

  const clientV4 = createClient<pathsV4>({
    baseUrl: `${baseUrl}/4`,
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      "Content-Type": "application/json;",
    },
  });

  return [clientV3, clientV4] as const;
};

export const getEntry = query(
  async (type: Entry['type'], id: string): Promise<Entry | undefined> => {
    "use server";

    const [ clientV3 ] = getClients();

    const endpoint = ({
      movie: "/movie/{movie_id}",
      tv: '/tv/{series_id}',
    } as const)[type];

    const params = ({
      movie: { movie_id: Number.parseInt(id) },
      tv: { series_id: Number.parseInt(id) },
    } as const)[type];

    const { data } = await clientV3.GET(endpoint, {
      params: {
        path: params,
      },
    });

    if (data === undefined) {
      return undefined;
    }

    return {
      type,
      id: String(data.id ?? -1),
      title: data.title!,
      overview: data.overview,
      thumbnail: `http://image.tmdb.org/t/p/w342${data.poster_path}`,
      image: `http://image.tmdb.org/t/p/original${data.backdrop_path}`,
    };
  },
  "tmdb.getEntry",
);

export const getRecommendations = query(async (): Promise<Entry[]> => {
  "use server";

  const [ ,clientV4 ] = getClients();

  const account_object_id = "6668b76e419b28ec1a1c5aab";

  const { data } = await clientV4.GET(
    "/account/{account_object_id}/movie/recommendations",
    {
      params: {
        path: { account_object_id },
      },
    },
  );

  if (data === null) {
    return [];
  }

  return data?.results.map(
    ({ id, title, overview, poster_path, backdrop_path }) => ({
      type: 'movie',
      id: String(id ?? -1),
      title: title!,
      overview,
      thumbnail: `http://image.tmdb.org/t/p/w342${poster_path}`,
      image: `http://image.tmdb.org/t/p/original${backdrop_path}`,
    }),
  );
}, "tmdb.getRecommendations");

export const getDiscovery = query(async (): Promise<Entry[]> => {
  "use server";

    const [ clientV3 ] = getClients();

  const [{ data: movies }, { data: series }] = await Promise.all([
    clientV3.GET("/discover/movie"),
    clientV3.GET("/discover/tv"),
  ]);

  if (movies === undefined || series === undefined) {
    return [];
  }

  const movieEntries = movies?.results?.slice(0, 10)
    .map(({ id, title, overview, poster_path, backdrop_path }): Entry => ({
      type: 'movie',
      id: String(id ?? -1),
      title: title!,
      overview,
      thumbnail: `http://image.tmdb.org/t/p/w342${poster_path}`,
      image: `http://image.tmdb.org/t/p/original${backdrop_path}`,
    })) ?? []

  const seriesEntries = series?.results?.slice(0, 10)
    .map(({ id, name, overview, poster_path, backdrop_path }): Entry => ({
      type: 'tv',
      id: String(id ?? -1),
      title: name!,
      overview,
      thumbnail: `http://image.tmdb.org/t/p/w342${poster_path}`,
      image: `http://image.tmdb.org/t/p/original${backdrop_path}`,
    })) ?? []

  return movieEntries.concat(seriesEntries);
}, "tmdb.getDiscovery");

export const searchMulti = query(async (query: string, page: number = 1): Promise<SearchResult> => {
  "use server";

  if (query.length === 0) {
    return { count: 0, pages: 0, results: [] };
  }
    const [ clientV3 ] = getClients();


  const { data } = await clientV3.GET("/search/multi", {
    params: {
      query: {
        query,
        page,
        include_adult: false,
        language: 'en-US',
      }
    }
  });

  if (data === undefined) {
    return { count: 0, pages: 0, results: [] };
  }

  console.log(`loaded page ${page}, found ${data.results?.length} results`);
  console.log(data.results[0]);

  return { count: data.total_results!, pages: data.total_pages!, results: data.results?.filter(({ media_type }) => media_type === 'movie' || media_type === 'tv').map(({ id, name, title, media_type, overview, backdrop_path, poster_path }): Entry => ({
    type: ({
      movie: 'movie',
      tv: 'tv',
    }[media_type ?? '']) as any,
    id: String(id),
    title: `${name ?? title ?? ''} (${media_type})`,
    overview,
    thumbnail: `http://image.tmdb.org/t/p/w342${poster_path}`,
    image: `http://image.tmdb.org/t/p/original${backdrop_path}`,
  })) ?? [] };
}, "tmdb.search.multi");