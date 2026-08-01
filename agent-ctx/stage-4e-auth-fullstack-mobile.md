# Task: stage-4e-auth

**Agent**: fullstack-mobile
**Date**: 2026 mobile-migration phase 4e (final auth pages)

## Scope

Migrate the 3 LN KICKS mobile auth pages to the universal `MobileLayout`
shell + design tokens (colors / spacing / radius / shadows / typography /
motion / zIndex) + haptics + pressable interactions:

1. `/login` — `<MobileLayout headerVariant="minimal" hideBottomNav title="Login">`
2. `/register` — `<MobileLayout headerVariant="minimal" hideBottomNav title="Register">`
3. `/admin-login` — `<MobileLayout headerVariant="minimal" hideBottomNav title="Admin Login">`

All 3 are unauthenticated routes — `headerVariant="minimal"` keeps the
chrome to just a centered LNKICKS wordmark (no menu/cart/profile icons,
since the user has no cart or profile yet), and `hideBottomNav` suppresses
the floating bottom nav (Home/Wishlist/Cart/Profile targets don't make
sense for an anonymous user).

## Reference documents (read first)

- `worklog.md` — prior audit + stage-4b/4c/4d conversion recipe.
- `components/layout/MobileLayout.tsx` — universal mobile shell; confirmed
  the `headerVariant="minimal"` + `hideBottomNav` pattern for auth (the
  MobileMinimalHeader renders only the centered LNKICKS wordmark; the
  bottom nav is gated on `!hideBottomNav`).
- `app/product/[slug]/page.tsx` — gold-reference for the conversion pattern
  (MobileLayout import + `padding: 0 ${theme.spacing.pad}px` content wrapper
  + haptic + pressableStyle + theme.* tokens throughout).
- `lib/mobile/theme/*.ts` — design tokens (colors / spacing / radius /
  shadows / typography / motion / zIndex).
- `lib/mobile/utils/{safeArea,interactions,haptics}.ts` — utilities.
- `components/context/AppContext.tsx` — useApp() shape (showToast) for the
  login/register/admin-login success + error toasts.

## Constraints honored

- Desktop Home Page LOCKED — no edits to `components/home/desktop/`,
  `components/desktop/`, or `app/desktop/`.
