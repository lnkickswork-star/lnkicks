'use client';

import React, { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { useApp } from '@/components/context/AppContext';
import { theme } from '@/lib/mobile/theme/theme';
import { transitions } from '@/lib/mobile/theme/motion';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileHeader — premium minimal sticky header.
 *
 * Layout: [Menu icon] [LN KICKS centered] [Wishlist] [Cart] [Profile]
 *
 * White glass background, soft bottom border. Black icons. Live cart +
 * wishlist badges. Tapping the Menu icon calls `onMenuClick` which opens
 * a MobileMenuDrawer rendered at the page level (sibling of MobileBottomNav)
 * so the drawer's z-index isn't trapped inside this header's stacking context.
 *
 * LN KICKS theme: pure white + black + soft grey.
 *
 * Phase 3 polish:
 *  - Design tokens (no hardcoded colors/sizes)
 *  - Haptic feedback on tap (light tick)
 *  - Pressed state (scale 0.96 + bg flash)
 *  - Focus-visible ring for keyboard navigation
 *  - Memoized to prevent re-render on every AppContext cart tick
 *    (the only state we care about — cart + wishlist counts — is read
 *    via useApp, so memoizing is safe)
 */
function MobileHeaderImpl({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { cart } = useApp();
  const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.header,
        background: theme.colors.glass,
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: scrolled
          ? `1px solid ${theme.colors.border}`
          : '1px solid transparent',
        transition: transitions.border,
      }}
    >
      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
          padding: `${theme.spacing.md}px ${theme.spacing.pad}px`,
          // 3-column grid: Menu | centered wordmark | right cluster (Cart + Profile)
          display: 'grid',
          gridTemplateColumns: '36px 1fr 36px 36px',
          alignItems: 'center',
          gap: theme.spacing.hairline,
        }}
      >
        {/* Left: Menu */}
        <button
          type="button"
          onClick={() => {
            haptic.light();
            onMenuClick();
          }}
          aria-label="Open menu"
          className="pressable mh-icon-btn"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: theme.colors.textPrimary,
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
            <line x1="3" y1="12" x2="15" y2="12" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
          </svg>
        </button>

        {/* Center: wordmark */}
        <Link
          href="/"
          aria-label="LNKICKS home"
          className="pressable mh-wordmark"
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.xl,
            fontWeight: theme.fontWeight.extrabold,
            letterSpacing: theme.letterSpacing.widest,
            color: theme.colors.textPrimary,
            textDecoration: 'none',
            textAlign: 'center',
            justifySelf: 'center',
          }}
        >
          LNKICKS
        </Link>

        {/* Right: Cart */}
        <HeaderIconButton href="/cart" label="Cart" badge={cartCount}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </HeaderIconButton>

        {/* Right: Profile */}
        <HeaderIconButton href="/profile" label="Profile" badge={0}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </HeaderIconButton>
      </div>

      <style jsx>{pressableStyle}</style>
    </header>
  );
}

export const MobileHeader = memo(MobileHeaderImpl);
export default MobileHeader;

/* ──────────────────────────────────────────────────────────────────
 *  HeaderIconButton — compact icon button used in the header right
 *  cluster. Renders a Link with a circular badge if `badge > 0`.
 *
 *  Memoized — its only dynamic prop is `badge`, which only changes
 *  when cart/wishlist count changes.
 * ────────────────────────────────────────────────────────────────── */
type HeaderIconButtonProps = {
  href: string;
  label: string;
  badge: number;
  children: React.ReactNode;
};

function HeaderIconButtonImpl({
  href,
  label,
  badge,
  children,
}: HeaderIconButtonProps) {
  return (
    <Link
      href={href}
      aria-label={badge > 0 ? `${label}, ${badge} ${badge === 1 ? 'item' : 'items'}` : label}
      className="pressable mh-icon-link"
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.textPrimary,
        textDecoration: 'none',
        position: 'relative',
        background: 'transparent',
      }}
    >
      {children}
      {badge > 0 && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            background: theme.colors.black,
            color: theme.colors.white,
            fontSize: 8.5,
            fontWeight: theme.fontWeight.extrabold,
            minWidth: 14,
            height: 14,
            borderRadius: theme.radius.pill,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `0 ${theme.spacing.xs - 1}px`,
            border: `1.5px solid ${theme.colors.white}`,
            boxSizing: 'border-box',
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

const HeaderIconButton = memo(HeaderIconButtonImpl);
