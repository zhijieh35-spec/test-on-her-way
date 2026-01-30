# Tasks

## 0. Bug Fix & API Migration (复制前必须修复)
- [x] 0.1 **修复 `/api/chat` 返回值缺少 profile 字段的 bug**
  - 原问题：HacktheWorld 的 API 只返回 `{ success, data, conversationId }`，没有返回提取到的 profile
  - 修复：添加 `extractedProfile` 变量，在返回值中添加 `profile: extractedProfile`
  - **已完成**：在 `chatApiService.ts` 中实现了 profile 提取和返回
- [x] 0.2 **将 ZhipuAI 接口替换为 Gemini 接口**
  - 使用项目现有的 `@google/genai` SDK
  - 调整消息格式：Gemini 使用 `{ role: 'model', parts: [{ text }] }` 格式
  - **已完成**：在 `chatApiService.ts` 中使用 Gemini API

## 1. Backend API Setup (适配为前端服务)
> **注意**：本项目是 Vite 前端项目，不是 Next.js，因此不使用 API routes，改为前端服务

- [x] 1.1 Create `onHerWay/services/chatApiService.ts` - 前端聊天服务 (使用 Gemini)
- [x] 1.2 Create `onHerWay/services/prompts.ts` - PROMPT_ROLE_A and PROMPT_ROLE_B
- [ ] 1.3 ~~Create `app/api/ai-call/route.ts`~~ - 不需要，直接使用 geminiService.ts
- [ ] 1.4 ~~Create `lib/supabaseClient.ts`~~ - 暂不需要，使用 localStorage
- [ ] 1.5 ~~Add environment variables~~ - 已使用现有的 API_KEY 配置

## 2. Prompt Customization
- [x] 2.1 Adapt PROMPT_ROLE_A to match On Her Way's "AI 导师" personality
- [x] 2.2 Update greeting to align with "我们先随便聊几句，互相认识一下彼此？"
- [x] 2.3 Verify profile extraction JSON format matches PublicProfile.tags

## 3. Frontend Integration
- [x] 3.1 Create chatApi wrapper function in onHerWay/services/chatApiService.ts
- [x] 3.2 Wire VoiceCallModal to use chatApi prop when mode='onboarding'
- [x] 3.3 Handle ChatResponse.profile in onCallEnd callback
- [x] 3.4 Pass API-generated profile to OnboardingProfilePopup

## 4. Profile Storage
> **注意**：暂时使用 localStorage，Supabase 集成可后续添加

- [ ] 4.1 ~~Create `app/api/profiles/route.ts`~~ - 暂不需要
- [x] 4.2 OnboardingProfilePopup saves profile to localStorage on continue (已有功能)
- [ ] 4.3 Update login flow to check Supabase for existing profile (fallback to localStorage)
- [ ] 4.4 Map Supabase `attributes` JSONB to PublicProfile.tags format

## 5. Testing & Validation
- [ ] 5.1 Test onboarding conversation flow end-to-end
- [ ] 5.2 Verify profile extraction from Gemini response
- [ ] 5.3 Verify profile display in OnboardingProfilePopup
- [ ] 5.4 Test profile edit and save
- [ ] 5.5 Test returning user flow (profile loaded from localStorage)

## 6. Bug Fixes
- [x] 6.1 **Fix conversation state not resetting on new onboarding**
  - Added `resetConversationState` call in `handleStartOnboarding`
  - Ensures each onboarding session starts fresh
- [ ] 6.2 **Debug profile extraction** (added console.log for debugging)

---

## Implementation Notes

### Files Created
1. `onHerWay/services/prompts.ts` - PROMPT_ROLE_A and PROMPT_ROLE_B
2. `onHerWay/services/chatApiService.ts` - Onboarding chat API with profile extraction

### Files Modified
1. `onHerWay/components/VoiceCallModal.tsx`
   - Added `extractedProfileRef` to track extracted profile
   - Updated `handleUserMessage` to capture profile from chatApi response
   - Updated `handleClose` to include profile in result
2. `App.tsx`
   - Imported `onboardingChatApi` from chatApiService
   - Passed `chatApi={onboardingChatApi}` to VoiceCallModal in onboarding mode
