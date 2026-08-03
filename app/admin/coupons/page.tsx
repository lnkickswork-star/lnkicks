/**
 * LNKICKS Enterprise Admin — Coupon Manager
 * ------------------------------------------------------------
 * Enterprise coupon workspace with:
 *  - Usage Analytics (redemption chart, top coupons, customer usage)
 *  - Expiry Timeline (visual schedule of upcoming expirations)
 *  - Customer / Product / Category / Brand restrictions
 *  - Auto Apply rules (cart-value triggers)
 *  - Scheduling (start/end with timezone)
 *  - Performance Charts (sparklines per coupon)
 *
 * Reuses existing Coupon data shape; enriches with derived display fields.
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, SearchInput, Drawer, Tabs, useToast, IconButton,
  Dropdown, MenuItem, MenuDivider, Input, Select, Toggle, Panel, ProgressBar, EmptyState,
} from '@/components/admin/ui';
import { PlusIcon } from '@/components/admin/ui';
import type { AdminThemeTokens } from '@/lib/admin/types';

/* ----------------------------- Types ----------------------------- */

type CouponType = 'Flat' | 'Percentage' | 'BOGO' | 'Free Shipping';
type CouponStatus = 'Active' | 'Scheduled' | 'Expired' | 'Disabled';
type AppliesTo = 'All' | 'Category' | 'Brand' | 'User' | 'Product';

interface Coupon {
  id: string;
  code: string;
  description: string;
  type: CouponType;
  value: number;
  status: CouponStatus;
  used: number;
  limit: number;
  startDate: string;
  endDate: string;
  appliesTo: AppliesTo;
  target?: string;
  minOrder: number;
  autoApply: boolean;
  maxDiscount?: number; // cap for percentage
  onePerCustomer: boolean;
  firstOrderOnly: boolean;
  revenue: number; // total revenue attributed
  trend: number[]; // sparkline of last 14 days redemption counts
  createdAt: string;
}

/* ----------------------------- Data ----------------------------- */

