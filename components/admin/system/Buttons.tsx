/**
 * LNKICKS Enterprise Admin — Button System Extensions
 * ------------------------------------------------------------
 * ADDITIVE only. The original `Button`, `IconButton`, `ButtonGroup`
 * in `ui.tsx` remain the canonical button primitives and are NOT
 * modified. This file adds the missing enterprise variants:
 *
 *   - Link        (link-styled button, no chrome)
 *   - SplitButton (primary action + dropdown caret)
 *   - LoadingButton (alias of Button with loading=true, semantic)
 *   - ButtonToolbar (joined group with dividers)
 *
 * All variants share the same `tokens` injection, sizing, and
 * interaction behaviour as the original Button — they're composed
 * from it rather than reimplemented.
 */

'use client';

import { useState, useRef, useEffect, type ReactNode, type CSSProperties } from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';
import { dt } from '@/lib/admin/designTokens';
import { Button } from '@/components/admin/ui';
import { Icon } from '@/components/admin/icons/Icon';

type Tk = AdminThemeTokens;

/* =========================================================== */
/* Link — link-styled button                                   */
/* =========================================================== */
/**
 * Inline link affordance — no chrome, primary-color text,
 * underline on hover only. Use for tertiary actions inside
 * panels (e.g. "View all →", "Learn more").
 */
export function Link({
  tokens, children, onClick, icon, iconRight, disabled, size = 'md',
  style, ...rest
}: {
  tokens: Tk; children: ReactNode; onClick?: () => void;
  icon?: ReactNode; iconRight?: ReactNode; disabled?: boolean;
  size?: 'sm' | 'md' | 'lg'; style?: CSSProperties;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 14 : 13;
  const iconSize = size === 'sm' ? 12 : 14;
  return (
    <button
      {...rest}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: 'transparent', border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: 0, fontFamily: 'Inter, system-ui, sans-serif',
        fontSize, fontWeight: 600,
        color: disabled ? tokens.text.tertiary : tokens.text.primary,
        opacity: disabled ? 0.55 : 1,
        textDecoration: 'none',
        transition: `color ${dt.motion.duration.quick}ms ${dt.motion.easing.standard}`,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.textDecoration = 'underline';
        e.currentTarget.style.textUnderlineOffset = '3px';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecoration = 'none';
      }}
    >
      {icon && <span style={{ display: 'inline-flex', color: 'currentColor' }}>{icon}</span>}
      {children}
      {iconRight ?? <Icon name="arrowRight" size={iconSize} color="currentColor" />}
    </button>
  );
}

/* =========================================================== */
/* LoadingButton — semantic alias                              */
/* =========================================================== */
/**
 * Drop-in replacement for Button that defaults to a spinner+label
 * combo when `loading` is true. Identical API to Button.
 */
export function LoadingButton({
  tokens, children, loading, label = 'Loading…', ...rest
}: {
  tokens: Tk; children: ReactNode; loading: boolean;
  label?: string;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button tokens={tokens} loading={loading} {...rest}>
      {loading ? label : children}
    </Button>
  );
}

/* =========================================================== */
/* SplitButton — primary action + dropdown caret               */
/* =========================================================== */
/**
 * Composite of a primary action button + a small caret button
 * that opens a dropdown menu. The two are visually joined.
 *
 * Use for the "primary action with alternatives" pattern (e.g.
 * "Save" / "Save & New" / "Save & Duplicate").
 */
