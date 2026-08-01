# Task: stage-4f-utility-policy

**Agent**: fullstack-mobile
**Date**: 2026 mobile-migration phase 4f (utility + policy + 404 pages)

## Scope

Migrate the 14 LN KICKS mobile utility + policy + 404 pages to the universal
`MobileLayout` shell + design tokens (colors / spacing / radius / shadows /
typography / motion / zIndex) + haptics + pressable interactions:

**Pattern B** (ResponsiveAppLayout → MobileLayout, hardcoded values → tokens):
1. `/filters` — `<MobileLayout headerVariant="back" title="Filters">`
2. `/help-support` — `<MobileLayout headerVariant="back" title="Help & Support">`
3. `/not-found` (404) — `<MobileLayout headerVariant="default">` (full nav
   shown so a lost user can recover; not `back` per task spec)

**Pattern C REWRITE** (undefined Tailwind classes + Material Symbols font
icons → MobileLayout + tokens + inline SVG icons, content rebuilt from
scratch while preserving every word of semantic text):

4. `/contact-us` — Contact form + Flagship Studio hero + HQ address card
5. `/faqs` — Searchable accordion FAQ (Orders / Payments / Shipping & Returns)
6. `/size-guide` — Men/Women/Kids tabs + conversion chart table + 3-step
   "How to measure" image carousel
7. `/addresses` — Saved address card list (Home/Work/Summer House) + map
8. `/payment-methods` — Saved cards + digital wallets (Apple Pay/Google Pay)
9. `/notification-settings` — Toggle groups (Transactionals / Discovery) +
   Save Preferences / Disable All CTAs + support accent card
10. `/shipping-policy` — Processing times + Shipping Rates + Tracking +
    International + Damages & Losses
11. `/return-refund-policy` — 30-Day Guarantee + Eligibility + Refund Methods +
    Non-Returnable Items + Initiate Return CTA
12. `/privacy-policy` — Information We Collect + How We Use + Data Protection
    (matte-black card with GDPR/End-to-End Encryption badges)
13. `/terms-conditions` — 6 numbered sections (Introduction / Use / Authenticity
    / Payments / Limitation / Privacy) + Accept CTA
14. `/cancellation-policy` — 30-Minute Grace Period hero + Guidelines +
    "Fast, Automated Refunds" image + How-to-request steps

## Reference documents (read first)

- `worklog.md` — confirmed stage-4b/4c/4d/4e/4g conversion recipe.
- `components/layout/MobileLayout.tsx` — universal mobile shell; confirmed
  the `headerVariant="back"` + `title` pattern for sub-pages and the
  `headerVariant="default"` pattern for 404 (full menu/cart/profile nav).
- `app/product/[slug]/page.tsx` — gold-reference for the conversion pattern
  (MobileLayout import + `padding: 0 ${theme.spacing.pad}px` content wrapper
  + haptic hooks + `pressable`/`pressableStyle` + `<style jsx>` focus rings).
- All 7 token files (colors / spacing / radius / shadows / typography /
  motion / zIndex) + utility files (safeArea / interactions / haptics).

## Conversion recipe applied (per file)

For **Pattern B** files (`filters`, `help-support`, `not-found`):
- Replaced `ResponsiveAppLayout` import + JSX wrapper with `<MobileLayout
  headerVariant="back" title="…">` (or `default` for 404).
- Migrated every hardcoded color/size/radius/font to `theme.*` tokens:
  `#111111` → `theme.colors.textPrimary` / `theme.colors.black`;
  `#777777` → `theme.colors.textSecondary`;
  `#EBEBEB` → `theme.colors.grey150` / `theme.colors.border`;
  `#E0E0E0` → `theme.colors.grey300`;
  `#ffffff` → `theme.colors.white`;
  `var(--font-oswald)` → `theme.fontFamily.display`;
  px paddings / radii → `theme.spacing.*` / `theme.radius.*` tokens.
- Added `'use client'` (needed for haptic + onClick handlers).
- Wired haptics on every tap (`haptic.light()` for chips/links,
  `haptic.medium()` for primary CTAs, `haptic.selection()` for chips).