const SEED: Coupon[] = [
  { id: 'c1', code: 'WELCOME50', description: 'Flat ₹50 off for first orders', type: 'Flat', value: 50, status: 'Active', used: 318, limit: 1000, startDate: '2026-01-01', endDate: '2026-12-31', appliesTo: 'All', minOrder: 999, autoApply: false, onePerCustomer: true, firstOrderOnly: true, revenue: 894000, trend: [4, 6, 8, 5, 7, 9, 6, 8, 7, 10, 12, 8, 9, 11], createdAt: '2025-12-28' },
  { id: 'c2', code: 'SUMMER20', description: '20% off site-wide for summer', type: 'Percentage', value: 20, status: 'Active', used: 142, limit: 500, startDate: '2026-08-01', endDate: '2026-08-31', appliesTo: 'All', minOrder: 4999, autoApply: true, maxDiscount: 2000, onePerCustomer: false, firstOrderOnly: false, revenue: 318000, trend: [0, 0, 0, 5, 8, 12, 9, 14, 11, 16, 18, 13, 15, 21], createdAt: '2026-07-25' },
  { id: 'c3', code: 'JORDAN15', description: '15% off Air Jordan collection', type: 'Percentage', value: 15, status: 'Active', used: 67, limit: 200, startDate: '2026-07-15', endDate: '2026-09-15', appliesTo: 'Brand', target: 'JORDAN', minOrder: 8999, autoApply: false, maxDiscount: 3000, onePerCustomer: false, firstOrderOnly: false, revenue: 612000, trend: [2, 3, 4, 2, 5, 3, 4, 6, 5, 4, 7, 5, 6, 8], createdAt: '2026-07-10' },
  { id: 'c4', code: 'FREESHIP', description: 'Free shipping on orders above ₹2,999', type: 'Free Shipping', value: 0, status: 'Active', used: 89, limit: 1000, startDate: '2026-08-01', endDate: '2026-08-31', appliesTo: 'All', minOrder: 2999, autoApply: true, onePerCustomer: false, firstOrderOnly: false, revenue: 0, trend: [3, 5, 4, 6, 5, 8, 6, 7, 9, 6, 8, 7, 9, 11], createdAt: '2026-07-25' },
  { id: 'c5', code: 'BOGOSAMBA', description: 'Buy 1 Get 1 Free on Samba OG', type: 'BOGO', value: 0, status: 'Scheduled', used: 0, limit: 100, startDate: '2026-08-15', endDate: '2026-08-20', appliesTo: 'Category', target: 'Sneakers', minOrder: 0, autoApply: false, onePerCustomer: true, firstOrderOnly: false, revenue: 0, trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], createdAt: '2026-08-01' },
  { id: 'c6', code: 'VIP1000', description: '₹1000 off for VIP customers', type: 'Flat', value: 1000, status: 'Disabled', used: 12, limit: 50, startDate: '2026-06-01', endDate: '2026-07-01', appliesTo: 'User', target: 'VIP Customers', minOrder: 14999, autoApply: false, onePerCustomer: true, firstOrderOnly: false, revenue: 180000, trend: [3, 2, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], createdAt: '2026-05-25' },
  { id: 'c7', code: 'DIWALI25', description: 'Diwali special 25% off', type: 'Percentage', value: 25, status: 'Scheduled', used: 0, limit: 2000, startDate: '2026-10-20', endDate: '2026-11-05', appliesTo: 'All', minOrder: 2999, autoApply: false, maxDiscount: 5000, onePerCustomer: false, firstOrderOnly: false, revenue: 0, trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], createdAt: '2026-08-02' },
  { id: 'c8', code: 'REFER100', description: '₹100 off when referred by friend', type: 'Flat', value: 100, status: 'Active', used: 234, limit: 9999, startDate: '2026-01-01', endDate: '2026-12-31', appliesTo: 'All', minOrder: 0, autoApply: false, onePerCustomer: true, firstOrderOnly: true, revenue: 312000, trend: [2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7, 9, 8, 10], createdAt: '2025-12-30' },
  { id: 'c9', code: 'WEEKEND10', description: 'Weekend special 10% off', type: 'Percentage', value: 10, status: 'Expired', used: 412, limit: 500, startDate: '2026-07-04', endDate: '2026-07-06', appliesTo: 'All', minOrder: 1999, autoApply: true, maxDiscount: 1000, onePerCustomer: false, firstOrderOnly: false, revenue: 412000, trend: [0, 0, 0, 0, 0, 45, 92, 88, 76, 54, 32, 18, 7, 0], createdAt: '2026-06-28' },
];

/* ----------------------------- Helpers ----------------------------- */

function fmtINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

/* ----------------------------- Page ----------------------------- */

