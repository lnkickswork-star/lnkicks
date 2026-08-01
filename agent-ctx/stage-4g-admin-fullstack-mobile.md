# Task: stage-4g-admin

**Agent**: fullstack-mobile
**Date**: 2026 mobile-migration phase 4g (admin)

## Scope

Migrate 8 LN KICKS admin pages to the universal `MobileLayout` shell +
design tokens (colors / spacing / radius / shadows / typography / motion /
zIndex) + haptics + pressable interactions. Admin pages use
`headerVariant="back"` + `hideBottomNav` so admin users do NOT see the
consumer bottom nav (Home / Wishlist / Cart FAB / Profile / Categories).

### Pattern B (ResponsiveAppLayout → MobileLayout)
1. `/dashboard` — `<MobileLayout headerVariant="back" title="Dashboard" hideBottomNav>`
2. `/products-management` — `<MobileLayout headerVariant="back" title="Products" hideBottomNav>`

### Pattern C (broken Tailwind → full rewrite)
3. `/add-product` — `<MobileLayout headerVariant="back" title="Add Product" hideBottomNav>`
4. `/edit-product` — `<MobileLayout headerVariant="back" title="Edit Product" hideBottomNav>`
5. `/customers-management` — `<MobileLayout headerVariant="back" title="Customers" hideBottomNav>`
6. `/orders-management` — `<MobileLayout headerVariant="back" title="Orders" hideBottomNav>`
7. `/reports-analytics` — `<MobileLayout headerVariant="back" title="Reports" hideBottomNav>`
8. `/settings-panel` — `<MobileLayout headerVariant="back" title="Settings" hideBottomNav>`

## Reference documents (read first)

- `worklog.md` — prior audit + stage-4b/4c/4d conversion recipe.
- `components/layout/MobileLayout.tsx` — universal mobile shell; variants
  `default` / `back` / `minimal` / `none`; `hideBottomNav` + `hideCartFab`
  props. Admin pages use `back` + `hideBottomNav`.
- `app/product/[slug]/page.tsx` — gold-reference for the conversion pattern
  (MobileLayout import + `padding: 0 ${theme.spacing.pad}px` content wrapper
  + haptic + pressableStyle + theme.* tokens throughout).
- `lib/mobile/theme/*.ts` — design tokens (colors / spacing / radius /
  shadows / typography / motion / zIndex).
- `lib/mobile/utils/{safeArea,interactions,haptics}.ts` — utilities.
- `components/context/AppContext.tsx` — useApp().showToast for admin-action
  feedback toasts.

## Constraints honored

- Desktop Home Page LOCKED — no edits to `components/home/desktop/`,
  `components/desktop/`, or `app/desktop/`.