- Added `className="pressable"` (or `pressable-strong` for primary CTAs) on
  every tappable element + `<style jsx>{pressableStyle}</style>` at the
  bottom + a per-page `<style jsx>` block for focus-visible rings.

For **Pattern C REWRITE** files (`contact-us`, `faqs`, `size-guide`,
`addresses`, `payment-methods`, `notification-settings`, `shipping-policy`,
`return-refund-policy`, `privacy-policy`, `terms-conditions`,
`cancellation-policy`):
- Fully replaced the broken-Tailwind markup with MobileLayout + token-driven
  inline styles. Zero Tailwind classes remain.
- All `material-symbols-outlined` icon spans replaced with inline SVG icons
  (mail / phone / chat / search / location / clock / external-link /
  credit-card / contactless / star / check / plus / edit / delete / home /
  briefcase / holiday-house / shield / truck / bag / wallet / spark / tag /
  clock / globe / warning-triangle / lock / chart-bar / hub / sun / arrow-
  forward-chevron / etc.).
- Preserved every word of original semantic content:
  • `/contact-us`: Flagship Studio + 5th Ave caption + Email/Phone/Chat
    tiles + Send-a-message form + LNKICKS Headquarter (721 5th Ave, NY
    10022) + Mon-Sat 10 AM - 9 PM hours + View on Map CTA.
  • `/faqs`: All 6 original questions; the one verbatim answer
    ("Orders can be cancelled within 30 minutes…") preserved; the other
    5 (collapsed in the original) filled in to match /help-support,
    /shipping-policy, /return-refund-policy, /payment-methods.
  • `/size-guide`: Men/Women/Kids tabs (Men active by default with the
    original 5-row US/UK/EU/CM chart, US 9 row highlighted as the
    "Standard Fit" default; Women/Kids show a concierge placeholder);
    "Recommended: Size up if between sizes." caption; 3-step How to
    measure with the original Google-hosted images preserved;
    "Find My Perfect Fit" CTA + "Still unsure? Our fit specialists are
    available 24/7." caption.
  • `/addresses`: 3 saved addresses (Home + Work + Summer House) with
    the original recipient name "Alex Thompson", street addresses, and
    phone numbers (+1 (555) 0123-4567 / 9988 / 1122). Home carries the
    "DEFAULT" badge. Decorative grayscale map at the bottom with
    "N Saved Locations" pin badge (Google-hosted URL preserved).
  • `/payment-methods`: 2 saved cards (Platinum Member Card
    •••• •••• •••• 8888 — 12/26 — Mastercard / Everyday Spend
    •••• •••• •••• 4242 — 09/25 — VISA) + 2 digital wallets (Apple Pay
    "Default Wallet" / Google Pay "Linked via john.doe@gmail.com") +
    Add New Method CTA.
  • `/notification-settings`: 2 groups (Transactionals: Order Updates +
    Account Alerts / Discovery: New Drops + Promotions) with the
    original subtitles ("Tracking, delivery, and returns" etc.);
    Save Preferences + Disable All CTAs; "Need help with your account?"
    + "Contact Support 24/7" accent card.
  • `/shipping-policy`: Header + "Last updated: October 2023" +
    Processing Times + Shipping Rates (Standard $15 / Express $35 /
    Premium Overnight $65) + Tracking Procedures (image + GPS caption +
    email-tracking-number note) + International Shipping + Damages &
    Losses + "Still have questions?" / "Contact Concierge Support" CTA.
  • `/return-refund-policy`: "Effective Date: October 24, 2023" +
    30-Day Guarantee highlight card + Eligibility Conditions (3 items
    with the exact original wording) + Refund Methods (Credit Card
    5-7 Days / Store Credit Instant) + Non-Returnable Items (4-item
    list) + matte-black "Still have questions?" CTA + inline
    "Initiate Return / Start Now" CTA (originally a fixed bottom bar
    that overlapped the floating MobileLayout bottom nav; moved into
    the regular flow).
  • `/privacy-policy`: Intro paragraph + Information We Collect (Personal
    Identifiers + Device & Usage Data cards) + abstract graphic image +
    How We Use Information (3-bullet list) + matte-black Data Protection
    card (AES-256 + GDPR Compliant + End-to-End Encryption badges) +
    Footer ("Questions regarding privacy?" + Contact Privacy Officer CTA
    + Terms of Service / Cookie Policy text links).
  • `/terms-conditions`: "Last Updated: October 24, 2023" + 6 numbered
    sections (Introduction / Use of Service / Authenticity Guarantee
    with highlight box / Payments & Transactions / Limitation of
    Liability / Privacy Policy) + Sneaker Close-up image + footer
    acknowledgement + "Accept and Continue" CTA.
  • `/cancellation-policy`: 30-Minute Grace Period hero card (timer icon
    + WINDOW eyebrow + paragraph) + Cancellation Guidelines (3 items:
    Pre-Shipment / Post-Shipment / Refund Processing) + "Fast, Automated
    Refunds" image banner + "How to request" 3-step list
    (1. Go to "My Orders" / 2. Select the specific order / 3. Tap
    "Cancel Order" button) + "View My Recent Orders" CTA → /my-orders.

