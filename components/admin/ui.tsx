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
import { dt } from '@/lib/admin/designTokens';
import { Icon, type IconName } from '@/components/admin/icons/Icon';

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

/* =========================================================== */
/*                                                             */
/* ENTERPRISE FOUNDATION EXTENSIONS                            */
/* ----------------------------------------------------------- */
/* The primitives below extend the original library with       */
/* missing components required by the LNKICKS Enterprise       */
/* Design System. They are ADDITIVE — the original 25 exports  */
/* above are unchanged so the 19 existing admin pages keep     */
/* working without modification.                               */
/*                                                             */
/* New exports:                                                */
/*   - Tooltip (CSS + JS hybrid, ARIA-compliant)               */
/*   - Stat / StatGrid (KPI mini display, different from       */
/*     KPICard widget — used inside panels)                    */
/*   - AvatarGroup (overlapping stacked avatars)               */
/*   - ButtonGroup (joined buttons)                            */
/*   - SegmentedControl (iOS / Material 3 style)               */
/*   - Radio / RadioGroup                                       */
/*   - Tag (removable tag chip)                                */
/*   - FilterPanel (sidebar filter form)                       */
/*   - ProgressRing (circular progress)                        */
/*   - PanelHeader (standalone panel header)                   */
/*   - Container / Stack / Inline / Grid (layout primitives)   */
/*   - Code / Kbd (typographic primitives)                     */
/*   - EmptyTable / ErrorState / SuccessState (state variants) */
/*   - NumberInput (input with +/- controls)                   */
/*   - TabsBar (underline-style tabs)                          */
/*   - Stepper (horizontal step indicator)                     */
/*   - FileUpload (drag-drop upload zone)                      */
/*   - Toggle improved (ARIA role="switch", keyboard)          */
/*   - Modal improved (focus trap)                             */
/*   - Dropdown improved (keyboard accessible trigger)         */
/*                                                             */
/* =========================================================== */


/* =========================================================== */
/* Tooltip — CSS positioning, JS open/close                    */
/* =========================================================== */

