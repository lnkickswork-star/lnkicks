/**
 * LNKICKS Enterprise Admin — Design Token System
 * ------------------------------------------------------------
 * The single source of truth for every visual decision in the
 * admin suite. Inspired by Apple HIG, Material 3, Stripe,
 * Linear, Vercel, Shopify Polaris, Notion.
 *
 * Design philosophy:
 *  - 8-point grid for spacing (4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80)
 *  - Modular typography scale (1.125 ratio — Major Second)
 *  - 4-step radius scale (sm / md / lg / xl) + pill + circle
 *  - 4-step elevation scale (xs / sm / md / lg) — soft, never harsh
 *  - 3 motion easings + 4 durations — calm, never bouncy
 *  - Color palette tokens (primary / neutral / success / warning / danger / info)
 *
 * Every value is unitless where possible (consumed as `px` by callers).
 * This file is theme-agnostic; color *values* live in adminTheme.ts.
 * Here we only define the *scale* and the *non-color* tokens.
 *
 * Usage:
 *   import { dt } from '@/lib/admin/designTokens';
 *   const gap = dt.spacing.md;        // 16
 *   const radius = dt.radius.lg;      // 14
 *   const shadow = dt.elevation.sm;   // '0 1px 2px ...'
 */

/* =========================================================== */
/* SPACING — 8-point grid                                       */
/* =========================================================== */
/**
 * Every padding, margin, gap, and inset in the admin suite
 * should be one of these values. Half-steps (2px) are allowed
 * only for hairline adjustments (e.g. icon optical centering).
 */
export const spacing = {
  0: 0,
  1: 4,      // hairline / tight
  2: 8,      // default inline gap
  3: 12,     // default stack gap
  4: 16,     // default card padding
  5: 20,     // comfortable card padding
  6: 24,     // section padding
  8: 32,     // large section padding
  10: 40,    // hero spacing
  12: 48,    // page-level vertical rhythm
  16: 64,    // large empty-state padding
  20: 80,    // max page-level vertical rhythm
  24: 96,    // never exceeded in normal layouts
} as const;

export type SpacingScale = typeof spacing;

/* =========================================================== */
/* TYPOGRAPHY — Modular scale (1.125 ratio)                    */
/* =========================================================== */
/**
 * One scale for the entire admin. Sizes are in px.
 * Line heights are tuned per use-case (display looser, body tighter).
 * Font weights follow the Inter variable scale.
 */
