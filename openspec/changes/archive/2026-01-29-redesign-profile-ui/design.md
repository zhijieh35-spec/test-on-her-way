# Design: Redesign Profile UI

## Architectural Changes

### 1. Extract Particle Background
The existing particle background logic is tightly coupled within `LandingView.tsx`. To support the requirement of showing the particle background behind the profile, we will extract this logic into a reusable `ThreeBackground` component.

-   **Source**: `onHerWay/components/LandingView.tsx`
-   **Destination**: `onHerWay/components/ThreeBackground.tsx`
-   **Props**: None required initially, but could accept configuration options if needed (e.g., particle count, colors).

### 2. Profile Popup Structure
The `OnboardingProfilePopup` will be restructured to overlay the content on top of the `ThreeBackground`.

```tsx
<div className="relative w-full h-full">
  <ThreeBackground />
  <div className="absolute inset-0 flex items-center justify-center bg-black/40"> {/* Overlay for readability */}
    <div className="backdrop-blur-xl bg-white/5 ..."> {/* Frosted glass card */}
       {/* Content */}
    </div>
  </div>
</div>
```

## UI/UX Details

### Frosted Glass Effect
We will use Tailwind's `backdrop-blur` utilities combined with a semi-transparent background color (e.g., `bg-space-900/40` or `bg-white/5`) to achieve the frosted glass effect requested.

### Tag Layout (Word Cloud)
Instead of a list or grid, tags will be displayed using `flex flex-wrap gap-2` to create a horizontal "word cloud" effect.

### Timeline Visualization ("MY WAY")
The timeline will be visualized as a vertical line connecting events.
-   A continuous vertical line (`div` with `w-px bg-current`).
-   Dots (`rounded-full`) positioned on the line for each event.
-   This provides a clear "from top to bottom" trajectory as requested.

### Color Theme
-   **Primary Action**: The "Create MY WAY" button will use the yellow theme color (`bg-brand-yellow` / `#FDD140`) to stand out against the dark background.
