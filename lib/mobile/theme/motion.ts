/**
 * motion.ts — LN KICKS Mobile Design System / Motion Tokens
 *
 * Apple-quality easing curves and durations. All transitions feel native —
 * spring-like without using actual spring physics (CSS-only).
 *
 * Reference: Apple Human Interface Guidelines — Motion
 *
 * Usage: import { motion } from '@/lib/mobile/theme/motion';
 *        transition: \`background-color ${motion.duration.fast} ${motion.easing.out}\`
 */

export const easing = {
  /** Apple's standard ease-out — for entrances */
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** Apple's standard ease-in — for exits */
  in: 'cubic-bezier(0.7, 0, 0.84, 0)',
  /** Symmetric ease — for state changes */
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  /** Spring-like — for bouncy micro-interactions */
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  /** Linear — for progress / loading */
  linear: 'linear',
  /** Plain ease-out — per Phase 6 spec (250ms ease-out) */
  easeOut: 'ease-out',
} as const;

export const duration = {
  /** 120ms — instant feedback (press states) */
  instant: '120ms',
  /** 180ms — quick transitions (hover, focus) */
  fast: '180ms',
  /** 240ms — standard UI transitions */
  normal: '240ms',
  /** 250ms — Phase 6 spec standard transition (alias of normal) */
  standard: '250ms',
  /** 320ms — section transitions, drawer */
  slow: '320ms',
  /** 420ms — page transitions, splash */
  page: '420ms',
  /** 600ms — long entrance animations */
  long: '600ms',
} as const;

/**
 * Scale transforms per Phase 6 spec:
 *   Card Hover  — scale(1.02)
 *   Button Press — scale(0.97)
 */
export const scale = {
  /** Card hover — subtle lift (Phase 6 spec) */
  cardHover: 1.02,
  /** Button press — subtle depress (Phase 6 spec) */
  buttonPress: 0.97,
  /** Generic press — alias of buttonPress */
  press: 0.97,
  /** No transform */
  none: 1,
} as const;

// ── Preset transition strings (one-liners) ──────────────────────────
const easeOut = easing.out;

export const transitions = {
  /** For background/color changes on press */
  press: `background-color ${duration.instant} ${easeOut}`,
  /** For background/color changes on hover */
  color: `background-color ${duration.fast} ${easeOut}, color ${duration.fast} ${easeOut}`,
  /** For transform changes (scale on press) */
  transform: `transform ${duration.instant} ${easeOut}`,
  /** For opacity fade */
  fade: `opacity ${duration.normal} ${easeOut}`,
  /** For border color changes (header on scroll) */
  border: `border-color ${duration.normal} ${easeOut}`,
  /** For multi-property transitions */
  surface: `background-color ${duration.normal} ${easeOut}, border-color ${duration.normal} ${easeOut}, box-shadow ${duration.normal} ${easeOut}`,
  /** Drawer slide-in */
  drawer: `transform ${duration.slow} ${easeOut}, opacity ${duration.slow} ${easeOut}`,
  /** Splash fade-out */
  splash: `opacity 380ms cubic-bezier(0.16, 1, 0.3, 1)`,
} as const;

export const motion = {
  easing,
  duration,
  transitions,
  scale,
} as const;

export type EasingToken = keyof typeof easing;
export type DurationToken = keyof typeof duration;
export type ScaleToken = keyof typeof scale;
export default motion;
