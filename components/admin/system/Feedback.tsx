/**
 * LNKICKS Enterprise Admin — Feedback System
 * ------------------------------------------------------------
 * ADDITIVE only. The original `Toast`, `EmptyState`, `ErrorState`,
 * `SuccessState`, `Spinner`, `Skeleton`, `PageLoading` in `ui.tsx`
 * remain canonical.
 *
 * This file adds the missing feedback primitives:
 *
 *   - Alert          (inline page-level alert with severity + close)
 *   - InlineMessage  (compact inline notice, no close button)
 *   - Snackbar       (top-positioned toast with optional action)
 *   - LoadingOverlay (full-card/section loading mask)
 *   - WarningState   (full-state warning panel)
 *   - InfoState      (full-state info panel)
 *   - SkeletonTable  (table-shaped loading placeholder)
 *   - SkeletonCard   (card-shaped loading placeholder)
 *   - ProgressBar    (linear indeterminate)
 *   - DotLoader      (three-dot bouncing loader)
 */

'use client';

import {
  createContext, useContext, useState, useCallback, useRef, useEffect,
  type ReactNode, type CSSProperties,
} from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';
import { dt } from '@/lib/admin/designTokens';
import { Icon, type IconName } from '@/components/admin/icons/Icon';
import { IconButton } from '@/components/admin/ui';

type Tk = AdminThemeTokens;

type Severity = 'info' | 'success' | 'warning' | 'error';

const SEVERITY_META: Record<Severity, { color: (t: Tk) => string; bg: (t: Tk) => string; icon: IconName }> = {
  info: { color: t => t.status.info, bg: t => t.status.infoBg, icon: 'info' },
  success: { color: t => t.status.success, bg: t => t.status.successBg, icon: 'checkCircle' },
  warning: { color: t => t.status.warning, bg: t => t.status.warningBg, icon: 'alertTriangle' },
  error: { color: t => t.status.error, bg: t => t.status.errorBg, icon: 'xCircle' },
};

/* =========================================================== */
/* Alert — inline page-level alert                             */
/* =========================================================== */
/**
 * Banner-style alert for inline page messaging. Sticks to top of
 * a section, full width, with icon + title + message + optional
 * close + optional action.
 */
export function Alert({
  tokens, severity = 'info', title, message, action, onClose,
  dismissible = false, style,
}: {
  tokens: Tk; severity?: Severity; title?: ReactNode; message?: ReactNode;
  action?: ReactNode; onClose?: () => void; dismissible?: boolean;
  style?: CSSProperties;
}) {
  const meta = SEVERITY_META[severity];
  const color = meta.color(tokens);
  const bg = meta.bg(tokens);
  return (
    <div
      role="alert"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '12px 14px', borderRadius: dt.radius.md,
        background: bg, border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        ...style,
      }}
    >
      <div style={{
        width: 20, height: 20, flexShrink: 0, marginTop: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}>
        <Icon name={meta.icon} size={16} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{
            fontSize: 13, fontWeight: 700, color: tokens.text.primary,
            fontFamily: 'Inter, sans-serif', marginBottom: message ? 2 : 0,
          }}>{title}</div>
        )}
        {message && (
          <div style={{
            fontSize: 12, color: tokens.text.secondary,
            fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
          }}>{message}</div>
        )}
        {action && <div style={{ marginTop: 8 }}>{action}</div>}
      </div>
      {dismissible && onClose && (
        <IconButton
          tokens={tokens}
          icon={<Icon name="x" size={12} color={tokens.text.secondary} />}
          label="Dismiss"
          size={22}
          onClick={onClose}
        />
      )}
    </div>
  );
}

/* =========================================================== */
/* InlineMessage — compact inline notice                       */
/* =========================================================== */
/**
 * Compact one-line notice. Use inside form fields or as a tiny
 * hint banner. No close button, no border — just colored text +
 * icon.
 */
export function InlineMessage({
  tokens, severity = 'info', children, style,
}: {
  tokens: Tk; severity?: Severity; children: ReactNode; style?: CSSProperties;
}) {
  const meta = SEVERITY_META[severity];
  const color = meta.color(tokens);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 500, color, fontFamily: 'Inter, sans-serif',
      ...style,
    }}>
      <Icon name={meta.icon} size={11} color={color} />
      {children}
    </div>
  );
}

/* =========================================================== */
/* Snackbar — top-positioned toast with optional action        */
/* =========================================================== */
/**
 * Snackbar context. Use `useSnackbar()` then call `push()`:
 *   const snack = useSnackbar();
 *   snack.push({ title: 'Saved', severity: 'success', action: { label: 'Undo', onClick: () => {} } });
 *
 * Renders at top-center, stacks vertically, auto-dismisses after
 * 5s (unless `sticky: true`).
 */
interface SnackItem {
  id: string;
  title: string;
  message?: string;
  severity?: Severity;
  action?: { label: string; onClick: () => void };
  duration?: number; // ms; default 5000; 0 = sticky
}

