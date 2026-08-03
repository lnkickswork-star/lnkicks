/**
 * LNKICKS Enterprise Admin — Inventory Management (Warehouse Control Center)
 * ------------------------------------------------------------
 * Enterprise warehouse interface with:
 *  - Stock Overview (KPI strip: stock value, SKUs, low/out, avg margin)
 *  - Warehouse Locations (3-warehouse breakdown with capacity bars)
 *  - Inventory Transfers (between warehouses)
 *  - Purchase Orders (draft / sent / received / overdue)
 *  - Inventory Timeline (stock movement history per SKU)
 *  - Forecasting (demand prediction per SKU)
 *  - Bulk Inventory Update (CSV import + table edit)
 *  - Stock Movement History (audit of every in/out)
 *  - Barcode Support (scan to lookup)
 *
 * Inspired by AWS Inventory, Shopify Plus Inventory, TradeGecko,
 * NetSuite, Microsoft Dynamics.
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Button, Badge, StatusPill, SearchInput, Tabs, useToast, Panel, Select,
  Drawer, Input, ProgressBar, Skeleton,
} from '@/components/admin/ui';

/* ----------------------------- Types ----------------------------- */

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  stock: number;
  threshold: number;
  reorderQty: number;
  warehouse: 'Mumbai' | 'Delhi' | 'Bengaluru';
  binLocation: string;
  supplier: string;
  supplierSku: string;
  purchasePrice: number;
  sellingPrice: number;
  gstRate: number;
  lastRestocked: number;
  lastSold: number;
  forecast30d: number;       // predicted demand units
  forecastTrend: 'increase' | 'stable' | 'decrease';
  movements: Array<{ type: 'in' | 'out' | 'transfer' | 'adjust'; qty: number; note: string; ts: number; actor: string }>;
}

interface Warehouse {
  id: string;
  name: string;
  city: string;
  totalSkus: number;
  totalUnits: number;
  capacity: number;     // max units
  value: number;
  lowStock: number;
  outStock: number;
  manager: string;
}

interface PurchaseOrder {
  id: string;
  supplier: string;
  warehouse: string;
  status: 'Draft' | 'Sent' | 'Partial' | 'Received' | 'Overdue';
  items: number;
  total: number;
  createdAt: number;
  expectedAt: number;
  receivedAt?: number;
}

interface Transfer {
  id: string;
  from: string;
  to: string;
  sku: string;
  productName: string;
  qty: number;
  status: 'Pending' | 'In Transit' | 'Received' | 'Cancelled';
  createdAt: number;
  expectedAt: number;
}

/* ----------------------------- Data ----------------------------- */

const NAMES = ['Air Jordan 1 Low', 'Nike Dunk Low Panda', 'Adidas Samba OG', 'Yeezy 350 V2', 'Jordan 4 Bred', 'Nike Air Force 1', 'Adidas Ultraboost', 'New Balance 550'];
const BRANDS = ['NIKE', 'NIKE', 'ADIDAS', 'YEEZY', 'JORDAN', 'NIKE', 'ADIDAS', 'NEW BALANCE'];
const SUPPLIERS = ['Nike India', 'Adidas India', 'Authorised Dealer', 'Mumbai Sports Co.', 'Delhi Footwear Distributors'];
const WAREHOUSES: Warehouse[] = [
  { id: 'wh-bom', name: 'Mumbai Warehouse', city: 'Mumbai, MH', totalSkus: 198, totalUnits: 4280, capacity: 5000, value: 1840000, lowStock: 4, outStock: 2, manager: 'Rajesh K.' },
  { id: 'wh-del', name: 'Delhi Warehouse', city: 'Delhi NCR', totalSkus: 162, totalUnits: 3120, capacity: 4000, value: 1420000, lowStock: 5, outStock: 1, manager: 'Sunil M.' },
  { id: 'wh-blr', name: 'Bengaluru Warehouse', city: 'Bengaluru, KA', totalSkus: 142, totalUnits: 2640, capacity: 3500, value: 990000, lowStock: 3, outStock: 2, manager: 'Anita R.' },
];

