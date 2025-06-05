export interface Category {
  label: string;
  entries: Entry[];
}

export interface Entry {
  id: string;
  title: string;
  overview?: string;
  releaseDate?: string;
  sources?: Entry.Source[];
  thumbnail?: URL | string;
  image?: URL | string;

  [prop: string]: any;
}

export namespace Entry {
  export interface Source {
    label: string;
    url: string;
    rating: Source.Rating;
  }

  export namespace Source {
    export interface Rating {
      score: number;
      max: number;
    }
  }
}

export interface SearchResult {
  count: number;
  pages: number;
  results: Entry[];
}