export function SplitButton({
  tokens, label, icon, onClick, items, variant = 'primary', size = 'md',
  disabled, loading, style,
}: {
  tokens: Tk; label: string; icon?: ReactNode; onClick?: () => void;
  items: { label: string; icon?: ReactNode; onClick?: () => void; danger?: boolean }[];
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg'; disabled?: boolean; loading?: boolean;
  style?: CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const sizing = size === 'sm' ? { height: 30, padding: '0 10px', fontSize: 12 }
    : size === 'lg' ? { height: 44, padding: '0 18px', fontSize: 14 }
    : { height: 36, padding: '0 14px', fontSize: 13 };

  const variantBg: Record<string, { bg: string; fg: string; border: string }> = {
    primary: { bg: tokens.text.primary, fg: tokens.bg.app, border: tokens.text.primary },
    secondary: { bg: tokens.bg.surfaceAlt, fg: tokens.text.primary, border: tokens.border.subtle },
    success: { bg: tokens.status.success, fg: '#fff', border: tokens.status.success },
    warning: { bg: tokens.status.warning, fg: '#fff', border: tokens.status.warning },
    danger: { bg: tokens.status.error, fg: '#fff', border: tokens.status.error },
  };
  const v = variantBg[variant];
  const isDisabled = disabled || loading;

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', ...style }}>
      <button
        onClick={onClick}
        disabled={isDisabled}
        style={{
          ...sizing, padding: '0 14px',
          background: v.bg, color: v.fg,
          border: `1px solid ${v.border}`,
          borderRight: 'none',
          borderRadius: `${dt.radius.md} 0 0 ${dt.radius.md}`,
          fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.55 : 1,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          whiteSpace: 'nowrap',
          transition: `background ${dt.motion.duration.quick}ms ${dt.motion.easing.standard}`,
        }}
      >
        {loading ? <Spinner tokens={tokens} size={14} /> : icon}
        {label}
      </button>
      <button
        type="button"
        aria-label="Show more actions"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={isDisabled}
        onClick={() => setOpen(o => !o)}
        style={{
          ...sizing, width: 28, padding: 0,
          background: v.bg, color: v.fg,
          border: `1px solid ${v.border}`,
          borderRadius: `0 ${dt.radius.md} ${dt.radius.md} 0`,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.55 : (open ? 0.85 : 1),
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: `opacity ${dt.motion.duration.quick}ms ${dt.motion.easing.standard}`,
        }}
      >
        <Icon name={open ? 'chevronUp' : 'chevronDown'} size={12} color={v.fg} />
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', right: 0,
            minWidth: 180, background: tokens.bg.surface,
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: dt.radius.md, boxShadow: tokens.shadow.lg,
            padding: 4, zIndex: dt.zIndex.dropdown,
            animation: `${dt.keyframes.popIn} 140ms ${dt.motion.easing.standard}`,
          }}
        >
          {items.map((item, i) => (
            <button
              key={i}
              role="menuitem"
              onClick={() => { item.onClick?.(); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 10px',
                borderRadius: dt.radius.sm, border: 'none',
                background: 'transparent', cursor: 'pointer',
                color: item.danger ? tokens.status.error : tokens.text.secondary,
                fontSize: 12, fontWeight: 500,
                fontFamily: 'Inter, system-ui, sans-serif',
                textAlign: 'left',
                transition: `background ${dt.motion.duration.quick}ms ${dt.motion.easing.standard}`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {item.icon && <span style={{ display: 'inline-flex' }}>{item.icon}</span>}
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================== */
/* ButtonToolbar — joined group with dividers                  */
/* =========================================================== */
/**
 * Horizontally joined button row with optional divider between
 * groups. Use for inline toolbars (e.g. text editor, table
 * toolbar).
 */
export function ButtonToolbar({
  tokens, children, style,
}: {
  tokens: Tk; children: ReactNode; style?: CSSProperties;
}) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: tokens.bg.surface,
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: dt.radius.md,
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

/** ToolbarDivider — vertical separator inside a ButtonToolbar. */
export function ToolbarDivider({ tokens }: { tokens: Tk }) {
  return <div style={{ width: 1, alignSelf: 'stretch', background: tokens.border.subtle, margin: '4px 0' }} />;
}

/* =========================================================== */
/* FAB — floating action button                                */
/* =========================================================== */
/**
 * Material-style FAB. Used for primary create actions on mobile
 * and tablet. Hidden on desktop by default (use `showOnDesktop`
 * to force-show).
 */
export function FAB({
  tokens, icon, label, onClick, position = 'bottom-right',
  showOnDesktop = false, style,
}: {
  tokens: Tk; icon: ReactNode; label?: string; onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  showOnDesktop?: boolean; style?: CSSProperties;
}) {
  const pos: CSSProperties = position === 'bottom-right'
    ? { right: 20, bottom: 20 }
    : position === 'bottom-left'
    ? { left: 20, bottom: 20 }
    : { left: '50%', bottom: 20, transform: 'translateX(-50%)' };
  return (
    <>
      <button
        onClick={onClick}
        aria-label={label}
        className="lnk-fab"
        style={{
          position: 'fixed', zIndex: dt.zIndex.sticky,
          ...pos,
          height: 48, minWidth: 48,
          padding: label ? '0 20px 0 16px' : 0,
          borderRadius: 24,
          background: tokens.text.primary, color: tokens.bg.app,
          border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700,
          boxShadow: tokens.shadow.lg,
          transition: `transform ${dt.motion.duration.base}ms ${dt.motion.easing.standard}, box-shadow ${dt.motion.duration.base}ms ${dt.motion.easing.standard}`,
          ...style,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = (pos.transform ?? '') + ' scale(1.04)'; e.currentTarget.style.boxShadow = dt.elevation.xl; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = (pos.transform ?? ''); e.currentTarget.style.boxShadow = tokens.shadow.lg; }}
      >
        {icon}
        {label}
      </button>
      {!showOnDesktop && (
        <style jsx global>{`
          @media (min-width: 1024px) {
            .lnk-fab { display: none !important; }
          }
        `}</style>
      )}
    </>
  );
}

// Re-export Spinner so SplitButton / LoadingButton compose cleanly
function Spinner({ tokens: _t, size = 14 }: { tokens: Tk; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: `${dt.keyframes.spin} 0.7s linear infinite` }}>
      <path d="M21 12a9 9 0 11-6.2-8.5" />
    </svg>
  );
}
