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

export type PlayerTrackAvailability = "selected" | "available" | "unavailable";

export interface PlayerTrackOption {
  id: string;
  index: number;
  label: string;
  language?: string;
  codec?: string;
  default: boolean;
  forced?: boolean;
  availability: PlayerTrackAvailability;
  reason?: string;
  url?: string;
}

export interface PlayerTimelineMarker {
  id: string;
  type: "chapter" | "segment" | "buffered";
  label: string;
  start: number;
  end?: number;
}

export interface PlayerContextualAction {
  id: string;
  type: "skip-intro" | "skip-recap" | "skip-outro" | "next-item";
  label: string;
  start: number;
  end: number;
  seekTo?: number;
  itemId?: string;
}

export interface PlayerAdjacentItem {
  id: string;
  title: string;
  streamUrl: string;
  resumeOffset: number;
}

export interface PlayerPreviewTileMetadata {
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  thumbnailCount: number;
  interval: number;
  tileUrl: string;
}

export interface PlayerMetadata {
  id: string;
  entryId: string;
  jellyfinItemId: string;
  mediaSourceId?: string;
  title: string;
  poster?: string;
  streamUrl: string;
  resumeOffset: number;
  duration: number;
  directPlay: {
    supported: boolean;
    container?: string;
    videoCodec?: string;
    audioCodec?: string;
    audioChannels?: number;
    width?: number;
    height?: number;
    reasons: string[];
  };
  audioTracks: PlayerTrackOption[];
  subtitleTracks: PlayerTrackOption[];
  preview?: PlayerPreviewTileMetadata;
  previous?: PlayerAdjacentItem;
  next?: PlayerAdjacentItem;
  markers: PlayerTimelineMarker[];
  contextualActions: PlayerContextualAction[];
}