- `#FF3B30` (iOS red — FORBIDDEN) eliminated everywhere; replaced with:
  • `theme.colors.error` (#7f1d1d muted maroon) for the admin eyebrow
    ("ENTERPRISE ADMIN PORTAL") — preserves the "this is admin" visual
    signal without the harsh red.
  • `theme.colors.black` for the admin submit CTA — matches the primary-
    CTA pattern used everywhere else in the app (Place Order / Sign In /
    Create Account / Add to Cart all use matte-black).
- All `useApp` / `useState` / `useRouter` calls + all event handlers +
  form submissions + redirects + Link hrefs preserved 1:1.
- All `<Image>` imports kept as-is (none of these 3 files use next/image —
  they're pure form pages, no imagery).
- Forms use token-driven inputs: `borderRadius: theme.radius.lg`,
  `border: 1.5px solid theme.colors.grey300`, focus state with
  `theme.colors.black` border (via `<style jsx>` `.auth-input:focus`),
  `padding: ${theme.spacing.md}px ${theme.spacing.lg}px`.
- Submit buttons use `className="pressable"` (well, `pressable-strong` for
  the primary CTAs to match the gold-reference PDP "Add to Cart" pattern)
  + `<style jsx>{pressableStyle}</style>`.
- `haptic.light()` on links (Forgot? / Join LNKICKS);
  `haptic.medium()` on the 3 submit CTAs (Sign In / Create Account /
  Authenticate Admin).

## Migration mapping (per token)

Hardcoded values → tokens (same as stage-4b/4c/4d):

| Original literal                | Token                                |
| ------------------------------- | ------------------------------------ |
| `#111111` (text)                | `theme.colors.textPrimary`           |
| `#111111` (button bg / border)  | `theme.colors.black`                 |
| `#777777` (text)                | `theme.colors.textSecondary`         |
| `#FF3B30` (FORBIDDEN, eyebrow)  | `theme.colors.error` (#7f1d1d)       |
| `#FF3B30` (FORBIDDEN, button)   | `theme.colors.black`                 |
| `#EBEBEB` (card border)         | `theme.colors.grey150`               |
| `#E0E0E0` (input border)        | `theme.colors.grey300`               |
| `#ffffff` (bg / text-on-black)  | `theme.colors.white`                 |
| `var(--font-oswald)`            | `theme.fontFamily.display`           |
| `var(--font-playfair)`          | `theme.fontFamily.editorial`         |
| 28px (h1 / brand wordmark)      | `theme.fontSize.h2` (26)             |
| 14px (button text)              | `theme.fontSize.md`                  |
| 13px (input text)               | `theme.fontSize.body`                |
| 11px (label)                    | `theme.fontSize.sm`                  |
| 10px / 9px (eyebrow)            | `theme.fontSize.xs`                  |
| 0.22em / 0.2em letterSpacing    | `theme.letterSpacing.widest` / `wider` |
| 0.08em letterSpacing            | `theme.letterSpacing.wider`          |
| fontWeight 700                  | `theme.fontWeight.bold`              |
| fontWeight 800                  | `theme.fontWeight.extrabold`         |
| 36px (card padding)             | `theme.spacing.section`              |
| 28px (margin-bottom brand head) | `theme.spacing.xxxl`                 |
| 24px (margin-top footer)        | `theme.spacing.xxl`                  |
| 20px (h1 margin-bottom)         | `theme.spacing.xl`                   |
| 16px (form gap)                 | `theme.spacing.lg`                   |
| 14px (button padding-y)         | `theme.spacing.lg - 2`               |
| 12px (input padding-y)          | `theme.spacing.md`                   |
| 16px (input padding-x)          | `theme.spacing.lg`                   |
| 28px radius (card)              | `theme.radius.hero`                  |
| 30px radius (CTA)               | `theme.radius.pill`                  |
| 14px radius (input)             | `theme.radius.lg`                    |
| boxShadow `0 8px 24px rgba(...)` | `theme.shadows.sm`                   |
| boxShadow `0 12px 32px rgba(...)` | `theme.shadows.lg`                 |
| (no box-shadow)                 | `theme.shadows.xs`                   |

## Verification

- `npx tsc --noEmit` → EXIT=0 (zero TypeScript errors).
- `npm run lint` → EXIT=0; zero errors and zero warnings on the 3 migrated
  files. The only lint output is the pre-existing `<img>` warning in
  `components/mobile/MobilePopularShoes.tsx` (untouched by this task,
  present in every prior stage-4 verification).

## Notes for downstream stages

- Phase B mobile backlog is now COMPLETE. Every mobile-relevant app route
  mounts `MobileLayout` + tokens.
- Total routes migrated across stages 4b/4c/4d/4e:
  - 4b: `/cart`, `/checkout` (2)
  - 4c: `/wishlist`, `/search`, `/categories`, `/products`,
    `/category-products`, `/category/[slug]` (6)
  - 4d: `/profile`, `/my-orders`, `/track-order`, `/order-success`,
    `/order-failed`, `/order-detail` (6)
  - 4e: `/login`, `/register`, `/admin-login` (3)
  - **Total: 17 mobile routes unified under MobileLayout + design tokens.**
- The only literal non-token values remaining in any of the 17 files are:
  • Demo data (cred strings, sample order IDs, Google-hosted demo image
    URLs in order-detail, joined-date strings).
  • CSS math (`calc(100vh - 120px)` for the auth vertical-centering).
  • The `#E3FCEF` / `#FBEAEA` status-tint backgrounds (success-green and
    rose-tint pills matching the PDP "In Stock" convention).
- No desktop files modified in any stage. Desktop Home Page LOCKED
  throughout.
