## MODIFIED Requirements

### Requirement: User Registration
The system SHALL provide a registration page that collects user information, optionally calls a backend API, and creates a new user account.

#### Scenario: User opens the app for the first time
- **WHEN** the user visits the app root URL
- **THEN** the registration page is displayed
- **AND** the registration form contains fields for: nickname (昵称), account (账号), and password (密码)
- **AND** a fixed/placeholder avatar is displayed

#### Scenario: User completes registration (without backend API)
- **GIVEN** the registration page is displayed
- **AND** no backend API is configured
- **WHEN** the user fills in nickname, account, and password
- **AND** the user clicks the "注册" (Register) button
- **THEN** a unique user ID is generated client-side
- **AND** the button displays "注册成功" (Registration Successful)
- **AND** the user data is stored locally
- **AND** the user is navigated to the onboarding AI call screen

#### Scenario: User completes registration (with backend API)
- **GIVEN** the registration page is displayed
- **AND** a backend API function is provided via props
- **WHEN** the user fills in nickname, account, and password
- **AND** the user clicks the "注册" (Register) button
- **THEN** a loading state is displayed on the button
- **AND** the API function is called with registration data
- **AND** upon successful response, the button displays "注册成功"
- **AND** the user is navigated to the onboarding AI call screen

#### Scenario: User attempts registration with empty fields
- **GIVEN** the registration page is displayed
- **WHEN** the user attempts to submit the form with empty fields
- **THEN** the form validation prevents submission
- **AND** appropriate error messages are displayed

## ADDED Requirements

### Requirement: Registration API Interface
The RegistrationView component SHALL accept an optional API callback prop for backend integration.

#### Scenario: API interface defined
- **GIVEN** the RegistrationView component is implemented
- **THEN** it accepts an optional `onRegisterApi` prop
- **AND** the prop type is `(data: RegisterRequest) => Promise<RegisterResponse>`
- **AND** RegisterRequest includes: nickname, account, password
- **AND** RegisterResponse includes: success, userId, message (optional)
