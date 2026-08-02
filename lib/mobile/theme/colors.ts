/**
 * colors.ts — LN KICKS Mobile Design System / Color Tokens
 *
 * Pure white + matte black + soft greys. NO blue. NO colorful gradients.
 * Luxury minimal — Apple / Nike / GOAT / END Clothing inspired.
 *
 * Usage: import { colors } from '@/lib/mobile/theme/colors';
 */

export const colors = {
  // ── Core surfaces ────────────────────────────────────────────────
  white: '#ffffff',
  /** Off-white editorial surface — Apple Store / END Clothing style */
  offWhite: '#FAFAFA',
  black: '#0A0A0A',

  // ── Greys (soft, luxury) ─────────────────────────────────────────
  grey50: '#fafafa',
  grey100: '#f5f5f5',
  grey150: '#f0f0f0',
  grey200: '#ececec',
  grey300: '#e0e0e0',
  grey400: '#bdbdbd',
  grey500: '#9ca3af',
  grey600: '#6b7280',
  grey700: '#4b5563',
  grey800: '#1f2937',

  // ── Text ─────────────────────────────────────────────────────────
  textPrimary: '#0A0A0A',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textInverse: '#ffffff',

  // ── Accents (semantic) ───────────────────────────────────────────
  // Sale price — matte black (no red, kept luxury)
  sale: '#0A0A0A',
  // Price accent — deep black
  price: '#0A0A0A',
  // Error / destructive — kept muted, not flashy
  error: '#7f1d1d',
  // Success — kept muted
  success: '#14532d',
  // Warning — kept muted
  warning: '#78350f',

  // ── Borders & dividers ───────────────────────────────────────────
  border: '#ececec',
  borderStrong: '#e0e0e0',
  divider: '#f3f3f3',

  // ── Glass / overlay ──────────────────────────────────────────────
  glass: 'rgba(255,255,255,0.92)',
  glassDark: 'rgba(10,10,10,0.72)',
  scrim: 'rgba(10,10,10,0.40)',

  // ── Alpha overlays (for pressed / hover states) ──────────────────
  pressLight: 'rgba(0,0,0,0.04)',
  pressStrong: 'rgba(0,0,0,0.08)',
  focusRing: 'rgba(10,10,10,0.18)',
} as const;

export type ColorToken = keyof typeof colors;
export default colors;
