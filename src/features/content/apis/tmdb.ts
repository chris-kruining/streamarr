"use server";

import createClient from "openapi-fetch";
import { query } from "@solidjs/router";
import { Entry } from "../types";
import { paths } from "./tmdb.not.generated";

const baseUrl = process.env.TMDB_BASE_URL;
const client = createClient<paths>({
  baseUrl,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    "Content-Type": "application/json;",
  },
});

export const getEntry = query(
  async (id: string): Promise<Entry | undefined> => {
    const { data } = await client.GET("/3/movie/{movie_id}", {
      params: {
        path: {
          movie_id: id,
        },
      },
    });

    if (data === undefined) {
      return undefined;
    }

    return {
      id: String(data.id),
      title: data.title,
      overview: data.overview,
      thumbnail: `http://image.tmdb.org/t/p/w342${data.poster_path}`,
      image: `http://image.tmdb.org/t/p/original${data.backdrop_path}`,
    };
  },
  "tmdb.getEntry",
);

export const getRecommendations = query(async (): Promise<Entry[]> => {
  const account_object_id = "6668b76e419b28ec1a1c5aab";

  const { data } = await client.GET(
    "/4/account/{account_object_id}/movie/recommendations",
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
      id: String(id),
      title,
      overview,
      thumbnail: `http://image.tmdb.org/t/p/w342${poster_path}`,
      image: `http://image.tmdb.org/t/p/original${backdrop_path}`,
    }),
  );
}, "tmdb.getRecommendations");

export const getDiscovery = query(async (): Promise<Entry[]> => {
  const [{ data: movies }, { data: series }] = await Promise.all([
    client.GET("/3/discover/movie"),
    client.GET("/3/discover/movie"),
  ]);

  if (movies === undefined || series === undefined) {
    return [];
  }

  // console.log({ movies: movies.results.length, series: series.results.length });

  return movies?.results
    .slice(0, 9)
    .concat(series?.results.slice(0, 9))
    .map(({ id, title, overview, poster_path, backdrop_path }) => ({
      id: String(id),
      title,
      overview,
      thumbnail: `http://image.tmdb.org/t/p/w342${poster_path}`,
      image: `http://image.tmdb.org/t/p/original${backdrop_path}`,
    }));
}, "tmdb.getDiscovery");
