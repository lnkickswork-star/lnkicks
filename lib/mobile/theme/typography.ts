/**
 * typography.ts — LN KICKS Mobile Design System / Typography Tokens
 *
 * APPLE × SAMSUNG × GOOGLE × NIKE PREMIUM TYPE SYSTEM (Phase 6)
 *
 * Single font family: Inter (with full system fallback chain).
 * NO Oswald, NO Playfair — those were Phase 4 and are now retired on mobile.
 * (Desktop still uses Oswald/Playfair via app/layout.tsx — that is untouched.)
 *
 * Weight scale (300–700 only — no heavy 800/900):
 *   300 Light, 400 Regular, 500 Medium, 600 Semibold, 700 Bold
 *
 * Type scale calibrated for 360–440px viewports:
 *   Hero 32/38, Section 24/30, Product 16/22, Price 18, Body 14/20, etc.
 *
 * Font features: liga, kern, calt enabled globally for premium rendering.
 *
 * Usage: import { typography } from '@/lib/mobile/theme/typography';
 */

/**
 * Single font stack — Inter first, then the full Apple/Google/system
 * fallback chain. Matches the spec exactly:
 *   Inter, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display",
 *   "SF Pro Text", Roboto, Arial, sans-serif
 *
 * `var(--font-inter)` resolves to next/font's self-hosted Inter (wired in
 * app/layout.tsx). On environments where the CSS variable isn't present
 * (e.g. plain SSR HTML before hydration), the fallback chain kicks in.
 */
const INTER_STACK =
  'var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Roboto, Arial, sans-serif';

export const fontFamily = {
  /** Primary font for ALL mobile text — Inter with full system fallback */
  body: INTER_STACK,
  /** Display headlines — now Inter (was Oswald in Phase 4) */
  display: INTER_STACK,
  /** Editorial accents — now Inter (was Playfair in Phase 4) */
  editorial: INTER_STACK,
} as const;

/**
 * Type scale — Phase 7 editorial premium refresh.
 *
 * HIERARCHY (per new spec):
 *   Brand         12px / 500 / gray
 *   Product Name  20–22px / 600
 *   Price         22–24px / 700
 *   Old Price     14px / 500 / strikethrough / 60% opacity
 *   Rating        12px / 400 / light gray
 *   Section       24px / 700
 *   Hero          32px / 700
 *   Body          14px / 400
 *   Caption       12px / 400
 *   Bottom Nav    11px / 500
 */
export const fontSize = {
  /** 9.5px — legacy micro (kept for backwards compat, prefer `navLabel`) */
  micro: 9.5,
  /** 10px — eyebrow / kicker labels */
  xs: 10,
  /** 11px — Bottom Navigation labels */
  navLabel: 11,
  /** 11px — small captions, status bar (alias of navLabel) */
  sm: 11,
  /** 12px — Caption / Brand Name / metadata */
  caption: 12,
  /** 12px — legacy `base` token (alias of caption) */
  base: 12,
  /** 13px — small body text */
  body: 13,
  /** 14px — Body / Original Price / secondary text */
  md: 14,
  /** 15px — Search Placeholder / Buttons / featured body */
  lg: 15,
  /** 16px — legacy Product Name (kept for backwards compat) */
  productName: 16,
  /** 17px — header wordmark, prominent labels (legacy) */
  xl: 17,
  /** 18px — legacy Price (kept for backwards compat) */
  price: 18,
  /** 20px — small headlines (legacy) */
  xxl: 20,
  /** 20px — preferred Product Name (Phase 7 spec) */
  productNameLg: 20,
  /** 22px — legacy title (alias of sectionSubtitle) */
  title: 22,
  /** 22px — preferred Product Name large (Phase 7 spec) */
  productNameXl: 22,
  /** 22px — preferred Price (Phase 7 spec) */
  priceLg: 22,
  /** 24px — Section Heading */
  section: 24,
  /** 24px — preferred Price large (Phase 7 spec) */
  priceXl: 24,
  /** 26px — legacy h2 (alias) */
  h2: 26,
  /** 30px — legacy h1 (alias) */
  h1: 30,
  /** 32px — Hero Heading */
  hero: 32,
  /** 38px — legacy hero splash (alias) */
  heroLg: 38,
  /** 48px — legacy splash wordmark */
  display: 48,
  /** 56px — legacy (retired) */
  heroXl: 56,
  /** 96px — legacy watermark (retired on mobile, kept for splash) */
  watermark: 96,
} as const;

/**
 * Weight scale — 300 to 700 only.
 * Heavy 800/900 weights are RETIRED on mobile per the new spec.
 * (Tokens kept for backwards compatibility but should not be used.)
 */
export const fontWeight = {
  /** 300 — Light (large display headlines, hero leads) */
  light: 300,
  /** 400 — Regular (body, captions) */
  regular: 400,
  /** 500 — Medium (brand names, bottom nav, original price) */
  medium: 500,
  /** 600 — Semibold (product names, buttons) */
  semibold: 600,
  /** 700 — Bold (hero, section, price, header wordmark) */
  bold: 700,
  // ── Legacy heavy weights (RETAINED for backwards compat, do NOT use) ──
  extrabold: 700, // alias of bold — Phase 6 retire
  black: 700, // alias of bold — Phase 6 retire
} as const;

