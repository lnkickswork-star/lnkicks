/**
 * radius.ts — LN KICKS Mobile Design System / Border Radius Tokens
 *
 * PHASE 7 EDITORIAL PREMIUM REFRESH
 *   Hero cards     → 28–32px (luxury magazine-cover feel)
 *   Product cards  → 24px (was 16 — softer, more premium)
 *   Buttons        → 14px (unchanged)
 *   Pills/chips    → 999px fully rounded
 *
 * Usage: import { radius } from '@/lib/mobile/theme/radius';
 */

export const radius = {
  // ── Sharp / hairline ────────────────────────────────────────────
  /** 0px — sharp (used for full-bleed images) */
  none: 0,
  /** 6px — small chips, tags */
  sm: 6,
  /** 10px — small cards */
  md: 10,

  // ── Buttons & pills ─────────────────────────────────────────────
  /** 14px — Buttons */
  button: 14,
  /** 14px — legacy `lg` token (alias of button) */
  lg: 14,
  /** 999px — fully rounded (pills, circles, bottom nav) */
  pill: 999,

  // ── Cards (Phase 7: 20–32px) ────────────────────────────────────
  /** 20px — small / secondary cards */
  card: 20,
  /** 20px — legacy `xl` token (alias of card) */
  xl: 20,
  /** 24px — preferred product card radius (Phase 7) */
  productCard: 24,
  /** 24px — legacy `xxl` token (alias of productCard) */
  xxl: 24,
  /** 24px — legacy `hero` token (alias of productCard) */
  hero: 24,
  /** 28px — preferred hero / editorial card radius (Phase 7) */
  largeCard: 28,
  /** 32px — maximum hero / promotional card radius (Phase 7) */
  heroCard: 32,
} as const;

export type RadiusToken = keyof typeof radius;
export default radius;
