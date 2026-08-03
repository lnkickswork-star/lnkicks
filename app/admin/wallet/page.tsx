/**
 * LNKICKS Enterprise Admin — Wallet & Settlements Control Center
 * ------------------------------------------------------------
 * Comprehensive wallet experience with:
 *  - Balance hero (current, pending, refund, available)
 *  - Pending Payouts (settlement queue with bank details)
 *  - Settlement History (Razorpay X timeline)
 *  - Wallet Transactions (credit/debit with reason + customer)
 *  - Withdrawal Requests (admin approval queue)
 *  - Payment Timeline (chronological settlement events)
 *  - Transaction Search + Filters + Export
 *
 * Inspired by Stripe Dashboard, Razorpay X, Shopify Balance,
 * Payoneer, Wise Business.
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Button, Badge, StatusPill, SearchInput, Tabs, useToast, Panel, Select,
  Drawer, Input, Textarea, Avatar, Skeleton,
} from '@/components/admin/ui';

/* ----------------------------- Types ----------------------------- */

interface WalletTxn {
  id: string;
  customerName: string;
  customerEmail: string;
  type: 'Credit' | 'Debit';
  reason: 'Welcome Bonus' | 'Referral Bonus' | 'Refund' | 'Compensation' | 'Manual Adjustment' | 'Order Payment' | 'Cashback';
  amount: number;
  balanceAfter: number;
  timestamp: number;
  note?: string;
  orderId?: string;
}

interface Settlement {
  id: string;
  amount: number;
  fees: number;
  net: number;
  status: 'Processing' | 'Pending' | 'Completed' | 'Failed' | 'Scheduled';
  method: 'Razorpay X' | 'NEFT' | 'IMPS' | 'UPI';
  bankAccount: string;
  utr?: string;
  createdAt: number;
  processedAt?: number;
  expectedAt: number;
  transactionCount: number;
}

interface WithdrawalRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  method: 'Bank' | 'UPI';
  destination: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Completed';
  requestedAt: number;
  reason?: string;
}

interface TimelineEvent {
  id: string;
  type: 'settlement' | 'payout' | 'refund' | 'fee' | 'adjustment' | 'withdrawal';
  title: string;
  detail: string;
  amount?: number;
  ts: number;
  tone: 'success' | 'info' | 'warning' | 'critical' | 'neutral';
}

/* ----------------------------- Data ----------------------------- */

const NAMES = ['Aarav Sharma', 'Diya Verma', 'Karthik Iyer', 'Sara Khan', 'Rohan Gupta', 'Ananya Reddy', 'Vikram Nair', 'Priya Menon', 'Arjun Patel', 'Meera Joshi'];
const EMAILS = ['aarav.s@email.com', 'diya.v@email.com', 'karthik.i@email.com', 'sara.k@email.com', 'rohan.g@email.com', 'ananya.r@email.com', 'vikram.n@email.com', 'priya.m@email.com', 'arjun.p@email.com', 'meera.j@email.com'];

function buildTxns(): WalletTxn[] {
  const reasons: WalletTxn['reason'][] = ['Welcome Bonus', 'Referral Bonus', 'Refund', 'Compensation', 'Manual Adjustment', 'Order Payment', 'Cashback'];
  return Array.from({ length: 48 }, (_, i) => {
    const type: WalletTxn['type'] = i % 3 === 0 ? 'Debit' : 'Credit';
    const reason = reasons[i % reasons.length];
    const name = NAMES[i % NAMES.length];
    const email = EMAILS[i % EMAILS.length];
    const amount = type === 'Credit' ? 50 + (i * 13) % 950 : -((100 + (i * 47) % 4900));
    return {
      id: `txn-${5000 + i}`,
      customerName: name,
      customerEmail: email,
      type,
      reason,
      amount,
      balanceAfter: 100 + (i * 71) % 2400,
      timestamp: Date.now() - i * 3600_000 * 2.5,
      note: i % 4 === 0 ? 'Customer support compensation for delivery delay.' : undefined,
      orderId: type === 'Debit' ? `ORD-${4821 + (i % 60)}` : undefined,
    };
  });
}

