# LNKICKS Mobile — Complete UI/UX Audit & Premium Redesign Plan

> **Scope**: Mobile website only (39 routes + states).
> **Constraint**: Desktop Home Page is **100% LOCKED** — desktop issues noted in Section 11 only, never implemented.
> **Reference benchmark**: Apple Store · Samsung Store · Nike SNKRS · Nothing.tech · Stripe · Linear.app
> **Generated**: 2026-08-02 · Phase 5 — pre-implementation audit.
> **Working tree**: clean on `origin/main` @ commit `c2d996b` (Phase 2 mobile UI refinement shipped).

---

## 0. Executive Summary

The mobile site already has a **strong foundation**: a universal `MobileLayout` shell, a floating `MobileBottomNav` with center FAB, a complete design-token library at `lib/mobile/theme/*`, haptics, safe-area insets, focus-visible rings, lazy-loaded below-fold sections, and 39 of 39 mobile routes already mounted on `MobileLayout`.

The remaining gap is **enforcement and polish**, not architecture. Specifically:

1. **13 routes hide the bottom nav** (auth / post-transaction / admin) — this is the actual cause of the "footer is missing on some pages" perception.
2. **Spacing scale is 4pt-base, not 8pt** — `12, 14, 18, 28, 36` violate the user's requested 8/16/24/32/40/48 grid.
3. **Typography has size tokens but no semantic presets** (Hero/Heading/Title/Subtitle/Body/Caption/Price/Badge/Button/Label).
4. **Status badge colors** (`#E3FCEF`, `#FBEAEA`, `#FEF3C7`) leak past the token layer in 7+ pages and clash with the matte-black luxury palette.
5. **`error.tsx` and `loading.tsx` bypass `MobileLayout`** entirely — fully hardcoded.
6. **Icons are bespoke inline SVGs** with inconsistent stroke widths (1.5/2/2.2/2.4) and sizes (18/20/22). No icon family is enforced.
7. **Product cards lack soft shadow** — currently only an image drop-shadow + 1px border. Card radius is 18px, user wants 20–24px.
8. **`prefers-reduced-motion`** is honored only in `MobileHeroBanner` and `MobileBrands` — every other animated surface ignores it.
9. **No dark mode** — `colors.glassDark` exists in tokens but is unused; no theme switcher.
10. **No page-transition animation** between routes.
11. **Dead/duplicate code**: `MobileFooter.tsx`, `MobileHero.tsx`, possibly `MobileLatestDrops`, `MobileProductSlider`, `MobileFeaturedCollection`, `MobileLuxuryBar`.

The audit below covers every issue with the structured format the user requested: **Current Problem → Why non-premium → Industry Best Practice → Proposed Solution → Expected Visual Improvement → Priority**.

---

## 1. Universal Mobile Shell (`MobileLayout`, `MobileHeader`, `MobileBottomNav`, `MobileMenuDrawer`)

### 1.1 — Footer / bottom-nav inconsistency across pages  ·  **Priority: CRITICAL**

| Field | Detail |
|---|---|
| **Current Problem** | `MobileLayout` always renders `MobileBottomNav` *unless* a page sets `hideBottomNav`. 13 pages set it: `login`, `register`, `admin-login`, `order-success`, `order-failed`, `dashboard`, `add-product`, `edit-product`, `orders-management`, `customers-management`, `settings-panel`, `reports-analytics`, `products-management`. On those pages the floating nav disappears entirely, creating the "footer is missing" feeling the user reported. |
| **Why non-premium** | Apple Store, Nike SNKRS, and Samsung Store keep the tab bar visible on every screen *except* full-screen media overlays and the checkout pay-step. Hiding global navigation on auth / post-transaction / admin pages makes the app feel fragmented. |
| **Industry Best Practice** | Tab bar is **always visible** on consumer-facing commerce pages. Suppression is reserved for: (a) the pay-step of checkout (focus mode), (b) full-screen media viewer, (c) modal sheets that already provide their own nav. |
| **Proposed Solution** | Re-enable bottom nav on: `login`, `register`, `admin-login`, `order-success`, `order-failed`, `track-order`, `my-orders`, `dashboard`, `add-product`, `edit-product`, `orders-management`, `customers-management`, `settings-panel`, `reports-analytics`, `products-management`. Keep it hidden **only** on `checkout`'s pay-step (focus mode) and full-screen modals. The cart FAB stays hidden on `/cart` and `/checkout` (already correct). |
| **Expected Visual Improvement** | Every page feels like the same app. Users can always jump Home / Wishlist / Categories / Profile / Cart from anywhere. Auth pages stop feeling like dead-ends. |
| **Priority** | 🔴 Critical |

### 1.2 — `error.tsx` and `loading.tsx` bypass `MobileLayout`  ·  **Priority: CRITICAL**

| Field | Detail |
|---|---|
| **Current Problem** | `app/error.tsx` and `app/loading.tsx` render fully hardcoded shells (`#ffffff`, `#111111`, `padding: '100px 20px'`, `fontSize: '32px'`, `borderRadius: '30px'`). They do not mount `MobileLayout`, do not use design tokens, and have no header, no bottom nav, no safe-area padding, no haptics. |
| **Why non-premium** | When an error or loading state fires, the user is dumped into a completely different visual world — no LNKICKS wordmark, no glass header, no nav. Feels broken, not premium. |
| **Industry Best Practice** | Next.js `error.tsx` and `loading.tsx` should render inside the same chrome as the route they replace. Apple/Stripe/Linear show their normal app shell with a centered error/loading card. |
| **Proposed Solution** | Wrap both in `<MobileLayout headerVariant="minimal">`. Use `theme.colors.*` for all surfaces, `theme.spacing.*` for padding, `theme.radius.pill` for CTA, `theme.shadows.md` for the error card. Add a tasteful skeleton on `loading.tsx` (shimmer block matching `SectionSkeleton` in `MobileHome`). Add `haptic.medium()` on the TRY AGAIN button. |
| **Expected Visual Improvement** | Errors and loading states feel like part of the app, not a 1995 HTML fallback. |
| **Priority** | 🔴 Critical |

