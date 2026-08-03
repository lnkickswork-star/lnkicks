/**
 * AdminSidebar — premium enterprise navigation.
 *
 * Features:
 *  - Searchable (filter items by typing)
 *  - Collapsible to icon rail (preference persisted)
 *  - Recent pages (auto-tracked via localStorage)
 *  - Favorites (star toggle on hover)
 *  - Keyboard shortcuts (Cmd/Ctrl+B to toggle, Cmd+K for command palette)
 *  - Grouped sections with role-aware visibility
 *  - Active page highlight with left accent bar
 *  - Badge counts on items (orders pending, stock alerts, reviews pending)
 *  - Mobile: off-canvas drawer with overlay
 *  - Smooth collapse animation
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import type { AdminThemeTokens, AdminRole, Permission } from '@/lib/admin/types';
import { can } from '@/lib/admin/types';
import { SearchInput, Badge } from './ui';

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string | number;
  badgeTone?: 'info' | 'warning' | 'critical' | 'success';
  permission?: Permission;
  shortcut?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: 'grid', permission: 'dashboard.view', shortcut: 'G D' },
      { href: '/reports-analytics', label: 'Reports & Analytics', icon: 'chart', permission: 'report.view', shortcut: 'G R' },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { href: '/products-management', label: 'Products', icon: 'box', permission: 'product.edit', shortcut: 'G P' },
      { href: '/add-product', label: 'Add Product', icon: 'plus-circle', permission: 'product.create', shortcut: 'N P' },
      { href: '/flash-sale-settings', label: 'Flash Sale', icon: 'flame', permission: 'product.edit' },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { href: '/admin/compliance', label: 'Compliance Center', icon: 'shield', permission: 'product.publish', shortcut: 'G B' },
    ],
  },
  {
    title: 'Sales',
    items: [
      { href: '/orders-management', label: 'Orders', icon: 'cart', badge: '87', badgeTone: 'warning', permission: 'order.view', shortcut: 'G O' },
      { href: '/track-order', label: 'Track Order', icon: 'truck', permission: 'order.view' },
      { href: '/customers-management', label: 'Customers', icon: 'users', permission: 'customer.view', shortcut: 'G C' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { href: '/admin/marketing', label: 'Marketing Home', icon: 'megaphone', permission: 'banner.manage' },
      { href: '/admin/marketing/email', label: 'Email Marketing', icon: 'mail', permission: 'banner.manage' },
      { href: '/admin/marketing/whatsapp', label: 'WhatsApp Marketing', icon: 'message', permission: 'banner.manage' },
      { href: '/admin/banners', label: 'Banners', icon: 'image', permission: 'banner.manage' },
      { href: '/admin/coupons', label: 'Coupons', icon: 'ticket', permission: 'coupon.create' },
      { href: '/admin/seo', label: 'SEO Center', icon: 'search', permission: 'seo.manage', shortcut: 'G S' },
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
      { href: '/settings-panel', label: 'Settings', icon: 'settings', permission: 'settings.manage', shortcut: 'G ,' },
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
  megaphone: 'M3 11l14-7v16L3 13v-2zM3 11H1v2h2M17 6h4v12h-4M21 9v6',
  mail: 'M3 7h18v12H3zM3 7l9 7 9-7',
  message: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
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

const RECENT_KEY = 'lnk_admin_recent_pages';
const FAV_KEY = 'lnk_admin_favorites';

export function AdminSidebar({ tokens, role, collapsed, mobileOpen, onCloseMobile }: Props) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recent, setRecent] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  // Load persisted state
  useEffect(() => {
    try {
      const c = localStorage.getItem('lnk_admin_sidebar_collapsed');
      if (c !== null) setInternalCollapsed(c === 'true');
      const f = localStorage.getItem(FAV_KEY);
      if (f) setFavorites(new Set(JSON.parse(f)));
      const r = localStorage.getItem(RECENT_KEY);
      if (r) setRecent(JSON.parse(r));
    } catch { /* noop */ }
  }, []);

  // Persist collapse
  useEffect(() => {
    try { localStorage.setItem('lnk_admin_sidebar_collapsed', String(internalCollapsed)); } catch { /* noop */ }
  }, [internalCollapsed]);

  // Track recent pages
  useEffect(() => {
    if (!pathname) return;
    setRecent(prev => {
      const next = [pathname, ...prev.filter(p => p !== pathname)].slice(0, 5);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, [pathname]);

  // Persist favorites
  useEffect(() => {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favorites))); } catch { /* noop */ }
  }, [favorites]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Cmd/Ctrl+B → toggle collapse (desktop)
      if ((e.metaKey || e.ctrlKey) && e.key === 'b' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setInternalCollapsed(v => !v);
      }
      // Cmd/Ctrl+/ → focus sidebar search
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const isCollapsed = internalCollapsed && !mobileOpen;

  function isActive(href: string): boolean {
    if (href === '/dashboard') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }

  function toggleFavorite(href: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href); else next.add(href);
      return next;
    });
  }

  // Build filtered list
  const allItems = useMemo(() => SECTIONS.flatMap(s => s.items), []);
  const favoriteItems = useMemo(() => allItems.filter(i => favorites.has(i.href)), [allItems, favorites]);
  const recentItems = useMemo(() =>
    recent.map(href => allItems.find(i => i.href === href)).filter(Boolean) as typeof allItems,
    [recent, allItems]);

  const filteredSections = useMemo(() => {
    if (!query.trim()) return SECTIONS;
    const q = query.toLowerCase();
    return SECTIONS.map(s => ({
      ...s,
      items: s.items.filter(i =>
        i.label.toLowerCase().includes(q) || i.href.toLowerCase().includes(q)
      ),
    })).filter(s => s.items.length > 0);
  }, [query]);

  // Reset focus when query changes
  useEffect(() => { /* placeholder for future focus management */ }, [query]);

  const badgeColors = (tone?: string) => {
    switch (tone) {
      case 'warning': return { bg: tokens.status.warningBg, fg: tokens.status.warning };
      case 'critical': return { bg: tokens.status.errorBg, fg: tokens.status.error };
      case 'success': return { bg: tokens.status.successBg, fg: tokens.status.success };
      default: return { bg: tokens.status.infoBg, fg: tokens.status.info };
    }
  };

  function renderItem(item: NavItem, withStar = true) {
    const active = isActive(item.href);
    const isFav = favorites.has(item.href);
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
        className="nav-item"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: isCollapsed ? '9px 0' : '7px 10px',
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
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = tokens.bg.hover; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
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
              <Badge tokens={tokens} tone={item.badgeTone ?? 'info'} size="sm">{item.badge}</Badge>
            )}
            {withStar && (
              <button
                onClick={(e) => toggleFavorite(item.href, e)}
                aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: isFav ? tokens.status.warning : tokens.text.tertiary,
                  padding: 0, display: 'flex',
                  opacity: isFav ? 1 : 0,
                  transition: 'opacity 140ms ease',
                }}
                className="nav-star"
              >
                <svg width={12} height={12} viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
                </svg>
              </button>
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
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0,
            background: tokens.bg.overlay,
            zIndex: 100,
            backdropFilter: 'blur(2px)',
            animation: 'admin-fade-in 160ms ease',
          }}
        />
      )}

      <aside
        className="admin-sidebar"
        data-collapsed={isCollapsed}
        data-mobile-open={mobileOpen}
        style={{
          width: isCollapsed ? 72 : 256,
          background: tokens.bg.sidebar,
          borderRight: `1px solid ${tokens.border.subtle}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 200ms cubic-bezier(0.16,1,0.3,1), transform 220ms cubic-bezier(0.16,1,0.3,1)',
          zIndex: 110,
          flexShrink: 0,
          overflow: 'hidden',
          position: mobileOpen ? 'fixed' : 'sticky',
          left: mobileOpen ? 0 : 'auto',
          top: mobileOpen ? 0 : 'auto',
          height: '100vh',
          boxShadow: mobileOpen ? tokens.shadow.lg : 'none',
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '16px 16px',
            borderBottom: `1px solid ${tokens.border.subtle}`,
            minHeight: 64,
            flexShrink: 0,
          }}
        >
          <Link href="/dashboard" aria-label="Dashboard home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: 9,
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
          </Link>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div style={{ padding: '12px 14px 8px', flexShrink: 0 }}>
            <SearchInput
              tokens={tokens}
              value={query}
              onChange={setQuery}
              placeholder="Search menu…  ⌘/"
              style={{ width: '100%' }}
            />
          </div>
        )}

        {/* Nav */}
        <nav
          aria-label="Admin navigation"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '8px 8px 12px',
            scrollbarWidth: 'thin',
          }}
          className="admin-nav-scroll"
        >
          {/* Favorites */}
          {!isCollapsed && !query && favoriteItems.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
                textTransform: 'uppercase', letterSpacing: 1.2,
                padding: '4px 10px 6px',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <svg width={9} height={9} viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" /></svg>
                Favorites
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {favoriteItems.map(item => renderItem(item))}
              </div>
            </div>
          )}

          {/* Recent */}
          {!isCollapsed && !query && recentItems.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
                textTransform: 'uppercase', letterSpacing: 1.2,
                padding: '4px 10px 6px',
              }}>
                Recent
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentItems.map(item => renderItem(item, false))}
              </div>
            </div>
          )}

          {/* Sections */}
          {filteredSections.map(section => {
            const visibleItems = section.items.filter(item => !item.permission || can(role, item.permission));
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.title} style={{ marginBottom: 14 }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {visibleItems.map(item => renderItem(item))}
                </div>
              </div>
            );
          })}

          {/* No results */}
          {!isCollapsed && query && filteredSections.length === 0 && (
            <div style={{ padding: 16, textAlign: 'center', fontSize: 12, color: tokens.text.tertiary }}>
              No matches for &ldquo;{query}&rdquo;
            </div>
          )}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setInternalCollapsed(v => !v)}
          aria-label={internalCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={`${internalCollapsed ? 'Expand' : 'Collapse'} (Ctrl+B)`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8,
            padding: '12px',
            background: 'transparent',
            border: 'none',
            borderTop: `1px solid ${tokens.border.subtle}`,
            color: tokens.text.secondary,
            cursor: 'pointer',
            fontSize: 11, fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
          }}
          className="admin-collapse-toggle"
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: internalCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {!internalCollapsed && <span>Collapse</span>}
        </button>
      </aside>

      <style jsx>{`
        .nav-item:hover .nav-star { opacity: 1 !important; }
      `}</style>
      <style jsx global>{`
        .admin-nav-scroll::-webkit-scrollbar { width: 6px; }
        .admin-nav-scroll::-webkit-scrollbar-track { background: transparent; }
        .admin-nav-scroll::-webkit-scrollbar-thumb { background: ${tokens.border.subtle}; border-radius: 3px; }
        .admin-nav-scroll::-webkit-scrollbar-thumb:hover { background: ${tokens.border.strong}; }
        @keyframes admin-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 1023px) {
          .admin-sidebar[data-mobile-open="false"] {
            position: fixed !important;
            left: 0; top: 0;
            height: 100vh;
            transform: translateX(-100%);
            box-shadow: ${tokens.shadow.lg};
          }
          .admin-sidebar[data-mobile-open="true"] {
            position: fixed !important;
            left: 0; top: 0;
            height: 100vh;
            transform: translateX(0);
            box-shadow: ${tokens.shadow.lg};
          }
          .admin-collapse-toggle { display: none !important; }
        }
      `}</style>
    </>
  );
}
