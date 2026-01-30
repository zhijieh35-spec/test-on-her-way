# Proposal: Integrate HacktheWorld AI Backend

## Why

The current test-on-her-way project uses Google Gemini for AI conversations during onboarding, but lacks the profile extraction and Supabase storage capabilities implemented in the HacktheWorld project. By reusing HacktheWorld's proven backend:

1. **Profile Extraction**: HacktheWorld's GLM-4.7 backend intelligently extracts user profile (role_detail, location, experience, hassle, goal) through natural conversation
2. **Supabase Integration**: Persistent storage instead of localStorage enables cross-device sync and data analytics
3. **Two-Mode System**: HacktheWorld's onboarding → counseling mode switching provides a polished user experience
4. **Reduced Development**: Reuse existing, tested backend rather than rebuilding

## Known Bug to Fix

> **BUG**: HacktheWorld 的 `/api/chat` 返回响应中没有直接返回提取到的 profile，只返回：
> ```json
> {
>   "success": true,
>   "data": "finalUserMessage",
>   "conversationId": "xxx"
> }
> ```
>
> **修复方案**: 在复制到本项目时，需要修改返回值，添加 `profile` 字段：
> ```json
> {
>   "success": true,
>   "data": "finalUserMessage",
>   "conversationId": "xxx",
>   "profile": { "role_detail": "...", "location": "...", ... }
> }
> ```
>
> 具体修改：
> 1. 添加 `let extractedProfile = null;` 变量
> 2. 在提取到 profile 时保存到 `extractedProfile`
> 3. 在返回的 JSON 中新增 `profile: extractedProfile` 字段

## API Migration: ZhipuAI → Gemini

> **重要**: 复用时需要将 ZhipuAI 接口替换为本项目的 Gemini 接口
>
> **步骤 1: 安装 SDK**
> ```bash
> npm install @google/generative-ai
> ```
>
> **步骤 2: 修改环境变量** (.env.local):
> ```
> GOOGLE_API_KEY=your_google_api_key
> ```
>
> **步骤 3: 修改代码调用方式**
>
> **原代码 (HacktheWorld)**:
> ```typescript
> import { ZhipuAI } from 'zhipuai';
> const zhipu = new ZhipuAI({ apiKey: process.env.ZHIPU_API_KEY });
> const completion = await zhipu.chat.completions.create({
>   model: "glm-4.7",
>   messages: [
>     { role: "system", content: systemPrompt },
>     ...contextMessages,
>     { role: "user", content: message }
>   ],
>   temperature: 0.8,
> });
> const aiRawContent = completion.choices[0].message.content || "";
> ```
>
> **修改为 (本项目)**:
> ```typescript
> import { GoogleGenerativeAI } from '@google/generative-ai';
>
> const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
> const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
>
> // 组装历史消息 (Gemini 格式)
> const chatHistory = contextMessages.map(msg => ({
>   role: msg.role === 'assistant' ? 'model' : 'user',
>   parts: [{ text: msg.content }]
> }));
>
> const chat = model.startChat({
>   history: chatHistory,
>   generationConfig: { temperature: 0.8 },
>   systemInstruction: systemPrompt,
> });
>
> const result = await chat.sendMessage(message);
> const aiRawContent = result.response.text() || "";
> ```
>
> **注意**: API Key 只在服务端使用，不会暴露给客户端

## What Changes

### 1. Backend API Integration
- Copy HacktheWorld's `/api/chat` and `/api/ai-call` routes to this project
- Configure Supabase client with existing HacktheWorld credentials
- Adapt prompts (PROMPT_ROLE_A) to match On Her Way's personality

### 2. VoiceCallModal Backend Hook
- Wire VoiceCallModal's existing `chatApi` prop to call `/api/chat`
- Map response profile to `PublicProfile` interface
- Handle mode switching (onboarding → counseling)

### 3. Profile Storage Migration
- Replace localStorage with Supabase `profiles` table
- Map HacktheWorld's `attributes` JSONB to PublicProfile tags
- Add conversation persistence to `messages` table

### 4. UI Profile Interface
- Connect OnboardingProfilePopup to receive API-generated profile
- Map extracted tags to existing UI components
- Store edited profile back to Supabase

## Affected Specs

| Spec | Delta Type | Description |
|------|-----------|-------------|
| onboarding-flow | MODIFIED | Add Supabase backend integration, update chatApi requirement |
| voice-call | MODIFIED | Add /api/chat integration scenario |
| NEW: backend-api | ADDED | Define /api/chat and /api/ai-call endpoints |
| NEW: profile-storage | ADDED | Define Supabase profile persistence |

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| ZhipuAI API key exposure | Use environment variables, not hardcoded keys |
| GLM API rate limits | Implement request throttling and error handling |
| Supabase downtime | Fallback to localStorage cache |
| Profile schema mismatch | Validate and transform API response before UI binding |

## Out of Scope

- Voice/audio processing (HacktheWorld uses text-only, not real voice calls)
- Report generation (`/api/generate-report` - can be added later)
- User authentication (reuse existing auth flow)
