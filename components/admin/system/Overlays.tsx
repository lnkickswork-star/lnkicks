/**
 * LNKICKS Enterprise Admin — Overlay System
 * ------------------------------------------------------------
 * ADDITIVE only. The original `Modal`, `Drawer`, `DrawerA11y`,
 * `ConfirmDialog` in `ui.tsx` remain canonical.
 *
 * This file adds the missing overlay components:
 *
 *   - BottomSheet   (mobile-first slide-up sheet)
 *   - ImageViewer   (lightbox modal for image preview)
 *   - QuickPreview  (slide-over detail panel for entities)
 *
 * All overlays:
 *   - Lock body scroll while open
 *   - Close on Escape + backdrop click
 *   - Use focus trap
 *   - Animate with cubic-bezier(0.16,1,0.3,1)
 *   - Stack on z-index: dt.zIndex.modal (1000)
 */

'use client';

import {
  useEffect, useRef, useState, type ReactNode, type CSSProperties,
} from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';
import { dt } from '@/lib/admin/designTokens';
import { Icon } from '@/components/admin/icons/Icon';
import { IconButton, useFocusTrap } from '@/components/admin/ui';

type Tk = AdminThemeTokens;

function useLockBody(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}

function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onEscape(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, onEscape]);
}

/* =========================================================== */
/* BottomSheet — mobile-first slide-up sheet                   */
/* =========================================================== */
export function BottomSheet({
  tokens, open, onClose, title, subtitle, children, footer,
  maxHeight = '80vh',
}: {
  tokens: Tk; open: boolean; onClose: () => void;
  title?: string; subtitle?: string; children: ReactNode; footer?: ReactNode;
  maxHeight?: number | string;
}) {
  useLockBody(open);
  useEscape(open, onClose);
  const ref = useFocusTrap<HTMLDivElement>(open);
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: tokens.bg.overlay, backdropFilter: 'blur(2px)',
        zIndex: dt.zIndex.modal,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: `${dt.keyframes.fadeIn} 160ms ease`,
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
        style={{
          background: tokens.bg.surface,
          borderRadius: `${dt.radius.xl} ${dt.radius.xl} 0 0`,
          width: '100%', maxWidth: 560, maxHeight,
          display: 'flex', flexDirection: 'column',
          boxShadow: tokens.shadow.lg,
          animation: `${dt.keyframes.slideInUp} 280ms ${dt.motion.easing.standard}`,
        }}
      >
        <div style={{
          padding: '8px 0 0', display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            width: 36, height: 4, borderRadius: 2,
            background: tokens.border.strong,
          }} />
        </div>
        {(title || subtitle) && (
          <div style={{
            padding: '12px 18px 14px', display: 'flex',
            alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ minWidth: 0 }}>
              {title && (
                <h3 style={{
                  margin: 0, fontSize: 15, fontWeight: 700,
                  color: tokens.text.primary, fontFamily: 'Inter, sans-serif',
                }}>{title}</h3>
              )}
              {subtitle && (
                <p style={{
                  margin: '4px 0 0 0', fontSize: 12,
                  color: tokens.text.secondary, fontFamily: 'Inter, sans-serif',
                }}>{subtitle}</p>
              )}
            </div>
            <IconButton
              tokens={tokens}
              icon={<Icon name="x" size={14} color={tokens.text.secondary} />}
              label="Close"
              size={28}
              onClick={onClose}
            />
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 16px' }}>
          {children}
        </div>
        {footer && (
          <div style={{
            padding: '12px 18px',
            borderTop: `1px solid ${tokens.border.subtle}`,
            display: 'flex', justifyContent: 'flex-end', gap: 8,
            background: tokens.bg.surface,
            borderRadius: `0 0 ${dt.radius.xl} ${dt.radius.xl}`,
          }}>{footer}</div>
        )}
      </div>
      <style jsx global>{`
        @keyframes admin-slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* =========================================================== */
/* ImageViewer — lightbox modal                                */
/* =========================================================== */
export function ImageViewer({
  tokens, open, onClose, src, alt, title, caption,
  downloadHref,
}: {
  tokens: Tk; open: boolean; onClose: () => void;
  src?: string; alt?: string; title?: string; caption?: ReactNode;
  downloadHref?: string;
}) {
  useLockBody(open);
  useEscape(open, onClose);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(false); }, [src, open]);

  if (!open || !src) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.92)',
        zIndex: dt.zIndex.modal,
        display: 'flex', flexDirection: 'column',
        animation: `${dt.keyframes.fadeIn} 180ms ease`,
      }}
    >
      {/* Top bar */}
      <div style={{
        padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        color: '#fff',
      }}>
        <div style={{ minWidth: 0 }}>
          {title && (
            <div style={{
              fontSize: 13, fontWeight: 700, color: '#fff',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{title}</div>
          )}
          {alt && (
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.6)',
              fontFamily: 'Inter, sans-serif',
            }}>{alt}</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {downloadHref && (
            <IconButton
              tokens={tokens}
              icon={<Icon name="download" size={14} color="#fff" />}
              label="Download"
              size={32}
              variant="solid"
              onClick={() => {
                const a = document.createElement('a');
                a.href = downloadHref; a.download = alt || 'image';
                a.click();
              }}
            />
          )}
          <IconButton
            tokens={tokens}
            icon={<Icon name="x" size={16} color="#fff" />}
            label="Close"
            size={32}
            variant="solid"
            onClick={onClose}
          />
        </div>
      </div>
      {/* Image area */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, position: 'relative', overflow: 'hidden',
        }}
      >
        {!loaded && (
          <div style={{
            position: 'absolute', color: 'rgba(255,255,255,0.6)',
            fontSize: 12, fontFamily: 'Inter, sans-serif',
          }}>Loading…</div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ''}
          onLoad={() => setLoaded(true)}
          style={{
            maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
            opacity: loaded ? 1 : 0,
            transition: `opacity ${dt.motion.duration.base}ms ease`,
            borderRadius: dt.radius.md,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        />
      </div>
      {/* Caption */}
      {caption && (
        <div style={{
          padding: '12px 16px', color: 'rgba(255,255,255,0.8)',
          fontSize: 12, fontFamily: 'Inter, sans-serif', textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}>{caption}</div>
      )}
    </div>
  );
}

/* =========================================================== */
/* QuickPreview — slide-over detail panel                      */
/* =========================================================== */
/**
 * Lightweight slide-over for entity preview (e.g. click a row in
 * a table, see a preview of the entity without leaving the page).
 * Differs from Drawer by being wider (560px default) and having
 * a built-in header with avatar + title + meta + actions slot.
 */
export function QuickPreview({
  tokens, open, onClose, title, subtitle, avatar, meta, actions,
  children, footer, width = 560,
}: {
  tokens: Tk; open: boolean; onClose: () => void;
  title: string; subtitle?: string; avatar?: ReactNode;
  meta?: ReactNode; actions?: ReactNode;
  children: ReactNode; footer?: ReactNode; width?: number;
}) {
  useLockBody(open);
  useEscape(open, onClose);
  const ref = useFocusTrap<HTMLDivElement>(open);
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: tokens.bg.overlay, backdropFilter: 'blur(2px)',
        zIndex: dt.zIndex.modal,
        display: 'flex', justifyContent: 'flex-end',
        animation: `${dt.keyframes.fadeIn} 160ms ease`,
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
        style={{
          background: tokens.bg.surface,
          borderLeft: `1px solid ${tokens.border.subtle}`,
          width: '100%', maxWidth: width, height: '100vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: tokens.shadow.lg,
          animation: `${dt.keyframes.slideInRight} 280ms ${dt.motion.easing.standard}`,
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${tokens.border.subtle}`,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          {avatar}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              margin: 0, fontSize: 16, fontWeight: 700,
              color: tokens.text.primary, fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.01em',
            }}>{title}</h3>
            {subtitle && (
              <p style={{
                margin: '3px 0 0 0', fontSize: 12,
                color: tokens.text.secondary, fontFamily: 'Inter, sans-serif',
              }}>{subtitle}</p>
            )}
            {meta && (
              <div style={{
                marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap',
              }}>{meta}</div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {actions}
            <IconButton
              tokens={tokens}
              icon={<Icon name="x" size={14} color={tokens.text.secondary} />}
              label="Close"
              size={28}
              onClick={onClose}
            />
          </div>
        </div>
        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div style={{
            padding: '12px 20px', borderTop: `1px solid ${tokens.border.subtle}`,
            display: 'flex', justifyContent: 'flex-end', gap: 8,
            background: tokens.bg.surfaceAlt,
          }}>{footer}</div>
        )}
      </div>
      <style jsx global>{`
        @keyframes admin-slide-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}

/* =========================================================== */
/* Popover — lightweight anchored popover                      */
/* =========================================================== */
/**
 * Minimal popover for hover/click-triggered contextual content.
 * Differs from Dropdown by accepting arbitrary children (not just
 * menu items) and being click-or-hover triggerable.
 */
export function Popover({
  tokens, trigger, children, align = 'left', width = 240, triggerOn = 'click',
}: {
  tokens: Tk; trigger: ReactNode; children: ReactNode;
  align?: 'left' | 'right'; width?: number; triggerOn?: 'click' | 'hover';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={triggerOn === 'hover' ? () => setOpen(true) : undefined}
      onMouseLeave={triggerOn === 'hover' ? () => setOpen(false) : undefined}
    >
      <div onClick={() => triggerOn === 'click' && setOpen(o => !o)}>
        {trigger}
      </div>
      {open && (
        <div
          role="dialog"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)',
            [align === 'right' ? 'right' : 'left']: 0,
            width, background: tokens.bg.surface,
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: dt.radius.md, boxShadow: tokens.shadow.lg,
            padding: 12, zIndex: dt.zIndex.dropdown,
            animation: `${dt.keyframes.popIn} 140ms ${dt.motion.easing.standard}`,
          } as CSSProperties}
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
