/**
 * typography.ts — LN KICKS Mobile Design System / Typography Tokens
 *
 * Three font families (already wired via next/font/google in app/layout.tsx):
 *   - Oswald     — display headlines (uppercase, condensed, bold)
 *   - Playfair   — luxury editorial accents
 *   - Inter      — body / UI / labels
 *
 * Size scale calibrated for 360–440px viewports. Type ratios tuned for
 * premium fashion retail (Nike, GOAT, END).
 *
 * Usage: import { typography } from '@/lib/mobile/theme/typography';
 */

export const fontFamily = {
  display: 'var(--font-oswald), sans-serif',
  editorial: 'var(--font-playfair), serif',
  body: 'var(--font-inter), sans-serif',
} as const;

export const fontSize = {
  /** 9.5px — bottom nav labels */
  micro: 9.5,
  /** 10px — eyebrow / kicker labels */
  xs: 10,
  /** 11px — small captions, status bar */
  sm: 11,
  /** 12px — metadata, secondary text */
  base: 12,
  /** 13px — small body text */
  body: 13,
  /** 14px — default body */
  md: 14,
  /** 15px — featured body / CTAs */
  lg: 15,
  /** 17px — header wordmark, prominent labels */
  xl: 17,
  /** 20px — small headlines */
  xxl: 20,
  /** 22px — section titles */
  title: 22,
  /** 26px — large section titles */
  h2: 26,
  /** 30px — featured section titles */
  h1: 30,
  /** 38px — hero splash headline */
  hero: 38,
  /** 48px — splash wordmark */
  display: 48,
  /** 96px — giant watermark wordmark (splash) */
  watermark: 96,
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export const lineHeight = {
  tight: 1.05,
  snug: 1.15,
  normal: 1.35,
  relaxed: 1.5,
  loose: 1.75,
} as const;

export const letterSpacing = {
  tightest: '-0.03em',
  tight: '-0.02em',
  normal: '0',
  wide: '0.04em',
  wider: '0.14em',
  widest: '0.18em',
  extreme: '0.28em',
} as const;

// ── Preset composites ───────────────────────────────────────────────
export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  // Compound presets for one-line styling
  presets: {
    eyebrow: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.extreme,
      textTransform: 'uppercase' as const,
    },
    sectionTitle: {
      fontFamily: fontFamily.display,
      fontSize: fontSize.h2,
      fontWeight: fontWeight.extrabold,
      lineHeight: lineHeight.tight,
      letterSpacing: letterSpacing.tight,
    },
    cardTitle: {
      fontFamily: fontFamily.display,
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.extrabold,
      letterSpacing: letterSpacing.tight,
    },
    body: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.md,
      fontWeight: fontWeight.regular,
      lineHeight: lineHeight.normal,
    },
    cta: {
      fontFamily: fontFamily.display,
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.wider,
      textTransform: 'uppercase' as const,
    },
    navLabel: {
      fontFamily: fontFamily.body,
      fontSize: fontSize.micro,
      fontWeight: fontWeight.bold,
      letterSpacing: letterSpacing.wide,
      textTransform: 'uppercase' as const,
    },
  },
} as const;

export type FontSizeToken = keyof typeof fontSize;
export type FontWeightToken = keyof typeof fontWeight;
export default typography;
