/**
 * theme.ts — LN KICKS Mobile Design System / Single Entry Point
 *
 * Re-exports all design tokens so any component can `import { theme }`
 * and access colors, spacing, radius, shadows, typography, motion, zIndex.
 *
 * Usage:
 *   import { theme } from '@/lib/mobile/theme/theme';
 *   background: theme.colors.white;
 *   padding: theme.spacing.pad;
 *   borderRadius: theme.radius.pill;
 *
 * Migration note: this file does NOT contain any business logic — it is
 * a pure token aggregator. Components pull individual tokens from their
 * respective files when tree-shaking matters; this file is for ergonomics.
 */

import { colors } from './colors';
import spacing, { pageGutter } from './spacing';
import radius from './radius';
import shadows, { dropShadows } from './shadows';
import typography, {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} from './typography';
import motion, { easing, duration, transitions } from './motion';
import zIndex from './zIndex';

export const theme = {
  colors,
  spacing,
  pageGutter,
  radius,
  shadows,
  dropShadows,
  typography,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  motion,
  easing,
  duration,
  transitions,
  zIndex,
} as const;

export type Theme = typeof theme;

// Re-export individual modules for granular imports
export { colors } from './colors';
export { default as spacing, pageGutter } from './spacing';
export { default as radius } from './radius';
export { default as shadows, dropShadows } from './shadows';
export {
  default as typography,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} from './typography';
export { default as motion, easing, duration, transitions } from './motion';
export { default as zIndex } from './zIndex';

export default theme;
