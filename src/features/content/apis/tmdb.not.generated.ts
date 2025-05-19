export interface paths {
  "/account/{account_object_id}/movie/recommendations": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["GetMovieRecommendations"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    paginatedQueryResult: {
      page: number;
      results: components["schemas"]["entry"][];
      total_pages: number;
      total_results: number;
    };
    entry: {
      backdrop_path: string;
      id: number;
      title: string;
      overview: string;
      poster_path: string;
      media_type: string;
      adult: boolean;
      original_language: string;
      gerne_ids: number[];
      popularity: number;
      release_date: string;
      video: boolean;
      vote_average: number;
      vote_count: number;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  GetMovieRecommendations: {
    parameters: {
      query?: {
        page?: number;
        language?: string;
      };
      header?: never;
      path: {
        account_object_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["paginatedQueryResult"];
        };
      };
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  GetDiscovery_Movie: {
    parameters: {
      query?: {
        page?: number;
        language?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["paginatedQueryResult"];
        };
      };
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  GetDiscovery_Serie: {
    parameters: {
      query?: {
        page?: number;
        language?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["paginatedQueryResult"];
        };
      };
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  GetMovieById: {
    parameters: {
      query?: {};
      header?: never;
      path: {
        movie_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["entry"];
        };
      };
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  GetSeriesById: {
    parameters: {
      query?: {};
      header?: never;
      path: {
        series_id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["entry"];
        };
      };
      401: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      403: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
}
