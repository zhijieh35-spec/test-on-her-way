# Design: HacktheWorld AI Backend Integration

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    test-on-her-way Frontend                     │
├─────────────────────────────────────────────────────────────────┤
│  VoiceCallModal (onboarding mode)                               │
│  ├── chatApi prop → /api/chat                                   │
│  └── onCallEnd → receives PublicProfile                         │
│                                                                 │
│  OnboardingProfilePopup                                         │
│  ├── Displays profile.tags (role_detail, location, etc.)        │
│  └── onContinue → saves to Supabase                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API Routes                            │
├─────────────────────────────────────────────────────────────────┤
│  /api/chat (POST)                                               │
│  ├── Mode A: Onboarding (profile extraction)                   │
│  │   └── System prompt: PROMPT_ROLE_A                          │
│  │   └── Extracts JSON from AI response                        │
│  │   └── Saves to Supabase profiles table                      │
│  └── Mode B: Counseling (after profile saved)                  │
│      └── System prompt: PROMPT_ROLE_B + user context           │
│                                                                 │
│  /api/ai-call (POST)                                            │
│  └── Direct Gemini proxy for simple completions                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
├─────────────────────────────────────────────────────────────────┤
│  Google Gemini             │  Supabase                         │
│  ├── Text-based LLM API     │  ├── profiles table               │
│  └── Profile extraction     │  │   id, attributes (JSONB)       │
│                             │  ├── conversations table          │
│                             │  │   user_id, title, metadata     │
│                             │  └── messages table               │
│                             │      conversation_id, role, content│
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Onboarding Conversation Flow

```
1. User starts onboarding
   └── VoiceCallModal(mode='onboarding')

2. Each user message
   └── chatApi({ userId, messages })
       └── POST /api/chat
           └── Mode A: PROMPT_ROLE_A + messages
               └── GLM-4.7 generates response
               └── Stores message in Supabase

3. After ~5 turns (AI determines)
   └── AI response includes ```json profile block
       └── Backend parses JSON
           └── Extracts user_profile
           └── Upserts to profiles table
           └── Updates conversation metadata
           └── Returns ChatResponse with profile

4. Frontend receives profile
   └── VoiceCallModal.onCallEnd(transcription, profile)
       └── OnboardingProfilePopup(profile)
           └── User can edit
           └── onContinue saves final version
```

## Key Components to Copy from HacktheWorld

### 1. API Routes

| Source Path | Target Path |
|-------------|-------------|
| `my-app/app/api/chat/route.ts` | `app/api/chat/route.ts` |
| `my-app/app/api/chat/prompts.ts` | `app/api/chat/prompts.ts` |
| `my-app/app/api/ai-call/route.ts` | `app/api/ai-call/route.ts` |
| `my-app/lib/supabaseClient.ts` | `lib/supabaseClient.ts` |

### 2. Profile Data Mapping

HacktheWorld Response:
```json
{
  "status": "completed",
  "user_profile": {
    "role_detail": "上班族，从事运营工作",
    "location": "上海",
    "experience": "独居，经常点外卖",
    "hassle": "觉得生活没规律，想自己做饭但坚持不下来",
    "goal": "通过小改变找回生活掌控感"
  }
}
```

Maps to PublicProfile.tags:
```typescript
{
  role_detail: string,  // 职业详情
  location: string,     // 位置
  experience: string,   // 经验
  hassle: string,       // 困扰
  goal: string          // 目标
}
```

### 3. Environment Variables

```env
ZHIPUAI_API_KEY=xxx
SUPABASE_URL=https://bqzgdigtofzcbbweonan.supabase.co
SUPABASE_ANON_KEY=xxx
```

## Trade-offs & Decisions

### Decision 1: Replace Gemini with GLM-4.7
- **Chosen**: Use ZhipuAI GLM-4.7 (same as HacktheWorld)
- **Rationale**: GLM-4.7 prompts are already tuned for Chinese conversation and profile extraction
- **Trade-off**: Requires ZhipuAI API key, but profile extraction is proven to work

### Decision 2: Supabase vs Firebase
- **Chosen**: Supabase (PostgreSQL)
- **Rationale**: HacktheWorld already uses Supabase with working schema
- **Trade-off**: Need to share or duplicate Supabase project

### Decision 3: Profile Generation Timing
- **Chosen**: AI decides when to generate (after ~5 turns)
- **Rationale**: More natural conversation flow
- **Alternative**: Fixed turn count or explicit user trigger

## Database Schema (from HacktheWorld)

```sql
-- profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  attributes JSONB,  -- { role_detail, location, experience, hassle, goal }
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  title TEXT,
  metadata JSONB,  -- { saved_profile: bool, status: string }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  role TEXT,  -- 'user' | 'ai'
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Integration Points

### VoiceCallModal Changes

Current:
```typescript
interface VoiceCallModalProps {
  chatApi?: (req: ChatRequest) => Promise<ChatResponse>;
  // ...
}
```

The `chatApi` prop already exists. Implementation:
```typescript
const handleChatApi = async (req: ChatRequest): Promise<ChatResponse> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  return response.json();
};

<VoiceCallModal
  mode="onboarding"
  chatApi={handleChatApi}
  // ...
/>
```

### Profile Popup Changes

OnboardingProfilePopup already accepts `PublicProfile`:
```typescript
interface OnboardingProfilePopupProps {
  profile: PublicProfile;
  onContinue: () => void;
}
```

Need to add save-to-Supabase on continue:
```typescript
const handleContinue = async () => {
  await fetch('/api/profiles', {
    method: 'PUT',
    body: JSON.stringify({ userId, profile: editedProfile })
  });
  onContinue();
};
```
