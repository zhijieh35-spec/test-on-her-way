## 1. Types & Interfaces (兼容 my-app 后端)
- [x] 1.1 Add `PublicProfile` interface to `types.ts`:
  ```typescript
  interface PublicProfile {
    id: string;
    name: string;
    avatar: string;
    tags: {
      role_detail: string;
      location: string;
      experience: string;
      hassle: string;
      goal: string;
    };
    lifeTimeline: LifeExperience[];
    reflections: ReflectionPiece[];
  }
  ```
- [x] 1.2 Add `LifeExperience` interface:
  ```typescript
  interface LifeExperience {
    id: string;
    title: string;
    description: string;
    year: string;
  }
  ```
- [x] 1.3 Add `ViewMode.ONBOARDING` enum value
- [x] 1.4 Add `RegisterRequest`, `RegisterResponse` interfaces
- [x] 1.5 Add `ChatRequest`, `ChatResponse` interfaces (兼容 my-app /api/chat)

## 2. Registration View Updates
- [x] 2.1 Add optional `onRegisterApi?: (data: RegisterRequest) => Promise<RegisterResponse>` prop to RegistrationView
- [x] 2.2 Add loading state during API call (if provided)
- [x] 2.3 Add "注册成功" success state to button after successful response
- [x] 2.4 After success, navigate to LANDING ("开始探索" 页面)
- [x] 2.5 Default behavior: if no API provided, proceed directly (current behavior)

## 3. Landing View Updates
- [x] 3.1 Modify LandingView `onStart` handler to check if user has profile
- [x] 3.2 If no profile (首次用户): navigate to ONBOARDING (AI来电)
- [x] 3.3 If has profile (老用户): navigate directly to MY_MAP

## 4. VoiceCallModal Onboarding 模式 (复用现有组件)
- [x] 4.1 Add `mode?: 'normal' | 'onboarding'` prop to VoiceCallModal
- [x] 4.2 When mode='onboarding', 来电界面显示:
  - Title: "hi！欢迎来到 on her way!"
  - Subtitle: "我们先随便聊几句，互相认识一下彼此？"
  - Avatar: 星星 logo (替换原有头像)
- [x] 4.3 通话界面保持不变，复用现有 UI
- [x] 4.4 Add props: `userId: string`, `chatApi?: (req: ChatRequest) => Promise<ChatResponse>`
- [x] 4.5 Add `onCallEnd` callback with signature: `(result: { transcriptionHistory: string[]; reason: string; profile?: PublicProfile }) => void`

## 5. Onboarding Profile Popup (UI Only)
- [x] 5.1 Create `OnboardingProfilePopup.tsx` component (可复用 PersonaModal 结构)
- [x] 5.2 Accept `profile: PublicProfile` prop for data display
- [x] 5.3 Left side: Avatar, name, and 5 tag rows (Identity/Location/Experience/Hassle/Goal with icons)
- [x] 5.4 Right side: Vertical timeline with dots + lines showing `lifeTimeline` entries
- [x] 5.5 Bottom: "创建MY WAY" 按钮 with `onContinue: () => void` callback
- [x] 5.6 Add mock data constant `MOCK_ONBOARDING_PROFILE` to `constants.ts` (lifeTimeline 写死3条)

## 6. App Flow Integration
- [x] 6.1 Add `ONBOARDING` to ViewMode enum in types.ts
- [x] 6.2 Add state: `publicProfile: PublicProfile | null` (存储用户画像)
- [x] 6.3 Add state: `showOnboardingProfilePopup: boolean`
- [x] 6.4 Update flow: REGISTRATION → LANDING → (check profile) → ONBOARDING or MY_MAP
- [x] 6.5 Pass `userId` (from currentUser) to OnboardingCallModal
- [x] 6.6 Handle onboarding call end → show profile popup (use mock data or result.profile)
- [x] 6.7 Handle "创建MY WAY" click → save profile to state/localStorage → navigate to MY_MAP
- [x] 6.8 On app load, check localStorage for existing profile to determine user type

## 7. Manual QA
- [x] 7.1 Test 首次用户 flow: Registration → Landing → AI Call → Profile Popup → MY_MAP
- [x] 7.2 Test 老用户 flow: Registration/Login → Landing → directly to MY_MAP
- [x] 7.3 Verify profile persistence in localStorage
- [x] 7.4 Verify UI matches existing dark theme / space aesthetic
- [x] 7.5 Verify bilingual UI copy consistency
