# Redesign Profile UI and Components

## Problem
The current profile UI in `OnboardingProfilePopup` needs visual refinement to match the desired aesthetic. Specifically:
- Dividers are too prominent.
- Tag layout is not optimal (should be horizontal word cloud style).
- Terminology needs update ("人生轨迹" -> "MY WAY", "你的探索者画像" -> "很高兴认识你").
- Timeline visualization needs to be a vertical line connecting dots.
- Background needs to be frosted glass with the project's particle background behind it.
- CTA button color should be yellow.

## Solution
Redesign the `OnboardingProfilePopup` component to:
1.  Implement a frosted glass effect using `backdrop-filter`.
2.  Integrate the `ThreeBackground` (particle system) as the background.
3.  Update the layout of tags to a flex-wrap "word cloud" style.
4.  Update the timeline visualization to a connected vertical line.
5.  Update text and colors as requested.

## Risks
-   **Performance**: Adding `backdrop-filter` and a 3D particle system simultaneously might affect performance on lower-end devices. We should ensure the particle system is optimized (which it seems to be in `LandingView`).
-   **Responsiveness**: The new layout (especially the word cloud and timeline) needs to adapt well to different screen sizes.
