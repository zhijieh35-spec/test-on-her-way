# Design: Profile UI Redesign

## Layout Strategy
The profile popup will be a large, centered "glassmorphism" card (`glass-panel`).

### Grid Layout
- **Container**: `grid grid-cols-12 gap-8`
- **Left Panel (Cols 4-5)**:
    - **Header**: "很高兴认识你!" + Subtitle.
    - **Identity**: Avatar (large, circular) + Name + Role Label.
    - **Tags**: Vertical or wrapped list of identity tags.
- **Right Panel (Cols 7-8)**:
    - **Timeline**: A scrollable vertical list.
    - **Timeline Item**:
        - Left: Year/Dot marker.
        - Right: Content card (Title + Description).

### Interaction Design
- **Editing**: Click-to-edit behavior remains.
- **Hover Effects**: Hovering over timeline items highlights them.
- **Confirmation**: A floating or absolute-positioned "Check" button (Yellow background, Check icon) to signify completion.

### Styling
- **Theme**: Dark mode (`bg-space-950`).
- **Colors**:
    - Accents: Brand Yellow (`#FDD140`), Brand Orange (`#F36223`), Brand Blue (`#9FD2E3`).
    - Text: White/Gray.
