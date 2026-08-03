/**
 * LNKICKS Enterprise Admin — Inventory Management
 */

'use client';

import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Button, Badge, StatusPill, SearchInput, Tabs, useToast, Panel, Select,
} from '@/components/admin/ui';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  stock: number;
  threshold: number;
  warehouse: string;
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  lastRestocked: number;
  forecast: 'increase' | 'stable' | 'decrease';
}

const SEED: InventoryItem[] = Array.from({ length: 30 }, (_, i) => ({
  id: `inv-${100 + i}`,
  sku: `SKU-${1000 + i}`,
  name: ['Air Jordan 1 Low', 'Nike Dunk Low Panda', 'Adidas Samba OG', 'Yeezy 350 V2', 'Jordan 4 Bred'][i % 5],
  brand: ['NIKE', 'NIKE', 'ADIDAS', 'YEEZY', 'JORDAN'][i % 5],
  category: 'Sneakers',
  stock: [42, 0, 18, 6, 23, 0, 15, 31, 9, 4][i % 10],
  threshold: 5,
  warehouse: ['Mumbai', 'Delhi', 'Bengaluru'][i % 3],
  supplier: ['Nike India', 'Adidas India', 'Authorised Dealer'][i % 3],
  purchasePrice: 6000 + (i * 500),
  sellingPrice: 8999 + (i * 700),
  lastRestocked: Date.now() - i * 86400_000,
  forecast: i % 3 === 0 ? 'increase' : i % 3 === 1 ? 'stable' : 'decrease',
}));

