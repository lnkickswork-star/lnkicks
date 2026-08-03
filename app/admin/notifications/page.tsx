/**
 * LNKICKS Enterprise Admin — Notification Center
 * ------------------------------------------------------------
 * Unified notification command center with:
 *  - Unread / Priority filters
 *  - Type filters: System / Marketing / Customer / Order / Stock / Review / Security
 *  - Search across title + message
 *  - Archive / Restore / Delete
 *  - Mark as read (single + bulk)
 *  - Compose new campaign (email/SMS/push)
 *  - Priority indicators (critical/warning/info/success)
 *  - Notification preferences shortcut
 *
 * Reuses existing AdminNotification data shape from adminData.ts.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, Tabs, useToast, Panel,
  EmptyState, IconButton, SearchInput, Drawer, Input, Textarea, Select,
} from '@/components/admin/ui';
import { getAdminNotifications } from '@/lib/admin/adminData';
import type { AdminNotificationType } from '@/lib/admin/types';
import type { AdminThemeTokens } from '@/lib/admin/types';

/* ----------------------------- Types ----------------------------- */

interface NotificationItem {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  archived: boolean;
  severity: 'info' | 'warning' | 'critical' | 'success';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  link?: string;
}

/* ----------------------------- Constants ----------------------------- */

const TYPE_META: Record<AdminNotificationType, { icon: string; label: string; color: 'info' | 'warning' | 'critical' | 'success' | 'neutral' | 'purple' }> = {
  order: { icon: '🛒', label: 'Orders', color: 'info' },
  stock: { icon: '📦', label: 'Stock', color: 'critical' },
  review: { icon: '⭐', label: 'Reviews', color: 'info' },
  customer: { icon: '👤', label: 'Customers', color: 'warning' },
  system: { icon: '⚙️', label: 'System', color: 'neutral' },
  security: { icon: '🔐', label: 'Security', color: 'warning' },
  marketing: { icon: '📣', label: 'Marketing', color: 'purple' },
};

const PRIORITY_META: Record<NotificationItem['priority'], { label: string; color: string }> = {
  urgent: { label: 'URGENT', color: '#DC2626' },
  high: { label: 'HIGH', color: '#F59E0B' },
  normal: { label: 'NORMAL', color: '#3B82F6' },
  low: { label: 'LOW', color: '#94A3B8' },
};

/* ----------------------------- Data ----------------------------- */

function generateNotifications(): NotificationItem[] {
  const base: NotificationItem[] = getAdminNotifications().map(n => ({
    ...n,
    archived: false,
    priority: n.severity === 'critical' ? 'urgent' : n.severity === 'warning' ? 'high' : 'normal',
  }));
  const extra: NotificationItem[] = Array.from({ length: 24 }, (_, i) => ({
    id: `n-extra-${i}`,
    type: (['order', 'stock', 'review', 'customer', 'system', 'security', 'marketing'] as AdminNotificationType[])[i % 7],
    title: [
      'New order received',
      'Low stock warning',
      'New review pending',
      'Customer support ticket',
      'Backup completed',
      'New admin login',
      'Flash sale launched',
      'Coupon redemption milestone',
      'SEO score updated',
      'Banner CTR dropped',
    ][i % 10],
    message: [
      `Order #LNK-${2800 - i} · ₹${(8999 + i * 500).toLocaleString('en-IN')} · ${['Razorpay', 'COD', 'UPI'][i % 3]}`,
      'Nike Dunk Low Panda — 4 units remaining. Reorder threshold is 10.',
      '5★ review from Aarav on Air Jordan 1 Low — pending moderation.',
      'Order #LNK-2798 — customer reported delivery delay. SLA: 2 hours.',
      'Database backup saved successfully. Size: 248 MB. Next: in 24 hours.',
      'Manager signed in from Chrome on macOS. IP: 103.21.xx.xx',
      'Mid-Week Madness is now live. 18 products · 20% off · 6,200 visitors in 1h.',
      'SUMMER20 crossed 300 redemptions. Revenue impact: ₹318,000.',
      'SEO score improved from 84 to 87. Fixed 4 missing meta descriptions.',
      'Banner "Adidas Samba Offer" CTR dropped from 8.2% to 5.1% over 3 days.',
    ][i % 10],
    timestamp: Date.now() - i * 3600_000 * 1.5,
    read: i > 6,
    archived: i % 11 === 0,
    severity: i % 7 === 0 ? 'critical' : i % 4 === 0 ? 'warning' : i % 3 === 0 ? 'success' : 'info',
    priority: (['urgent', 'high', 'normal', 'low'] as const)[i % 4],
    link: '/dashboard',
  }));
  return [...base, ...extra];
}

/* ----------------------------- Helpers ----------------------------- */

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

/* ----------------------------- Page ----------------------------- */

