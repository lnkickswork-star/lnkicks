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

  // Cycle theme: light → dark → system → light
  function cycleTheme() {
    const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const idx = order.indexOf(themeMode);
    setMode(order[(idx + 1) % order.length]);
  }

  if (!ready || !session) {
    return (
      <div style={{
        minHeight: '100vh',
        background: tokens.bg.app,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: tokens.text.secondary, fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 13,
      }}>
        Loading admin…
      </div>
    );
  }

  // RBAC guard
  const hasAccess = !requirePermission || (session.role && requirePermission);

  return (
    <ToastProvider tokens={tokens}>
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

          <main style={{
            flex: 1,
            padding: '24px clamp(16px, 3vw, 32px)',
            maxWidth: 1600,
            width: '100%',
            margin: '0 auto',
          }}>
            {hasAccess ? (
              children
            ) : (
              <div style={{
                background: tokens.bg.surface,
                border: `1px solid ${tokens.border.subtle}`,
                borderRadius: 14,
                padding: 48,
                textAlign: 'center',
                maxWidth: 480, margin: '64px auto',
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🚫</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: tokens.text.primary }}>
                  Access Restricted
                </h2>
                <p style={{ fontSize: 13, color: tokens.text.secondary, lineHeight: 1.6 }}>
                  Your role <strong style={{ textTransform: 'uppercase' }}>{session.role}</strong> does
                  not have permission to view this page. Contact your administrator if you believe this
                  is an error.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