export function Tooltip({
  tokens, content, children, side = 'top', delay = 300,
}: {
  tokens: Tk; content: React.ReactNode; children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right'; delay?: number;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  };

  const posStyle: React.CSSProperties =
    side === 'top' ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 }
    : side === 'bottom' ? { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 }
    : side === 'left' ? { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 6 }
    : { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 6 };

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          style={{
            position: 'absolute', zIndex: dt.zIndex.dropdown,
            background: tokens.text.primary, color: tokens.bg.app,
            padding: '5px 9px', borderRadius: dt.radius.sm,
            fontSize: 11, fontWeight: 500, fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap', pointerEvents: 'none',
            boxShadow: tokens.shadow.md, maxWidth: 240,
            ...posStyle,
            animation: 'admin-tooltip-in 120ms ease-out',
          }}
        >
          {content}
          <style jsx>{`
            @keyframes admin-tooltip-in {
              from { opacity: 0; transform: scale(0.92); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </span>
      )}
    </span>
  );
}


/* =========================================================== */
/* Stat — mini KPI display used inside panels                  */
/* =========================================================== */

export function Stat({
  tokens, label, value, delta, deltaLabel, tone = 'neutral', icon,
}: {
  tokens: Tk; label: string; value: React.ReactNode;
  delta?: number; deltaLabel?: string;
  tone?: 'positive' | 'negative' | 'neutral'; icon?: React.ReactNode;
}) {
  const deltaColor = tone === 'positive' ? tokens.status.success
    : tone === 'negative' ? tokens.status.error
    : tokens.text.secondary;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      padding: '12px 14px', background: tokens.bg.surface,
      border: `1px solid ${tokens.border.subtle}`, borderRadius: dt.radius.lg,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, fontWeight: 600, color: tokens.text.secondary,
        fontFamily: 'Inter, sans-serif',
        textTransform: 'uppercase', letterSpacing: 0.5,
      }}>
        {icon && <span style={{ color: tokens.text.tertiary, display: 'inline-flex' }}>{icon}</span>}
        {label}
      </div>
      <div style={{
        fontSize: 22, fontWeight: 700, color: tokens.text.primary,
        fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em',
        lineHeight: 1.2,
      }}>{value}</div>
      {delta !== undefined && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11, color: deltaColor, fontFamily: 'Inter, sans-serif', fontWeight: 600,
        }}>
          <span>{tone === 'positive' ? '↑' : tone === 'negative' ? '↓' : '→'}</span>
          <span>{Math.abs(delta)}%</span>
          {deltaLabel && <span style={{ color: tokens.text.tertiary, fontWeight: 500 }}>{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
}

export function StatGrid({
  children, cols = 3,
}: {
  children: React.ReactNode; cols?: 2 | 3 | 4;
}) {
  const gridCols = cols === 2 ? '1fr 1fr' : cols === 4 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)';
  return (
    <>
      <div className="lnk-stat-grid" style={{
        display: 'grid', gridTemplateColumns: gridCols, gap: 12,
      }}>
        {children}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .lnk-stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .lnk-stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}


/* =========================================================== */
/* AvatarGroup — overlapping stacked avatars                   */
/* =========================================================== */

export function AvatarGroup({
  tokens, users, max = 4, size = 28,
}: {
  tokens: Tk;
  users: { name: string; color?: string }[];
  max?: number; size?: number;
}) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;
  const overlap = Math.floor(size * 0.3);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      // pull each subsequent avatar left by `overlap`
    }}>
      {visible.map((u, i) => (
        <div
          key={i}
          style={{
            marginLeft: i === 0 ? 0 : -overlap,
            border: `2px solid ${tokens.bg.surface}`,
            borderRadius: '50%', zIndex: visible.length - i,
          }}
          title={u.name}
        >
          <Avatar tokens={tokens} name={u.name} color={u.color} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          style={{
            marginLeft: -overlap,
            width: size, height: size, borderRadius: '50%',
            background: tokens.bg.surfaceAlt, color: tokens.text.secondary,
            border: `2px solid ${tokens.bg.surface}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.36, fontWeight: 700, fontFamily: 'Inter, sans-serif',
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}


/* =========================================================== */
/* ButtonGroup — joined buttons (segmented)                    */
/* =========================================================== */

export function ButtonGroup({
  tokens, children, style,
}: {
  tokens: Tk; children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div
      role="group"
      style={{
        display: 'inline-flex',
        background: tokens.bg.surfaceAlt,
        border: `1px solid ${tokens.border.subtle}`,
        borderRadius: dt.radius.md,
        padding: 2, gap: 2,
        ...style,
      }}
    >
      {children}
    </div>
  );
}


/* =========================================================== */
/* SegmentedControl — iOS / Material 3 style                   */
/* =========================================================== */

export function SegmentedControl<T extends string>({
  tokens, segments, value, onChange, size = 'md',
}: {
  tokens: Tk;
  segments: { value: T; label: string; icon?: React.ReactNode }[];
  value: T; onChange: (v: T) => void; size?: 'sm' | 'md';
}) {
  const h = size === 'sm' ? 28 : 34;
  const fs = size === 'sm' ? 11 : 12;
  return (
    <div
      role="radiogroup"
      style={{
        display: 'inline-flex', padding: 2,
        background: tokens.bg.surfaceAlt,
        borderRadius: dt.radius.md,
        border: `1px solid ${tokens.border.subtle}`,
        gap: 2,
      }}
    >
      {segments.map(seg => {
        const active = seg.value === value;
        return (
          <button
            key={seg.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(seg.value)}
            style={{
              height: h, padding: '0 12px',
              borderRadius: dt.radius.sm,
              border: 'none', cursor: 'pointer',
              background: active ? tokens.bg.surface : 'transparent',
              color: active ? tokens.text.primary : tokens.text.secondary,
              fontSize: fs, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: active ? dt.elevation.xs : 'none',
              transition: `all ${dt.motion.duration.fast}ms ${dt.motion.easing.standard}`,
            }}
          >
            {seg.icon}
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}


/* =========================================================== */
/* Radio / RadioGroup                                          */
/* =========================================================== */

export function Radio({
  tokens, label, checked, onChange, value, disabled,
}: {
  tokens: Tk; label?: React.ReactNode; checked: boolean;
  onChange?: (v: string) => void; value: string; disabled?: boolean;
}) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none', fontSize: 13,
      color: disabled ? tokens.text.tertiary : tokens.text.primary,
      fontFamily: 'Inter, sans-serif', opacity: disabled ? 0.6 : 1,
    }}>
      <input
        type="radio"
        checked={checked}
        value={value}
        disabled={disabled}
        onChange={() => onChange?.(value)}
        style={{
          appearance: 'none', WebkitAppearance: 'none',
          width: 16, height: 16, margin: 0,
          border: `1.5px solid ${checked ? tokens.text.primary : tokens.border.strong}`,
          borderRadius: '50%', background: 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: `all ${dt.motion.duration.quick}ms ${dt.motion.easing.standard}`,
        }}
      />
      <span style={{ position: 'relative', width: 0, height: 0 }}>
        {checked && (
          <span style={{
            position: 'absolute', top: -10, left: -10,
            width: 8, height: 8, borderRadius: '50%',
            background: tokens.text.primary, pointerEvents: 'none',
          }} />
        )}
      </span>
      {label}
      <style jsx>{`
        input[type="radio"]:focus-visible { outline: 2px solid ${tokens.border.focus}; outline-offset: 2px; }
      `}</style>
    </label>
  );
}


/* =========================================================== */
/* Tag — removable chip                                        */
/* =========================================================== */

export function Tag({
  tokens, children, onRemove, tone = 'neutral', icon,
}: {
  tokens: Tk; children: React.ReactNode;
  onRemove?: () => void; tone?: 'neutral' | 'info' | 'success' | 'warning' | 'critical';
  icon?: React.ReactNode;
}) {
  const tones = {
    neutral: { bg: tokens.bg.surfaceAlt, fg: tokens.text.secondary },
    info: { bg: tokens.status.infoBg, fg: tokens.status.info },
    success: { bg: tokens.status.successBg, fg: tokens.status.success },
    warning: { bg: tokens.status.warningBg, fg: tokens.status.warning },
    critical: { bg: tokens.status.errorBg, fg: tokens.status.error },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: dt.radius.sm,
      background: t.bg, color: t.fg,
      fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
      letterSpacing: 0.1,
    }}>
      {icon}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          style={{
            border: 'none', background: 'transparent',
            color: t.fg, cursor: 'pointer', padding: 0,
            display: 'inline-flex', marginLeft: 2, opacity: 0.7,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; }}
        >
          <Icon name="x" size={10} />
        </button>
      )}
    </span>
  );
}