export default function InventoryPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [items] = useState<InventoryItem[]>(SEED);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [warehouse, setWarehouse] = useState('All');

  const filtered = useMemo(() => items.filter(it => {
    if (search && !it.name.toLowerCase().includes(search.toLowerCase()) && !it.sku.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 'low' && it.stock > it.threshold) return false;
    if (tab === 'out' && it.stock > 0) return false;
    if (warehouse !== 'All' && it.warehouse !== warehouse) return false;
    return true;
  }), [items, search, tab, warehouse]);

  const counts = useMemo(() => ({
    all: items.length,
    low: items.filter(i => i.stock > 0 && i.stock <= i.threshold).length,
    out: items.filter(i => i.stock === 0).length,
  }), [items]);

  const totalValue = items.reduce((s, i) => s + i.stock * i.purchasePrice, 0);

  const columns: Column<InventoryItem>[] = [
    {
      key: 'sku', header: 'SKU', sortable: true, sortValue: i => i.sku,
      render: i => <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{i.sku}</span>,
    },
    {
      key: 'name', header: 'Product', sortable: true, sortValue: i => i.name,
      render: i => (
        <div>
          <div style={{ fontWeight: 600, color: tokens.text.primary, fontSize: 12 }}>{i.name}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{i.brand} · {i.category}</div>
        </div>
      ),
    },
    {
      key: 'warehouse', header: 'Warehouse', sortable: true, sortValue: i => i.warehouse,
      render: i => <Badge tokens={tokens} tone="neutral" size="sm">{i.warehouse}</Badge>,
    },
    {
      key: 'supplier', header: 'Supplier', sortable: true, sortValue: i => i.supplier,
      render: i => <span style={{ color: tokens.text.secondary, fontSize: 11 }}>{i.supplier}</span>,
    },
    {
      key: 'stock', header: 'Stock', align: 'right', sortable: true, sortValue: i => i.stock,
      render: i => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, minWidth: 80 }}>
          <span style={{ fontWeight: 700, color: i.stock === 0 ? tokens.status.error : i.stock <= i.threshold ? tokens.status.warning : tokens.text.primary }}>{i.stock}</span>
          <div style={{ width: 60, height: 4, borderRadius: 2, background: tokens.bg.surfaceAlt, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (i.stock / 50) * 100)}%`, height: '100%', background: i.stock === 0 ? tokens.status.error : i.stock <= i.threshold ? tokens.status.warning : tokens.status.success, borderRadius: 2 }} />
          </div>
        </div>
      ),
    },
    {
      key: 'purchasePrice', header: 'Purchase', align: 'right', sortable: true, sortValue: i => i.purchasePrice,
      render: i => <span style={{ color: tokens.text.secondary }}>₹{i.purchasePrice.toLocaleString('en-IN')}</span>,
    },
    {
      key: 'sellingPrice', header: 'Selling', align: 'right', sortable: true, sortValue: i => i.sellingPrice,
      render: i => <span style={{ fontWeight: 700, color: tokens.text.primary }}>₹{i.sellingPrice.toLocaleString('en-IN')}</span>,
    },
    {
      key: 'forecast', header: 'Forecast', align: 'center',
      render: i => (
        <Badge tokens={tokens} tone={i.forecast === 'increase' ? 'success' : i.forecast === 'decrease' ? 'warning' : 'neutral'} size="sm">
          {i.forecast === 'increase' ? '↗ Rising' : i.forecast === 'decrease' ? '↘ Falling' : '→ Stable'}
        </Badge>
      ),
    },
    {
      key: 'status', header: 'Status', align: 'center', sortable: true, sortValue: i => i.stock === 0 ? 'Out of Stock' : i.stock <= i.threshold ? 'Low Stock' : 'In Stock',
      render: i => <StatusPill tokens={tokens} status={i.stock === 0 ? 'Out of Stock' : i.stock <= i.threshold ? 'Low Stock' : 'In Stock'} />,
    },
  ];

  return (
    <AdminLayout
      title="Inventory"
      subtitle="Stock & warehouse management"
      requirePermission="inventory.manage"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Insights' }, { label: 'Inventory' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Inventory Management"
        subtitle="Track stock across warehouses, monitor supplier pricing, and forecast demand."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Insights' }, { label: 'Inventory' }]}
        meta={<Badge tokens={tokens} tone="critical">{counts.out} out · {counts.low} low</Badge>}
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'success', title: 'Restock reminder sent', message: 'Suppliers notified.' })}>Restock Reminder</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'success', title: 'Stock count started' })}>New Stock Count</Button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        <Panel tokens={tokens} title="Total Stock Value" subtitle="At purchase price">
          <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary }}>₹{(totalValue / 100000).toFixed(1)}L</div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>{items.reduce((s, i) => s + i.stock, 0)} units across {new Set(items.map(i => i.warehouse)).size} warehouses</div>
        </Panel>
        <Panel tokens={tokens} title="Low Stock Items" subtitle="Need restock soon" accent="warning">
          <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.warning }}>{counts.low}</div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>Below threshold of 5 units</div>
        </Panel>
        <Panel tokens={tokens} title="Out of Stock" subtitle="Immediate attention" accent="critical">
          <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.error }}>{counts.out}</div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>Lost revenue risk</div>
        </Panel>
        <Panel tokens={tokens} title="Avg Margin" subtitle="Across all SKUs">
          <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.success }}>
            {Math.round(items.reduce((s, i) => s + ((i.sellingPrice - i.purchasePrice) / i.sellingPrice), 0) / items.length * 100)}%
          </div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>Profit margin</div>
        </Panel>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'all', label: 'All', badge: counts.all },
          { key: 'low', label: 'Low Stock', badge: counts.low },
          { key: 'out', label: 'Out of Stock', badge: counts.out },
        ]} active={tab} onChange={setTab} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 220 }}>
          <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search SKU or name…" />
        </div>
        <Select tokens={tokens} value={warehouse} onChange={e => setWarehouse(e.target.value)}
          options={['All', 'Mumbai', 'Delhi', 'Bengaluru'].map(w => ({ value: w, label: w === 'All' ? 'All Warehouses' : w }))}
          style={{ height: 34, width: 150 }}
        />
      </div>

      <EnterpriseDataTable<InventoryItem>
        tokens={tokens} columns={columns} rows={filtered} getRowId={i => i.id}
        pageSize={12}
      />
    </AdminLayout>
  );
}