const SnackCtx = createContext<{ push: (s: Omit<SnackItem, 'id'>) => string; dismiss: (id: string) => void }>({
  push: () => '', dismiss: () => {},
});

export function SnackbarProvider({ tokens, children }: { tokens: Tk; children: ReactNode }) {
  const [items, setItems] = useState<SnackItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setItems(prev => prev.filter(s => s.id !== id));
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
  }, []);

  const push = useCallback((s: Omit<SnackItem, 'id'>) => {
    const id = `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const item: SnackItem = { id, duration: 5000, severity: 'info', ...s };
    setItems(prev => [...prev, item]);
    if (item.duration && item.duration > 0) {
      const t = setTimeout(() => dismiss(id), item.duration);
      timers.current.set(id, t);
    }
    return id;
  }, [dismiss]);

  useEffect(() => () => { timers.current.forEach(t => clearTimeout(t)); }, []);

  return (
    <SnackCtx.Provider value={{ push, dismiss }}>
      {children}
      <div style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: dt.zIndex.toast, display: 'flex', flexDirection: 'column', gap: 8,
        pointerEvents: 'none', maxWidth: 'calc(100vw - 32px)',
      }}>
        {items.map(s => {
          const meta = SEVERITY_META[s.severity ?? 'info'];
          const color = meta.color(tokens);
          const bg = meta.bg(tokens);
          return (
            <div
              key={s.id}
              role="status"
              style={{
                pointerEvents: 'auto',
                background: tokens.bg.surface,
                border: `1px solid ${tokens.border.subtle}`,
                borderTop: `3px solid ${color}`,
                borderRadius: dt.radius.md, boxShadow: tokens.shadow.lg,
                padding: '12px 14px', minWidth: 320, maxWidth: 480,
                display: 'flex', gap: 10, alignItems: 'flex-start',
                animation: `${dt.keyframes.slideInDown} 240ms ${dt.motion.easing.standard}`,
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: dt.radius.sm,
                background: bg, color, flexShrink: 0,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={meta.icon} size={14} color={color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: tokens.text.primary,
                  fontFamily: 'Inter, sans-serif',
                }}>{s.title}</div>
                {s.message && (
                  <div style={{
                    fontSize: 12, color: tokens.text.secondary, marginTop: 2,
                    fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
                  }}>{s.message}</div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                {s.action && (
                  <button
                    onClick={() => { s.action!.onClick(); dismiss(s.id); }}
                    style={{
                      border: 'none', background: 'transparent', cursor: 'pointer',
                      color: color, fontSize: 11, fontWeight: 700,
                      fontFamily: 'Inter, sans-serif', padding: '4px 6px',
                      borderRadius: dt.radius.sm,
                      transition: `background ${dt.motion.duration.quick}ms ease`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = bg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >{s.action.label}</button>
                )}
                <button
                  onClick={() => dismiss(s.id)}
                  aria-label="Dismiss"
                  style={{
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    color: tokens.text.tertiary, padding: 4, borderRadius: dt.radius.sm,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon name="x" size={12} color={tokens.text.tertiary} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx global>{`
        @keyframes admin-slide-down {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </SnackCtx.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackCtx);
}

/* =========================================================== */
/* LoadingOverlay — full-card/section loading mask             */
/* =========================================================== */
export function LoadingOverlay({
  tokens, label = 'Loading…', opaque = true, style,
}: {
  tokens: Tk; label?: ReactNode; opaque?: boolean; style?: CSSProperties;
}) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: opaque ? `${tokens.bg.surface}E6` : `${tokens.bg.surface}80`,
      backdropFilter: 'blur(2px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 12, zIndex: dt.zIndex.raised,
      borderRadius: 'inherit',
      ...style,
    }}>
      <Spinner tokens={tokens} size={24} />
      {label && (
        <div style={{
          fontSize: 12, fontWeight: 600, color: tokens.text.secondary,
          fontFamily: 'Inter, sans-serif',
        }}>{label}</div>
      )}
    </div>
  );
}

