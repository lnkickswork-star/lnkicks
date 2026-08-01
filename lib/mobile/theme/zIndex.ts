/**
 * zIndex.ts — LN KICKS Mobile Design System / Stacking Order
 *
 * Single source of truth for z-index layering on mobile.
 * Lower numbers = closer to the user's eye. Higher numbers = on top.
 *
 * Reference: Material Design elevation + Apple HIG layering
 *
 * Usage: import { zIndex } from '@/lib/mobile/theme/zIndex';
 */

export const zIndex = {
  /** Base — normal document flow */
  base: 0,
  /** Decorative backgrounds (watermark wordmarks, blurs) */
  bg: 1,
  /** Sticky content (header backdrop, sticky filters) */
  sticky: 100,
  /** Luxury bar (top announcement) */
  bar: 101,
  /** Floating action buttons */
  fab: 500,
  /** Bottom navigation */
  nav: 1000,
  /** Sticky headers */
  header: 100,
  /** Drawer / sheet content */
  drawer: 1100,
  /** Modal dialogs */
  modal: 1200,
  /** Toasts / snackbars */
  toast: 1300,
  /** Tooltips */
  tooltip: 1400,
  /** Splash screen (above everything) */
  splash: 9999,
} as const;

export type ZIndexToken = keyof typeof zIndex;
export default zIndex;