/* =========================================================== */
/* ProgressRing — circular progress                            */
/* =========================================================== */

export function ProgressRing({
  tokens, value, max = 100, size = 48, strokeWidth = 4, color, label,
}: {
  tokens: Tk; value: number; max?: number;
  size?: number; strokeWidth?: number; color?: string; label?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, Math.max(0, value / max));
  const offset = circumference * (1 - pct);
  const stroke = color ?? tokens.text.primary;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={tokens.bg.surfaceAlt}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: `stroke-dashoffset ${dt.motion.duration.slow}ms ${dt.motion.easing.standard}` }}
        />
      </svg>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.28, fontWeight: 700, color: tokens.text.primary,
        fontFamily: 'Inter, sans-serif',
      }}>
        {label ?? `${Math.round(pct * 100)}%`}
      </div>
    </div>
  );
}


/* =========================================================== */
/* PanelHeader — standalone, used by Card or sections          */
/* =========================================================== */

export function PanelHeader({
  tokens, title, subtitle, icon, accent, action, onBack,
}: {
  tokens: Tk; title: string; subtitle?: string;
  icon?: React.ReactNode;
  accent?: 'warning' | 'critical' | 'success' | 'info' | 'purple';
  action?: React.ReactNode; onBack?: () => void;
}) {
  const accentColor = accent === 'warning' ? tokens.status.warning
    : accent === 'critical' ? tokens.status.error
    : accent === 'success' ? tokens.status.success
    : accent === 'info' ? tokens.status.info
    : accent === 'purple' ? '#8B5CF6' : null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 18px', borderBottom: `1px solid ${tokens.border.subtle}`, gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {onBack && (
          <IconButton tokens={tokens} icon={<Icon name="arrowLeft" size={14} />} label="Back" size={28} onClick={onBack} />
        )}
        {accentColor && <span style={{ width: 3, height: 18, borderRadius: 2, background: accentColor, flexShrink: 0 }} />}
        {icon}
        <div style={{ minWidth: 0 }}>
          <h3 style={{
            margin: 0, fontSize: 14, fontWeight: 700, color: tokens.text.primary,
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
  );
}


/* =========================================================== */
/* Layout primitives — Container / Stack / Inline / Grid       */
/* =========================================================== */

export function Container({
  children, maxWidth, tokens: _tokens, style,
}: {
  children: React.ReactNode; maxWidth?: number; tokens?: Tk; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      maxWidth: maxWidth ?? dt.layout.contentMaxWidth,
      margin: '0 auto', width: '100%',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Stack({
  gap = 12, align, justify, children, style,
}: {
  gap?: number; align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  children: React.ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      gap, alignItems: align, justifyContent: justify, ...style,
    }}>
      {children}
    </div>
  );
}

