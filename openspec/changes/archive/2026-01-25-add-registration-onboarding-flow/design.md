## Context
此变更仅实现前端界面和接口预留，后续将接入 `C:\Users\X1 Yoga\Desktop\HacktheWorld\my-app` 的后端服务。

参考项目后端技术栈：
- Next.js API routes
- Supabase 数据库
- ZhipuAI (GLM-4.7) 对话AI

当前项目：
- Vite + React SPA（无后端）
- Google Gemini AI（现有 mentor 功能）
- localStorage 客户端存储

## Goals / Non-Goals

**Goals:**
- 定义与 my-app 后端兼容的 TypeScript 接口
- 创建预留 API 回调接口的前端组件
- 实现完整的 UI 流程（使用 mock 数据）
- 保持双语（中英文）UI 一致性

**Non-Goals:**
- 实现后端 API 代码
- 实现 AI 对话功能
- Supabase 集成
- 真实的用户认证/会话管理

## Decisions

### 1. 接口预留策略（兼容 my-app 后端）
- **Decision**: 组件通过 optional props 接收 API 函数，默认使用 mock 行为
- **Rationale**: 方便后续注入真实 API，无需修改组件内部逻辑
- **Interfaces**:
  ```typescript
  // RegistrationView - 预留注册 API
  interface RegistrationViewProps {
    onRegister: (user: User) => void;
    onRegisterApi?: (data: RegisterRequest) => Promise<RegisterResponse>;
  }

  // OnboardingCallModal - 兼容 my-app /api/chat 接口
  interface OnboardingCallModalProps {
    userId: string;  // my-app 后端 /api/chat 需要 userId
    onCallEnd: (result: {
      transcriptionHistory: string[];
      reason: 'declined' | 'ended' | 'error';
      profile?: PublicProfile;  // 对话完成时返回生成的 profile
    }) => void;
    chatApi?: (req: ChatRequest) => Promise<ChatResponse>;  // 预留聊天 API
  }

  // ChatRequest/ChatResponse - 兼容 my-app /api/chat
  interface ChatRequest {
    userId: string;
    messages: { role: 'user' | 'assistant'; content: string }[];
  }
  interface ChatResponse {
    content: string;
    profile?: PublicProfile;  // 首次对话结束时返回
  }

  // OnboardingProfilePopup - 接收 profile 数据
  interface OnboardingProfilePopupProps {
    profile: PublicProfile;
    onContinue: () => void;
  }
  ```

### 2. 类型定义（兼容 my-app）
- **Decision**: 直接复用 my-app 的类型定义
- **Source**: `C:\Users\X1 Yoga\Desktop\HacktheWorld\my-app\lib\types.ts`
- **Types**:
  ```typescript
  export interface PublicProfile {
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
  }

  export interface LifeExperience {
    id: string;
    title: string;
    description: string;
    year: string;
  }
  ```

### 3. Mock 数据策略
- **Decision**: 创建 `MOCK_ONBOARDING_PROFILE` 常量用于开发和演示
- **Rationale**: 无需后端即可完整测试 UI 流程
- **Location**: `constants.ts`
- **lifeTimeline 写死示例**:
  ```typescript
  const MOCK_ONBOARDING_PROFILE: PublicProfile = {
    id: 'mock_user_1',
    name: '探索者',
    avatar: 'https://i.pravatar.cc/150?u=onboarding',
    tags: {
      role_detail: '互联网产品经理，3年经验',
      location: '上海',
      experience: '从0到1搭建过用户增长体系',
      hassle: '职业发展方向迷茫，不确定下一步',
      goal: '找到真正热爱的事业方向',
    },
    lifeTimeline: [
      { id: 't1', year: '2020', title: '初次探索', description: '第一份互联网工作，开始了解产品思维' },
      { id: 't2', year: '2022', title: '职业转型', description: '从运营转向产品，开始新的挑战' },
      { id: 't3', year: '2024', title: '觉醒时刻', description: '意识到需要找到真正的人生方向' },
    ],
  };
  ```

### 4. VoiceCallModal Onboarding 模式 (复用现有组件)
- **Decision**: 在现有 VoiceCallModal 添加 `mode` prop，而不是创建新组件
- **Rationale**: 减少代码重复，复用现有 UI 逻辑
- **Props 扩展**:
  ```typescript
  interface VoiceCallModalProps {
    onClose: (result: { transcriptionHistory: string[]; reason: string; profile?: PublicProfile }) => void;
    mode?: 'normal' | 'onboarding';  // 新增
    userId?: string;  // 新增
    chatApi?: (req: ChatRequest) => Promise<ChatResponse>;  // 新增
  }
  ```
- **来电界面文案** (mode='onboarding'):
  - Title: "hi！欢迎来到 on her way!"
  - Subtitle: "我们先随便聊几句，互相认识一下彼此？"
  - Avatar: 星星 logo
- **通话界面**: 保持不变，复用现有 UI

### 5. Profile Popup
- **Decision**: 创建 `OnboardingProfilePopup` 组件，可复用 `PersonaModal` 结构
- **Rationale**: 保持 UI 一致性，减少重复代码
- **显示时机**: 对话结束后立即显示 profile popup
- **按钮文案**: "创建MY WAY" (点击后进入 MY_MAP)

### 6. 页面跳转流程
```
REGISTRATION → (注册成功) → LANDING ("开始探索")
                                    ↓ 点击"开始探索"
                    ┌───────────────┴───────────────┐
                    ↓                               ↓
              [无 profile]                    [已有 profile]
              (首次用户)                        (老用户)
                    ↓                               ↓
              ONBOARDING                        直接进入
              (AI来电界面)                       MY_MAP
                    ↓
              对话结束
                    ↓
              Profile Popup
              ("创建MY WAY" 按钮)
                    ↓
                 MY_MAP
```
- **Profile 存储**: localStorage key `publicProfile`
- **判断逻辑**: `const hasProfile = !!localStorage.getItem('publicProfile')`

### 7. 后续接入后端
接入 my-app 后端时需要：
1. 在 App.tsx 传入 `onRegisterApi` 调用 `/api/users` 注册接口
2. 在 OnboardingCallModal 传入 `chatApi` 调用 `/api/chat` 接口
3. `chatApi` 返回的 `profile` 直接传给 `OnboardingProfilePopup`
4. 用户 `userId` 从注册响应或 localStorage 获取

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 类型定义与 my-app 不同步 | 直接复制 my-app 类型，后续统一管理 |
| Mock 数据影响测试 | 明确标注 mock 数据，易于替换 |

## Migration Plan
N/A - 新功能，无需迁移

## Open Questions
无 - 所有问题已明确