const SETTLEMENTS: Settlement[] = [
  { id: 'SET-9182', amount: 84200, fees: 1684, net: 82516, status: 'Processing', method: 'Razorpay X', bankAccount: 'HDFC ••••4821', createdAt: Date.now() - 2 * 3600_000, expectedAt: Date.now() + 2 * 3600_000, transactionCount: 32 },
  { id: 'SET-9181', amount: 62500, fees: 1250, net: 61250, status: 'Pending', method: 'NEFT', bankAccount: 'HDFC ••••4821', createdAt: Date.now() - 4 * 3600_000, expectedAt: Date.now() + 18 * 3600_000, transactionCount: 24 },
  { id: 'SET-9180', amount: 112800, fees: 2256, net: 110544, status: 'Completed', method: 'Razorpay X', bankAccount: 'HDFC ••••4821', utr: 'UTR88421938', createdAt: Date.now() - 8 * 3600_000, processedAt: Date.now() - 5 * 3600_000, expectedAt: Date.now() - 5 * 3600_000, transactionCount: 41 },
  { id: 'SET-9179', amount: 48900, fees: 978, net: 47922, status: 'Completed', method: 'IMPS', bankAccount: 'HDFC ••••4821', utr: 'UTR88421102', createdAt: Date.now() - 26 * 3600_000, processedAt: Date.now() - 23 * 3600_000, expectedAt: Date.now() - 23 * 3600_000, transactionCount: 18 },
  { id: 'SET-9178', amount: 95600, fees: 1912, net: 93688, status: 'Completed', method: 'Razorpay X', bankAccount: 'HDFC ••••4821', utr: 'UTR88419847', createdAt: Date.now() - 50 * 3600_000, processedAt: Date.now() - 47 * 3600_000, expectedAt: Date.now() - 47 * 3600_000, transactionCount: 35 },
  { id: 'SET-9177', amount: 31200, fees: 624, net: 30576, status: 'Failed', method: 'NEFT', bankAccount: 'HDFC ••••4821', createdAt: Date.now() - 74 * 3600_000, expectedAt: Date.now() - 71 * 3600_000, transactionCount: 12 },
  { id: 'SET-9176', amount: 67400, fees: 1348, net: 66052, status: 'Scheduled', method: 'Razorpay X', bankAccount: 'HDFC ••••4821', createdAt: Date.now() - 1 * 86400_000, expectedAt: Date.now() + 1 * 86400_000, transactionCount: 26 },
];

const WITHDRAWALS: WithdrawalRequest[] = [
  { id: 'WD-2026-0142', customerName: 'Aarav Sharma', customerEmail: 'aarav.s@email.com', amount: 2400, method: 'UPI', destination: 'aarav.s@okhdfc', status: 'Pending', requestedAt: Date.now() - 30 * 60_000 },
  { id: 'WD-2026-0141', customerName: 'Diya Verma', customerEmail: 'diya.v@email.com', amount: 1800, method: 'Bank', destination: 'HDFC ••••2391', status: 'Pending', requestedAt: Date.now() - 2 * 3600_000 },
  { id: 'WD-2026-0140', customerName: 'Karthik Iyer', customerEmail: 'karthik.i@email.com', amount: 4500, method: 'UPI', destination: 'karthik.i@okaxis', status: 'Approved', requestedAt: Date.now() - 5 * 3600_000 },
  { id: 'WD-2026-0139', customerName: 'Sara Khan', customerEmail: 'sara.k@email.com', amount: 1200, method: 'UPI', destination: 'sara.k@okicici', status: 'Processing', requestedAt: Date.now() - 8 * 3600_000 },
  { id: 'WD-2026-0138', customerName: 'Rohan Gupta', customerEmail: 'rohan.g@email.com', amount: 980, method: 'Bank', destination: 'ICICI ••••8210', status: 'Completed', requestedAt: Date.now() - 1 * 86400_000 },
  { id: 'WD-2026-0137', customerName: 'Ananya Reddy', customerEmail: 'ananya.r@email.com', amount: 3200, method: 'UPI', destination: 'ananya.r@oksbi', status: 'Rejected', requestedAt: Date.now() - 2 * 86400_000, reason: 'Insufficient KYC' },
];

