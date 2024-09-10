
export interface Category {
  label: string;
  entries: Entry[];
}

export interface Entry {
  id: number;
  title: string;
  summary?: string;
  releaseDate?: string;
  sources?: Entry.Source[];
  thumbnail?: string;
  image?: string;
}

export namespace Entry {
  export interface Source {
    label: string;
    url: URL;
    rating: Source.Rating;
  }

  export namespace Source {
    export interface Rating {
      score: number;
      max: number;
    }
  }
}

