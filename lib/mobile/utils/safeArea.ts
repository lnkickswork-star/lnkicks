/**
 * safeArea.ts — Safe Area Inset Helpers for LN KICKS Mobile.
 *
 * iOS devices with notches / Dynamic Island / Home Indicator and Android
 * devices with gesture navigation need content to clear system UI.
 *
 * This module exposes:
 *   - CSS strings using `env(safe-area-inset-*)` for inline styles
 *   - A React hook `useSafeArea()` that reads actual insets at runtime
 *     (useful when JS needs to know the inset value, e.g. for sticky
 *     bottom nav padding)
 *
 * The viewport MUST be set to `viewport-fit=cover` for env() to return
 * non-zero values. See app/layout.tsx `viewport` export.
 *
 * Usage:
 *   import { safeArea } from '@/lib/mobile/utils/safeArea';
 *   padding: safeArea.paddingTop();   // 'env(safe-area-inset-top)px'
 *   paddingBottom: safeArea.insetBottom,
 *
 * Note: env() values can't be combined with px in a single CSS shorthand.
 *       Use calc(): calc(16px + env(safe-area-inset-bottom))
 */

import { useState, useEffect } from 'react';

/** CSS env() strings — use inside calc() or as standalone length */
export const safeAreaEnv = {
  top: 'env(safe-area-inset-top)',
  right: 'env(safe-area-inset-right)',
  bottom: 'env(safe-area-inset-bottom)',
  left: 'env(safe-area-inset-left)',
} as const;

/** Convenience calc() strings for common safe-area paddings */
export const safeArea = {
  /** Top padding — for splash / status bar */
  paddingTop: `calc(env(safe-area-inset-top))`,
  /** Bottom padding — for content above bottom nav */
  paddingBottom: `calc(env(safe-area-inset-bottom))`,
  /** Left padding — for landscape mode notch */
  paddingLeft: `calc(env(safe-area-inset-left))`,
  /** Right padding — for landscape mode notch */
  paddingRight: `calc(env(safe-area-inset-right))`,

  /** Combined top + bottom */
  block: `calc(env(safe-area-inset-top) + env(safe-area-inset-bottom))`,
  /** Combined left + right */
  inline: `calc(env(safe-area-inset-left) + env(safe-area-inset-right))`,

  /** Combined all 4 sides */
  all: `calc(env(safe-area-inset-top) + env(safe-area-inset-bottom)) calc(env(safe-area-inset-left) + env(safe-area-inset-right))`,

  /**
   * Bottom nav clearance: bottom nav is 64px tall + 16px float gap,
   * so main content needs at least 100px + safe-area-bottom to clear.
   */
  bottomNavClearance: `calc(100px + env(safe-area-inset-bottom))`,

  /** Bottom nav floating offset — 16px above safe-area-inset-bottom */
  bottomNavOffset: `calc(16px + env(safe-area-inset-bottom))`,
} as const;

/**
 * useSafeArea — React hook returning runtime safe-area insets in pixels.
 *
 * Falls back to 0 on devices that don't support env() or when viewport-fit
 * is not 'cover'. Updates on orientation change.
 *
 * @returns { top, right, bottom, left } in px
 */
export function useSafeArea() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const readInsets = () => {
      const el = document.createElement('div');
      el.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        padding-top: env(safe-area-inset-top);
        padding-right: env(safe-area-inset-right);
        padding-bottom: env(safe-area-inset-bottom);
        padding-left: env(safe-area-inset-left);
        visibility: hidden;
        pointer-events: none;
      `;
      document.body.appendChild(el);
      const cs = getComputedStyle(el);
      const parse = (v: string) => {
        const m = v.match(/^([\d.]+)px$/);
        return m ? parseFloat(m[1]) : 0;
      };
      setInsets({
        top: parse(cs.paddingTop),
        right: parse(cs.paddingRight),
        bottom: parse(cs.paddingBottom),
        left: parse(cs.paddingLeft),
      });
      document.body.removeChild(el);
    };

    readInsets();
    window.addEventListener('resize', readInsets);
    window.addEventListener('orientationchange', readInsets);
    return () => {
      window.removeEventListener('resize', readInsets);
      window.removeEventListener('orientationchange', readInsets);
    };
  }, []);

  return insets;
}

export default safeArea;
