## ADDED Requirements

### Requirement: Panel hierarchy through layout and spacing
The player UI SHALL create visual hierarchy primarily through spacing, alignment, scale, and layout, reserving borders, separators, panel backgrounds, and boxed containers for cases where layout and spacing are insufficient.

#### Scenario: Bottom panel is visible
- **WHEN** the bottom controls panel is open
- **THEN** the player displays the timeline and basic control content without wrapping each panel or control group in a visually heavy box

#### Scenario: Settings panel is visible
- **WHEN** the settings side panel is open
- **THEN** settings content is organized with spatial grouping and typography before using separators or background blocks

### Requirement: Video resize panel reveal
The player SHALL reveal bottom and side panel content by resizing/repositioning the video surface to match the player component's aspect ratio, rather than overlaying boxed panels on top of the video or preserving the source video's intrinsic aspect ratio as the layout constraint.

#### Scenario: Bottom panel opens
- **WHEN** the bottom controls panel opens
- **THEN** the video surface shrinks or shifts to reveal the bottom controls area while matching the player component's current aspect ratio

#### Scenario: Side settings panel opens
- **WHEN** the settings panel opens
- **THEN** the video surface shrinks or shifts to reveal side panel content while matching the player component's current aspect ratio

#### Scenario: Transient controls appear
- **WHEN** controls are revealed transiently because of pointer movement, touch, keyboard, or remote activity during playback
- **THEN** the player does not repeatedly resize the video surface as part of the idle show and hide cycle

#### Scenario: Both panels are open
- **WHEN** the bottom panel and side settings panel are open at the same time
- **THEN** the video surface remains usable, maintains the player component's aspect ratio, and does not shrink below the minimum size needed to understand playback content

#### Scenario: Player viewport is too constrained
- **WHEN** the available space cannot show open panels and a usable video surface together
- **THEN** the layout prioritizes a usable video surface and exposes panel content through a constrained or sequential reveal state

#### Scenario: One panel creates residual space
- **WHEN** only the bottom panel or only the side settings panel is open and the player component aspect ratio creates extra space on another edge
- **THEN** the layout anchors the video surface predictably and uses the residual space as part of the unboxed panel area rather than adding decorative containers

#### Scenario: Source video aspect differs
- **WHEN** the source video aspect ratio differs from the player component aspect ratio
- **THEN** the video content uses explicit fit behavior within the player-shaped video surface so the layout decision does not leave object-fit semantics ambiguous

### Requirement: Icon-only basic controls
Basic playback controls below the timeline SHALL rest as icon-only controls without persistent button fills or boxes.

#### Scenario: Controls are idle
- **WHEN** the bottom controls are visible and no control is focused or active
- **THEN** play, seek, volume, captions, settings, and fullscreen controls appear as standalone icons

#### Scenario: Control receives focus
- **WHEN** a TV remote, keyboard, pointer, or touch interaction focuses a control
- **THEN** the player may show a clear temporary focus treatment without changing the resting icon-only control model

### Requirement: Bottom panel contents
The bottom panel SHALL contain frequent playback controls and timeline information, while keeping detail configuration in the side settings panel.

#### Scenario: Bottom panel is open
- **WHEN** the bottom panel is visible
- **THEN** it includes the timeline, current time and duration, play/pause, seek back/forward, previous item when available, next item when available, volume or mute, subtitle quick status or toggle, settings open/close, and fullscreen

#### Scenario: Previous or next item is unavailable
- **WHEN** there is no previous or next item in the current playback context
- **THEN** the corresponding bottom-panel control is omitted or disabled in a way that does not disrupt remote focus order

### Requirement: Side settings panel contents
The side settings panel SHALL contain playback configuration and detail settings that are less frequent than basic transport controls.

#### Scenario: Side settings panel is open
- **WHEN** the side settings panel is visible
- **THEN** it includes audio track selection, subtitle track selection including Off, playback speed, and reserved space for future quality or diagnostics settings when available

### Requirement: Contextual action placement
The player SHALL present temporary contextual playback actions separately from persistent bottom controls and side settings.

