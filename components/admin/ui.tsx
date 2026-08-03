/**
 * LNKICKS Enterprise Admin — UI Primitives Library
 * ------------------------------------------------------------
 * Single source of truth for all admin UI atoms & molecules.
 * Inspired by Linear / Vercel / Stripe / Notion.
 *
 * Every primitive accepts `tokens` from useAdminTheme() so it
 * automatically adapts to dark/light mode.
 *
 * Exports:
 *   - Button, IconButton, ButtonGroup
 *   - Badge, StatusPill, Tag
 *   - Input, Textarea, Select, Checkbox, Toggle, SearchInput
 *   - Card, Panel, PanelHeader, Divider
 *   - Tabs, TabBar
 *   - Modal, Drawer, ConfirmDialog
 *   - Dropdown, Menu, MenuItem
 *   - EmptyState, Skeleton, Spinner
 *   - Tooltip (CSS only)
 *   - Breadcrumb, Pagination
 *   - Toast / ToastProvider (context-based)
 *   - ProgressBar, Stat, KeyValue
 *   - Avatar, AvatarGroup
 */

'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';

type Tk = AdminThemeTokens;

/* =========================================================== */
/* Button                                                      */
/* =========================================================== */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  tokens: Tk;
}

export function Button({
  variant = 'primary', size = 'md', icon, iconRight, loading,
  fullWidth, tokens, children, style, disabled, ...rest
}: ButtonProps) {
  const sizing = size === 'sm' ? { height: 30, padding: '0 10px', fontSize: 12 }
    : size === 'lg' ? { height: 44, padding: '0 18px', fontSize: 14 }
    : { height: 36, padding: '0 14px', fontSize: 13 };

  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: tokens.text.primary, color: tokens.bg.app,
      border: `1px solid ${tokens.text.primary}`,
    },
    secondary: {
      background: tokens.bg.surfaceAlt, color: tokens.text.primary,
      border: `1px solid ${tokens.border.subtle}`,
    },
    ghost: {
      background: 'transparent', color: tokens.text.secondary,
      border: '1px solid transparent',
    },
    danger: {
      background: tokens.status.error, color: '#fff',
      border: `1px solid ${tokens.status.error}`,
    },
    success: {
      background: tokens.status.success, color: '#fff',
      border: `1px solid ${tokens.status.success}`,
    },
    outline: {
      background: 'transparent', color: tokens.text.primary,
      border: `1px solid ${tokens.border.strong}`,
    },
  };

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, borderRadius: 9, cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600,
        letterSpacing: 0.1, whiteSpace: 'nowrap',
        transition: 'all 140ms cubic-bezier(0.16,1,0.3,1)',
        opacity: (disabled || loading) ? 0.55 : 1,
        width: fullWidth ? '100%' : 'auto',
        ...sizing, ...variants[variant], ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        if (variant === 'primary') e.currentTarget.style.background = tokens.text.primary + 'E0';
        else if (variant === 'secondary') e.currentTarget.style.background = tokens.bg.hover;
        else if (variant === 'ghost') e.currentTarget.style.background = tokens.bg.hover;
        else if (variant === 'outline') e.currentTarget.style.background = tokens.bg.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        if (disabled || loading) return;
        e.currentTarget.style.background = variants[variant].background as string;
      }}
      onMouseDown={(e) => { if (!disabled && !loading) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {loading ? <Spinner tokens={tokens} size={14} /> : icon}
      {children}
      {iconRight}
    </button>
  );
}

export function IconButton({
  tokens, icon, label, size = 32, variant = 'ghost', onClick, style, ...rest
}: {
  tokens: Tk; icon: React.ReactNode; label: string; size?: number;
  variant?: 'ghost' | 'solid' | 'outline';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const bg = variant === 'solid' ? tokens.bg.surfaceAlt
    : variant === 'outline' ? 'transparent'
    : 'transparent';
  const border = variant === 'outline' ? `1px solid ${tokens.border.subtle}`
    : variant === 'solid' ? `1px solid ${tokens.border.subtle}`
    : '1px solid transparent';
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: 8,
        background: bg, border, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: tokens.text.secondary,
        transition: 'all 120ms ease', ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = bg; }}
    >
      {icon}
    </button>
  );
}

