# backend-api Specification Delta

## ADDED Requirements

### Requirement: AI Chat Endpoint
The system SHALL provide a `/api/chat` endpoint that handles conversational AI with profile extraction.

#### Scenario: Onboarding conversation with profile extraction
- **GIVEN** a user starts an onboarding conversation
- **AND** no profile exists for the user
- **WHEN** the frontend sends POST to `/api/chat` with `{ userId, messages }`
- **THEN** the endpoint uses Mode A (PROMPT_ROLE_A) for onboarding
- **AND** the AI conducts natural conversation to learn about the user
- **AND** after ~5 turns, the AI appends a JSON code block with user_profile
- **AND** the endpoint parses the JSON and extracts user_profile fields
- **AND** the endpoint saves the profile to Supabase `profiles` table
- **AND** the response includes `{ content: string, profile?: PublicProfile }`

#### Scenario: Counseling conversation after profile exists
- **GIVEN** a user has an existing profile in Supabase
- **WHEN** the frontend sends POST to `/api/chat` with `{ userId, messages }`
- **THEN** the endpoint uses Mode B (PROMPT_ROLE_B) for counseling
- **AND** the AI provides empathetic guidance using the user's profile context
- **AND** no JSON extraction is performed

#### Scenario: Message persistence
- **WHEN** any message is sent or received
- **THEN** it is stored in Supabase `messages` table with conversation_id, role, and content
- **AND** a conversation record exists or is created in `conversations` table

### Requirement: GLM AI Call Proxy
The system SHALL provide a `/api/ai-call` endpoint for direct GLM model access.

#### Scenario: Simple completion request
- **WHEN** the frontend sends POST to `/api/ai-call` with `{ messages, options? }`
- **THEN** the endpoint forwards the request to ZhipuAI GLM-4.7
- **AND** returns the AI response as `{ content: string }`

#### Scenario: API key security
- **GIVEN** the ZHIPUAI_API_KEY is stored in environment variables
- **WHEN** any request is made to AI endpoints
- **THEN** the API key is never exposed to the client
- **AND** the key is read from process.env.ZHIPUAI_API_KEY

### Requirement: Profile CRUD Endpoint
The system SHALL provide a `/api/profiles` endpoint for profile management.

#### Scenario: Get user profile
- **WHEN** the frontend sends GET to `/api/profiles?userId=xxx`
- **THEN** the endpoint returns the profile from Supabase
- **AND** the response maps `attributes` JSONB to PublicProfile.tags format

#### Scenario: Update user profile
- **WHEN** the frontend sends PUT to `/api/profiles` with `{ userId, profile }`
- **THEN** the endpoint upserts the profile to Supabase `profiles` table
- **AND** the `updated_at` timestamp is set to current time