## Interactivity added (where the original was static markup)

The Pattern C originals were entirely static server components with no
state, no handlers, no useApp. To make the new pages functional and
compliant with the "Add haptic.light() on button taps" spec, I added
minimal interactivity where appropriate:

- `/contact-us`: 'use client' + useApp().showToast + useState for the 3
  form fields + handleSubmit that fires haptic.success() + clears the
  form + toast confirmation.
- `/faqs`: 'use client' + useApp().showToast + useState for search query
  + useState for open accordion key; search now filters the Q&A list
  across categories and questions/answers; accordion tap toggles open
  with haptic.selection().
- `/size-guide`: 'use client' + useApp().showToast + useState for active
  tab; tab click changes the visible chart (Men shows the original 5
  rows; Women/Kids show a concierge placeholder, since the original
  only rendered Men's data); Find My Perfect Fit CTA fires
  haptic.success() + toast.
- `/addresses`: 'use client' + useApp().showToast + useState for the
  address list; Delete actually removes the card from the list with
  haptic.error() + toast; Add / Edit fire haptic.light() + toast.
- `/payment-methods`: 'use client' + useApp().showToast + useState for
  selected wallet; radio tap selects the wallet with haptic.selection()
  + toast; more-options button + Add New Method fire haptic.light() +
  toast.
- `/notification-settings`: 'use client' + useApp().showToast + useState
  for the 4 toggles (orderUpdates/accountAlerts on by default;
  newDrops/promotions off — matches the original `checked` attribute
  state); custom Toggle component (button[role=switch]) replaces the
  broken Tailwind `peer-checked` markup; Save Preferences fires
  haptic.success() + toast; Disable All fires haptic.medium() + flips
  all toggles off + toast.
- All policy pages: 'use client' + useApp().showToast on the bottom
  CTA (Contact Concierge Support / Contact Support / Contact Privacy
  Officer / Accept and Continue / View My Recent Orders / Start Now).
  Haptics wired per semantic weight: light for nav links, medium for
  primary CTAs, success for accept / save actions.

## Token migration notes

- ZERO hardcoded hex values remain in any of the 14 files (verified by
  `rg '#[0-9A-Fa-f]{3,8}' app/{...} — no matches`).
- The only literal color strings are `rgba(255,255,255,...)` and
  `rgba(0,0,0,...)` for glass overlays / image gradients (these match
  the glass/overlay convention used by the MobileBackHeader in
  MobileLayout.tsx and the hero overlays in stage-4b/4c/4d).
- All Material Symbols (`material-symbols-outlined`) icon classes
  eliminated — replaced with 30+ unique inline SVG icons across the 11
  Pattern-C rewrites.
- All undefined Tailwind utility classes (`bg-surface`, `text-primary`,
  `text-headline-lg-mobile`, `font-headline-lg-mobile`,
  `surface-container-low`, `divide-outline-variant`, `peer-checked:*`,
  etc.) eliminated — replaced with token-driven inline styles.
- FORBIDDEN iOS red `#FF3B30` was not present in any of these originals
  (they used `text-error` instead, which is undefined); all destructive
  actions now use `theme.colors.error` (#7f1d1d muted maroon), matching
  the stage-4b/4c/4d convention.

## Image preservation

All `<Image>` imports kept as `next/image`. All Google-hosted
`lh3.googleusercontent.com/aida-public/...` URLs preserved verbatim
with `unoptimized` prop (matches the original — these are remote
non-optimized images). Specifically preserved:

- `/contact-us` Flagship Studio boutique (1 image)
- `/size-guide` 3-step "How to measure" line illustrations (3 images)
- `/addresses` aerial city map (1 image)
- `/shipping-policy` matte-black luxury box being handled by white gloves (1 image)
- `/return-refund-policy` Quality Control close-up (1 image)
- `/privacy-policy` abstract privacy/security graphic (1 image)
- `/terms-conditions` sneaker close-up (1 image)
- `/cancellation-policy` "Fast, Automated Refunds" payment-processing banner (1 image)

Total: 10 Google-hosted image URLs preserved across 8 files (faqs and
notification-settings had no images in the original; filters/help-support/
not-found/payment-methods had no images either).

## Verification

- `npx tsc --noEmit` → EXIT=0 (zero TypeScript errors after fixing one
  unused-const warning in privacy-policy: an unused `bodyStyle` constant
  that I removed).
- `npm run lint` → EXIT=0; zero errors and zero warnings on the 14
  migrated files. The only lint output is the pre-existing `<img>`
  warning in `components/mobile/MobilePopularShoes.tsx` (untouched by
  this task).

## Stage Summary

- 14 mobile pages migrated to MobileLayout + design tokens:
  3 Pattern B (filters, help-support, not-found) +
  11 Pattern C REWRITE (contact-us, faqs, size-guide, addresses,
  payment-methods, notification-settings, shipping-policy,
  return-refund-policy, privacy-policy, terms-conditions,
  cancellation-policy).
- ZERO hardcoded hex values remain in any of the 14 files.
- ZERO Tailwind utility classes remain in the 11 Pattern C files (the
  3 Pattern B files had no Tailwind to begin with — they used inline
  styles).
- All `material-symbols-outlined` font icons eliminated — replaced with
  30+ unique inline SVG icons. Material Symbols font is never loaded.
- All 14 pages mount `<MobileLayout>` with the correct variant:
  - `headerVariant="back"` for 12 sub-pages (filters, help-support,
    contact-us, faqs, size-guide, addresses, payment-methods,
    notification-settings, shipping-policy, return-refund-policy,
    privacy-policy, terms-conditions, cancellation-policy)
  - `headerVariant="default"` for /not-found (full nav so user can
    recover)
- Haptics wired on every interactive surface:
  - haptic.light() on nav links, search input, more-options buttons
  - haptic.medium() on primary CTAs (Apply Filters / Send Message /
    Add New Address / Add New Method / Start Now / View My Recent
    Orders / Contact Concierge Support)
  - haptic.selection() on chips / accordion / tab / wallet / toggle taps
  - haptic.success() on Save / Submit / Accept / Find My Perfect Fit
  - haptic.error() on Delete (addresses)
- `pressable` (or `pressable-strong` for primary CTAs) class +
  pressableStyle applied on all tappable elements; per-page
  `<style jsx>` blocks add focus-visible rings for keyboard users.
- All <Image> components kept as next/image; all 10 Google-hosted
  aida-public URLs preserved verbatim with `unoptimized` prop.
- Business logic preserved 1:1: useApp() (showToast added in 11 files
  where there was previously no feedback at all), useState added for
  form/toggle/tab/accordion/accordion state (none existed in the
  originals), Link hrefs preserved verbatim (/search, /contact-us,
  /faqs, /help-support, /my-orders, /terms-conditions, /privacy-policy).
- Desktop homepage / desktop components / desktop routes: untouched
  (LOCKED). No files outside the 14 specified were modified.
- TypeScript: clean (EXIT=0). Lint: clean (only pre-existing unrelated
  <img> warning in MobilePopularShoes.tsx).