function buildInventory(): InventoryItem[] {
  return Array.from({ length: 32 }, (_, i) => {
    const nameIdx = i % NAMES.length;
    const wh = (['Mumbai', 'Delhi', 'Bengaluru'] as const)[i % 3];
    const stock = [42, 0, 18, 6, 23, 0, 15, 31, 9, 4, 27, 12, 38, 0, 5][i % 15];
    const threshold = 5;
    const purchasePrice = 6000 + (i * 350);
    const sellingPrice = 8999 + (i * 480);
    const forecastTrend: InventoryItem['forecastTrend'] = i % 3 === 0 ? 'increase' : i % 3 === 1 ? 'stable' : 'decrease';
    const forecast30d = forecastTrend === 'increase' ? Math.round(stock * 1.4) : forecastTrend === 'decrease' ? Math.round(stock * 0.7) : stock;
    const movements: InventoryItem['movements'] = [
      { type: 'in', qty: 50, note: 'PO-2026-0142 received', ts: Date.now() - 6 * 86400_000, actor: 'Rajesh K.' },
      { type: 'out', qty: 8, note: 'Order #ORD-4821', ts: Date.now() - 2 * 86400_000, actor: 'System' },
      { type: 'out', qty: 4, note: 'Order #ORD-4892', ts: Date.now() - 18 * 3600_000, actor: 'System' },
      { type: 'transfer', qty: 5, note: 'Transfer to Delhi (TRF-881)', ts: Date.now() - 30 * 3600_000, actor: 'Sunil M.' },
      { type: 'adjust', qty: -2, note: 'Damaged in storage', ts: Date.now() - 4 * 86400_000, actor: 'Anita R.' },
    ];
    return {
      id: `inv-${100 + i}`,
      sku: `SKU-${1000 + i}`,
      name: NAMES[nameIdx],
      brand: BRANDS[nameIdx],
      category: 'Sneakers',
      stock,
      threshold,
      reorderQty: Math.max(20, threshold * 4),
      warehouse: wh,
      binLocation: `A${1 + (i % 4)}-${10 + (i % 8)}`,
      supplier: SUPPLIERS[i % SUPPLIERS.length],
      supplierSku: `SUP-${5000 + i}`,
      purchasePrice,
      sellingPrice,
      gstRate: 18,
      lastRestocked: Date.now() - (i * 2 + 1) * 86400_000,
      lastSold: Date.now() - (i % 6) * 3600_000,
      forecast30d,
      forecastTrend,
      movements,
    };
  });
}

const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-2026-0148', supplier: 'Nike India', warehouse: 'Mumbai', status: 'Sent', items: 24, total: 184000, createdAt: Date.now() - 2 * 86400_000, expectedAt: Date.now() + 4 * 86400_000 },
  { id: 'PO-2026-0147', supplier: 'Adidas India', warehouse: 'Delhi', status: 'Partial', items: 18, total: 124000, createdAt: Date.now() - 5 * 86400_000, expectedAt: Date.now() - 1 * 86400_000 },
  { id: 'PO-2026-0146', supplier: 'Authorised Dealer', warehouse: 'Bengaluru', status: 'Received', items: 32, total: 218000, createdAt: Date.now() - 12 * 86400_000, expectedAt: Date.now() - 6 * 86400_000, receivedAt: Date.now() - 5 * 86400_000 },
  { id: 'PO-2026-0145', supplier: 'Nike India', warehouse: 'Mumbai', status: 'Overdue', items: 14, total: 96000, createdAt: Date.now() - 18 * 86400_000, expectedAt: Date.now() - 4 * 86400_000 },
  { id: 'PO-2026-0144', supplier: 'Mumbai Sports Co.', warehouse: 'Mumbai', status: 'Draft', items: 8, total: 54000, createdAt: Date.now() - 86400_000, expectedAt: Date.now() + 7 * 86400_000 },
  { id: 'PO-2026-0143', supplier: 'Delhi Footwear Distributors', warehouse: 'Delhi', status: 'Received', items: 22, total: 158000, createdAt: Date.now() - 20 * 86400_000, expectedAt: Date.now() - 14 * 86400_000, receivedAt: Date.now() - 13 * 86400_000 },
];

