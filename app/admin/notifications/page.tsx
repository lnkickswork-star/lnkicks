/**
 * LNKICKS Enterprise Admin — Notification Center
 */

'use client';

import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, Tabs, useToast, Panel,
  EmptyState, IconButton,
} from '@/components/admin/ui';
import { getAdminNotifications } from '@/lib/admin/adminData';
import type { AdminNotificationType } from '@/lib/admin/types';

const TYPE_META: Record<AdminNotificationType, { icon: string; label: string; color: 'info' | 'warning' | 'critical' | 'success' | 'neutral' | 'purple' }> = {
  order: { icon: '🛒', label: 'Orders', color: 'info' },
  stock: { icon: '📦', label: 'Stock', color: 'critical' },
  review: { icon: '⭐', label: 'Reviews', color: 'info' },
  customer: { icon: '👤', label: 'Customers', color: 'warning' },
  system: { icon: '⚙️', label: 'System', color: 'neutral' },
  security: { icon: '🔐', label: 'Security', color: 'warning' },
  marketing: { icon: '📣', label: 'Marketing', color: 'purple' },
};

function generateNotifications() {
  const base = getAdminNotifications();
  // Add more for the center
  const extra = Array.from({ length: 18 }, (_, i) => ({
    id: `n-extra-${i}`,
    type: (['order', 'stock', 'review', 'customer', 'system', 'security'] as AdminNotificationType[])[i % 6],
    title: [
      'New order received',
      'Low stock warning',
      'New review pending',
      'Customer support ticket',
      'Backup completed',
      'New admin login',
    ][i % 6],
    message: [
      `Order #LNK-${2800 - i} · ₹${(8999 + i * 500).toLocaleString('en-IN')}`,
      'Nike Dunk Low Panda — 4 units remaining',
      '5★ review from Aarav on Air Jordan 1',
      'Order #LNK-2798 delivery complaint',
      'Database backup saved successfully',
      'Manager signed in from Chrome',
    ][i % 6],
    timestamp: Date.now() - i * 3600_000 * 2,
    read: i > 4,
    severity: i % 7 === 0 ? 'critical' as const : i % 4 === 0 ? 'warning' as const : i % 3 === 0 ? 'success' as const : 'info' as const,
    link: '/dashboard',
  }));
  return [...base, ...extra];
}

export default function NotificationsPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [notifications, setNotifications] = useState(generateNotifications);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => notifications.filter(n => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'critical' && n.severity !== 'critical' && n.severity !== 'warning') return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  }), [notifications, filter, typeFilter]);

  const counts = useMemo(() => ({
    all: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    critical: notifications.filter(n => n.severity === 'critical' || n.severity === 'warning').length,
  }), [notifications]);

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    pushToast({ tone: 'success', title: 'All marked as read' });
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function deleteNotif(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  return (
    <AdminLayout
      title="Notifications"
      subtitle="Activity center"
      requirePermission="notification.send"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }, { label: 'Notifications' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Notification Center"
        subtitle="All system alerts — orders, stock, reviews, customers, security, and marketing campaigns."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }, { label: 'Notifications' }]}
        meta={<Badge tokens={tokens} tone="critical" dot>{counts.unread} unread</Badge>}
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={markAllRead}>Mark All Read</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'info', title: 'Compose campaign', message: 'Email / SMS / Push' })}
              icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>}
            >Send Campaign</Button>
          </>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'all', label: 'All', badge: counts.all },
          { key: 'unread', label: 'Unread', badge: counts.unread },
          { key: 'critical', label: 'Priority', badge: counts.critical },
        ]} active={filter} onChange={setFilter} />
        <div style={{ flex: 1 }} />
        <Tabs tokens={tokens} size="sm" tabs={[
          { key: 'all', label: 'All Types' },
          { key: 'order', label: 'Orders' },
          { key: 'stock', label: 'Stock' },
          { key: 'review', label: 'Reviews' },
          { key: 'security', label: 'Security' },
        ]} active={typeFilter} onChange={setTypeFilter} />
      </div>

      {filtered.length === 0 ? (
        <Panel tokens={tokens}>
          <EmptyState
            tokens={tokens}
            icon={<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16zM10 20a2 2 0 004 0" /></svg>}
            title="No notifications"
            description="You're all caught up. New alerts will appear here."
          />
        </Panel>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
            return (
              <div
                key={n.id}
                style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '12px 14px', borderRadius: 10,
                  background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
                  borderLeft: `3px solid ${sevColor}`,
                  boxShadow: tokens.shadow.sm,
                  transition: 'background 120ms ease',
                  opacity: n.read ? 0.7 : 1,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = tokens.bg.surface; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: sevBg, color: sevColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>{meta.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{n.title}</span>
                    {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: sevColor, flexShrink: 0 }} />}
                    <Badge tokens={tokens} tone={meta.color} size="sm">{meta.label}</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>
                    {new Date(n.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {!n.read && <IconButton tokens={tokens} size={26} icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>} label="Mark read" onClick={() => markRead(n.id)} />}
                  <IconButton tokens={tokens} size={26} icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M10 11v6M14 11v6" /></svg>} label="Delete" onClick={() => deleteNotif(n.id)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