export default function NotificationsPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>(generateNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'priority' | 'archived'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | AdminNotificationType>('all');
  const [search, setSearch] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);

  const filtered = useMemo(() => notifications.filter(n => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'priority' && n.priority !== 'urgent' && n.priority !== 'high') return false;
    if (filter === 'archived' && !n.archived) return false;
    if (filter !== 'archived' && n.archived) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!n.title.toLowerCase().includes(q) && !n.message.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [notifications, filter, typeFilter, search]);

  const counts = useMemo(() => ({
    all: notifications.filter(n => !n.archived).length,
    unread: notifications.filter(n => !n.read && !n.archived).length,
    priority: notifications.filter(n => !n.archived && (n.priority === 'urgent' || n.priority === 'high')).length,
    archived: notifications.filter(n => n.archived).length,
  }), [notifications]);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    pushToast({ tone: 'success', title: 'All marked as read' });
  }, [pushToast]);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const archive = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: true } : n));
    pushToast({ tone: 'info', title: 'Notification archived' });
  }, [pushToast]);

  const restore = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: false } : n));
    pushToast({ tone: 'success', title: 'Notification restored' });
  }, [pushToast]);

  const deleteNotif = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    pushToast({ tone: 'success', title: 'Notification deleted' });
  }, [pushToast]);

  return (
    <AdminLayout
      title="Notifications"
      subtitle="Activity center"
      requirePermission="notification.send"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Notifications' }]}
    >
      <style jsx global>{`
        @keyframes nc-slide-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes nc-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.4); } }
        .nc-stagger > * { animation: nc-slide-in 320ms cubic-bezier(0.16,1,0.3,1) both; }
        .nc-stagger > *:nth-child(1) { animation-delay: 20ms; }
        .nc-stagger > *:nth-child(2) { animation-delay: 40ms; }
        .nc-stagger > *:nth-child(3) { animation-delay: 60ms; }
        .nc-stagger > *:nth-child(4) { animation-delay: 80ms; }
        .nc-stagger > *:nth-child(5) { animation-delay: 100ms; }
        .nc-stagger > *:nth-child(6) { animation-delay: 120ms; }
        .nc-stagger > *:nth-child(7) { animation-delay: 140ms; }
        .nc-stagger > *:nth-child(8) { animation-delay: 160ms; }
        .nc-pulse-dot { animation: nc-pulse 1.6s ease-in-out infinite; }
      `}</style>

      <PageHeader
        tokens={tokens}
        title="Notification Center"
        subtitle="All system alerts — orders, stock, reviews, customers, security, and marketing campaigns — in one unified inbox."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Notifications' }]}
        meta={
          <span style={{ display: 'inline-flex', gap: 6 }}>
            {counts.unread > 0 && <Badge tokens={tokens} tone="critical" dot>{counts.unread} unread</Badge>}
            {counts.priority > 0 && <Badge tokens={tokens} tone="warning">{counts.priority} priority</Badge>}
          </span>
        }
        actions={
          <>
            {counts.unread > 0 && <Button tokens={tokens} variant="outline" size="md" onClick={markAllRead}>Mark All Read</Button>}
            <Button tokens={tokens} variant="primary" size="md" onClick={() => setComposeOpen(true)}
              icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>}
            >Send Campaign</Button>
          </>
        }
      />

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'all', label: 'Inbox', badge: counts.all },
          { key: 'unread', label: 'Unread', badge: counts.unread },
          { key: 'priority', label: 'Priority', badge: counts.priority },
          { key: 'archived', label: 'Archived', badge: counts.archived },
        ]} active={filter} onChange={(k) => setFilter(k as typeof filter)} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 280 }}>
          <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search title, message…" />
        </div>
      </div>

      {/* Type filter chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        <TypeChip tokens={tokens} active={typeFilter === 'all'} onClick={() => setTypeFilter('all')} label="All Types" />
        {(Object.keys(TYPE_META) as AdminNotificationType[]).map(t => (
          <TypeChip key={t} tokens={tokens} active={typeFilter === t} onClick={() => setTypeFilter(t)}
            label={`${TYPE_META[t].icon} ${TYPE_META[t].label}`}
            count={notifications.filter(n => !n.archived && n.type === t).length}
          />
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <Panel tokens={tokens}>
          <EmptyState
            tokens={tokens}
            icon={<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16zM10 20a2 2 0 004 0" /></svg>}
            title={filter === 'archived' ? 'No archived notifications' : 'No notifications'}
            description={filter === 'archived' ? 'Archived alerts will appear here when you archive them.' : "You're all caught up. New alerts will appear here."}
          />
        </Panel>
      ) : (
        <div className="nc-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(n => {
            const meta = TYPE_META[n.type];
            const sevColor = n.severity === 'critical' ? tokens.status.error
              : n.severity === 'warning' ? tokens.status.warning
              : n.severity === 'success' ? tokens.status.success
              : tokens.status.info;
            const sevBg = n.severity === 'critical' ? tokens.status.errorBg
              : n.severity === 'warning' ? tokens.status.warningBg
              : n.severity === 'success' ? tokens.status.successBg
              : tokens.status.infoBg;
            const prio = PRIORITY_META[n.priority];

            return (
              <div
                key={n.id}
                style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '12px 14px', borderRadius: 10,
                  background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
                  borderLeft: `3px solid ${sevColor}`,
                  boxShadow: tokens.shadow.sm,
                  transition: 'all 180ms cubic-bezier(0.16,1,0.3,1)',
                  opacity: n.read ? 0.65 : 1,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; e.currentTarget.style.transform = 'translateX(2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = tokens.bg.surface; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: sevBg, color: sevColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, flexShrink: 0,
                  position: 'relative',
                }}>
                  {meta.icon}
                  {!n.read && <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: sevColor, border: `2px solid ${tokens.bg.surface}` }} className="nc-pulse-dot" />}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{n.title}</span>
                    <Badge tokens={tokens} tone={meta.color} size="sm">{meta.label}</Badge>
                    <span style={{ fontSize: 9, fontWeight: 800, color: prio.color, padding: '1px 6px', borderRadius: 4, background: `${prio.color}1A`, letterSpacing: 0.6 }}>{prio.label}</span>
                    {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: sevColor, flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 5 }}>
                    {timeAgo(n.timestamp)} · {new Date(n.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  {!n.read && !n.archived && <IconButton tokens={tokens} size={26} icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>} label="Mark read" onClick={() => markRead(n.id)} />}
                  {!n.archived ? (
                    <IconButton tokens={tokens} size={26} icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" /></svg>} label="Archive" onClick={() => archive(n.id)} />
                  ) : (
                    <IconButton tokens={tokens} size={26} icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0zM12 7v5l3 2" /></svg>} label="Restore" onClick={() => restore(n.id)} />
                  )}
                  <IconButton tokens={tokens} size={26} icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.status.error} strokeWidth={2}><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M10 11v6M14 11v6" /></svg>} label="Delete" onClick={() => deleteNotif(n.id)} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compose Campaign Drawer */}
      <Drawer
        tokens={tokens}
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        title="Send Campaign"
        subtitle="Email · SMS · Push notification"
        width={520}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => setComposeOpen(false)}>Cancel</Button>
            <Button tokens={tokens} variant="primary" onClick={() => {
              pushToast({ tone: 'success', title: 'Campaign queued', message: 'Will be sent in the next 5 minutes.' });
              setComposeOpen(false);
            }}>Send Now</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select tokens={tokens} label="Channel"
            options={[
              { value: 'email', label: '📧 Email' },
              { value: 'sms', label: '💬 SMS' },
              { value: 'push', label: '🔔 Push Notification' },
              { value: 'all', label: '🌐 All Channels' },
            ]}
          />
          <Select tokens={tokens} label="Audience"
            options={[
              { value: 'all', label: 'All Customers (24,820)' },
              { value: 'vip', label: 'VIP Customers (420)' },
              { value: 'new', label: 'New Customers (last 30 days)' },
              { value: 'inactive', label: 'Inactive (90+ days)' },
              { value: 'subscribed', label: 'Marketing Subscribed (18,240)' },
            ]}
          />
          <Input tokens={tokens} label="Subject / Title" placeholder="🔥 Mid-Week Madness is LIVE!" />
          <Textarea tokens={tokens} label="Message Body" placeholder="Hey {{first_name}}, our Mid-Week Madness sale is now live! Get 20% off on 18 premium sneakers. Use code SUMMER20 at checkout. Hurry, ends in 48 hours!" rows={5} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input tokens={tokens} label="CTA Link" placeholder="/flash-sale-settings" />
            <Input tokens={tokens} label="Send At" type="datetime-local" />
          </div>
          <div style={{ padding: 10, borderRadius: 8, background: tokens.status.infoBg, border: `1px solid ${tokens.status.info}30` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: tokens.status.info, marginBottom: 4 }}>📊 Reach Estimate</div>
            <div style={{ fontSize: 11, color: tokens.text.secondary }}>Approx. 18,240 recipients · Expected open rate: 24% · Expected CTR: 4.2%</div>
          </div>
        </div>
      </Drawer>
    </AdminLayout>
  );
}

/* ----------------------------- Type Chip ----------------------------- */

function TypeChip({ tokens, active, onClick, label, count }: {
  tokens: AdminThemeTokens; active: boolean; onClick: () => void; label: string; count?: number;
}) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 12px', borderRadius: 16, fontSize: 11, fontWeight: 600,
      fontFamily: 'Inter, sans-serif', cursor: 'pointer', transition: 'all 150ms ease',
      background: active ? tokens.text.primary : tokens.bg.surface,
      color: active ? tokens.bg.app : tokens.text.secondary,
      border: `1px solid ${active ? tokens.text.primary : tokens.border.subtle}`,
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      {label}
      {count !== undefined && (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 8,
          background: active ? tokens.bg.app : tokens.bg.surfaceAlt,
          color: active ? tokens.text.primary : tokens.text.tertiary,
        }}>{count}</span>
      )}
    </button>
  );
}
