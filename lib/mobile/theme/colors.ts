/**
 * colors.ts — LN KICKS Mobile Design System / Color Tokens
 *
 * APPLE × SAMSUNG × GOOGLE × NIKE PREMIUM PALETTE (Phase 6)
 *
 * Pure white + matte black + soft greys. NO blue. NO colorful gradients.
 * Luxury minimal — Apple / Nike / GOAT / END Clothing inspired.
 *
 * Per the Phase 6 typography system spec:
 *   Background     #FFFFFF
 *   Primary Text   #111111  (was #0A0A0A in Phase 4 — slightly softer)
 *   Secondary Text #6B7280
 *   Border         #E5E7EB  (was #ECECEC — slightly cooler, more neutral)
 *   Cards          #FAFAFA
 *   Primary Button #111111  (matte black)
 *   Button Text    #FFFFFF
 *
 * Usage: import { colors } from '@/lib/mobile/theme/colors';
 */

export const colors = {
  // ── Core surfaces ────────────────────────────────────────────────
  white: '#FFFFFF',
  /** Off-white card surface — Apple Store / END Clothing style */
  offWhite: '#FAFAFA',
  /** Matte black — used for primary buttons, dark hero variants */
  black: '#0A0A0A',
  /** Primary button color — slightly softer than pure black (#111111) */
  primaryButton: '#111111',
  /** Button text color — pure white */
  buttonText: '#FFFFFF',

  // ── Greys (soft, luxury) ─────────────────────────────────────────
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey150: '#F0F0F0',
  grey200: '#ECECEC',
  grey300: '#E5E7EB', // NEW spec border color (was #E0E0E0)
  grey400: '#BDBDBD',
  grey500: '#9CA3AF',
  grey600: '#6B7280', // secondary text
  grey700: '#4B5563',
  grey800: '#1F2937',

  // ── Text ─────────────────────────────────────────────────────────
  /** Primary text — #111111 (per Phase 6 spec) */
  textPrimary: '#111111',
  /** Secondary text — #6B7280 (per Phase 6 spec) */
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',

  // ── Accents (semantic) ───────────────────────────────────────────
  // Sale price — matte black (no red, kept luxury)
  sale: '#111111',
  // Price accent — primary text black
  price: '#111111',
  // Error / destructive — kept muted, not flashy
  error: '#7F1D1D',
  // Success — kept muted
  success: '#14532D',
  // Warning — kept muted
  warning: '#78350F',

  // ── Borders & dividers ───────────────────────────────────────────
  /** Border — #E5E7EB (per Phase 6 spec) */
  border: '#E5E7EB',
  borderStrong: '#E0E0E0',
  divider: '#F3F3F3',

  // ── Glass / overlay ──────────────────────────────────────────────
  glass: 'rgba(255,255,255,0.92)',
  glassDark: 'rgba(17,17,17,0.72)',
  scrim: 'rgba(17,17,17,0.40)',

  // ── Alpha overlays (for pressed / hover states) ──────────────────
  pressLight: 'rgba(0,0,0,0.04)',
  pressStrong: 'rgba(0,0,0,0.08)',
  focusRing: 'rgba(17,17,17,0.18)',
} as const;

export type ColorToken = keyof typeof colors;
export default colors;
