
export interface Category {
  label: string;
  entries: Entry[];
}

export interface Entry {
  id: string;
  title: string;
  summary?: string;
  releaseDate?: string;
  sources?: Entry.Source[];
  thumbnail?: URL | string;
  image?: string;
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

