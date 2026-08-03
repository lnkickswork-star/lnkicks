/**
 * LNKICKS Enterprise Admin — Global Admin Stylesheet
 * ============================================================
 * SINGLE SOURCE OF TRUTH for every cross-cutting CSS rule in the
 * admin suite. Mounted EXACTLY ONCE inside AdminLayout.
 *
 * This component consolidates:
 *   1. All shared @keyframes (admin-fade-in, admin-pop-in, admin-slide-*)
 *      Previously these were duplicated across 15+ files (ui.tsx,
 *      AdminSidebar, AdminTopbar, every page that used a fade-in).
 *      Now every admin animation references names defined here.
 *   2. Global :focus-visible policy — visible 2px ring on every
 *      interactive element when keyboard-focused. NEVER removed.
 *   3. Global scrollbar styling — thin, themed, consistent.
 *   4. Global ::selection styling — themed, never default browser blue.
 *   5. prefers-reduced-motion — disable non-essential animations.
 *   6. Print styles — clean B/W output for invoices, audit logs, etc.
 *   7. Base admin typography smoothing.
 *
 * Why a single component (not a CSS file)?
 *   - styled-jsx is the project's CSS system (no Tailwind, no CSS modules)
 *   - Next.js App Router prefers co-located styles
 *   - One mount = one set of @keyframes (no duplication, no flash)
 *   - Theme tokens are interpolated at runtime, so dark/light adapt
 *
 * Tokens are passed in via props (NOT imported directly) so the
 * component re-renders when the user toggles theme. Without this,
 * the scrollbar/selection colors would stay stale on theme switch.
 */

'use client';

import type { AdminThemeTokens } from '@/lib/admin/types';

interface Props {
  tokens: AdminThemeTokens;
}