### 1.3 — `MobileFooter.tsx` is dead code  ·  **Priority: High**

| Field | Detail |
|---|---|
| **Current Problem** | `components/mobile/MobileFooter.tsx` (205 lines, with hardcoded `fontSize: 12.5`) is not imported anywhere. Grep confirms zero usages. It lingers as a misleading artifact — anyone reading the codebase assumes it's live. |
| **Why non-premium** | Dead code rots, gets half-edited, and confuses contributors. It also bloats the bundle if accidentally imported later. |
| **Industry Best Practice** | Delete dead code. Keep one source of truth (`MobileBottomNav`) for the mobile footer surface. |
| **Proposed Solution** | `git rm components/mobile/MobileFooter.tsx`. |
| **Expected Visual Improvement** | No visual change — purely housekeeping. But removes 200 lines of confusion from the codebase. |
| **Priority** | 🟠 High |

### 1.4 — Header wordmark uses `Oswald` (display) but the rest of the header is `Inter`  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | `MobileHeader` renders the LNKICKS wordmark in `theme.fontFamily.display` (Oswald, uppercase, condensed). The cart icon label, menu button, and breadcrumb are all `Inter`. The mix is intentional but the wordmark's `letterSpacing.widest` (0.18em) makes it look cramped on iPhone SE (320px). |
| **Why non-premium** | Apple/Samsung/Nothing use ONE wordmark style everywhere — letter-spacing tuned to the actual viewport. |
| **Industry Best Practice** | Use viewport-responsive letter-spacing (clamp 0.12em @ 320px → 0.18em @ 414px). |
| **Proposed Solution** | Add a `wordmarkSpacing` token to `typography.ts`: `clamp(0.12em, 1.2vw, 0.18em)`. Use it on every LNKICKS wordmark (header, minimal header, back header, drawer, splash). |
| **Expected Visual Improvement** | Wordmark breathes on big phones, doesn't crowd on small ones. |
| **Priority** | 🟡 Medium |

---

## 2. Typography System

### 2.1 — No semantic typography presets  ·  **Priority: CRITICAL**

| Field | Detail |
|---|---|
| **Current Problem** | `lib/mobile/theme/typography.ts` defines 16 raw size tokens (9.5, 10, 11, 12, 13, 14, 15, 17, 20, 22, 26, 30, 38, 48, 96) but only 6 presets (`eyebrow`, `sectionTitle`, `cardTitle`, `body`, `cta`, `navLabel`). Pages reach for raw `theme.fontSize.h1` / `.h2` / `.lg` etc. directly, leading to inconsistent mappings: e.g. `wishlist/page.tsx` uses `fontSize.h1` (30px) for the page title while `help-support/page.tsx` also uses `h1` — but `cart/page.tsx` uses `h2` (26px) for "Shopping Cart". The system has tokens but no contract. |
| **Why non-premium** | Apple HIG, Material 3, and Linear's type system all define **semantic roles** (Hero / Title / Subtitle / Body / Caption / Footnote) that map to fixed sizes. Pages consume roles, not raw numbers. This guarantees consistency and makes global type-scale changes a one-line edit. |
| **Industry Best Practice** | Define a `Typography.Presets` map with: `hero`, `displayHeading`, `pageTitle`, `sectionTitle`, `cardTitle`, `subtitle`, `body`, `bodySmall`, `caption`, `label`, `price`, `priceStrike`, `badge`, `buttonLabel`, `eyebrow`, `navLabel`. Each preset fixes fontFamily + size + weight + lineHeight + letterSpacing. |
| **Proposed Solution** | Extend `typography.ts` → `presets` map to cover all 15 semantic roles. Add a `<Text variant="pageTitle">` polymorphic component (or a `textStyle(variant)` helper for inline-style codebase). Audit all 39 pages — replace ad-hoc `fontSize: theme.fontSize.h1` with `...typography.presets.pageTitle`. |
| **Expected Visual Improvement** | Every page title, every section heading, every price, every button label has identical visual weight across the entire app. The site suddenly reads as "designed by one person". |
| **Priority** | 🔴 Critical |

### 2.2 — Half-pixel font sizes  ·  **Priority: High**

| Field | Detail |
|---|---|
| **Current Problem** | Six components use sub-pixel font sizes: `8.5`, `9.5`, `10.5`, `11.5`, `12.5`, `14.5`. Examples: `MobileBottomNav.tsx:191` (9.5), `MobileHeader.tsx:197` (8.5), `MobileMenuDrawer.tsx:222,342` (14.5, 11.5), `MobileNewsletter.tsx:188` (10.5), `MobileProductSlider.tsx:291` (10.5), `MobileRecommended.tsx:261` (10.5), `MobileLatestDrops.tsx:235` (10.5), `MobileFooter.tsx:205` (12.5). |
| **Why non-premium** | Sub-pixel font sizes render inconsistently across browsers (Chrome rounds, Safari antialiases differently). Apple/Samsung/Google all snap to integer sizes. Causes blurry text on non-retina displays. |
| **Industry Best Practice** | Type scale uses integers only. The "between size" problem is solved by adjusting weight or line-height, not by 0.5px tweaks. |
| **Proposed Solution** | Add `fontSize.badge = 10` and `fontSize.label = 11` to `typography.ts`. Replace all `.5` sizes with the nearest integer token. Delete the `12.5` and `14.5` literals — they don't add visual value over `12` and `14`. |
| **Expected Visual Improvement** | Text renders crisper on Android devices and on non-retina desktop previews. |
| **Priority** | 🟠 High |

