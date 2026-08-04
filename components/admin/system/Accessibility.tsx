/**
 * LNKICKS Enterprise Admin — Accessibility Primitives
 * ------------------------------------------------------------
 * Reusable A11y primitives for WCAG AA+ compliance across the
 * entire admin suite. Use these everywhere to ensure:
 *
 *   - Keyboard-only users can navigate every UI
 *   - Screen reader users get proper semantics
 *   - Focus is always visible and managed correctly
 *   - Skip-to-content is available on every page
 *
 * Components:
 *   - VisuallyHidden  (hide content visually, keep for screen readers)
 *   - SkipLink        (skip to main content link)
 *   - FocusRing       (visible focus indicator wrapper)
 *   - LiveRegion      (aria-live announcement region)
 *   - useAnnounce     (hook to push messages to the live region)
 *   - KeyboardHint    (Kbd-style keyboard shortcut display)
 *   - usePrefersReducedMotion  (respect user motion preference)
 */

'use client';

import {
  useEffect, useState, useRef, useCallback,
  createContext, useContext, type ReactNode, type CSSProperties,
} from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';
import { dt } from '@/lib/admin/designTokens';
import { Kbd } from '@/components/admin/ui';

type Tk = AdminThemeTokens;

/* =========================================================== */
/* VisuallyHidden                                              */
/* =========================================================== */
/**
 * Hide content visually but keep it available to screen readers.
 * Use for: icon-only buttons (always provide aria-label too),
 * form legend text, table captions, status announcements.
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span style={{
      position: 'absolute',
      width: 1, height: 1,
      padding: 0, margin: -1,
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: 0,
    }}>
      {children}
    </span>
  );
}

/* =========================================================== */
/* SkipLink                                                    */
/* =========================================================== */
/**
 * Skip-to-content link. Becomes visible on focus. Should be the
 * first focusable element on every page (render in AdminLayout).
 *
 * Usage:
 *   <SkipLink target="main-content" />
 *   <main id="main-content">…</main>
 */
export function SkipLink({
  tokens, target, label = 'Skip to main content',
}: {
  tokens: Tk; target: string; label?: string;
}) {
  return (
    <a
      href={`#${target}`}
      style={{
        position: 'absolute', left: -9999, top: 0,
        zIndex: dt.zIndex.toast,
        padding: '8px 16px',
        background: tokens.text.primary, color: tokens.bg.app,
        borderRadius: '0 0 8px 0',
        fontSize: 13, fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        textDecoration: 'none',
        transition: `left ${dt.motion.duration.quick}ms ease`,
      }}
      onFocus={(e) => { e.currentTarget.style.left = '0px'; }}
      onBlur={(e) => { e.currentTarget.style.left = '-9999px'; }}
    >
      {label}
    </a>
  );
}

/* =========================================================== */
/* LiveRegion + useAnnounce                                    */
/* =========================================================== */
/**
 * Screen-reader-only live region. Push messages via `useAnnounce`
 * to inform screen reader users of dynamic updates.
 *
 *   const announce = useAnnounce();
 *   announce('Saved 3 products', 'polite');
 *   announce('Connection lost', 'assertive');
 */
interface LiveRegionState {
  polite: string;
  assertive: string;
}
const LiveRegionCtx = createContext<{
  announce: (msg: string, level?: 'polite' | 'assertive') => void;
}>({ announce: () => {} });

export function LiveRegionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LiveRegionState>({ polite: '', assertive: '' });
  const announce = useCallback((msg: string, level: 'polite' | 'assertive' = 'polite') => {
    setState(prev => ({ ...prev, [level]: msg }));
    // Clear after 1.5s so subsequent identical messages still announce
    setTimeout(() => setState(prev => ({ ...prev, [level]: '' })), 1500);
  }, []);
  return (
    <LiveRegionCtx.Provider value={{ announce }}>
      {children}
      <div aria-live="polite" role="status" style={visuallyHiddenStyle}>
        {state.polite}
      </div>
      <div aria-live="assertive" role="alert" style={visuallyHiddenStyle}>
        {state.assertive}
      </div>
    </LiveRegionCtx.Provider>
  );
}

