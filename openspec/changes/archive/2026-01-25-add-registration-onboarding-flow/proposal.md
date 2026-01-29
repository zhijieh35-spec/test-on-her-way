# Change: Add Registration Onboarding Flow (Frontend Only)

## Why
需要预留前端接口，方便后续接入 `C:\Users\X1 Yoga\Desktop\HacktheWorld\my-app` 的后端服务。当前只实现前端界面和类型定义，不包含后端代码或AI功能。

## What Changes
- **MODIFIED**: Registration flow 预留后端API调用接口（目前直接成功）
- **ADDED**: Registration success → "开始探索" 页面 (LANDING)
- **ADDED**: 点击"开始探索"后的分支逻辑:
  - **首次用户** (无 profile): AI来电 → 对话 → 生成 profile popup → 点击"创建MY WAY" → MY WAY 主页
  - **老用户** (已有 profile): 直接进入 MY WAY 主页
- **ADDED**: New onboarding AI call screen (复用 VoiceCallModal):
  - 来电界面: Title "hi！欢迎来到 on her way!", Subtitle "我们先随便聊几句，互相认识一下彼此？"
  - 来电界面头像: 星星 logo (如截图)
  - 通话界面: 复用现有 VoiceCallModal UI
  - 预留 `chatApi` 和 `onCallEnd` 回调接口
- **ADDED**: After onboarding call ends, displays a user profile popup with:
  - Left side: User profile card with PublicProfile data (name, avatar, tags)
  - Right side: Vertical timeline showing LifeExperience entries
  - Bottom: "创建MY WAY" 按钮
  - 使用 mock 数据展示，预留 `profile: PublicProfile` prop 接口
- **ADDED**: New TypeScript interfaces (兼容 my-app 后端):
  - `PublicProfile` - 用户画像
  - `LifeExperience` - 人生经历时间线

## Flow Chart
```
REGISTRATION → (注册成功) → LANDING ("开始探索")
                                    ↓ 点击"开始探索"
                         ┌──────────┴──────────┐
                         ↓                     ↓
                   [无 profile]           [已有 profile]
                         ↓                     ↓
                   ONBOARDING              直接进入
                   (AI来电)                MY_MAP
                         ↓
                   对话结束
                         ↓
                   Profile Popup
                   ("创建MY WAY")
                         ↓
                      MY_MAP
```

## Impact
- Affected specs: `user-auth`, `onboarding-flow` (new capability)
- Affected code:
  - `components/RegistrationView.tsx` - 预留 `onRegisterApi?: (data) => Promise<Response>` 接口
  - `types.ts` - add PublicProfile, LifeExperience interfaces
  - `App.tsx` - add ONBOARDING view mode, profile check logic, profile popup state
  - `onHerWay/components/LandingView.tsx` - update to check profile before navigation
  - `onHerWay/components/VoiceCallModal.tsx` - 添加 onboarding 模式支持 (props 控制文案)
  - New component: `OnboardingProfilePopup.tsx` - profile display popup with "创建MY WAY" button
