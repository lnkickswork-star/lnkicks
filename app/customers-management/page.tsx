/**
 * LNKICKS Enterprise Admin — Customers CRM
 * ------------------------------------------------------------
 * Customer Relationship Management with:
 *  - Enterprise DataTable with customer avatars
 *  - Filters (search, login method, status)
 *  - Customer detail drawer with profile, wallet, orders,
 *    wishlist, referral, coupons, reward points, login history,
 *    support history, address, notes, activity timeline
 */

'use client';

import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Button, Badge, StatusPill, SearchInput, Drawer, Tabs, useToast,
  Avatar, KeyValue, Select,
} from '@/components/admin/ui';

interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loginMethod: 'Email' | 'Google' | 'OTP';
  status: 'Active' | 'Inactive' | 'Blocked';
  totalOrders: number;
  totalSpent: number;
  walletBalance: number;
  rewardPoints: number;
  joinedAt: number;
  lastLoginAt: number;
  address: string;
  referralCode: string;
  referredBy?: string;
}

const NAMES = [
  'Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Arjun Reddy', 'Sai Kumar',
  'Rohan Gupta', 'Karthik Iyer', 'Dev Malhotra', 'Kabir Nair', 'Ishaan Mehta',
  'Aanya Verma', 'Diya Agarwal', 'Saanvi Reddy', 'Ananya Iyer', 'Myra Kapoor',
  'Aadhya Jain', 'Pari Nair', 'Riya Menon', 'Sara Khan', 'Kiara Bose',
];

function generateCustomers(): AdminCustomer[] {
  return NAMES.map((name, i) => {
    const methods: AdminCustomer['loginMethod'][] = ['Email', 'Google', 'OTP'];
    const statuses: AdminCustomer['status'][] = ['Active', 'Active', 'Active', 'Inactive', 'Blocked'];
    const totalOrders = (i * 3) % 18;
    return {
      id: `cust-${1001 + i}`,
      name,
      email: name.toLowerCase().replace(' ', '.') + (i % 2 ? '@gmail.com' : '@yahoo.in'),
      phone: `+91 9${String(800000000 + i * 1234567).slice(0, 9)}`,
      loginMethod: methods[i % 3],
      status: statuses[i % 5],
      totalOrders,
      totalSpent: totalOrders * (5000 + (i * 137) % 15000),
      walletBalance: i % 3 === 0 ? 250 : 0,
      rewardPoints: (i * 23) % 480,
      joinedAt: Date.now() - (i + 1) * 86400_000 * 7,
      lastLoginAt: Date.now() - i * 3600_000 * 13,
      address: `${i + 12}, ${['Brigade Road', 'MG Road', 'Indiranagar', 'Koramangala'][i % 4]}, Bengaluru, Karnataka 56000${i % 9}`,
      referralCode: `LNK${(1000 + i * 17).toString().slice(-4)}`,
      referredBy: i > 0 && i % 3 === 0 ? NAMES[(i - 1) % NAMES.length] : undefined,
    };
  });
}

const ALL_CUSTOMERS = generateCustomers();

