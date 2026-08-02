/**
 * spacing.ts — LN KICKS Mobile Design System / Spacing Scale
 *
 * 4px base unit. Linear progression. Calibrated for 360–440px viewports.
 *
 * Usage: import { spacing } from '@/lib/mobile/theme/spacing';
 */

export const spacing = {
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
  /** 14px — content gutter horizontal (legacy) */
  gutter: 14,
  /** 16px — Card Gap / Grid Gap / Internal Card Padding (Phase 6 spec) */
  cardGap: 16,
  /** 16px — legacy `lg` token (alias of cardGap) */
  lg: 16,
  /** 18px — legacy section horizontal padding (kept for backwards compat) */
  pad: 18,
  /** 20px */
  xl: 20,
  /** 24px — Section Padding (Phase 6 spec) */
  sectionPadding: 24,
  /** 24px — legacy `xxl` token (alias of sectionPadding) */
  xxl: 24,
  /** 28px */
  xxxl: 28,
  /** 32px — Section Gap (Phase 6 spec) */
  sectionGap: 32,
  /** 32px — legacy `huge` token (alias of sectionGap) */
  huge: 32,
  /** 36px — legacy section vertical padding (alias, prefer sectionPadding) */
  section: 36,
  /** 48px — Button Height (Phase 6 spec) */
  buttonHeight: 48,
  /** 48px — legacy `giant` token (alias of buttonHeight) */
  giant: 48,
  /** 56px */
  vast: 56,
  /** 64px — Header Height (Phase 6 spec) */
  headerHeight: 64,
  /** 64px — legacy `mega` token (alias of headerHeight) */
  mega: 64,
  /** 80px — Bottom Navigation Height (Phase 6 spec) */
  bottomNavHeight: 80,
} as const;

export type SpacingToken = keyof typeof spacing;

/**
 * Page horizontal padding — applied to all sections that span full width.
 * Calibrated to give content room without crowding iPhone SE (320px) viewports.
 */
export const pageGutter = 18;

export default spacing;