#### Scenario: Skip or next contextual action is available
- **WHEN** a skip intro, skip recap, skip outro, or next episode action becomes available
- **THEN** the action is displayed as a temporary prominent control that does not require opening the side settings panel

#### Scenario: Contextual action is focused on TV
- **WHEN** a contextual action is shown while using remote or keyboard navigation
- **THEN** it is reachable from the current focus path without trapping focus away from timeline or panel controls

### Requirement: Remote and gesture navigation layout
The player layout SHALL support TV remote navigation and mobile gesture access for the same bottom and side panel concepts.

#### Scenario: TV remote navigation
- **WHEN** the user navigates with a D-pad or keyboard
- **THEN** focus moves predictably between bottom controls, timeline, and side panel settings

#### Scenario: Spatial navigation is required
- **WHEN** native browser tab order is insufficient for D-pad navigation across the bottom panel, timeline, contextual actions, and side settings
- **THEN** the player adds explicit direction-key handling while preserving semantic controls and accessible focus states

#### Scenario: Mobile gesture navigation
- **WHEN** the user opens controls on a touch device
- **THEN** the bottom controls and side settings can be revealed with gesture-friendly panel affordances without requiring hover

### Requirement: Unified input model
The player SHALL use one coherent interaction model across pointer, keyboard, TV remote, and touch input instead of treating each input type as a separate UI.

#### Scenario: Focusable controls are rendered
- **WHEN** the player shows controls or settings
- **THEN** the same controls are reachable through pointer, keyboard, remote, and touch interactions where the device supports them

#### Scenario: Focus moves between surfaces
- **WHEN** the user navigates between the timeline, bottom controls, contextual actions, and side settings
- **THEN** focus order remains predictable and consistent across keyboard and remote input

#### Scenario: Back or Escape is pressed
- **WHEN** the side settings panel, bottom panel, fullscreen state, or player route can be dismissed
- **THEN** Back or Escape dismisses the most local open surface first, restores focus to the control that opened it when possible, and only leaves fullscreen or the player after open panels are closed

### Requirement: Safe area aware layout
The player SHALL account for TV overscan and mobile safe areas when placing controls, panels, previews, and contextual actions.

#### Scenario: Player renders on a TV or fullscreen display
- **WHEN** the player is fullscreen or displayed on a TV-like viewport
- **THEN** controls and focus indicators remain inside a safe visual area away from the viewport edges

#### Scenario: Player renders on a device with safe-area insets
- **WHEN** the device reports safe-area insets
- **THEN** controls and panels avoid being obscured by notches, rounded corners, or system gesture areas

### Requirement: Accessible player UI
The player SHALL expose accessible names, semantic roles, visible focus states, reduced-motion alternatives, and discoverable caption/subtitle controls.

#### Scenario: Assistive technology reads controls
- **WHEN** the player controls are exposed to assistive technology
- **THEN** each actionable control has a meaningful accessible name and state

#### Scenario: Reduced motion is requested
- **WHEN** the user prefers reduced motion
- **THEN** panel reveal, control visibility, thumbnail, and feedback animations avoid unnecessary motion while preserving function

#### Scenario: Captions are available
- **WHEN** subtitle or caption tracks are available
- **THEN** the player makes caption/subtitle availability discoverable from both bottom controls and side settings

### Requirement: Platform-first panel interactions
The player SHALL apply Streamarr's platform-first UI principle to panel reveal, panel movement, video resizing, focus, and gesture behavior.

#### Scenario: Panel reveal is implemented
- **WHEN** the bottom or side panel reveal behavior is built
- **THEN** the implementation first evaluates platform primitives such as scroll snapping, scroll-driven animations, native overflow scrolling, CSS transitions, and browser focus behavior

#### Scenario: Target browser support is unknown
- **WHEN** scroll snapping, scroll-driven animations, or native overflow behavior are considered for panel reveal
- **THEN** support is validated against the target desktop, mobile, and TV browser environments before depending on that primitive for core interaction

#### Scenario: Custom interaction machinery is added
- **WHEN** a custom gesture state machine, animation library, or non-native interaction mechanism is introduced for panel reveal
- **THEN** the implementation documents why platform primitives were insufficient for the required behavior
