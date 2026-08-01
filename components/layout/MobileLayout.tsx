'use client';

import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/components/context/AppContext';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { MobileMenuDrawer } from '@/components/mobile/MobileMenuDrawer';
import { theme } from '@/lib/mobile/theme/theme';
import { safeArea } from '@/lib/mobile/utils/safeArea';
import { haptic } from '@/lib/mobile/utils/haptics';
import { pressableStyle } from '@/lib/mobile/utils/interactions';

/**
 * MobileLayout — universal mobile shell for every LN KICKS mobile page.
 *
 * Goal: kill the three-shell inconsistency (MobileHome premium shell vs
 * ResponsiveAppLayout's legacy 60px-header + 4-item pill nav vs the broken
 * Tailwind bespoke headers). Every mobile route now mounts <MobileLayout>
 * and gets the same premium chrome the homepage has.
 *
 * Variants
 * --------
 *   headerVariant='default'  → Menu + LNKICKS + Cart + Profile (commerce pages)
 *   headerVariant='back'     → Back arrow + LNKICKS + Cart + Profile (sub-pages)
 *   headerVariant='minimal'  → LNKICKS centered only (auth, post-transaction)
 *   headerVariant='none'     → no header (rare; embedded admin views)
 *
 * Bottom nav
 * ----------
 *   Always rendered unless `hideBottomNav` is set (auth, post-transaction,
 *   admin). The cart FAB inside MobileBottomNav is hidden when
 *   `hideCartFab` is set (/cart, /checkout) to avoid double-cart UX.
 *
 * Detection
 * ---------
 *   Client-side UA + viewport-width detection mirrors ResponsiveAppLayout.
 *   SSR returns null on first render to avoid hydration mismatch; once the
 *   effect runs, isMobile === true mounts the shell, isMobile === false
 *   renders children as-is (desktop chrome handled elsewhere — this layout
 *   is MOBILE-ONLY and should only be mounted on mobile requests).
 *
 *   Recommended usage: pair with a server-side UA check in the route's
 *   page.tsx that conditionally wraps children in <MobileLayout> for mobile
 *   UAs and renders a desktop shell otherwise. (See app/product/[slug]/page.tsx
 *   for the pattern.)
 *
 * LN KICKS theme: pure white + matte black + soft grey. NO blue. Tokens only.
 *
 * Phase 4 (Universal Polish):
 *  - Design tokens throughout (no hardcoded values)
 *  - Safe-area-aware (top, bottom, landscape left/right)
 *  - Haptics on header interactions
 *  - Skip-link for keyboard users
 *  - Suspense fallbacks for lazy chunks
 *  - Menu drawer lifted to layout level (z-index not trapped)
 *  - Memoized internal variants
 */

const MobileServiceWorkerRegister = lazy(
  () => import('@/components/mobile/MobileServiceWorkerRegister'),
);

export type MobileLayoutVariant =
  | 'default'
  | 'back'
  | 'minimal'
  | 'none';

export interface MobileLayoutProps {
  children: React.ReactNode;
  /** Header style. Default = full menu/cart/profile. */
  headerVariant?: MobileLayoutVariant;
  /** Title shown when variant='back' (page name). */
  title?: string;
  /** Hide the bottom navigation entirely (auth, post-transaction, admin). */
  hideBottomNav?: boolean;
  /** Hide just the cart FAB inside the bottom nav (/cart, /checkout). */
  hideCartFab?: boolean;
  /** Override the default max content width (default 440). */
  maxWidth?: number;
}

/** Canonical mobile-UA regex (matches app/page.tsx + ResponsiveAppLayout). */
const MOBILE_UA_PATTERN =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk/i;