/* =========================================================== */
/* Badge / StatusPill / Tag                                    */
/* =========================================================== */

type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'critical' | 'purple';

export function Badge({
  tokens, tone = 'neutral', children, dot = false, size = 'md',
}: {
  tokens: Tk; tone?: BadgeTone; children: React.ReactNode; dot?: boolean; size?: 'sm' | 'md';
}) {
  const tones: Record<BadgeTone, { bg: string; fg: string }> = {
    neutral: { bg: tokens.bg.surfaceAlt, fg: tokens.text.secondary },
    info: { bg: tokens.status.infoBg, fg: tokens.status.info },
    success: { bg: tokens.status.successBg, fg: tokens.status.success },
    warning: { bg: tokens.status.warningBg, fg: tokens.status.warning },
    critical: { bg: tokens.status.errorBg, fg: tokens.status.error },
    purple: { bg: 'rgba(139,92,246,0.12)', fg: '#8B5CF6' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '1px 6px' : '3px 8px',
      borderRadius: 6,
      background: t.bg, color: t.fg,
      fontSize: size === 'sm' ? 10 : 11, fontWeight: 600,
      fontFamily: 'Inter, sans-serif',
      letterSpacing: 0.2, whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.fg }} />}
      {children}
    </span>
  );
}

export function StatusPill({ tokens, status }: { tokens: Tk; status: string }) {
  const s = status.toLowerCase();
  let tone: BadgeTone = 'neutral';
  if (['delivered', 'active', 'published', 'approved', 'paid', 'success', 'in stock'].some(x => s.includes(x))) tone = 'success';
  else if (['pending', 'processing', 'packed', 'shipped', 'review', 'draft', 'low'].some(x => s.includes(x))) tone = 'warning';
  else if (['cancelled', 'failed', 'refund', 'out of stock', 'rejected', 'disabled', 'blocked', 'expired'].some(x => s.includes(x))) tone = 'critical';
  else if (['confirmed', 'out for delivery', 'new', 'verified'].some(x => s.includes(x))) tone = 'info';
  return <Badge tokens={tokens} tone={tone} dot>{status}</Badge>;
}

/* =========================================================== */
/* Inputs                                                      */
/* =========================================================== */

const inputBase = (tokens: Tk): React.CSSProperties => ({
  width: '100%', height: 38, padding: '0 12px',
  borderRadius: 9, border: `1px solid ${tokens.border.subtle}`,
  background: tokens.bg.surface, color: tokens.text.primary,
  fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 120ms ease, box-shadow 120ms ease',
});

