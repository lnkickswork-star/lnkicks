# Work Record — stage-4c-wishlist-search-categories

**Agent:** fullstack-mobile
**Task ID:** stage-4c-wishlist-search-categories
**Scope:** Migrate 6 mobile pages (wishlist, search, categories, products,
category-products, category/[slug]) from `ResponsiveAppLayout` to the new
universal `MobileLayout` shell + LN KICKS mobile design tokens.

## Files modified
1. `app/wishlist/page.tsx` → MobileLayout + tokens (haptics + pressable)
2. `app/search/page.tsx` → MobileLayout + tokens (haptics + pressable)
3. `app/categories/page.tsx` → MobileLayout + tokens (haptics + pressable)
4. `app/products/page.tsx` → MobileLayout + tokens (haptics + pressable)
5. `app/category-products/page.tsx` → MobileLayout + tokens (haptics + pressable)
6. `app/category/[slug]/page.tsx` → MobileLayout + tokens (pressable)

## Conversion pattern (applied uniformly)
- Import `MobileLayout` from `@/components/layout/MobileLayout` (replaces
  `ResponsiveAppLayout` import).
- Wrap page in `<MobileLayout headerVariant="back" title="X">…</MobileLayout>`.
- Wrap inner content in `<div style={{ padding: \`0 ${theme.spacing.pad}px\` }}>`.
- Migrate every hardcoded value to a `theme.*` token:
  - `#111111` → `theme.colors.textPrimary` (#0A0A0A)
  - `#777777` → `theme.colors.textSecondary` (#6b7280)
  - `#FF3B30` (iOS red — FORBIDDEN) → `theme.colors.price` (BLACK) for prices,
    `theme.colors.error` (#7f1d1d) for destructive actions, or
    `theme.colors.white` for eyebrows on black banners
  - `#EBEBEB` / `#F6F6F8` → `theme.colors.border` / `theme.colors.grey100`
  - `#F0F0F2` / `#F8F8FA` → `theme.colors.grey100`
  - `#E0E0E0` → `theme.colors.borderStrong`
  - `#ffffff` / `#111111` (bg) → `theme.colors.white` / `theme.colors.black`
  - 4/8/12/16/20/24/28/32/36/48px → spacing.xs / sm / md / lg / xl / xxl /
    xxxl / huge / section / giant
  - 6/10/14/18/22/28px radius → radius.sm / md / lg / xl / xxl / hero
  - 30px radius → radius.pill
  - `var(--font-oswald)` → `theme.fontFamily.display`
  - All inline `boxShadow` strings → `theme.shadows.*` (xs / sm / lg)
  - All `filter: drop-shadow(...)` → `theme.dropShadows.*`
- Add `className="pressable"` on every tappable element + mount
  `<style jsx>{pressableStyle}</style>` at the bottom of each MobileLayout
  wrapper. Add per-element `:active` scale-down via a second styled-jsx block
  keyed off unique class names (e.g. `wl-move`, `search-chip`, `cp-chip`).
- Haptic feedback on every button/link/select interaction:
  - `haptic.light()` — generic taps, link navigations, secondary chips
  - `haptic.medium()` — primary CTAs (Move to Cart, Reset Filters)
  - `haptic.selection()` — chip selects, dropdown changes, segmented controls
- PRESERVE every `useApp()` call, every `useState` / `useSearchParams` /
  `useParams`, every event handler, every Link `href`, every `next/image`
  `<Image>`, every registry import, every `ProductCard` usage (component
  untouched — only surrounding container is styled).

## Banned iOS red #FF3B30 removal sites
| File | Original #FF3B30 usage | Replacement |
|---|---|---|
| wishlist | Price text | `theme.colors.price` (BLACK) |
| wishlist | ✕ remove-button color | `theme.colors.black` |
| search | Reset Filters button bg | `theme.colors.error` (#7f1d1d muted red) |
| categories | Hero eyebrow on black bg | `theme.colors.white` |
| products | Collection banner eyebrow on black bg | `theme.colors.white` |

## Verification
- `npx tsc --noEmit` → 0 errors
- `npm run lint` → 0 errors, 0 warnings on the 6 migrated files (only
  pre-existing warning in `components/mobile/MobilePopularShoes.tsx`,
  untouched).

## Notes for downstream agents
- Desktop homepage / `components/desktop/*` / `components/home/desktop/*` /
  `app/desktop/*` — untouched (LOCKED preserved per spec).
- `ProductCard` component itself was NOT modified in this stage — only its
  container grids / wrappers received token styling.
- The hero / collection banners on `/categories` and `/products` keep their
  matte-black background per LN KICKS luxury aesthetic; only the eyebrow
  color was de-reded (white on black is the standard luxury convention).
- Two emoji glyphs (❤️ on wishlist empty state, 🔍 on search empty state)
  were preserved as decorative `aria-hidden` content — they are not business
  logic and could be swapped for SVG icons in a later polish pass if desired.
