# Redesign Profile UI

## Summary
Redesign the `OnboardingProfilePopup` component to match the provided visual reference while retaining all existing functionality (editing, tags, timeline).

## Motivation
The user wants the profile completion screen to match a specific design reference, improving the visual polish and user experience during onboarding.

## Proposed Changes
1.  **Layout Structure**: Refactor the main container into a single cohesive card with two distinct columns.
    *   **Left Column**: Avatar, Name, "EXPLORER" label, and distinct tag list.
    *   **Right Column**: Vertical timeline with year markers and event cards.
2.  **Visual Styling**:
    *   Update the timeline visualization to use a connected dot-and-line style with "cards" for the content.
    *   Style tags as pill-shaped items.
    *   Position the "Confirm/Continue" action as a prominent button (e.g., a yellow circular check button) potentially overlapping the card or positioned for easy access.
3.  **Components**: Reuse existing logic for editing tags and timeline items.
