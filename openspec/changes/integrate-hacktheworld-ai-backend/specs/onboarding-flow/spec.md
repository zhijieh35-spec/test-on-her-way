# onboarding-flow Specification Delta

## MODIFIED Requirements

### Requirement: Onboarding AI Welcome Call Screen
The VoiceCallModal in onboarding mode SHALL use the backend chatApi for AI conversations.

#### Scenario: Onboarding call uses backend chatApi
- **GIVEN** the user accepts the onboarding call
- **WHEN** the VoiceCallModal is rendered with mode='onboarding'
- **THEN** the component uses the chatApi prop connected to `/api/chat`
- **AND** each user message is sent to the backend with userId and message history
- **AND** the AI response is displayed in the transcription area

#### Scenario: Profile received from backend
- **GIVEN** the onboarding conversation is in progress
- **WHEN** the backend returns a ChatResponse with a profile object
- **THEN** the VoiceCallModal stores the profile for the onCallEnd callback
- **AND** the conversation may continue in counseling mode

### Requirement: Onboarding Profile Popup Display
The OnboardingProfilePopup component SHALL save the profile to Supabase when the user confirms.

#### Scenario: Profile saved to Supabase on continue
- **GIVEN** the profile popup is displayed with API-generated or edited profile
- **WHEN** the user clicks the "开始MY WAY" button
- **THEN** the profile is saved to Supabase via `/api/profiles` PUT
- **AND** also cached to localStorage as fallback
- **AND** the user is navigated to MY_MAP

### Requirement: Onboarding Flow Navigation Logic
The system SHALL check Supabase for existing profiles in addition to localStorage.

#### Scenario: Returning user profile check includes Supabase
- **GIVEN** the user is on the LANDING page
- **WHEN** checking for existing profile
- **THEN** the system first queries Supabase `profiles` table by userId
- **AND** falls back to localStorage if Supabase is unavailable
- **AND** a profile from either source skips onboarding to MY_MAP