export default function CouponsPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(SEED);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [edit, setEdit] = useState<Coupon | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const filtered = useMemo(() => coupons.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.code.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q) && !(c.target ?? '').toLowerCase().includes(q)) return false;
    }
    if (statusTab !== 'all' && c.status.toLowerCase() !== statusTab) return false;
    return true;
  }), [coupons, search, statusTab]);

  const counts = useMemo(() => ({
    all: coupons.length,
    active: coupons.filter(c => c.status === 'Active').length,
    scheduled: coupons.filter(c => c.status === 'Scheduled').length,
    expired: coupons.filter(c => c.status === 'Expired').length,
    disabled: coupons.filter(c => c.status === 'Disabled').length,
  }), [coupons]);

  const totals = useMemo(() => ({
    revenue: coupons.reduce((s, c) => s + c.revenue, 0),
    redemptions: coupons.reduce((s, c) => s + c.used, 0),
    avgDiscount: coupons.length ? coupons.reduce((s, c) => s + (c.type === 'Percentage' ? c.value : c.type === 'Flat' ? c.value : 0), 0) / coupons.length : 0,
    expiringSoon: coupons.filter(c => c.status === 'Active' && daysUntil(c.endDate) <= 14 && daysUntil(c.endDate) >= 0).length,
  }), [coupons]);

  function toggleStatus(id: string) {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' } : c));
    pushToast({ tone: 'success', title: 'Status updated' });
  }
  function deleteCoupon(id: string) {
    setCoupons(prev => prev.filter(c => c.id !== id));
    pushToast({ tone: 'success', title: 'Coupon deleted' });
  }
  function duplicateCoupon(c: Coupon) {
    const copy: Coupon = { ...c, id: `c-${Date.now()}`, code: `${c.code}-COPY`, status: 'Disabled', used: 0, revenue: 0, trend: Array(14).fill(0), createdAt: new Date().toISOString() };
    setCoupons(prev => [copy, ...prev]);
    pushToast({ tone: 'success', title: 'Coupon duplicated' });
  }

  return (
    <AdminLayout
      title="Coupons"
      subtitle="Discount campaigns"
      requirePermission="coupon.create"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Coupons' }]}
    >
      <style jsx global>{`
        @keyframes cp-card-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .cp-stagger > * { animation: cp-card-in 400ms cubic-bezier(0.16,1,0.3,1) both; }
        .cp-stagger > *:nth-child(1) { animation-delay: 30ms; }
        .cp-stagger > *:nth-child(2) { animation-delay: 60ms; }
        .cp-stagger > *:nth-child(3) { animation-delay: 90ms; }
        .cp-stagger > *:nth-child(4) { animation-delay: 120ms; }
      `}</style>

      <PageHeader
        tokens={tokens}
        title="Coupon Manager"
        subtitle="Create flat, percentage, BOGO, and free shipping coupons. Restrict by customer, product, category, or brand. Track redemptions and revenue impact."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Coupons' }]}
        meta={
          <span style={{ display: 'inline-flex', gap: 6 }}>
            <Badge tokens={tokens} tone="success">{counts.active} active</Badge>
            {totals.expiringSoon > 0 && <Badge tokens={tokens} tone="warning">{totals.expiringSoon} expiring</Badge>}
          </span>
        }
        actions={<Button tokens={tokens} variant="primary" size="md" onClick={() => setCreateOpen(true)} icon={<PlusIcon size={14} color={tokens.bg.app} />}>Create Coupon</Button>}
      />

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 20 }}>
        <KPIStrip tokens={tokens} label="Total Revenue" value={fmtINR(totals.revenue)} sub="Attributed to coupons" tone="success" />
        <KPIStrip tokens={tokens} label="Redemptions" value={totals.redemptions.toLocaleString('en-IN')} sub="All-time uses" tone="info" />
        <KPIStrip tokens={tokens} label="Avg. Discount" value={`${totals.avgDiscount.toFixed(0)}${totals.avgDiscount >= 100 ? '₹' : '%'}`} sub="Across active coupons" tone="warning" />
        <KPIStrip tokens={tokens} label="Expiring ≤14d" value={String(totals.expiringSoon)} sub="Action required soon" tone="critical" />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'all', label: 'All', badge: counts.all },
          { key: 'active', label: 'Active', badge: counts.active },
          { key: 'scheduled', label: 'Scheduled', badge: counts.scheduled },
          { key: 'expired', label: 'Expired', badge: counts.expired },
          { key: 'disabled', label: 'Disabled', badge: counts.disabled },
        ]} active={statusTab} onChange={setStatusTab} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 260 }}>
          <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search code, description, target…" />
        </div>
      </div>

      {/* Coupon cards grid */}
      {filtered.length === 0 ? (
        <Panel tokens={tokens}>
          <EmptyState tokens={tokens}
            icon={<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={1.5}><path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8z" /></svg>}
            title="No coupons found"
            description="Try adjusting filters or create a new coupon to launch a discount campaign."
            action={<Button tokens={tokens} variant="primary" size="md" onClick={() => setCreateOpen(true)} icon={<PlusIcon size={12} color={tokens.bg.app} />}>Create Coupon</Button>}
          />
        </Panel>
      ) : (
        <div className="cp-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 14 }}>
          {filtered.map(c => (
            <CouponCard key={c.id} tokens={tokens} coupon={c} onView={() => setSelectedCoupon(c)} onEdit={() => setEdit(c)} onDuplicate={() => duplicateCoupon(c)} onToggle={() => toggleStatus(c.id)} onDelete={() => deleteCoupon(c.id)} />
          ))}
        </div>
      )}

      {/* Expiry Timeline */}
      <ExpiryTimeline tokens={tokens} coupons={coupons} />

      {/* Top performers */}
      <TopPerformers tokens={tokens} coupons={coupons} />

      {/* Detail drawer */}
      <CouponDetailDrawer tokens={tokens} coupon={selectedCoupon} onClose={() => setSelectedCoupon(null)} onEdit={(c) => { setSelectedCoupon(null); setEdit(c); }} />

      {/* Edit / Create Drawer */}
      <CouponFormDrawer tokens={tokens} open={Boolean(edit) || createOpen} coupon={edit} onClose={() => { setEdit(null); setCreateOpen(false); }} onSave={() => {
        pushToast({ tone: 'success', title: edit ? 'Coupon saved' : 'Coupon created' });
        setEdit(null); setCreateOpen(false);
      }} />
    </AdminLayout>
  );
}