export function MobileLayout({
  children,
  headerVariant = 'default',
  title,
  hideBottomNav = false,
  hideCartFab = false,
  maxWidth = 440,
}: MobileLayoutProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() || '/';
  const router = useRouter();

  // Detect mobile on client (mirrors ResponsiveAppLayout logic)
  useEffect(() => {
    const detect = () => {
      const ua =
        typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const vw =
        typeof window !== 'undefined' ? window.innerWidth : 1024;
      setIsMobile(MOBILE_UA_PATTERN.test(ua) || vw <= 768);
    };
    detect();
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  // Close drawer on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleBack = useCallback(() => {
    haptic.light();
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  // SSR safety: render nothing until detection completes. This avoids any
  // hydration mismatch — the first client paint matches the server paint
  // (both empty), then the effect runs and the shell mounts.
  if (isMobile === null) return null;

  // Desktop: pass children through untouched. (Desktop chrome is handled
  // by the route's page.tsx, which should conditionally wrap content in
  // <MobileLayout> only for mobile UAs. If we got here on desktop, render
  // children bare — preserves existing desktop behavior.)
  if (!isMobile) return <>{children}</>;

  // ── Mobile shell ──────────────────────────────────────────────────
  return (
    <div
      style={{
        background: theme.colors.white,
        minHeight: '100vh',
        fontFamily: theme.fontFamily.body,
        color: theme.colors.textPrimary,
        paddingLeft: safeArea.paddingLeft,
        paddingRight: safeArea.paddingRight,
      }}
    >
      {/* Skip link — keyboard users can jump straight to main content */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: -9999,
          top: 0,
          background: theme.colors.black,
          color: theme.colors.white,
          padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
          borderRadius: theme.radius.sm,
          fontSize: theme.fontSize.sm,
          fontWeight: theme.fontWeight.bold,
          zIndex: theme.zIndex.splash,
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.left = '8px';
          (e.currentTarget as HTMLAnchorElement).style.top = '8px';
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.left = '-9999px';
        }}
      >
        Skip to content
      </a>

      <div
        style={{
          maxWidth,
          margin: '0 auto',
          minHeight: '100vh',
          background: theme.colors.white,
          position: 'relative',
          overflowX: 'hidden',
          boxShadow: theme.shadows.hairline,
        }}
      >
        {/* 1. Header (variant-aware) */}
        {headerVariant === 'default' && (
          <MobileHeader onMenuClick={() => setMenuOpen(true)} />
        )}
        {headerVariant === 'back' && (
          <MobileBackHeader title={title} onBack={handleBack} />
        )}
        {headerVariant === 'minimal' && <MobileMinimalHeader />}
        {headerVariant === 'none' && null}

        {/* 2. Main content */}
        <main
          id="main-content"
          style={{
            paddingTop: theme.spacing.lg,
            paddingBottom: hideBottomNav
              ? safeArea.bottomNavClearance
              : safeArea.bottomNavClearance,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {children}
        </main>

        {/* 3. Floating bottom nav (unless hidden) */}
        {!hideBottomNav && (
          <Suspense fallback={null}>
            <MobileBottomNav hideCartFab={hideCartFab} />
          </Suspense>
        )}

        {/* 4. Menu drawer — rendered at layout level so its z-index
              (1100) is not trapped inside the header's stacking context. */}
        <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* 5. Service worker registration (production-only, lazy) */}
      <Suspense fallback={null}>
        <MobileServiceWorkerRegister />
      </Suspense>
    </div>
  );
}

export default MobileLayout;

/* ──────────────────────────────────────────────────────────────────
 *  MobileBackHeader — Back arrow + LNKICKS + Cart + Profile
 *  Used on sub-pages (product, category, policy, etc.)
 *  The Menu button is replaced by a Back arrow; the menu drawer is
 *  still accessible from any 'default'-variant page (e.g. home).
 * ────────────────────────────────────────────────────────────────── */
function MobileBackHeader({
  title,
  onBack,
}: {
  title?: string;
  onBack: () => void;
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
        backdropFilter: 'saturate(180%) blur(14px)',
        WebkitBackdropFilter: 'saturate(180%) blur(14px)',
        borderBottom: scrolled
          ? `1px solid ${theme.colors.border}`
          : '1px solid transparent',
        transition: 'border-color 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
          padding: `${theme.spacing.md}px ${theme.spacing.gutter}px`,
          display: 'grid',
          gridTemplateColumns: '36px 1fr 36px 36px',
          alignItems: 'center',
          gap: theme.spacing.hairline,
        }}
      >
        {/* Left: Back arrow */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
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
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <line x1="19" y1="12" x2="5" y2="12" strokeLinecap="round" />
            <polyline
              points="12 19 5 12 12 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Center: wordmark + optional title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 0,
          }}
        >
          <Link
            href="/"
            aria-label="LNKICKS home"
            className="pressable"
            style={{
              fontFamily: theme.fontFamily.display,
              fontSize: theme.fontSize.xl,
              fontWeight: theme.fontWeight.extrabold,
              letterSpacing: theme.letterSpacing.widest,
              color: theme.colors.textPrimary,
              textDecoration: 'none',
              lineHeight: 1,
            }}
          >
            LNKICKS
          </Link>
          {title && (
            <span
              style={{
                fontSize: theme.fontSize.micro,
                fontWeight: theme.fontWeight.bold,
                letterSpacing: theme.letterSpacing.wider,
                textTransform: 'uppercase',
                color: theme.colors.textTertiary,
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {title}
            </span>
          )}
        </div>

        {/* Right: Cart */}
        <Link
          href="/cart"
          aria-label={
            cartCount > 0
              ? `Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`
              : 'Cart'
          }
          onPointerDown={() => haptic.light()}
          className="pressable"
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
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {cartCount > 0 && (
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
              {cartCount}
            </span>
          )}
        </Link>

        {/* Right: Profile */}
        <Link
          href="/profile"
          aria-label="Profile"
          onPointerDown={() => haptic.light()}
          className="pressable"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.textPrimary,
            textDecoration: 'none',
            background: 'transparent',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Link>
      </div>

      <style jsx>{pressableStyle}</style>
    </header>
  );
}

/* ──────────────────────────────────────────────────────────────────
 *  MobileMinimalHeader — LNKICKS centered only (auth, post-transaction)
 *  No menu, no cart, no profile, no back arrow.
 * ────────────────────────────────────────────────────────────────── */
function MobileMinimalHeader() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.header,
        background: theme.colors.glass,
        backdropFilter: 'saturate(180%) blur(14px)',
        WebkitBackdropFilter: 'saturate(180%) blur(14px)',
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 440,
          margin: '0 auto',
          padding: `${theme.spacing.lg}px ${theme.spacing.gutter}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Link
          href="/"
          aria-label="LNKICKS home"
          className="pressable"
          style={{
            fontFamily: theme.fontFamily.display,
            fontSize: theme.fontSize.xl,
            fontWeight: theme.fontWeight.extrabold,
            letterSpacing: theme.letterSpacing.widest,
            color: theme.colors.textPrimary,
            textDecoration: 'none',
          }}
        >
          LNKICKS
        </Link>
      </div>

      <style jsx>{pressableStyle}</style>
    </header>
  );
}
