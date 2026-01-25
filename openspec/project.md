# Project Context

## Purpose
Life Puzzle Map & Her Way Community is a single-page, interactive visualization of personal growth. It presents life experiences as puzzle pieces on a draggable/zoomable map and offers a community exploration view plus insight summaries.

## Tech Stack
- React 19 + React DOM 19
- TypeScript (ES2022 target, ESNext modules)
- Vite (module-based build/dev server, port 3000)
- Tailwind CSS via CDN (utility classes in JSX)
- Google Fonts (Inter, Noto Serif SC)
- Google Gemini AI (`@google/genai` v1.34.0) - for mentor chat, analysis, and avatar generation
- Node.js/npm for local dev and build

## Project Conventions

### Code Style
- Functional React components with explicit prop interfaces
- Named exports for components; default export for `App`
- Enums/interfaces in `types.ts`, static mock data in `constants.ts`
- Utility-first classes in `className`; inline `style` for transforms/animations
- Inline `<style>` blocks for component-scoped keyframes when needed

### Architecture Patterns
- Single-page app; view switching is controlled by `ViewMode` state in `App.tsx`
- Layered UI panels with absolute/fixed positioning and CSS transitions
- Interaction logic (drag/zoom) handled in component state; no external state store
- Dual structure: root `components/` for Life Puzzle Map features, `onHerWay/components/` for mentor/community features
- AI services in `onHerWay/services/` (Gemini API integration for chat, analysis, profile generation)
- Mock data stored locally; no backend API or persistence yet
- Components live in `components/` or `onHerWay/components/`, shared types/constants at project root
- View modes: LANDING, MY_MAP (with sub-views: map/plan/resources/network), COMMUNITY, INSIGHT_SUMMARY (with sub-views: insight/chat/plan/community/network/profile/resources), THEIR_MAP

### Testing Strategy
- No automated tests yet; manual QA via `npm run dev`
- Add tests if/when behavior becomes more complex or data-driven

### Git Workflow
- Not documented yet; align on branch/PR conventions with the team

## Domain Context
- Each puzzle represents a life experience, difficulty, or goal with distinct colors (Blue #9FD2E3, Red/Orange #F36223, Yellow #FDD140)
- Users can explore their own map, browse community puzzles, and view insight summaries
- "On Her Way" (OHW) is an AI mentor feature targeting women (20-30s) to help overcome "Analysis Paralysis" by guiding them to a "First Move"
- AI mentor responds in Simplified Chinese (简体中文) with strategic, direct guidance (not just listening)
- Three-tier action system: Low Friction (<15 mins), Research (~30 mins), Active (~45-60 mins)
- UI copy mixes English and Chinese, so keep a bilingual tone when editing text
- First call generates a persona profile; subsequent calls analyze conversations for insights and tags

## Important Constraints
- Full-screen immersive UI; avoid introducing page scroll in the body
- Performance matters for drag/zoom interactions on the map
- Tailwind is loaded via CDN; do not assume a build-time Tailwind pipeline

## External Dependencies
- Tailwind CSS CDN (`https://cdn.tailwindcss.com`)
- Google Fonts (Inter, Noto Serif SC)
- Avatar/placeholder images from `https://i.pravatar.cc` and `https://picsum.photos`
- Google Gemini AI API (`process.env.GEMINI_API_KEY`) - required for:
  - Mentor chat responses (`sendMessageToMentor`)
  - Conversation analysis (`analyzeConversation`)
  - User profile generation (`generateUserProfile`)
  - Avatar image generation (`generateAvatar`)
  - Insight summaries (`generateInsightSummaries`)
  - Action item generation (`generateActionsForInsight`, `generateActionsFromChat`)
- API proxy configured via `httpOptions.baseUrl` in `geminiService.ts`
