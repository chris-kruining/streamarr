## 1. Playback Metadata Contract

- [x] 1.1 Add Jellyfin playback metadata helpers for concrete playable items that resolve PlaybackInfo, selected media source, media streams, defaults, media compatibility hints, trickplay metadata, media segments, and adjacent series/season context.
- [x] 1.2 Add Streamarr API/query contract for player metadata with audio tracks, subtitle tracks, direct stream URL, preview tile metadata, previous/next episode availability, timed contextual actions, browser direct-play compatibility inputs, and unavailable/future-capable track states.
- [x] 1.3 Add authenticated proxy routes or helpers for subtitle assets and Jellyfin trickplay tile images.
- [x] 1.4 Include chapter and media-segment metadata in the player metadata contract for timeline markers and contextual actions.
- [x] 1.5 Keep the existing content stream route compatible for native direct playback without invoking remuxing, transcoding, HLS, or MSE.

## 2. Player Controller

- [x] 2.1 Refactor `src\features\player` around a controller/context that owns media element state, metadata, selected tracks, preview state, and player actions.
- [x] 2.2 Synchronize play, pause, seek, duration, time, buffering, volume, mute, and fullscreen state from native media events.
- [x] 2.3 Preserve current time and playback intent when changing direct-play-compatible options, while leaving remux/transcode-dependent track changes unavailable.
- [x] 2.4 Implement previous/next episode actions from series or season playback context without showing unavailable actions as active controls.
- [x] 2.5 Implement timed contextual actions such as skip intro and next episode from trusted metadata.
- [x] 2.6 Implement control visibility lifecycle for input activity, pause state, focused controls, scrubbing, open panels, and contextual actions.
- [x] 2.7 Implement resume offset, replay, end-of-item, and next-item behavior.
- [x] 2.8 Implement loading, buffering, stream error, subtitle error, and preview error states.
- [x] 2.9 Remove sample metadata stubs and debug logging from the player feature.

## 3. Controls and UI

- [x] 3.1 Rebuild the seek bar to support precise seeking, buffered progress, hover position, and scrub state without broad re-renders.
- [x] 3.2 Implement timeline thumbnail preview UI with timestamp fallback when trickplay is unavailable.
- [x] 3.3 Add timeline markers for chapters, media segments, and buffered ranges when metadata exists.
- [x] 3.4 Replace the placeholder settings button with an accessible settings panel for audio and subtitle selection.
- [x] 3.5 Implement the two-panel layout model where the video surface resizes to reveal a small bottom controls region and a side settings region while matching the player component aspect ratio.
- [x] 3.6 Define transient control visibility separately from deliberate panel-open states so idle show/hide behavior does not repeatedly resize the video.
- [x] 3.7 Evaluate scroll snapping, scroll-driven animations, native overflow, CSS transitions, and browser focus behavior against target desktop, mobile, and TV browser support before adding custom panel reveal or gesture machinery.
- [x] 3.8 Style bottom controls as icon-only controls at rest, using focus treatments only for active keyboard, remote, pointer, or touch focus.
- [x] 3.9 Add bottom-panel previous and next episode controls that appear only when available in the current playback context.
- [x] 3.10 Add temporary contextual action UI for skip intro, skip recap, skip outro, and next episode actions when provided by metadata.
- [x] 3.11 Keep visual hierarchy primarily based on spacing, alignment, scale, and typography, adding borders, separators, or backgrounds only where layout alone is insufficient.
- [x] 3.12 Add transient feedback UI for seek, volume, mute, subtitle, audio, and playback speed changes.
- [x] 3.13 Ensure the same controls and panels work across pointer, keyboard, TV remote, and touch input with predictable focus order, Back/Escape dismissal, and explicit direction-key handling where native focus order is insufficient.
- [x] 3.14 Account for TV overscan, fullscreen safe areas, and mobile safe-area insets in player layout.
- [x] 3.15 Add accessible labels, states, visible focus styles, reduced-motion behavior, and caption/subtitle discoverability.
- [x] 3.16 Keep play/pause, volume, fullscreen, loading, and title controls visually coherent with the existing app theme.

## 4. Validation

- [x] 4.1 Add targeted tests for metadata normalization, direct-play compatibility inputs, track option labeling/filtering, trickplay time-to-tile mapping, timeline marker mapping, media-segment action mapping, previous/next episode availability, and control visibility state transitions.
- [ ] 4.2 Manually validate playback, seeking, hover previews, timeline markers, audio selection, subtitle selection/off, fullscreen, remote/keyboard focus movement, touch/gesture panel access, auto-hide behavior, loading/error states, contextual actions, and fallback behavior with at least one Jellyfin item.
- [x] 4.3 Run the smallest relevant existing test/build command that covers the changed player and content code.
