'use client';

import React, { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { theme } from '@/lib/mobile/theme/theme';
import { transitions } from '@/lib/mobile/theme/motion';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileHeader — premium minimal sticky header.
 *
 * Layout: [Menu icon] [LN KICKS centered] [Profile]
 *
 * White glass background, soft bottom border. Black icons. Tapping the
 * Menu icon calls `onMenuClick` which opens a MobileMenuDrawer rendered
 * at the page level (sibling of MobileBottomNav) so the drawer's z-index
 * isn't trapped inside this header's stacking context.
 *
 * NOTE (Phase 5 simplification, per user request): the Cart icon has been
 * REMOVED from the header. Cart is still reachable via the bottom nav.
 *
 * LN KICKS theme: pure white + black + soft grey.
 *
 * Phase 3 polish:
 *  - Design tokens (no hardcoded colors/sizes)
 *  - Haptic feedback on tap (light tick)
 *  - Pressed state (scale 0.96 + bg flash)
 *  - Focus-visible ring for keyboard navigation
 *  - Memoized to prevent re-render on every AppContext cart tick
 */
function MobileHeaderImpl({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
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
        // Phase 7: stronger Apple-style blur (was 20px) + softer border
        background: theme.colors.glass,
        backdropFilter: 'saturate(180%) blur(24px)',
        WebkitBackdropFilter: 'saturate(180%) blur(24px)',
        borderBottom: scrolled
          ? `1px solid ${theme.colors.grey200}`
          : '1px solid transparent',
        transition: transitions.border,
      }}
    >
      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
          // Header height = 64px per Phase 6 spec (was md+xl padding ≈ 60px)
          height: theme.spacing.headerHeight,
          padding: `0 ${theme.spacing.sectionPadding}px`,
          // 3-column grid: Menu | centered wordmark | Profile
          display: 'grid',
          gridTemplateColumns: '40px 1fr 40px',
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
            width: 40,
            height: 40,
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
          {/* Nav icon = 24px per Phase 6 spec */}
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
            <line x1="3" y1="12" x2="15" y2="12" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
          </svg>
        </button>

        {/* Center: wordmark — Inter 700, 17px, slight tracking */}
        <Link
          href="/"
          aria-label="LNKICKS home"
          className="pressable mh-wordmark"
          style={{
            fontFamily: theme.fontFamily.body,
            fontSize: theme.fontSize.xl,
            fontWeight: theme.fontWeight.bold,
            letterSpacing: theme.letterSpacing.wide,
            color: theme.colors.textPrimary,
            textDecoration: 'none',
            textAlign: 'center',
            justifySelf: 'center',
            fontFeatureSettings: theme.fontFeatures,
          }}
        >
          LNKICKS
        </Link>

        {/* Right: Profile (Cart icon removed per Phase 5 spec) */}
        <HeaderIconButton href="/profile" label="Profile" badge={0}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
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
        width: 40,
        height: 40,
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
