/**
 * shadows.ts — LN KICKS Mobile Design System / Elevation Tokens
 *
 * PHASE 7 EDITORIAL PREMIUM REFRESH
 *   Softer, wider-spread shadows. Pure black at varying opacities.
 *   Apple Human Interface Guidelines quality — never harsh, never neon.
 *   Shadows are preferred over borders wherever possible.
 *
 * Usage: import { shadows } from '@/lib/mobile/theme/shadows';
 *
 * NOTE: shadow strings can be applied to CSS `boxShadow` and `filter`
 *       (drop-shadow) properties — for filter, use `shadows.drop.*`.
 */

export const shadows = {
  // ── Box shadows (cards, surfaces) ────────────────────────────────
  /** Hairline border — used for cards that should appear flat */
  hairline: '0 0 0 1px rgba(0,0,0,0.04)',
  /** Subtle resting elevation — minimal cards */
  xs: '0 1px 2px rgba(0,0,0,0.04)',
  /** Small interactive cards — soft, two-layer */
  sm: '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
  /** Floating chips, badges — wider spread */
  md: '0 4px 16px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
  /** Bottom nav, floating CTAs — premium depth */
  lg: '0 12px 36px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)',
  /** Hero cards, splash CTAs — dramatic elevation */
  xl: '0 24px 48px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.05)',
  /** Modals, drawers — maximum elevation */
  xxl: '0 32px 64px rgba(0,0,0,0.24), 0 8px 16px rgba(0,0,0,0.08)',

  // ── Premium tiers (Phase 7 — extra-soft, Apple-quality) ──────────
  /**
   * Premium resting — extra-soft, wide-spread, Apple-quality.
   * Use on product cards. Replaces the previous `premium` token with
   * a softer, more diffused character.
   */
  premium: '0 2px 6px rgba(0,0,0,0.04), 0 8px 28px rgba(0,0,0,0.06)',
  /**
   * Premium elevated — for hovered/featured states. Same character as
   * `premium` but with more depth and lift.
   */
  premiumLg: '0 6px 14px rgba(0,0,0,0.06), 0 18px 44px rgba(0,0,0,0.10)',
  /**
   * Editorial resting — for hero / promo cards. Slightly deeper than
   * `premium` to give large surfaces a sense of weight without heaviness.
   */
  editorial: '0 4px 10px rgba(0,0,0,0.05), 0 14px 36px rgba(0,0,0,0.08)',
  /**
   * Editorial elevated — hover / featured state for hero cards.
   */
  editorialLg: '0 8px 18px rgba(0,0,0,0.08), 0 24px 56px rgba(0,0,0,0.12)',
  /**
   * Floating action button — deep, narrow shadow that reads as
   * "this button is lifted off the surface".
   */
  fab: '0 8px 20px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.10)',
  /**
   * Search bar — soft, diffuse, premium. Reads as a floating surface
   * without being heavy.
   */
  search: '0 2px 8px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.05)',
} as const;

// ── Drop shadows (for product PNGs, floating imagery) ────────────────
export const dropShadows = {
  /** Light drop shadow — small product thumbnails */
  xs: 'drop-shadow(0 4px 8px rgba(0,0,0,0.08))',
  /** Medium drop shadow — featured product images */
  md: 'drop-shadow(0 12px 24px rgba(0,0,0,0.16))',
  /** Strong drop shadow — hero / splash floating products */
  lg: 'drop-shadow(0 24px 36px rgba(0,0,0,0.20))',
  /** Maximum drop shadow — dramatic feature imagery */
  xl: 'drop-shadow(0 32px 48px rgba(0,0,0,0.24))',
} as const;

export type ShadowToken = keyof typeof shadows;
export type DropShadowToken = keyof typeof dropShadows;
export default shadows;
