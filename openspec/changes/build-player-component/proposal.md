## Why

The current player is an early native `<video>` wrapper with basic controls, stubbed metadata, and no production-ready support for hover previews or media track selection. Streamarr needs a performant, polished playback surface that can use Jellyfin playback metadata while keeping the UI responsive and maintainable.

## What Changes

- Replace or substantially refactor `src\features\player` around a dedicated player state/controller layer and small UI controls.
- Load playback metadata for each playable entry, including stream URL state, audio tracks, subtitle tracks, defaults, and trickplay thumbnail information.
- Add timeline hover previews backed by Jellyfin trickplay tiles where available, with graceful fallback when thumbnails are missing.
- Add in-player UI for audio and subtitle tracks, including an explicit subtitle-off state, while gating any track application that would require remuxing or transcoding.
- Add contextual playback actions for previous/next items and timed media actions such as skip intro, skip recap, skip outro, and next episode where metadata is available.
- Add playback speed selection through native browser playback rate controls.
- Add a restrained player UI layout that reveals bottom and side panel content by resizing the video surface instead of layering boxed panels over the video.
- Preserve fast native browser direct playback for the first pass; remuxing, transcoding, HLS, and heavy player dependencies are deferred even when their future UI affordances are visible.
- Treat detailed aesthetics as iterative, while capturing layout, hierarchy, focus, and panel behavior as first-pass requirements.

## Capabilities

### New Capabilities

- `video-playback`: Defines baseline playback behavior, state synchronization, seeking, buffering/loading state, keyboard/fullscreen behavior, and performance expectations for the player shell.
- `timeline-previews`: Defines thumbnail preview behavior while hovering or scrubbing the seek track, including Jellyfin trickplay integration and missing-preview fallback.
- `media-track-selection`: Defines how audio and subtitle tracks are discovered, displayed, and applied only when compatible with direct browser playback.
- `playback-actions`: Defines previous/next item navigation and contextual timed action buttons such as skip intro and next episode.
- `player-ui-layout`: Defines the player's panel model, visual hierarchy principles, responsive layout behavior, and TV/mobile navigation constraints.
- `ui-platform-principles`: Defines the general UI principle that Streamarr should prefer platform-native browser capabilities before custom machinery.

### Modified Capabilities

None.

## Impact

- `src\features\player\**`: Main implementation surface; existing controls can be reused, rewritten, or split as needed.
- `src\features\content\service.ts` and `src\features\content\apis\jellyfin.ts`: Add playback metadata and track/trickplay accessors beside the existing stream proxy.
- `src\routes\api\content\[id]\**`: Replace sample metadata stubs with authenticated content metadata, subtitle, and trickplay proxy routes.
- Jellyfin API usage: use PlaybackInfo, MediaSources/MediaStreams, subtitle endpoints, media segments, series episode adjacency metadata, and trickplay tile/playlist endpoints.
- Potential dependencies: none by default; HLS, MSE, remuxing, and transcoding remain explicit future decisions if native direct playback cannot satisfy track switching or browser compatibility.
