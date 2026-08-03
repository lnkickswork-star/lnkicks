'use client';

/**
 * DesktopShell — reusable desktop chrome wrapper for all shared pages.
 * ============================================================
 *
 * Problem
 * -------
 * `MobileLayout` returns `<>{children}</>` on desktop — i.e. shared
 * pages render BARE on desktop (no header, no footer, no max-width,
 * no breadcrumbs context). 28 of 33 shared pages are affected.
 *
 * Solution
 * --------
 * `DesktopShell` wraps children in the SAME premium chrome as the
 * approved homepage:
 *   - <AnnouncementBar/>  — black marquee at top
 *   - <MainHeader/>       — sticky 84px header with logo + 9-item nav + icons
 *   - <main>              — children, with optional breadcrumb + maxWidth
 *   - <MainFooter/>       — dark footer with newsletter + link columns
 *
 * It mirrors the exact tokens used by `DesktopHome`:
 *   - maxWidth: 1280px (matches MainFooter + InstantShipGrid)
 *   - paddingLeft/Right: 40px (matches MainHeader/MainFooter)
 *   - paddingTop: 32px, paddingBottom: 96px (comfortable desktop spacing)
 *   - background: #ffffff
 *
 * Optional props
 * --------------
 *   - breadcrumb: array of {label, href?} — renders a hairline breadcrumb
 *     row above the main content (visible on desktop only).
 *   - maxWidth: number — override (default 1280). Use 1600 for wide
 *     catalog pages, 1024 for narrow content pages.
 *   - hideFooter: boolean — for full-bleed pages (e.g. checkout).
 *   - hideAnnouncement: boolean — for transactional pages.
 *
 * Usage
 * -----
 *   <DesktopShell breadcrumb={[{label:'Home',href:'/'},{label:'Cart'}]}>
 *     {children}
 *   </DesktopShell>
 *
 * This shell is intended for desktop ONLY. Mobile users see MobileLayout
 * via the existing UA detection in `MobileLayout.tsx`.
 */

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Lazy-load the heavy chrome components to keep shared page JS small.
// They are client components ('use client') and only needed on desktop.
const AnnouncementBar = dynamic(
  () => import('@/components/desktop/AnnouncementBar').then((m) => m.default),
  { ssr: false },
);
const MainHeader = dynamic(
  () => import('@/components/desktop/MainHeader').then((m) => m.default),
  { ssr: false },
);
const MainFooter = dynamic(
  () => import('@/components/desktop/MainFooter').then((m) => m.default),
  { ssr: false },
);

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DesktopShellProps {
  children: React.ReactNode;
  /** Optional breadcrumb rendered above main content. */
  breadcrumb?: BreadcrumbItem[];
  /** Max content width in pixels. Default 1280. */
  maxWidth?: number;
  /** Hide the dark footer (e.g. /checkout). Default false. */
  hideFooter?: boolean;
  /** Hide the announcement bar (e.g. /checkout, /order-success). Default false. */
  hideAnnouncement?: boolean;
  /** Override the main content padding. Default 32px top / 96px bottom. */
  paddingTop?: number;
  paddingBottom?: number;
}

export function DesktopShell({
  children,
  breadcrumb,
  maxWidth = 1280,
  hideFooter = false,
  hideAnnouncement = false,
  paddingTop = 32,
  paddingBottom = 96,
}: DesktopShellProps) {
  return (
    <div
      style={{
        background: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif',
        color: '#0a0a0a',
        overflowX: 'hidden',
      }}
    >
      {!hideAnnouncement && <AnnouncementBar />}
      <MainHeader />

      <main
        id="main-content"
        style={{
          flex: 1,
          width: '100%',
          maxWidth,
          margin: '0 auto',
          paddingLeft: '40px',
          paddingRight: '40px',
          paddingTop,
          paddingBottom,
          boxSizing: 'border-box',
        }}
      >
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: '#9ca3af',
              marginBottom: '32px',
              paddingBottom: '20px',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            {breadcrumb.map((item, i) => {
              const isLast = i === breadcrumb.length - 1;
              return (
                <React.Fragment key={i}>
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      style={{
                        color: '#9ca3af',
                        textDecoration: 'none',
                        transition: 'color 200ms ease',
                      }}
                      className="lnk-breadcrumb-link"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span style={{ color: isLast ? '#0a0a0a' : '#9ca3af', fontWeight: 700 }}>
                      {item.label}
                    </span>
                  )}
                  {!isLast && (
                    <span style={{ color: '#d1d5db', fontWeight: 400 }}>/</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}
        {children}
      </main>

      {!hideFooter && <MainFooter />}

      <style jsx>{`
        :global(.lnk-breadcrumb-link:hover) {
          color: #0a0a0a !important;
        }
      `}</style>
    </div>
  );
}

export default DesktopShell;
