# Profile UI

## MODIFIED Requirements

### Requirement: Frosted Glass UI with Particle Background
The Onboarding Profile Popup MUST use a frosted glass aesthetic with a particle background.

#### Scenario: Visual Style
Given the user has completed the onboarding call
When the profile popup appears
Then the background behind the popup content should be the animated particle system
And the popup card itself should have a frosted glass effect (`backdrop-filter`)
And the card border should be subtle or removed
And dividers between sections should be hidden/removed.

### Requirement: Horizontal Tag Layout
The Profile tags MUST be displayed in a horizontal word cloud layout.

#### Scenario: Tag Display
Given the profile contains multiple tags (identity, location, etc.)
When the tags are rendered
Then they should be arranged horizontally in a flex container
And they should wrap to the next line if space is insufficient
And they should look like a collection of keywords rather than a vertical list.

### Requirement: MY WAY Timeline
The Life Trajectory section MUST be renamed to "MY WAY" and visualized as a vertical connected timeline.

#### Scenario: Timeline Visualization
Given the user has life events in their profile
When the "MY WAY" (formerly "人生轨迹") section is displayed
Then it should show a vertical line connecting the events from top to bottom
And each event should be marked with a dot on the line
And the section title should be "MY WAY".

### Requirement: Header Text Update
The Profile Header MUST be "很高兴认识你".

#### Scenario: Header Text
Given the profile popup is displayed
When the user looks at the header
Then it should read "很高兴认识你" instead of "你的探索者画像".

### Requirement: CTA Button Styling
The "Create MY WAY" button MUST use the yellow theme color.

#### Scenario: CTA Button
Given the profile popup is active
When the "Create MY WAY" button is rendered
Then its background color should be the theme's yellow color (`brand.yellow` / `#FDD140`).