export const typography = {
  // Display — page hero numbers, big KPI values
  display: {
    fontSize: 32,
    lineHeight: 1.15,
    fontWeight: 700,
    letterSpacing: '-0.025em',
  },
  // Page title — top of every admin page
  pageTitle: {
    fontSize: 22,
    lineHeight: 1.25,
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  // Section heading — major section within a page
  h1: {
    fontSize: 18,
    lineHeight: 1.3,
    fontWeight: 700,
    letterSpacing: '-0.015em',
  },
  // Card title / panel header
  h2: {
    fontSize: 15,
    lineHeight: 1.35,
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  // Sub-section / row title
  h3: {
    fontSize: 13,
    lineHeight: 1.4,
    fontWeight: 700,
    letterSpacing: '-0.005em',
  },
  // Body large — primary readable text in panels
  bodyLg: {
    fontSize: 14,
    lineHeight: 1.55,
    fontWeight: 400,
    letterSpacing: '0',
  },
  // Body — default readable text
  body: {
    fontSize: 13,
    lineHeight: 1.55,
    fontWeight: 400,
    letterSpacing: '0',
  },
  // Body small — table cells, list items
  bodySm: {
    fontSize: 12,
    lineHeight: 1.5,
    fontWeight: 400,
    letterSpacing: '0',
  },
  // Label — form labels, button text, menu items
  label: {
    fontSize: 12,
    lineHeight: 1.4,
    fontWeight: 600,
    letterSpacing: '0.01em',
  },
  // Caption — metadata, timestamps, helper text
  caption: {
    fontSize: 11,
    lineHeight: 1.45,
    fontWeight: 500,
    letterSpacing: '0.01em',
  },
  // Overline — uppercase section labels, table headers
  overline: {
    fontSize: 10,
    lineHeight: 1.4,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },
  // Micro — tiny badges, version numbers
  micro: {
    fontSize: 10,
    lineHeight: 1.3,
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  // Mono — codes, IDs, SKUs
  mono: {
    fontSize: 12,
    lineHeight: 1.5,
    fontWeight: 500,
    letterSpacing: '0',
    fontFamily: 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
  },
} as const;

export type TypographyScale = typeof typography;
export type TypographyKey = keyof typeof typography;

/* =========================================================== */
/* RADIUS — 4-step scale + pill + circle                       */
/* =========================================================== */
/**
 * Soft, premium corners. Never below 4px (looks cheap) and
 * never above 24px in normal layouts (looks toy-like).
 *
 *  sm  = 6   — small chips, tags, badges
 *  md  = 8   — buttons, inputs, menu items
 *  lg  = 12  — cards, panels, dropdowns
 *  xl  = 16  — modals, large surfaces
 *  2xl = 20  — hero cards, feature panels
 *  pill = 999 — pills, avatars circle
 */
export const radius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  pill: 999,
  circle: 999, // alias — used when shape is conceptually a circle
} as const;

export type RadiusScale = typeof radius;

/* =========================================================== */
/* BORDER WIDTH                                                 */
/* =========================================================== */
export const borderWidth = {
  hairline: 0.5,   // divider when 1px is too heavy
  thin: 1,         // default
  thick: 1.5,      // focused inputs
  heavy: 2,        // selected/emphasis
} as const;

/* =========================================================== */
/* ELEVATION / SHADOWS — soft, layered                          */
/* =========================================================== */
/**
 * Four steps only. Each shadow is composed of:
 *   - a tight ambient (close to surface)
 *   - a soft key (further spread)
 *
 * Dark-mode shadows are deeper because backgrounds absorb more.
 * Color values are RGBA of a neutral slate.
 */
export const elevation = {
  // Resting — cards at default state
  xs: '0 1px 2px rgba(15, 23, 42, 0.04)',
  // Default — cards, popovers
  sm: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)',
  // Hover — cards on hover, sticky headers
  md: '0 4px 8px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
  // Floating — modals, dropdowns, drawyers
  lg: '0 12px 24px -6px rgba(15, 23, 42, 0.10), 0 4px 8px -4px rgba(15, 23, 42, 0.06)',
  // Hero — command palette, biggest dialogs
  xl: '0 24px 48px -12px rgba(15, 23, 42, 0.18), 0 8px 16px -8px rgba(15, 23, 42, 0.10)',
} as const;

export const elevationDark = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.30)',
  sm: '0 1px 2px rgba(0, 0, 0, 0.30), 0 1px 3px rgba(0, 0, 0, 0.40)',
  md: '0 4px 8px -2px rgba(0, 0, 0, 0.40), 0 2px 4px -2px rgba(0, 0, 0, 0.30)',
  lg: '0 12px 24px -6px rgba(0, 0, 0, 0.55), 0 4px 8px -4px rgba(0, 0, 0, 0.35)',
  xl: '0 24px 48px -12px rgba(0, 0, 0, 0.70), 0 8px 16px -8px rgba(0, 0, 0, 0.45)',
} as const;

export type ElevationKey = keyof typeof elevation;

/* =========================================================== */
/* MOTION — durations + easings                                 */
/* =========================================================== */
/**
 * Three easings only. Use `expressive` sparingly (entrance
 * animations, big state transitions). `quick` for hover,
 * `smooth` for everything else.
 */
