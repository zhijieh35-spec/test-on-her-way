# Tasks

## 1. Component Refactoring
- [x] 1.1 Extract `ThreeBackground` component from `LandingView.tsx` to `onHerWay/components/ThreeBackground.tsx`.
- [x] 1.2 Update `LandingView.tsx` to use the new `ThreeBackground` component.
- [x] 1.3 Verify `LandingView` still works correctly with the extracted component.

## 2. Profile Popup Redesign
- [x] 2.1 Update `OnboardingProfilePopup.tsx` to include `ThreeBackground` as the bottom layer.
- [x] 2.2 Apply frosted glass styling (`backdrop-blur`, semi-transparent bg) to the main card container.
- [x] 2.3 Update header text to "很高兴认识你".
- [x] 2.4 Update "人生轨迹" section title to "MY WAY".

## 3. Layout & Styling Updates
- [x] 3.1 Refactor tag display to use a flex-wrap horizontal layout (word cloud style).
- [x] 3.2 Remove/hide existing divider lines.
- [x] 3.3 Implement vertical timeline visualization (connected line + dots) for the "MY WAY" section.
- [x] 3.4 Update "Create MY WAY" button color to yellow theme.

## 4. Verification
- [x] 4.1 Verify the profile popup matches the visual design description.
- [x] 4.2 Ensure particle background animation works correctly behind the popup.
- [x] 4.3 Check responsiveness on different screen sizes.
