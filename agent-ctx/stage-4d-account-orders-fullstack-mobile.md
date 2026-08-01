# Task: stage-4d-account-orders

**Agent**: fullstack-mobile
**Date**: 2026 mobile-migration phase 4d

## Scope

Migrate 6 LN KICKS mobile pages to the universal `MobileLayout` shell +
design tokens (colors / spacing / radius / shadows / typography / motion /
zIndex) + haptics + pressable interactions:

1. `/profile` — `<MobileLayout headerVariant="back" title="Profile">`
2. `/my-orders` — `<MobileLayout headerVariant="back" title="My Orders">`
3. `/track-order` — `<MobileLayout headerVariant="back" title="Track Order">`
4. `/order-success` — `<MobileLayout headerVariant="minimal" hideBottomNav>`
5. `/order-failed` — `<MobileLayout headerVariant="minimal" hideBottomNav>`
6. `/order-detail` — Pattern C broken-Tailwind full rewrite with
   `<MobileLayout headerVariant="back" title="Order Detail">`

## Reference documents (read first)

- `worklog.md` — prior audit + stage-4b/4c conversion recipe.
- `components/layout/MobileLayout.tsx` — universal mobile shell; variants
  `default` / `back` / `minimal` / `none`; `hideBottomNav` + `hideCartFab`
  props.
- `app/product/[slug]/page.tsx` — gold-reference for the conversion pattern
  (MobileLayout import + `padding: 0 ${theme.spacing.pad}px` content wrapper
  + haptic + pressableStyle + theme.* tokens throughout).
- `lib/mobile/theme/*.ts` — design tokens (colors / spacing / radius /
  shadows / typography / motion / zIndex).
- `lib/mobile/utils/{safeArea,interactions,haptics}.ts` — utilities.
- `types/order.ts`, `types/user.ts` — Order + UserAddress shapes for the
  order-detail localStorage lookup + shipping-address rendering.
- `components/context/AppContext.tsx` — useApp() shape for showToast calls.

## Constraints honored

- Desktop Home Page LOCKED — no edits to `components/home/desktop/`,
  `components/desktop/`, or `app/desktop/`.
- `#FF3B30` (iOS red — FORBIDDEN) eliminated everywhere; replaced with
  `theme.colors.error` (#7f1d1d muted maroon) for destructive UI or
  `theme.colors.price` (matte black) for prices, per stage-4b/4c recipe.
- `pressable` / `pressable-strong` class + `<style jsx>{pressableStyle}</style>`
  applied to every tappable element.
- `haptic.light()` (or `.medium()` / `.success()` / `.error()` for semantic
  weight) on every button/link tap.
- All `<Image>` imports preserved as next/image.
- All `useApp()` calls, state, event handlers, Link hrefs, and business
  logic preserved verbatim.

## Verification

- `cd /home/z/my-project && npx tsc --noEmit` → EXIT=0 (zero TS errors).
- `cd /home/z/my-project && npm run lint` → EXIT=0; zero errors and zero
  warnings on the 6 migrated files. Only lint output is a pre-existing
  `<img>` warning in `components/mobile/MobilePopularShoes.tsx` (untouched).

## Files modified

- `app/profile/page.tsx`
- `app/my-orders/page.tsx`
- `app/track-order/page.tsx`
- `app/order-success/page.tsx`
- `app/order-failed/page.tsx`
- `app/order-detail/page.tsx`

No other files were touched.

## Notes for future agents

- The order-detail page was a Pattern C (broken Tailwind) page — fully
  rewritten from scratch. The original demo data (Jonathan Sterling address,
  Visa •••• 4492, Air Jordan 1 Retro High $190, Yeezy Boost 350 V2 $220,
  $442.80 total) is preserved as a typed `DEMO_ORDER` constant that serves
  as the fallback when no matching persisted order is found in
  `localStorage.lnk_orders`.
- The order-detail page now does a real `localStorage.lnk_orders` lookup by
  orderId (read from `useSearchParams`), making it functional rather than
  purely static. Falls back gracefully to the demo data when the order
  isn't found.
- The order-success + order-failed pages fire `haptic.success()` /
  `haptic.error()` on mount — the only places where a mount-time haptic
  is appropriate (transaction outcomes). Other pages fire haptics only on
  user-initiated taps.
- The order-success + order-failed pages use `hideBottomNav` per the task
  spec — keeps the user focused on the confirmation/retry screen and
  prevents accidental nav away from the post-transaction state.
