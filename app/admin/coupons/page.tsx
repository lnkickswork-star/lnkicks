/**
 * LNKICKS Enterprise Admin — Coupons Management
 * Flat / % / BOGO / Free Shipping / Category / Brand / User / Referral coupons
 */

'use client';

import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Button, Badge, StatusPill, SearchInput, Drawer, Tabs, useToast, IconButton,
  Dropdown, MenuItem, MenuDivider, Input, Select,
} from '@/components/admin/ui';
import { PlusIcon } from '@/components/admin/ui';

interface Coupon {
  id: string;
  code: string;
  type: 'Flat' | 'Percentage' | 'BOGO' | 'Free Shipping';
  value: number;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Disabled';
  used: number;
  limit: number;
  startDate: string;
  endDate: string;
  appliesTo: 'All' | 'Category' | 'Brand' | 'User';
  target?: string;
  minOrder: number;
}

const SEED: Coupon[] = [
  { id: 'c1', code: 'WELCOME50', type: 'Flat', value: 50, status: 'Active', used: 318, limit: 1000, startDate: '2026-01-01', endDate: '2026-12-31', appliesTo: 'All', minOrder: 999 },
  { id: 'c2', code: 'SUMMER20', type: 'Percentage', value: 20, status: 'Active', used: 142, limit: 500, startDate: '2026-08-01', endDate: '2026-08-31', appliesTo: 'All', minOrder: 4999 },
  { id: 'c3', code: 'JORDAN15', type: 'Percentage', value: 15, status: 'Active', used: 67, limit: 200, startDate: '2026-07-15', endDate: '2026-09-15', appliesTo: 'Brand', target: 'JORDAN', minOrder: 8999 },
  { id: 'c4', code: 'FREESHIP', type: 'Free Shipping', value: 0, status: 'Active', used: 89, limit: 1000, startDate: '2026-08-01', endDate: '2026-08-31', appliesTo: 'All', minOrder: 2999 },
  { id: 'c5', code: 'BOGOSAMBA', type: 'BOGO', value: 0, status: 'Scheduled', used: 0, limit: 100, startDate: '2026-08-15', endDate: '2026-08-20', appliesTo: 'Category', target: 'Sneakers', minOrder: 0 },
  { id: 'c6', code: 'VIP1000', type: 'Flat', value: 1000, status: 'Disabled', used: 12, limit: 50, startDate: '2026-06-01', endDate: '2026-07-01', appliesTo: 'User', target: 'VIP Customers', minOrder: 14999 },
  { id: 'c7', code: 'DIWALI25', type: 'Percentage', value: 25, status: 'Scheduled', used: 0, limit: 2000, startDate: '2026-10-20', endDate: '2026-11-05', appliesTo: 'All', minOrder: 2999 },
  { id: 'c8', code: 'REFER100', type: 'Flat', value: 100, status: 'Active', used: 234, limit: 9999, startDate: '2026-01-01', endDate: '2026-12-31', appliesTo: 'All', minOrder: 0 },
];

