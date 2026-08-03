/**
 * LNKICKS Enterprise Admin — Audit Log
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Badge, SearchInput, Tabs, Button, useToast, Select, Avatar,
} from '@/components/admin/ui';
import { getAuditLog, getCurrentSession } from '@/lib/admin/adminAuth';
import type { AuditLogEntry } from '@/lib/admin/types';

export default function AuditPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [actorFilter, setActorFilter] = useState('All');

  useEffect(() => {
    const session = getCurrentSession();
    // Start with admin auth events, then add mock historical entries
    const base = getAuditLog(100);
    const mock: AuditLogEntry[] = Array.from({ length: 40 }, (_, i) => ({
      id: `audit-mock-${i}`,
      actorUid: session?.uid ?? 'admin-001',
      actorName: ['LNKICKS Founder', 'Operations Manager', 'Warehouse Lead', 'Editor Staff'][i % 4],
      actorRole: (['admin', 'manager', 'warehouse', 'editor'] as const)[i % 4],
      action: (['product.update', 'order.status_update', 'order.refund', 'customer.update', 'wallet.credit', 'banner.update', 'seo.update', 'settings.update', 'login', 'logout'] as const)[i % 10],
      target: `entity-${1000 + i}`,
      targetKind: ['product', 'order', 'customer', 'banner', 'settings'][i % 5],
      metadata: { field: 'price', oldValue: 8999, newValue: 9499 },
      ipAddress: `192.168.1.${100 + i}`,
      userAgent: 'Chrome / macOS',
      timestamp: Date.now() - i * 1800_000,
    }));
    setLogs([...base, ...mock]);
  }, []);

  const filtered = useMemo(() => logs.filter(l => {
    if (search && !l.actorName.toLowerCase().includes(search.toLowerCase()) && !l.action.toLowerCase().includes(search.toLowerCase()) && !l.target?.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 'security' && !['login', 'logout', 'login_failed', '2fa.toggle', 'user.create', 'user.disable'].includes(l.action)) return false;
    if (tab === 'orders' && !l.action.startsWith('order.')) return false;
    if (tab === 'products' && !l.action.startsWith('product.')) return false;
    if (actorFilter !== 'All' && l.actorRole !== actorFilter.toLowerCase()) return false;
    return true;
  }), [logs, search, tab, actorFilter]);

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'timestamp', header: 'Time', sortable: true, sortValue: l => l.timestamp,
      render: l => (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.primary }}>{new Date(l.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{new Date(l.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
        </div>
      ),
    },
    {
      key: 'actor', header: 'Actor',
      render: l => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar tokens={tokens} name={l.actorName} size={26} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{l.actorName}</div>
            <Badge tokens={tokens} tone="neutral" size="sm">{l.actorRole}</Badge>
          </div>
        </div>
      ),
    },
    {
      key: 'action', header: 'Action', sortable: true, sortValue: l => l.action,
      render: l => (
        <span style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 11, fontWeight: 600,
          color: l.action.includes('delete') || l.action.includes('failed') ? tokens.status.error
            : l.action.includes('create') || l.action.includes('approve') ? tokens.status.success
            : tokens.text.primary,
        }}>{l.action}</span>
      ),
    },
    {
      key: 'target', header: 'Target',
      render: l => (
        <div>
          <div style={{ fontSize: 11, color: tokens.text.secondary }}>{l.target ?? '—'}</div>
          {l.targetKind && <Badge tokens={tokens} tone="info" size="sm">{l.targetKind}</Badge>}
        </div>
      ),
    },
    {
      key: 'ip', header: 'IP Address',
      render: l => <span style={{ fontSize: 11, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace' }}>{l.ipAddress}</span>,
    },
    {
      key: 'userAgent', header: 'Client',
      render: l => <span style={{ fontSize: 11, color: tokens.text.tertiary }}>{l.userAgent.substring(0, 30)}</span>,
    },
  ];

  return (
    <AdminLayout
      title="Audit Log"
      subtitle="Security & activity trail"
      requirePermission="audit.view"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'System' }, { label: 'Audit Log' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Audit Trail"
        subtitle="Complete activity log — every admin action is recorded for security and compliance."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'System' }, { label: 'Audit Log' }]}
        meta={<Badge tokens={tokens} tone="info">{logs.length} events</Badge>}
        actions={
          <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'success', title: 'Export started', message: 'Audit log exporting to CSV.' })}
            icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>}
          >Export Log</Button>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'all', label: 'All Events' },
          { key: 'security', label: 'Security' },
          { key: 'orders', label: 'Orders' },
          { key: 'products', label: 'Products' },
        ]} active={tab} onChange={setTab} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 220 }}>
          <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search actor, action, target…" />
        </div>
        <Select tokens={tokens} value={actorFilter} onChange={e => setActorFilter(e.target.value)}
          options={['All', 'Admin', 'Manager', 'Editor', 'Warehouse', 'Support'].map(r => ({ value: r, label: r === 'All' ? 'All Roles' : r }))}
          style={{ height: 34, width: 140 }}
        />
      </div>

      <EnterpriseDataTable<AuditLogEntry>
        tokens={tokens} columns={columns} rows={filtered} getRowId={l => l.id}
        pageSize={15}
        defaultSort={{ key: 'timestamp', dir: 'desc' }}
      />
    </AdminLayout>
  );
}
