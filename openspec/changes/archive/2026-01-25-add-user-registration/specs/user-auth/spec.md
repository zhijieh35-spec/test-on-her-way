## ADDED Requirements

### Requirement: User Registration
The system SHALL provide a registration page that collects user information and creates a new user account.

#### Scenario: User opens the app for the first time
- **WHEN** the user visits the app root URL
- **THEN** the registration page is displayed
- **AND** the registration form contains fields for: nickname (昵称), account (账号), and password (密码)
- **AND** a fixed/placeholder avatar is displayed

#### Scenario: User completes registration
- **GIVEN** the registration page is displayed
- **WHEN** the user fills in nickname, account, and password
- **AND** the user clicks the "注册" (Register) button
- **THEN** a unique user ID is automatically generated
- **AND** the user account is created with the provided information
- **AND** the user is navigated to the landing page
- **AND** the user data is stored locally

#### Scenario: User attempts registration with empty fields
- **GIVEN** the registration page is displayed
- **WHEN** the user attempts to submit the form with empty fields
- **THEN** the form validation prevents submission
- **AND** appropriate error messages are displayed

### Requirement: User ID Generation
The system SHALL automatically generate a unique user ID for each registered user.

#### Scenario: User registers
- **WHEN** a new user completes registration
- **THEN** a unique user ID is generated and assigned to the user
- **AND** the user ID is stored with the user's account information

### Requirement: Fixed User Avatar
The system SHALL display a fixed/placeholder avatar for all users during registration.

#### Scenario: User views registration page
- **WHEN** the registration page is displayed
- **THEN** a fixed avatar image is shown
- **AND** the avatar does not change based on user input

