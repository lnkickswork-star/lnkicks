# Stage 4b — Cart + Checkout → MobileLayout + Design Tokens

**Task ID:** `stage-4b-cart-checkout`
**Agent:** fullstack-mobile
**Scope:** Migrate `app/cart/page.tsx` and `app/checkout/page.tsx` from the legacy `ResponsiveAppLayout` shell to the universal `MobileLayout` shell, with full design-token migration, haptics, and pressable interaction styling.

## Files modified

| File | Change |
|------|--------|
| `app/cart/page.tsx` | Full rewrite — `ResponsiveAppLayout` → `MobileLayout` (back header + `hideCartFab`); all hardcoded colors / sizes / radii / shadows / fonts migrated to `theme.*` tokens; haptics on qty stepper / remove / clear / checkout CTA; pressable class + focus-visible rings; `loading="lazy"` on cart-line `<Image>`. |
| `app/checkout/page.tsx` | Full rewrite — same migration; FORBIDDEN iOS red `#FF3B30` on PLACE ORDER CTA replaced with `theme.colors.black`; haptics on apply-coupon / payment-mode select / place-order (success / error / selection / medium patterns); `htmlFor`/`id` a11y pairings on form labels; default `paymentMode` fixed so the radio highlight actually matches the list. |
| `worklog.md` | Appended standard worklog entry under `Task ID: stage-4b-cart-checkout`. |

## Token migration map applied

| Hardcoded | Replaced with |
|-----------|---------------|
| `#111111` | `theme.colors.textPrimary` / `theme.colors.black` |
| `#777777` | `theme.colors.textSecondary` |
| `#FF3B30` (FORBIDDEN iOS red) | `theme.colors.price` (cart) / `theme.colors.black` (checkout CTA) |
| `#00875A` (harsh green) | `theme.colors.success` (#14532d — muted) |
| `#EBEBEB` | `theme.colors.grey150` / `theme.colors.border` |
| `#F8F8FA` / `#F0F0F2` | `theme.colors.grey100` |
| `#E0E0E0` | `theme.colors.grey300` |
| `#aaaaaa` | `theme.colors.textTertiary` |
| `'24px'` padding | `theme.spacing.xxl` (24) |
| `'20px'` padding | `theme.spacing.xl` (20) |
| `'16px'` padding | `theme.spacing.lg` (16) |
| `'28px'` padding | `theme.spacing.xxxl` (28) |
| `'14px'` radius | `theme.radius.lg` |
| `'16px'` radius | `theme.radius.xl` (18) |
| `'20px'` / `'24px'` radius | `theme.radius.xxl` (22 — token scale jumps 22→28, no 24) |
| `'30px'` radius | `theme.radius.pill` |
| `var(--font-oswald)` | `theme.fontFamily.display` |
| inline `boxShadow` strings | `theme.shadows.xs` / `theme.shadows.sm` |

## Haptic patterns used

| Interaction | Pattern |
|-------------|---------|
| Qty +/- stepper | `haptic.light()` |
| Apply Coupon tap | `haptic.light()` → `haptic.success()` / `haptic.error()` |
| Payment-mode select | `haptic.selection()` |
| Remove item / Clear bag | `haptic.medium()` |
| Proceed to Checkout / Start Shopping / Place Order (primary CTAs) | `haptic.medium()` |
| Validation failure | `haptic.error()` |

## Verification

- `npx tsc --noEmit` → EXIT=0 (zero TypeScript errors)
- `npm run lint` → only pre-existing `<img>` warning in `components/mobile/MobilePopularShoes.tsx` (unrelated to this task; no cart/checkout warnings)

## Constraints honored

- Desktop Home Page locked — no modifications to `components/home/desktop/*`, `components/desktop/*`, or `app/desktop/*`.
- No other mobile pages touched — only `app/cart/page.tsx` + `app/checkout/page.tsx`.
- All `useApp()` calls, state, event handlers, Link hrefs, `<Image>` components, and business logic preserved verbatim.
- `MobileLayout`'s internal UA detection handles mobile/desktop split — no manual UA wrap added.
- `hideCartFab` passed on both pages to avoid double-cart UX.
- `loading="lazy"` added to non-priority cart-line `<Image>`; all `<Image>` imports kept as `next/image` (no `<img>` introduced).
- Layout responsive: `repeat(auto-fit, minmax(320px, 1fr))` grid → single column on mobile (≤440px), 2-col on desktop.
