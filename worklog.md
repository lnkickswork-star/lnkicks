# LNKICKS — Worklog

---
Task ID: arch-remediation-1
Agent: Main (Principal Software Architect)
Task: Phase 1 Architecture Remediation — eliminate HIGH severity architecture problems
  (duplicate routes, duplicate assets, next/image migration, next/font migration, route metadata)

Work Log:
- Performed full dependency analysis (Task agent: Explore) — 46 page.tsx files, 5 byte-identical
  duplicate route pairs, 15 byte-identical duplicate PNG assets, 36 <img> tags, Google Fonts CDN
  loaded from app/layout.tsx, zero per-route metadata, no node_modules installed.
- Created `lib/route-metadata.ts` — typed factory for Next.js Metadata objects (title, description,
  canonical, OpenGraph, Twitter Card, robots).
- Rewrote `app/layout.tsx` — removed Google Fonts CDN <link> tags, added `next/font/google`
  instances for Oswald (600/700), Playfair_Display (400/600 + italic), Inter (300-700), exposed
  as CSS variables --font-oswald / --font-playfair / --font-inter on <html>.
- Updated `next.config.js` — added 5 permanent redirects for deleted duplicate routes.
- Wrote `scripts/migrate_font_families.py` and ran it — replaced 113 inline `fontFamily` string
  references across 34 .tsx/.ts files with CSS variable references.
- Updated `components/ui/ProductCard.tsx` — added `slug?` prop, replaced `<img>` with `next/image`,
  links to `/product/[slug]` (was `/product-detail`).
- Updated `app/mobile/page.tsx` — 4 `<img>` → `<Image>`, NOTIFY ME CTA points to
  `/product/air-jordan-1-low-black-powder-blue` (was `/product-detail`).
- Updated `app/desktop/page.tsx` — 1 `<img>` → `<Image>` with priority.
- Updated `app/product/[slug]/page.tsx` — 2 `<img>` → `<Image>`, passes slug to ProductCard.
- Updated `app/cart/page.tsx`, `app/my-orders/page.tsx`, `app/wishlist/page.tsx` — `<img>` →
  `<Image>` for cart/order/wishlist item thumbnails.
- Updated `app/products/page.tsx` — fixed pre-existing syntax error `fontWeight 600` (missing
  colon) and passes slug to ProductCard.
- Updated `app/search/page.tsx` and `app/category/[slug]/page.tsx` — pass slug to ProductCard.
- Deleted 5 byte-identical duplicate route directories: `app/admin/dashboard/`, `app/admin/products/`,
  `app/account/profile/`, `app/account/orders/`, `app/product-detail/`. The parent `app/admin/` and
  `app/account/` directories are now empty and removed.
- Deleted 15 byte-identical duplicate PNG files from the project root (they were duplicates of
  /public/ copies; Next.js only serves from /public/).
- Wrote `scripts/generate_route_metadata_layouts.py` and ran it — created 41 `layout.tsx` files
  (39 static `metadata` exports + 2 `generateMetadata` for /product/[slug] and /category/[slug]).
- Added `.eslintrc.json` extending `next/core-web-vitals` (required for `npm run lint`).
- Installed `eslint@8` + `eslint-config-next@14.2.35` (Next 14-compatible).
- Updated `tsconfig.json` exclude list to skip workspace internals (`skills/`, `scripts/`,
  `download/`).
- Fixed 6 `react/no-unescaped-entities` ESLint errors by escaping `'` as `&apos;` and `"` as
  `&quot;` in JSX text content (cart, desktop, login, mobile, search, ResponsiveAppLayout).
- Fixed 2 pre-existing TypeScript parse errors: `fontWeight 600` → `fontWeight: 600` in
  `components/layout/MobileFooter.tsx:23`, and unescaped apostrophe in
  `components/seo/JsonLd.tsx:12` (single-quote → double-quote string).
- Removed invalid CSS property `sticky: 'top'` from `app/desktop/page.tsx:21` (was a pre-existing
  typo; not a valid React.CSSProperties key — would have caused TypeScript build error).
- Fixed `lib/route-metadata.ts` type — `ogType` was `'website' | 'article' | 'product'` but
  Next.js's OpenGraph type only allows `'website' | 'article'`. Removed `'product'`, set product
  pages to use `'article'`.
- Fixed `app/layout.tsx` — Oswald font only ships weights 200-700 on Google Fonts; removed the
  invalid `800` weight (was silently falling back to 700 via CDN, now explicit).

Stage Summary:
- Build: ✅ PASSES — `npm run build` produces 43 routes (41 static + 2 dynamic).
- Lint: ✅ PASSES — `npm run lint` reports "No ESLint warnings or errors".
- Files modified: 38 (app/layout.tsx, next.config.js, tsconfig.json, .eslintrc.json, package.json,
  package-lock.json, 1 lib file, 1 component, 25 page.tsx files via font migration, 5 page.tsx
  files via next/image migration, 2 page.tsx files via slug wiring, 2 component fixes).
- Files created: 44 (1 lib helper, 41 route layout.tsx files, 2 Python scripts).
- Files deleted: 20 (5 duplicate route directories containing 5 page.tsx files + 15 duplicate
  root-level PNG files).
- No git history rewritten. No force push. No authentication changes. No CI / workflow / community
  file modifications.
