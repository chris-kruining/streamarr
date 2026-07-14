import { isServer } from "solid-js/web";
import {
  ContextProviderProps,
  createContextProvider,
} from "@solid-primitives/context";
import { Accessor, createEffect, createMemo, onCleanup, Setter } from "solid-js";
import { createStore } from "solid-js/store";
import { createEventListenerMap } from "@solid-primitives/event-listener";
import { createFullscreen } from "@solid-primitives/fullscreen";
import type {
  PlayerContextualAction,
  PlayerMetadata,
  PlayerPreviewTileMetadata,
  PlayerTrackOption,
} from "../content";

type State = "playing" | "paused" | "ended";

type Volume = {
  value: number;
  muted: boolean;
};

export interface TimelinePreview {
  time: number;
  x: number;
  tileUrl?: string;
  tileIndex?: number;
  tileX?: number;
  tileY?: number;
  tileWidth?: number;
  tileHeight?: number;
}

export interface TimelineMarker {
  id: string;
  type: "chapter" | "segment" | "buffered";
  label: string;
  start: number;
  end?: number;
}

export interface VideoAPI {
  readonly metadata: Accessor<PlayerMetadata | undefined>;
  readonly fullscreen: Accessor<boolean>;
  readonly setFullscreen: Setter<boolean>;

  readonly loading: Accessor<boolean>;
  readonly buffering: Accessor<boolean>;
  readonly error: Accessor<string | undefined>;
  readonly duration: Accessor<number>;
  readonly buffered: Accessor<number>;
  readonly bufferedRanges: Accessor<TimelineMarker[]>;
  readonly currentTime: Accessor<number>;
  readonly preview: Accessor<TimelinePreview | undefined>;
  readonly feedback: Accessor<string | undefined>;
  readonly controlsVisible: Accessor<boolean>;
  readonly bottomPanelOpen: Accessor<boolean>;
  readonly settingsOpen: Accessor<boolean>;
  readonly activeActions: Accessor<PlayerContextualAction[]>;
  readonly selectedAudio: Accessor<string | undefined>;
  readonly selectedSubtitle: Accessor<string>;
  readonly playbackRate: Accessor<number>;

  setTime(time: number): void;
  seekBy(seconds: number): void;
  setPreview(time: number, x: number): void;
  clearPreview(): void;
  markPreviewError(): void;
  reportSubtitleError(label: string): void;
  showControls(reason?: "input" | "focus" | "panel" | "scrub" | "action"): void;
  hideControls(): void;
  setFocused(focused: boolean): void;
  setScrubbing(scrubbing: boolean): void;
  setSettingsOpen(open: boolean): void;
  setBottomPanelOpen(open: boolean): void;
  selectAudio(track: PlayerTrackOption): void;
  selectSubtitle(track: PlayerTrackOption): void;
  setPlaybackRate(rate: number): void;
  playItem(item: { id: string; streamUrl: string; resumeOffset?: number }): void;
  runAction(action: PlayerContextualAction): void;

  readonly state: {
    readonly state: Accessor<State>;
    readonly setState: Setter<State>;
    pause(): void;
    play(): void;
    replay(): void;
  };
  readonly volume: {
    readonly value: Accessor<number>;
    readonly muted: Accessor<boolean>;
    readonly setValue: Setter<number>;
    readonly setMuted: Setter<boolean>;
    unmute(): void;
    mute(): void;
  };
}

interface VideoProviderProps extends ContextProviderProps {
  root: HTMLElement | undefined;
  video: HTMLVideoElement | undefined;
  metadata?: PlayerMetadata;
  offset?: number;
}

interface VideoStore {
  fullscreen: boolean;
  loading: boolean;
  buffering: boolean;
  error?: string;
  duration: number;
  buffered: number;
  bufferedRanges: TimelineMarker[];
  currentTime: number;
  state: State;
  volume: Volume;
  preview?: TimelinePreview;
  feedback?: string;
  controlsVisible: boolean;
  focused: boolean;
  scrubbing: boolean;
  bottomPanelOpen: boolean;
  settingsOpen: boolean;
  selectedAudio?: string;
  selectedSubtitle: string;
  playbackRate: number;
}

const autoHideDelay = 2500;
const seekStep = 10;

export const [VideoProvider, useVideo] = createContextProvider<
  VideoAPI,
  VideoProviderProps