export const lineHeight = {
  /** 1.0 — tight display */
  tightest: 1.0,
  /** 1.05 — tight (legacy) */
  tight: 1.05,
  /** 1.15 — snug (legacy) */
  snug: 1.15,
  /** 1.1875 — 38/32 hero line height */
  hero: 1.1875,
  /** 1.25 — 30/24 section line height */
  section: 1.25,
  /** 1.375 — 22/16 product name line height */
  product: 1.375,
  /** 1.35 — normal (legacy) */
  normal: 1.35,
  /** 1.4286 — 20/14 body line height */
  body: 1.4286,
  /** 1.5 — relaxed (legacy) */
  relaxed: 1.5,
  /** 1.75 — loose (legacy) */
  loose: 1.75,
} as const;

export const letterSpacing = {
  tightest: '-0.03em',
  tight: '-0.02em',
  /** -0.01em — slight tightening for large headlines */
  slight: '-0.01em',
  normal: '0',
  /** 0.5px — Brand Name letter spacing (per spec) */
  brandName: '0.5px',
  /** 0.04em — wide (legacy) */
  wide: '0.04em',
  /** 0.14em — wider (legacy) */
  wider: '0.14em',
  /** 0.18em — widest (legacy) */
  widest: '0.18em',
  extreme: '0.28em',
} as const;

/**
 * OpenType features to enable globally for premium rendering.
 * Applied via `fontFeatureSettings` on body and major text blocks.
 *
 *   liga  — standard ligatures (fi, fl, etc.)
 *   kern  — kerning pairs (improves letter spacing)
 *   calt  — contextual alternates (better letterforms)
 */
export const fontFeatures = '"liga", "kern", "calt"';

// ── Preset composites ───────────────────────────────────────────────
export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontFeatures,
  // Compound presets for one-line styling
  presets: {
    /** Eyebrow / kicker — 10px bold uppercase, wide tracking */
    eyebrow: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.xs,
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.wide,
      textTransform: 'uppercase' as const,
      fontFeatureSettings: fontFeatures,
    },
    /** Hero Heading — 32px / 700 / 38px line height */
    hero: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.hero,
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.hero,
      letterSpacing: letterSpacing.tight,
      fontFeatureSettings: fontFeatures,
    },
    /** Section Heading — 24px / 700 / 30px line height */
    sectionTitle: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.section,
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.section,
      letterSpacing: letterSpacing.tight,
      fontFeatureSettings: fontFeatures,
    },
    /** Product Name — 16px / 600 / 22px line height (legacy) */
    cardTitle: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.productName,
      fontWeight: fontWeight.semibold,
      lineHeight: lineHeight.product,
      letterSpacing: letterSpacing.normal,
      fontFeatureSettings: fontFeatures,
    },
    /** Product Name — 20px / 600 (Phase 7 spec, preferred) */
    productName: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.productNameLg,
      fontWeight: fontWeight.semibold,
      lineHeight: lineHeight.product,
      letterSpacing: letterSpacing.normal,
      fontFeatureSettings: fontFeatures,
    },
    /** Body — 14px / 400 / 20px line height */
    body: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.md,
      fontWeight: fontWeight.regular,
      lineHeight: lineHeight.body,
      fontFeatureSettings: fontFeatures,
    },
    /** Price — 18px / 700 (legacy) */
    price: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.price,
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
      fontFeatureSettings: fontFeatures,
    },
    /** Price — 22px / 700 (Phase 7 spec, preferred) */
    priceLg: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.priceLg,
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.normal,
      fontFeatureSettings: fontFeatures,
    },
    /** Original Price — 14px / 500 / strikethrough / 60% opacity */
    originalPrice: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.normal,
      textDecoration: 'line-through' as const,
      fontFeatureSettings: fontFeatures,
    },
    /** Brand Name — 12px / 500 / uppercase / 0.5px letter spacing */
    brandName: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.brandName,
      textTransform: 'uppercase' as const,
      fontFeatureSettings: fontFeatures,
    },
    /** Button — 15px / 600 */
    cta: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      letterSpacing: letterSpacing.normal,
      fontFeatureSettings: fontFeatures,
    },
    /** Bottom Navigation — 11px / 500 */
    navLabel: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.navLabel,
      fontWeight: fontWeight.medium,
      letterSpacing: letterSpacing.normal,
      fontFeatureSettings: fontFeatures,
    },
    /** Search Placeholder — 15px / 400 */
    searchPlaceholder: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.regular,
      letterSpacing: letterSpacing.normal,
      fontFeatureSettings: fontFeatures,
    },
    /** Caption — 12px / 400 */
    caption: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.regular,
      letterSpacing: letterSpacing.normal,
      fontFeatureSettings: fontFeatures,
    },
  },
} as const;

export type FontSizeToken = keyof typeof fontSize;
export type FontWeightToken = keyof typeof fontWeight;
export default typography;