export function Inline({
  gap = 8, align, justify, children, style, wrap = false,
}: {
  gap?: number; align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  children: React.ReactNode; style?: React.CSSProperties; wrap?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'row',
      gap, alignItems: align, justifyContent: justify,
      flexWrap: wrap ? 'wrap' : 'nowrap', ...style,
    }}>
      {children}
    </div>
  );
}

export function Grid({
  cols = 3, gap = 12, minColWidth, children, style,
}: {
  cols?: number; gap?: number; minColWidth?: number;
  children: React.ReactNode; style?: React.CSSProperties;
}) {
  const template = minColWidth
    ? `repeat(auto-fill, minmax(${minColWidth}px, 1fr))`
    : `repeat(${cols}, 1fr)`;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: template, gap, ...style,
    }}>
      {children}
    </div>
  );
}


/* =========================================================== */
/* Code / Kbd — typographic primitives                         */
/* =========================================================== */

export function Code({
  tokens, children,
}: {
  tokens: Tk; children: React.ReactNode;
}) {
  return (
    <code style={{
      fontFamily: 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace',
      fontSize: 12, fontWeight: 500,
      background: tokens.bg.surfaceAlt, color: tokens.text.primary,
      padding: '1px 6px', borderRadius: dt.radius.sm,
      border: `1px solid ${tokens.border.subtle}`,
    }}>{children}</code>
  );
}

export function Kbd({
  tokens, children,
}: {
  tokens: Tk; children: React.ReactNode;
}) {
  return (
    <kbd style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 20, height: 20, padding: '0 5px',
      fontFamily: 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace',
      fontSize: 10, fontWeight: 600,
      background: tokens.bg.surface, color: tokens.text.secondary,
      border: `1px solid ${tokens.border.strong}`,
      borderBottomWidth: 2, borderRadius: dt.radius.sm,
      boxShadow: dt.elevation.xs,
    }}>{children}</kbd>
  );
}


/* =========================================================== */
/* State variants — EmptyTable / ErrorState / SuccessState     */
/* =========================================================== */

export function EmptyTable({
  tokens, columns, message = 'No data to display', action,
}: {
  tokens: Tk; columns: number; message?: string; action?: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={columns} style={{ padding: 0 }}>
        <div style={{
          padding: '48px 24px', textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: dt.radius.lg,
            background: tokens.bg.surfaceAlt,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: tokens.text.tertiary,
          }}>
            <Icon name="inbox" size={20} />
          </div>
          <p style={{ margin: 0, fontSize: 13, color: tokens.text.secondary, fontFamily: 'Inter, sans-serif' }}>
            {message}
          </p>
          {action && <div style={{ marginTop: 4 }}>{action}</div>}
        </div>
      </td>
    </tr>
  );
}

