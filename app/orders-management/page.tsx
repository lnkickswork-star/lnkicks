/**
 * LNKICKS Enterprise Admin — Orders Management
 * ------------------------------------------------------------
 * Premium order management with:
 *  - Status tabs (All / Pending / Confirmed / Shipped / Delivered / Cancelled / Returned)
 *  - Enterprise DataTable with status badges
 *  - Bulk actions (Print labels, Update status, Export)
 *  - Advanced filters (search, status, courier, date range)
 *  - Order detail drawer with timeline, notes, courier, tracking, invoices, refunds
 *  - Quick status update
 */

'use client';

import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Button, Badge, StatusPill, Select, SearchInput, Drawer, Tabs, useToast,
  IconButton, Dropdown, MenuItem, MenuDivider, KeyValue, Avatar,
} from '@/components/admin/ui';

interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  product: string;
  brand: string;
  size: string;
  qty: number;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned' | 'Refunded';
  courier: string;
  trackingNumber?: string;
  placedAt: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded' | 'Failed';
  shippingAddress: string;
}

const COURIERS = ['BlueDart', 'Delhivery', 'DTDC', 'Ekart', 'India Post'];
const PRODUCTS = [
  { name: 'Air Jordan 1 Low Powder Blue', brand: 'NIKE', price: 8899 },
  { name: 'Samba OG Cloud White', brand: 'ADIDAS', price: 9499 },
  { name: 'Nike Dunk Low Panda', brand: 'NIKE', price: 11499 },
  { name: 'Yeezy Boost 350 V2 Zebra', brand: 'YEEZY', price: 22999 },
  { name: 'New Balance 530 Steel Grey', brand: 'NEW BALANCE', price: 12999 },
  { name: 'Jordan 4 Bred', brand: 'JORDAN', price: 18999 },
  { name: 'Adidas Ultraboost 1.0 DNA', brand: 'ADIDAS', price: 14999 },
  { name: 'Travis Scott x Jordan 1 Low Mocha', brand: 'JORDAN', price: 24999 },
];
const CUSTOMER_NAMES = [
  'Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Arjun Reddy', 'Sai Kumar',
  'Rohan Gupta', 'Karthik Iyer', 'Dev Malhotra', 'Kabir Nair', 'Ishaan Mehta',
];

const STATUSES: AdminOrder['status'][] = [
  'Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded',
];

function generateOrders(): AdminOrder[] {
  const out: AdminOrder[] = [];
  const now = Date.now();
  for (let i = 0; i < 60; i++) {
    const p = PRODUCTS[i % PRODUCTS.length];
    const c = CUSTOMER_NAMES[i % CUSTOMER_NAMES.length];
    const statusIdx = (i * 7) % STATUSES.length;
    const status = STATUSES[statusIdx];
    const courier = COURIERS[i % COURIERS.length];
    out.push({
      id: `LNK-${2841 - i}`,
      customerName: c,
      customerEmail: c.toLowerCase().replace(' ', '.') + '@gmail.com',
      customerPhone: `+91 9${String(800000000 + i * 1234567).slice(0, 9)}`,
      product: p.name,
      brand: p.brand,
      size: `UK ${(7 + (i % 5))}`,
      qty: 1 + (i % 3),
      amount: p.price * (1 + (i % 3)),
      status,
      courier,
      trackingNumber: ['Shipped', 'Out for Delivery', 'Delivered'].includes(status) ? `${courier.substring(0, 2).toUpperCase()}${1000000 + i * 137}` : undefined,
      placedAt: now - i * 3600_000 * 6,
      paymentMethod: i % 3 === 0 ? 'UPI' : i % 3 === 1 ? 'Card' : 'COD',
      paymentStatus: status === 'Cancelled' ? 'Failed' : status === 'Refunded' ? 'Refunded' : i % 8 === 0 ? 'Pending' : 'Paid',
      shippingAddress: `${i + 12}, Brigade Road, Bengaluru, Karnataka 560001`,
    });
  }
  return out;
}

const ALL_ORDERS = generateOrders();