### 2.3 — Page titles use `textTransform: 'uppercase'` inconsistently  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | `wishlist/page.tsx` uppercases its H1. `cart/page.tsx` does too. `help-support/page.tsx` uppercases. But `profile/page.tsx` does NOT (renders "My Account" in normal case). `track-order/page.tsx` doesn't either. Same role, different treatment. |
| **Why non-premium** | Inconsistent casing makes pages feel like they were designed by different teams. |
| **Industry Best Practice** | Page titles either ALL uppercase (Oswald display) or ALL sentence case (Inter bold). Pick one. Apple uses sentence-case. Nike uses uppercase. Pick Nike (matches the Oswald display font) and apply uniformly. |
| **Proposed Solution** | The `pageTitle` preset (from 2.1) fixes this — `textTransform: 'uppercase'` is part of the preset. Every page consumes the preset, casing becomes uniform. |
| **Expected Visual Improvement** | Every page heading has the same structural weight. |
| **Priority** | 🟡 Medium |

---

## 3. Spacing System

### 3.1 — Spacing scale is 4pt-base, not 8pt  ·  **Priority: CRITICAL**

| Field | Detail |
|---|---|
| **Current Problem** | `lib/mobile/theme/spacing.ts` defines: `xs=4, sm=8, md=12, gutter=14, lg=16, pad=18, xl=20, xxl=24, xxxl=28, huge=32, section=36, giant=48, vast=56, mega=64`. Of these, **`md`, `gutter`, `pad`, `xl`, `xxxl`, `section`** (6 of 14 tokens) are NOT on the 8pt grid (8/16/24/32/40/48/56/64). The user explicitly requested: *"8pt grid (8/16/24/32/40/48)"*. |
| **Why non-premium** | 8pt grid is the Apple/Google/Material standard. Off-grid values (12, 14, 18, 28, 36) create subtle vertical-rhythm breaks that compound across a long page — headings drift out of alignment with images above/below. |
| **Industry Best Practice** | Strict 8pt grid: `0, 4, 8, 16, 24, 32, 40, 48, 64, 96`. Half-steps (4, 12, 20, 28) are allowed for component internals but never for section/page rhythm. |
| **Proposed Solution** | Refactor `spacing.ts` to: `none=0, hairline=2, xs=4, sm=8, md=16, lg=24, xl=32, xxl=40, huge=48, mega=64, vast=96`. Keep `pageGutter=16` (was 18 — now snaps to 8pt). Section vertical padding becomes 32 (was 36). Migrate every `theme.spacing.pad` (18) → `theme.spacing.sm` (8) or `theme.spacing.md` (16). Migrate `theme.spacing.xxxl` (28) → `theme.spacing.lg` (24). Migrate `theme.spacing.section` (36) → `theme.spacing.xl` (32). |
| **Expected Visual Improvement** | Sections lock into a clear vertical rhythm. Page reads as more "designed", less "stacked". |
| **Priority** | 🔴 Critical |

### 3.2 — `gap: 3` and `gap: 2` literals in `MobileBottomNav`  ·  **Priority: Low**

