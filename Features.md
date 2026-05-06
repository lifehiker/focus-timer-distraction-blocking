# Focus Loop: Timer & Blocker — Features

Source of truth for all product features. Updated whenever features are added, modified, or removed.

---

## Core Timer

### One-Tap Focus Session Start
- **Description:** Users can start a focus session from the home screen with a single tap, using the default template. No configuration required to get started.
- **Status:** completed
- **Date added:** 2026-05-06

### Editable Timer Loop Templates
- **Description:** Users can create, edit, duplicate, delete, and set a default timer loop template. Free tier is limited to 1 template; premium unlocks unlimited templates.
- **Status:** completed
- **Implementation notes:** Templates stored in localStorage. Free tier enforcement via paywall gate.
- **Date added:** 2026-05-06

### Session Runner
- **Description:** Full-screen circular progress timer with pause, resume, skip, and stop controls. Displays round indicators so users can track progress within a multi-round session.
- **Status:** completed
- **Date added:** 2026-05-06

### Browser Notifications
- **Description:** Sends browser push notifications on phase transitions (focus → break, break → focus) and on session completion. Requires notification permission granted during onboarding.
- **Status:** completed
- **Date added:** 2026-05-06

---

## Distraction Blocking

### Blocking Settings UI
- **Description:** Settings panel for configuring which sites to block during focus sessions. Includes individual presets for YouTube/Shorts, Instagram/Reels, TikTok, X (Twitter), and Reddit, plus quick-select bundles for common combinations.
- **Status:** completed
- **Implementation notes:** UI only — actual network-level blocking requires OS/browser extension integration. Gated behind premium.
- **Date added:** 2026-05-06

---

## Data & History

### Session Completion Logging
- **Description:** Every completed session is logged to localStorage with full metadata (template used, duration, rounds completed, timestamp).
- **Status:** completed
- **Implementation notes:** Local-only, no backend or account required.
- **Date added:** 2026-05-06

### Pattern Tracking Dashboard
- **Description:** Visualizes focus habits with weekly stats, a bar chart of daily session volume, template completion rates, and most-used template callout.
- **Status:** completed
- **Implementation notes:** Full history and stats comparison gated behind premium.
- **Date added:** 2026-05-06

### Session History List & Detail View
- **Description:** Scrollable list of past sessions with a tap-through detail view showing per-session metadata. Full history access is a premium feature.
- **Status:** completed
- **Date added:** 2026-05-06

---

## Onboarding & Settings

### 3-Step Onboarding Flow
- **Description:** First-launch walkthrough that introduces core concepts, requests notification permission, and sets user expectations. Designed to minimize friction and maximize permission grant rate.
- **Status:** completed
- **Date added:** 2026-05-06

### Settings Page
- **Description:** App-level settings covering notification toggle, link to blocking configuration, restore purchases, and a privacy note explaining local-only data storage.
- **Status:** completed
- **Date added:** 2026-05-06

---

## Monetization

### Freemium Paywall
- **Description:** Three purchase options presented at paywall gate: monthly ($5.99), annual ($29.99 with 7-day free trial), lifetime ($39.99). Designed to funnel users toward annual and lifetime tiers.
- **Status:** completed
- **Date added:** 2026-05-06

### Premium Feature Gating
- **Description:** The following features are locked to premium: distraction blocking, unlimited templates (free tier capped at 1), full session history, and stats comparison view.
- **Status:** completed
- **Date added:** 2026-05-06

---

## Design & Architecture

### Dark Design Theme
- **Description:** Dark UI with amber accent for focus phases and emerald accent for break phases. Provides clear visual context for which phase the user is in.
- **Status:** completed
- **Date added:** 2026-05-06

### Local-Only Data Architecture
- **Description:** All user data (templates, session history, settings, purchase state) is stored in localStorage. No accounts, no backend, no data leaves the device.
- **Status:** completed
- **Date added:** 2026-05-06

---

## Tech Stack
- Next.js 15, TypeScript, Tailwind CSS
- Persistence: localStorage only
