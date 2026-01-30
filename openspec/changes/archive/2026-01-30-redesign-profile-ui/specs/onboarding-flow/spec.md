# Onboarding Flow Specs

## MODIFIED Requirements

### Requirement: Onboarding Profile Popup Display

The system SHALL display a redesigned popup showing the user profile after the onboarding conversation ends, matching the visual design of a cohesive profile card.

#### Scenario: Profile popup displays with redesigned layout
- **GIVEN** the onboarding call ends (or user declines)
- **WHEN** the profile popup is shown
- **THEN** a modal is displayed with a unified card layout:
  - **Left Column**: Contains user identity information:
    - Large circular avatar
    - User name (editable)
    - "EXPLORER" label or similar identity marker
    - List of identity tags (editable pills)
  - **Right Column**: Contains a vertical timeline:
    - Scrollable list of life experiences
    - Each item shows Year, Title, and Description
    - Connected by a visual timeline line
- **AND** a prominent confirmation button (e.g., Check/Arrow icon) is displayed to "Start MY WAY"

#### Scenario: User edits profile information
- **GIVEN** the profile popup is displayed
- **WHEN** the user clicks on the Name, Tags, or Timeline items
- **THEN** the clicked element becomes an input field
- **AND** changes are reflected immediately in the local state
- **AND** the user can add or remove tags and timeline items

#### Scenario: User confirms profile and proceeds
- **GIVEN** the profile popup is displayed
- **WHEN** the user clicks the confirmation button
- **THEN** the profile is saved to localStorage
- **AND** the user is navigated to MY_MAP
