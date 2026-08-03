/**
 * LNKICKS Enterprise Admin — Wallet Management
 */

'use client';

import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Button, Badge, SearchInput, Tabs, useToast, Panel, Avatar, Drawer,
  Input, Select, Textarea,
} from '@/components/admin/ui';

interface WalletTxn {
  id: string;
  customerName: string;
  type: 'Credit' | 'Debit';
  reason: 'Welcome Bonus' | 'Referral Bonus' | 'Refund' | 'Compensation' | 'Manual Adjustment' | 'Order Payment';
  amount: number;
  balanceAfter: number;
  timestamp: number;
  note?: string;
}

const SEED: WalletTxn[] = Array.from({ length: 30 }, (_, i) => {
  const types: WalletTxn['type'][] = ['Credit', 'Debit'];
  const reasons: WalletTxn['reason'][] = ['Welcome Bonus', 'Referral Bonus', 'Refund', 'Compensation', 'Manual Adjustment', 'Order Payment'];
  const names = ['Aarav Sharma', 'Diya Verma', 'Karthik Iyer', 'Sara Khan', 'Rohan Gupta', 'Ananya Reddy'];
  const type = types[i % 2];
  const reason = reasons[i % 6];
  return {
    id: `txn-${5000 + i}`,
    customerName: names[i % 6],
    type,
    reason,
    amount: type === 'Credit' ? 50 + (i * 13) % 950 : -((100 + (i * 47) % 4900)),
    balanceAfter: 100 + (i * 71) % 2400,
    timestamp: Date.now() - i * 3600_000 * 4,
    note: i % 3 === 0 ? 'Customer support compensation for delivery delay.' : undefined,
  };
});

export default function WalletPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [txns] = useState<WalletTxn[]>(SEED);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [creditOpen, setCreditOpen] = useState(false);

  const filtered = useMemo(() => txns.filter(t => {
    if (search && !t.customerName.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 'credit' && t.type !== 'Credit') return false;
    if (tab === 'debit' && t.type !== 'Debit') return false;
    return true;
  }), [txns, search, tab]);

  const stats = useMemo(() => ({
    totalIssued: txns.filter(t => t.type === 'Credit').reduce((s, t) => s + t.amount, 0),
    totalDebited: Math.abs(txns.filter(t => t.type === 'Debit').reduce((s, t) => s + t.amount, 0)),
    outstanding: 142500,
    txnCount: txns.length,
  }), [txns]);

  const columns: Column<WalletTxn>[] = [
    {
      key: 'id', header: 'Txn ID', sortable: true, sortValue: t => t.id,
      render: t => <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: tokens.text.primary, fontWeight: 600 }}>{t.id}</span>,
    },
    {
      key: 'customer', header: 'Customer',
      render: t => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar tokens={tokens} name={t.customerName} size={26} />
          <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{t.customerName}</span>
        </div>
      ),
    },
    {
      key: 'type', header: 'Type', align: 'center', sortable: true, sortValue: t => t.type,
      render: t => <Badge tokens={tokens} tone={t.type === 'Credit' ? 'success' : 'critical'} size="sm" dot>{t.type}</Badge>,
    },
    {
      key: 'reason', header: 'Reason',
      render: t => <span style={{ color: tokens.text.secondary, fontSize: 11 }}>{t.reason}</span>,
    },
    {
      key: 'amount', header: 'Amount', align: 'right', sortable: true, sortValue: t => t.amount,
      render: t => (
        <span style={{ fontWeight: 700, color: t.type === 'Credit' ? tokens.status.success : tokens.status.error }}>
          {t.type === 'Credit' ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'balanceAfter', header: 'Balance', align: 'right', sortable: true, sortValue: t => t.balanceAfter,
      render: t => <span style={{ color: tokens.text.secondary, fontWeight: 600 }}>₹{t.balanceAfter.toLocaleString('en-IN')}</span>,
    },
    {
      key: 'timestamp', header: 'Date', sortable: true, sortValue: t => t.timestamp,
      render: t => <span style={{ color: tokens.text.tertiary, fontSize: 11 }}>{new Date(t.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>,
    },
  ];

  return (
    <AdminLayout
      title="Wallet"
      subtitle="Customer wallet & transactions"
      requirePermission="wallet.credit"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Insights' }, { label: 'Wallet' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Wallet Management"
        subtitle="Track welcome bonuses, referral rewards, refunds, and customer wallet balances."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Insights' }, { label: 'Wallet' }]}
        actions={
          <Button tokens={tokens} variant="primary" size="md" onClick={() => setCreditOpen(true)}
            icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>}
          >Credit Wallet</Button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        <Panel tokens={tokens} title="Total Issued" subtitle="All-time credits">
          <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.success }}>₹{(stats.totalIssued / 1000).toFixed(1)}k</div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>Welcome + Referral bonuses</div>
        </Panel>
        <Panel tokens={tokens} title="Total Debited" subtitle="All-time debits">
          <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.error }}>₹{(stats.totalDebited / 1000).toFixed(1)}k</div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>Order payments + adjustments</div>
        </Panel>
        <Panel tokens={tokens} title="Outstanding Balance" subtitle="Across all customers">
          <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary }}>₹{(stats.outstanding / 1000).toFixed(1)}k</div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>8,950 active customers</div>
        </Panel>
        <Panel tokens={tokens} title="Transactions" subtitle="Last 30 days">
          <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary }}>{stats.txnCount}</div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>Wallet activity</div>
        </Panel>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'all', label: 'All Transactions' },
          { key: 'credit', label: 'Credits' },
          { key: 'debit', label: 'Debits' },
        ]} active={tab} onChange={setTab} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 240 }}>
          <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search txn ID or customer…" />
        </div>
      </div>

      <EnterpriseDataTable<WalletTxn>
        tokens={tokens} columns={columns} rows={filtered} getRowId={t => t.id}
        pageSize={12}
      />

      <Drawer
        tokens={tokens}
        open={creditOpen}
        onClose={() => setCreditOpen(false)}
        title="Credit Customer Wallet"
        subtitle="Add money to a customer's wallet"
        width={440}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => setCreditOpen(false)}>Cancel</Button>
            <Button tokens={tokens} variant="primary" onClick={() => {
              pushToast({ tone: 'success', title: 'Wallet credited', message: 'Customer notified via email + SMS.' });
              setCreditOpen(false);
            }}>Credit Wallet</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input tokens={tokens} label="Customer Email or Phone" placeholder="customer@email.com or +91…" />
          <Select tokens={tokens} label="Reason"
            options={[
              { value: 'welcome', label: 'Welcome Bonus' },
              { value: 'referral', label: 'Referral Bonus' },
              { value: 'refund', label: 'Refund' },
              { value: 'compensation', label: 'Compensation' },
              { value: 'manual', label: 'Manual Adjustment' },
            ]}
          />
          <Input tokens={tokens} label="Amount (₹)" type="number" placeholder="100" />
          <Textarea tokens={tokens} label="Note (optional)" placeholder="Reason for this credit…" />
          <div style={{
            background: tokens.status.infoBg, borderRadius: 8, padding: 10,
            border: `1px solid ${tokens.status.info}30`, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5,
          }}>
            💡 Customer will be notified via email and SMS. The credit will appear in their wallet transaction history.
          </div>
        </div>
      </Drawer>
    </AdminLayout>
  );
}