export const motion = {
  duration: {
    instant: 0,       // no animation
    quick: 100,       // hover, focus, color shift
    fast: 140,        // small UI toggle
    base: 180,        // default state change
    slow: 240,        // entrance, drawer slide
    slower: 320,      // large entrance, page transition
    slowest: 480,     // hero animations only
  },
  easing: {
    // Default — Material 3 standard easing (calm, decisive)
    standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
    // Hover / micro — sharper, snappier
    quick: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Entrance — expressive, slight overshoot feel
    expressive: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    // Exit — gentle, never bouncy
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

/* =========================================================== */
/* Z-INDEX — single scale, never use magic numbers             */
/* =========================================================== */
/**
 * Layers:
 *   - base (0): page content
 *   - raised (1): sticky table headers, hover popovers inline
 *   - sticky (10): sidebar, topbar
 *   - dropdown (200): menus, dropdowns, tooltips
 *   - drawer (500): side drawers
 *   - modal (1000): modals, dialogs
 *   - toast (2000): toast notifications
 *   - command (3000): command palette (highest)
 */
export const zIndex = {
  base: 0,
  raised: 1,
  sticky: 10,
  dropdown: 200,
  drawer: 500,
  modal: 1000,
  toast: 2000,
  command: 3000,
} as const;

export type ZIndexScale = typeof zIndex;

/* =========================================================== */
/* LAYOUT — breakpoints, container, sidebar                     */
/* =========================================================== */
export const layout = {
  // Breakpoints — match Tailwind defaults for familiarity
  breakpoints: {
    sm: 640,    // mobile landscape
    md: 768,    // tablet portrait
    lg: 1024,   // tablet landscape / small laptop
    xl: 1280,   // desktop
    '2xl': 1536,  // large desktop
    '3xl': 1920,  // hero / 4K
  },
  // Max content width — never exceed 1600 in admin
  contentMaxWidth: 1600,
  // Sidebar widths
  sidebar: {
    expanded: 264,
    collapsed: 64,
    mobile: 280,    // mobile drawer is wider for thumb reach
  },
  // Topbar height
  topbarHeight: 56,
  // Page padding — clamp scales 16 → 32 based on viewport
  pagePadding: 'clamp(16px, 3vw, 32px)',
  // Card gap default
  cardGap: 16,
  // Section gap default
  sectionGap: 24,
} as const;

/* =========================================================== */
/* COLOR PALETTE — semantic names only                          */
/* =========================================================== */
/**
 * These are *roles*, not raw hex. The actual hex values are
 * resolved per-theme in adminTheme.ts. Components should only
 * ever reference roles, never raw colors.
 *
 * The palette below is the canonical light-mode reference.
 * Dark-mode equivalents are derived in adminTheme.ts.
 */
export const colorPalette = {
  // Brand primary — premium ink (near-black with cool undertone)
  primary: {
    50: '#F4F5F7',
    100: '#E5E7EB',
    200: '#CBD5E1',
    300: '#94A3B8',
    400: '#64748B',
    500: '#475569',
    600: '#334155',
    700: '#1F2937',
    800: '#111827',
    900: '#0A0A0A',
    950: '#020617',
  },
  // Accent — used sparingly for highlights, links, focus
  accent: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  // Success — calm green, never neon
  success: {
    50: '#ECFDF5',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  // Warning — amber, never red
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  // Danger / error — confident red, never pink
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  // Info — calm blue
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  // Purple — used for marketing/promo/featured only
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87',
  },
} as const;

/* =========================================================== */
/* COMPONENT SIZING — standardized dimensions                   */
/* =========================================================== */
/**
 * These are the canonical sizes for common interactive elements.
 * Every component should pull from here, never hardcode.
 */
export const componentSize = {
  // Button heights
  button: {
    sm: 28,
    md: 36,
    lg: 44,
  },
  // Input heights (matches button for inline alignment)
  input: {
    sm: 30,
    md: 38,
    lg: 44,
  },
  // IconButton dimensions (square)
  iconButton: {
    xs: 24,
    sm: 28,
    md: 32,
    lg: 40,
  },
  // Avatar diameters
  avatar: {
    xs: 20,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 56,
    '2xl': 72,
  },
  // Icon sizes (square)
  icon: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
  },
  // Badge heights
  badge: {
    sm: 18,
    md: 22,
  },
} as const;

/* =========================================================== */
/* FOCUS RING — consistent visible focus                        */
/* =========================================================== */
/**
 * Every focusable element should use this ring. It is composed
 * of a 2px solid ring + 3px halo at low opacity.
 *
 * `color` should be the theme's `text.primary` (light mode) or
 * `text.primary` (dark mode) — pass it in via the helper.
 */
export function focusRing(color: string): string {
  return `0 0 0 2px var(--lnk-surface, #fff), 0 0 0 4px ${color}`;
}

/* =========================================================== */
/* AGGREGATE TOKEN EXPORT                                       */
/* =========================================================== */
export const dt = {
  spacing,
  typography,
  radius,
  borderWidth,
  elevation,
  elevationDark,
  motion,
  zIndex,
  layout,
  colorPalette,
  componentSize,
  focusRing,
} as const;

export type DesignTokens = typeof dt;
