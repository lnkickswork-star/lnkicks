/**
 * AdminSidebar — collapsible enterprise navigation.
 *
 * Structure:
 *  - Logo / brand block (LNKICKS / ADMIN)
 *  - Nav sections grouped by domain (Overview / Catalog / Sales / Customers / Marketing / Insights / System)
 *  - Each item has icon + label + optional badge (counts)
 *  - Collapsible to icon-only rail (72px) — preference persisted
 *  - Mobile: off-canvas drawer triggered from topbar
 *
 * Role-aware: items requiring permissions the user lacks are hidden.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { AdminThemeTokens, AdminRole, Permission } from '@/lib/admin/types';
import { can } from '@/lib/admin/types';

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string | number;
  badgeTone?: 'info' | 'warning' | 'critical' | 'success';
  permission?: Permission;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: 'grid', permission: 'dashboard.view' },
      { href: '/reports-analytics', label: 'Reports & Analytics', icon: 'chart', permission: 'report.view' },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { href: '/products-management', label: 'Products', icon: 'box', permission: 'product.edit' },
      { href: '/add-product', label: 'Add Product', icon: 'plus-circle', permission: 'product.create' },
      { href: '/flash-sale-settings', label: 'Flash Sale', icon: 'flame', permission: 'product.edit' },
    ],
  },
  {
    title: 'Sales',
    items: [
      { href: '/orders-management', label: 'Orders', icon: 'cart', badge: '87', badgeTone: 'warning', permission: 'order.view' },
      { href: '/track-order', label: 'Track Order', icon: 'truck', permission: 'order.view' },
      { href: '/customers-management', label: 'Customers', icon: 'users', permission: 'customer.view' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { href: '/admin/banners', label: 'Banners', icon: 'image', permission: 'banner.manage' },
      { href: '/admin/coupons', label: 'Coupons', icon: 'ticket', permission: 'coupon.create' },
      { href: '/admin/seo', label: 'SEO Center', icon: 'search', permission: 'seo.manage' },
      { href: '/admin/reviews', label: 'Reviews', icon: 'star', badge: '12', badgeTone: 'info', permission: 'review.moderate' },
      { href: '/admin/notifications', label: 'Notifications', icon: 'bell', permission: 'notification.send' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { href: '/admin/inventory', label: 'Inventory', icon: 'layers', badge: '5', badgeTone: 'critical', permission: 'inventory.manage' },
      { href: '/admin/wallet', label: 'Wallet', icon: 'wallet', permission: 'wallet.credit' },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/settings-panel', label: 'Settings', icon: 'settings', permission: 'settings.manage' },
      { href: '/admin/audit', label: 'Audit Log', icon: 'shield', permission: 'audit.view' },
    ],
  },
];

const ICON_PATHS: Record<string, string> = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  chart: 'M3 21V8M9 21V3M15 21v-9M21 21V11',
  box: 'M21 16V8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  'plus-circle': 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8v8M8 12h8',
  flame: 'M12 3s4 4 4 8a4 4 0 11-8 0c0-1 .5-2 .5-2S8 11 8 13M12 3c0 4 4 5 4 9a4 4 0 11-8 0c0-2 1-3 1-3',
  cart: 'M3 4h2l2.5 11h10l2-7H6M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z',
  truck: 'M3 6h11v9H3zM14 9h4l3 3v3h-7M7 18a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z',
  users: 'M9 11a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0M17 11a4 4 0 100-8M21 20a7 7 0 00-5-6.7',
  image: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M9 9a1 1 0 100-2 1 1 0 000 2z',
  ticket: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8z',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5',
  star: 'M12 3l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',
  bell: 'M18 16v-5a6 6 0 10-12 0v5l-2 2h16zM10 20a2 2 0 004 0',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  wallet: 'M3 7h15v12H3zM3 7l3-4h12l3 4M16 13h.01',
  settings: 'M12 8a4 4 0 100 8 4 4 0 000-8zM19 12a7 7 0 00-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 00-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 00-1.7 1l-2.4-1-2 3.5 2 1.5a7 7 0 000 2l-2 1.5 2 3.5 2.4-1a7 7 0 001.7 1l.4 2.5h4l.4-2.5a7 7 0 001.7-1l2.4 1 2-3.5-2-1.5a7 7 0 00.1-1z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
};

function Icon({ name, color, size = 18 }: { name: string; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON_PATHS[name] ?? ICON_PATHS.grid} />
    </svg>
  );
}

interface Props {
  tokens: AdminThemeTokens;
  role: AdminRole;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({ tokens, role, collapsed, mobileOpen, onCloseMobile }: Props) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed);

  // Persist collapse preference
  useEffect(() => {
    try {
      localStorage.setItem('lnk_admin_sidebar_collapsed', String(internalCollapsed));
    } catch { /* noop */ }
  }, [internalCollapsed]);

  useEffect(() => {
    const stored = localStorage.getItem('lnk_admin_sidebar_collapsed');
    if (stored !== null) setInternalCollapsed(stored === 'true');
  }, []);

  const isCollapsed = internalCollapsed && !mobileOpen;

  function isActive(href: string): boolean {
    if (href === '/dashboard') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }

  const badgeColors = (tone?: string) => {
    switch (tone) {
      case 'warning': return { bg: tokens.status.warningBg, fg: tokens.status.warning };
      case 'critical': return { bg: tokens.status.errorBg, fg: tokens.status.error };
      case 'success': return { bg: tokens.status.successBg, fg: tokens.status.success };
      default: return { bg: tokens.status.infoBg, fg: tokens.status.info };
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed', inset: 0,
            background: tokens.bg.overlay,
            zIndex: 100,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <aside
        style={{
          width: isCollapsed ? 72 : 248,
          background: tokens.bg.sidebar,
          borderRight: `1px solid ${tokens.border.subtle}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 200ms cubic-bezier(0.16,1,0.3,1)',
          zIndex: 110,
          flexShrink: 0,
          overflow: 'hidden',
          ...(mobileOpen
            ? {
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100vh',
                boxShadow: tokens.shadow.lg,
              }
            : {
                position: 'sticky',
                top: 0,
                height: '100vh',
              }),
        }}
        className="admin-sidebar"
      >
        {/* Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '20px 18px',
            borderBottom: `1px solid ${tokens.border.subtle}`,
            minHeight: 64,
          }}
        >
          <div
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: tokens.text.primary,
              color: tokens.bg.app,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 14, fontFamily: 'Inter, sans-serif',
              flexShrink: 0,
              letterSpacing: '-0.05em',
            }}
          >
            L
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontSize: 14, fontWeight: 800, color: tokens.text.primary,
                fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                LNKICKS
              </div>
              <div style={{
                fontSize: 10, fontWeight: 600, color: tokens.text.tertiary,
                letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3,
              }}>
                Admin Suite
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav
          aria-label="Admin navigation"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '12px 8px',
            scrollbarWidth: 'thin',
          }}
        >
          {SECTIONS.map(section => {
            const visibleItems = section.items.filter(item => !item.permission || can(role, item.permission));
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.title} style={{ marginBottom: 18 }}>
                {!isCollapsed && (
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
                    textTransform: 'uppercase', letterSpacing: 1.2,
                    padding: '4px 10px 6px',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {section.title}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {visibleItems.map(item => {
                    const active = isActive(item.href);
                    const bc = badgeColors(item.badgeTone);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                            onCloseMobile();
                          }
                        }}
                        title={isCollapsed ? item.label : undefined}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: isCollapsed ? '9px 0' : '8px 10px',
                          justifyContent: isCollapsed ? 'center' : 'flex-start',
                          borderRadius: 8,
                          background: active ? tokens.bg.hover : 'transparent',
                          color: active ? tokens.text.primary : tokens.text.secondary,
                          textDecoration: 'none',
                          fontWeight: active ? 600 : 500,
                          fontSize: 13,
                          fontFamily: 'Inter, system-ui, sans-serif',
                          transition: 'background 120ms ease, color 120ms ease',
                          position: 'relative',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                          if (!active) e.currentTarget.style.background = tokens.bg.hover;
                        }}
                        onMouseLeave={(e) => {
                          if (!active) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {active && !isCollapsed && (
                          <span style={{
                            position: 'absolute', left: 0, top: '50%',
                            transform: 'translateY(-50%)',
                            width: 3, height: 18, borderRadius: 2,
                            background: tokens.text.primary,
                          }} />
                        )}
                        <Icon name={item.icon} color={active ? tokens.text.primary : tokens.text.secondary} size={18} />
                        {!isCollapsed && (
                          <>
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.label}
                            </span>
                            {item.badge && (
                              <span style={{
                                fontSize: 10, fontWeight: 700,
                                background: bc.bg, color: bc.fg,
                                padding: '1px 6px', borderRadius: 6,
                                minWidth: 18, textAlign: 'center',
                              }}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                        {item.badge && isCollapsed && (
                          <span style={{
                            position: 'absolute', top: 4, right: 4,
                            width: 6, height: 6, borderRadius: '50%',
                            background: bc.fg,
                          }} />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setInternalCollapsed(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8,
            padding: '12px',
            background: 'transparent',
            border: 'none',
            borderTop: `1px solid ${tokens.border.subtle}`,
            color: tokens.text.secondary,
            cursor: 'pointer',
            fontSize: 12, fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
          }}
          className="admin-collapse-toggle"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {!isCollapsed && <span>Collapse</span>}
        </button>

        <style jsx>{`
          @media (max-width: 1023px) {
            :global(.admin-sidebar) {
              position: fixed !important;
              left: 0;
              top: 0;
              height: 100vh;
              transform: translateX(${mobileOpen ? '0' : '-100%'});
              transition: transform 220ms cubic-bezier(0.16,1,0.3,1);
              box-shadow: ${tokens.shadow.lg};
            }
            :global(.admin-collapse-toggle) {
              display: none !important;
            }
          }
        `}</style>
      </aside>
    </>
  );
}
