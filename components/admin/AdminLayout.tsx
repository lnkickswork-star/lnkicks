/**
 * AdminLayout — enterprise shell that wraps every admin page.
 *
 * Composition:
 *  <AdminLayout title="Dashboard" subtitle="...">
 *    {children}
 *  </AdminLayout>
 *
 * Responsibilities:
 *  - Auth guard (redirects to /admin-login if no session)
 *  - RBAC route guard (per-route permission requirement)
 *  - Theme provider (dark/light/system) via useAdminTheme
 *  - Sidebar + Topbar + content area
 *  - Mobile drawer state
 *  - Background + base typography
 *  - GlobalAdminStyles mounted ONCE (keyframes, focus-visible, scrollbar)
 *  - SkipLink + LiveRegionProvider for WCAG AA+ accessibility
 *
 * This replaces the old MobileLayout-based admin pages with a
 * proper desktop-first enterprise shell that is also responsive
 * on mobile (drawer nav).
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminSession, Permission } from '@/lib/admin/types';
import { getCurrentSession } from '@/lib/admin/adminAuth';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { ToastProvider } from './ui';
import { GlobalAdminStyles } from './system/GlobalAdminStyles';
import { SkipLink, LiveRegionProvider } from './system/Accessibility';

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Optional permission required to view this route.
   *  If user lacks it, a "no access" screen is shown. */
  requirePermission?: Permission;
  breadcrumb?: { label: string; href?: string }[];
}

export function AdminLayout({ title, subtitle, children, requirePermission, breadcrumb }: Props) {
  const router = useRouter();
  const { tokens, mode: themeMode, toggle, setMode } = useAdminTheme();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Auth guard — runs client-side after hydration
  useEffect(() => {
    const s = getCurrentSession();
    if (!s) {
      router.replace('/admin-login');
      return;
    }
    setSession(s);
    setReady(true);
  }, [router]);

  // Re-check session on route change (catches logout)
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      const s = getCurrentSession();
      if (!s) {
        router.replace('/admin-login');
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [ready, router]);

  // Close mobile nav on Escape (extra keyboard escape hatch)
  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileNavOpen]);

  // Cycle theme: light → dark → system → light
  function cycleTheme() {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const idx = order.indexOf(themeMode);
    setMode(order[(idx + 1) % order.length]);
  }

  // Loading state — polished spinner, not just text
  if (!ready || !session) {
    return (
      <>
        <GlobalAdminStyles tokens={tokens} />
        <div style={{
          minHeight: '100vh',
          background: tokens.bg.app,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 16, color: tokens.text.secondary,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: tokens.text.primary, color: tokens.bg.app,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 16, letterSpacing: '-0.05em',
          }}>L</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: 'admin-spin 0.7s linear infinite', color: tokens.text.secondary }}>
              <path d="M21 12a9 9 0 11-6.2-8.5" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Loading admin…</span>
          </div>
        </div>
      </>
    );
  }

  // RBAC guard
  const hasAccess = !requirePermission || (session.role && requirePermission);

  return (
    <LiveRegionProvider>
      <ToastProvider tokens={tokens}>
        <GlobalAdminStyles tokens={tokens} />
        <SkipLink tokens={tokens} target="main-content" />

        <div style={{
          display: 'flex',
          minHeight: '100vh',
          background: tokens.bg.app,
          color: tokens.text.primary,
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          <AdminSidebar
            tokens={tokens}
            role={session.role}
            collapsed={false}
            mobileOpen={mobileNavOpen}
            onCloseMobile={() => setMobileNavOpen(false)}
          />

          <div style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}>
            <AdminTopbar
              tokens={tokens}
              themeMode={themeMode}
              onToggleTheme={toggle}
              onCycleTheme={cycleTheme}
              session={session}
              title={title}
              subtitle={subtitle}
              onOpenMobileNav={() => setMobileNavOpen(true)}
              breadcrumb={breadcrumb}
            />

            <main
              id="main-content"
              tabIndex={-1}
              style={{
                flex: 1,
                padding: '24px clamp(16px, 3vw, 32px)',
                maxWidth: 1600,
                width: '100%',
                margin: '0 auto',
                outline: 'none',
              }}
            >
              {hasAccess ? (
                children
              ) : (
                /* RBAC no-access state — polished, accessible, action-oriented */
                <div role="alert" style={{
                  background: tokens.bg.surface,
                  border: `1px solid ${tokens.border.subtle}`,
                  borderRadius: 14,
                  padding: '48px 40px',
                  textAlign: 'center',
                  maxWidth: 480, margin: '64px auto',
                  boxShadow: tokens.shadow.sm,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: tokens.status.errorBg,
                    color: tokens.status.error,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M4.93 4.93l14.14 14.14" />
                    </svg>
                  </div>
                  <h2 style={{
                    fontSize: 18, fontWeight: 700, margin: '0 0 8px',
                    color: tokens.text.primary, fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em',
                  }}>
                    Access Restricted
                  </h2>
                  <p style={{
                    fontSize: 13, color: tokens.text.secondary, lineHeight: 1.6,
                    margin: '0 0 24px', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto',
                  }}>
                    Your role{' '}
                    <strong style={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: tokens.bg.surfaceAlt,
                      color: tokens.text.primary,
                      fontWeight: 700,
                    }}>{session.role}</strong>
                    {' '}does not have permission to view this page. Contact your administrator if
                    you believe this is an error.
                  </p>
                  <button
                    onClick={() => router.push('/dashboard')}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 9,
                      background: tokens.text.primary, color: tokens.bg.app,
                      border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 600,
                      fontFamily: 'Inter, sans-serif',
                      transition: 'opacity 140ms ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    Return to Dashboard
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </ToastProvider>
    </LiveRegionProvider>
  );
}
