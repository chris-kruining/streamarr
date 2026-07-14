## Context

`src\features\player` currently renders a native `<video>` element with basic controls and commented-out sample metadata for captions and thumbnails. The stream route proxies Jellyfin `/Videos/{itemId}/stream` with range headers, but playback metadata, track lists, subtitle assets, and trickplay thumbnails are not exposed as first-class app contracts yet.

Jellyfin already exposes the building blocks we need: PlaybackInfo, MediaSources/MediaStreams, video stream query parameters for selected audio/subtitle streams, subtitle endpoints, and trickplay tile endpoints.

Jellyfin also exposes likely sources for contextual playback actions: media segments via `/MediaSegments/{itemId}` with segment types such as Intro, Recap, Outro, Preview, and Commercial, plus series episode adjacency via `/Shows/{seriesId}/Episodes?adjacentTo={itemId}`. Playlist and queue adjacency can be future context sources, but they are not part of the first pass.

## Goals / Non-Goals

**Goals:**

- Build a native-first, performant player architecture with clear separation between media state, metadata loading, and controls.
- Expose backend playback metadata that the UI can use for track selection and timeline previews.
- Support audio track selection, subtitle selection/off, hover thumbnails, seeking, fullscreen, loading/buffering, volume, and play/pause.
- Support contextual previous/next item controls and timed actions such as skip intro or next episode when playback metadata provides them.
- Support playback speed selection through the native media element.
- Provide high-quality interaction details: unified input, control visibility lifecycle, timeline metadata markers, transient action feedback, resume/end behavior, safe-area-aware layout, accessibility, and graceful loading/error states.
- Keep the implementation refactor-friendly so the visual design can be refined later without rewriting playback logic.

**Non-Goals:**

- Final visual polish and animation spec; the first pass only needs to be coherent and usable.
- Watch progress reporting back to Jellyfin.
- Multi-version/media-source selection unless required for track selection.
- DRM, casting, playlist/queue management, or remote-control integrations.
- Adding HLS/MSE dependencies unless native streaming proves insufficient.

## Decisions

1. **Use native direct playback first.** The first pass uses the browser `HTMLVideoElement` with direct browser-playable streams only. Remuxing, transcoding, HLS, MSE, and full player libraries are deferred even when their future UI affordances are visible. If a file or track change cannot work through native direct playback, the player should show a clear unavailable/unsupported state rather than silently invoking another playback mode.

2. **Create a player controller/context around the video element.** The controller owns signals for playback state, timings, loading, volume, fullscreen, selected tracks, preview state, and imperative actions. Controls consume this context instead of reaching into the video element directly.

3. **Add a server-side playback metadata contract for playable items.** The player should consume a playable item contract that is agnostic to movie vs episode once playback begins. Call sites that start from non-playable discovery entries, such as a show or collection, must resolve or choose a concrete playable Jellyfin item before invoking playback. The metadata shape should include resolved media source id, default audio/subtitle stream indexes, audio/subtitle options, direct-play availability, trickplay info, and URLs/templates for stream, subtitle, and preview resources.

4. **Keep track UI while gating non-direct track changes.** Native progressive streams do not reliably expose embedded audio switching directly, and Jellyfin may require remuxing or transcoding to change audio streams. The first pass should still show audio/subtitle UI, but only apply changes that are compatible with native direct playback; other options should be unavailable or future-capable rather than attempted.

5. **Determine direct-play compatibility conservatively.** The server metadata contract should expose Jellyfin media source, stream, codec, container, and delivery metadata without silently triggering remux/transcode modes. The client owns the final browser compatibility decision using platform checks such as `canPlayType` or MediaCapabilities where available. It is acceptable in the first pass for all alternate audio tracks to be visible but unavailable if they cannot be switched through native direct playback.

   PlaybackInfo can be requested with a conservative browser-oriented device profile to improve metadata and subtitle delivery decisions, but it must not be used to silently opt into remuxing, transcoding, HLS, or MSE during this first pass.

6. **Prefer native text tracks for text-compatible subtitles.** External or text subtitle streams should be proxied as VTT-compatible tracks where possible. Jellyfin text subtitle conversion to VTT is allowed for subtitle delivery and does not count as the parked video/audio remuxing or transcoding modes. Unsupported subtitle streams should be hidden or disabled until we decide whether to rely on Jellyfin transcoding/burn-in for them.

7. **Use Jellyfin trickplay tiles for previews.** The UI can calculate tile index and CSS offset from trickplay dimensions and interval, loading images lazily only when hovering/scrubbing.

8. **Keep the first implementation direct-play and session-scoped.** The first pass will target native/direct Jellyfin streams that the browser can play, browser-compatible text subtitles, and in-memory audio/subtitle choices only. Persisted preferences, HLS-first playback, remuxing, transcoding, and subtitle burn-in can be revisited after baseline playback works.

9. **Include baseline keyboard controls.** The first pass should support space/k play-pause, f fullscreen, and m mute. Left/right seek applies when focus is on the video surface, the timeline is focused, or the timeline is grabbed for scrubbing; direction keys navigate focus when focus is on controls or panels.

10. **Use an unboxed panel reveal model for player chrome.** The player should have two panel regions: a small bottom controls region and a side settings region. Deliberately opening either region resizes/repositions the video surface to reveal the panel content behind/around it. Transient control visibility during playback is not the same as opening a panel and must not resize the video on every pointer move or idle timeout. The video surface should match the player component's aspect ratio, which usually matches the screen implicitly, instead of treating the source video's intrinsic aspect ratio as the layout constraint. The content should feel spatially arranged rather than placed inside visible panel boxes; spacing and layout are the first hierarchy tools, with borders, separators, and backgrounds reserved for when hierarchy cannot be achieved otherwise.

