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
  /** 14px — content gutter horizontal */
  gutter: 14,
  /** 16px */
  lg: 16,
  /** 18px — section horizontal padding */
  pad: 18,
  /** 20px */
  xl: 20,
  /** 24px */
  xxl: 24,
  /** 28px */
  xxxl: 28,
  /** 32px */
  huge: 32,
  /** 36px — section vertical padding */
  section: 36,
  /** 48px */
  giant: 48,
  /** 56px */
  vast: 56,
  /** 64px */
  mega: 64,
} as const;

export type SpacingToken = keyof typeof spacing;

/**
 * Page horizontal padding — applied to all sections that span full width.
 * Calibrated to give content room without crowding iPhone SE (320px) viewports.
 */
export const pageGutter = 18;

export default spacing;
