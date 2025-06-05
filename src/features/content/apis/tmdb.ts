import createClient from "openapi-fetch";
import { query } from "@solidjs/router";
import { Entry, SearchResult } from "../types";
import { paths as pathsV3, operations } from "./tmdb.generated";
import { paths as pathsV4 } from "./tmdb.not.generated";

interface TMDBItem {
  id: number;
  media_type: string;
  name?: string;
  title?: string;
  overview?: string;
  backdrop_path?: string;
  poster_path?: string;
}

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
  async (id: string): Promise<Entry | undefined> => {
    "use server";

    const [ clientV3 ] = getClients();

    const mediaType = ({
      m: 'movie',
      s: 'tv',
    } as const)[id[0]]!;

    const endpoint = ({
      movie: "/movie/{movie_id}",
      tv: '/tv/{series_id}',
    } as const)[mediaType];

    const params = ({
      movie: { movie_id: Number.parseInt(id.slice(1)) },
      tv: { series_id: Number.parseInt(id.slice(1)) },
    } as const)[mediaType];

    console.log(`going to fetch from '${endpoint}' with id '${id}'`)

    const { data } = await clientV3.GET(endpoint, {
      params: {
        path: params,
      },
    });

    if (data === undefined) {
      return undefined;
    }

    return toEntry(data as any, mediaType);
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

  return data?.results.map((item) => toEntry(item));
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

  const movieEntries = movies?.results?.slice(0, 10).map((item): Entry => toEntry(item)) ?? []
  const seriesEntries = series?.results?.slice(0, 10).map((item): Entry => toEntry(item)) ?? []

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

  return { count: data.total_results!, pages: data.total_pages!, results: data.results?.filter(({ media_type }) => media_type === 'movie' || media_type === 'tv').map((item): Entry => toEntry(item)) ?? [] };
}, "tmdb.search.multi");

function toEntry(item: TMDBItem): Entry;
function toEntry(item: Omit<TMDBItem, 'media_type'>, mediaType: string): Entry;

function toEntry({ id, name, title, overview, media_type = '', backdrop_path, poster_path }: TMDBItem | Omit<TMDBItem, 'media_type'>, mediaType?: string): Entry {
  const type = ({
      movie: 'm',
      tv: 's',
    }[(mediaType ?? media_type) as string]);

  return ({
    id: `${type}${String(id ?? -1)}`,
    title: `${name ?? title ?? ''}`,
    overview,
    thumbnail: `http://image.tmdb.org/t/p/w342${poster_path}`,
    image: `http://image.tmdb.org/t/p/original${backdrop_path}`,
  });
};