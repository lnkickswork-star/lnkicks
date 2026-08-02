/**
 * spacing.ts — LN KICKS Mobile Design System / Spacing Scale
 *
 * 4px base unit. Linear progression. Calibrated for 360–440px viewports.
 *
 * PHASE 8 MOBILE-STANDARD REFRESH
 *   Section spacing  → 20–32px (standard mobile app rhythm)
 *   Card padding     → 12–14px (compact, information-dense)
 *   Card gap         → 8–12px (tight grid)
 *   Button height    → 44px (Material Design minimum)
 *   Page gutter      → 16px (standard mobile page padding)
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

  // ── Card system (Phase 8: 8–12px gaps, 12–14px padding) ─────────
  /** 8px — minimum card gap */
  cardGap: 8,
  /** 12px — legacy `lg` token (alias) */
  lg: 12,
  /** 14px — legacy section horizontal padding (kept for backwards compat) */
  pad: 14,
  /** 12px — preferred card gap (Phase 8) */
  cardGapLg: 12,
  /** 16px — page gutter / horizontal page padding */
  xl: 16,
  /** 14px — preferred card padding (Phase 8) */
  cardPadding: 14,
  /** 16px — minimum section padding */
  sectionPadding: 16,
  /** 20px — legacy `xxl` token */
  xxl: 20,
  /** 24px */
  xxxl: 24,

  // ── Section system (Phase 8: 20–32px section spacing) ────────────
  /** 20px — small section gap */
  sectionGap: 20,
  /** 24px — legacy `huge` token */
  huge: 24,
  /** 24px — legacy section vertical padding */
  section: 24,
  /** 24px — preferred section top/bottom spacing (Phase 8) */
  sectionSpacing: 24,
  /** 44px — Button Height (Material minimum touch target) */
  buttonHeight: 44,
  /** 48px — legacy `giant` token */
  giant: 48,
  /** 32px */
  vast: 32,
  /** 28px — preferred section gap between major blocks (Phase 8) */
  sectionGapLg: 28,
  /** 56px — Header Height */
  headerHeight: 56,
  /** 64px — legacy `mega` token */
  mega: 64,
  /** 32px — maximum section spacing (Phase 8) */
  sectionSpacingLg: 32,
  /** 64px — Bottom Navigation Height */
  bottomNavHeight: 64,
} as const;

export type SpacingToken = keyof typeof spacing;

/**
 * Page horizontal padding — applied to all sections that span full width.
 * 16px on phones ≥360px — standard mobile app page padding.
 */
export const pageGutter = 16;

export default spacing;
