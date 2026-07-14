## ADDED Requirements

### Requirement: Platform-first UI implementation
Streamarr UI SHALL prefer native browser and web platform capabilities before adding custom interaction machinery, libraries, or abstractions for equivalent behavior.

#### Scenario: UI interaction is designed
- **WHEN** a UI interaction or layout behavior is designed
- **THEN** the implementation first evaluates relevant platform primitives for that specific UI, such as semantic HTML, CSS layout, native scrolling, focus behavior, accessibility APIs, media APIs, forms, dialogs, popovers, or animations

#### Scenario: Custom UI machinery is introduced
- **WHEN** custom gesture handling, animation orchestration, focus management, input handling, or equivalent UI machinery is introduced
- **THEN** the implementation documents why the relevant platform primitives were insufficient for the required behavior