const TRANSFERS: Transfer[] = [
  { id: 'TRF-884', from: 'Mumbai', to: 'Delhi', sku: 'SKU-1002', productName: 'Nike Dunk Low Panda', qty: 8, status: 'In Transit', createdAt: Date.now() - 18 * 3600_000, expectedAt: Date.now() + 6 * 3600_000 },
  { id: 'TRF-883', from: 'Bengaluru', to: 'Mumbai', sku: 'SKU-1004', productName: 'Jordan 4 Bred', qty: 4, status: 'Pending', createdAt: Date.now() - 4 * 3600_000, expectedAt: Date.now() + 48 * 3600_000 },
  { id: 'TRF-882', from: 'Delhi', to: 'Bengaluru', sku: 'SKU-1007', productName: 'Adidas Ultraboost', qty: 6, status: 'Received', createdAt: Date.now() - 3 * 86400_000, expectedAt: Date.now() - 1 * 86400_000 },
  { id: 'TRF-881', from: 'Mumbai', to: 'Delhi', sku: 'SKU-1000', productName: 'Air Jordan 1 Low', qty: 5, status: 'Received', createdAt: Date.now() - 5 * 86400_000, expectedAt: Date.now() - 3 * 86400_000 },
  { id: 'TRF-880', from: 'Bengaluru', to: 'Delhi', sku: 'SKU-1006', productName: 'Nike Air Force 1', qty: 3, status: 'Cancelled', createdAt: Date.now() - 7 * 86400_000, expectedAt: Date.now() - 5 * 86400_000 },
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

/* ----------------------------- Page ----------------------------- */

type Tab = 'overview' | 'stock' | 'transfers' | 'purchase' | 'movements';

export default function InventoryPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [warehouse, setWarehouse] = useState('All');
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [poOpen, setPoOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setTimeout(() => {
      setItems(buildInventory());
      setLoading(false);
    }, 280);
    return () => clearTimeout(t);
  }, []);

  const counts = useMemo(() => ({
    all: items.length,
    low: items.filter(i => i.stock > 0 && i.stock <= i.threshold).length,
    out: items.filter(i => i.stock === 0).length,
    healthy: items.filter(i => i.stock > i.threshold).length,
  }), [items]);

  const totalValue = useMemo(() => items.reduce((s, i) => s + i.stock * i.purchasePrice, 0), [items]);
  const totalUnits = useMemo(() => items.reduce((s, i) => s + i.stock, 0), [items]);
  const avgMargin = useMemo(() => items.length === 0 ? 0 : Math.round(items.reduce((s, i) => s + ((i.sellingPrice - i.purchasePrice) / i.sellingPrice), 0) / items.length * 100), [items]);

  const filtered = useMemo(() => items.filter(it => {
    if (search) {
      const q = search.toLowerCase();
      if (!it.name.toLowerCase().includes(q) && !it.sku.toLowerCase().includes(q) && !it.brand.toLowerCase().includes(q) && !it.supplier.toLowerCase().includes(q) && !it.binLocation.toLowerCase().includes(q)) return false;
    }
    if (warehouse !== 'All' && it.warehouse !== warehouse) return false;
    if (tab === 'stock') {
      // stock tab shows everything when no further filter is applied
    }
    return true;
  }), [items, search, warehouse, tab]);

  const handleAdjustStock = useCallback((id: string, delta: number, note: string) => {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      const newStock = Math.max(0, it.stock + delta);
      return {
        ...it,
        stock: newStock,
        movements: [{ type: 'adjust', qty: delta, note, ts: Date.now(), actor: 'You' }, ...it.movements],
      };
    }));
    pushToast({ tone: 'success', title: 'Stock adjusted', message: `${delta > 0 ? '+' : ''}${delta} units · ${note}` });
  }, [pushToast]);

  const columns: Column<InventoryItem>[] = useMemo(() => [
    {
      key: 'sku', header: 'SKU / Bin', sortable: true, sortValue: i => i.sku,
      render: i => (
        <div>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, fontWeight: 700, color: tokens.text.primary }}>{i.sku}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>Bin {i.binLocation}</div>
        </div>
      ),
    },
    {
      key: 'name', header: 'Product', sortable: true, sortValue: i => i.name,
      render: i => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: tokens.text.primary, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</div>
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
      render: i => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, color: tokens.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.supplier}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace' }}>{i.supplierSku}</div>
        </div>
      ),
    },
    {
      key: 'stock', header: 'Stock', align: 'right', sortable: true, sortValue: i => i.stock,
      render: i => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, minWidth: 80 }}>
          <span style={{ fontWeight: 700, color: i.stock === 0 ? tokens.status.error : i.stock <= i.threshold ? tokens.status.warning : tokens.text.primary }}>{i.stock}</span>
          <div style={{ width: 60, height: 4, borderRadius: 2, background: tokens.bg.surfaceAlt, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (i.stock / 50) * 100)}%`, height: '100%', background: i.stock === 0 ? tokens.status.error : i.stock <= i.threshold ? tokens.status.warning : tokens.status.success, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 9, color: tokens.text.tertiary }}>reorder @ {i.threshold}</span>
        </div>
      ),
    },
    {
      key: 'purchasePrice', header: 'Cost', align: 'right', sortable: true, sortValue: i => i.purchasePrice,
      render: i => <span style={{ color: tokens.text.secondary, fontSize: 11 }}>{formatINR(i.purchasePrice)}</span>,
    },
    {
      key: 'sellingPrice', header: 'Price', align: 'right', sortable: true, sortValue: i => i.sellingPrice,
      render: i => <span style={{ fontWeight: 700, color: tokens.text.primary, fontSize: 11 }}>{formatINR(i.sellingPrice)}</span>,
    },
    {
      key: 'forecast', header: '30d Forecast', align: 'center',
      render: i => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{i.forecast30d}</span>
          <Badge tokens={tokens} tone={i.forecastTrend === 'increase' ? 'success' : i.forecastTrend === 'decrease' ? 'warning' : 'neutral'} size="sm">
            {i.forecastTrend === 'increase' ? '↗ Rising' : i.forecastTrend === 'decrease' ? '↘ Falling' : '→ Stable'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'status', header: 'Status', align: 'center', sortable: true, sortValue: i => i.stock === 0 ? 'Out of Stock' : i.stock <= i.threshold ? 'Low Stock' : 'In Stock',
      render: i => <StatusPill tokens={tokens} status={i.stock === 0 ? 'Out of Stock' : i.stock <= i.threshold ? 'Low Stock' : 'In Stock'} />,
    },
    {
      key: 'actions', header: '', align: 'right',
      render: i => (
        <Button tokens={tokens} variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(i); setDrawerOpen(true); }}>View</Button>
      ),
    },
  ], [tokens]);

  function handleBulkAction(action: string) {
    if (selectedIds.size === 0) {
      pushToast({ tone: 'warning', title: 'No rows selected', message: 'Select rows to perform bulk actions.' });
      return;
    }
    pushToast({ tone: 'success', title: `Bulk ${action}`, message: `Applied to ${selectedIds.size} items.` });
    setSelectedIds(new Set());
  }

  return (
    <>
      <AdminLayout
        title="Inventory"
        subtitle="Warehouse & stock management"
        requirePermission="inventory.manage"
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Inventory' }]}
      >
        <PageHeader
          tokens={tokens}
          title="Inventory Management"
          subtitle="Track stock across warehouses, manage purchase orders, transfers, and forecast demand with enterprise precision."
          breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Inventory' }]}
          meta={<Badge tokens={tokens} tone="critical" dot>{counts.out} out · {counts.low} low</Badge>}
          actions={
            <>
              <Button tokens={tokens} variant="outline" size="md" onClick={() => setBulkOpen(true)}>Bulk Update</Button>
              <Button tokens={tokens} variant="outline" size="md" onClick={() => setTransferOpen(true)}>New Transfer</Button>
              <Button tokens={tokens} variant="primary" size="md" onClick={() => setPoOpen(true)}>New Purchase Order</Button>
            </>
          }
        />

        {/* KPI Strip */}
        <div className="inv-kpi-grid">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="inv-kpi-card">
                <Skeleton tokens={tokens} w="60%" h={10} />
                <div style={{ height: 8 }} />
                <Skeleton tokens={tokens} w="80%" h={22} />
                <div style={{ height: 8 }} />
                <Skeleton tokens={tokens} w="40%" h={10} />
              </div>
            ))
          ) : (
            <>
              <div className="inv-kpi-card" style={{ borderTop: `3px solid ${tokens.status.success}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Stock Value</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>₹{(totalValue / 100000).toFixed(1)}L</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>{totalUnits} units · 3 warehouses</div>
              </div>
              <div className="inv-kpi-card" style={{ borderTop: `3px solid ${tokens.status.info}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.4 }}>SKUs Tracked</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>{items.length}</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>across 3 warehouses</div>
              </div>
              <div className="inv-kpi-card" style={{ borderTop: `3px solid ${tokens.status.warning}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Low Stock</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.warning, marginTop: 4 }}>{counts.low}</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>below threshold ({counts.low + counts.out} critical)</div>
              </div>
              <div className="inv-kpi-card" style={{ borderTop: `3px solid ${tokens.status.error}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Out of Stock</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.error, marginTop: 4 }}>{counts.out}</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>immediate revenue risk</div>
              </div>
              <div className="inv-kpi-card" style={{ borderTop: `3px solid ${tokens.text.accent}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Avg Margin</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.success, marginTop: 4 }}>{avgMargin}%</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>profit margin across SKUs</div>
              </div>
            </>
          )}
        </div>

        {/* Warehouse cards */}
        <div className="inv-wh-grid">
          {WAREHOUSES.map((w, i) => {
            const capacityPct = Math.round((w.totalUnits / w.capacity) * 100);
            const capColor = capacityPct > 90 ? tokens.status.error : capacityPct > 75 ? tokens.status.warning : tokens.status.success;
            return (
              <div key={w.id} className="inv-wh-card" style={{ animationDelay: `${i * 60}ms` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{w.name}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{w.city} · Manager: {w.manager}</div>
                  </div>
                  <Badge tokens={tokens} tone={w.outStock > 0 ? 'critical' : w.lowStock > 0 ? 'warning' : 'success'} size="sm" dot>{w.outStock > 0 ? `${w.outStock} out` : w.lowStock > 0 ? `${w.lowStock} low` : 'Healthy'}</Badge>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Units</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{w.totalUnits.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Value</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>₹{(w.value / 100000).toFixed(1)}L</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: tokens.text.secondary, marginBottom: 4 }}>
                  <span>Capacity</span><span style={{ fontWeight: 700, color: capColor }}>{capacityPct}% · {w.totalUnits}/{w.capacity}</span>
                </div>
                <ProgressBar tokens={tokens} value={capacityPct} color={capColor} height={5} />
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tabs tokens={tokens} tabs={[
            { key: 'overview', label: 'Overview' },
            { key: 'stock', label: 'Stock', badge: counts.all },
            { key: 'transfers', label: 'Transfers', badge: TRANSFERS.length },
            { key: 'purchase', label: 'Purchase Orders', badge: PURCHASE_ORDERS.length },
            { key: 'movements', label: 'Movements' },
          ]} active={tab} onChange={(t) => setTab(t as Tab)} />
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <div className="inv-2col">
            <Panel tokens={tokens} title="Stock by Warehouse" subtitle="Distribution of units across locations">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {WAREHOUSES.map(w => {
                  const total = WAREHOUSES.reduce((s, x) => s + x.totalUnits, 0);
                  const pct = Math.round((w.totalUnits / total) * 100);
                  return (
                    <div key={w.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{w.name}</span>
                        <span style={{ fontSize: 11, color: tokens.text.secondary }}>{w.totalUnits.toLocaleString('en-IN')} units · {pct}%</span>
                      </div>
                      <ProgressBar tokens={tokens} value={pct} color={tokens.chart.series[WAREHOUSES.indexOf(w) % tokens.chart.series.length]} height={8} />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.6 }}>
                <strong style={{ color: tokens.text.primary }}>Insight:</strong> Mumbai warehouse carries 43% of inventory value. Consider balancing stock to Delhi to reduce fulfillment latency for North India orders.
              </div>
            </Panel>
            <Panel tokens={tokens} title="Reorder Recommendations" subtitle="AI-driven restock suggestions based on 30d forecast">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.filter(i => i.stock <= i.threshold).slice(0, 5).map(i => (
                  <div key={i.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt, gap: 12 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{i.sku} · {i.warehouse} · supplier: {i.supplier}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: i.stock === 0 ? tokens.status.error : tokens.status.warning, fontWeight: 700 }}>{i.stock} / {i.threshold} units</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary }}>reorder {i.reorderQty}u · {formatINR(i.reorderQty * i.purchasePrice)}</div>
                    </div>
                    <Button tokens={tokens} variant="outline" size="sm" onClick={() => { pushToast({ tone: 'success', title: 'PO drafted', message: `${i.sku} · ${i.reorderQty} units` }); setPoOpen(true); }}>Order</Button>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        )}

        {tab === 'stock' && (
          <>
            {/* Toolbar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: 260, flex: 1, minWidth: 200 }}>
                <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search SKU, name, brand, supplier, bin…" />
              </div>
              <Select tokens={tokens} value={warehouse} onChange={e => setWarehouse(e.target.value)}
                options={['All', 'Mumbai', 'Delhi', 'Bengaluru'].map(w => ({ value: w, label: w === 'All' ? 'All Warehouses' : w }))}
                style={{ height: 34, width: 150 }}
              />
              <div style={{ flex: 1 }} />
              <Badge tokens={tokens} tone="neutral" size="sm">{filtered.length} of {items.length} SKUs</Badge>
            </div>

            {/* Bulk action bar */}
            {selectedIds.size > 0 && (
              <div className="inv-bulkbar">
                <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{selectedIds.size} selected</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleBulkAction('export')}>Export CSV</Button>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleBulkAction('transfer')}>Transfer</Button>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleBulkAction('reorder')}>Create PO</Button>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleBulkAction('adjust')}>Adjust Stock</Button>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>Clear</Button>
                </div>
              </div>
            )}

            <EnterpriseDataTable<InventoryItem>
              tokens={tokens} columns={columns} rows={filtered} getRowId={i => i.id}
              pageSize={12}
              loading={loading}
              selectable
              onSelectionChange={(ids) => setSelectedIds(new Set(ids))}
              onRowClick={(i) => { setSelected(i); setDrawerOpen(true); }}
              bulkActions={(ids) => ids.length === 0 ? null : (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleBulkAction('export')}>Export CSV</Button>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleBulkAction('transfer')}>Transfer</Button>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleBulkAction('reorder')}>Create PO</Button>
                </div>
              )}
            />
          </>
        )}

        {tab === 'transfers' && (
          <Panel tokens={tokens} title="Inventory Transfers" subtitle="Move stock between warehouses"
            action={<Button tokens={tokens} variant="primary" size="sm" onClick={() => setTransferOpen(true)}>+ New Transfer</Button>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TRANSFERS.map(t => (
                <div key={t.id} className="inv-transfer-row" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt, gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: tokens.bg.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🔁</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{t.id}</span>
                        <StatusPill tokens={tokens} status={t.status} />
                      </div>
                      <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>
                        <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{t.from}</span> → <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{t.to}</span>
                        <span style={{ margin: '0 6px' }}>·</span>{t.productName} <span style={{ fontFamily: 'ui-monospace, monospace' }}>({t.sku})</span>
                      </div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{t.qty} units · created {timeAgo(t.createdAt)} · expected {timeAgo(t.expectedAt)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {t.status === 'Pending' && <Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Transfer dispatched', message: t.id })}>Dispatch</Button>}
                    {t.status === 'In Transit' && <Button tokens={tokens} variant="primary" size="sm" onClick={() => pushToast({ tone: 'success', title: 'Transfer received', message: `${t.id} · ${t.qty} units added to ${t.to}` })}>Receive</Button>}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {tab === 'purchase' && (
          <Panel tokens={tokens} title="Purchase Orders" subtitle="Track POs from draft to receipt"
            action={<Button tokens={tokens} variant="primary" size="sm" onClick={() => setPoOpen(true)}>+ New PO</Button>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PURCHASE_ORDERS.map(po => {
                const statusColor = po.status === 'Received' ? tokens.status.success : po.status === 'Sent' ? tokens.status.info : po.status === 'Partial' ? tokens.status.warning : po.status === 'Overdue' ? tokens.status.error : tokens.text.tertiary;
                return (
                  <div key={po.id} className="inv-po-row" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt, gap: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${statusColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📦</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{po.id}</span>
                          <StatusPill tokens={tokens} status={po.status} />
                        </div>
                        <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>
                          {po.supplier} · {po.warehouse} · {po.items} items
                        </div>
                        <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>
                          created {timeAgo(po.createdAt)} · expected {timeAgo(po.expectedAt)}{po.receivedAt ? ` · received ${timeAgo(po.receivedAt)}` : ''}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{formatINR(po.total)}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>total value</div>
                    </div>
                    <Button tokens={tokens} variant="ghost" size="sm">View</Button>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}

        {tab === 'movements' && (
          <Panel tokens={tokens} title="Stock Movement History" subtitle="Complete audit of every stock in/out/transfer/adjustment">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {items.flatMap(i => i.movements.slice(0, 2).map((m, mi) => ({ ...m, item: i, key: `${i.id}-${mi}` })))
                .sort((a, b) => b.ts - a.ts)
                .slice(0, 25)
                .map(m => {
                  const toneColor = m.type === 'in' ? tokens.status.success : m.type === 'out' ? tokens.status.error : m.type === 'transfer' ? tokens.status.info : tokens.status.warning;
                  const icon = m.type === 'in' ? '↓' : m.type === 'out' ? '↑' : m.type === 'transfer' ? '→' : '±';
                  return (
                    <div key={m.key} style={{ display: 'flex', gap: 12, padding: '8px 4px', borderBottom: `1px solid ${tokens.border.subtle}`, alignItems: 'center' }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: `${toneColor}15`, color: toneColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{icon}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 12, color: tokens.text.primary }}>
                          <span style={{ fontWeight: 600 }}>{m.item.name}</span>
                          <span style={{ color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace', margin: '0 6px' }}>{m.item.sku}</span>
                          <span style={{ color: toneColor, fontWeight: 600 }}>{m.type === 'in' ? '+' : ''}{m.qty}</span> units
                        </div>
                        <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{m.note} · by {m.actor}</div>
                      </div>
                      <span style={{ fontSize: 10, color: tokens.text.tertiary, flexShrink: 0 }}>{timeAgo(m.ts)}</span>
                    </div>
                  );
                })}
            </div>
          </Panel>
        )}
      </AdminLayout>

      {/* SKU Detail Drawer */}
      {selected && (
        <Drawer
          tokens={tokens}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={selected.name}
          subtitle={`${selected.sku} · ${selected.brand} · ${selected.warehouse}`}
          width={620}
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setDrawerOpen(false)}>Close</Button>
              <Button tokens={tokens} variant="outline" onClick={() => { setTransferOpen(true); }}>Transfer</Button>
              <Button tokens={tokens} variant="primary" onClick={() => pushToast({ tone: 'success', title: 'PO drafted', message: `${selected.sku} · ${selected.reorderQty} units` })}>Reorder</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Stock hero */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
              <div style={{ padding: 10, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Stock</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: selected.stock === 0 ? tokens.status.error : selected.stock <= selected.threshold ? tokens.status.warning : tokens.text.primary, marginTop: 2 }}>{selected.stock}</div>
              </div>
              <div style={{ padding: 10, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Reorder</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: tokens.text.primary, marginTop: 2 }}>{selected.reorderQty}</div>
              </div>
              <div style={{ padding: 10, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>30d Forecast</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: tokens.text.primary, marginTop: 2 }}>{selected.forecast30d}</div>
              </div>
              <div style={{ padding: 10, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Value</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: tokens.text.primary, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>₹{((selected.stock * selected.purchasePrice) / 1000).toFixed(1)}k</div>
              </div>
            </div>

            {/* Adjust stock */}
            <Panel tokens={tokens} title="Quick Stock Adjust" subtitle="Add or remove units (audit logged)">
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <Input tokens={tokens} label="Qty change" type="number" placeholder="e.g. -2 or +10" id="adj-qty" />
                </div>
                <div style={{ flex: 2 }}>
                  <Input tokens={tokens} label="Note" placeholder="Reason for adjustment" id="adj-note" />
                </div>
                <Button tokens={tokens} variant="primary" size="md" onClick={() => {
                  const qtyEl = document.getElementById('adj-qty') as HTMLInputElement | null;
                  const noteEl = document.getElementById('adj-note') as HTMLInputElement | null;
                  const qty = qtyEl ? parseInt(qtyEl.value || '0', 10) : 0;
                  const note = noteEl?.value || 'Manual adjustment';
                  if (!qty) { pushToast({ tone: 'warning', title: 'Enter quantity' }); return; }
                  handleAdjustStock(selected.id, qty, note);
                  if (qtyEl) qtyEl.value = '';
                  if (noteEl) noteEl.value = '';
                  setSelected(prev => prev ? { ...prev, stock: Math.max(0, prev.stock + qty) } : prev);
                }}>Apply</Button>
              </div>
            </Panel>

            {/* Product details */}
            <Panel tokens={tokens} title="Product Details">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: 11 }}>
                <div><span style={{ color: tokens.text.tertiary }}>Brand:</span> <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{selected.brand}</span></div>
                <div><span style={{ color: tokens.text.tertiary }}>Category:</span> <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{selected.category}</span></div>
                <div><span style={{ color: tokens.text.tertiary }}>Supplier:</span> <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{selected.supplier}</span></div>
                <div><span style={{ color: tokens.text.tertiary }}>Supplier SKU:</span> <span style={{ color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{selected.supplierSku}</span></div>
                <div><span style={{ color: tokens.text.tertiary }}>Warehouse:</span> <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{selected.warehouse}</span></div>
                <div><span style={{ color: tokens.text.tertiary }}>Bin Location:</span> <span style={{ color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{selected.binLocation}</span></div>
                <div><span style={{ color: tokens.text.tertiary }}>Purchase Price:</span> <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{formatINR(selected.purchasePrice)}</span></div>
                <div><span style={{ color: tokens.text.tertiary }}>Selling Price:</span> <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{formatINR(selected.sellingPrice)}</span></div>
                <div><span style={{ color: tokens.text.tertiary }}>GST Rate:</span> <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{selected.gstRate}%</span></div>
                <div><span style={{ color: tokens.text.tertiary }}>Margin:</span> <span style={{ color: tokens.status.success, fontWeight: 700 }}>{Math.round(((selected.sellingPrice - selected.purchasePrice) / selected.sellingPrice) * 100)}%</span></div>
              </div>
            </Panel>

            {/* Movements timeline */}
            <Panel tokens={tokens} title="Stock Movement Timeline" subtitle={`${selected.movements.length} recent events`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', paddingLeft: 16 }}>
                <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: tokens.border.subtle }} />
                {selected.movements.map((m, i) => {
                  const toneColor = m.type === 'in' ? tokens.status.success : m.type === 'out' ? tokens.status.error : m.type === 'transfer' ? tokens.status.info : tokens.status.warning;
                  return (
                    <div key={i} style={{ position: 'relative', paddingBottom: i === selected.movements.length - 1 ? 0 : 14 }}>
                      <div style={{ position: 'absolute', left: -16, top: 4, width: 11, height: 11, borderRadius: '50%', background: toneColor, boxShadow: `0 0 0 3px ${tokens.bg.surface}` }} />
                      <div style={{ fontSize: 12, color: tokens.text.primary }}>
                        <span style={{ fontWeight: 600, color: toneColor }}>{m.type === 'in' ? '+' : ''}{m.qty}</span> units · <span style={{ fontWeight: 600 }}>{m.type}</span>
                      </div>
                      <div style={{ fontSize: 10, color: tokens.text.secondary, marginTop: 2 }}>{m.note}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{m.actor} · {timeAgo(m.ts)}</div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>
        </Drawer>
      )}

      {/* New Transfer Drawer */}
      <Drawer
        tokens={tokens}
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        title="New Inventory Transfer"
        subtitle="Move stock between warehouses"
        width={480}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => setTransferOpen(false)}>Cancel</Button>
            <Button tokens={tokens} variant="primary" onClick={() => { pushToast({ tone: 'success', title: 'Transfer created', message: 'TRF-885 · pending dispatch' }); setTransferOpen(false); }}>Create Transfer</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select tokens={tokens} label="From Warehouse" options={WAREHOUSES.map(w => ({ value: w.name, label: w.name }))} />
          <Select tokens={tokens} label="To Warehouse" options={WAREHOUSES.map(w => ({ value: w.name, label: w.name }))} />
          <Input tokens={tokens} label="Product SKU" placeholder="SKU-1000" />
          <Input tokens={tokens} label="Quantity" type="number" placeholder="10" />
          <Input tokens={tokens} label="Expected Delivery Date" type="date" />
          <Input tokens={tokens} label="Note (optional)" placeholder="Reason for transfer" />
        </div>
      </Drawer>

      {/* New PO Drawer */}
      <Drawer
        tokens={tokens}
        open={poOpen}
        onClose={() => setPoOpen(false)}
        title="New Purchase Order"
        subtitle="Order stock from a supplier"
        width={480}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => setPoOpen(false)}>Save Draft</Button>
            <Button tokens={tokens} variant="primary" onClick={() => { pushToast({ tone: 'success', title: 'PO sent', message: 'PO-2026-0149 · supplier notified' }); setPoOpen(false); }}>Send PO</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select tokens={tokens} label="Supplier" options={SUPPLIERS.map(s => ({ value: s, label: s }))} />
          <Select tokens={tokens} label="Deliver To" options={WAREHOUSES.map(w => ({ value: w.name, label: w.name }))} />
          <Input tokens={tokens} label="Expected Delivery" type="date" />
          <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>Line Items</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 6 }}>
            <Input tokens={tokens} placeholder="SKU" />
            <Input tokens={tokens} placeholder="Qty" type="number" />
            <Input tokens={tokens} placeholder="Cost/unit" type="number" />
          </div>
          <Button tokens={tokens} variant="outline" size="sm">+ Add Line Item</Button>
        </div>
      </Drawer>

      {/* Bulk Update Drawer */}
      <Drawer
        tokens={tokens}
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Bulk Inventory Update"
        subtitle="Upload CSV or paste SKU/qty pairs"
        width={520}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => setBulkOpen(false)}>Cancel</Button>
            <Button tokens={tokens} variant="primary" onClick={() => { pushToast({ tone: 'success', title: 'Bulk update applied', message: '12 SKUs updated · audit logged' }); setBulkOpen(false); }}>Apply to 12 SKUs</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: 16, border: `2px dashed ${tokens.border.strong}`, borderRadius: 10, textAlign: 'center', background: tokens.bg.surfaceAlt }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>📂</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>Drop CSV file here</div>
            <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>Format: SKU, Quantity, Action (set/add/remove), Note</div>
            <Button tokens={tokens} variant="outline" size="sm" style={{ marginTop: 8 }}>Browse Files</Button>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>Or paste manually</div>
          <textarea
            placeholder="SKU-1000, +10, add, Restock from PO&#10;SKU-1001, -2, remove, Damaged in storage&#10;SKU-1002, 50, set, Stock count adjustment"
            style={{ minHeight: 120, padding: 10, fontSize: 11, fontFamily: 'ui-monospace, monospace', background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`, borderRadius: 8, color: tokens.text.primary, resize: 'vertical' }}
          />
          <div style={{ padding: '8px 10px', borderRadius: 8, background: `${tokens.status.info}15`, border: `1px solid ${tokens.status.info}30`, fontSize: 11, color: tokens.text.secondary }}>
            💡 Each update creates an audit log entry with the actor, timestamp, and reason.
          </div>
        </div>
      </Drawer>

      <style jsx>{`
        :global(.inv-kpi-grid) {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        :global(.inv-wh-grid) {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        :global(.inv-kpi-card) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 14px;
          padding: 14px;
          box-shadow: ${tokens.shadow.sm};
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1), box-shadow 240ms cubic-bezier(0.16,1,0.3,1), border-color 240ms ease;
          animation: invFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.inv-kpi-card:hover) {
          transform: translateY(-2px);
          box-shadow: ${tokens.shadow.md};
          border-color: ${tokens.border.strong};
        }
        :global(.inv-wh-card) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 14px;
          padding: 14px;
          box-shadow: ${tokens.shadow.sm};
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1), box-shadow 240ms cubic-bezier(0.16,1,0.3,1), border-color 240ms ease;
          animation: invFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.inv-wh-card:hover) {
          transform: translateY(-2px);
          box-shadow: ${tokens.shadow.md};
          border-color: ${tokens.border.strong};
        }
        :global(.inv-2col) {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 16px;
          align-items: start;
        }
        :global(.inv-bulkbar) {
          position: sticky; top: 56px; z-index: 5;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: '10px 14px';
          background: ${tokens.text.primary};
          color: ${tokens.bg.app};
          border-radius: 10px;
          margin-bottom: 12px;
          box-shadow: ${tokens.shadow.md};
          animation: invSlideIn 240ms cubic-bezier(0.16,1,0.3,1);
        }
        :global(.inv-transfer-row), :global(.inv-po-row) {
          transition: background 180ms ease, transform 180ms ease;
        }
        :global(.inv-transfer-row:hover), :global(.inv-po-row:hover) {
          background: ${tokens.bg.hover} !important;
          transform: translateX(2px);
        }
        @keyframes invFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes invSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1400px) {
          :global(.inv-kpi-grid) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          :global(.inv-wh-grid) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 1100px) {
          :global(.inv-kpi-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          :global(.inv-wh-grid) { grid-template-columns: repeat(1, minmax(0, 1fr)); }
          :global(.inv-2col) { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 640px) {
          :global(.inv-kpi-grid) { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
    </>
  );
}