>(
  (props) => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
    const [store, setStore] = createStore<VideoStore>({
      fullscreen: false,
      loading: true,
      buffering: false,
      duration: props.metadata?.duration ?? 0,
      buffered: 0,
      bufferedRanges: [],
      currentTime: props.offset ?? props.metadata?.resumeOffset ?? 0,
      state: "paused",
      volume: {
        value: 0.8,
        muted: false,
      },
      controlsVisible: true,
      focused: false,
      scrubbing: false,
      bottomPanelOpen: false,
      settingsOpen: false,
      selectedAudio: props.metadata?.audioTracks.find((track) => track.availability === "selected")?.id,
      selectedSubtitle:
        props.metadata?.subtitleTracks.find((track) => track.availability === "selected")?.id ?? "off",
      playbackRate: 1,
    });
    const fullscreen = createFullscreen(
      () => props.root,
      () => store.fullscreen
    );
    const metadata = () => props.metadata;
    const activeActions = createMemo(() => {
      const currentTime = store.currentTime;

      return (
        props.metadata?.contextualActions.filter(
          (action) => currentTime >= action.start && currentTime <= action.end,
        ) ?? []
      );
    });
    const keepControlsVisible = () =>
      store.state !== "playing" ||
      store.focused ||
      store.scrubbing ||
      store.bottomPanelOpen ||
      store.settingsOpen ||
      activeActions().length > 0;
    const scheduleHide = () => {
      clearTimeout(hideTimer);

      if (keepControlsVisible()) {
        return;
      }

      hideTimer = setTimeout(() => setStore("controlsVisible", false), autoHideDelay);
    };
    const flash = (message: string) => {
      clearTimeout(feedbackTimer);
      setStore("feedback", message);
      feedbackTimer = setTimeout(() => setStore("feedback", undefined), 1200);
    };
    const syncBuffered = () => {
      const video = props.video;

      if (!video) {
        return;
      }

      const ranges = Array.from({ length: video.buffered.length }, (_, index) => ({
        id: `buffered-${index}`,
        type: "buffered" as const,
        label: "Buffered",
        start: video.buffered.start(index),
        end: video.buffered.end(index),
      }));

      setStore("bufferedRanges", ranges);
      setStore("buffered", ranges.at(-1)?.end ?? 0);
    };

    const api: VideoAPI = {
      metadata,
      fullscreen,
      setFullscreen: setStore.bind(null, "fullscreen"),

      loading: () => store.loading,
      buffering: () => store.buffering,
      error: () => store.error,
      duration: () => store.duration,
      buffered: () => store.buffered,
      bufferedRanges: () => store.bufferedRanges,
      currentTime: () => store.currentTime,
      preview: () => store.preview,
      feedback: () => store.feedback,
      controlsVisible: () => store.controlsVisible,
      bottomPanelOpen: () => store.bottomPanelOpen,
      settingsOpen: () => store.settingsOpen,
      activeActions,
      selectedAudio: () => store.selectedAudio,
      selectedSubtitle: () => store.selectedSubtitle,
      playbackRate: () => store.playbackRate,

      setTime(time) {
        const video = props.video;

        if (!video || Number.isNaN(time)) {
          return;
        }

        video.currentTime = Math.max(0, Math.min(time, video.duration || store.duration || time));
        setStore("currentTime", video.currentTime);
      },
      seekBy(seconds) {
        api.setTime(store.currentTime + seconds);
        flash(`${seconds > 0 ? "+" : ""}${seconds}s`);
      },
      setPreview(time, x) {
        const preview = props.metadata?.preview;

        if (!preview) {
          setStore("preview", { time, x });
          return;
        }

        const tile = mapPreviewTile(time, preview);

        setStore("preview", {
          time,
          x,
          ...tile,
        });
      },
      clearPreview() {
        if (!store.scrubbing) {
          setStore("preview", undefined);
        }
      },
      markPreviewError() {
        setStore("preview", (preview) =>
          preview ? { time: preview.time, x: preview.x } : undefined,
        );
      },
      reportSubtitleError(label) {
        flash(`${label} subtitles unavailable`);
      },
      showControls() {
        setStore("controlsVisible", true);
        scheduleHide();
      },
      hideControls() {
        if (!keepControlsVisible()) {
          setStore("controlsVisible", false);
        }
      },
      setFocused(focused) {
        setStore("focused", focused);
        setStore("controlsVisible", true);
        scheduleHide();
      },
      setScrubbing(scrubbing) {
        setStore("scrubbing", scrubbing);
        setStore("controlsVisible", true);
        scheduleHide();
      },
      setSettingsOpen(open) {
        setStore("settingsOpen", open);
        setStore("controlsVisible", true);
      },
      setBottomPanelOpen(open) {
        setStore("bottomPanelOpen", open);
        setStore("controlsVisible", true);
      },
      selectAudio(track) {
        if (track.availability === "unavailable") {
          flash(track.reason ?? "Audio track unavailable");
          return;
        }

        setStore("selectedAudio", track.id);
        flash(`Audio: ${track.label}`);
      },
      selectSubtitle(track) {
        if (track.availability === "unavailable") {
          flash(track.reason ?? "Subtitle unavailable");
          return;
        }

        setStore("selectedSubtitle", track.id);
        flash(track.id === "off" ? "Subtitles off" : `Subtitles: ${track.label}`);
      },
      setPlaybackRate(rate) {
        const video = props.video;

        setStore("playbackRate", rate);

        if (video) {
          video.playbackRate = rate;
        }

        flash(`${rate}x`);
      },
      playItem(item) {
        const video = props.video;

        if (!video) {
          return;
        }

        const shouldPlay = store.state === "playing";
        video.src = item.streamUrl;
        video.currentTime = item.resumeOffset ?? 0;
        setStore("currentTime", video.currentTime);
        setStore("state", shouldPlay ? "playing" : "paused");

        if (shouldPlay) {
          void video.play();
        }
      },
      runAction(action) {
        if (action.seekTo !== undefined) {
          api.setTime(action.seekTo);
          flash(action.label);
          return;
        }

        const next = props.metadata?.next;

        if (action.itemId && next?.id === action.itemId) {
          api.playItem(next);
        }
      },

      state: {
        state: () => store.state,
        setState: setStore.bind(null, "state"),

        play() {
          const video = props.video;

          setStore("state", "playing");

          if (video) {
            void video.play().catch(() => {
              setStore("state", "paused");
              setStore("error", "Playback could not start.");
            });
          }
        },

        pause() {
          props.video?.pause();
          setStore("state", "paused");
        },

        replay() {
          api.setTime(0);
          api.state.play();
        },
      },
      volume: {
        value: () => store.volume.value,
        muted: () => store.volume.muted,

        setValue: setStore.bind(null, "volume", "value"),
        setMuted: setStore.bind(null, "volume", "muted"),

        mute() {
          setStore("volume", "muted", true);
          flash("Muted");
        },
        unmute() {
          setStore("volume", "muted", false);
          flash("Unmuted");
        },
      },
    };

    if (isServer) {
      return api;
    }

    createEffect(() => {
      const item = props.metadata;
      const video = props.video;

      if (!item || !video) {
        return;
      }

      setStore("duration", item.duration);
      setStore("selectedAudio", item.audioTracks.find((track) => track.availability === "selected")?.id);
      setStore(
        "selectedSubtitle",
        item.subtitleTracks.find((track) => track.availability === "selected")?.id ?? "off",
      );
      video.currentTime = item.resumeOffset;
      video.playbackRate = 1;
      setStore("playbackRate", 1);
      setStore("currentTime", item.resumeOffset);
    });

    createEffect(() => {
      const video = props.video;

      if (!video) {
        return;
      }

      if (store.state === "playing") {
        void video.play().catch(() => {
          setStore("state", "paused");
          setStore("error", "Playback could not start.");
        });
      } else {
        video.pause();
      }
    });

    createEffect(() => {
      const video = props.video;

      if (!video) {
        return;
      }

      video.muted = store.volume.muted;
      video.volume = store.volume.value;
    });

    createEffect(() => {
      if (keepControlsVisible()) {
        setStore("controlsVisible", true);
        return;
      }

      scheduleHide();
    });

    createEffect(() => {
      const video = props.video;

      if (!video) {
        return;
      }

      createEventListenerMap(video, {
        play() {
          setStore("state", "playing");
          scheduleHide();
        },
        pause() {
          setStore("state", "paused");
          setStore("controlsVisible", true);
        },
        ended() {
          setStore("state", "ended");
          setStore("controlsVisible", true);
        },
        durationchange() {
          setStore("duration", video.duration || props.metadata?.duration || 0);
        },
        timeupdate() {
          setStore("currentTime", video.currentTime);
        },
        volumechange() {
          setStore("volume", { muted: video.muted, value: video.volume });
        },
        progress: syncBuffered,
        loadedmetadata() {
          setStore("duration", video.duration || props.metadata?.duration || 0);
          syncBuffered();
        },
        canplay() {
          setStore("loading", false);
          setStore("buffering", false);
          setStore("error", undefined);
        },
        waiting() {
          setStore("loading", false);
          setStore("buffering", true);
        },
        stalled() {
          setStore("buffering", true);
        },
        error() {
          setStore("error", "This stream cannot be played directly by the browser.");
          setStore("loading", false);
          setStore("buffering", false);
        },
      });
    });

    createEffect(() => {
      const root = props.root;

      if (!root) {
        return;
      }

      const onInput = () => api.showControls("input");
      const onKeyDown = (event: KeyboardEvent) => {
        api.showControls("input");

        const target = event.target as HTMLElement | null;
        const isSurface = target === root || target?.tagName === "VIDEO";
        const ownsTextInput = target instanceof HTMLInputElement && target.type !== "range";

        if (ownsTextInput) {
          return;
        }

        if (event.key === "Escape" || event.key === "Backspace") {
          if (store.settingsOpen) {
            event.preventDefault();
            api.setSettingsOpen(false);
            return;
          }

          if (store.bottomPanelOpen) {
            event.preventDefault();
            api.setBottomPanelOpen(false);
            return;
          }
        }

        if ((event.key === " " || event.key.toLowerCase() === "k") && isSurface) {
          event.preventDefault();
          store.state === "playing" ? api.state.pause() : api.state.play();
          return;
        }

        if (event.key.toLowerCase() === "f" && isSurface) {
          event.preventDefault();
          api.setFullscreen((last) => !last);
          return;
        }

        if (event.key.toLowerCase() === "m" && isSurface) {
          event.preventDefault();
          api.volume.setMuted((last) => !last);
          return;
        }

        if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && isSurface) {
          event.preventDefault();
          api.seekBy(event.key === "ArrowLeft" ? -seekStep : seekStep);
        }
      };

      root.addEventListener("pointermove", onInput);
      root.addEventListener("pointerdown", onInput);
      root.addEventListener("touchstart", onInput);
      root.addEventListener("keydown", onKeyDown);
      root.addEventListener("focusin", () => api.setFocused(true));
      root.addEventListener("focusout", () => api.setFocused(false));

      onCleanup(() => {
        root.removeEventListener("pointermove", onInput);
        root.removeEventListener("pointerdown", onInput);
        root.removeEventListener("touchstart", onInput);
        root.removeEventListener("keydown", onKeyDown);
        root.removeEventListener("focusin", () => api.setFocused(true));
        root.removeEventListener("focusout", () => api.setFocused(false));
      });
    });

    onCleanup(() => {
      clearTimeout(hideTimer);
      clearTimeout(feedbackTimer);
    });

    return api;
  },
  {
    metadata: () => undefined,
    fullscreen: () => false,
    setFullscreen() {},

    loading: () => false,
    buffering: () => false,
    error: () => undefined,
    duration: () => 0,
    buffered: () => 0,
    bufferedRanges: () => [],
    currentTime: () => 0,
    preview: () => undefined,
    feedback: () => undefined,
    controlsVisible: () => true,
    bottomPanelOpen: () => false,
    settingsOpen: () => false,
    activeActions: () => [],
    selectedAudio: () => undefined,
    selectedSubtitle: () => "off",
    playbackRate: () => 1,

    setTime() {},
    seekBy() {},
    setPreview() {},
    clearPreview() {},
    markPreviewError() {},
    reportSubtitleError() {},
    showControls() {},
    hideControls() {},
    setFocused() {},
    setScrubbing() {},
    setSettingsOpen() {},
    setBottomPanelOpen() {},
    selectAudio() {},
    selectSubtitle() {},
    setPlaybackRate() {},
    playItem() {},
    runAction() {},

    state: {
      state: () => "playing",
      setState() {},
      play() {},
      pause() {},
      replay() {},
    },
    volume: {
      value: () => 0.5,
      muted: () => false,

      setValue() {},
      setMuted() {},

      mute() {},
      unmute() {},
    },
  }
);