export function Input({
  tokens, label, hint, error, icon, suffix, style, ...rest
}: {
  tokens: Tk; label?: string; hint?: string; error?: string;
  icon?: React.ReactNode; suffix?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <Label tokens={tokens}>{label}</Label>}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            color: tokens.text.tertiary, pointerEvents: 'none', display: 'flex',
          }}>{icon}</div>
        )}
        <input
          {...rest}
          style={{
            ...inputBase(tokens),
            paddingLeft: icon ? 34 : 12,
            paddingRight: suffix ? 38 : 12,
            borderColor: error ? tokens.status.error : tokens.border.subtle,
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? tokens.status.error : tokens.border.focus;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${tokens.border.focus}15`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? tokens.status.error : tokens.border.subtle;
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        {suffix && (
          <div style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          }}>{suffix}</div>
        )}
      </div>
      {error && <FieldMsg tokens={tokens} tone="error">{error}</FieldMsg>}
      {hint && !error && <FieldMsg tokens={tokens}>{hint}</FieldMsg>}
    </div>
  );
}

export function Textarea({
  tokens, label, hint, error, style, ...rest
}: {
  tokens: Tk; label?: string; hint?: string; error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      {label && <Label tokens={tokens}>{label}</Label>}
      <textarea
        {...rest}
        style={{
          ...inputBase(tokens), height: 'auto', minHeight: 80, padding: '10px 12px',
          lineHeight: 1.5, resize: 'vertical',
          borderColor: error ? tokens.status.error : tokens.border.subtle,
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? tokens.status.error : tokens.border.focus;
          e.currentTarget.style.boxShadow = `0 0 0 3px ${tokens.border.focus}15`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? tokens.status.error : tokens.border.subtle;
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {error && <FieldMsg tokens={tokens} tone="error">{error}</FieldMsg>}
      {hint && !error && <FieldMsg tokens={tokens}>{hint}</FieldMsg>}
    </div>
  );
}

export function Select({
  tokens, label, hint, error, options, style, ...rest
}: {
  tokens: Tk; label?: string; hint?: string; error?: string;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && <Label tokens={tokens}>{label}</Label>}
      <div style={{ position: 'relative' }}>
        <select
          {...rest}
          style={{
            ...inputBase(tokens), appearance: 'none', paddingRight: 32, cursor: 'pointer',
            borderColor: error ? tokens.status.error : tokens.border.subtle,
            ...style,
          }}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary}
          strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {error && <FieldMsg tokens={tokens} tone="error">{error}</FieldMsg>}
      {hint && !error && <FieldMsg tokens={tokens}>{hint}</FieldMsg>}
    </div>
  );
}

export function Checkbox({
  tokens, label, checked, onChange, indeterminate, style,
}: {
  tokens: Tk; label?: React.ReactNode; checked: boolean;
  onChange?: (v: boolean) => void; indeterminate?: boolean; style?: React.CSSProperties;
}) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: 'pointer', userSelect: 'none', fontSize: 13,
      color: tokens.text.primary, fontFamily: 'Inter, sans-serif',
      ...style,
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: 4,
        border: `1.5px solid ${checked || indeterminate ? tokens.text.primary : tokens.border.strong}`,
        background: checked || indeterminate ? tokens.text.primary : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 120ms ease', flexShrink: 0,
      }} onClick={() => onChange?.(!checked)}>
        {(checked || indeterminate) && (
          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app}
            strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            {indeterminate ? <path d="M5 12h14" /> : <path d="M5 13l4 4L19 7" />}
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

export function Toggle({
  tokens, checked, onChange, label,
}: {
  tokens: Tk; checked: boolean; onChange?: (v: boolean) => void; label?: string;
}) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      cursor: 'pointer', userSelect: 'none',
    }}>
      <button
        type="button"
        onClick={() => onChange?.(!checked)}
        style={{
          width: 36, height: 20, borderRadius: 10,
          background: checked ? tokens.status.success : tokens.bg.surfaceAlt,
          border: `1px solid ${checked ? tokens.status.success : tokens.border.strong}`,
          cursor: 'pointer', position: 'relative',
          transition: 'all 180ms cubic-bezier(0.16,1,0.3,1)',
          padding: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 14, height: 14, borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          transition: 'left 180ms cubic-bezier(0.16,1,0.3,1)',
        }} />
      </button>
      {label && <span style={{ fontSize: 13, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>{label}</span>}
    </label>
  );
}

export function SearchInput({
  tokens, value, onChange, placeholder = 'Search…', style,
}: {
  tokens: Tk; value: string; onChange: (v: string) => void;
  placeholder?: string; style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary}
        strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <path d="M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5" />
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...inputBase(tokens), height: 34, paddingLeft: 32, paddingRight: 10,
          fontSize: 12, background: tokens.bg.surfaceAlt,
        }}
        onFocus={(e) => { e.currentTarget.style.background = tokens.bg.surface; e.currentTarget.style.borderColor = tokens.border.focus; }}
        onBlur={(e) => { e.currentTarget.style.background = tokens.bg.surfaceAlt; e.currentTarget.style.borderColor = tokens.border.subtle; }}
      />
    </div>
  );
}

function Label({ tokens, children }: { tokens: Tk; children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block', marginBottom: 5,
      fontSize: 11, fontWeight: 600, color: tokens.text.secondary,
      fontFamily: 'Inter, sans-serif', letterSpacing: 0.2,
    }}>{children}</label>
  );
}

function FieldMsg({ tokens, children, tone }: { tokens: Tk; children: React.ReactNode; tone?: 'error' }) {
  return (
    <div style={{
      marginTop: 4, fontSize: 11,
      color: tone === 'error' ? tokens.status.error : tokens.text.tertiary,
      fontFamily: 'Inter, sans-serif',
    }}>{children}</div>
  );
}

/* =========================================================== */
/* Card / Panel                                                */
/* =========================================================== */

export function Card({
  tokens, children, style, hover, onClick,
}: {
  tokens: Tk; children: React.ReactNode; style?: React.CSSProperties;
  hover?: boolean; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: tokens.bg.surface,
        border: `1px solid ${tokens.border.subtle}`,
        borderRadius: 14,
        boxShadow: tokens.shadow.sm,
        transition: hover ? 'transform 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms ease, border-color 180ms ease' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!hover) return;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = tokens.shadow.md;
        e.currentTarget.style.borderColor = tokens.border.strong;
      }}
      onMouseLeave={(e) => {
        if (!hover) return;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = tokens.shadow.sm;
        e.currentTarget.style.borderColor = tokens.border.subtle;
      }}
    >
      {children}
    </div>
  );
}

export function Panel({
  tokens, title, subtitle, children, action, icon, accent, padding = 'md',
  style,
}: {
  tokens: Tk; title?: string; subtitle?: string; children: React.ReactNode;
  action?: React.ReactNode; icon?: React.ReactNode;
  accent?: 'warning' | 'critical' | 'success' | 'info' | 'purple';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  style?: React.CSSProperties;
}) {
  const accentColor = accent === 'warning' ? tokens.status.warning
    : accent === 'critical' ? tokens.status.error
    : accent === 'success' ? tokens.status.success
    : accent === 'info' ? tokens.status.info
    : accent === 'purple' ? '#8B5CF6'
    : null;
  const pad = padding === 'sm' ? '8px 12px 12px'
    : padding === 'lg' ? '20px 24px 24px'
    : padding === 'none' ? 0
    : '14px 18px 18px';
  return (
    <section style={{
      background: tokens.bg.surface,
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: 14,
      boxShadow: tokens.shadow.sm,
      overflow: 'hidden',
      ...style,
    }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px', borderBottom: `1px solid ${tokens.border.subtle}`,
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            {accentColor && <span style={{ width: 3, height: 18, borderRadius: 2, background: accentColor, flexShrink: 0 }} />}
            {icon}
            <div style={{ minWidth: 0 }}>
              <h3 style={{
                margin: 0, fontSize: 13, fontWeight: 700, color: tokens.text.primary,
                fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{title}</h3>
              {subtitle && (
                <p style={{ margin: '2px 0 0 0', fontSize: 11, color: tokens.text.secondary, fontFamily: 'Inter, sans-serif' }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action}
        </div>
      )}
      <div style={{ padding: pad }}>{children}</div>
    </section>
  );
}

export function Divider({ tokens, vertical = false }: { tokens: Tk; vertical?: boolean }) {
  return <div style={{
    background: tokens.border.subtle,
    [vertical ? 'width' : 'height']: vertical ? 1 : 1,
    [vertical ? 'height' : 'width']: vertical ? '100%' : '100%',
  }} />;
}

/* =========================================================== */
/* Tabs                                                        */
/* =========================================================== */

export function Tabs({
  tokens, tabs, active, onChange, size = 'md',
}: {
  tokens: Tk; tabs: { key: string; label: string; badge?: string | number }[];
  active: string; onChange: (k: string) => void; size?: 'sm' | 'md';
}) {
  return (
    <div style={{
      display: 'inline-flex', gap: 2,
      background: tokens.bg.surfaceAlt, borderRadius: 9, padding: 3,
      border: `1px solid ${tokens.border.subtle}`,
    }}>
      {tabs.map(t => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            style={{
              padding: size === 'sm' ? '4px 10px' : '6px 14px',
              borderRadius: 7, border: 'none',
              background: isActive ? tokens.bg.surface : 'transparent',
              color: isActive ? tokens.text.primary : tokens.text.secondary,
              fontSize: size === 'sm' ? 11 : 12, fontWeight: 600,
              fontFamily: 'Inter, sans-serif', cursor: 'pointer',
              boxShadow: isActive ? tokens.shadow.sm : 'none',
              transition: 'all 140ms ease',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            {t.label}
            {t.badge !== undefined && (
              <span style={{
                fontSize: 10, fontWeight: 700, minWidth: 16, height: 16,
                padding: '0 4px', borderRadius: 8,
                background: isActive ? tokens.text.primary : tokens.bg.hover,
                color: isActive ? tokens.bg.app : tokens.text.secondary,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================== */
/* Modal / Drawer / Confirm                                    */
/* =========================================================== */

export function Modal({
  tokens, open, onClose, title, subtitle, children, footer, size = 'md',
}: {
  tokens: Tk; open: boolean; onClose: () => void;
  title?: string; subtitle?: string; children: React.ReactNode;
  footer?: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  const width = size === 'sm' ? 400 : size === 'lg' ? 640 : size === 'xl' ? 880 : 520;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: tokens.bg.overlay,
        backdropFilter: 'blur(4px)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, animation: 'admin-fade-in 160ms ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: tokens.bg.surface,
          border: `1px solid ${tokens.border.subtle}`,
          borderRadius: 14, boxShadow: tokens.shadow.lg,
          width: '100%', maxWidth: width, maxHeight: 'calc(100vh - 64px)',
          display: 'flex', flexDirection: 'column',
          animation: 'admin-pop-in 220ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {(title || subtitle) && (
          <div style={{
            padding: '16px 20px', borderBottom: `1px solid ${tokens.border.subtle}`,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ minWidth: 0 }}>
              {title && <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>{title}</h3>}
              {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: 12, color: tokens.text.secondary }}>{subtitle}</p>}
            </div>
            <IconButton tokens={tokens} icon={<CloseIcon />} label="Close" onClick={onClose} size={28} />
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {children}
        </div>
        {footer && (
          <div style={{
            padding: '12px 20px', borderTop: `1px solid ${tokens.border.subtle}`,
            display: 'flex', justifyContent: 'flex-end', gap: 8,
          }}>{footer}</div>
        )}
      </div>
      <style jsx global>{`
        @keyframes admin-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes admin-pop-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

export function Drawer({
  tokens, open, onClose, title, subtitle, children, footer, side = 'right', width = 440,
}: {
  tokens: Tk; open: boolean; onClose: () => void;
  title?: string; subtitle?: string; children: React.ReactNode;
  footer?: React.ReactNode; side?: 'right' | 'left'; width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: tokens.bg.overlay, backdropFilter: 'blur(2px)',
        zIndex: 1000,
        display: 'flex', justifyContent: side === 'right' ? 'flex-end' : 'flex-start',
        animation: 'admin-fade-in 160ms ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: tokens.bg.surface,
          borderLeft: side === 'right' ? `1px solid ${tokens.border.subtle}` : 'none',
          borderRight: side === 'left' ? `1px solid ${tokens.border.subtle}` : 'none',
          width: '100%', maxWidth: width, height: '100vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: tokens.shadow.lg,
          animation: `admin-slide-${side} 240ms cubic-bezier(0.16,1,0.3,1)`,
        }}
      >
        {(title || subtitle) && (
          <div style={{
            padding: '16px 20px', borderBottom: `1px solid ${tokens.border.subtle}`,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ minWidth: 0 }}>
              {title && <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>{title}</h3>}
              {subtitle && <p style={{ margin: '4px 0 0 0', fontSize: 12, color: tokens.text.secondary }}>{subtitle}</p>}
            </div>
            <IconButton tokens={tokens} icon={<CloseIcon />} label="Close" onClick={onClose} size={28} />
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {children}
        </div>
        {footer && (
          <div style={{
            padding: '12px 20px', borderTop: `1px solid ${tokens.border.subtle}`,
            display: 'flex', justifyContent: 'flex-end', gap: 8,
          }}>{footer}</div>
        )}
      </div>
      <style jsx global>{`
        @keyframes admin-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes admin-slide-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes admin-slide-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

export function ConfirmDialog({
  tokens, open, onClose, onConfirm, title, message, confirmLabel = 'Confirm',
  cancelLabel = 'Cancel', danger,
}: {
  tokens: Tk; open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; confirmLabel?: string; cancelLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal
      tokens={tokens} open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <Button tokens={tokens} variant="ghost" onClick={onClose}>{cancelLabel}</Button>
          <Button
            tokens={tokens}
            variant={danger ? 'danger' : 'primary'}
            onClick={() => { onConfirm(); onClose(); }}
          >{confirmLabel}</Button>
        </>
      }
    >
      <p style={{ margin: 0, fontSize: 13, color: tokens.text.secondary, lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>
        {message}
      </p>
    </Modal>
  );
}

/* =========================================================== */
/* Dropdown / Menu                                             */
/* =========================================================== */

export function Dropdown({
  tokens, trigger, children, align = 'right', width = 200,
}: {
  tokens: Tk; trigger: React.ReactNode; children: React.ReactNode;
  align?: 'left' | 'right'; width?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div onClick={() => setOpen(v => !v)}>{trigger}</div>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute', top: 'calc(100% + 6px)',
            [align === 'right' ? 'right' : 'left']: 0,
            width, background: tokens.bg.surface,
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: 10, boxShadow: tokens.shadow.lg,
            padding: 4, zIndex: 200,
            animation: 'admin-pop-in 160ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {children}
          <style jsx global>{`
            @keyframes admin-pop-in {
              from { opacity: 0; transform: scale(0.96) translateY(-4px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  tokens, icon, children, onClick, danger, active,
}: {
  tokens: Tk; icon?: React.ReactNode; children: React.ReactNode;
  onClick?: () => void; danger?: boolean; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', padding: '8px 10px',
        borderRadius: 7, border: 'none', cursor: 'pointer',
        background: active ? tokens.bg.hover : 'transparent',
        color: danger ? tokens.status.error : active ? tokens.text.primary : tokens.text.secondary,
        fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif',
        textAlign: 'left', transition: 'all 100ms ease',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = tokens.bg.hover; if (danger) e.currentTarget.style.color = tokens.status.error; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {icon}
      <span style={{ flex: 1 }}>{children}</span>
    </button>
  );
}

export function MenuDivider({ tokens }: { tokens: Tk }) {
  return <div style={{ height: 1, background: tokens.border.subtle, margin: '4px 0' }} />;
}

/* =========================================================== */
/* EmptyState / Skeleton / Spinner                             */
/* =========================================================== */

export function EmptyState({
  tokens, icon, title, description, action,
}: {
  tokens: Tk; icon?: React.ReactNode; title: string;
  description?: string; action?: React.ReactNode;
}) {
  return (
    <div style={{
      padding: '48px 24px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
    }}>
      {icon && (
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: tokens.bg.surfaceAlt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: tokens.text.tertiary, marginBottom: 4,
        }}>{icon}</div>
      )}
      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
        {title}
      </h4>
      {description && (
        <p style={{ margin: 0, fontSize: 12, color: tokens.text.secondary, maxWidth: 360, lineHeight: 1.5 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

export function Skeleton({ tokens, w = '100%', h = 16, r = 6 }: { tokens: Tk; w?: number | string; h?: number | string; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: `linear-gradient(90deg, ${tokens.bg.surfaceAlt} 0%, ${tokens.bg.hover} 50%, ${tokens.bg.surfaceAlt} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'admin-skel 1.4s ease-in-out infinite',
    }}>
      <style jsx global>{`
        @keyframes admin-skel {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export function Spinner({ tokens: _tokens, size = 16 }: { tokens: Tk; size?: number }) {
  return (
    <svg className="admin-spinner" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: 'admin-spin 0.7s linear infinite', color: 'currentColor' }}>
      <path d="M21 12a9 9 0 11-6.2-8.5" />
    </svg>
  );
}

export function PageLoading({ tokens }: { tokens: Tk }) {
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Skeleton tokens={tokens} h={28} w={200} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {[1, 2, 3, 4].map(i => <Skeleton key={i} tokens={tokens} h={120} r={14} />)}
      </div>
      <Skeleton tokens={tokens} h={300} r={14} />
    </div>
  );
}

/* =========================================================== */
/* Breadcrumb / Pagination                                     */
/* =========================================================== */

export function Breadcrumb({
  tokens, items,
}: {
  tokens: Tk; items: { label: string; href?: string }[];
}) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 12, fontFamily: 'Inter, sans-serif',
      color: tokens.text.tertiary,
    }} aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {item.href ? (
            <a href={item.href} style={{
              color: tokens.text.secondary, textDecoration: 'none',
              transition: 'color 120ms ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = tokens.text.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = tokens.text.secondary; }}>
              {item.label}
            </a>
          ) : (
            <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{item.label}</span>
          )}
          {i < items.length - 1 && (
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary}
              strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Pagination({
  tokens, page, totalPages, onPage, total,
}: {
  tokens: Tk; page: number; totalPages: number; onPage: (p: number) => void; total?: number;
}) {
  if (totalPages <= 1) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, flexWrap: 'wrap', padding: '12px 0 0',
    }}>
      {total !== undefined && (
        <div style={{ fontSize: 11, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>
          Showing page {page} of {totalPages} {total ? `· ${total} total` : ''}
        </div>
      )}
      <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
        <IconButton
          tokens={tokens}
          icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>}
          label="Previous"
          size={28}
          onClick={() => onPage(Math.max(1, page - 1))}
        />
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onPage(p)}
              style={{
                minWidth: 28, height: 28, padding: '0 8px', borderRadius: 7, border: 'none',
                background: p === page ? tokens.text.primary : 'transparent',
                color: p === page ? tokens.bg.app : tokens.text.secondary,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>{p}</button>
          );
        })}
        <IconButton
          tokens={tokens}
          icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>}
          label="Next"
          size={28}
          onClick={() => onPage(Math.min(totalPages, page + 1))}
        />
      </div>
    </div>
  );
}

/* =========================================================== */
/* Toast / ToastProvider                                       */
/* =========================================================== */

type ToastTone = 'success' | 'error' | 'info' | 'warning';
interface Toast { id: string; tone: ToastTone; title: string; message?: string; }

const ToastCtx = createContext<{ push: (t: Omit<Toast, 'id'>) => void }>({ push: () => {} });

export function ToastProvider({ tokens, children }: { tokens: Tk; children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 2000,
        display: 'flex', flexDirection: 'column', gap: 8,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const tone = t.tone;
          const color = tone === 'success' ? tokens.status.success
            : tone === 'error' ? tokens.status.error
            : tone === 'warning' ? tokens.status.warning
            : tokens.status.info;
          const bg = tone === 'success' ? tokens.status.successBg
            : tone === 'error' ? tokens.status.errorBg
            : tone === 'warning' ? tokens.status.warningBg
            : tokens.status.infoBg;
          return (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                background: tokens.bg.surface,
                border: `1px solid ${tokens.border.subtle}`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 10, boxShadow: tokens.shadow.lg,
                padding: '12px 14px', minWidth: 280, maxWidth: 360,
                display: 'flex', gap: 10, alignItems: 'flex-start',
                animation: 'admin-toast-in 240ms cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div style={{ width: 24, height: 24, borderRadius: 6, background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {tone === 'success' ? '✓' : tone === 'error' ? '!' : tone === 'warning' ? '!' : 'i'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>{t.title}</div>
                {t.message && <div style={{ fontSize: 12, color: tokens.text.secondary, marginTop: 2 }}>{t.message}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <style jsx global>{`
        @keyframes admin-toast-in {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes admin-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}

/* =========================================================== */
/* Misc atoms                                                  */
/* =========================================================== */

export function ProgressBar({
  tokens, value, max = 100, color, height = 6,
}: {
  tokens: Tk; value: number; max?: number; color?: string; height?: number;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{
      height, borderRadius: height / 2,
      background: tokens.bg.surfaceAlt, overflow: 'hidden',
    }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: color ?? tokens.text.primary,
        borderRadius: height / 2,
        transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  );
}

export function Avatar({
  tokens, name, color, size = 32,
}: {
  tokens: Tk; name: string; color?: string; size?: number;
}) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3,
      background: color ?? tokens.text.primary,
      color: color === tokens.text.primary ? tokens.bg.app : '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 800, fontFamily: 'Inter, sans-serif',
      flexShrink: 0, letterSpacing: '-0.02em',
    }}>{initials}</div>
  );
}

export function KeyValue({
  tokens, label, value, mono,
}: {
  tokens: Tk; label: string; value: React.ReactNode; mono?: boolean;
}) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
        textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3,
      }}>{label}</div>
      <div style={{
        fontSize: 13, fontWeight: 600, color: tokens.text.primary,
        fontFamily: mono ? 'ui-monospace, "SF Mono", Menlo, monospace' : 'Inter, sans-serif',
      }}>{value}</div>
    </div>
  );
}

/* =========================================================== */
/* Icons (shared)                                              */
/* =========================================================== */

export function CloseIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  );
}

export function ChevronDown({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function PlusIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function SearchIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5" />
    </svg>
  );
}