function Spinner({ tokens: _t, size = 16 }: { tokens: Tk; size?: number }) {
  return (
    <>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        style={{ animation: `${dt.keyframes.spin} 0.7s linear infinite`, color: 'currentColor' }}>
        <path d="M21 12a9 9 0 11-6.2-8.5" />
      </svg>
      <style jsx global>{`
        @keyframes admin-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

/* =========================================================== */
/* WarningState — full-state warning panel                     */
/* =========================================================== */
export function WarningState({
  tokens, title = 'Heads up', message, action, style,
}: {
  tokens: Tk; title?: string; message?: ReactNode;
  action?: ReactNode; style?: CSSProperties;
}) {
  return (
    <div style={{
      padding: '40px 24px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      ...style,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: dt.radius.xl,
        background: tokens.status.warningBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: tokens.status.warning,
        animation: `${dt.keyframes.successPop} 360ms ${dt.motion.easing.expressive}`,
      }}>
        <Icon name="alertTriangle" size={24} color={tokens.status.warning} />
      </div>
      <div>
        <h4 style={{
          margin: 0, fontSize: 14, fontWeight: 700, color: tokens.text.primary,
          fontFamily: 'Inter, sans-serif',
        }}>{title}</h4>
        {message && (
          <p style={{
            margin: '4px 0 0 0', fontSize: 12, color: tokens.text.secondary,
            maxWidth: 360, lineHeight: 1.5, fontFamily: 'Inter, sans-serif',
          }}>{message}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/* =========================================================== */
/* InfoState — full-state info panel                           */
/* =========================================================== */
export function InfoState({
  tokens, title = 'For your information', message, action, style,
}: {
  tokens: Tk; title?: string; message?: ReactNode;
  action?: ReactNode; style?: CSSProperties;
}) {
  return (
    <div style={{
      padding: '40px 24px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      ...style,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: dt.radius.xl,
        background: tokens.status.infoBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: tokens.status.info,
      }}>
        <Icon name="info" size={24} color={tokens.status.info} />
      </div>
      <div>
        <h4 style={{
          margin: 0, fontSize: 14, fontWeight: 700, color: tokens.text.primary,
          fontFamily: 'Inter, sans-serif',
        }}>{title}</h4>
        {message && (
          <p style={{
            margin: '4px 0 0 0', fontSize: 12, color: tokens.text.secondary,
            maxWidth: 360, lineHeight: 1.5, fontFamily: 'Inter, sans-serif',
          }}>{message}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/* =========================================================== */
/* SkeletonTable / SkeletonCard                                */
/* =========================================================== */
export function SkeletonTable({
  tokens, rows = 6, cols = 4, style,
}: {
  tokens: Tk; rows?: number; cols?: number; style?: CSSProperties;
}) {
  return (
    <div style={{
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: dt.radius.lg, overflow: 'hidden', ...style,
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
        padding: '10px 14px', background: tokens.bg.surfaceAlt,
        borderBottom: `1px solid ${tokens.border.subtle}`, gap: 12,
      }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer key={i} tokens={tokens} w={60} h={10} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{
          display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
          padding: '12px 14px', gap: 12,
          borderBottom: r === rows - 1 ? 'none' : `1px solid ${tokens.border.subtle}`,
        }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Shimmer key={c} tokens={tokens} w="80%" h={12} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({
  tokens, lines = 3, style,
}: {
  tokens: Tk; lines?: number; style?: CSSProperties;
}) {
  return (
    <div style={{
      background: tokens.bg.surface,
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: dt.radius.lg, padding: 18,
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Shimmer tokens={tokens} w={36} h={36} r={dt.radius.md} />
        <div style={{ flex: 1 }}>
          <Shimmer tokens={tokens} w="60%" h={10} />
          <div style={{ height: 4 }} />
          <Shimmer tokens={tokens} w="40%" h={8} />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer key={i} tokens={tokens} w={i === lines - 1 ? '70%' : '100%'} h={8} />
      ))}
    </div>
  );
}

function Shimmer({ tokens, w, h, r = 6 }: { tokens: Tk; w?: number | string; h?: number | string; r?: number }) {
  return (
    <>
      <div style={{
        width: w, height: h, borderRadius: r,
        background: `linear-gradient(90deg, ${tokens.bg.surfaceAlt} 0%, ${tokens.bg.hover} 50%, ${tokens.bg.surfaceAlt} 100%)`,
        backgroundSize: '200% 100%',
        animation: `${dt.keyframes.skel} 1.4s ease-in-out infinite`,
      }} />
      <style jsx global>{`
        @keyframes admin-skel {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}

/* =========================================================== */
/* DotLoader — three-dot bouncing loader                       */
/* =========================================================== */
export function DotLoader({
  tokens, size = 8, gap = 4, color, style,
}: {
  tokens: Tk; size?: number; gap?: number; color?: string; style?: CSSProperties;
}) {
  const c = color ?? tokens.text.secondary;
  return (
    <div style={{ display: 'inline-flex', gap, ...style }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: size, height: size, borderRadius: '50%', background: c,
          animation: `${dt.keyframes.pulse} 1s ${i * 0.15}s ease-in-out infinite`,
        }} />
      ))}
      <style jsx global>{`
        @keyframes admin-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/* =========================================================== */
/* IndeterminateBar — linear indeterminate progress            */
/* =========================================================== */
export function IndeterminateBar({
  tokens, height = 3, color, style,
}: {
  tokens: Tk; height?: number; color?: string; style?: CSSProperties;
}) {
  return (
    <div style={{
      height, borderRadius: height / 2,
      background: tokens.bg.surfaceAlt, overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        height: '100%', width: '40%',
        background: color ?? tokens.text.primary,
        borderRadius: height / 2,
        animation: 'admin-indeterminate 1.2s ease-in-out infinite',
      }} />
      <style jsx global>{`
        @keyframes admin-indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
