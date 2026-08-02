/**
 * radius.ts — LN KICKS Mobile Design System / Border Radius Tokens
 *
 * Calibrated to match Apple / Nike / GOAT iOS apps — generous radii,
 * never sharp 90° corners on cards. Pills are fully rounded.
 *
 * Usage: import { radius } from '@/lib/mobile/theme/radius';
 */

export const radius = {
  /** 0px — sharp (used for full-bleed images) */
  none: 0,
  /** 6px — small chips, tags */
  sm: 6,
  /** 10px — small cards */
  md: 10,
  /** 14px — medium cards */
  lg: 14,
  /** 18px — featured cards */
  xl: 18,
  /** 22px — large hero cards */
  xxl: 22,
  /** 24px — premium product cards (Apple/GOAT style) */
  card: 24,
  /** 28px — hero banners, big editorial cards */
  hero: 28,
  /** 999px — fully rounded (pills, circles, bottom nav) */
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;
export default radius;