export default function CustomersManagementPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [customers] = useState<AdminCustomer[]>(ALL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusTab, setStatusTab] = useState('all');
  const [detail, setDetail] = useState<AdminCustomer | null>(null);
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletNote, setWalletNote] = useState('');

  const filtered = useMemo(() => customers.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q) && !c.phone.includes(q)) return false;
    }
    if (methodFilter !== 'All' && c.loginMethod !== methodFilter) return false;
    if (statusTab !== 'all' && c.status.toLowerCase() !== statusTab) return false;
    return true;
  }), [customers, search, methodFilter, statusTab]);

  const counts = useMemo(() => ({
    all: customers.length,
    active: customers.filter(c => c.status === 'Active').length,
    inactive: customers.filter(c => c.status === 'Inactive').length,
    blocked: customers.filter(c => c.status === 'Blocked').length,
  }), [customers]);

  function handleWalletCredit() {
    const amt = Number(walletAmount);
    if (!amt || amt <= 0) {
      pushToast({ tone: 'error', title: 'Invalid amount', message: 'Enter a positive number.' });
      return;
    }
    pushToast({ tone: 'success', title: 'Wallet credited', message: `₹${amt} to ${detail?.name}` });
    setWalletOpen(false);
    setWalletAmount('');
    setWalletNote('');
  }

  const columns: Column<AdminCustomer>[] = [
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      sortValue: c => c.name,
      render: c => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar tokens={tokens} name={c.name} size={36} color={tokens.chart.series[c.id.charCodeAt(5) % 6]} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: tokens.text.primary, fontSize: 12.5 }}>{c.name}</div>
            <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{c.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: c => <span style={{ fontSize: 11, color: tokens.text.secondary, fontFamily: 'ui-monospace, monospace' }}>{c.phone}</span>,
    },
    {
      key: 'loginMethod',
      header: 'Login',
      align: 'center',
      sortable: true,
      sortValue: c => c.loginMethod,
      render: c => <Badge tokens={tokens} tone={c.loginMethod === 'Google' ? 'info' : c.loginMethod === 'OTP' ? 'purple' : 'neutral'} size="sm">{c.loginMethod}</Badge>,
    },
    {
      key: 'orders',
      header: 'Orders',
      align: 'right',
      sortable: true,
      sortValue: c => c.totalOrders,
      render: c => <span style={{ fontWeight: 600, color: tokens.text.primary }}>{c.totalOrders}</span>,
    },
    {
      key: 'spent',
      header: 'Total Spent',
      align: 'right',
      sortable: true,
      sortValue: c => c.totalSpent,
      render: c => <span style={{ fontWeight: 700, color: tokens.text.primary }}>₹{c.totalSpent.toLocaleString('en-IN')}</span>,
    },
    {
      key: 'wallet',
      header: 'Wallet',
      align: 'right',
      sortable: true,
      sortValue: c => c.walletBalance,
      render: c => c.walletBalance > 0 ? (
        <span style={{ fontWeight: 600, color: tokens.status.success }}>₹{c.walletBalance}</span>
      ) : <span style={{ color: tokens.text.tertiary }}>—</span>,
    },
    {
      key: 'rewardPoints',
      header: 'Reward Pts',
      align: 'right',
      sortable: true,
      sortValue: c => c.rewardPoints,
      render: c => <Badge tokens={tokens} tone="warning" size="sm">{c.rewardPoints}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: c => c.status,
      render: c => <StatusPill tokens={tokens} status={c.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      sortable: false,
      render: c => (
        <div onClick={e => e.stopPropagation()}>
          <Button tokens={tokens} variant="ghost" size="sm" onClick={() => setDetail(c)}>View Profile</Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Customers"
      subtitle="CRM & customer management"
      requirePermission="customer.view"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Sales' }, { label: 'Customers' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Customer CRM"
        subtitle="Manage customer profiles, wallets, reward points, orders, support history, and activity timeline."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Sales' }, { label: 'Customers' }]}
        meta={<Badge tokens={tokens} tone="info">{customers.length} customers</Badge>}
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'success', title: 'Export started' })}
              icon={<DownloadIcon color={tokens.text.secondary} />}
            >Export</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'info', title: 'Bulk email', message: 'Compose campaign' })}
              icon={<MailIcon color={tokens.bg.app} />}
            >Send Campaign</Button>
          </>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Tabs
          tokens={tokens}
          tabs={[
            { key: 'all', label: 'All', badge: counts.all },
            { key: 'active', label: 'Active', badge: counts.active },
            { key: 'inactive', label: 'Inactive', badge: counts.inactive },
            { key: 'blocked', label: 'Blocked', badge: counts.blocked },
          ]}
          active={statusTab}
          onChange={setStatusTab}
        />
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 240 }}>
            <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search name, email, phone…" />
          </div>
          <Select
            tokens={tokens}
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            options={['All', 'Email', 'Google', 'OTP'].map(m => ({ value: m, label: m === 'All' ? 'All Methods' : m }))}
            style={{ height: 34, width: 140 }}
          />
        </div>
      </div>

      <EnterpriseDataTable<AdminCustomer>
        tokens={tokens}
        columns={columns}
        rows={filtered}
        getRowId={c => c.id}
        pageSize={12}
        onRowClick={c => setDetail(c)}
      />

      {/* CUSTOMER DETAIL DRAWER */}
      <Drawer
        tokens={tokens}
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.name}
        subtitle={detail?.email}
        width={560}
        footer={
          detail && (
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setWalletOpen(true)}>Credit Wallet</Button>
              <Button tokens={tokens} variant="outline" onClick={() => pushToast({ tone: 'info', title: 'Compose email', message: detail.email })}>Email</Button>
              <Button tokens={tokens} variant="primary" onClick={() => pushToast({ tone: 'success', title: 'Customer saved' })}>Save Notes</Button>
            </>
          )
        }
      >
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Profile header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 14, background: tokens.bg.surfaceAlt, borderRadius: 10,
            }}>
              <Avatar tokens={tokens} name={detail.name} size={48} color={tokens.chart.series[detail.id.charCodeAt(5) % 6]} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary }}>{detail.name}</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{detail.email} · {detail.phone}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  <Badge tokens={tokens} tone="neutral" size="sm">{detail.loginMethod}</Badge>
                  <StatusPill tokens={tokens} status={detail.status} />
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <StatBlock tokens={tokens} label="Orders" value={String(detail.totalOrders)} />
              <StatBlock tokens={tokens} label="Spent" value={`₹${detail.totalSpent.toLocaleString('en-IN')}`} />
              <StatBlock tokens={tokens} label="Wallet" value={`₹${detail.walletBalance}`} />
            </div>

            {/* Tabs would be here — using sections for simplicity */}
            <Section title="Customer Info">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <KeyValue tokens={tokens} label="Customer ID" value={detail.id} />
                <KeyValue tokens={tokens} label="Joined" value={new Date(detail.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
                <KeyValue tokens={tokens} label="Last Login" value={new Date(detail.lastLoginAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} />
                <KeyValue tokens={tokens} label="Reward Points" value={`${detail.rewardPoints} pts`} />
                <KeyValue tokens={tokens} label="Referral Code" value={detail.referralCode} />
                <KeyValue tokens={tokens} label="Referred By" value={detail.referredBy ?? '—'} />
              </div>
            </Section>

            <Section title="Shipping Address">
              <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.5 }}>
                {detail.address}
              </div>
            </Section>

            <Section title="Wallet Activity">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <WalletRow tokens={tokens} type="credit" title="Welcome Bonus" amount={50} date="Join date" />
                {detail.totalOrders > 0 && (
                  <WalletRow tokens={tokens} type="debit" title="Order LNK-2841" amount={-8899} date="2 days ago" />
                )}
                {detail.walletBalance > 0 && (
                  <WalletRow tokens={tokens} type="credit" title="Refund — Order LNK-2798" amount={500} date="5 days ago" />
                )}
              </div>
            </Section>

            <Section title="Recent Orders">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {detail.totalOrders === 0 ? (
                  <div style={{ fontSize: 12, color: tokens.text.tertiary, padding: 8 }}>No orders yet</div>
                ) : (
                  Array.from({ length: Math.min(3, detail.totalOrders) }).map((_, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 10px', borderRadius: 8, background: tokens.bg.surfaceAlt,
                    }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>
                          LNK-{2841 - i}
                        </div>
                        <div style={{ fontSize: 10, color: tokens.text.tertiary }}>
                          {new Date(Date.now() - i * 86400_000 * 3).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>₹{(8999 + i * 1500).toLocaleString('en-IN')}</div>
                        <StatusPill tokens={tokens} status={i === 0 ? 'Delivered' : 'Shipped'} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Section>

            <Section title="Wishlist">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Nike Dunk Low', 'Jordan 4 Bred', 'Yeezy 350 V2'].map(p => (
                  <Badge key={p} tokens={tokens} tone="neutral" size="sm">{p}</Badge>
                ))}
              </div>
            </Section>

            <Section title="Activity Timeline">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <ActivityRow tokens={tokens} time="2 hours ago" event="Logged in via Google" icon="🔐" />
                <ActivityRow tokens={tokens} time="3 days ago" event="Placed order LNK-2841 (₹18,999)" icon="🛒" />
                <ActivityRow tokens={tokens} time="1 week ago" event="Added 2 items to wishlist" icon="❤️" />
                <ActivityRow tokens={tokens} time="2 weeks ago" event="Used coupon WELCOME50" icon="🎟️" />
                <ActivityRow tokens={tokens} time="1 month ago" event="Joined LNKICKS" icon="🎉" />
              </div>
            </Section>

            <Section title="Internal Notes">
              <textarea
                placeholder="Add private note about this customer…"
                style={{
                  width: '100%', minHeight: 70, padding: 10, borderRadius: 8,
                  border: `1px solid ${tokens.border.subtle}`,
                  background: tokens.bg.surface, color: tokens.text.primary,
                  fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none',
                  resize: 'vertical',
                }}
              />
            </Section>
          </div>
        )}
      </Drawer>

      {/* WALLET CREDIT MODAL */}
      {walletOpen && (
        <Drawer
          tokens={tokens}
          open
          onClose={() => setWalletOpen(false)}
          title="Credit Wallet"
          subtitle={detail?.name}
          width={400}
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setWalletOpen(false)}>Cancel</Button>
              <Button tokens={tokens} variant="primary" onClick={handleWalletCredit}>Credit ₹{walletAmount || '0'}</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              background: tokens.status.successBg, borderRadius: 10, padding: 12,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{ fontSize: 20 }}>💰</div>
              <div>
                <div style={{ fontSize: 11, color: tokens.status.success, fontWeight: 600 }}>Current Balance</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: tokens.text.primary }}>₹{detail?.walletBalance ?? 0}</div>
              </div>
            </div>
            <Select tokens={tokens} label="Type"
              value="credit"
              onChange={() => {}}
              options={[
                { value: 'credit', label: 'Credit (Add money)' },
                { value: 'debit', label: 'Debit (Deduct money)' },
              ]}
            />
            <Select tokens={tokens} label="Reason"
              value="bonus"
              onChange={() => {}}
              options={[
                { value: 'bonus', label: 'Bonus / Welcome Reward' },
                { value: 'refund', label: 'Refund' },
                { value: 'compensation', label: 'Compensation' },
                { value: 'referral', label: 'Referral Bonus' },
                { value: 'manual', label: 'Manual Adjustment' },
              ]}
            />
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontSize: 11, fontWeight: 600, color: tokens.text.secondary }}>Amount (₹)</label>
              <input
                type="number"
                value={walletAmount}
                onChange={e => setWalletAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  width: '100%', height: 38, padding: '0 12px', borderRadius: 9,
                  border: `1px solid ${tokens.border.subtle}`, background: tokens.bg.surface,
                  color: tokens.text.primary, fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontSize: 11, fontWeight: 600, color: tokens.text.secondary }}>Note (optional)</label>
              <textarea
                value={walletNote}
                onChange={e => setWalletNote(e.target.value)}
                placeholder="Add a note for this transaction…"
                style={{
                  width: '100%', minHeight: 60, padding: 10, borderRadius: 8,
                  border: `1px solid ${tokens.border.subtle}`, background: tokens.bg.surface,
                  color: tokens.text.primary, fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </Drawer>
      )}
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { tokens } = useAdminTheme();
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: tokens.text.secondary,
        marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
      }}>{title}</div>
      {children}
    </div>
  );
}