const TIMELINE: TimelineEvent[] = [
  { id: 'tl-1', type: 'settlement', title: 'Settlement SET-9182 processing', detail: '₹84,200 · 32 transactions · Razorpay X · HDFC ••••4821', amount: 84200, ts: Date.now() - 2 * 3600_000, tone: 'info' },
  { id: 'tl-2', type: 'withdrawal', title: 'Withdrawal request submitted', detail: 'Aarav Sharma · ₹2,400 · UPI · aarav.s@okhdfc', amount: -2400, ts: Date.now() - 30 * 60_000, tone: 'warning' },
  { id: 'tl-3', type: 'settlement', title: 'Settlement SET-9180 completed', detail: '₹1,12,800 net ₹1,10,544 · UTR88421938 · 41 transactions', amount: 110544, ts: Date.now() - 5 * 3600_000, tone: 'success' },
  { id: 'tl-4', type: 'fee', title: 'Processing fees deducted', detail: '₹2,256 · 2% of ₹1,12,800 settlement', amount: -2256, ts: Date.now() - 5 * 3600_000, tone: 'neutral' },
  { id: 'tl-5', type: 'refund', title: 'Refund issued to customer wallet', detail: 'Diya Verma · Order ORD-4892 · ₹1,499', amount: -1499, ts: Date.now() - 6 * 3600_000, tone: 'critical' },
  { id: 'tl-6', type: 'payout', title: 'Withdrawal completed', detail: 'Rohan Gupta · ₹980 · ICICI ••••8210', amount: -980, ts: Date.now() - 1 * 86400_000, tone: 'success' },
  { id: 'tl-7', type: 'settlement', title: 'Settlement SET-9179 completed', detail: '₹48,900 net ₹47,922 · UTR88421102', amount: 47922, ts: Date.now() - 23 * 3600_000, tone: 'success' },
  { id: 'tl-8', type: 'adjustment', title: 'Manual adjustment', detail: 'Vikram Nair · +₹500 · Welcome bonus credit', amount: 500, ts: Date.now() - 30 * 3600_000, tone: 'info' },
];

/* ----------------------------- Helpers ----------------------------- */

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function formatINR(n: number): string {
  return '₹' + Math.abs(n).toLocaleString('en-IN');
}

