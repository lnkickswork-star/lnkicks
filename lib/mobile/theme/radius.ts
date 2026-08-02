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
  /** 14px — Buttons (Phase 6 spec) */
  button: 14,
  /** 14px — legacy `lg` token (alias of button) */
  lg: 14,
  /** 16px — Cards (Phase 6 spec) */
  card: 16,
  /** 16px — legacy `xl` token (alias of card) */
  xl: 16,
  /** 20px — Large Cards (Phase 6 spec) */
  largeCard: 20,
  /** 20px — legacy `xxl` token (alias of largeCard) */
  xxl: 20,
  /** 24px — legacy premium product cards (alias of largeCard) */
  hero: 20,
  /** 999px — fully rounded (pills, circles, bottom nav) */
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;
export default radius;
