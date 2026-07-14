## ADDED Requirements

### Requirement: Track discovery
The player SHALL expose audio and subtitle options from Jellyfin playback metadata for the selected media source.

#### Scenario: Playback metadata includes tracks
- **WHEN** an entry has audio or subtitle media streams
- **THEN** the player settings UI lists selectable tracks with human-readable labels

### Requirement: Audio track UI
The player SHALL expose audio track choices in the UI, but SHALL only apply an audio track change during the first pass when it can be done without remuxing, transcoding, or replacing native direct playback.

#### Scenario: User selects audio track
- **WHEN** the user selects a different audio track that is compatible with direct browser playback
- **THEN** the player applies that track, preserves playback context, and reflects the selected option in the UI

#### Scenario: Audio track requires remuxing or transcoding
- **WHEN** an audio track option would require remuxing, transcoding, HLS, or another non-direct playback mode
- **THEN** the player keeps the option visible as unavailable or future-capable rather than attempting playback changes

#### Scenario: No alternate audio tracks are directly switchable
- **WHEN** all alternate audio tracks require remuxing, transcoding, HLS, or another non-direct playback mode
- **THEN** the player keeps those options visible as unavailable or future-capable and continues playback with the direct-play-compatible audio

### Requirement: Subtitle track selection
The player SHALL let users select subtitles from available text-compatible subtitle streams and provide an explicit subtitles-off option.

#### Scenario: User selects subtitle track
- **WHEN** the user selects a subtitle track
- **THEN** the player displays that subtitle track during playback and marks it selected in the UI

#### Scenario: User turns subtitles off
- **WHEN** the user selects subtitles off
- **THEN** no subtitle track is displayed and the UI marks subtitles off

### Requirement: Unsupported track handling
The player SHALL not present unsupported tracks as selectable playback options unless selecting them can produce valid playback.

#### Scenario: Unsupported subtitle stream exists
- **WHEN** Jellyfin reports a subtitle stream that cannot be shown as browser text track or valid streamed subtitle selection
- **THEN** the player excludes or disables that option with a clear label rather than failing playback

#### Scenario: Unsupported audio stream exists
- **WHEN** Jellyfin reports an audio stream that cannot be selected without remuxing or transcoding
- **THEN** the player excludes or disables that option with a clear label rather than failing playback

### Requirement: Future preference persistence path
The player SHALL keep session-only audio, subtitle, and speed choices isolated in a way that can later support persisted preferences without redesigning the player contract.

#### Scenario: Session setting changes
- **WHEN** the user changes audio, subtitle, or playback speed during playback
- **THEN** the choice applies to the current playback session through a typed player state shape that can later be persisted
