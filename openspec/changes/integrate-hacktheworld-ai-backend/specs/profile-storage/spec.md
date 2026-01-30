# profile-storage Specification Delta

## ADDED Requirements

### Requirement: Supabase Profile Persistence
The system SHALL store user profiles in Supabase instead of localStorage for persistence.

#### Scenario: Profile saved during onboarding
- **GIVEN** the user completes an onboarding conversation
- **AND** the AI extracts a user_profile from the conversation
- **WHEN** the `/api/chat` endpoint receives the profile JSON
- **THEN** the profile is upserted to the Supabase `profiles` table
- **AND** the `id` field matches the userId
- **AND** the `attributes` JSONB contains role_detail, location, experience, hassle, goal

#### Scenario: Profile loaded on app start
- **GIVEN** a returning user opens the app
- **WHEN** the app checks for existing profile
- **THEN** it queries Supabase `profiles` table by userId
- **AND** falls back to localStorage if Supabase is unreachable
- **AND** maps the `attributes` JSONB to PublicProfile.tags

#### Scenario: Edited profile saved
- **GIVEN** the user edits their profile in OnboardingProfilePopup
- **WHEN** the user clicks "开始MY WAY" (continue)
- **THEN** the edited profile is sent to `/api/profiles` PUT endpoint
- **AND** the Supabase record is updated with the new values

### Requirement: Profile Data Schema
The Supabase `profiles` table SHALL use the following schema.

#### Scenario: Profile table structure
- **GIVEN** the Supabase database is configured
- **THEN** the `profiles` table has columns:
  - `id` (UUID, primary key) - matches userId
  - `attributes` (JSONB) - stores tag values
  - `updated_at` (TIMESTAMPTZ) - last modification time

#### Scenario: Attributes JSONB structure
- **GIVEN** a profile is stored
- **THEN** the `attributes` field contains:
  ```json
  {
    "role_detail": "string - user's occupation/role",
    "location": "string - user's location",
    "experience": "string - notable life experience",
    "hassle": "string - current challenges",
    "goal": "string - aspirations"
  }
  ```

### Requirement: Conversation History Persistence
The system SHALL store conversation history in Supabase for continuity.

#### Scenario: Conversation created
- **GIVEN** a user starts a new conversation
- **WHEN** the first message is sent
- **THEN** a record is created in `conversations` table with user_id and title
- **AND** the metadata JSONB tracks conversation state

#### Scenario: Messages stored
- **WHEN** any message is exchanged during conversation
- **THEN** it is inserted into `messages` table
- **AND** the record includes conversation_id, role ('user' or 'ai'), content, and timestamp

#### Scenario: Profile completion tracked
- **GIVEN** the onboarding conversation extracts a profile
- **WHEN** the profile is saved
- **THEN** the conversation metadata is updated with `{ saved_profile: true, status: 'onboarding_completed' }`
