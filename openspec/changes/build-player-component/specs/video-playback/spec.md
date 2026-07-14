## ADDED Requirements

### Requirement: Native-first playback shell
The player SHALL use the browser's native `HTMLVideoElement` as the playback engine unless a specific required capability cannot be delivered without a dedicated playback library.

#### Scenario: Playable entry loads
- **WHEN** a user opens a playable entry
- **THEN** the player renders the video with the entry poster, authenticated stream URL, current resume offset, and custom controls

#### Scenario: Playback engine dependency is considered
- **WHEN** a new playback dependency is proposed
- **THEN** the implementation documents which required capability cannot be satisfied by native media APIs

### Requirement: Direct-play first scope
The first player implementation SHALL avoid Jellyfin remuxing, transcoding, HLS, MSE, or custom playback engines, and SHALL gracefully surface unsupported media or unsupported track changes instead of silently falling back to those modes.

#### Scenario: Media is browser-playable directly
- **WHEN** the selected playable item can be streamed directly by the browser video element
- **THEN** playback uses the native direct stream path

#### Scenario: Media requires remuxing or transcoding
- **WHEN** the selected playable item cannot be played through native direct browser playback
- **THEN** the player shows an unsupported or unavailable playback state rather than invoking remuxing or transcoding

#### Scenario: Future playback mode is needed
- **WHEN** HLS, MSE, remuxing, or transcoding is needed for a feature
- **THEN** that feature remains parked behind UI affordances or unavailable states until a separate playback-mode decision is made

### Requirement: Platform-first playback interactions
The player SHALL prefer native browser media, fullscreen, focus, keyboard, and accessibility APIs before adding custom abstractions for equivalent behavior.

#### Scenario: Playback interaction is implemented
- **WHEN** an interaction can be supported by native media, fullscreen, focus, keyboard, or accessibility APIs
- **THEN** the player uses the platform API rather than duplicating the behavior with custom state

### Requirement: Playback state synchronization
The player SHALL keep UI state synchronized with native media events for playing, paused, seeking, duration, current time, buffering, volume, mute, and fullscreen state.

#### Scenario: Native media state changes
- **WHEN** the video element emits playback, timing, buffering, volume, or fullscreen events
- **THEN** the visible controls reflect the latest native state without requiring a page refresh

#### Scenario: User toggles playback
- **WHEN** the user presses the play or pause control
- **THEN** the player calls the corresponding native media operation and updates controls from the resulting media event

### Requirement: Control visibility lifecycle
The player SHALL reveal and hide controls according to playback state and user activity.

#### Scenario: User provides input while playing
- **WHEN** the user moves a pointer, touches the screen, presses a key, or navigates with a remote while playback is active
- **THEN** the player reveals controls and keeps them visible long enough for interaction

#### Scenario: Playback is idle without interaction
- **WHEN** playback is active and no user interaction, focus, panel, or contextual action requires controls to remain visible
- **THEN** the player hides nonessential controls

#### Scenario: Controls must remain visible
- **WHEN** playback is paused, a control has focus, the user is scrubbing, a panel is open, or a contextual action is focused
- **THEN** the player keeps the relevant controls visible

### Requirement: Responsive seeking
The player SHALL support precise seeking from the timeline without blocking UI updates during scrubbing.

#### Scenario: User seeks on timeline
- **WHEN** the user selects a new timeline position
- **THEN** the video seeks to that time and the displayed time updates to the selected position

#### Scenario: Direction keys are used outside the timeline
- **WHEN** keyboard or remote direction keys are used while focus is on controls outside the timeline
- **THEN** the player treats those keys as focus navigation rather than seek commands

#### Scenario: Direction keys are used on the video surface
- **WHEN** keyboard direction keys are used while focus is on the video surface and no control or panel owns focus
- **THEN** the player treats left and right as seek commands

#### Scenario: Direction keys are used on the timeline
- **WHEN** keyboard or remote direction keys are used while the timeline is focused or grabbed for scrubbing
- **THEN** the player treats those keys as seek commands

### Requirement: Player performance
The player SHALL avoid unnecessary reactive updates and expensive work during high-frequency media events.

#### Scenario: Time updates during playback
- **WHEN** current time changes continuously during playback
- **THEN** only controls that depend on current time update and playback remains smooth

### Requirement: Playback speed
The player SHALL support playback speed selection through the native media element.

#### Scenario: User selects playback speed
- **WHEN** the user selects a supported playback speed
- **THEN** the player applies it through the native playback rate and reflects the selected speed in the UI

#### Scenario: Playback speed resets for new item
- **WHEN** a new item starts and no persisted speed preference exists
- **THEN** playback speed starts from the default rate

### Requirement: Fullscreen playback
The player SHALL support fullscreen entry and exit from the custom controls while preserving playback state.

#### Scenario: User toggles fullscreen
- **WHEN** the user toggles fullscreen
- **THEN** the player container enters or exits fullscreen and playback continues at the current position

### Requirement: Resume and completion behavior
The player SHALL define predictable behavior for starting from a resume offset and reaching the end of content.

#### Scenario: Entry has resume offset
- **WHEN** a playable entry includes a resume offset
- **THEN** playback starts at that offset unless the user explicitly restarts from the beginning

#### Scenario: Playback reaches the end
- **WHEN** playback reaches the end of the current item
- **THEN** the player presents an appropriate replay or next item action based on available playback context

### Requirement: Loading and error states
The player SHALL surface loading, buffering, unsupported media, stream error, subtitle error, and preview error states without blocking unrelated playback controls.

#### Scenario: Video is buffering
- **WHEN** playback stalls waiting for media data
- **THEN** the player shows a buffering state while preserving access to controls that remain safe to use

#### Scenario: Stream fails
- **WHEN** the media stream cannot be loaded or played
- **THEN** the player shows a clear error state and avoids presenting success-shaped playback controls

#### Scenario: Optional asset fails
- **WHEN** subtitles or thumbnails fail to load
- **THEN** the player reports or degrades that optional feature without interrupting video playback

### Requirement: Action feedback
The player SHALL provide transient, nonblocking feedback for user actions that may not be visually obvious from the controls alone.

#### Scenario: Seek shortcut is used
- **WHEN** the user seeks with keyboard, remote, pointer, or touch controls
- **THEN** the player briefly confirms the seek direction and amount

#### Scenario: Playback setting changes
- **WHEN** the user changes mute, volume, subtitles, audio track, or playback speed
- **THEN** the player briefly confirms the resulting state