11. **Prefer platform capabilities before custom interaction machinery.** Streamarr UI should lean on browser-native primitives whenever they can satisfy the UX reliably. The relevant primitives differ per UI; for this player, panel reveal and video resizing should first explore CSS scrolling primitives such as scroll snapping, scroll-driven animations, and native overflow behavior before adding bespoke gesture state machines or animation libraries.

12. **Separate persistent controls from contextual actions.** The bottom panel is the frequent-action surface: timeline, time, play/pause, seek, previous/next item when available, volume/mute, subtitle quick status, settings, and fullscreen. The side panel is the configuration surface: audio tracks, subtitle tracks, playback speed, and future quality/diagnostics. Netflix-style skip/next prompts are temporary contextual actions derived from metadata and should sit outside the persistent panel contents.

13. **Design one input model across device classes.** Pointer, keyboard, TV remote, and touch should operate the same conceptual controls and panels. Device-specific affordances are allowed, but they should not create separate behavior models.

14. **Keep transient UX cheap and nonblocking.** Control auto-hide, action feedback, timeline markers, thumbnail previews, and skip prompts should be isolated from core playback so optional UI work cannot cause video jank.

## Risks / Trade-offs

- **Native direct playback may not cover every file or track combination** -> Validate direct browser playability early; if native playback fails, show a clear unsupported state and consider HLS/remux/transcoding only as an explicit follow-up decision.
- **Direct-play compatibility can be ambiguous** -> Expose media metadata from the server and let the client make final browser compatibility decisions with native capability checks; treat uncertain alternate audio changes as unavailable.
- **Subtitle formats vary by media** -> Start with text-compatible subtitles and mark unsupported formats clearly.
- **High-frequency time/hover updates can cause UI jank** -> Throttle or isolate timeline preview state and avoid broad context updates on every event.
- **Trickplay may not exist for all items** -> Keep timestamp-only hover behavior as the fallback.
- **Authenticated media asset routes can grow quickly** -> Keep routes narrowly scoped to playback metadata, stream, subtitles, and trickplay tiles.
- **A unified input model can become over-abstracted** -> Start with semantic controls and native focus order, then only add explicit focus management where layout proves it is needed.
- **Auto-hide and panel reveal can harm accessibility** -> Keep controls visible while focused/paused/panels-open and respect reduced-motion preferences.
- **Auto-hide can cause layout jank if tied to panel reveal** -> Keep transient controls distinct from deliberately opened panel states so idle visibility changes do not continuously resize the video.
- **TV D-pad navigation may exceed native browser focus behavior** -> Use semantic controls first, but allow explicit direction-key handling where spatial navigation is required.
- **Scroll-driven panel primitives may not exist on all targets** -> Validate support on target desktop, mobile, and TV browsers before relying on scroll snapping or scroll-driven animations for core interaction.

## Migration Plan

1. Introduce the metadata contract and routes without removing the existing stream route.
2. Refactor the player context/controller and controls against the new contract.
3. Wire thumbnails and track selection incrementally behind the new player metadata.
4. Remove sample VTT/image stubs once real Jellyfin metadata and proxies are working.

Rollback is straightforward while the existing `/api/content/:id/stream` behavior remains compatible: revert the player feature and metadata routes without changing content listing or entry pages.

## Resolved Scope Decisions

- First implementation targets native/direct browser-playable Jellyfin streaming only; remuxing, transcoding, HLS, and MSE are parked for later.
- Subtitle selection initially includes browser-compatible text subtitles; image/PGS burn-in or transcoding is deferred.
- Audio and subtitle choices are session-only initially, and audio changes that would require remuxing or transcoding remain visible but unavailable/future-capable.
- First-pass keyboard shortcuts include space/k play-pause, f fullscreen, m mute, and left/right seek only when focus is on the video surface or timeline.
- Left/right seek applies on the video surface or timeline; direction keys navigate focus while controls or panels are focused.
- Player UI uses two panel regions: bottom basic controls and side settings.
- Open panels are revealed by resizing/repositioning the video surface, not by stacking boxed overlays on top of the video.
- The video surface matches the player component's aspect ratio during panel reveal; it does not preserve the source video's intrinsic aspect ratio as the layout constraint.
- Visual hierarchy prioritizes spacing, layout, and typography before borders, separators, or backgrounds.
- UI interactions follow a platform-first rule across Streamarr: prefer relevant native browser primitives before custom machinery. For the player, that currently means evaluating scroll snapping, scroll-driven animations, native overflow scrolling, media APIs, and focus handling before custom gesture/animation systems.
- Bottom panel contains frequent playback controls, including contextual previous/next item controls when available.
- Side panel contains detail playback settings: audio tracks, subtitle tracks, playback speed, and reserved future quality/diagnostic settings.
- Timed skip and next prompts are temporary contextual actions derived from metadata such as Jellyfin media segments, not hard-coded timestamps.
- Player controls share one interaction model across pointer, keyboard, TV remote, and touch.
- Direction keys navigate focus by default and seek only when the timeline is focused or grabbed.
- Controls auto-hide only when playback is active and no focus, panel, scrub, or contextual action requires them.
- Timeline can show chapters, segments, and buffered ranges when metadata exists.
- Player provides transient feedback for non-obvious actions such as seeking, muting, subtitle toggling, and speed changes.
- Resume offsets are read from Jellyfin UserData in the first pass; reporting progress back to Jellyfin remains out of scope.
- Layout accounts for TV overscan and mobile safe-area insets.
- Accessibility includes semantic labels, visible focus states, reduced-motion support, and discoverable captions/subtitles.
