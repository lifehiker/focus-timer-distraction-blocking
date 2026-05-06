# FORGE PRD TASKS — Focus Timer & Distraction Blocking

## Implementation Checklist

### Phase 0: Foundation
- [x] Create FORGE_PRD_TASKS.md
- [ ] Initialize Next.js 15 project (package.json, configs)
- [ ] Set up TypeScript types (FocusTemplate, FocusSession, AppSettings, BlockingPreset, TimerState)
- [ ] Implement localStorage helpers with SSR guards
- [ ] Implement timer engine (pure logic, phase transitions, round tracking)
- [ ] Implement useTimer React hook
- [ ] Implement useStorage React hook
- [ ] Set up global CSS with design tokens (dark theme, focus/break colors)
- [ ] Create root layout with bottom navigation

### Phase 1: Core UI Components
- [ ] Button component (variants: default, outline, ghost, destructive)
- [ ] Card component
- [ ] Badge component
- [ ] Switch/Toggle component
- [ ] Input component
- [ ] Label component
- [ ] Progress component
- [ ] Dialog/Modal component
- [ ] BottomNav component with 5 tabs

### Phase 2: Core User Flow
- [ ] Home page — default template card + Start Session button + nav shortcuts
- [ ] Onboarding flow (3 steps: timer loops, distraction blocking, permissions request)
- [ ] Session Runner — full-screen timer with circular ring, phase label, round progress, controls
- [ ] Session save on completion/stop to localStorage

### Phase 3: Templates Management
- [ ] Templates list page — list all templates, free-tier gate (1 max)
- [ ] New template form — name, focus minutes, break minutes, rounds
- [ ] Edit template — same form pre-filled
- [ ] Duplicate template action
- [ ] Delete template with confirmation
- [ ] Set as default template action
- [ ] Enforce free-tier 1-template limit with paywall CTA

### Phase 4: Session History
- [ ] History list page — reverse chronological, grouped by date
- [ ] Session detail page — template name, duration, rounds, status, date
- [ ] Free-tier gate: show last 7 days only, paywall prompt for full history

### Phase 5: Stats Dashboard
- [ ] Weekly sessions completed count
- [ ] Total focus minutes this week
- [ ] Most-used template display
- [ ] Template completion rate list (sorted by completion %)
- [ ] Bar chart for weekly focus minutes (recharts)
- [ ] Free-tier gate: blur detailed comparison cards, show paywall CTA

### Phase 6: Distraction Blocking
- [ ] Blocking setup page — preset toggles (YouTube, Instagram, TikTok, X, Reddit)
- [ ] Social feeds preset (YouTube + Instagram + TikTok)
- [ ] Video feeds preset (YouTube)
- [ ] Custom selection (individual toggles)
- [ ] "Focus Mode active" indicator during sessions
- [ ] Premium gate — show paywall CTA if not premium
- [ ] Persist blocking preferences to localStorage
- [ ] Web adaptation note: show what's blocked, actual enforcement requires browser extension

### Phase 7: Settings
- [ ] Settings page — notifications toggle, blocking link, restore purchases, privacy note, support link
- [ ] Toggle notifications setting (linked to browser notification permission)
- [ ] Blocking settings link
- [ ] Restore purchases button (simulated in web version)
- [ ] Privacy note (local-only data)
- [ ] Support/contact link

### Phase 8: Paywall / Premium
- [ ] Paywall page — explain premium value, list plan options
- [ ] Monthly plan card ($5.99/mo)
- [ ] Annual plan card ($29.99/yr with 7-day trial badge)
- [ ] Lifetime plan card ($39.99 one-time)
- [ ] "Unlock" button — flips premiumUnlocked in localStorage (web simulation)
- [ ] Restore purchases flow
- [ ] Trigger paywall from premium-gated features
- [ ] HUMAN_INPUT_NEEDED: real StoreKit 2 / payment processing

### Phase 9: Notifications (Browser)
- [ ] Request browser notification permission during onboarding
- [ ] Fire notification when focus phase ends (break starting)
- [ ] Fire notification when break phase ends (focus starting)
- [ ] Fire notification when session completes
- [ ] Clear pending on session stop

### Phase 10: Default Data Seeding
- [ ] Auto-create default template (25 min focus / 5 min break / 4 rounds) on first visit
- [ ] Auto-show onboarding on first visit
- [ ] Initialize AppSettings with defaults

### Phase 11: Deployment
- [ ] Dockerfile (standalone Next.js, no database)
- [ ] .env.example
- [ ] .gitignore
- [ ] next.config.ts with output: "standalone"
- [ ] npm run build passes with zero errors

### Phase 12: Final Audit
- [ ] FORGE_COMPLETION_AUDIT.md
- [ ] HUMAN_INPUT_NEEDED.md
- [ ] All routes smoke-tested
- [ ] Mobile-responsive design verified
- [ ] Premium gating verified on all gated features

## Status: IN PROGRESS
Last updated: 2026-05-06