function timeUntil(ts: number): string {
  const diff = ts - Date.now();
  if (diff < 0) return timeAgo(ts);
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `in ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `in ${h}h`;
  const d = Math.floor(h / 24);
  return `in ${d}d`;
}

/* ----------------------------- Page ----------------------------- */

type Tab = 'overview' | 'transactions' | 'settlements' | 'withdrawals' | 'timeline';

export default function WalletPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [txns, setTxns] = useState<WalletTxn[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [creditOpen, setCreditOpen] = useState(false);
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<WalletTxn | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setTxns(buildTxns());
      setLoading(false);
    }, 280);
    return () => clearTimeout(t);
  }, []);

  const stats = useMemo(() => ({
    totalIssued: txns.filter(t => t.type === 'Credit').reduce((s, t) => s + t.amount, 0),
    totalDebited: Math.abs(txns.filter(t => t.type === 'Debit').reduce((s, t) => s + t.amount, 0)),
    outstanding: 142500,
    txnCount: txns.length,
    pendingPayouts: SETTLEMENTS.filter(s => s.status === 'Pending' || s.status === 'Processing' || s.status === 'Scheduled').reduce((sum, s) => sum + s.net, 0),
    pendingWithdrawals: WITHDRAWALS.filter(w => w.status === 'Pending').length,
    refundBalance: txns.filter(t => t.reason === 'Refund').reduce((s, t) => s + Math.abs(t.amount), 0),
    feesThisMonth: SETTLEMENTS.reduce((s, x) => s + x.fees, 0),
  }), [txns]);

  const filteredTxns = useMemo(() => txns.filter(t => {
    if (search) {
      const q = search.toLowerCase();
      if (!t.customerName.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q) && !t.customerEmail.toLowerCase().includes(q) && !(t.orderId?.toLowerCase().includes(q))) return false;
    }
    if (typeFilter !== 'all' && t.type.toLowerCase() !== typeFilter) return false;
    if (reasonFilter !== 'all' && t.reason !== reasonFilter) return false;
    return true;
  }), [txns, search, typeFilter, reasonFilter]);

  const handleApproveWithdrawal = useCallback((id: string) => {
    pushToast({ tone: 'success', title: 'Withdrawal approved', message: `${id} · payout queued` });
  }, [pushToast]);

  const handleRejectWithdrawal = useCallback((id: string) => {
    pushToast({ tone: 'info', title: 'Withdrawal rejected', message: `${id} · customer notified` });
  }, [pushToast]);

  const columns: Column<WalletTxn>[] = useMemo(() => [
    {
      key: 'id', header: 'Txn ID', sortable: true, sortValue: t => t.id,
      render: t => (
        <div>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: tokens.text.primary, fontWeight: 700 }}>{t.id}</span>
          {t.orderId && <div style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{t.orderId}</div>}
        </div>
      ),
    },
    {
      key: 'customer', header: 'Customer', sortable: true, sortValue: t => t.customerName,
      render: t => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar tokens={tokens} name={t.customerName} size={28} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{t.customerName}</div>
            <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{t.customerEmail}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'type', header: 'Type', align: 'center', sortable: true, sortValue: t => t.type,
      render: t => <Badge tokens={tokens} tone={t.type === 'Credit' ? 'success' : 'critical'} size="sm" dot>{t.type}</Badge>,
    },
    {
      key: 'reason', header: 'Reason', sortable: true, sortValue: t => t.reason,
      render: t => <span style={{ color: tokens.text.secondary, fontSize: 11 }}>{t.reason}</span>,
    },
    {
      key: 'amount', header: 'Amount', align: 'right', sortable: true, sortValue: t => t.amount,
      render: t => (
        <span style={{ fontWeight: 700, color: t.type === 'Credit' ? tokens.status.success : tokens.status.error, fontFamily: 'ui-monospace, monospace' }}>
          {t.type === 'Credit' ? '+' : '−'}{formatINR(t.amount)}
        </span>
      ),
    },
    {
      key: 'balanceAfter', header: 'Balance', align: 'right', sortable: true, sortValue: t => t.balanceAfter,
      render: t => <span style={{ color: tokens.text.secondary, fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>{formatINR(t.balanceAfter)}</span>,
    },
    {
      key: 'timestamp', header: 'Date', sortable: true, sortValue: t => t.timestamp,
      render: t => (
        <div>
          <div style={{ fontSize: 11, color: tokens.text.primary, fontWeight: 600 }}>{new Date(t.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{new Date(t.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      ),
    },
    {
      key: 'actions', header: '', align: 'right',
      render: t => <Button tokens={tokens} variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedTxn(t); }}>View</Button>,
    },
  ], [tokens]);

  return (
    <>
      <AdminLayout
        title="Wallet"
        subtitle="Customer wallet, payouts & settlements"
        requirePermission="wallet.credit"
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Wallet' }]}
      >
        <PageHeader
          tokens={tokens}
          title="Wallet & Settlements"
          subtitle="Track customer wallet balances, approve withdrawals, and reconcile settlements with full audit trail."
          breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Wallet' }]}
          meta={<Badge tokens={tokens} tone="warning" dot>{stats.pendingWithdrawals} pending withdrawals</Badge>}
          actions={
            <>
              <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'success', title: 'Export started', message: 'Transactions exporting to CSV.' })}>Export</Button>
              <Button tokens={tokens} variant="outline" size="md" onClick={() => setWithdrawalOpen(true)}>Review Withdrawals</Button>
              <Button tokens={tokens} variant="primary" size="md" onClick={() => setCreditOpen(true)}>Credit Wallet</Button>
            </>
          }
        />

        {/* Balance hero */}
        <div className="wal-balance-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="wal-balance-card">
                <Skeleton tokens={tokens} w="50%" h={10} />
                <div style={{ height: 8 }} />
                <Skeleton tokens={tokens} w="80%" h={28} />
                <div style={{ height: 8 }} />
                <Skeleton tokens={tokens} w="40%" h={10} />
              </div>
            ))
          ) : (
            <>
              <div className="wal-balance-card" style={{ borderTop: `3px solid ${tokens.status.success}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Outstanding Balance</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: tokens.text.primary, marginTop: 6, fontFamily: 'ui-monospace, monospace', letterSpacing: '-0.025em' }}>{formatINR(stats.outstanding)}</div>
                <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>8,950 active customers</div>
              </div>
              <div className="wal-balance-card" style={{ borderTop: `3px solid ${tokens.status.warning}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Pending Payouts</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: tokens.status.warning, marginTop: 6, fontFamily: 'ui-monospace, monospace', letterSpacing: '-0.025em' }}>{formatINR(stats.pendingPayouts)}</div>
                <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>{SETTLEMENTS.filter(s => s.status === 'Pending' || s.status === 'Processing').length} settlements in queue</div>
              </div>
              <div className="wal-balance-card" style={{ borderTop: `3px solid ${tokens.status.error}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Refund Balance</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: tokens.status.error, marginTop: 6, fontFamily: 'ui-monospace, monospace', letterSpacing: '-0.025em' }}>{formatINR(stats.refundBalance)}</div>
                <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>refunded this month</div>
              </div>
              <div className="wal-balance-card" style={{ borderTop: `3px solid ${tokens.text.accent}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Processing Fees (30d)</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: tokens.text.primary, marginTop: 6, fontFamily: 'ui-monospace, monospace', letterSpacing: '-0.025em' }}>{formatINR(stats.feesThisMonth)}</div>
                <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>~2% of settled volume</div>
              </div>
            </>
          )}
        </div>

        {/* Secondary KPI strip */}
        <div className="wal-kpi-grid">
          <div className="wal-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Total Issued</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: tokens.status.success, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>{formatINR(stats.totalIssued)}</div>
              </div>
              <span style={{ fontSize: 20 }}>↗</span>
            </div>
          </div>
          <div className="wal-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Total Debited</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: tokens.status.error, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>{formatINR(stats.totalDebited)}</div>
              </div>
              <span style={{ fontSize: 20 }}>↘</span>
            </div>
          </div>
          <div className="wal-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Transactions</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: tokens.text.primary, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>{stats.txnCount}</div>
              </div>
              <span style={{ fontSize: 20 }}>📊</span>
            </div>
          </div>
          <div className="wal-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Pending Withdrawals</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: tokens.status.warning, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>{stats.pendingWithdrawals}</div>
              </div>
              <span style={{ fontSize: 20 }}>⏳</span>
            </div>
          </div>
          <div className="wal-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Settlements (30d)</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: tokens.text.primary, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>{SETTLEMENTS.length}</div>
              </div>
              <span style={{ fontSize: 20 }}>🏦</span>
            </div>
          </div>
          <div className="wal-kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Failed Payouts</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: tokens.status.error, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>{SETTLEMENTS.filter(s => s.status === 'Failed').length}</div>
              </div>
              <span style={{ fontSize: 20 }}>⚠️</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tabs tokens={tokens} tabs={[
            { key: 'overview', label: 'Overview' },
            { key: 'transactions', label: 'Transactions', badge: stats.txnCount },
            { key: 'settlements', label: 'Settlements', badge: SETTLEMENTS.length },
            { key: 'withdrawals', label: 'Withdrawals', badge: stats.pendingWithdrawals },
            { key: 'timeline', label: 'Payment Timeline' },
          ]} active={tab} onChange={(t) => setTab(t as Tab)} />
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <div className="wal-2col">
            <Panel tokens={tokens} title="Pending Settlements" subtitle="Awaiting payout to your bank account"
              action={<Button tokens={tokens} variant="ghost" size="sm" onClick={() => setTab('settlements')}>View all →</Button>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SETTLEMENTS.filter(s => s.status === 'Pending' || s.status === 'Processing' || s.status === 'Scheduled').map(s => (
                  <div key={s.id} className="wal-settle-row" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt, gap: 12,
                  }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{s.id}</span>
                        <StatusPill tokens={tokens} status={s.status} />
                      </div>
                      <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>
                        {s.method} · {s.bankAccount} · {s.transactionCount} txns · expected {timeUntil(s.expectedAt)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{formatINR(s.net)}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>net · fee {formatINR(s.fees)}</div>
                    </div>
                  </div>
                ))}
                {SETTLEMENTS.filter(s => s.status === 'Pending' || s.status === 'Processing' || s.status === 'Scheduled').length === 0 && (
                  <div style={{ padding: 24, textAlign: 'center', color: tokens.text.tertiary, fontSize: 12 }}>No pending settlements.</div>
                )}
              </div>
            </Panel>

            <Panel tokens={tokens} title="Recent Withdrawal Requests" subtitle="Customer payout requests awaiting review"
              action={<Button tokens={tokens} variant="ghost" size="sm" onClick={() => setTab('withdrawals')}>View all →</Button>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {WITHDRAWALS.slice(0, 4).map(w => (
                  <div key={w.id} className="wal-wd-row" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt, gap: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                      <Avatar tokens={tokens} name={w.customerName} size={32} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.customerName}</div>
                        <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{w.method} · {w.destination} · {timeAgo(w.requestedAt)}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{formatINR(w.amount)}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
                      <StatusPill tokens={tokens} status={w.status} />
                      {w.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <Button tokens={tokens} variant="primary" size="sm" onClick={() => handleApproveWithdrawal(w.id)}>✓</Button>
                          <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleRejectWithdrawal(w.id)}>✕</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        )}

        {/* Transactions tab */}
        {tab === 'transactions' && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 280, flex: 1, minWidth: 220 }}>
                <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search txn ID, customer, email, order…" />
              </div>
              <Select tokens={tokens} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'credit', label: 'Credits' },
                  { value: 'debit', label: 'Debits' },
                ]}
                style={{ height: 34, width: 130 }}
              />
              <Select tokens={tokens} value={reasonFilter} onChange={e => setReasonFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Reasons' },
                  { value: 'Welcome Bonus', label: 'Welcome Bonus' },
                  { value: 'Referral Bonus', label: 'Referral Bonus' },
                  { value: 'Refund', label: 'Refund' },
                  { value: 'Compensation', label: 'Compensation' },
                  { value: 'Manual Adjustment', label: 'Manual Adjustment' },
                  { value: 'Order Payment', label: 'Order Payment' },
                  { value: 'Cashback', label: 'Cashback' },
                ]}
                style={{ height: 34, width: 180 }}
              />
              <div style={{ flex: 1 }} />
              <Badge tokens={tokens} tone="neutral" size="sm">{filteredTxns.length} of {txns.length}</Badge>
            </div>
            <EnterpriseDataTable<WalletTxn>
              tokens={tokens} columns={columns} rows={filteredTxns} getRowId={t => t.id}
              pageSize={15}
              loading={loading}
              onRowClick={(t) => setSelectedTxn(t)}
              defaultSort={{ key: 'timestamp', dir: 'desc' }}
            />
          </>
        )}

        {/* Settlements tab */}
        {tab === 'settlements' && (
          <Panel tokens={tokens} title="Settlement History" subtitle="All payouts to your bank account"
            action={<Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'success', title: 'Export started' })}>Export CSV</Button>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SETTLEMENTS.map(s => {
                const statusColor = s.status === 'Completed' ? tokens.status.success : s.status === 'Processing' ? tokens.status.info : s.status === 'Pending' || s.status === 'Scheduled' ? tokens.status.warning : s.status === 'Failed' ? tokens.status.error : tokens.text.tertiary;
                return (
                  <div key={s.id} className="wal-settle-detail" style={{
                    display: 'grid', gridTemplateColumns: 'minmax(180px, 1.5fr) 100px 1fr 1fr 140px 100px',
                    gap: 12, padding: '14px 16px', borderRadius: 10, background: tokens.bg.surfaceAlt, alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{s.id}</span>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor }} />
                      </div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>
                        {s.createdAt === s.processedAt ? 'Created ' : 'Created '}
                        {timeAgo(s.createdAt)}{s.processedAt ? ` · processed ${timeAgo(s.processedAt)}` : ` · expected ${timeUntil(s.expectedAt)}`}
                      </div>
                      {s.utr && <div style={{ fontSize: 10, color: tokens.text.secondary, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>UTR: {s.utr}</div>}
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Method</div>
                      <div style={{ fontSize: 11, color: tokens.text.primary, fontWeight: 600, marginTop: 2 }}>{s.method}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{s.bankAccount}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Gross</div>
                      <div style={{ fontSize: 12, color: tokens.text.primary, fontWeight: 700, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{formatINR(s.amount)}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{s.transactionCount} transactions</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Fees · Net</div>
                      <div style={{ fontSize: 11, color: tokens.status.error, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>−{formatINR(s.fees)}</div>
                      <div style={{ fontSize: 12, color: tokens.text.primary, fontWeight: 800, fontFamily: 'ui-monospace, monospace' }}>{formatINR(s.net)}</div>
                    </div>
                    <StatusPill tokens={tokens} status={s.status} />
                    <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Opening settlement', message: s.id })}>View</Button>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}

        {/* Withdrawals tab */}
        {tab === 'withdrawals' && (
          <Panel tokens={tokens} title="Withdrawal Requests" subtitle="Customer-initiated payout requests"
            action={<Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'success', title: 'Bulk approved', message: 'All pending withdrawals approved.' })}>Approve All Pending</Button>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {WITHDRAWALS.map(w => (
                <div key={w.id} className="wal-wd-detail" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 10, background: tokens.bg.surfaceAlt, gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                    <Avatar tokens={tokens} name={w.customerName} size={40} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{w.customerName}</span>
                        <span style={{ fontSize: 11, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace' }}>{w.id}</span>
                        <StatusPill tokens={tokens} status={w.status} />
                      </div>
                      <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{w.customerEmail}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>
                        {w.method} → {w.destination} · requested {timeAgo(w.requestedAt)}{w.reason ? ` · reason: ${w.reason}` : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{formatINR(w.amount)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {w.status === 'Pending' && (
                      <>
                        <Button tokens={tokens} variant="primary" size="sm" onClick={() => handleApproveWithdrawal(w.id)}>Approve</Button>
                        <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleRejectWithdrawal(w.id)}>Reject</Button>
                      </>
                    )}
                    {w.status !== 'Pending' && <Button tokens={tokens} variant="ghost" size="sm">View</Button>}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {/* Timeline tab */}
        {tab === 'timeline' && (
          <Panel tokens={tokens} title="Payment Timeline" subtitle="Chronological view of all money movements">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', paddingLeft: 24 }}>
              <div style={{ position: 'absolute', left: 9, top: 8, bottom: 8, width: 2, background: tokens.border.subtle }} />
              {TIMELINE.map((e, i) => {
                const toneColor = e.tone === 'success' ? tokens.status.success : e.tone === 'warning' ? tokens.status.warning : e.tone === 'critical' ? tokens.status.error : e.tone === 'info' ? tokens.status.info : tokens.text.tertiary;
                return (
                  <div key={e.id} style={{ position: 'relative', paddingBottom: i === TIMELINE.length - 1 ? 0 : 18, animation: `walFadeIn 360ms cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both` }}>
                    <div style={{ position: 'absolute', left: -24, top: 4, width: 14, height: 14, borderRadius: '50%', background: toneColor, border: `3px solid ${tokens.bg.surface}`, boxShadow: `0 0 0 2px ${toneColor}30` }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{e.title}</div>
                        <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{e.detail}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {e.amount !== undefined && (
                          <div style={{ fontSize: 12, fontWeight: 700, color: e.amount > 0 ? tokens.status.success : tokens.status.error, fontFamily: 'ui-monospace, monospace' }}>
                            {e.amount > 0 ? '+' : '−'}{formatINR(e.amount)}
                          </div>
                        )}
                        <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{timeAgo(e.ts)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}
      </AdminLayout>

      {/* Txn Detail Drawer */}
      {selectedTxn && (
        <Drawer
          tokens={tokens}
          open={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          title={selectedTxn.id}
          subtitle={`${selectedTxn.type} · ${selectedTxn.reason}`}
          width={460}
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setSelectedTxn(null)}>Close</Button>
              <Button tokens={tokens} variant="outline" onClick={() => pushToast({ tone: 'info', title: 'Opening customer', message: selectedTxn.customerName })}>View Customer</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: 16, borderRadius: 12, background: selectedTxn.type === 'Credit' ? `${tokens.status.success}15` : `${tokens.status.error}15`, border: `1px solid ${selectedTxn.type === 'Credit' ? `${tokens.status.success}30` : `${tokens.status.error}30`}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.4 }}>{selectedTxn.type}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: selectedTxn.type === 'Credit' ? tokens.status.success : tokens.status.error, marginTop: 4, fontFamily: 'ui-monospace, monospace' }}>
                {selectedTxn.type === 'Credit' ? '+' : '−'}{formatINR(selectedTxn.amount)}
              </div>
              <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 4 }}>Balance after: <strong style={{ color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{formatINR(selectedTxn.balanceAfter)}</strong></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: 11 }}>
              <div><span style={{ color: tokens.text.tertiary }}>Customer:</span> <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{selectedTxn.customerName}</span></div>
              <div><span style={{ color: tokens.text.tertiary }}>Email:</span> <span style={{ color: tokens.text.primary }}>{selectedTxn.customerEmail}</span></div>
              <div><span style={{ color: tokens.text.tertiary }}>Reason:</span> <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{selectedTxn.reason}</span></div>
              <div><span style={{ color: tokens.text.tertiary }}>Order:</span> <span style={{ color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{selectedTxn.orderId ?? '—'}</span></div>
              <div><span style={{ color: tokens.text.tertiary }}>Date:</span> <span style={{ color: tokens.text.primary }}>{new Date(selectedTxn.timestamp).toLocaleString('en-IN')}</span></div>
            </div>
            {selectedTxn.note && (
              <div style={{ padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt, fontSize: 11, color: tokens.text.secondary }}>
                <strong style={{ color: tokens.text.primary }}>Note:</strong> {selectedTxn.note}
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* Credit Wallet Drawer */}
      <Drawer
        tokens={tokens}
        open={creditOpen}
        onClose={() => setCreditOpen(false)}
        title="Credit Customer Wallet"
        subtitle="Add money to a customer's wallet"
        width={460}
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
              { value: 'cashback', label: 'Cashback' },
            ]}
          />
          <Input tokens={tokens} label="Amount (₹)" type="number" placeholder="100" />
          <Textarea tokens={tokens} label="Note (optional)" placeholder="Reason for this credit…" />
          <div style={{ background: `${tokens.status.info}15`, borderRadius: 8, padding: 10, border: `1px solid ${tokens.status.info}30`, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
            💡 Customer will be notified via email and SMS. The credit will appear in their wallet transaction history. This action is audit logged.
          </div>
        </div>
      </Drawer>

      {/* Withdrawal Review Drawer */}
      <Drawer
        tokens={tokens}
        open={withdrawalOpen}
        onClose={() => setWithdrawalOpen(false)}
        title="Withdrawal Review Queue"
        subtitle={`${WITHDRAWALS.filter(w => w.status === 'Pending').length} pending requests`}
        width={520}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => setWithdrawalOpen(false)}>Close</Button>
            <Button tokens={tokens} variant="primary" onClick={() => {
              pushToast({ tone: 'success', title: 'All approved', message: 'Pending withdrawals queued for payout.' });
              setWithdrawalOpen(false);
            }}>Approve All</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {WITHDRAWALS.filter(w => w.status === 'Pending').map(w => (
            <div key={w.id} style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar tokens={tokens} name={w.customerName} size={28} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{w.customerName}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary }}>{w.method} · {w.destination}</div>
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{formatINR(w.amount)}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Button tokens={tokens} variant="primary" size="sm" onClick={() => handleApproveWithdrawal(w.id)}>Approve</Button>
                <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleRejectWithdrawal(w.id)}>Reject</Button>
              </div>
            </div>
          ))}
          {WITHDRAWALS.filter(w => w.status === 'Pending').length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: tokens.text.tertiary, fontSize: 12 }}>No pending withdrawals.</div>
          )}
        </div>
      </Drawer>

      <style jsx>{`
        :global(.wal-balance-grid) {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 14px;
        }
        :global(.wal-kpi-grid) {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 16px;
        }
        :global(.wal-balance-card) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 14px;
          padding: 16px;
          box-shadow: ${tokens.shadow.sm};
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1), box-shadow 240ms cubic-bezier(0.16,1,0.3,1), border-color 240ms ease;
          animation: walFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.wal-balance-card:hover) {
          transform: translateY(-2px);
          box-shadow: ${tokens.shadow.md};
        }
        :global(.wal-kpi-card) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 12px;
          padding: 12px;
          box-shadow: ${tokens.shadow.sm};
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1), box-shadow 240ms cubic-bezier(0.16,1,0.3,1), border-color 240ms ease;
          animation: walFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.wal-kpi-card:hover) {
          transform: translateY(-1px);
          border-color: ${tokens.border.strong};
        }
        :global(.wal-2col) {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 16px;
          align-items: start;
        }
        :global(.wal-settle-row), :global(.wal-wd-row), :global(.wal-settle-detail), :global(.wal-wd-detail) {
          transition: background 180ms ease, transform 180ms ease;
        }
        :global(.wal-settle-row:hover), :global(.wal-wd-row:hover), :global(.wal-settle-detail:hover), :global(.wal-wd-detail:hover) {
          background: ${tokens.bg.hover} !important;
        }
        @keyframes walFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1400px) {
          :global(.wal-kpi-grid) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 1100px) {
          :global(.wal-balance-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          :global(.wal-kpi-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          :global(.wal-2col) { grid-template-columns: minmax(0, 1fr); }
          :global(.wal-settle-detail) { grid-template-columns: 1fr !important; gap: 8px; }
        }
        @media (max-width: 640px) {
          :global(.wal-balance-grid) { grid-template-columns: minmax(0, 1fr); }
          :global(.wal-kpi-grid) { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
    </>
  );
}