function StatBlock({ tokens, label, value }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; label: string; value: string }) {
  return (
    <div style={{
      background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: tokens.text.primary }}>{value}</div>
    </div>
  );
}

function WalletRow({ tokens, type, title, amount, date }: {
  tokens: ReturnType<typeof useAdminTheme>['tokens'];
  type: 'credit' | 'debit'; title: string; amount: number; date: string;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 10px', borderRadius: 8, background: tokens.bg.surfaceAlt,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: type === 'credit' ? tokens.status.successBg : tokens.status.errorBg,
          color: type === 'credit' ? tokens.status.success : tokens.status.error,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
        }}>{type === 'credit' ? '↓' : '↑'}</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{title}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary }}>{date}</div>
        </div>
      </div>
      <div style={{
        fontSize: 13, fontWeight: 700,
        color: type === 'credit' ? tokens.status.success : tokens.status.error,
      }}>
        {type === 'credit' ? '+' : ''}₹{Math.abs(amount).toLocaleString('en-IN')}
      </div>
    </div>
  );
}

function ActivityRow({ tokens, time, event, icon }: {
  tokens: ReturnType<typeof useAdminTheme>['tokens'];
  time: string; event: string; icon: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, background: tokens.bg.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: tokens.text.primary }}>{event}</div>
        <div style={{ fontSize: 10, color: tokens.text.tertiary }}>{time}</div>
      </div>
    </div>
  );
}

function DownloadIcon({ color }: { color: string }) {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>;
}
function MailIcon({ color }: { color: string }) {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7L12 13 2 7" /></svg>;
}
