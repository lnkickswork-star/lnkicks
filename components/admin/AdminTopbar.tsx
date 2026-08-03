/**
 * AdminTopbar — sticky top bar with:
 *  - Mobile menu trigger (hamburger)
 *  - Page title (passed via prop)
 *  - Global search (cmd+k placeholder)
 *  - Live clock (IST)
 *  - Theme toggle (light/dark/system)
 *  - Notifications dropdown (with unread badge)
 *  - Profile menu (role chip, 2FA status, logout)
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { AdminThemeTokens, AdminSession, AdminNotification } from '@/lib/admin/types';
import { logout } from '@/lib/admin/adminAuth';
import { getAdminNotifications } from '@/lib/admin/adminData';
import type { AdminThemeMode } from '@/lib/admin/types';

interface Props {
  tokens: AdminThemeTokens;
  themeMode: AdminThemeMode;
  onToggleTheme: () => void;
  onCycleTheme: () => void;
  session: AdminSession;
  title: string;
  subtitle?: string;
  onOpenMobileNav: () => void;
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

const NOTIF_ICON: Record<string, string> = {
  order: 'cart', stock: 'layers', review: 'star', customer: 'users',
  system: 'settings', security: 'shield', marketing: 'bell',
};

export function AdminTopbar({
  tokens, themeMode, onCycleTheme, session, title, subtitle, onOpenMobileNav,
}: Props) {
  const router = useRouter();
  const [clock, setClock] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [search, setSearch] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(getAdminNotifications());
    const tick = () => {
      const now = new Date();
      const ist = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true,
      });
      setClock(ist);
    };
    tick();
    const i = setInterval(tick, 30000);
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

  const unread = notifications.filter(n => !n.read).length;

  function handleLogout() {
    logout();
    router.push('/admin-login');
  }

  function markAllRead() {
    setNotifications(n => n.map(x => ({ ...x, read: true })));
  }

  const themeIcon = themeMode === 'dark' ? 'moon' : themeMode === 'light' ? 'sun' : 'monitor';
  const themeLabel = themeMode === 'dark' ? 'Dark' : themeMode === 'light' ? 'Light' : 'System';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: tokens.bg.topbar,
        borderBottom: `1px solid ${tokens.border.subtle}`,
        backdropFilter: 'saturate(180%) blur(8px)',
        minHeight: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
      }}
    >
      {/* Mobile menu trigger */}
      <button
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        style={{
          display: 'none',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 8,
          color: tokens.text.primary,
          borderRadius: 6,
        }}
        className="admin-mobile-trigger"
      >
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Title */}
      <div style={{ flex: '0 0 auto', minWidth: 0 }}>
        <div style={{
          fontSize: 16, fontWeight: 700, color: tokens.text.primary,
          fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em',
          lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{
            fontSize: 11, color: tokens.text.secondary, marginTop: 2,
            fontFamily: 'Inter, sans-serif',
          }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: 480, margin: '0 auto' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 480,
            display: 'none', // hidden on mobile via class
          }}
          className="admin-search"
        >
          <svg
            width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary}
            strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          >
            <path d="M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products, orders, customers..."
            style={{
              width: '100%',
              height: 36,
              padding: '0 12px 0 34px',
              borderRadius: 8,
              border: `1px solid ${tokens.border.subtle}`,
              background: tokens.bg.surfaceAlt,
              color: tokens.text.primary,
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'border-color 120ms ease, background 120ms ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = tokens.border.focus;
              e.currentTarget.style.background = tokens.bg.surface;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = tokens.border.subtle;
              e.currentTarget.style.background = tokens.bg.surfaceAlt;
            }}
          />
          <kbd style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            fontSize: 10, fontWeight: 600, color: tokens.text.tertiary,
            background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
            padding: '2px 5px', borderRadius: 4, fontFamily: 'Inter, sans-serif',
          }}>
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Clock */}
      <div style={{
        fontSize: 12, fontWeight: 600, color: tokens.text.secondary,
        fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
        display: 'none',
      }} className="admin-clock">
        <span style={{ color: tokens.text.tertiary, marginRight: 4 }}>IST</span>
        {clock}
      </div>

      {/* Theme toggle */}
      <button
        onClick={onCycleTheme}
        aria-label={`Theme: ${themeLabel}`}
        title={`Theme: ${themeLabel}`}
        style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'transparent', border: `1px solid ${tokens.border.subtle}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: tokens.text.secondary,
          transition: 'background 120ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        {themeIcon === 'moon' && (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" />
          </svg>
        )}
        {themeIcon === 'sun' && (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
          </svg>
        )}
        {themeIcon === 'monitor' && (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
            width: 36, height: 36, borderRadius: 8,
            background: 'transparent', border: `1px solid ${tokens.border.subtle}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: tokens.text.secondary, position: 'relative',
            transition: 'background 120ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16zM10 20a2 2 0 004 0" />
          </svg>
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2,
              minWidth: 16, height: 16, borderRadius: 8,
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
            width: 360, maxWidth: 'calc(100vw - 32px)',
            background: tokens.bg.surface,
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: 12, boxShadow: tokens.shadow.lg,
            zIndex: 200, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderBottom: `1px solid ${tokens.border.subtle}`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
                Notifications
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
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {notifications.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: tokens.text.secondary, fontSize: 13 }}>
                  No notifications
                </div>
              )}
              {notifications.map(n => {
                const severityColor =
                  n.severity === 'critical' ? tokens.status.error :
                  n.severity === 'warning' ? tokens.status.warning :
                  n.severity === 'success' ? tokens.status.success :
                  tokens.status.info;
                return (
                  <Link
                    key={n.id}
                    href={n.link ?? '#'}
                    onClick={() => setNotifOpen(false)}
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
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: severityColor + '20', color: severityColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700,
                    }}>
                      {(NOTIF_ICON[n.type] ?? 'bell').charAt(0).toUpperCase()}
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
            padding: '4px 8px 4px 4px', borderRadius: 8,
            transition: 'background 120ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: session.avatarColor,
            color: session.avatarColor === '#0A0A0A' ? (tokens.mode === 'dark' ? '#F1F5F9' : '#FFFFFF') : '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, fontFamily: 'Inter, sans-serif',
          }}>
            {session.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }} className="admin-profile-info">
            <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
              {session.name.split(' ')[0]}
            </span>
            <span style={{ fontSize: 10, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
              {session.role}
            </span>
          </div>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {profileOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: 240, background: tokens.bg.surface,
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: 12, boxShadow: tokens.shadow.lg,
            zIndex: 200, overflow: 'hidden', padding: 4,
          }}>
            <div style={{ padding: '10px 12px', borderBottom: `1px solid ${tokens.border.subtle}`, marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>
                {session.name}
              </div>
              <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>
                {session.email}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 10, fontWeight: 700, marginTop: 6,
                padding: '2px 7px', borderRadius: 5,
                background: tokens.bg.surfaceAlt, color: tokens.text.secondary,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {session.role}
                {session.twoFactorEnabled && <span style={{ color: tokens.status.success }}>· 2FA</span>}
              </div>
            </div>
            <Link href="/settings-panel" onClick={() => setProfileOpen(false)} style={menuItemStyle(tokens)}>
              <SvgIcon name="settings" color={tokens.text.secondary} />
              <span>Account Settings</span>
            </Link>
            <Link href="/admin/audit" onClick={() => setProfileOpen(false)} style={menuItemStyle(tokens)}>
              <SvgIcon name="shield" color={tokens.text.secondary} />
              <span>Audit Log</span>
            </Link>
            <button onClick={handleLogout} style={{ ...menuItemStyle(tokens), width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer' }}>
              <SvgIcon name="logout" color={tokens.status.error} />
              <span style={{ color: tokens.status.error }}>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 1023px) {
          :global(.admin-mobile-trigger) { display: flex !important; }
        }
        @media (max-width: 767px) {
          :global(.admin-search) { display: none !important; }
          :global(.admin-clock) { display: none !important; }
          :global(.admin-profile-info) { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function menuItemStyle(tokens: AdminThemeTokens): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 10px', borderRadius: 6,
    textDecoration: 'none', color: tokens.text.primary,
    fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif',
    background: 'transparent', transition: 'background 120ms ease',
  };
}

function SvgIcon({ name, color }: { name: string; color: string }) {
  const paths: Record<string, string> = {
    settings: 'M12 8a4 4 0 100 8 4 4 0 000-8zM19 12a7 7 0 00-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 00-1.7-1l-.4-2.5h-4l-.4 2.5a7 7 0 00-1.7 1l-2.4-1-2 3.5 2 1.5a7 7 0 000 2l-2 1.5 2 3.5 2.4-1a7 7 0 001.7 1l.4 2.5h4l.4-2.5a7 7 0 001.7-1l2.4 1 2-3.5-2-1.5a7 7 0 00.1-1z',
    shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
    logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  };
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] ?? paths.settings} />
    </svg>
  );
}