export const formatTime = (subject: number) => {
  if (Number.isNaN(subject) || !Number.isFinite(subject)) {
    return "00:00";
  }

  const hours = Math.floor(subject / 3600);
  const minutes = Math.floor((subject % 3600) / 60);
  const seconds = Math.floor(subject % 60);
  const sections = hours !== 0 ? [hours, minutes, seconds] : [minutes, seconds];

  return sections.map((section) => String(section).padStart(2, "0")).join(":");
};

export const mapPreviewTile = (
  time: number,
  preview: PlayerPreviewTileMetadata,
) => {
  const thumbnailIndex = Math.max(
    0,
    Math.min(
      Math.floor(time / preview.interval),
      Math.max(0, preview.thumbnailCount - 1),
    ),
  );
  const tilesPerImage = preview.tileWidth * preview.tileHeight;
  const tileIndex = Math.floor(thumbnailIndex / tilesPerImage);
  const tileOffset = thumbnailIndex % tilesPerImage;
  const tileX = tileOffset % preview.tileWidth;
  const tileY = Math.floor(tileOffset / preview.tileWidth);

  return {
    tileUrl: preview.tileUrl.replace("{index}", String(tileIndex)),
    tileIndex,
    tileX,
    tileY,
    tileWidth: preview.width,
    tileHeight: preview.height,
  };
};
