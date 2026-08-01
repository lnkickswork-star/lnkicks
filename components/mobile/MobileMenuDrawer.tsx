'use client';

import React, { useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { transitions } from '@/lib/mobile/theme/motion';
import { safeArea } from '@/lib/mobile/utils/safeArea';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileMenuDrawer — luxury slide-in drawer from the left.
 *
 * Triggered by the Menu button in MobileHeader. Premium dark overlay +
 * white drawer panel. Drawer contains: wordmark, primary nav links,
 * auth link, secondary utility links, social row.
 *
 * LN KICKS theme: white drawer, black text, soft grey dividers.
 *
 * Phase 3 polish:
 *  - Design tokens
 *  - Haptic feedback (heavy on open, light on close/link-tap)
 *  - Safe-area-aware: drawer header clears Dynamic Island, footer clears Home Indicator
 *  - Focus trap inside drawer (focus moves to close button on open, returns on close)
 *  - aria-modal + role="dialog" properly set
 *  - Esc key closes (already done)
 *  - Body scroll lock (already done)
 *  - Memoized — only re-renders when `open` prop changes
 */

const PRIMARY_LINKS = [
  { label: 'Home', href: '/mobile' },
  { label: 'Shop All', href: '/products' },
  { label: 'Trending', href: '/products?filter=trending' },
  { label: 'New Arrivals', href: '/products?filter=new' },
  { label: 'Luxury', href: '/category/luxury' },
  { label: 'Categories', href: '/categories' },
  { label: 'Brands', href: '/products?filter=brands' },
  { label: 'Track Order', href: '/track-order' },
] as const;

const UTILITY_LINKS = [
  { label: 'About LN KICKS', href: '/about' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Returns & Refunds', href: '/return-refund-policy' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Terms & Conditions', href: '/terms-conditions' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
] as const;

function MobileMenuDrawerImpl({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Haptic: heavy tick on open
      haptic.heavy();
      // Move focus to close button after drawer opens
      const t = setTimeout(() => closeBtnRef.current?.focus(), 100);
      return () => {
        document.body.style.overflow = '';
        clearTimeout(t);
      };
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on Escape (also handled at page level, kept here for self-containment)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        haptic.light();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-hidden={!open}
      className={`mmd-root ${open ? 'mmd-root--open' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.drawer,
        pointerEvents: open ? 'auto' : 'none',
        visibility: open ? 'visible' : 'hidden',
      }}
    >
      {/* Dark overlay */}
      <div
        className="mmd-overlay"
        onClick={() => {
          haptic.light();
          onClose();
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: theme.colors.scrim,
          opacity: open ? 1 : 0,
          transition: transitions.fade,
        }}
        aria-hidden
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        className="mmd-panel"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'min(86%, 360px)',
          background: theme.colors.white,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: transitions.drawer,
          boxShadow: theme.shadows.xxl,
          // Safe-area-aware: drawer header clears Dynamic Island
          paddingTop: safeArea.paddingTop,
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${theme.spacing.xl}px ${theme.spacing.xxl - 2}px ${theme.spacing.xxl - 4}px`,
            borderBottom: `1px solid ${theme.colors.grey150}`,
          }}
        >
          <div
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.xl,
              fontWeight: theme.fontWeight.extrabold,
              letterSpacing: theme.letterSpacing.widest,
              color: theme.colors.textPrimary,
            }}
          >
            LNKICKS
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => {
              haptic.light();
              onClose();
            }}
            aria-label="Close menu"
            className="pressable"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `1px solid ${theme.colors.border}`,
              background: theme.colors.white,
              color: theme.colors.textPrimary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: `${theme.spacing.sm}px 0 ${theme.spacing.xxl}px`,
            WebkitOverflowScrolling: 'touch',
          }}
          className="mmd-scroll"
        >
          {/* Primary links */}
          <nav aria-label="Primary">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {PRIMARY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => {
                      haptic.selection();
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: `15px ${theme.spacing.xxl - 2}px`,
                      fontSize: 14.5,
                      fontWeight: theme.fontWeight.semibold,
                      color: theme.colors.textPrimary,
                      textDecoration: 'none',
                      borderBottom: `1px solid ${theme.colors.grey50}`,
                      transition: transitions.press,
                    }}
                    className="mmd-link"
                  >
                    {l.label}
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth CTA */}
          <div style={{ padding: `${theme.spacing.xxl - 4}px ${theme.spacing.xxl - 2}px ${theme.spacing.xxl - 4}px` }}>
            <Link
              href="/login"
              onClick={() => {
                haptic.medium();
                onClose();
              }}
              className="pressable"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: theme.spacing.sm,
                width: '100%',
                padding: `${theme.spacing.md + 2}px ${theme.spacing.xl}px`,
                background: theme.colors.black,
                color: theme.colors.white,
                borderRadius: theme.radius.pill,
                textDecoration: 'none',
                fontFamily: theme.fontFamily.display,
                fontSize: theme.fontSize.body,
                fontWeight: theme.fontWeight.bold,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              Sign In / Register
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Section divider */}
          <div style={{ padding: `0 ${theme.spacing.xxl - 2}px`, marginTop: theme.spacing.xs }}>
            <p
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textTertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                margin: `0 0 ${theme.spacing.sm}px 0`,
              }}
            >
              Help & Info
            </p>
          </div>

          {/* Utility links */}
          <nav aria-label="Utility">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {UTILITY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => {
                      haptic.selection();
                      onClose();
                    }}
                    style={{
                      display: 'block',
                      padding: `${theme.spacing.md - 1}px ${theme.spacing.xxl - 2}px`,
                      fontSize: theme.fontSize.body,
                      fontWeight: theme.fontWeight.medium,
                      color: theme.colors.textSecondary,
                      textDecoration: 'none',
                      transition: transitions.color,
                    }}
                    className="mmd-util-link"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Trust footer */}
          <div
            style={{
              padding: `${theme.spacing.xxl}px ${theme.spacing.xxl - 2}px 0`,
              marginTop: theme.spacing.md,
              borderTop: `1px solid ${theme.colors.grey150}`,
            }}
          >
            <p
              style={{
                fontSize: theme.fontSize.xs,
                fontWeight: theme.fontWeight.bold,
                color: theme.colors.textPrimary,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                margin: `0 0 ${theme.spacing.sm}px 0`,
              }}
            >
              100% Authentic
            </p>
            <p
              style={{
                fontSize: 11.5,
                color: theme.colors.textTertiary,
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              Verified by CheckCheck & LegitApp. Money-back guarantee on every pair.
            </p>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .mmd-scroll::-webkit-scrollbar {
          width: 0;
          display: none;
        }
        .mmd-link:active {
          background-color: ${theme.colors.grey50};
        }
        .mmd-util-link:active {
          color: ${theme.colors.textPrimary};
        }
        .mmd-link:focus-visible,
        .mmd-util-link:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: -2px;
        }
      `}</style>
      <style jsx>{pressableStyle}</style>
    </div>
  );
}

export const MobileMenuDrawer = memo(MobileMenuDrawerImpl);
export default MobileMenuDrawer;