export default function OrdersManagementPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>(ALL_ORDERS);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [courierFilter, setCourierFilter] = useState('All');
  const [selected, setSelected] = useState<string[]>([]);
  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    STATUSES.forEach(s => { c[s.toLowerCase().replace(/\s/g, '')] = orders.filter(o => o.status === s).length; });
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (search) {
        const q = search.toLowerCase();
        if (!o.id.toLowerCase().includes(q) && !o.customerName.toLowerCase().includes(q) && !o.trackingNumber?.toLowerCase().includes(q) && !o.customerPhone.includes(q)) return false;
      }
      if (statusTab !== 'all') {
        const matchStatus = o.status.toLowerCase().replace(/\s/g, '') === statusTab;
        if (!matchStatus) return false;
      }
      if (courierFilter !== 'All' && o.courier !== courierFilter) return false;
      return true;
    });
  }, [orders, search, statusTab, courierFilter]);

  function updateStatus(id: string, status: AdminOrder['status']) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setDetailOrder(prev => prev?.id === id ? { ...prev, status } : prev);
    pushToast({ tone: 'success', title: 'Status updated', message: `Order ${id} → ${status}` });
  }

  function bulkUpdateStatus(status: AdminOrder['status']) {
    setOrders(prev => prev.map(o => selected.includes(o.id) ? { ...o, status } : o));
    pushToast({ tone: 'success', title: `${selected.length} orders → ${status}` });
    setSelected([]);
  }

  function bulkPrint() {
    pushToast({ tone: 'info', title: 'Generating labels', message: `${selected.length} shipping labels sent to printer.` });
  }

  function bulkExport() {
    pushToast({ tone: 'success', title: 'Export started', message: `${filtered.length} orders exporting to CSV.` });
  }

  const columns: Column<AdminOrder>[] = [
    {
      key: 'id',
      header: 'Order ID',
      sortable: true,
      sortValue: o => o.id,
      width: 110,
      render: o => (
        <div>
          <div style={{ fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{o.id}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
            {new Date(o.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      sortValue: o => o.customerName,
      render: o => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar tokens={tokens} name={o.customerName} size={28} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: tokens.text.primary, fontSize: 12.5 }}>{o.customerName}</div>
            <div style={{ fontSize: 10, color: tokens.text.tertiary }}>{o.customerPhone}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Product',
      render: o => (
        <div style={{ maxWidth: 220 }}>
          <div style={{ fontWeight: 500, color: tokens.text.primary, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {o.product}
          </div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
            {o.brand} · {o.size} · Qty {o.qty}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      sortValue: o => o.amount,
      render: o => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontWeight: 700, color: tokens.text.primary }}>₹{o.amount.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: 10, color: tokens.text.tertiary }}>{o.paymentMethod}</span>
        </div>
      ),
    },
    {
      key: 'payment',
      header: 'Payment',
      align: 'center',
      sortable: true,
      sortValue: o => o.paymentStatus,
      render: o => <StatusPill tokens={tokens} status={o.paymentStatus} />,
    },
    {
      key: 'courier',
      header: 'Courier',
      render: o => o.trackingNumber ? (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.primary }}>{o.courier}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace' }}>{o.trackingNumber}</div>
        </div>
      ) : <span style={{ fontSize: 11, color: tokens.text.tertiary }}>—</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: o => o.status,
      render: o => <StatusPill tokens={tokens} status={o.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      sortable: false,
      render: o => (
        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
          <Button tokens={tokens} variant="ghost" size="sm" onClick={() => setDetailOrder(o)}>View</Button>
          <Dropdown
            tokens={tokens}
            align="right"
            width={180}
            trigger={<IconButton tokens={tokens} icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>} label="More" size={28} />}
          >
            <MenuItem tokens={tokens} onClick={() => setDetailOrder(o)}>View Details</MenuItem>
            <MenuItem tokens={tokens} onClick={() => pushToast({ tone: 'info', title: 'Invoice generated', message: o.id })}>Download Invoice</MenuItem>
            <MenuItem tokens={tokens} onClick={() => pushToast({ tone: 'info', title: 'Label printing', message: o.id })}>Print Label</MenuItem>
            <MenuDivider tokens={tokens} />
            <div style={{ padding: '4px 10px', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase' }}>Update Status</div>
            {STATUSES.map(s => (
              <MenuItem key={s} tokens={tokens} active={o.status === s} onClick={() => updateStatus(o.id, s)}>{s}</MenuItem>
            ))}
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Orders"
      subtitle="Fulfillment & tracking"
      requirePermission="order.view"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Sales' }, { label: 'Orders' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Order Management"
        subtitle="Process customer orders, update courier tracking, manage returns & refunds, and generate invoices."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Sales' }, { label: 'Orders' }]}
        meta={<Badge tokens={tokens} tone="warning">{counts.pending} pending</Badge>}
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={bulkExport}
              icon={<DownloadIcon color={tokens.text.secondary} />}
            >Export</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'info', title: 'Bulk invoice print', message: 'Generating PDFs…' })}
              icon={<PrinterIcon color={tokens.bg.app} />}
            >Print All Invoices</Button>
          </>
        }
      />

      {/* STATUS TABS + FILTERS */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Tabs
          tokens={tokens}
          size="sm"
          tabs={[
            { key: 'all', label: 'All', badge: counts.all },
            { key: 'pending', label: 'Pending', badge: counts.pending },
            { key: 'confirmed', label: 'Confirmed', badge: counts.confirmed },
            { key: 'shipped', label: 'Shipped', badge: counts.shipped },
            { key: 'outfordelivery', label: 'Out for Delivery', badge: counts.outfordelivery },
            { key: 'delivered', label: 'Delivered', badge: counts.delivered },
            { key: 'cancelled', label: 'Cancelled', badge: counts.cancelled },
            { key: 'returned', label: 'Returned', badge: counts.returned },
          ]}
          active={statusTab}
          onChange={setStatusTab}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 260 }}>
          <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search order ID, customer, phone, tracking…" />
        </div>
        <Select
          tokens={tokens}
          value={courierFilter}
          onChange={e => setCourierFilter(e.target.value)}
          options={['All', ...COURIERS].map(c => ({ value: c, label: c === 'All' ? 'All Couriers' : c }))}
          style={{ height: 34, width: 150 }}
        />
        <Select
          tokens={tokens}
          value=""
          onChange={() => {}}
          options={[
            { value: '', label: 'All Dates' },
            { value: 'today', label: 'Today' },
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
          ]}
          style={{ height: 34, width: 140 }}
        />
      </div>

      <EnterpriseDataTable<AdminOrder>
        tokens={tokens}
        columns={columns}
        rows={filtered}
        getRowId={o => o.id}
        selectable
        onSelectionChange={setSelected}
        pageSize={12}
        onRowClick={o => setDetailOrder(o)}
        bulkActions={() => (
          <>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={bulkPrint}>Print Labels</Button>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={() => bulkUpdateStatus('Confirmed')}>Mark Confirmed</Button>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={() => bulkUpdateStatus('Shipped')}>Mark Shipped</Button>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={() => bulkUpdateStatus('Delivered')}>Mark Delivered</Button>
            <Button tokens={tokens} variant="danger" size="sm" onClick={() => bulkUpdateStatus('Cancelled')}>Cancel</Button>
          </>
        )}
      />

      {/* ORDER DETAIL DRAWER */}
      <Drawer
        tokens={tokens}
        open={Boolean(detailOrder)}
        onClose={() => setDetailOrder(null)}
        title={detailOrder ? `Order ${detailOrder.id}` : ''}
        subtitle={detailOrder ? detailOrder.customerName : ''}
        width={520}
        footer={
          detailOrder && (
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => pushToast({ tone: 'info', title: 'Invoice downloaded', message: detailOrder.id })}>Invoice</Button>
              <Button tokens={tokens} variant="outline" onClick={() => pushToast({ tone: 'info', title: 'Label printing', message: detailOrder.id })}>Print Label</Button>
              <Button tokens={tokens} variant="primary" onClick={() => pushToast({ tone: 'success', title: 'Email sent', message: 'Customer notified.' })}>Notify Customer</Button>
            </>
          )
        }
      >
        {detailOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Status + amount */}
            <div style={{
              background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Status</div>
                <StatusPill tokens={tokens} status={detailOrder.status} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Total</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: tokens.text.primary }}>₹{detailOrder.amount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Quick status update */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Update Status</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(detailOrder.id, s)}
                    style={{
                      padding: '4px 9px', borderRadius: 6, border: 'none',
                      background: detailOrder.status === s ? tokens.text.primary : tokens.bg.surfaceAlt,
                      color: detailOrder.status === s ? tokens.bg.app : tokens.text.secondary,
                      fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      transition: 'all 120ms ease',
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Timeline</div>
              <OrderTimeline tokens={tokens} order={detailOrder} />
            </div>

            {/* Customer info */}
            <div style={{
              background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 14,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            }}>
              <KeyValue tokens={tokens} label="Customer" value={detailOrder.customerName} />
              <KeyValue tokens={tokens} label="Phone" value={detailOrder.customerPhone} />
              <KeyValue tokens={tokens} label="Email" value={detailOrder.customerEmail} />
              <KeyValue tokens={tokens} label="Payment" value={`${detailOrder.paymentMethod} · ${detailOrder.paymentStatus}`} />
            </div>

            {/* Product */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Items</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 8, background: tokens.bg.surface,
                  border: `1px solid ${tokens.border.subtle}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>👟</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{detailOrder.product}</div>
                  <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
                    {detailOrder.brand} · Size {detailOrder.size} · Qty {detailOrder.qty}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>
                  ₹{detailOrder.amount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Shipping + Courier */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Courier</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{detailOrder.courier}</div>
                {detailOrder.trackingNumber && (
                  <div style={{ fontSize: 11, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>
                    {detailOrder.trackingNumber}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Shipping Address</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
                  {detailOrder.shippingAddress}
                </div>
              </div>
            </div>

            {/* Order notes */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Order Notes</div>
              <textarea
                placeholder="Add internal note (visible only to admins)…"
                style={{
                  width: '100%', minHeight: 60, padding: 10, borderRadius: 8,
                  border: `1px solid ${tokens.border.subtle}`,
                  background: tokens.bg.surface, color: tokens.text.primary,
                  fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        )}
      </Drawer>
    </AdminLayout>
  );
}

function OrderTimeline({ tokens, order }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; order: AdminOrder }) {
  const stages: { label: string; status: 'done' | 'current' | 'pending' }[] = [
    { label: 'Order Placed', status: 'done' },
    { label: 'Confirmed', status: ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'done' : order.status === 'Pending' ? 'current' : 'pending' },
    { label: 'Packed', status: ['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'done' : order.status === 'Confirmed' ? 'current' : 'pending' },
    { label: 'Shipped', status: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'done' : order.status === 'Packed' ? 'current' : 'pending' },
    { label: 'Out for Delivery', status: ['Out for Delivery', 'Delivered'].includes(order.status) ? 'done' : order.status === 'Shipped' ? 'current' : 'pending' },
    { label: 'Delivered', status: order.status === 'Delivered' ? 'done' : order.status === 'Out for Delivery' ? 'current' : 'pending' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {stages.map((stage, i) => (
        <div key={stage.label} style={{ display: 'flex', gap: 12, position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: stage.status === 'done' ? tokens.status.success
                : stage.status === 'current' ? tokens.status.info
                : tokens.bg.surfaceAlt,
              color: stage.status === 'done' || stage.status === 'current' ? '#fff' : tokens.text.tertiary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, flexShrink: 0,
              border: stage.status === 'current' ? `2px solid ${tokens.status.info}40` : 'none',
            }}>
              {stage.status === 'done' ? '✓' : i + 1}
            </div>
            {i < stages.length - 1 && (
              <div style={{
                width: 2, flex: 1, minHeight: 16,
                background: stage.status === 'done' ? tokens.status.success : tokens.border.subtle,
                margin: '2px 0',
              }} />
            )}
          </div>
          <div style={{ paddingBottom: 12 }}>
            <div style={{
              fontSize: 12, fontWeight: 600,
              color: stage.status === 'pending' ? tokens.text.tertiary : tokens.text.primary,
            }}>{stage.label}</div>
            {stage.status === 'current' && (
              <div style={{ fontSize: 10, color: tokens.status.info, marginTop: 1 }}>In progress</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DownloadIcon({ color }: { color: string }) {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>;
}
function PrinterIcon({ color }: { color: string }) {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" /></svg>;
}