const visuallyHiddenStyle: CSSProperties = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0,
};

export function useAnnounce() {
  return useContext(LiveRegionCtx).announce;
}

/* =========================================================== */
/* KeyboardHint                                                */
/* =========================================================== */
/**
 * Display a keyboard shortcut hint (e.g. in menu items, tooltips,
 * command palette rows).
 *
 *   <KeyboardHint tokens={tokens} keys={['⌘', 'K']} />
 */
export function KeyboardHint({
  tokens, keys,
}: {
  tokens: Tk; keys: string[];
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {keys.map((k, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          {i > 0 && <span style={{ color: tokens.text.tertiary, fontSize: 10 }}>+</span>}
          <Kbd tokens={tokens}>{k}</Kbd>
        </span>
      ))}
    </span>
  );
}

/* =========================================================== */
/* usePrefersReducedMotion                                     */
/* =========================================================== */
/**
 * React hook that returns true when the user prefers reduced motion.
 * Use to disable non-essential animations.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/* =========================================================== */
/* useFocusReturn                                              */
/* =========================================================== */
/**
 * Returns focus to the previously-focused element when the
 * active state becomes false. Use for modals, drawers, popovers.
 *
 *   const triggerRef = useFocusReturn(open);
 *   <button ref={triggerRef} onClick={() => setOpen(true)}>Open</button>
 */
export function useFocusReturn<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (active) {
      prevFocus.current = document.activeElement as HTMLElement;
    } else if (prevFocus.current) {
      // Slight delay to let the closing animation finish
      const t = setTimeout(() => prevFocus.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [active]);
  return ref;
}

/* =========================================================== */
/* useRovingTabIndex                                           */
/* =========================================================== */
/**
 * Implements roving tabindex for arrow-key navigation in lists
 * (e.g. menus, tabs, listboxes). Returns props to spread on each
 * item: `{ tabIndex, onKeyDown }`.
 *
 *   const items = [...];
 *   const { getProps, activeIndex, setActiveIndex } = useRovingTabIndex(items.length);
 *   items.map((item, i) => <button {...getProps(i)}>{item.label}</button>);
 */
export function useRovingTabIndex(count: number, orientation: 'horizontal' | 'vertical' = 'vertical') {
  const [active, setActive] = useState(0);
  const getProps = useCallback((index: number) => ({
    tabIndex: index === active ? 0 : -1,
    onKeyDown: (e: React.KeyboardEvent) => {
      const next = orientation === 'vertical'
        ? (e.key === 'ArrowDown' ? active + 1 : e.key === 'ArrowUp' ? active - 1 : null)
        : (e.key === 'ArrowRight' ? active + 1 : e.key === 'ArrowLeft' ? active - 1 : null);
      if (next !== null) {
        e.preventDefault();
        const clamped = Math.max(0, Math.min(count - 1, next));
        setActive(clamped);
        // Focus the target element
        const target = e.currentTarget.parentElement?.children[clamped] as HTMLElement;
        target?.focus();
      }
      if (e.key === 'Home') { e.preventDefault(); setActive(0); (e.currentTarget.parentElement?.children[0] as HTMLElement)?.focus(); }
      if (e.key === 'End') { e.preventDefault(); setActive(count - 1); (e.currentTarget.parentElement?.children[count - 1] as HTMLElement)?.focus(); }
    },
  }), [active, count, orientation]);

  return { getProps, activeIndex: active, setActiveIndex: setActive };
}

/* =========================================================== */
/* ColorContrast helpers                                       */
/* =========================================================== */
/**
 * WCAG color contrast utilities. Use to validate that foreground
 * colors meet AA (4.5:1) or AAA (7:1) contrast against their
 * background.
 */
export function relativeLuminance(hex: string): number {
  // Strip leading #
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsAA(fg: string, bg: string, large = false): boolean {
  return contrastRatio(fg, bg) >= (large ? 3 : 4.5);
}

export function meetsAAA(fg: string, bg: string, large = false): boolean {
  return contrastRatio(fg, bg) >= (large ? 4.5 : 7);
}
