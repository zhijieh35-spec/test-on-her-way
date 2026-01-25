## 1. Implementation

### 1.1 Type Definitions
- [x] Add `REGISTRATION` to `ViewMode` enum in `types.ts`
- [x] Create `User` interface in `types.ts` with fields: `id`, `nickname`, `account`, `password`, `avatar`
- [x] Add user state management type if needed

### 1.2 Registration Component
- [x] Create `components/RegistrationView.tsx` component
- [x] Implement registration form with three fields: nickname, account, password
- [x] Add fixed/placeholder avatar display
- [x] Implement form validation (basic: non-empty fields)
- [x] Generate unique user ID on registration (e.g., using timestamp + random string)
- [x] Handle form submission and store user data locally (localStorage or state)
- [x] Add "注册" (Register) button that navigates to Landing page after successful registration

### 1.3 App Integration
- [x] Update `App.tsx` to start with `ViewMode.REGISTRATION` instead of `ViewMode.LANDING`
- [x] Add user state management in `App.tsx` to store current user
- [x] Pass user data to components that need it (e.g., Sidebar, ProfileView)
- [x] Update navigation flow: Registration → Landing → MY_MAP

### 1.4 Styling
- [x] Style registration form to match app design (dark theme, space aesthetic)
- [x] Ensure responsive design for mobile and desktop
- [x] Add loading/transition states if needed

## 2. Testing
- [x] Test registration flow: fill form → submit → navigate to landing
- [x] Verify user ID is generated and unique
- [x] Verify user data is stored and accessible
- [x] Test form validation (empty fields)
- [x] Verify fixed avatar displays correctly