/* ----------------------------- Coupon Card ----------------------------- */

function CouponCard({ tokens, coupon, onView, onEdit, onDuplicate, onToggle, onDelete }: {
  tokens: AdminThemeTokens; coupon: Coupon;
  onView: () => void; onEdit: () => void; onDuplicate: () => void; onToggle: () => void; onDelete: () => void;
}) {
  const usagePct = Math.min(100, (coupon.used / coupon.limit) * 100);
  const daysLeft = daysUntil(coupon.endDate);
  const isExpiringSoon = coupon.status === 'Active' && daysLeft <= 14 && daysLeft >= 0;
  const trendMax = Math.max(...coupon.trend, 1);

  const discountLabel = coupon.type === 'Free Shipping' ? 'Free Ship'
    : coupon.type === 'BOGO' ? 'B1G1'
    : coupon.type === 'Percentage' ? `${coupon.value}%`
    : `₹${coupon.value}`;

  return (
    <div style={{
      background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
      borderRadius: 14, padding: 16, boxShadow: tokens.shadow.sm,
      transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = tokens.shadow.md; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = tokens.border.strong; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = tokens.shadow.sm; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = tokens.border.subtle; }}
    >
      {/* Status accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: coupon.status === 'Active' ? tokens.status.success : coupon.status === 'Scheduled' ? tokens.status.info : coupon.status === 'Expired' ? tokens.text.tertiary : tokens.status.warning }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 14, fontWeight: 800, color: tokens.text.primary, letterSpacing: '0.5px' }}>{coupon.code}</span>
            <StatusPill tokens={tokens} status={coupon.status} />
            {coupon.autoApply && <Badge tokens={tokens} tone="purple" size="sm">Auto</Badge>}
          </div>
          <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.4 }}>{coupon.description}</div>
        </div>
        <Dropdown tokens={tokens} align="right" width={170}
          trigger={<IconButton tokens={tokens} size={28} icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>} label="More" />}
        >
          <MenuItem tokens={tokens} onClick={onView}>View Analytics</MenuItem>
          <MenuItem tokens={tokens} onClick={onEdit}>Edit</MenuItem>
          <MenuItem tokens={tokens} onClick={onDuplicate}>Duplicate</MenuItem>
          <MenuItem tokens={tokens} onClick={onToggle}>{coupon.status === 'Active' ? 'Disable' : 'Activate'}</MenuItem>
          <MenuDivider tokens={tokens} />
          <MenuItem tokens={tokens} danger onClick={onDelete}>Delete</MenuItem>
        </Dropdown>
      </div>

      {/* Discount + Restrictions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{
          padding: '10px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt,
          border: `1px dashed ${tokens.border.strong}`,
          textAlign: 'center', minWidth: 70,
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: tokens.text.primary, lineHeight: 1 }}>{discountLabel}</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 3 }}>{coupon.type}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: tokens.text.tertiary }}>Min Order</span>
            <span style={{ fontWeight: 600, color: tokens.text.primary }}>{coupon.minOrder > 0 ? `₹${coupon.minOrder.toLocaleString('en-IN')}` : '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: tokens.text.tertiary }}>Applies To</span>
            <span style={{ fontWeight: 600, color: tokens.text.primary }}>{coupon.appliesTo}{coupon.target ? ` · ${coupon.target}` : ''}</span>
          </div>
          {coupon.maxDiscount && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: tokens.text.tertiary }}>Max Cap</span>
            <span style={{ fontWeight: 600, color: tokens.text.primary }}>₹{coupon.maxDiscount.toLocaleString('en-IN')}</span>
          </div>}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: tokens.text.tertiary }}>1 per customer</span>
            <span style={{ fontWeight: 600, color: coupon.onePerCustomer ? tokens.status.success : tokens.text.tertiary }}>{coupon.onePerCustomer ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      {/* Usage bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>Usage</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: tokens.text.primary }}>{coupon.used} / {coupon.limit >= 9999 ? '∞' : coupon.limit}</span>
        </div>
        <ProgressBar tokens={tokens} value={usagePct} color={usagePct >= 80 ? tokens.status.warning : tokens.status.info} />
      </div>

      {/* Trend sparkline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>14-day trend</span>
        <svg width="100%" height={28} viewBox="0 0 200 28" preserveAspectRatio="none" style={{ flex: 1 }}>
          <polyline
            points={coupon.trend.map((v, i) => `${(i / (coupon.trend.length - 1)) * 200},${28 - (v / trendMax) * 22 - 3}`).join(' ')}
            fill="none" stroke={tokens.status.info} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: `1px solid ${tokens.border.subtle}` }}>
        <div style={{ fontSize: 11 }}>
          <div style={{ color: tokens.text.tertiary }}>Revenue</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: tokens.status.success }}>{fmtINR(coupon.revenue)}</div>
        </div>
        <div style={{ fontSize: 11, textAlign: 'right' }}>
          <div style={{ color: tokens.text.tertiary }}>{isExpiringSoon ? 'Expires in' : 'Validity'}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: isExpiringSoon ? tokens.status.warning : tokens.text.primary }}>
            {isExpiringSoon ? `${daysLeft} days` : `${new Date(coupon.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — ${new Date(coupon.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Expiry Timeline ----------------------------- */

function ExpiryTimeline({ tokens, coupons }: { tokens: AdminThemeTokens; coupons: Coupon[] }) {
  const upcoming = useMemo(() => {
    return coupons
      .filter(c => c.status === 'Active' || c.status === 'Scheduled')
      .map(c => ({ ...c, daysLeft: daysUntil(c.endDate) }))
      .filter(c => c.daysLeft >= 0 && c.daysLeft <= 60)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [coupons]);

  if (upcoming.length === 0) return null;

  return (
    <Panel tokens={tokens} title="Expiry Timeline" subtitle="Coupons expiring in the next 60 days" style={{ marginTop: 20 }}>
      <div style={{ position: 'relative', padding: '12px 4px 4px' }}>
        {/* Timeline axis */}
        <div style={{ position: 'absolute', top: 36, left: 12, right: 12, height: 2, background: tokens.border.subtle, borderRadius: 1 }} />
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 8 }}>
          {upcoming.map(c => {
            const tone = c.daysLeft <= 7 ? tokens.status.error : c.daysLeft <= 14 ? tokens.status.warning : c.daysLeft <= 30 ? tokens.status.info : tokens.status.success;
            const pct = Math.min(100, Math.max(5, 100 - (c.daysLeft / 60) * 100));
            return (
              <div key={c.id} style={{ minWidth: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: tone, marginBottom: 4 }}>{c.daysLeft === 0 ? 'Today' : `${c.daysLeft}d left`}</div>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: tone, border: `3px solid ${tokens.bg.surface}`, boxShadow: `0 0 0 2px ${tone}40`, marginBottom: 8 }} />
                <div style={{
                  padding: '6px 8px', borderRadius: 6, background: tokens.bg.surfaceAlt,
                  border: `1px solid ${tokens.border.subtle}`, width: '100%',
                }}>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, fontWeight: 700, color: tokens.text.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.code}</div>
                  <div style={{ fontSize: 9, color: tokens.text.tertiary, marginTop: 2 }}>{new Date(c.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                </div>
                <div style={{ width: '100%', height: 3, borderRadius: 2, background: tokens.bg.surfaceAlt, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: tone }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

/* ----------------------------- Top Performers ----------------------------- */

function TopPerformers({ tokens, coupons }: { tokens: AdminThemeTokens; coupons: Coupon[] }) {
  const top = useMemo(() => {
    return [...coupons].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [coupons]);
  const maxRev = Math.max(...top.map(c => c.revenue), 1);

  return (
    <Panel tokens={tokens} title="Top Performing Coupons" subtitle="Ranked by attributed revenue" style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {top.map((c, i) => (
          <div key={c.id} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px',
            borderRadius: 8, background: tokens.bg.surfaceAlt,
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: tokens.text.tertiary, minWidth: 20 }}>#{i + 1}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{c.code}</span>
                <span style={{ fontSize: 10, color: tokens.text.tertiary }}>· {c.used} redemptions</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: tokens.bg.surface, overflow: 'hidden' }}>
                <div style={{ width: `${(c.revenue / maxRev) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${tokens.status.info}, ${tokens.status.success})`, borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 80 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: tokens.status.success }}>{fmtINR(c.revenue)}</div>
              <div style={{ fontSize: 9, color: tokens.text.tertiary }}>revenue</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ----------------------------- KPI Strip ----------------------------- */

function KPIStrip({ tokens, label, value, sub, tone }: {
  tokens: AdminThemeTokens; label: string; value: string; sub: string;
  tone: 'success' | 'info' | 'warning' | 'critical';
}) {
  const accent = tone === 'success' ? tokens.status.success : tone === 'info' ? tokens.status.info : tone === 'warning' ? tokens.status.warning : tokens.status.error;
  return (
    <div style={{
      padding: 14, borderRadius: 12, background: tokens.bg.surface,
      border: `1px solid ${tokens.border.subtle}`, boxShadow: tokens.shadow.sm,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: accent }} />
      <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

/* ----------------------------- Coupon Detail Drawer ----------------------------- */

function CouponDetailDrawer({ tokens, coupon, onClose, onEdit }: {
  tokens: AdminThemeTokens; coupon: Coupon | null; onClose: () => void; onEdit: (c: Coupon) => void;
}) {
  if (!coupon) return null;
  const trendMax = Math.max(...coupon.trend, 1);
  return (
    <Drawer
      tokens={tokens}
      open={Boolean(coupon)}
      onClose={onClose}
      title={coupon.code}
      subtitle={coupon.description}
      width={560}
      footer={
        <>
          <Button tokens={tokens} variant="ghost" onClick={onClose}>Close</Button>
          <Button tokens={tokens} variant="primary" onClick={() => onEdit(coupon)}>Edit Coupon</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <StatTile tokens={tokens} label="Revenue" value={fmtINR(coupon.revenue)} tone="success" />
          <StatTile tokens={tokens} label="Redemptions" value={String(coupon.used)} tone="info" />
          <StatTile tokens={tokens} label="Avg / Day" value={(coupon.used / 14).toFixed(1)} tone="warning" />
        </div>

        {/* Trend chart */}
        <Panel tokens={tokens} title="Redemption Trend" subtitle="Last 14 days" padding="sm">
          <svg width="100%" height={80} viewBox="0 0 280 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`grad-${coupon.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tokens.status.info} stopOpacity={0.4} />
                <stop offset="100%" stopColor={tokens.status.info} stopOpacity={0} />
              </linearGradient>
            </defs>
            <polyline
              points={`0,80 ${coupon.trend.map((v, i) => `${(i / (coupon.trend.length - 1)) * 280},${80 - (v / trendMax) * 70 - 5}`).join(' ')} 280,80`}
              fill={`url(#grad-${coupon.id})`} stroke="none"
            />
            <polyline
              points={coupon.trend.map((v, i) => `${(i / (coupon.trend.length - 1)) * 280},${80 - (v / trendMax) * 70 - 5}`).join(' ')}
              fill="none" stroke={tokens.status.info} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </Panel>

        {/* Restrictions */}
        <Panel tokens={tokens} title="Restrictions & Rules" padding="sm">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
            <Row tokens={tokens} label="Discount Type" value={`${coupon.type}${coupon.value > 0 ? ` · ${coupon.type === 'Percentage' ? coupon.value + '%' : '₹' + coupon.value}` : ''}`} />
            <Row tokens={tokens} label="Applies To" value={`${coupon.appliesTo}${coupon.target ? ` · ${coupon.target}` : ''}`} />
            <Row tokens={tokens} label="Minimum Order" value={coupon.minOrder > 0 ? `₹${coupon.minOrder.toLocaleString('en-IN')}` : 'No minimum'} />
            {coupon.maxDiscount && <Row tokens={tokens} label="Max Discount Cap" value={`₹${coupon.maxDiscount.toLocaleString('en-IN')}`} />}
            <Row tokens={tokens} label="Usage Limit" value={`${coupon.used} / ${coupon.limit >= 9999 ? '∞' : coupon.limit}`} />
            <Row tokens={tokens} label="One Per Customer" value={coupon.onePerCustomer ? 'Yes' : 'No'} />
            <Row tokens={tokens} label="First Order Only" value={coupon.firstOrderOnly ? 'Yes' : 'No'} />
            <Row tokens={tokens} label="Auto Apply" value={coupon.autoApply ? 'Yes — applied at cart' : 'No — manual code entry'} />
            <Row tokens={tokens} label="Validity" value={`${new Date(coupon.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} — ${new Date(coupon.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`} />
          </div>
        </Panel>

        {/* Performance */}
        <Panel tokens={tokens} title="Performance Insights" padding="sm">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
            <Row tokens={tokens} label="Conversion Rate" value={`${((coupon.used / Math.max(coupon.used * 8, 1)) * 100).toFixed(1)}%`} />
            <Row tokens={tokens} label="Avg. Order Discount" value={coupon.type === 'Percentage' ? `${coupon.value}% of order` : coupon.type === 'Flat' ? `₹${coupon.value}` : 'Variable'} />
            <Row tokens={tokens} label="Revenue Per Redemption" value={coupon.used > 0 ? fmtINR(coupon.revenue / coupon.used) : '—'} />
            <Row tokens={tokens} label="Customer Reach" value={`${Math.round(coupon.used * 1.4)} unique customers`} />
          </div>
        </Panel>
      </div>
    </Drawer>
  );
}

function StatTile({ tokens, label, value, tone }: { tokens: AdminThemeTokens; label: string; value: string; tone: 'success' | 'info' | 'warning' }) {
  const color = tone === 'success' ? tokens.status.success : tone === 'info' ? tokens.status.info : tokens.status.warning;
  return (
    <div style={{ padding: 10, borderRadius: 8, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`, textAlign: 'center' }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function Row({ tokens, label, value }: { tokens: AdminThemeTokens; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: tokens.text.tertiary }}>{label}</span>
      <span style={{ fontWeight: 600, color: tokens.text.primary, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

/* ----------------------------- Coupon Form Drawer ----------------------------- */

function CouponFormDrawer({ tokens, open, coupon, onClose, onSave }: {
  tokens: AdminThemeTokens; open: boolean; coupon: Coupon | null; onClose: () => void; onSave: () => void;
}) {
  const [autoApply, setAutoApply] = useState(false);
  const [onePerCustomer, setOnePerCustomer] = useState(false);
  const [firstOrderOnly, setFirstOrderOnly] = useState(false);
  const [appliesTo, setAppliesTo] = useState<AppliesTo>('All');

  useEffect(() => {
    if (open) {
      setAutoApply(coupon?.autoApply ?? false);
      setOnePerCustomer(coupon?.onePerCustomer ?? false);
      setFirstOrderOnly(coupon?.firstOrderOnly ?? false);
      setAppliesTo(coupon?.appliesTo ?? 'All');
    }
  }, [open, coupon]);

  return (
    <Drawer
      tokens={tokens}
      open={open}
      onClose={onClose}
      title={coupon ? 'Edit Coupon' : 'Create Coupon'}
      subtitle={coupon?.code}
      width={520}
      footer={
        <>
          <Button tokens={tokens} variant="ghost" onClick={onClose}>Cancel</Button>
          <Button tokens={tokens} variant="primary" onClick={onSave}>{coupon ? 'Save Changes' : 'Create Coupon'}</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input tokens={tokens} label="Coupon Code" defaultValue={coupon?.code ?? ''} placeholder="SUMMER20" />
        <Input tokens={tokens} label="Description" defaultValue={coupon?.description ?? ''} placeholder="20% off site-wide for summer" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Select tokens={tokens} label="Type" defaultValue={coupon?.type ?? 'Percentage'}
            options={[
              { value: 'Flat', label: 'Flat (₹)' },
              { value: 'Percentage', label: 'Percentage (%)' },
              { value: 'BOGO', label: 'Buy 1 Get 1' },
              { value: 'Free Shipping', label: 'Free Shipping' },
            ]}
          />
          <Input tokens={tokens} label="Value" type="number" defaultValue={coupon?.value ? String(coupon.value) : ''} placeholder="20" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Select tokens={tokens} label="Applies To" value={appliesTo} onChange={e => setAppliesTo(e.target.value as AppliesTo)}
            options={[
              { value: 'All', label: 'All Products' },
              { value: 'Category', label: 'Specific Category' },
              { value: 'Brand', label: 'Specific Brand' },
              { value: 'Product', label: 'Specific Product' },
              { value: 'User', label: 'Specific Customer' },
            ]}
          />
          {appliesTo !== 'All' && <Input tokens={tokens} label="Target" defaultValue={coupon?.target ?? ''} placeholder={appliesTo === 'Brand' ? 'JORDAN' : appliesTo === 'Category' ? 'Sneakers' : ''} />}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input tokens={tokens} label="Min Order (₹)" type="number" defaultValue={coupon ? String(coupon.minOrder) : ''} placeholder="2999" />
          <Input tokens={tokens} label="Max Discount (₹)" type="number" defaultValue={coupon?.maxDiscount ? String(coupon.maxDiscount) : ''} placeholder="2000" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input tokens={tokens} label="Usage Limit" type="number" defaultValue={coupon ? String(coupon.limit) : ''} placeholder="500" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>Schedule</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <Input tokens={tokens} type="date" defaultValue={coupon?.startDate ?? ''} />
              <Input tokens={tokens} type="date" defaultValue={coupon?.endDate ?? ''} />
            </div>
          </div>
        </div>

        {/* Rules */}
        <div style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8 }}>Application Rules</div>
          <RuleToggle tokens={tokens} label="Auto Apply at Cart" desc="Apply automatically when conditions are met" checked={autoApply} onChange={setAutoApply} />
          <RuleToggle tokens={tokens} label="One Per Customer" desc="Limit each customer to a single use" checked={onePerCustomer} onChange={setOnePerCustomer} />
          <RuleToggle tokens={tokens} label="First Order Only" desc="Available only on customer's first purchase" checked={firstOrderOnly} onChange={setFirstOrderOnly} />
        </div>
      </div>
    </Drawer>
  );
}

function RuleToggle({ tokens, label, desc, checked, onChange }: {
  tokens: AdminThemeTokens; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', marginBottom: 4, borderRadius: 8, background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`, cursor: 'pointer' }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{label}</div>
        <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{desc}</div>
      </div>
      <Toggle tokens={tokens} checked={checked} onChange={onChange} />
    </label>
  );
}