- `#FF3B30` (iOS red — FORBIDDEN) eliminated everywhere; replaced with
  `theme.colors.error` (#7f1d1d muted maroon) for destructive UI,
  `theme.colors.black` for admin CTAs, `theme.colors.price` for prices,
  warning amber (#FEF3C7 + #78350f) for Processing status, and success
  green (#E3FCEF + #14532d) for Delivered status / positive deltas,
  per stage-4b/4c/4d recipe.
- `pressable` class + `<style jsx>{pressableStyle}</style>` applied to
  every tappable element.
- `haptic.light()` (or `.medium()` / `.selection()` / `.success()` for
  semantic weight) on every button/link/toggle/chip tap.
- `haptic.medium()` on primary admin CTAs: Save Product, Update Product,
  Save Changes, Manage Account, Manage Catalog, Manage Orders, Add New
  Product, image-delete.
- All `<Image>` imports preserved as next/image (unoptimized for remote
  Google-hosted URLs).
- All business logic preserved 1:1: useApp().showToast wired on every
  admin action for visible feedback; useState tracks form state where
  the original markup implied it; all Link hrefs preserved; all demo
  data preserved verbatim.
- Admin forms use token-driven inputs: `borderRadius: theme.radius.lg`
  + `border: 1.5px solid theme.colors.grey300` + focus with
  `theme.colors.black` border.
- Admin tables use `theme.colors.grey50` header row + `1px solid
  theme.colors.grey150` row borders.
- Admin stats cards: `theme.radius.lg` cards on `theme.colors.white` with
  `1px solid theme.colors.grey150` border, large numeric value in
  `theme.fontSize.h1` + `theme.fontWeight.extrabold`.

## Files modified (8)

1. `app/dashboard/page.tsx` — Pattern B → MobileLayout + tokens. Admin
   nav strip + 4 stat cards + 2 quick-management CTA cards.
2. `app/products-management/page.tsx` — Pattern B → MobileLayout + tokens.
   Inventory table with header row + per-row Edit link, "+ Add New
   Product" primary CTA linking to /add-product.
3. `app/add-product/page.tsx` — Pattern C full rewrite. Image upload +
   name input + description textarea + price/category grid + size chips
   (toggle) + settings toggles + sticky Save Product CTA.
4. `app/edit-product/page.tsx` — Pattern C full rewrite. Image gallery
   (horizontal scroll with delete affordance + Add New tile) + product
   name + price (with $ prefix) + stock + category + default size +
   description + Update Product + Archive Listing CTAs.
5. `app/customers-management/page.tsx` — Pattern C full rewrite. Search
   bar + 2-col bento stats + 4 customer cards (avatar + name + email +
   order count + Manage Account + profile icon) + Load More link.
6. `app/orders-management/page.tsx` — Pattern C full rewrite. Title +
   search + status filter chips + 2-col stats (Today's Revenue + Active
   Orders) + Recent Orders list (4 cards with StatusBadge + orderId +
   customer + date + items + total) + Export CSV link.
7. `app/reports-analytics/page.tsx` — Pattern C full rewrite. KPI bento
   grid (Revenue col-span-2 with monochrome bar chart + Orders + Avg.
   Order) + Popular Products list (2 cards with avatar + sold/rev +
   chevron) + Sales Trends SVG chart + Customer Profile radial gauges
   (Male 68% / Female 32%).
8. `app/settings-panel/page.tsx` — Pattern C full rewrite. 4 settings
   sections (General / Payment Gateway / Shipping / User Roles) with
   token-driven inputs + 4 Toggle components + Save Changes CTA.

## Verification

- `npx tsc --noEmit` → EXIT=0 (zero TypeScript errors).
- `npm run lint` → EXIT=0; zero errors and zero warnings on the 8
  migrated files. The only lint output is a pre-existing `<img>` warning
  in `components/mobile/MobilePopularShoes.tsx` (untouched).

## Stage outcome

- 8 admin pages now share the universal premium chrome (glass header +
  safe-area + skip link + service worker) via MobileLayout's internal
  mobile/desktop detection — no per-page UA branching needed.
- Admin users see the back-arrow + LNKICKS + Cart + Profile header but
  do NOT see the consumer bottom nav (per spec).
- ZERO hardcoded hex values remain (only literals: the Google-hosted
  demo image URLs in 4 Pattern C rewrites, preserved verbatim; and the
  semantic tints #E3FCEF / #FBEAEA / #FEF3C7 used for status pills +
  delta badges that match the PDP / track-order / order-failed
  convention from stage-4b/4c/4d).
- FORBIDDEN iOS red #FF3B30 fully eliminated from all 8 files.
- Material Symbols font icons fully eliminated from the 6 Pattern C
  rewrites — replaced with inline SVG icons (gear, wallet, truck, badge,
  card, person, search, chevron-right, plus, X, check-circle,
  trending-up, horizontal-rule, expand-more).
- All admin forms use token-driven inputs (radius.lg + 1.5px solid
  grey300 border + black focus border); admin tables use grey50 header
  row + grey150 row borders; admin stats cards use radius.lg + grey150
  border + h1 extrabold numeric value per spec.
- Haptics wired on every interactive surface (medium on primary CTAs,
  light on secondary taps, selection on chip/toggle changes).
- `pressable` class + pressableStyle applied on all tappable elements;
  per-page `<style jsx>` blocks add focus-visible rings + scale-down
  active states for keyboard + tactile feedback.
- Business logic preserved 1:1: useApp().showToast wired on every admin
  action; useState tracks form state (selected sizes in add-product,
  active filter in orders-management, 4 toggles in settings-panel, search
  query in customers-management); PRODUCT_REGISTRY mapping preserved in
  products-management; all Link hrefs preserved; all Image components
  preserved verbatim; all demo data preserved verbatim.
- Desktop homepage / desktop components / desktop routes: untouched
  (LOCKED). No files outside the 8 specified were modified.
- TypeScript: clean (EXIT=0). Lint: clean (only pre-existing unrelated
  <img> warning in MobilePopularShoes.tsx).