| Field | Detail |
|---|---|
| **Current Problem** | `MobileBottomNav.tsx:234` uses `gap: 3` between icon and label. `MobilePopularShoes.tsx:86` uses `gap: 2` between stars. These are off-grid and not in `spacing.ts`. |
| **Why non-premium** | Minor — but means tokens aren't the source of truth. |
| **Industry Best Practice** | Either add `spacing.hairline=2` (already exists) and use it, or accept that star gaps are an exception (they're optical, not structural). |
| **Proposed Solution** | Replace `gap: 3` → `gap: theme.spacing.hairline` (2). For star gaps keep `2` as a literal but add a comment. |
| **Expected Visual Improvement** | Negligible. Purely consistency. |
| **Priority** | 🟢 Low |

---

## 4. Color System

### 4.1 — Two competing "blacks": `#0A0A0A` (token) vs `#111111` (page literals)  ·  **Priority: High**

| Field | Detail |
|---|---|
| **Current Problem** | `theme.colors.black = '#0A0A0A'` (very near-black). But `app/error.tsx`, `app/loading.tsx`, the legacy `ResponsiveAppLayout` mobile shell, and the desktop footer all use `#111111`. The user's directive specifies `#111111` as the canonical black. Result: two near-identical but technically different blacks coexist. |
| **Why non-premium** | When a user screenshots a hero card (`#0A0A0A`) next to a CTA button (`#111111`), they look different — the hero looks slightly cooler. Premium brands lock to ONE black. |
| **Industry Best Practice** | One black token, used everywhere. Apple uses `#000000` (pure) on OLED displays. Nike SNKRS uses `#111111`. Linear uses `#08090A`. Pick one, apply everywhere. |
| **Proposed Solution** | Change `theme.colors.black` from `#0A0A0A` → `#111111` (per user directive). Audit `app/error.tsx`, `app/loading.tsx`, `ResponsiveAppLayout` legacy mobile shell (already deprecated — but the literals remain) and migrate to `theme.colors.black`. |
| **Expected Visual Improvement** | All matte-black surfaces align. Hero, FAB, CTAs, badges, drawer accent bar — all the same black. |
| **Priority** | 🟠 High |

### 4.2 — Status badge colors leak past the token layer  ·  **Priority: High**

| Field | Detail |
|---|---|
| **Current Problem** | 7+ files hardcode status badge backgrounds: `#E3FCEF` (mint green "success"), `#FBEAEA` (light red "error"), `#FEF3C7` (amber "warning"). Found in: `app/order-detail/page.tsx:275`, `app/products-management/page.tsx:184`, `app/product/[slug]/page.tsx:291`, `app/orders-management/page.tsx:460,463`, `app/dashboard/page.tsx:189`, `app/my-orders/page.tsx:196`, `app/order-success/page.tsx:73`, `app/order-failed/page.tsx:66`, `app/track-order/page.tsx:161`. These pastel backgrounds clash violently with the luxury matte-black + soft-grey palette. |
| **Why non-premium** | Apple/Linear/Stripe use **neutral grey badges** with subtle text color (e.g. grey-100 bg + grey-700 text + 1px grey-200 border). Pastel greens/reds/ambers read as "admin dashboard" — not luxury commerce. |
| **Industry Best Practice** | Status is communicated by **a single dot + text label** (Apple), or by **neutral grey surface + colored dot** (Linear). The badge background stays neutral. |
| **Proposed Solution** | Add to `colors.ts`: `successBg: '#F4F4F5'`, `successFg: '#14532D'`, `successDot: '#16A34A'`. Same pattern for warning/error. Replace all `#E3FCEF` / `#FBEAEA` / `#FEF3C7` literals with these tokens. The badge becomes a grey pill with a small colored dot — luxury, not loud. |
| **Expected Visual Improvement** | Order management / dashboard / order detail pages stop looking like a WordPress admin and start looking like Linear's issue list. |
| **Priority** | 🟠 High |

### 4.3 — No accent color token  ·  **Priority: High**

| Field | Detail |
|---|---|
| **Current Problem** | The user directive says: *"ONE accent color (no harsh colors)"*. `colors.ts` currently has only neutrals + sale/price (both black). There is no accent. This means sale prices, "NEW" pills, badges, links — all render in matte black, blending with the rest of the UI. Nothing stands out. |
| **Why non-premium** | Premium brands use ONE restrained accent: Apple uses blue `#0071E3` (very sparingly). Nike uses volt yellow `#D7FF1E` (only on SNKRS drops). Nothing uses red `#D14B3D`. Stripe uses indigo `#635BFF`. Without an accent, the eye has nowhere to land. |
| **Industry Best Practice** | One accent color, used on: (1) primary CTAs (underlined links, "Shop Now" arrows), (2) live/sale indicators, (3) focus rings, (4) selected-state borders. Everything else stays neutral. |
| **Proposed Solution** | Add to `colors.ts`: `accent: '#1A1A1A'` (matte black IS the accent — works for Nike SNKRS aesthetic). For "live" indicators (NEW pill, sale, in-stock dot) use a single restrained color: `accentLive: '#C8553D'` (terracotta — luxury, warm, not neon). Apply `accentLive` to: NEW pill on `MobileNewArrivals`, sale price tag, in-stock dot on PDP, the cart FAB's badge. Replace `colors.sale` with `accentLive` (currently matte black — invisible against text). |
| **Expected Visual Improvement** | "NEW" and sale prices finally pop without screaming. The site acquires a signature color (terracotta — pairs beautifully with off-white `#FAFAFA`). |
| **Priority** | 🟠 High |

### 4.4 — Page background is `#FFFFFF` everywhere; user wants `#FAFAFA` off-white  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | `theme.colors.white = '#FFFFFF'` is used as the page background on every page. The user directive specifies: *"Off-white (#FAFAFA)"* as the canonical canvas. The token `colors.grey50 = '#fafafa'` already exists but is unused as a page surface. |
| **Why non-premium** | Pure white (#FFF) is harsh on OLED displays and creates high-contrast eye strain. Apple/Samsung/Linear all use a barely-off-white canvas (#FAFAFA, #F8F8F8) to soften the page. White cards then pop subtly against the canvas. |
| **Industry Best Practice** | Page canvas: `#FAFAFA`. Cards / surfaces: `#FFFFFF` (with shadow). Hero cards: matte black `#111111`. This creates a 3-tier hierarchy: canvas → card → hero. |
| **Proposed Solution** | Set `theme.colors.canvas = '#FAFAFA'`. Update `MobileLayout` and `MobileHome` page background to use `theme.colors.canvas`. Keep card backgrounds as `theme.colors.white`. The contrast is subtle (1% lightness) but premium. |
| **Expected Visual Improvement** | Pages feel softer. White cards gain a slight float. The whole app reads as more "designed". |
| **Priority** | 🟡 Medium |

---

## 5. Icon System

### 5.1 — No icon family enforced  ·  **Priority: High**

| Field | Detail |
|---|---|
| **Current Problem** | Every icon is hand-coded inline SVG (15 components, 80+ SVG instances). Stroke widths vary: `1.5` (search icon in `MobileSearch`), `2` (most icons), `2.2` (cart FAB), `2.4` (Add-to-Cart plus icon, "Shop Now" arrow). Sizes vary: `18`, `20`, `22`, `24`. Corner radii are mixed (`strokeLinecap="round"` vs not specified). The cart icon in `MobileHeader` (a shopping-bag with handle) is different from the cart icon in `MobileBottomNav` FAB (a shopping-cart with wheels). Same action, two different icons. |
| **Why non-premium** | Lucide / Phosphor / Material Rounded all enforce a single stroke weight, single corner radius, single 24×24 viewBox, consistent naming. Mixing bespoke SVGs means a user sees "menu" as 3 lines of varying thickness across the app. Apple/Nike/Nothing NEVER mix icon families. |
| **Industry Best Practice** | Adopt **Lucide** (MIT, 1500+ icons, 2px stroke, 24×24 viewBox, rounded corners — matches the existing aesthetic most closely). Install `lucide-react`. Replace every inline SVG with a Lucide component. Stroke width stays at 2 across the entire app. Sizes snap to 16/20/24. |
| **Proposed Solution** | (1) `npm i lucide-react`. (2) Audit all 80+ SVG instances, map each to a Lucide name. (3) Replace inline SVGs in this order: `MobileHeader` → `MobileBottomNav` → `MobileMenuDrawer` → `MobilePopularShoes` → `MobileNewArrivals` → `MobileHeroBanner` → page-level icons (cart, search, wishlist, profile, breadcrumb). (4) Delete the bespoke SVG paths. (5) Add a `<Icon name="cart" size={20} />` wrapper for consistency. |
| **Expected Visual Improvement** | All icons render with identical stroke weight, corner radius, and optical balance. Cart icon matches across header, FAB, and PDP. The app reads as a unified design system. |
| **Priority** | 🟠 High |

### 5.2 — Cart icon inconsistency: shopping-bag vs shopping-cart  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | `MobileHeader` uses a **shopping bag** icon (handle on top, no wheels). `MobileBottomNav` FAB uses a **shopping cart** icon (wheels at bottom). `ResponsiveAppLayout` legacy uses a **different shopping bag** (different path). Three different "cart" icons across the app. |
| **Why non-premium** | Apple Store uses a bag. Nike SNKRS uses a bag. Stripe uses a cart. The choice doesn't matter — consistency does. |
| **Industry Best Practice** | Pick one. Since the brand is "LNKICKS" (sneakers) and the reference is Nike SNKRS, use the **shopping bag** everywhere. |
| **Proposed Solution** | Use Lucide's `ShoppingBag` icon everywhere the cart action appears. Delete the shopping-cart-with-wheels variant from `MobileBottomNav`. |
| **Expected Visual Improvement** | The cart action is visually identical in the header, FAB, and PDP. User forms a single mental model. |
| **Priority** | 🟡 Medium |

---

## 6. Product Cards

### 6.1 — Cards lack soft shadow  ·  **Priority: High**

| Field | Detail |
|---|---|
| **Current Problem** | `MobilePopularShoes.tsx` cards have only `border: 1px solid theme.colors.grey150` and an image `drop-shadow`. No `boxShadow` on the card itself. The user explicitly said: *"Cards feel like white rectangles → need soft shadow"*. |
| **Why non-premium** | Apple Store, Nike SNKRS, and GOAT all use a soft 2-layer shadow (`0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)`) to lift cards off the canvas. The current border-only approach reads as "form input" not "premium product". |
| **Industry Best Practice** | Resting state: `box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)` (shadow + hairline border combined). Hover/active state: shadow deepens to `0 8px 24px rgba(0,0,0,0.08)`. |
| **Proposed Solution** | Apply `theme.shadows.sm` (already defined: `0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`) to `PopularShoeCard`, `MobileRecommended` cards, `MobileLatestDrops` cards, wishlist items, and order-history cards. Remove the explicit `border` (or make it `1px solid transparent` to preserve layout). On hover (desktop) and press (mobile), elevate to `theme.shadows.md`. |
| **Expected Visual Improvement** | Cards float. The page suddenly has depth. Reads as "Apple Store" not "eBay grid". |
| **Priority** | 🟠 High |

### 6.2 — Card radius is 18px; user wants 20–24px  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | `MobilePopularShoes` uses `theme.radius.xl = 18`. `MobileRecommended` uses `theme.radius.xxl = 22`. Wishlist items use `theme.radius.xxl = 22`. Three different radii on three card types. User directive: *"20–24px radius"*. |
| **Why non-premium** | Apple uses 18-22px on cards. Nike uses 16-20px. Mixed radii across the same page feels accidental. |
| **Industry Best Practice** | One card radius across the entire app. Pick 20px (Apple's sweet spot). |
| **Proposed Solution** | Set `theme.radius.xl = 20` (was 18). Use `radius.xl` for ALL product cards. `radius.xxl` (22) stays for hero/feature cards only. `radius.hero` (28) stays for hero banners only. |
| **Expected Visual Improvement** | Every product card has the same soft corners. |
| **Priority** | 🟡 Medium |

### 6.3 — Cards show too much text (brand + name + rating + price + strike + add button)  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | `MobilePopularShoes` card renders 5 text rows + image + button: brand, name (2-line clamp), rating stars + number, current price, strike-through original price, and a floating `+` add-to-cart. Visually busy. User said: *"minimal text"*. |
| **Why non-premium** | Apple Store cards show: image, name, price. That's it. Nike SNKRS shows: image, name, "From $X". GOAT shows: image, name, lowest ask. Premium cards trust the image; budget cards stack text. |
| **Industry Best Practice** | Card content priority: (1) Image (largest, hero), (2) Name (1 line, ellipsis), (3) Price. Rating, brand, strike-through go on the PDP, not the card. |
| **Proposed Solution** | On `MobilePopularShoes` cards: keep image + brand (tiny eyebrow) + name (1 line, not 2) + price. **Remove**: rating row, strike-through price (move to PDP only). The `+` add-to-cart stays (it's the primary action). Saves ~40px vertical per card — 3 cards fit where 2 fit before. |
| **Expected Visual Improvement** | Cards become image-forward, premium. Page density increases (more products visible per scroll) without feeling crowded. |
| **Priority** | 🟡 Medium |

### 6.4 — No micro-interaction on card hover/tap  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | `MobilePopularShoes` has `transform: scale(0.98)` on `:active` and `translateY(-4px) scale(1.04)` on hover for the image only. The card itself doesn't lift. No shadow change on hover. No enter animation when card scrolls into view. |
| **Why non-premium** | Apple/Nike cards smoothly elevate on press (shadow deepens, card lifts 2px). On scroll-into-view, they fade-in 100ms late to create a "stacking" feel. |
| **Industry Best Practice** | Card press: `transform: translateY(-2px)`, `box-shadow: lg`. Card enter: `opacity: 0 → 1`, `translateY(8px → 0)` over 240ms with `cubic-bezier(0.16, 1, 0.3, 1)` ease-out, staggered 50ms per card. |
| **Proposed Solution** | Add `transition: box-shadow 180ms ease-out, transform 120ms ease-out` to every card. On press, lift shadow from `sm` → `md`. On scroll-into-view (use IntersectionObserver), add a `data-visible` attribute that triggers the fade-in. Stagger via `transitionDelay: index * 50ms`. |
| **Expected Visual Improvement** | Scrolling the homepage feels responsive and alive. Cards announce themselves. |
| **Priority** | 🟡 Medium |

---

## 7. Hero Section

### 7.1 — MobileHero.tsx is dead code (superseded by MobileHeroBanner.tsx)  ·  **Priority: High**

| Field | Detail |
|---|---|
| **Current Problem** | `components/mobile/MobileHero.tsx` (192 lines) is the old single-card hero. Phase 2 introduced `MobileHeroBanner.tsx` (the Adidas-style carousel). `MobileHome.tsx` imports only `MobileHeroBanner`. `MobileHero.tsx` lingers as dead code. |
| **Why non-premium** | Dead code, again. Confuses contributors. |
| **Industry Best Practice** | Delete superseded components. |
| **Proposed Solution** | `git rm components/mobile/MobileHero.tsx`. |
| **Expected Visual Improvement** | None (already not rendered). |
| **Priority** | 🟠 High |

### 7.2 — Hero banner headline weight is inconsistent across slides  ·  **Priority: Low**

| Field | Detail |
|---|---|
| **Current Problem** | `MobileHeroBanner.tsx` slide content (3 slides) uses Oswald 40px extrabold. The lead word above is `fontSize.body` (13px) uppercase bold. The CTA is `fontSize.body` (13px) underlined. Numbers/letters in different slides have slightly different optical weights because Oswald's "Black" vs "ExtraBold" rendering varies by glyph. |
| **Why non-premium** | Minor — but premium brands lock the hero type scale. |
| **Industry Best Practice** | Hero headline: Oswald 36-44px, weight 800, line-height 1.0, letter-spacing -0.02em. Lead: Inter 11px uppercase, weight 700, letter-spacing 0.18em. CTA: Inter 14px, weight 600, underlined, no uppercase. |
| **Proposed Solution** | Add a `heroHeadline` preset to `typography.ts`. Apply uniformly. |
| **Expected Visual Improvement** | Hero reads as one consistent voice across all 3 slides. |
| **Priority** | 🟢 Low |

---

## 8. Animations & Motion

### 8.1 — `prefers-reduced-motion` only honored in 2 components  ·  **Priority: High**

| Field | Detail |
|---|---|
| **Current Problem** | Grep confirms only `MobileHeroBanner.tsx` and `MobileBrands.tsx` check `prefers-reduced-motion`. All other animated surfaces (carousel snap, drawer slide, splash fade, press states, shimmer skeletons, image hover transform) ignore the media query. |
| **Why non-premium** | Accessibility fail. Users with vestibular disorders get motion sickness from auto-advancing carousels and sliding drawers. Apple HIG and WCAG 2.1 SC 2.3.3 require respecting this preference. |
| **Industry Best Practice** | Create a `usePrefersReducedMotion()` hook. Apply globally: (1) disable carousel auto-advance, (2) replace slide animations with instant fade, (3) disable card press scale, (4) replace shimmer with static grey, (5) reduce drawer slide to opacity-only. |
| **Proposed Solution** | Add `lib/mobile/utils/usePrefersReducedMotion.ts` (singleton matchMedia listener). Apply in: `MobileHeroBanner` (already), `MobileBrands` (already), `MobileMenuDrawer`, `MobileSplash`, `MobilePopularShoes` (image hover), every `pressable` class (via global CSS `@media (prefers-reduced-motion: reduce) { .pressable { transition: none; } }`). |
| **Expected Visual Improvement** | Accessibility compliance. No visual change for default users. |
| **Priority** | 🟠 High |

### 8.2 — No page-transition animation  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | Route changes are instant — no fade, no slide, no shared-element transition. The LCP just snaps from one page to the next. |
| **Why non-premium** | Apple/Nike/Stripe all use a 200ms opacity fade on route change. Linear uses a subtle slide-up. The brain reads "instant snap" as cheap. |
| **Industry Best Practice** | Next.js App Router supports `template.tsx` for enter animations. Add a `<template>` that wraps `children` in a div with `opacity: 0 → 1` over 180ms on mount. |
| **Proposed Solution** | Create `app/template.tsx` that wraps children with a styled-jsx fade-in. Respect `prefers-reduced-motion`. |
| **Expected Visual Improvement** | Route changes feel smooth. The app reads as a SPA, not a multipage site. |
| **Priority** | 🟡 Medium |

### 8.3 — Skeletons only on MobileHome; other pages render nothing while loading  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | `MobileHome` has a `SectionSkeleton` for lazy-loaded sections. No other page has a skeleton. `app/loading.tsx` (the Next.js route-level loading state) shows a plain "LNKICKS..." text — no skeleton. |
| **Why non-premium** | Premium apps show content-shaped skeletons (image block + 2 text lines) immediately on navigation. Stripe/Linear/Apple all do this. |
| **Industry Best Practice** | Each route exports a `loading.tsx` that renders a skeleton matching the page's actual layout. |
| **Proposed Solution** | Create skeleton components: `ProductCardSkeleton`, `ProductGridSkeleton`, `CartSkeleton`, `OrderListSkeleton`, `ProfileSkeleton`. Generate `loading.tsx` files for the top 10 routes (cart, wishlist, products, product/[slug], profile, my-orders, search, categories, category/[slug], checkout). |
| **Expected Visual Improvement** | Page loads feel instant — the skeleton appears in 1 frame, then real content hydrates into it. |
| **Priority** | 🟡 Medium |

---

## 9. Dark Mode

### 9.1 — No dark mode implementation  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | `colors.glassDark` and `colors.scrim` exist in tokens but are unused. No `prefers-color-scheme: dark` media query anywhere. No theme toggle in `MobileMenuDrawer` or `profile/page.tsx`. |
| **Why non-premium** | Nike SNKRS, Apple Store, Nothing.tech, Linear, Stripe — all ship dark mode. It's table-stakes for premium apps in 2026. |
| **Industry Best Practice** | (1) Use CSS variables for all colors. (2) Override them in `@media (prefers-color-scheme: dark)`. (3) Provide a manual toggle that writes to `localStorage` and adds `.dark` class to `<html>`. |
| **Proposed Solution** | Phase 9 of the user's preferred sequence. (1) Refactor `colors.ts` to expose CSS variables (`--ln-color-canvas`, `--ln-color-text-primary`, etc.). (2) Add a `darkColors` map. (3) Inject the variables at `app/layout.tsx`. (4) Add a `useTheme()` hook + toggle in `MobileMenuDrawer`. (5) Test all 39 pages in dark mode. |
| **Expected Visual Improvement** | The site acquires a true dark mode — off-black canvas (`#0A0A0A`), white text, grey-800 surfaces. |
| **Priority** | 🟡 Medium |

---

## 10. Per-Page Polish Findings

### 10.1 — `app/wishlist/page.tsx` uses `next/image` (Image component)  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | `wishlist/page.tsx` line 5 imports `Image` from `next/image`. The codebase convention (per `MobileHome`, `MobilePopularShoes`, `MobileHero`, `MobileNewArrivals`) is plain `<img>` tags because LFS pointers in `/public/` are broken. `next/image` will likely 404 the images. |
| **Why non-premium** | Inconsistency. And broken images. |
| **Industry Best Practice** | Follow the established convention. |
| **Proposed Solution** | Replace `next/image` with `<img>` in `wishlist/page.tsx`. |
| **Priority** | 🟡 Medium |

### 10.2 — `app/categories/page.tsx` uses emoji icon (`fontSize: 28`)  ·  **Priority: Low**

| Field | Detail |
|---|---|
| **Current Problem** | `categories/page.tsx:157` renders `<span style={{ fontSize: 28 }} aria-hidden>` — likely an emoji per category. Emojis render differently on iOS vs Android vs Windows. |
| **Why non-premium** | Apple/Nike never use emojis in production UI. |
| **Industry Best Practice** | Use Lucide icons or category-specific SVGs. |
| **Proposed Solution** | Replace emojis with Lucide icons (e.g. `Footprints` for sneakers, `ShoppingBag` for bags, `Shirt` for clothing). |
| **Priority** | 🟢 Low |

### 10.3 — Product Detail Page (PDP) — audit needed  ·  **Priority: High**

| Field | Detail |
|---|---|
| **Current Problem** | `app/product/[slug]/page.tsx` is 800+ lines (one of the largest files). Uses `MobileLayout` correctly but has hardcoded `#E3FCEF` (status badge) and likely many ad-hoc styles. Needs a focused audit pass. |
| **Why non-premium** | The PDP is the highest-converting page. Any visual inconsistency here costs sales. |
| **Industry Best Practice** | PDP layout: sticky image gallery → title/price → size selector → Add to Cart (sticky bottom) → description → reviews → related. Apple/Nike PDPs are extremely tight. |
| **Proposed Solution** | Dedicated PDP refactor pass after the design-system phase. |
| **Priority** | 🟠 High |

### 10.4 — `app/order-detail/page.tsx` has `fontSize: 8.5`  ·  **Priority: Low**

| Field | Detail |
|---|---|
| **Current Problem** | `order-detail/page.tsx:467` uses `fontSize: 8.5` (sub-pixel). |
| **Why non-premium** | Sub-pixel font rendering. |
| **Industry Best Practice** | Integer sizes only. |
| **Proposed Solution** | Replace with `theme.fontSize.xs` (10) or add a new `fontSize.micro2 = 9` token. |
| **Priority** | 🟢 Low |

### 10.5 — Empty states (empty cart, empty wishlist, no search results)  ·  **Priority: Medium**

| Field | Detail |
|---|---|
| **Current Problem** | Empty cart and empty wishlist show a small message + CTA. No illustration, no premium empty-state design. Search "no results" is plain text. |
| **Why non-premium** | Apple/Nike/Linear have beautiful empty states — a line illustration or large icon + friendly headline + clear CTA. Makes the "nothing here yet" moment feel intentional, not broken. |
| **Industry Best Practice** | Empty state = large Lucide icon (64px, grey-400) + bold headline (Oswald 22px) + supporting text (Inter 14px, grey-500) + primary CTA pill. |
| **Proposed Solution** | Build a reusable `<EmptyState icon={...} title="..." body="..." cta={...} />` component. Apply to: cart, wishlist, search, my-orders, track-order. |
| **Expected Visual Improvement** | Empty states stop feeling like error pages and start feeling like invitations. |
| **Priority** | 🟡 Medium |

---

## 11. Desktop Home Page (LOCKED — issues noted only, NEVER implemented)

Per the user's non-negotiable constraint, the Desktop Home Page is **100% LOCKED**. The following observations are for documentation only — they MUST NOT be implemented.

| Observation | Detail |
|---|---|
| Desktop header uses `#4A4A4A` text color | Slightly different from `#0A0A0A` brand black. Would normally unify. **DO NOT TOUCH.** |
| Desktop footer uses `rgba(255,255,255,.3)` for muted text | Different from `colors.textSecondary`. Would normally unify. **DO NOT TOUCH.** |
| Desktop header has no haptic feedback | Mobile-only feature. **DO NOT TOUCH.** |
| Desktop footer copyright shows "© 2026 LNKICKS" | Date is correct. No change needed. |

**Conclusion**: Desktop is fine as-is. No action.

---

## 12. Implementation Sequence (per user's preferred order)

The user specified this execution order. Each phase produces a shippable commit; lint + tsc + build must pass before commit.

| Phase | Scope | Deliverable | Estimated LOC Changed |
|---|---|---|---|
| **Phase 5.1** — Design System | Refactor `colors.ts` (add `accent`, `accentLive`, `canvas`, status badge tokens, change `black` to `#111111`). Refactor `spacing.ts` to strict 8pt grid. Extend `typography.ts` with 15 semantic presets. | `lib/mobile/theme/*` rewrite | ~400 |
| **Phase 5.2** — Universal Header | Add viewport-responsive wordmark letter-spacing. Audit `MobileHeader`, `MobileBackHeader`, `MobileMinimalHeader` for token compliance. | `components/layout/MobileLayout.tsx`, `components/mobile/MobileHeader.tsx` | ~80 |
| **Phase 5.3** — Universal Bottom Navigation | Re-enable bottom nav on 13 routes that currently hide it (auth, post-transaction, admin). Keep hidden only on `/checkout` pay-step. | 13 page files (1-line edit each) | ~15 |
| **Phase 5.4** — Typography System | Replace all raw `fontSize.*` literals in 39 pages with `typography.presets.*`. Delete half-pixel sizes. | 39 page files | ~300 |
| **Phase 5.5** — Spacing System | Migrate every `spacing.pad` (18) → `spacing.sm` (8) or `.md` (16). Migrate `.xxxl` (28) → `.lg` (24). Migrate `.section` (36) → `.xl` (32). | All mobile files | ~250 |
| **Phase 5.6** — Premium Product Card | Apply `shadows.sm` to cards. Increase radius to 20px. Reduce card text (remove rating row + strike price). Add card-lift micro-interaction. | `MobilePopularShoes`, `MobileRecommended`, `MobileLatestDrops`, wishlist items | ~150 |
| **Phase 5.7** — Premium Hero | Already done in Phase 2 (`MobileHeroBanner`). Minor: add `heroHeadline` preset, delete dead `MobileHero.tsx`. | `lib/mobile/theme/typography.ts`, `git rm MobileHero.tsx` | ~20 |
| **Phase 5.8** — Animations | Add `usePrefersReducedMotion()` hook. Apply to all animated surfaces. Add `app/template.tsx` for route fade-in. Add skeleton components for top 10 routes. | `lib/mobile/utils/usePrefersReducedMotion.ts`, `app/template.tsx`, 10 `loading.tsx` files | ~400 |
| **Phase 5.9** — Dark Mode | Refactor colors to CSS variables. Add `darkColors` map. Inject at `app/layout.tsx`. Add toggle in `MobileMenuDrawer`. | `lib/mobile/theme/*`, `app/layout.tsx`, `MobileMenuDrawer.tsx` | ~250 |
| **Phase 5.10** — Page Polish | Fix `error.tsx` + `loading.tsx` (wrap in MobileLayout). Replace `#E3FCEF`/`#FBEAEA`/`#FEF3C7` with tokens. Replace emojis with Lucide. Build `<EmptyState>` component. PDP deep-clean. | `app/error.tsx`, `app/loading.tsx`, 9 status-badge files, `app/categories/page.tsx`, PDP | ~400 |
| **Phase 5.11** — Icon Family | Install `lucide-react`. Replace 80+ inline SVGs. Delete bespoke paths. | All mobile files | ~600 |
| **Phase 5.12** — Dead Code Cleanup | `git rm MobileFooter.tsx`, `MobileHero.tsx`. Verify `MobileLatestDrops`, `MobileProductSlider`, `MobileFeaturedCollection`, `MobileLuxuryBar` are actually used. | `git rm` + verification | -500 |

**Total estimated**: ~3,500 LOC changed across 12 phases. Each phase ships independently with QA gate.

---

## 13. QA Gate (after every phase)

```
npm run lint          # 0 errors, ≤5 warnings (img-tag warnings OK)
npx tsc --noEmit      # 0 errors
npm run build         # All 42 routes build
```

Plus manual checks:
- [ ] No console errors in browser devtools
- [ ] No hydration mismatch warnings
- [ ] No layout shift (CLS < 0.1) on home, PDP, cart
- [ ] Bottom nav visible on every consumer page
- [ ] `prefers-reduced-motion` honored
- [ ] Keyboard nav works (Tab through header → main → bottom nav)
- [ ] Screen reader announces all CTAs
- [ ] All 8 breakpoints render correctly (320/360/375/390/414/768/1024/1280/1440)

---

## 14. Success Criteria (per user directive)

> *"User opening site first time should immediately feel Apple/Samsung/Nike SNKRS/Stripe-level polish while preserving functionality and brand identity."*

After Phases 5.1–5.12:

1. ✅ Every page renders inside `MobileLayout` with the floating bottom nav visible.
2. ✅ Every color, font size, spacing value, radius, shadow comes from `theme.*` — zero hardcoded literals.
3. ✅ Every icon is Lucide, stroke 2px, snapped to 16/20/24.
4. ✅ Every product card has soft shadow, 20px radius, minimal text, lift-on-press.
5. ✅ Every animated surface respects `prefers-reduced-motion`.
6. ✅ Dark mode is one tap away in the menu drawer.
7. ✅ Page transitions are 180ms fade. Skeletons appear in 1 frame.
8. ✅ Status badges are neutral grey with colored dot — no pastel backgrounds.
9. ✅ One accent color (terracotta `#C8553D`) for live/sale/NEW indicators.
10. ✅ Zero TypeScript errors, zero lint errors, zero console warnings.

---

## 15. Constraints Honored

| Constraint | Status |
|---|---|
| Don't redesign from scratch | ✅ Building on existing tokens + `MobileLayout` |
| Don't change branding (LNKICKS wordmark, "Stocked & Loaded" tagline) | ✅ Preserved |
| Don't break responsiveness | ✅ All changes use existing breakpoint approach |
| Don't change business logic / APIs / backend | ✅ Zero backend changes |
| Don't remove functionality | ✅ All features preserved (cart, wishlist, search, etc.) |
| Improve only UI/UX/consistency/spacing/typography/animations/visual hierarchy | ✅ Exactly this |
| Desktop Home Page LOCKED | ✅ Section 11 documents findings only — no implementation |

---

**End of audit.**
