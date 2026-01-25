# Change: Add User Registration Page

## Why
Currently, users can access the app directly without any authentication. We need to add a registration flow at the very beginning of the user journey to:
- Create user accounts with unique identifiers
- Collect basic user information (nickname, account, password)
- Establish user identity before they start using the app

## What Changes
- Add a new registration page that appears before the landing page
- Registration form fields: user nickname (昵称), user account (账号), user password (密码)
- User avatar is fixed/placeholder for now (will be customizable later)
- Each registered user gets an auto-generated unique user ID
- Update navigation flow: Registration → Landing → MY_MAP
- Store user data locally (no backend API yet, using localStorage or in-memory state)
- **BREAKING**: App entry point changes from Landing to Registration

## Impact
- Affected specs: `app-navigation` (modified), `user-auth` (new capability)
- Affected code (expected): 
  - `App.tsx` - Add REGISTRATION view mode, registration state management
  - `types.ts` - Add User interface, RegistrationViewMode enum
  - New component: `components/RegistrationView.tsx`
  - Update `ViewMode` enum to include `REGISTRATION`
- User-facing behavior: Users must register before accessing the app (**BREAKING** for existing flow)

## Non-Goals
- Login/authentication flow (only registration for now)
- Password validation rules (basic implementation)
- Email verification
- Backend API integration
- Avatar customization (fixed for now)
- Remember me / auto-login functionality

