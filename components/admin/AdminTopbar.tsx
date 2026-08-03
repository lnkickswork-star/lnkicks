/**
 * AdminTopbar — premium sticky top bar.
 *
 * Features:
 *  - Mobile menu trigger (hamburger)
 *  - Breadcrumb (auto-derived from pathname or via prop)
 *  - Live IST clock with date
 *  - Global search / command palette trigger (⌘K)
 *  - Quick Create dropdown (+ icon → Add Product / Add Coupon / Add Banner)
 *  - Theme cycle (light → dark → system)
 *  - Notifications dropdown with unread badge + filter tabs
 *  - Profile menu with role chip, 2FA status, account settings, audit log, logout
 *  - Sticky while scrolling, blur backdrop
 *  - Command palette modal (⌘K)
 */

'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import type { AdminThemeTokens, AdminSession, AdminNotification } from '@/lib/admin/types';
import { logout } from '@/lib/admin/adminAuth';
import { getAdminNotifications } from '@/lib/admin/adminData';
import type { AdminThemeMode } from '@/lib/admin/types';
import {
  Dropdown, MenuItem, MenuDivider, Badge, IconButton,
} from './ui';
import { PlusIcon, SearchIcon, ChevronDown } from './ui';

interface Props {
  tokens: AdminThemeTokens;
  themeMode: AdminThemeMode;
  onToggleTheme: () => void;
  onCycleTheme: () => void;
  session: AdminSession;
  title: string;
  subtitle?: string;
  onOpenMobileNav: () => void;
  breadcrumb?: { label: string; href?: string }[];
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const NOTIF_TYPE_META: Record<string, { icon: string; color: string }> = {
  order: { icon: '🛒', color: 'info' },
  stock: { icon: '📦', color: 'critical' },
  review: { icon: '⭐', color: 'info' },
  customer: { icon: '👤', color: 'warning' },
  system: { icon: '⚙️', color: 'neutral' },
  security: { icon: '🔐', color: 'warning' },
  marketing: { icon: '📣', color: 'purple' },
};

const QUICK_CREATE_ITEMS = [
  { label: 'New Product', href: '/add-product', shortcut: 'N P' },
  { label: 'New Coupon', href: '/admin/coupons?action=new', shortcut: 'N C' },
  { label: 'New Banner', href: '/admin/banners?action=new', shortcut: 'N B' },
  { label: 'New Customer Note', href: '/customers-management', shortcut: 'N N' },
];

// Command palette navigation entries
const COMMAND_ENTRIES: { label: string; href: string; group: string; keywords: string }[] = [
  { label: 'Dashboard', href: '/dashboard', group: 'Navigate', keywords: 'home overview analytics' },
  { label: 'Products', href: '/products-management', group: 'Navigate', keywords: 'catalog inventory skus' },
  { label: 'Add Product', href: '/add-product', group: 'Create', keywords: 'new product create' },
  { label: 'Orders', href: '/orders-management', group: 'Navigate', keywords: 'sales fulfillment' },
  { label: 'Track Order', href: '/track-order', group: 'Navigate', keywords: 'tracking shipment courier' },
  { label: 'Customers', href: '/customers-management', group: 'Navigate', keywords: 'crm users buyers' },
  { label: 'Reports & Analytics', href: '/reports-analytics', group: 'Navigate', keywords: 'charts metrics kpi' },
  { label: 'Banners', href: '/admin/banners', group: 'Marketing', keywords: 'hero carousel slides' },
  { label: 'Coupons', href: '/admin/coupons', group: 'Marketing', keywords: 'discount promo code' },
  { label: 'SEO Center', href: '/admin/seo', group: 'Marketing', keywords: 'search meta schema sitemap' },
  { label: 'Reviews', href: '/admin/reviews', group: 'Moderate', keywords: 'feedback ratings comments' },
  { label: 'Notifications', href: '/admin/notifications', group: 'System', keywords: 'alerts push email sms' },
  { label: 'Inventory', href: '/admin/inventory', group: 'Insights', keywords: 'stock warehouse sku' },
  { label: 'Wallet', href: '/admin/wallet', group: 'Insights', keywords: 'credits refunds bonus' },
  { label: 'Settings', href: '/settings-panel', group: 'System', keywords: 'configuration preferences' },
  { label: 'Audit Log', href: '/admin/audit', group: 'System', keywords: 'security logs activity' },
  { label: 'Flash Sale Settings', href: '/flash-sale-settings', group: 'Marketing', keywords: 'sale discount timer' },
  { label: 'Notification Settings', href: '/notification-settings', group: 'System', keywords: 'email sms push' },
];

export function AdminTopbar({
  tokens, themeMode, onCycleTheme, session, title, onOpenMobileNav, breadcrumb: breadcrumbProp,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [clock, setClock] = useState({ time: '', date: '' });
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock({
        time: now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true,
        }),
        date: now.toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short',
        }),
      });
    };
    tick();
    const i = setInterval(tick, 30_000);
    return () => clearInterval(i);
  }, []);

  // Notifications
  useEffect(() => {
    setNotifications(getAdminNotifications());
    const i = setInterval(() => setNotifications(getAdminNotifications()), 60_000);
    return () => clearInterval(i);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Command palette keyboard shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(v => !v);
      }
      if (e.key === 'Escape' && paletteOpen) {
        setPaletteOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [paletteOpen]);

  // Focus palette input when opened
  useEffect(() => {
    if (paletteOpen) {
      setTimeout(() => paletteInputRef.current?.focus(), 50);
    } else {
      setPaletteQuery('');
    }
  }, [paletteOpen]);

  const unread = notifications.filter(n => !n.read).length;

  function handleLogout() {
    logout();
    router.push('/admin-login');
  }

  function markAllRead() {
    setNotifications(n => n.map(x => ({ ...x, read: true })));
  }

  function markRead(id: string) {
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  }

  // Derived breadcrumb
  const breadcrumb = useMemo(() => {
    if (breadcrumbProp) return breadcrumbProp;
    const parts = (pathname ?? '').split('/').filter(Boolean);
    const items: { label: string; href?: string }[] = [{ label: 'Admin', href: '/dashboard' }];
    let acc = '';
    parts.forEach((p, i) => {
      acc += '/' + p;
      const isLast = i === parts.length - 1;
      const label = p
        .split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        .replace(/^Admin$/i, 'Admin');
      items.push({ label, href: isLast ? undefined : acc });
    });
    return items;
  }, [pathname, breadcrumbProp]);

  // Filtered palette entries
  const filteredCommands = useMemo(() => {
    if (!paletteQuery.trim()) return COMMAND_ENTRIES;
    const q = paletteQuery.toLowerCase();
    return COMMAND_ENTRIES.filter(e =>
      e.label.toLowerCase().includes(q) || e.keywords.includes(q) || e.group.toLowerCase().includes(q)
    );
  }, [paletteQuery]);

  // Grouped commands
  const groupedCommands = useMemo(() => {
    const groups: Record<string, typeof COMMAND_ENTRIES> = {};
    filteredCommands.forEach(e => {
      if (!groups[e.group]) groups[e.group] = [];
      groups[e.group].push(e);
    });
    return groups;
  }, [filteredCommands]);

  // Filtered notifications
  const filteredNotifs = useMemo(() => {
    if (notifFilter === 'unread') return notifications.filter(n => !n.read);
    if (notifFilter === 'critical') return notifications.filter(n => n.severity === 'critical' || n.severity === 'warning');
    return notifications;
  }, [notifications, notifFilter]);

  const themeIcon = themeMode === 'dark' ? 'moon' : themeMode === 'light' ? 'sun' : 'monitor';
  const themeLabel = themeMode === 'dark' ? 'Dark' : themeMode === 'light' ? 'Light' : 'System';

  return (
    <>
      <header
        className="admin-topbar"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: tokens.mode === 'dark' ? 'rgba(19,24,32,0.85)' : 'rgba(255,255,255,0.85)',
          borderBottom: `1px solid ${tokens.border.subtle}`,
          backdropFilter: 'saturate(180%) blur(12px)',
          WebkitBackdropFilter: 'saturate(180%) blur(12px)',
          minHeight: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
          transition: 'box-shadow 200ms ease',
        }}
      >
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="admin-mobile-trigger"
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            color: tokens.text.primary,
            borderRadius: 6,
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Breadcrumb + Title */}
        <div style={{ flex: '0 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div className="admin-breadcrumb" style={{
            fontSize: 11, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap',
          }}>
            {breadcrumb.map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {item.href ? (
                  <Link href={item.href} style={{
                    color: tokens.text.tertiary, textDecoration: 'none',
                    transition: 'color 120ms ease',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = tokens.text.primary; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = tokens.text.tertiary; }}>
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ color: tokens.text.secondary, fontWeight: 600 }}>{item.label}</span>
                )}
                {i < breadcrumb.length - 1 && (
                  <span style={{ color: tokens.text.tertiary, opacity: 0.6 }}>/</span>
                )}
              </span>
            ))}
          </div>
          <div style={{
            fontSize: 15, fontWeight: 700, color: tokens.text.primary,
            fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em',
            lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {title}
          </div>
        </div>

        {/* Command palette search (desktop) */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: 460, margin: '0 auto' }}>
          <button
            onClick={() => setPaletteOpen(true)}
            className="admin-palette-trigger"
            style={{
              width: '100%', height: 36,
              padding: '0 12px 0 36px',
              borderRadius: 9,
              border: `1px solid ${tokens.border.subtle}`,
              background: tokens.bg.surfaceAlt,
              color: tokens.text.tertiary,
              fontSize: 12.5, fontFamily: 'Inter, sans-serif',
              cursor: 'pointer', textAlign: 'left',
              position: 'relative',
              transition: 'border-color 120ms ease, background 120ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = tokens.border.strong; e.currentTarget.style.background = tokens.bg.surface; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = tokens.border.subtle; e.currentTarget.style.background = tokens.bg.surfaceAlt; }}
          >
            <SearchIcon size={14} color={tokens.text.tertiary} />
            <span style={{ position: 'absolute', left: 36, top: '50%', transform: 'translateY(-50%)' }}>
              Search or jump to…
            </span>
            <kbd style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              fontSize: 10, fontWeight: 600, color: tokens.text.tertiary,
              background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
              padding: '2px 6px', borderRadius: 4, fontFamily: 'Inter, sans-serif',
            }}>⌘K</kbd>
          </button>
        </div>

        {/* Right cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Live clock */}
          <div className="admin-clock" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            padding: '0 8px', borderRight: `1px solid ${tokens.border.subtle}`,
            marginRight: 4,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', lineHeight: 1.1 }}>
              {clock.time}
            </span>
            <span style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
              {clock.date} · IST
            </span>
          </div>

          {/* Quick Create */}
          <Dropdown
            tokens={tokens}
            align="right"
            width={220}
            trigger={
              <IconButton
                tokens={tokens}
                icon={<PlusIcon size={16} color={tokens.text.secondary} />}
                label="Quick create"
                size={34}
                variant="outline"
              />
            }
          >
            <div style={{ padding: '4px 8px', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Quick Create
            </div>
            <MenuDivider tokens={tokens} />
            {QUICK_CREATE_ITEMS.map(item => (
              <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                <MenuItem tokens={tokens} icon={<PlusIcon size={12} color={tokens.text.secondary} />}>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <kbd style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>{item.shortcut}</kbd>
                </MenuItem>
              </Link>
            ))}
          </Dropdown>

          {/* Theme toggle */}
          <button
            onClick={onCycleTheme}
            aria-label={`Theme: ${themeLabel}`}
            title={`Theme: ${themeLabel}`}
            style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'transparent', border: `1px solid ${tokens.border.subtle}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: tokens.text.secondary,
              transition: 'background 120ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {themeIcon === 'moon' && (
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" />
              </svg>
            )}
            {themeIcon === 'sun' && (
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
              </svg>
            )}
            {themeIcon === 'monitor' && (
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="12" rx="2" />
                <path d="M8 20h8M12 16v4" />
              </svg>
            )}
          </button>

          {/* Notifications */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
              aria-label="Notifications"
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'transparent', border: `1px solid ${tokens.border.subtle}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: tokens.text.secondary, position: 'relative',
                transition: 'background 120ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16zM10 20a2 2 0 004 0" />
              </svg>
              {unread > 0 && (
                <span style={{
                  position: 'absolute', top: -2, right: -2,
                  minWidth: 15, height: 15, borderRadius: 8,
                  background: tokens.status.error, color: 'white',
                  fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px', border: `2px solid ${tokens.bg.topbar}`,
                }}>
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: 380, maxWidth: 'calc(100vw - 24px)',
                background: tokens.bg.surface,
                border: `1px solid ${tokens.border.subtle}`,
                borderRadius: 12, boxShadow: tokens.shadow.lg,
                zIndex: 200, overflow: 'hidden',
                animation: 'admin-pop-in 160ms cubic-bezier(0.16,1,0.3,1)',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderBottom: `1px solid ${tokens.border.subtle}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
                      Notifications
                    </span>
                    {unread > 0 && <Badge tokens={tokens} tone="critical" size="sm">{unread} new</Badge>}
                  </div>
                  <button
                    onClick={markAllRead}
                    style={{
                      fontSize: 11, fontWeight: 600, color: tokens.text.accent,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Mark all read
                  </button>
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: 4, padding: '8px 14px', borderBottom: `1px solid ${tokens.border.subtle}` }}>
                  {(['all', 'unread', 'critical'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setNotifFilter(f)}
                      style={{
                        padding: '4px 10px', borderRadius: 6, border: 'none',
                        background: notifFilter === f ? tokens.bg.hover : 'transparent',
                        color: notifFilter === f ? tokens.text.primary : tokens.text.secondary,
                        fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'capitalize',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                  {filteredNotifs.length === 0 && (
                    <div style={{ padding: 32, textAlign: 'center', color: tokens.text.secondary, fontSize: 12 }}>
                      No notifications
                    </div>
                  )}
                  {filteredNotifs.map(n => {
                    const meta = NOTIF_TYPE_META[n.type] ?? NOTIF_TYPE_META.system;
                    const severityColor =
                      n.severity === 'critical' ? tokens.status.error :
                      n.severity === 'warning' ? tokens.status.warning :
                      n.severity === 'success' ? tokens.status.success :
                      tokens.status.info;
                    return (
                      <Link
                        key={n.id}
                        href={n.link ?? '#'}
                        onClick={() => { markRead(n.id); setNotifOpen(false); }}
                        style={{
                          display: 'flex', gap: 10, padding: '10px 14px',
                          borderBottom: `1px solid ${tokens.border.subtle}`,
                          textDecoration: 'none', color: 'inherit',
                          background: n.read ? 'transparent' : tokens.bg.hover,
                          transition: 'background 120ms ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = n.read ? 'transparent' : tokens.bg.hover; }}
                      >
                        <div style={{
                          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                          background: severityColor + '20', color: severityColor,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14,
                        }}>
                          {meta.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 12, fontWeight: 600, color: tokens.text.primary,
                            fontFamily: 'Inter, sans-serif', lineHeight: 1.3,
                          }}>
                            {n.title}
                          </div>
                          <div style={{
                            fontSize: 11, color: tokens.text.secondary, marginTop: 2,
                            fontFamily: 'Inter, sans-serif', lineHeight: 1.4,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {n.message}
                          </div>
                          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>
                            {timeAgo(n.timestamp)}
                          </div>
                        </div>
                        {!n.read && (
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: severityColor, marginTop: 6, flexShrink: 0 }} />
                        )}
                      </Link>
                    );
                  })}
                </div>
                <div style={{ padding: '10px 14px', borderTop: `1px solid ${tokens.border.subtle}`, textAlign: 'center' }}>
                  <Link href="/admin/notifications" style={{
                    fontSize: 12, fontWeight: 600, color: tokens.text.accent,
                    textDecoration: 'none', fontFamily: 'Inter, sans-serif',
                  }}>
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '3px 6px 3px 3px', borderRadius: 8,
                transition: 'background 120ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: session.avatarColor,
                color: '#FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800, fontFamily: 'Inter, sans-serif',
              }}>
                {session.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }} className="admin-profile-info">
                <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
                  {session.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: 9, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                  {session.role}
                </span>
              </div>
              <ChevronDown size={10} color={tokens.text.tertiary} />
            </button>

            {profileOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: 260, background: tokens.bg.surface,
                border: `1px solid ${tokens.border.subtle}`,
                borderRadius: 12, boxShadow: tokens.shadow.lg,
                zIndex: 200, overflow: 'hidden', padding: 4,
                animation: 'admin-pop-in 160ms cubic-bezier(0.16,1,0.3,1)',
              }}>
                <div style={{ padding: '12px 12px', borderBottom: `1px solid ${tokens.border.subtle}`, marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
                    {session.name}
                  </div>
                  <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>
                    {session.email}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    <Badge tokens={tokens} tone="neutral" size="sm">{session.role}</Badge>
                    {session.twoFactorEnabled && <Badge tokens={tokens} tone="success" size="sm" dot>2FA</Badge>}
                  </div>
                </div>
                <Link href="/settings-panel" onClick={() => setProfileOpen(false)} style={{ textDecoration: 'none' }}>
                  <MenuItem tokens={tokens} icon={<SettingsIcon color={tokens.text.secondary} />}>
                    Account Settings
                  </MenuItem>
                </Link>
                <Link href="/admin/audit" onClick={() => setProfileOpen(false)} style={{ textDecoration: 'none' }}>
                  <MenuItem tokens={tokens} icon={<ShieldIcon color={tokens.text.secondary} />}>
                    Audit Log
                  </MenuItem>
                </Link>
                <MenuItem tokens={tokens} icon={<HelpIcon color={tokens.text.secondary} />}>
                  Help & Support
                </MenuItem>
                <MenuDivider tokens={tokens} />
                <MenuItem tokens={tokens} icon={<LogoutIcon color={tokens.status.error} />} danger onClick={handleLogout}>
                  Sign Out
                </MenuItem>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      {paletteOpen && (
        <div
          onClick={() => setPaletteOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: tokens.bg.overlay, backdropFilter: 'blur(4px)',
            zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '8vh 16px 16px',
            animation: 'admin-fade-in 160ms ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: tokens.bg.surface,
              border: `1px solid ${tokens.border.subtle}`,
              borderRadius: 14, boxShadow: tokens.shadow.lg,
              width: '100%', maxWidth: 560,
              maxHeight: '70vh', display: 'flex', flexDirection: 'column',
              animation: 'admin-pop-in 200ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {/* Search input */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 16px', borderBottom: `1px solid ${tokens.border.subtle}`,
            }}>
              <SearchIcon size={16} color={tokens.text.tertiary} />
              <input
                ref={paletteInputRef}
                value={paletteQuery}
                onChange={e => setPaletteQuery(e.target.value)}
                placeholder="Type a command or search…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  fontSize: 14, color: tokens.text.primary, fontFamily: 'Inter, sans-serif',
                }}
              />
              <kbd style={{
                fontSize: 10, fontWeight: 600, color: tokens.text.tertiary,
                background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
                padding: '2px 6px', borderRadius: 4, fontFamily: 'Inter, sans-serif',
              }}>ESC</kbd>
            </div>

            {/* Results */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 6 }}>
              {Object.entries(groupedCommands).map(([group, entries]) => (
                <div key={group} style={{ marginBottom: 4 }}>
                  <div style={{
                    padding: '8px 12px 4px',
                    fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
                    textTransform: 'uppercase', letterSpacing: 0.8,
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {group}
                  </div>
                  {entries.map(entry => (
                    <button
                      key={entry.href}
                      onClick={() => {
                        router.push(entry.href);
                        setPaletteOpen(false);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '8px 12px',
                        borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: 'transparent', textAlign: 'left',
                        color: tokens.text.primary,
                        fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                        transition: 'background 100ms ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{
                        width: 24, height: 24, borderRadius: 6,
                        background: tokens.bg.surfaceAlt,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: tokens.text.secondary, fontSize: 11, fontWeight: 700,
                      }}>
                        {entry.label.charAt(0)}
                      </span>
                      <span style={{ flex: 1 }}>{entry.label}</span>
                      <ChevronDown size={10} color={tokens.text.tertiary} />
                    </button>
                  ))}
                </div>
              ))}
              {filteredCommands.length === 0 && (
                <div style={{ padding: 32, textAlign: 'center', color: tokens.text.secondary, fontSize: 12 }}>
                  No commands match &ldquo;{paletteQuery}&rdquo;
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '8px 14px', borderTop: `1px solid ${tokens.border.subtle}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 10, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif',
            }}>
              <span>LNKICKS Admin · Command Palette</span>
              <span>↑↓ navigate · ↵ select · esc close</span>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes admin-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes admin-pop-in {
          from { opacity: 0; transform: scale(0.97) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 1023px) {
          .admin-mobile-trigger { display: block !important; }
        }
        @media (max-width: 767px) {
          .admin-palette-trigger { display: none !important; }
          .admin-clock { display: none !important; }
          .admin-profile-info { display: none !important; }
          .admin-breadcrumb { display: none !important; }
        }
      `}</style>
    </>
  );
}

function SettingsIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8a4 4 0 100 8 4 4 0 000-8zM19 12a7 7 0 00-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 00-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 00-1.7 1l-2.4-1-2 3.5 2 1.5a7 7 0 000 2l-2 1.5 2 3.5 2.4-1a7 7 0 001.7 1l.4 2.5h4l.4-2.5a7 7 0 001.7-1l2.4 1 2-3.5-2-1.5a7 7 0 00.1-1z" />
    </svg>
  );
}

function ShieldIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
    </svg>
  );
}

function HelpIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  );
}

function LogoutIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
