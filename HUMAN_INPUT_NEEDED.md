# Human Input Needed

## Overview

This app runs fully without any external credentials. All data is stored in the browser's localStorage. The following items are needed only if you want to extend the app with real payment processing or device-level blocking.

---

## 1. Real Payment Processing (Optional)

**Current behavior**: The "Unlock Pro" button simulates a purchase by flipping `premiumUnlocked: true` in localStorage. This is suitable for a demo/prototype.

**For production**, you need one of:

### Option A: Stripe (Web)
1. Create a [Stripe account](https://stripe.com)
2. Create products for Monthly ($5.99), Annual ($29.99), and Lifetime ($39.99) plans
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Implement `/api/checkout` and `/api/webhooks/stripe` routes
5. Replace the simulated purchase flow in `src/app/paywall/page.tsx`

### Option B: StoreKit 2 (iOS native)
- The PRD recommends shipping as a native iOS app using StoreKit 2
- Product IDs needed in App Store Connect: `com.focusloop.monthly`, `com.focusloop.annual`, `com.focusloop.lifetime`
- 7-day free trial configured on the annual plan

---

## 2. Real Device-Level Distraction Blocking (Optional)

**Current behavior**: The blocking settings UI works — users can select which sites to block, and the "blocking active" state is tracked in localStorage. However, actual browser/device enforcement requires additional tooling.

**For web-based enforcement:**
- Build a browser extension that reads the user's blocking preferences from a shared storage/API and enforces the blocklist
- Or integrate with an existing extension like uBlacklist or similar

**For iOS native (recommended per PRD):**
- Use `FamilyControls`, `ManagedSettings`, and `DeviceActivity` frameworks
- These require an iOS app target with the Family Controls entitlement
- Authorization flow must request `AuthorizationCenter.shared.requestAuthorization(for: .individual)`

---

## 3. Analytics (Optional)

**Current behavior**: No analytics are captured.

**To add analytics:**
- [PostHog](https://posthog.com): `npm install posthog-js`, add `NEXT_PUBLIC_POSTHOG_KEY=phc_...`
- [TelemetryDeck](https://telemetrydeck.com): lightweight, privacy-focused alternative
- Add tracking in `src/lib/analytics.ts`

---

## 4. Crash Reporting (Optional)

- [Sentry](https://sentry.io): `npm install @sentry/nextjs`, `NEXT_PUBLIC_SENTRY_DSN=...`
- [Firebase Crashlytics](https://firebase.google.com): better for native iOS

---

## App is fully functional without any of the above.
All core features (timer, templates, session logging, stats, history, blocking UI, paywall UI) work without credentials.
