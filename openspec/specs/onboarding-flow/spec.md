# onboarding-flow Specification

## Purpose
TBD - created by archiving change add-registration-onboarding-flow. Update Purpose after archive.
## Requirements
### Requirement: Onboarding Flow Navigation Logic
The system SHALL determine whether to show onboarding based on user profile existence.

#### Scenario: First-time user clicks "开始探索"
- **GIVEN** the user is on the LANDING page
- **AND** no PublicProfile exists in localStorage
- **WHEN** the user clicks "开始探索"
- **THEN** the system navigates to ONBOARDING (AI call screen)

#### Scenario: Returning user clicks "开始探索"
- **GIVEN** the user is on the LANDING page
- **AND** a PublicProfile exists in localStorage
- **WHEN** the user clicks "开始探索"
- **THEN** the system navigates directly to MY_MAP

### Requirement: Onboarding AI Welcome Call Screen
The system SHALL display an AI welcome call screen for first-time users, reusing the existing VoiceCallModal with onboarding mode.

#### Scenario: User sees onboarding call
- **GIVEN** the user is a first-time user (no profile)
- **WHEN** the ONBOARDING view is displayed
- **THEN** the VoiceCallModal is shown with mode='onboarding'
- **AND** the 来电界面 displays the title "hi！欢迎来到 on her way!" as a large heading
- **AND** the 来电界面 displays the subtitle "我们先随便聊几句，互相认识一下彼此？"
- **AND** the AI avatar displays a star logo (星星 icon)
- **AND** the call status indicator shows "来电中..."

#### Scenario: User accepts the onboarding call
- **GIVEN** the onboarding call screen is displayed
- **WHEN** the user clicks "语音接听" or "文字接听"
- **THEN** the 通话界面 begins using existing VoiceCallModal UI
- **AND** the user can interact via voice or text input (uses chatApi if provided)

#### Scenario: User declines the onboarding call
- **GIVEN** the onboarding call screen is displayed
- **WHEN** the user clicks the decline (X) button
- **THEN** the system shows profile popup with mock data
- **AND** user can still proceed to MY_MAP

#### Scenario: Onboarding call ends
- **GIVEN** the user is in the onboarding call
- **WHEN** the user ends the call
- **THEN** the `onCallEnd` callback prop is invoked with transcription history and optional profile
- **AND** the system shows the profile popup

### Requirement: VoiceCallModal Onboarding Mode
The existing VoiceCallModal component SHALL support an onboarding mode via props.

#### Scenario: Component props extended for onboarding
- **GIVEN** the VoiceCallModal component is updated
- **THEN** it accepts an optional `mode: 'normal' | 'onboarding'` prop (default: 'normal')
- **AND** it accepts an optional `userId: string` prop
- **AND** it accepts an optional `chatApi: (req: ChatRequest) => Promise<ChatResponse>` prop
- **AND** the onClose callback includes optional `profile` field in result

### Requirement: Onboarding Profile Popup Display
The system SHALL display a popup showing the user profile after the onboarding conversation ends.

#### Scenario: Profile popup displays with data
- **GIVEN** the onboarding call ends (or user declines)
- **WHEN** the profile popup is shown
- **THEN** a popup/modal is displayed with:
  - Left side: User profile card with avatar, name, and tag icons (Identity, Location, Experience, Hassle, Goal)
  - Right side: Vertical timeline with dots and connecting lines showing LifeExperience entries
  - Bottom: "创建MY WAY" button

#### Scenario: User confirms profile and proceeds
- **GIVEN** the profile popup is displayed
- **WHEN** the user clicks the "创建MY WAY" button
- **THEN** the profile is saved to localStorage
- **AND** the user is navigated to MY_MAP

### Requirement: PublicProfile TypeScript Interface
The system SHALL define TypeScript interfaces compatible with the my-app backend.

#### Scenario: PublicProfile interface defined
- **GIVEN** the types.ts file is updated
- **THEN** it exports a `PublicProfile` interface with:
  - id: string
  - name: string
  - avatar: string
  - tags: object with role_detail, location, experience, hassle, goal (all strings)
  - lifeTimeline: array of LifeExperience objects

#### Scenario: LifeExperience interface defined
- **GIVEN** the types.ts file is updated
- **THEN** it exports a `LifeExperience` interface with:
  - id: string
  - title: string
  - description: string
  - year: string

### Requirement: Mock Data for Development
The system SHALL provide mock data for UI development and demo purposes.

#### Scenario: Mock profile available
- **GIVEN** no backend API is connected
- **WHEN** the onboarding flow completes
- **THEN** a `MOCK_ONBOARDING_PROFILE` constant is used to display the profile popup
- **AND** the mock data includes 3 hardcoded lifeTimeline entries

