/**
 * spacing.ts — LN KICKS Mobile Design System / Spacing Scale
 *
 * 4px base unit. Linear progression. Calibrated for 360–440px viewports.
 *
 * PHASE 7 EDITORIAL PREMIUM REFRESH
 *   Section spacing  → 48–64px (more breathing room, magazine-like)
 *   Card padding     → 20–24px (luxury internal space)
 *   Card gap         → 16–20px (consistent grid rhythm)
 *   Button height    → 48px (unchanged — Apple HIG)
 *
 * Usage: import { spacing } from '@/lib/mobile/theme/spacing';
 */

export const spacing = {
  // ── Atomic units ────────────────────────────────────────────────
  /** 0px */
  none: 0,
  /** 2px — hairline gap */
  hairline: 2,
  /** 4px — atomic unit */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 14px — legacy content gutter horizontal (kept for backwards compat) */
  gutter: 14,

  // ── Card system (Phase 7: 16–20px gaps, 20–24px padding) ─────────
  /** 16px — minimum card gap */
  cardGap: 16,
  /** 16px — legacy `lg` token (alias of cardGap) */
  lg: 16,
  /** 18px — legacy section horizontal padding (kept for backwards compat) */
  pad: 18,
  /** 20px — preferred card gap (Phase 7) */
  cardGapLg: 20,
  /** 20px */
  xl: 20,
  /** 22px — preferred card padding (Phase 7) */
  cardPadding: 22,
  /** 24px — minimum section padding */
  sectionPadding: 24,
  /** 24px — legacy `xxl` token (alias of sectionPadding) */
  xxl: 24,
  /** 28px */
  xxxl: 28,

  // ── Section system (Phase 7: 48–64px section spacing) ────────────
  /** 32px — small section gap */
  sectionGap: 32,
  /** 32px — legacy `huge` token (alias of sectionGap) */
  huge: 32,
  /** 36px — legacy section vertical padding (alias, prefer sectionPadding) */
  section: 36,
  /** 48px — preferred section top/bottom spacing (Phase 7) */
  sectionSpacing: 48,
  /** 48px — Button Height (Apple HIG, unchanged) */
  buttonHeight: 48,
  /** 48px — legacy `giant` token (alias of buttonHeight) */
  giant: 48,
  /** 56px */
  vast: 56,
  /** 56px — preferred section gap between major blocks (Phase 7) */
  sectionGapLg: 56,
  /** 64px — maximum section spacing / Header Height */
  headerHeight: 64,
  /** 64px — legacy `mega` token (alias of headerHeight) */
  mega: 64,
  /** 64px — maximum section spacing (Phase 7) */
  sectionSpacingLg: 64,
  /** 80px — Bottom Navigation Height */
  bottomNavHeight: 80,
} as const;

export type SpacingToken = keyof typeof spacing;

/**
 * Page horizontal padding — applied to all sections that span full width.
 * 20px on phones ≥360px gives the editorial breathing room without
 * crowding iPhone SE (320px).
 */
export const pageGutter = 20;

export default spacing;
