## ADDED Requirements

### Requirement: Timeline hover thumbnail
The player SHALL show a thumbnail preview for the hovered or scrubbed timeline position when preview metadata is available.

#### Scenario: User hovers timeline with previews available
- **WHEN** the user points at a timeline position with available trickplay metadata
- **THEN** the player displays the corresponding thumbnail and timestamp near the pointer

#### Scenario: User leaves timeline
- **WHEN** the pointer leaves the timeline and the user is not actively scrubbing
- **THEN** the thumbnail preview is hidden

### Requirement: Jellyfin trickplay integration
The player SHALL derive preview images from Jellyfin trickplay metadata and proxy thumbnail assets through authenticated Streamarr routes.

#### Scenario: Trickplay metadata exists
- **WHEN** Jellyfin provides trickplay info for an entry
- **THEN** the player can map a timeline time to the correct tile image and tile coordinates

### Requirement: Timeline metadata markers
The timeline SHALL show metadata markers for known chapters, segments, and buffered ranges when metadata exists.

#### Scenario: Chapters are available
- **WHEN** chapter metadata exists for the current item
- **THEN** the timeline marks chapter positions without preventing precise seeking

#### Scenario: Media segments are available
- **WHEN** media segments such as Intro, Recap, Outro, Preview, or Commercial exist for the current item
- **THEN** the timeline marks those segments in a way that supports contextual actions without overwhelming the track

#### Scenario: Buffered ranges change
- **WHEN** the media element reports buffered ranges
- **THEN** the timeline updates buffered range display without causing broad player re-renders

### Requirement: Preview fallback
The player SHALL keep the timeline usable when thumbnail previews are unavailable or fail to load.

#### Scenario: No preview metadata
- **WHEN** an entry has no usable trickplay metadata
- **THEN** the timeline still supports seeking and may show only the hovered timestamp

#### Scenario: Preview image fails
- **WHEN** a preview image request fails
- **THEN** playback and seeking continue without interruption

### Requirement: Timeline performance
The timeline SHALL limit expensive work during hover, scrubbing, preview loading, and time updates.

#### Scenario: User scrubs timeline
- **WHEN** the user moves continuously across the timeline
- **THEN** preview lookup and UI updates are throttled or isolated so playback remains smooth

#### Scenario: Preview images are needed
- **WHEN** thumbnails are available but the user is not previewing the timeline
- **THEN** preview images are not eagerly loaded in a way that delays initial playback