export default function CouponsPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(SEED);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [edit, setEdit] = useState<Coupon | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => coupons.filter(c => {
    if (search && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
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

  function toggleStatus(id: string) {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' } : c));
    pushToast({ tone: 'success', title: 'Status updated' });
  }

  function deleteCoupon(id: string) {
    setCoupons(prev => prev.filter(c => c.id !== id));
    pushToast({ tone: 'success', title: 'Coupon deleted' });
  }

  function duplicateCoupon(c: Coupon) {
    const copy: Coupon = { ...c, id: `c-${Date.now()}`, code: `${c.code}-COPY`, status: 'Disabled', used: 0 };
    setCoupons(prev => [copy, ...prev]);
    pushToast({ tone: 'success', title: 'Coupon duplicated' });
  }

  const columns: Column<Coupon>[] = [
    {
      key: 'code', header: 'Code', sortable: true, sortValue: c => c.code,
      render: c => (
        <div>
          <span style={{ fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{c.code}</span>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{c.type}{c.value > 0 && ` · ${c.type === 'Percentage' ? c.value + '%' : '₹' + c.value}`}</div>
        </div>
      ),
    },
    {
      key: 'discount', header: 'Discount',
      render: c => c.type === 'Free Shipping' ? <span style={{ color: tokens.text.secondary }}>Free Shipping</span>
        : c.type === 'BOGO' ? <span style={{ color: tokens.text.secondary }}>Buy 1 Get 1</span>
        : <span style={{ fontWeight: 700, color: tokens.text.primary }}>{c.type === 'Percentage' ? `${c.value}%` : `₹${c.value}`}</span>,
    },
    {
      key: 'appliesTo', header: 'Applies To',
      render: c => (
        <div>
          <Badge tokens={tokens} tone="neutral" size="sm">{c.appliesTo}</Badge>
          {c.target && <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{c.target}</div>}
        </div>
      ),
    },
    {
      key: 'usage', header: 'Usage', align: 'right',
      sortable: true, sortValue: c => c.used,
      render: c => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, minWidth: 80 }}>
          <span style={{ fontWeight: 600, color: tokens.text.primary, fontSize: 12 }}>{c.used} / {c.limit === 9999 ? '∞' : c.limit}</span>
          <div style={{ width: 60, height: 4, borderRadius: 2, background: tokens.bg.surfaceAlt, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (c.used / c.limit) * 100)}%`, height: '100%', background: tokens.status.info, borderRadius: 2 }} />
          </div>
        </div>
      ),
    },
    {
      key: 'minOrder', header: 'Min Order', align: 'right',
      sortable: true, sortValue: c => c.minOrder,
      render: c => <span style={{ color: tokens.text.secondary }}>₹{c.minOrder.toLocaleString('en-IN')}</span>,
    },
    {
      key: 'validity', header: 'Validity',
      render: c => (
        <div style={{ fontSize: 11, color: tokens.text.secondary }}>
          {new Date(c.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(c.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </div>
      ),
    },
    {
      key: 'status', header: 'Status', align: 'center',
      sortable: true, sortValue: c => c.status,
      render: c => <StatusPill tokens={tokens} status={c.status} />,
    },
    {
      key: 'actions', header: '', align: 'right', sortable: false,
      render: c => (
        <div onClick={e => e.stopPropagation()}>
          <Dropdown tokens={tokens} align="right" width={180}
            trigger={<IconButton tokens={tokens} icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>} label="More" size={28} />}
          >
            <MenuItem tokens={tokens} onClick={() => setEdit(c)}>Edit</MenuItem>
            <MenuItem tokens={tokens} onClick={() => duplicateCoupon(c)}>Duplicate</MenuItem>
            <MenuItem tokens={tokens} onClick={() => toggleStatus(c.id)}>{c.status === 'Active' ? 'Disable' : 'Activate'}</MenuItem>
            <MenuDivider tokens={tokens} />
            <MenuItem tokens={tokens} danger onClick={() => deleteCoupon(c.id)}>Delete</MenuItem>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Coupons"
      subtitle="Discount campaigns"
      requirePermission="coupon.create"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }, { label: 'Coupons' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Coupon Management"
        subtitle="Create flat, percentage, BOGO, and free shipping coupons. Target by category, brand, or specific users."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }, { label: 'Coupons' }]}
        meta={<Badge tokens={tokens} tone="success">{counts.active} active</Badge>}
        actions={<Button tokens={tokens} variant="primary" size="md" onClick={() => setCreateOpen(true)} icon={<PlusIcon size={14} color={tokens.bg.app} />}>Create Coupon</Button>}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'all', label: 'All', badge: counts.all },
          { key: 'active', label: 'Active', badge: counts.active },
          { key: 'scheduled', label: 'Scheduled', badge: counts.scheduled },
          { key: 'expired', label: 'Expired', badge: counts.expired },
          { key: 'disabled', label: 'Disabled', badge: counts.disabled },
        ]} active={statusTab} onChange={setStatusTab} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 220 }}>
          <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search coupon code…" />
        </div>
      </div>

      <EnterpriseDataTable<Coupon>
        tokens={tokens} columns={columns} rows={filtered} getRowId={c => c.id}
        pageSize={10} onRowClick={c => setEdit(c)}
      />

      <Drawer
        tokens={tokens}
        open={Boolean(edit) || createOpen}
        onClose={() => { setEdit(null); setCreateOpen(false); }}
        title={edit ? 'Edit Coupon' : 'Create Coupon'}
        subtitle={edit?.code}
        width={460}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => { setEdit(null); setCreateOpen(false); }}>Cancel</Button>
            <Button tokens={tokens} variant="primary" onClick={() => {
              pushToast({ tone: 'success', title: edit ? 'Coupon saved' : 'Coupon created' });
              setEdit(null); setCreateOpen(false);
            }}>{edit ? 'Save Changes' : 'Create Coupon'}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input tokens={tokens} label="Coupon Code" defaultValue={edit?.code ?? ''} placeholder="SUMMER20" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Select tokens={tokens} label="Type"
              defaultValue={edit?.type ?? 'Percentage'}
              options={[
                { value: 'Flat', label: 'Flat (₹)' },
                { value: 'Percentage', label: 'Percentage (%)' },
                { value: 'BOGO', label: 'Buy 1 Get 1' },
                { value: 'Free Shipping', label: 'Free Shipping' },
              ]}
            />
            <Input tokens={tokens} label="Value" type="number" defaultValue={edit?.value ? String(edit.value) : ''} placeholder="20" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Select tokens={tokens} label="Applies To"
              defaultValue={edit?.appliesTo ?? 'All'}
              options={[
                { value: 'All', label: 'All Products' },
                { value: 'Category', label: 'Specific Category' },
                { value: 'Brand', label: 'Specific Brand' },
                { value: 'User', label: 'Specific User' },
              ]}
            />
            <Input tokens={tokens} label="Target (if specific)" defaultValue={edit?.target ?? ''} placeholder="JORDAN" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input tokens={tokens} label="Min Order (₹)" type="number" defaultValue={edit ? String(edit.minOrder) : ''} placeholder="2999" />
            <Input tokens={tokens} label="Usage Limit" type="number" defaultValue={edit ? String(edit.limit) : ''} placeholder="500" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input tokens={tokens} label="Start Date" type="date" defaultValue={edit?.startDate ?? ''} />
            <Input tokens={tokens} label="End Date" type="date" defaultValue={edit?.endDate ?? ''} />
          </div>
        </div>
      </Drawer>
    </AdminLayout>
  );
}