export function GlobalAdminStyles({ tokens }: Props) {
  // Theme-aware CSS variable values — referenced by selectors that
  // can't directly interpolate tokens (e.g. ::-webkit-scrollbar
  // pseudo-elements, ::selection, body).
  const css = `
    /* ============================================================ */
    /* KEYFRAMES — every admin animation name lives here            */
    /* ============================================================ */
    @keyframes admin-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes admin-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes admin-pop-in {
      from { opacity: 0; transform: scale(0.96) translateY(-4px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes admin-pop-out {
      from { opacity: 1; transform: scale(1) translateY(0); }
      to { opacity: 0; transform: scale(0.96) translateY(-4px); }
    }
    @keyframes admin-slide-right {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes admin-slide-left {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    @keyframes admin-slide-up {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    @keyframes admin-slide-down {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes admin-toast-in {
      from { opacity: 0; transform: translateY(-12px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes admin-tooltip-in {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes admin-success-pop {
      0% { transform: scale(0); opacity: 0; }
      60% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1); }
    }
    @keyframes admin-bulk-in {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes admin-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes admin-skel {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes admin-shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes admin-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.55; }
    }
    @keyframes admin-ripple {
      to { transform: scale(2.5); opacity: 0; }
    }
    @keyframes admin-shake {
      10%, 90% { transform: translateX(-1px); }
      20%, 80% { transform: translateX(2px); }
      30%, 50%, 70% { transform: translateX(-3px); }
      40%, 60% { transform: translateX(3px); }
    }
    @keyframes admin-bar-grow {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
    @keyframes admin-ring-fill {
      from { stroke-dashoffset: var(--ring-circumference, 283); }
      to { stroke-dashoffset: var(--ring-target, 0); }
    }
    @keyframes admin-indeterminate {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(400%); }
    }

    /* ============================================================ */
    /* FOCUS-VISIBLE — global keyboard focus policy                 */
    /* ============================================================ */
    /* Every interactive element gets a 2px solid ring with a 2px
       white halo when focused via keyboard. Mouse clicks do NOT
       show the ring (focus-visible). */
    [data-admin-theme] button:focus-visible,
    [data-admin-theme] a:focus-visible,
    [data-admin-theme] input:focus-visible,
    [data-admin-theme] select:focus-visible,
    [data-admin-theme] textarea:focus-visible,
    [data-admin-theme] [role="button"]:focus-visible,
    [data-admin-theme] [role="tab"]:focus-visible,
    [data-admin-theme] [role="menuitem"]:focus-visible,
    [data-admin-theme] [tabindex]:focus-visible {
      outline: 2px solid ${tokens.border.focus};
      outline-offset: 2px;
      border-radius: inherit;
      box-shadow: 0 0 0 4px ${tokens.border.focus}22;
      transition: box-shadow 100ms ease, outline-color 100ms ease;
    }
    /* Remove default outline ONLY when focus-visible is supported
       (we provide our own). Buttons styled with their own boxShadow
       should not be overridden. */
    [data-admin-theme] button:focus:not(:focus-visible),
    [data-admin-theme] a:focus:not(:focus-visible),
    [data-admin-theme] input:focus:not(:focus-visible),
    [data-admin-theme] select:focus:not(:focus-visible),
    [data-admin-theme] textarea:focus:not(:focus-visible) {
      outline: none;
    }

    /* ============================================================ */
    /* SCROLLBAR — thin, themed, consistent                          */
    /* ============================================================ */
    [data-admin-theme] {
      scrollbar-width: thin;
      scrollbar-color: ${tokens.border.strong} transparent;
    }
    [data-admin-theme] ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    [data-admin-theme] ::-webkit-scrollbar-track {
      background: transparent;
    }
    [data-admin-theme] ::-webkit-scrollbar-thumb {
      background: ${tokens.border.subtle};
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }
    [data-admin-theme] ::-webkit-scrollbar-thumb:hover {
      background: ${tokens.border.strong};
      background-clip: padding-box;
      border: 2px solid transparent;
    }
    [data-admin-theme] ::-webkit-scrollbar-corner {
      background: transparent;
    }

    /* ============================================================ */
    /* SELECTION — themed text selection                            */
    /* ============================================================ */
    [data-admin-theme] ::selection {
      background: ${tokens.text.primary}1A;
      color: ${tokens.text.primary};
    }
    [data-admin-theme] ::-moz-selection {
      background: ${tokens.text.primary}1A;
      color: ${tokens.text.primary};
    }

    /* ============================================================ */
    /* BASE TYPOGRAPHY — admin-wide font smoothing                  */
    /* ============================================================ */
    [data-admin-theme] body,
    [data-admin-theme] input,
    [data-admin-theme] button,
    [data-admin-theme] select,
    [data-admin-theme] textarea {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    /* ============================================================ */
    /* REDUCED MOTION — respect user preference                     */
    /* ============================================================ */
    @media (prefers-reduced-motion: reduce) {
      [data-admin-theme] *,
      [data-admin-theme] *::before,
      [data-admin-theme] *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
    }

    /* ============================================================ */
    /* PRINT — clean B/W output for reports, audit logs             */
    /* ============================================================ */
    @media print {
      [data-admin-theme] .admin-sidebar,
      [data-admin-theme] .admin-topbar,
      [data-admin-theme] .admin-mobile-trigger,
      [data-admin-theme] .admin-palette-trigger {
        display: none !important;
      }
      [data-admin-theme] main {
        padding: 0 !important;
        max-width: none !important;
      }
      [data-admin-theme] {
        background: #fff !important;
        color: #000 !important;
      }
    }

    /* ============================================================ */
    /* HIGH CONTRAST — Windows/Eye-Ache mode                        */
    /* ============================================================ */
    @media (prefers-contrast: more) {
      [data-admin-theme] button,
      [data-admin-theme] input,
      [data-admin-theme] select,
      [data-admin-theme] textarea,
      [data-admin-theme] a {
        border-color: ${tokens.text.primary} !important;
      }
    }

    /* ============================================================ */
    /* ADMIN ROOT — base background + color                         */
    /* ============================================================ */
    [data-admin-theme] {
      color-scheme: ${tokens.mode === 'dark' ? 'dark' : 'light'};
    }
  `;

  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
