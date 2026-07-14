## ADDED Requirements

### Requirement: Previous and next item actions
The player SHALL expose previous and next item actions when the current playback context has adjacent series or season episodes. Playlist and queue adjacency are future context sources, not first-pass requirements.

#### Scenario: Adjacent items are available
- **WHEN** the current playback context includes a previous item, next item, or both
- **THEN** the bottom controls expose the corresponding previous and next item actions

#### Scenario: Adjacent item is unavailable
- **WHEN** the current playback context has no previous item or no next item
- **THEN** the unavailable action is not presented as an active control

#### Scenario: User selects next item
- **WHEN** the user activates the next item action
- **THEN** playback navigates to the next contextual item and starts from that item's resume offset when present, otherwise from the beginning

### Requirement: Timed contextual action buttons
The player SHALL show temporary contextual action buttons for known media segments or playback opportunities, such as skip intro, skip recap, skip outro, and next episode.

#### Scenario: Intro segment is active
- **WHEN** playback enters a known intro segment
- **THEN** the player presents a skip intro action that seeks to the end of that segment

#### Scenario: Outro or end-of-episode action is available
- **WHEN** playback reaches an outro segment or next-episode threshold and a next item is available
- **THEN** the player presents a next episode or next item action

#### Scenario: Contextual action expires
- **WHEN** playback leaves the relevant segment or threshold
- **THEN** the contextual action is hidden and focus returns predictably if it was focused

### Requirement: Contextual action metadata
The player SHALL derive contextual actions from authenticated playback metadata rather than hard-coded timestamps.

#### Scenario: Jellyfin segment metadata is available
- **WHEN** Jellyfin provides media segments such as Intro, Recap, Outro, Preview, or Commercial for an item
- **THEN** Streamarr maps supported segments into timed player actions

#### Scenario: Segment metadata is unavailable
- **WHEN** no trusted segment metadata is available
- **THEN** the player does not invent skip actions from guessed timestamps