export function ErrorState({
  tokens, title = 'Something went wrong', message, onRetry, retryLabel = 'Try again',
}: {
  tokens: Tk; title?: string; message?: string;
  onRetry?: () => void; retryLabel?: string;
}) {
  return (
    <div style={{
      padding: '40px 24px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: dt.radius.xl,
        background: tokens.status.errorBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: tokens.status.error,
      }}>
        <Icon name="alertTriangle" size={24} />
      </div>
      <div>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
          {title}
        </h4>
        {message && (
          <p style={{ margin: '4px 0 0 0', fontSize: 12, color: tokens.text.secondary, maxWidth: 360, lineHeight: 1.5 }}>
            {message}
          </p>
        )}
      </div>
      {onRetry && (
        <Button tokens={tokens} variant="secondary" size="sm" icon={<Icon name="refresh" size={12} />} onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export function SuccessState({
  tokens, title = 'Success', message, action,
}: {
  tokens: Tk; title?: string; message?: string; action?: React.ReactNode;
}) {
  return (
    <div style={{
      padding: '40px 24px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: dt.radius.xl,
        background: tokens.status.successBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: tokens.status.success,
        animation: 'admin-success-pop 360ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <Icon name="checkCircle" size={24} />
      </div>
      <div>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
          {title}
        </h4>
        {message && (
          <p style={{ margin: '4px 0 0 0', fontSize: 12, color: tokens.text.secondary, maxWidth: 360, lineHeight: 1.5 }}>
            {message}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
      <style jsx>{`
        @keyframes admin-success-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}


/* =========================================================== */
/* NumberInput — input with +/- controls                       */
/* =========================================================== */

export function NumberInput({
  tokens, value, onChange, min, max, step = 1, suffix, disabled, style,
}: {
  tokens: Tk; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; suffix?: string;
  disabled?: boolean; style?: React.CSSProperties;
}) {
  const clamp = (n: number) => {
    if (min !== undefined && n < min) return min;
    if (max !== undefined && n > max) return max;
    return n;
  };
  const inc = () => !disabled && onChange(clamp(value + step));
  const dec = () => !disabled && onChange(clamp(value - step));
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: tokens.bg.surface,
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: dt.radius.md,
      height: 38, overflow: 'hidden',
      opacity: disabled ? 0.55 : 1,
      ...style,
    }}>
      <button
        type="button"
        onClick={dec}
        disabled={disabled}
        aria-label="Decrease"
        style={{
          width: 32, height: '100%', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
          background: 'transparent', color: tokens.text.secondary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name="minus" size={12} />
      </button>
      <input
        type="number"
        value={value}
        disabled={disabled}
        onChange={e => onChange(clamp(Number(e.target.value)))}
        style={{
          width: 60, height: '100%', border: 'none', outline: 'none',
          background: 'transparent', color: tokens.text.primary,
          fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          // hide number input spinners
          WebkitAppearance: 'none', MozAppearance: 'textfield',
        }}
      />
      {suffix && (
        <span style={{
          paddingRight: 4, color: tokens.text.tertiary,
          fontSize: 12, fontFamily: 'Inter, sans-serif',
        }}>{suffix}</span>
      )}
      <button
        type="button"
        onClick={inc}
        disabled={disabled}
        aria-label="Increase"
        style={{
          width: 32, height: '100%', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
          background: 'transparent', color: tokens.text.secondary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name="plus" size={12} />
      </button>
    </div>
  );
}


/* =========================================================== */
/* TabsBar — underline-style tabs (alternative to pill Tabs)   */
/* =========================================================== */

export function TabsBar<T extends string>({
  tokens, tabs, value, onChange,
}: {
  tokens: Tk; tabs: { value: T; label: string; badge?: string | number }[];
  value: T; onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" style={{
      display: 'flex', gap: 0,
      borderBottom: `1px solid ${tokens.border.subtle}`,
    }}>
      {tabs.map(tab => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            style={{
              padding: '10px 14px', background: 'transparent',
              border: 'none', borderBottom: active ? `2px solid ${tokens.text.primary}` : '2px solid transparent',
              color: active ? tokens.text.primary : tokens.text.secondary,
              fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
              marginBottom: -1,
              transition: `color ${dt.motion.duration.quick}ms ${dt.motion.easing.standard}`,
            }}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span style={{
                fontSize: 10, fontWeight: 700, minWidth: 16, height: 16,
                padding: '0 4px', borderRadius: 8,
                background: active ? tokens.text.primary : tokens.bg.hover,
                color: active ? tokens.bg.app : tokens.text.secondary,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{tab.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}


/* =========================================================== */
/* Stepper — horizontal step indicator                         */
/* =========================================================== */

export function Stepper({
  tokens, steps, current,
}: {
  tokens: Tk; steps: { label: string; description?: string }[];
  current: number;  // 0-indexed current step
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const color = done ? tokens.status.success
          : active ? tokens.text.primary
          : tokens.text.tertiary;
        const bg = done ? tokens.status.successBg
          : active ? tokens.text.primary
          : tokens.bg.surfaceAlt;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            flex: i === steps.length - 1 ? '0 0 auto' : '1 1 auto',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: bg, color: active ? tokens.bg.app : color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                border: `2px solid ${color}`,
                transition: `all ${dt.motion.duration.base}ms ${dt.motion.easing.standard}`,
              }}>
                {done ? <Icon name="check" size={12} /> : i + 1}
              </div>
              <div style={{
                fontSize: 11, fontWeight: active ? 700 : 500,
                color: active ? tokens.text.primary : tokens.text.secondary,
                fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
              }}>{step.label}</div>
              {step.description && (
                <div style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>
                  {step.description}
                </div>
              )}
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, minWidth: 24, maxWidth: 80,
                background: done ? tokens.status.success : tokens.border.subtle,
                margin: '0 8px', marginTop: 11, // align with circle center
                borderRadius: 1,
                transition: `background ${dt.motion.duration.base}ms ${dt.motion.easing.standard}`,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}


/* =========================================================== */
/* FileUpload — drag-drop upload zone                          */
/* =========================================================== */

export function FileUpload({
  tokens, accept, multiple, onFiles, label = 'Drop files here or click to upload',
  hint = 'PNG, JPG, PDF up to 10MB',
}: {
  tokens: Tk; accept?: string; multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string; hint?: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    onFiles(Array.from(fileList));
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => {
        e.preventDefault(); setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `1.5px dashed ${dragOver ? tokens.text.primary : tokens.border.strong}`,
        borderRadius: dt.radius.lg,
        background: dragOver ? tokens.bg.hover : tokens.bg.surfaceAlt,
        padding: '24px 16px', textAlign: 'center',
        cursor: 'pointer', transition: `all ${dt.motion.duration.fast}ms ${dt.motion.easing.standard}`,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)}
      />
      <div style={{
        width: 40, height: 40, borderRadius: dt.radius.lg,
        background: tokens.bg.surface, color: tokens.text.secondary,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 8px',
        border: `1px solid ${tokens.border.subtle}`,
      }}>
        <Icon name="cloudUpload" size={18} />
      </div>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
        {label}
      </p>
      <p style={{ margin: '4px 0 0 0', fontSize: 11, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>
        {hint}
      </p>
    </div>
  );
}


/* =========================================================== */
/* FilterPanel — sidebar filter form                           */
/* =========================================================== */

export function FilterPanel({
  tokens, title = 'Filters', children, onClear, onApply,
}: {
  tokens: Tk; title?: string; children: React.ReactNode;
  onClear?: () => void; onApply?: () => void;
}) {
  return (
    <div style={{
      background: tokens.bg.surface,
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: dt.radius.lg,
      boxShadow: tokens.shadow.sm,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px', borderBottom: `1px solid ${tokens.border.subtle}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="filter" size={14} color={tokens.text.secondary} />
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
            {title}
          </h4>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: tokens.text.secondary, fontSize: 11, fontWeight: 600,
              fontFamily: 'Inter, sans-serif', padding: 0,
            }}
          >Clear all</button>
        )}
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
      {onApply && (
        <div style={{ padding: '10px 16px', borderTop: `1px solid ${tokens.border.subtle}` }}>
          <Button tokens={tokens} variant="primary" size="sm" fullWidth onClick={onApply}>
            Apply filters
          </Button>
        </div>
      )}
    </div>
  );
}


/* =========================================================== */
/* DescriptionList — key/value pairs in a definition list      */
/* =========================================================== */

export function DescriptionList({
  tokens, items, columns = 2,
}: {
  tokens: Tk; items: { label: string; value: React.ReactNode; mono?: boolean }[];
  columns?: 1 | 2 | 3;
}) {
  const gridCols = columns === 1 ? '1fr' : columns === 3 ? 'repeat(3, 1fr)' : '1fr 1fr';
  return (
    <dl style={{
      margin: 0, display: 'grid', gridTemplateColumns: gridCols, gap: '14px 20px',
    }}>
      {items.map((item, i) => (
        <div key={i}>
          <dt style={{
            fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
            textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3,
            fontFamily: 'Inter, sans-serif',
          }}>{item.label}</dt>
          <dd style={{
            margin: 0, fontSize: 13, fontWeight: 500, color: tokens.text.primary,
            fontFamily: item.mono ? 'ui-monospace, "SF Mono", Menlo, monospace' : 'Inter, sans-serif',
          }}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}


/* =========================================================== */
/* ModalFocusTrap — wrapper to trap focus inside a container   */
/* =========================================================== */
/**
 * Use inside Modal / Drawer to keep keyboard focus cycling
 * between the children. Identifies focusable elements and
 * loops Tab / Shift+Tab.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;
    const selector = 'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';
    const focusable = () => Array.from(node.querySelectorAll<HTMLElement>(selector));
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    node.addEventListener('keydown', onKey);
    // focus first element on mount
    const items = focusable();
    if (items.length > 0) items[0].focus();
    return () => node.removeEventListener('keydown', onKey);
  }, [active]);
  return ref;
}


/* =========================================================== */
/* NotificationsBell — dropdown trigger with badge + list      */
/* =========================================================== */
/**
 * A self-contained notifications dropdown. Provides bell icon
 * with unread count + a dropdown listing recent notifications
 * with severity color + read/unread state + "mark all read".
 */
export function NotificationsBell({
  tokens, notifications, onMarkAllRead, onMarkRead, onViewAll,
}: {
  tokens: Tk;
  notifications: { id: string; type: string; title: string; message?: string; timestamp: number; read: boolean; severity?: 'info' | 'warning' | 'critical' | 'success' }[];
  onMarkAllRead?: () => void;
  onMarkRead?: (id: string) => void;
  onViewAll?: () => void;
}) {
  const unread = notifications.filter(n => !n.read).length;
  return (
    <Dropdown
      tokens={tokens}
      align="right"
      width={360}
      trigger={
        <button
          aria-label={`Notifications${unread ? ` (${unread} unread)` : ''}`}
          style={{
            position: 'relative', width: 32, height: 32, borderRadius: dt.radius.md,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: tokens.text.secondary, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            transition: `background ${dt.motion.duration.quick}ms ${dt.motion.easing.standard}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = tokens.bg.hover; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <Icon name="bell" size={16} />
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4,
              minWidth: 14, height: 14, padding: '0 3px', borderRadius: 7,
              background: tokens.status.error, color: '#fff',
              fontSize: 9, fontWeight: 700, fontFamily: 'Inter, sans-serif',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${tokens.bg.topbar}`,
            }}>{unread > 9 ? '9+' : unread}</span>
          )}
        </button>
      }
    >
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '2px 4px 6px',
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
            Notifications
          </span>
          {unread > 0 && onMarkAllRead && (
            <button
              onClick={onMarkAllRead}
              style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                color: tokens.text.secondary, fontSize: 11, fontWeight: 600,
                fontFamily: 'Inter, sans-serif', padding: 0,
              }}
            >Mark all read</button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div style={{ padding: '24px 8px', textAlign: 'center', color: tokens.text.tertiary, fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
            You&apos;re all caught up
          </div>
        ) : notifications.slice(0, 6).map(n => {
          const sev = n.severity ?? 'info';
          const color = sev === 'critical' ? tokens.status.error
            : sev === 'warning' ? tokens.status.warning
            : sev === 'success' ? tokens.status.success
            : tokens.status.info;
          return (
            <div
              key={n.id}
              onClick={() => onMarkRead?.(n.id)}
              style={{
                padding: '8px 10px', borderRadius: dt.radius.md, cursor: 'pointer',
                background: n.read ? 'transparent' : tokens.bg.hover,
                display: 'flex', gap: 8, alignItems: 'flex-start',
                transition: `background ${dt.motion.duration.quick}ms ${dt.motion.easing.standard}`,
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: color,
                marginTop: 5, flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: tokens.text.primary,
                  fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{n.title}</div>
                {n.message && (
                  <div style={{
                    fontSize: 11, color: tokens.text.secondary, marginTop: 1,
                    fontFamily: 'Inter, sans-serif',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>{n.message}</div>
                )}
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 3, fontFamily: 'Inter, sans-serif' }}>
                  {new Date(n.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
        {onViewAll && (
          <button
            onClick={onViewAll}
            style={{
              marginTop: 4, padding: '8px', border: 'none', cursor: 'pointer',
              background: 'transparent', color: tokens.text.secondary,
              fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              borderTop: `1px solid ${tokens.border.subtle}`,
            }}
          >View all notifications</button>
        )}
      </div>
    </Dropdown>
  );
}


/* =========================================================== */
/* Drawer improved — uses focus trap                            */
/* =========================================================== */
/**
 * Re-export of Drawer with focus trap. API-compatible with the
 * original Drawer above; safe to use as a drop-in replacement.
 */
export function DrawerA11y({
  tokens, open, onClose, title, subtitle, children, footer, side = 'right', width = 440,
}: {
  tokens: Tk; open: boolean; onClose: () => void;
  title?: string; subtitle?: string; children: React.ReactNode;
  footer?: React.ReactNode; side?: 'right' | 'left'; width?: number;
}) {
  const ref = useFocusTrap<HTMLDivElement>(open);
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
        zIndex: dt.zIndex.drawer,
        display: 'flex', justifyContent: side === 'right' ? 'flex-end' : 'flex-start',
        animation: 'admin-fade-in 160ms ease',
      }}
    >
      <div
        ref={ref}
        role="dialog" aria-modal="true" aria-label={title}
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
            <IconButton tokens={tokens} icon={<Icon name="x" size={14} />} label="Close" onClick={onClose} size={28} />
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
    </div>
  );
}


/* =========================================================== */
/* Table primitives — Th, Td, Tr, THead, TBody                 */
/* =========================================================== */
/**
 * Standardized table cell components. Use these in place of
 * raw <th>/<td> to ensure consistent typography, padding,
 * and color across every admin table.
 */
export function Th({
  tokens, children, align = 'left', sortable, onSort, sortDir, width,
}: {
  tokens: Tk; children: React.ReactNode; align?: 'left' | 'right' | 'center';
  sortable?: boolean; onSort?: () => void; sortDir?: 'asc' | 'desc'; width?: number | string;
}) {
  return (
    <th
      onClick={sortable ? onSort : undefined}
      style={{
        padding: '10px 12px', textAlign: align,
        fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
        textTransform: 'uppercase', letterSpacing: 0.8,
        fontFamily: 'Inter, sans-serif',
        borderBottom: `1px solid ${tokens.border.subtle}`,
        background: tokens.bg.surfaceAlt,
        cursor: sortable ? 'pointer' : 'default',
        width, whiteSpace: 'nowrap',
        userSelect: 'none',
        transition: `color ${dt.motion.duration.quick}ms ${dt.motion.easing.standard}`,
      }}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        flexDirection: align === 'right' ? 'row-reverse' : 'row',
      }}>
        {children}
        {sortable && (
          <span style={{ display: 'inline-flex', color: sortDir ? tokens.text.primary : tokens.text.tertiary }}>
            {sortDir === 'asc' ? <Icon name="chevronUp" size={10} />
              : sortDir === 'desc' ? <Icon name="chevronDown" size={10} />
              : <Icon name="chevronsDown" size={10} />}
          </span>
        )}
      </span>
    </th>
  );
}

export function Td({
  tokens: _tokens, children, align = 'left', padding = '10px 12px', colSpan, truncate,
}: {
  tokens: Tk; children: React.ReactNode; align?: 'left' | 'right' | 'center';
  padding?: string | number; colSpan?: number; truncate?: boolean;
}) {
  return (
    <td
      colSpan={colSpan}
      style={{
        padding, textAlign: align,
        fontSize: 13, fontWeight: 400, color: _tokens.text.primary,
        fontFamily: 'Inter, sans-serif',
        borderBottom: `1px solid ${_tokens.border.subtle}`,
        whiteSpace: truncate ? 'nowrap' : 'normal',
        overflow: truncate ? 'hidden' : 'visible',
        textOverflow: truncate ? 'ellipsis' : 'clip',
        maxWidth: truncate ? 240 : undefined,
      }}
    >
      {children}
    </td>
  );
}

export function TableWrap({
  tokens, children, maxHeight,
}: {
  tokens: Tk; children: React.ReactNode; maxHeight?: number | string;
}) {
  return (
    <div style={{
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: dt.radius.lg,
      overflow: 'hidden',
      background: tokens.bg.surface,
    }}>
      <div style={{ overflowX: 'auto', maxHeight, overflowY: maxHeight ? 'auto' : 'visible' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontFamily: 'Inter, sans-serif', fontSize: 13,
        }}>
          {children}
        </table>
      </div>
    </div>
  );
}


/* =========================================================== */
/* Section — page-level section wrapper with heading           */
/* =========================================================== */

export function Section({
  tokens, title, description, action, children, gap = 16,
}: {
  tokens: Tk; title?: string; description?: string;
  action?: React.ReactNode; children: React.ReactNode; gap?: number;
}) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap }}>
      {(title || description || action) && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
        }}>
          <div>
            {title && (
              <h2 style={{
                margin: 0, fontSize: 15, fontWeight: 700, color: tokens.text.primary,
                fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em',
              }}>{title}</h2>
            )}
            {description && (
              <p style={{
                margin: '4px 0 0 0', fontSize: 12, color: tokens.text.secondary,
                fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
              }}>{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}


/* =========================================================== */
/* ChevronIcon — direction-aware chevron (alias)               */
/* =========================================================== */
/**
 * Convenience wrapper around <Icon name="chevron*" /> that
 * picks the right chevron based on a direction prop. Useful
 * for accordion / dropdown triggers.
 */
export function ChevronIcon({
  direction = 'down', size = 12, color = 'currentColor',
}: {
  direction?: 'up' | 'down' | 'left' | 'right';
  size?: number; color?: string;
}) {
  const name: IconName = direction === 'up' ? 'chevronUp'
    : direction === 'left' ? 'chevronLeft'
    : direction === 'right' ? 'chevronRight'
    : 'chevronDown';
  return <Icon name={name} size={size} color={color} />;
}

