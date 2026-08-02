/**
 * shadows.ts — LN KICKS Mobile Design System / Elevation Tokens
 *
 * Luxury soft shadows — never harsh, never neon-tinted. Pure black at
 * varying opacities. Calibrated to match Apple Human Interface Guidelines.
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
  /** Subtle resting elevation — product cards */
  xs: '0 1px 2px rgba(0,0,0,0.04)',
  /** Small interactive cards */
  sm: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  /** Floating chips, badges */
  md: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
  /** Bottom nav, floating CTAs */
  lg: '0 12px 32px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04)',
  /** Hero cards, splash CTAs */
  xl: '0 20px 40px rgba(0,0,0,0.18)',
  /** Modals, drawers — maximum elevation */
  xxl: '0 32px 64px rgba(0,0,0,0.24), 0 8px 16px rgba(0,0,0,0.08)',
  /**
   * Premium resting elevation — extra-soft, wide-spread, Apple-quality.
   * Use on featured product cards and editorial surfaces where the shadow
   * should feel like the card is gently lifting off the page.
   */
  premium: '0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
  /**
   * Premium elevated — for hovered/featured states. Same character as
   * `premium` but with more depth.
   */
  premiumLg: '0 4px 8px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.10)',
} as const;

// ── Drop shadows (for product PNGs, floating imagery) ────────────────
export const dropShadows = {
  /** Light drop shadow — small product thumbnails */
  xs: 'drop-shadow(0 4px 8px rgba(0,0,0,0.08))',
  /** Medium drop shadow — featured product images */
  md: 'drop-shadow(0 12px 20px rgba(0,0,0,0.14))',
  /** Strong drop shadow — hero / splash floating products */
  lg: 'drop-shadow(0 20px 30px rgba(0,0,0,0.18))',
  /** Maximum drop shadow — dramatic feature imagery */
  xl: 'drop-shadow(0 32px 48px rgba(0,0,0,0.22))',
} as const;

export type ShadowToken = keyof typeof shadows;
export type DropShadowToken = keyof typeof dropShadows;
export default shadows;
