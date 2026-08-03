/**
 * LNKICKS Enterprise Admin — Orders Management (OMS)
 * ------------------------------------------------------------
 * Redesigned premium Order Management System inspired by
 * Amazon Seller Central, Shopify Admin, ShipStation, Stripe
 * Dashboard, and Adobe Commerce.
 *
 * Architecture:
 *   1. Page Header      — title, subtitle, live status, export, refresh
 *   2. KPI Strip        — Today / Pending / Processing / Completed / Cancelled
 *   3. Status Tabs      — All + 9 fulfillment states with live counts
 *   4. Toolbar          — instant search + advanced filters toggle
 *   5. Advanced Filters — payment, courier, date, brand, geo, amount
 *   6. Enterprise Table — 12 columns, sticky header, sortable, selectable
 *   7. Bulk Action Bar  — 9 operations (invoice, label, courier, status, cancel, refund, export)
 *   8. Order Drawer     — timeline, items, customer, addresses, payment,
 *                         courier, invoice, refund, notes, activity history
 *   9. Status System    — premium chips with consistent enterprise tones
 *  10. Responsive       — desktop / ultra-wide / laptop / tablet / mobile
 *  11. Micro-interactions — drawer slide, timeline stagger, skeleton, pulses
 *
 * Data: preserves the existing mock order generator (the page's local
 * backend). Enriches display with DERIVED metadata (expected delivery,
 * assigned staff, city/state, invoice #, activity log) computed from
 * existing fields — same pattern as the dashboard's derived analytics.
 * No new orders created. No business logic changed. No APIs touched.
 * Route unchanged (/orders-management). RBAC unchanged (order.view).
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Button, Badge, StatusPill, Select, SearchInput, Drawer, Tabs, useToast,
  IconButton, Dropdown, MenuItem, MenuDivider, KeyValue, Avatar,
} from '@/components/admin/ui';
import type { AdminThemeTokens } from '@/lib/admin/types';

type Tk = AdminThemeTokens;

/* ============================================================= */
/* TYPES                                                         */
/* ============================================================= */

type OrderStatus =
  | 'Pending' | 'Confirmed' | 'Packed' | 'Shipped'
  | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned' | 'Refunded';

type PaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

interface OrderItem {
  name: string;
  brand: string;
  size: string;
  qty: number;
  price: number;
  image?: string;
}

interface ActivityEntry {
  id: string;
  timestamp: number;
  event: string;
  actor: string;
  detail?: string;
}

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
  subtotal: number;
  shippingCost: number;
  tax: number;
  status: OrderStatus;
  courier: string;
  trackingNumber?: string;
  placedAt: number;
  expectedDelivery: number;
  deliveredAt?: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionId: string;
  shippingAddress: string;
  billingAddress: string;
  city: string;
  state: string;
  country: string;
  assignedStaff: string;
  invoiceNumber: string;
  refundAmount: number;
  refundReason?: string;
  items: OrderItem[];
  activity: ActivityEntry[];
  notes: { id: string; author: string; text: string; timestamp: number }[];
}

/* ============================================================= */
/* CONSTANTS                                                     */
/* ============================================================= */

const COURIERS = ['BlueDart', 'Delhivery', 'DTDC', 'Ekart', 'India Post'];
const PAYMENT_METHODS = ['UPI', 'Card', 'COD', 'Net Banking', 'Wallet'];
const STAFF = ['Priya Nair', 'Arjun Mehta', 'Sneha Reddy', 'Vikram Singh', 'Ananya Das'];
const CITIES = [
  { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { city: 'Delhi', state: 'Delhi', country: 'India' },
  { city: 'Hyderabad', state: 'Telangana', country: 'India' },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  { city: 'Pune', state: 'Maharashtra', country: 'India' },
  { city: 'Kolkata', state: 'West Bengal', country: 'India' },
  { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
];
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
  'Aanya Verma', 'Diya Joshi', 'Saanvi Rao', 'Myra Kapoor', 'Anika Desai',
];

const ALL_STATUSES: OrderStatus[] = [
  'Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery',
  'Delivered', 'Cancelled', 'Returned', 'Refunded',
];

const TAB_STATUSES: { key: string; label: string; statuses: OrderStatus[] }[] = [
  { key: 'all', label: 'All Orders', statuses: ALL_STATUSES },
  { key: 'pending', label: 'Pending', statuses: ['Pending'] },
  { key: 'confirmed', label: 'Confirmed', statuses: ['Confirmed'] },
  { key: 'packed', label: 'Packed', statuses: ['Packed'] },
  { key: 'shipped', label: 'Shipped', statuses: ['Shipped'] },
  { key: 'outfordelivery', label: 'Out for Delivery', statuses: ['Out for Delivery'] },
  { key: 'delivered', label: 'Delivered', statuses: ['Delivered'] },
  { key: 'cancelled', label: 'Cancelled', statuses: ['Cancelled'] },
  { key: 'returned', label: 'Returned', statuses: ['Returned'] },
  { key: 'refunded', label: 'Refunded', statuses: ['Refunded'] },
];

const DATE_FILTERS = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

const AMOUNT_FILTERS = [
  { value: 'all', label: 'All Amounts' },
  { value: '0-5000', label: 'Under ₹5,000' },
  { value: '5000-10000', label: '₹5,000 – ₹10,000' },
  { value: '10000-20000', label: '₹10,000 – ₹20,000' },
  { value: '20000+', label: 'Above ₹20,000' },
];

/* ============================================================= */
/* DATA GENERATION (preserved + enriched with derived metadata) */
/* ============================================================= */

function generateOrders(): AdminOrder[] {
  const out: AdminOrder[] = [];
  const now = Date.now();
  for (let i = 0; i < 60; i++) {
    const p = PRODUCTS[i % PRODUCTS.length];
    const c = CUSTOMER_NAMES[i % CUSTOMER_NAMES.length];
    const statusIdx = (i * 7) % ALL_STATUSES.length;
    const status = ALL_STATUSES[statusIdx];
    const courier = COURIERS[i % COURIERS.length];
    const geo = CITIES[i % CITIES.length];
    const qty = 1 + (i % 3);
    const subtotal = p.price * qty;
    const shippingCost = subtotal > 10000 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05);
    const amount = subtotal + shippingCost + tax;
    const placedAt = now - i * 3600_000 * 6;

    // Derived: expected delivery based on status progression
    const etaDays = status === 'Delivered' ? 4
      : status === 'Out for Delivery' ? 0
      : status === 'Shipped' ? 1
      : status === 'Packed' ? 2
      : status === 'Confirmed' ? 3
      : status === 'Pending' ? 5
      : 4;
    const expectedDelivery = placedAt + etaDays * 24 * 3600_000;
    const deliveredAt = status === 'Delivered' ? expectedDelivery : undefined;

    const hasTracking = ['Shipped', 'Out for Delivery', 'Delivered'].includes(status);
    const paymentStatus: PaymentStatus =
      status === 'Cancelled' ? 'Failed'
      : status === 'Refunded' ? 'Refunded'
      : i % 8 === 0 ? 'Pending'
      : 'Paid';

    const paymentMethod = PAYMENT_METHODS[i % PAYMENT_METHODS.length];
    const refundAmount = status === 'Refunded' ? amount : 0;
    const refundReason = status === 'Refunded'
      ? ['Size mismatch', 'Damaged in transit', 'Customer request', 'Wrong item shipped'][i % 4]
      : undefined;

    // Derived: activity log from status timeline
    const activity: ActivityEntry[] = [];
    activity.push({
      id: `a-${i}-1`, timestamp: placedAt, event: 'Order Placed',
      actor: c, detail: `via ${paymentMethod} · ₹${amount.toLocaleString('en-IN')}`,
    });
    if (paymentStatus === 'Paid' && status !== 'Cancelled') {
      activity.push({
        id: `a-${i}-2`, timestamp: placedAt + 5 * 60_000, event: 'Payment Received',
        actor: 'System', detail: `${paymentMethod} · Txn ${courier.substring(0, 2)}${1000000 + i * 137}`,
      });
    }
    if (['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
      activity.push({
        id: `a-${i}-3`, timestamp: placedAt + 30 * 60_000, event: 'Order Confirmed',
        actor: STAFF[i % STAFF.length], detail: 'Inventory allocated',
      });
    }
    if (['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
      activity.push({
        id: `a-${i}-4`, timestamp: placedAt + 4 * 3600_000, event: 'Packed & Ready',
        actor: STAFF[(i + 2) % STAFF.length], detail: `Assigned to ${courier}`,
      });
    }
    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
      activity.push({
        id: `a-${i}-5`, timestamp: placedAt + 8 * 3600_000, event: 'Shipped',
        actor: courier, detail: hasTracking ? `Tracking ${courier.substring(0, 2).toUpperCase()}${1000000 + i * 137}` : undefined,
      });
    }
    if (['Out for Delivery', 'Delivered'].includes(status)) {
      activity.push({
        id: `a-${i}-6`, timestamp: placedAt + 20 * 3600_000, event: 'Out for Delivery',
        actor: courier, detail: geo.city,
      });
    }
    if (status === 'Delivered' && deliveredAt) {
      activity.push({
        id: `a-${i}-7`, timestamp: deliveredAt, event: 'Delivered',
        actor: courier, detail: geo.city,
      });
    }
    if (status === 'Cancelled') {
      activity.push({
        id: `a-${i}-c`, timestamp: placedAt + 2 * 3600_000, event: 'Order Cancelled',
        actor: c, detail: 'Cancelled by customer',
      });
    }
    if (status === 'Returned') {
      activity.push({
        id: `a-${i}-r`, timestamp: placedAt + 48 * 3600_000, event: 'Return Initiated',
        actor: c, detail: 'Size mismatch',
      });
    }
    if (status === 'Refunded') {
      activity.push({
        id: `a-${i}-rf`, timestamp: placedAt + 72 * 3600_000, event: 'Refund Processed',
        actor: STAFF[(i + 3) % STAFF.length], detail: `${refundReason} · ₹${refundAmount.toLocaleString('en-IN')}`,
      });
    }

    out.push({
      id: `LNK-${2841 - i}`,
      customerName: c,
      customerEmail: c.toLowerCase().replace(' ', '.') + '@gmail.com',
      customerPhone: `+91 9${String(800000000 + i * 1234567).slice(0, 9)}`,
      product: p.name,
      brand: p.brand,
      size: `UK ${7 + (i % 5)}`,
      qty,
      amount,
      subtotal,
      shippingCost,
      tax,
      status,
      courier,
      trackingNumber: hasTracking ? `${courier.substring(0, 2).toUpperCase()}${1000000 + i * 137}` : undefined,
      placedAt,
      expectedDelivery,
      deliveredAt,
      paymentMethod,
      paymentStatus,
      transactionId: `${courier.substring(0, 2).toUpperCase()}${1000000 + i * 137}`,
      shippingAddress: `${i + 12}, Brigade Road, ${geo.city}, ${geo.state} ${String(560001 + i * 11).slice(0, 6)}`,
      billingAddress: `${i + 12}, Brigade Road, ${geo.city}, ${geo.state} ${String(560001 + i * 11).slice(0, 6)}`,
      city: geo.city,
      state: geo.state,
      country: geo.country,
      assignedStaff: STAFF[i % STAFF.length],
      invoiceNumber: `INV-${2841 - i}-${new Date(placedAt).getFullYear()}`,
      refundAmount,
      refundReason,
      items: [{
        name: p.name,
        brand: p.brand,
        size: `UK ${7 + (i % 5)}`,
        qty,
        price: p.price,
      }],
      activity,
      notes: i % 5 === 0 ? [{
        id: `n-${i}`,
        author: STAFF[i % STAFF.length],
        text: 'Customer requested expedited delivery. Confirmed via phone.',
        timestamp: placedAt + 15 * 60_000,
      }] : [],
    });
  }
  return out;
}

const ALL_ORDERS = generateOrders();

/* ============================================================= */
/* HELPERS                                                       */
/* ============================================================= */

function fmtDate(ts: number, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(ts).toLocaleDateString('en-IN', opts ?? { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtDateShort(ts: number): string {
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
function fmtDateTime(ts: number): string {
  return new Date(ts).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
  });
}
function fmtMoney(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}
function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return fmtDateShort(ts);
}

/* ============================================================= */
/* PAGE                                                          */
/* ============================================================= */

export default function OrdersManagementPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();

  const [orders, setOrders] = useState<AdminOrder[]>(ALL_ORDERS);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [detailOrder, setDetailOrder] = useState<AdminOrder | null>(null);

  // Advanced filters
  const [fPaymentStatus, setFPaymentStatus] = useState('all');
  const [fCourier, setFCourier] = useState('all');
  const [fDateRange, setFDateRange] = useState('all');
  const [fPaymentMethod, setFPaymentMethod] = useState('all');
  const [fBrand, setFBrand] = useState('all');
  const [fCity, setFCity] = useState('all');
  const [fState, setFState] = useState('all');
  const [fAmount, setFAmount] = useState('all');

  // Mount skeleton
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, []);

  /* -------- Derived: counts for KPI strip + tabs -------- */
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    c.today = orders.filter(o => o.placedAt >= todayStart.getTime()).length;
    c.pending = orders.filter(o => o.status === 'Pending').length;
    c.processing = orders.filter(o =>
      ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery'].includes(o.status)
    ).length;
    c.completed = orders.filter(o => o.status === 'Delivered').length;
    c.cancelled = orders.filter(o => o.status === 'Cancelled').length;
    ALL_STATUSES.forEach(s => {
      c[s.toLowerCase().replace(/\s/g, '')] = orders.filter(o => o.status === s).length;
    });
    return c;
  }, [orders]);

  /* -------- Derived: available filter options -------- */
  const brandOptions = useMemo(() => {
    const set = new Set(orders.map(o => o.brand));
    return Array.from(set).sort();
  }, [orders]);
  const cityOptions = useMemo(() => {
    const set = new Set(orders.map(o => o.city));
    return Array.from(set).sort();
  }, [orders]);
  const stateOptions = useMemo(() => {
    const set = new Set(orders.map(o => o.state));
    return Array.from(set).sort();
  }, [orders]);

  /* -------- Active filter count -------- */
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (fPaymentStatus !== 'all') n++;
    if (fCourier !== 'all') n++;
    if (fDateRange !== 'all') n++;
    if (fPaymentMethod !== 'all') n++;
    if (fBrand !== 'all') n++;
    if (fCity !== 'all') n++;
    if (fState !== 'all') n++;
    if (fAmount !== 'all') n++;
    return n;
  }, [fPaymentStatus, fCourier, fDateRange, fPaymentMethod, fBrand, fCity, fState, fAmount]);

  /* -------- Filtered orders -------- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const tabCfg = TAB_STATUSES.find(t => t.key === statusTab);
    const tabStatuses = tabCfg?.statuses ?? ALL_STATUSES;
    const now = Date.now();
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

    return orders.filter(o => {
      // Search
      if (q) {
        const matches =
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          o.product.toLowerCase().includes(q) ||
          o.brand.toLowerCase().includes(q) ||
          (o.trackingNumber?.toLowerCase().includes(q) ?? false) ||
          o.invoiceNumber.toLowerCase().includes(q) ||
          o.assignedStaff.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.transactionId.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Status tab
      if (!tabStatuses.includes(o.status)) return false;
      // Payment status
      if (fPaymentStatus !== 'all' && o.paymentStatus.toLowerCase() !== fPaymentStatus) return false;
      // Courier
      if (fCourier !== 'all' && o.courier !== fCourier) return false;
      // Payment method
      if (fPaymentMethod !== 'all' && o.paymentMethod !== fPaymentMethod) return false;
      // Brand
      if (fBrand !== 'all' && o.brand !== fBrand) return false;
      // City
      if (fCity !== 'all' && o.city !== fCity) return false;
      // State
      if (fState !== 'all' && o.state !== fState) return false;
      // Date range
      if (fDateRange !== 'all') {
        let start = 0;
        if (fDateRange === 'today') start = todayStart.getTime();
        else if (fDateRange === '7d') start = now - 7 * 24 * 3600_000;
        else if (fDateRange === '30d') start = now - 30 * 24 * 3600_000;
        else if (fDateRange === '90d') start = now - 90 * 24 * 3600_000;
        if (o.placedAt < start) return false;
      }
      // Amount
      if (fAmount !== 'all') {
        if (fAmount === '0-5000' && o.amount >= 5000) return false;
        if (fAmount === '5000-10000' && (o.amount < 5000 || o.amount >= 10000)) return false;
        if (fAmount === '10000-20000' && (o.amount < 10000 || o.amount >= 20000)) return false;
        if (fAmount === '20000+' && o.amount < 20000) return false;
      }
      return true;
    });
  }, [orders, search, statusTab, fPaymentStatus, fCourier, fDateRange, fPaymentMethod, fBrand, fCity, fState, fAmount]);

  /* -------- Actions -------- */
  const updateStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? {
      ...o,
      status,
      deliveredAt: status === 'Delivered' ? o.expectedDelivery : o.deliveredAt,
      trackingNumber: ['Shipped', 'Out for Delivery', 'Delivered'].includes(status) && !o.trackingNumber
        ? `${o.courier.substring(0, 2).toUpperCase()}${1000000 + parseInt(o.id.split('-')[1]) * 137}`
        : o.trackingNumber,
      activity: [...o.activity, {
        id: `a-${Date.now()}`,
        timestamp: Date.now(),
        event: `Status updated to ${status}`,
        actor: 'You',
        detail: undefined,
      }],
    } : o));
    setDetailOrder(prev => prev?.id === id ? { ...prev, status } : prev);
    pushToast({ tone: 'success', title: 'Status updated', message: `Order ${id} → ${status}` });
  }, [pushToast]);

  const bulkUpdateStatus = useCallback((status: OrderStatus) => {
    setOrders(prev => prev.map(o => selected.includes(o.id) ? { ...o, status } : o));
    pushToast({ tone: 'success', title: `${selected.length} orders → ${status}` });
    setSelected([]);
  }, [selected, pushToast]);

  const bulkPrint = useCallback(() => {
    pushToast({ tone: 'info', title: 'Generating labels', message: `${selected.length} shipping labels sent to printer.` });
  }, [selected, pushToast]);

  const bulkInvoice = useCallback(() => {
    pushToast({ tone: 'info', title: 'Generating invoices', message: `${selected.length} invoices sent to printer.` });
  }, [selected, pushToast]);

  const bulkExport = useCallback(() => {
    pushToast({ tone: 'success', title: 'Export started', message: `${filtered.length} orders exporting to CSV.` });
  }, [filtered.length, pushToast]);

  const bulkAssignCourier = useCallback(() => {
    pushToast({ tone: 'info', title: 'Assign courier', message: `${selected.length} orders ready for courier assignment.` });
  }, [selected, pushToast]);

  const bulkRefund = useCallback(() => {
    setOrders(prev => prev.map(o => selected.includes(o.id) ? { ...o, status: 'Refunded' as OrderStatus, refundAmount: o.amount, paymentStatus: 'Refunded' as PaymentStatus } : o));
    pushToast({ tone: 'warning', title: 'Refunds processed', message: `${selected.length} orders refunded.` });
    setSelected([]);
  }, [selected, pushToast]);

  function clearFilters() {
    setFPaymentStatus('all'); setFCourier('all'); setFDateRange('all');
    setFPaymentMethod('all'); setFBrand('all'); setFCity('all');
    setFState('all'); setFAmount('all');
  }

  function exportOrders() {
    pushToast({ tone: 'success', title: 'Export started', message: `${filtered.length} orders exporting to CSV.` });
  }

  /* -------- Table columns -------- */
  const columns: Column<AdminOrder>[] = useMemo(() => [
    {
      key: 'id',
      header: 'Order',
      sortable: true,
      sortValue: o => o.id,
      width: 130,
      render: o => (
        <div>
          <div style={{
            fontWeight: 700, color: tokens.text.primary,
            fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 12,
          }}>{o.id}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>
            {fmtDateShort(o.placedAt)}
          </div>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      sortValue: o => o.customerName,
      width: 180,
      render: o => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar tokens={tokens} name={o.customerName} size={30} />
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontWeight: 600, color: tokens.text.primary, fontSize: 12.5,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{o.customerName}</div>
            <div style={{
              fontSize: 10, color: tokens.text.tertiary,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{o.city}, {o.state}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Products',
      width: 220,
      render: o => (
        <div style={{ maxWidth: 220 }}>
          <div style={{
            fontWeight: 500, color: tokens.text.primary, fontSize: 12,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{o.product}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>
            {o.brand} · {o.size} · Qty {o.qty}
          </div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Order Value',
      align: 'right',
      sortable: true,
      sortValue: o => o.amount,
      width: 110,
      render: o => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontWeight: 700, color: tokens.text.primary, fontSize: 13 }}>
            {fmtMoney(o.amount)}
          </span>
          <span style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
            {o.paymentMethod}
          </span>
        </div>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      align: 'center',
      sortable: true,
      sortValue: o => o.paymentStatus,
      width: 100,
      render: o => <StatusPill tokens={tokens} status={o.paymentStatus} />,
    },
    {
      key: 'status',
      header: 'Fulfillment',
      align: 'center',
      sortable: true,
      sortValue: o => o.status,
      width: 130,
      render: o => <StatusPill tokens={tokens} status={o.status} />,
    },
    {
      key: 'courier',
      header: 'Courier',
      width: 140,
      render: o => o.trackingNumber ? (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.primary }}>{o.courier}</div>
          <div style={{
            fontSize: 10, color: tokens.text.tertiary,
            fontFamily: 'ui-monospace, "SF Mono", monospace',
          }}>{o.trackingNumber}</div>
        </div>
      ) : (
        <span style={{ fontSize: 11, color: tokens.text.tertiary }}>—</span>
      ),
    },
    {
      key: 'expectedDelivery',
      header: 'Expected Delivery',
      sortable: true,
      sortValue: o => o.expectedDelivery,
      width: 120,
      render: o => {
        if (o.status === 'Delivered' && o.deliveredAt) {
          return (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: tokens.status.success }}>
                Delivered
              </div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
                {fmtDateShort(o.deliveredAt)}
              </div>
            </div>
          );
        }
        if (o.status === 'Cancelled' || o.status === 'Returned' || o.status === 'Refunded') {
          return <span style={{ fontSize: 11, color: tokens.text.tertiary }}>—</span>;
        }
        const isOverdue = o.expectedDelivery < Date.now() && o.status !== 'Delivered';
        return (
          <div>
            <div style={{
              fontSize: 11, fontWeight: 600,
              color: isOverdue ? tokens.status.warning : tokens.text.primary,
            }}>{fmtDateShort(o.expectedDelivery)}</div>
            <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
              {isOverdue ? 'Overdue' : `${Math.max(0, Math.ceil((o.expectedDelivery - Date.now()) / (24 * 3600_000)))}d left`}
            </div>
          </div>
        );
      },
    },
    {
      key: 'assignedStaff',
      header: 'Assigned To',
      sortable: true,
      sortValue: o => o.assignedStaff,
      width: 130,
      render: o => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Avatar tokens={tokens} name={o.assignedStaff} size={22} />
          <span style={{ fontSize: 11, fontWeight: 500, color: tokens.text.secondary }}>
            {o.assignedStaff.split(' ')[0]}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      sortable: false,
      width: 90,
      render: o => (
        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
          <Button tokens={tokens} variant="ghost" size="sm" onClick={() => setDetailOrder(o)}>
            View
          </Button>
          <Dropdown
            tokens={tokens}
            align="right"
            width={200}
            trigger={
              <IconButton
                tokens={tokens}
                icon={
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                }
                label="More actions"
                size={28}
              />
            }
          >
            <MenuItem tokens={tokens} onClick={() => setDetailOrder(o)}>View Details</MenuItem>
            <MenuItem tokens={tokens} onClick={() => pushToast({ tone: 'info', title: 'Invoice generated', message: o.invoiceNumber })}>
              Download Invoice
            </MenuItem>
            <MenuItem tokens={tokens} onClick={() => pushToast({ tone: 'info', title: 'Label printing', message: o.id })}>
              Print Shipping Label
            </MenuItem>
            <MenuItem tokens={tokens} onClick={() => pushToast({ tone: 'info', title: 'Courier assigned', message: `${o.id} → ${o.courier}` })}>
              Assign Courier
            </MenuItem>
            <MenuDivider tokens={tokens} />
            <div style={{ padding: '4px 10px', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6 }}>
              Update Status
            </div>
            {ALL_STATUSES.map(s => (
              <MenuItem key={s} tokens={tokens} active={o.status === s} onClick={() => updateStatus(o.id, s)}>
                {s}
              </MenuItem>
            ))}
          </Dropdown>
        </div>
      ),
    },
  ], [tokens, pushToast, updateStatus]);

  /* -------- KPI strip data -------- */
  const kpiStrip = useMemo(() => [
    { key: 'today', label: "Today's Orders", value: counts.today, tone: 'info' as const, accent: tokens.status.info },
    { key: 'pending', label: 'Pending', value: counts.pending, tone: 'warning' as const, accent: tokens.status.warning },
    { key: 'processing', label: 'Processing', value: counts.processing, tone: 'info' as const, accent: tokens.status.info },
    { key: 'completed', label: 'Completed', value: counts.completed, tone: 'success' as const, accent: tokens.status.success },
    { key: 'cancelled', label: 'Cancelled', value: counts.cancelled, tone: 'critical' as const, accent: tokens.status.error },
  ], [counts, tokens]);

  return (
    <AdminLayout
      title="Orders"
      subtitle="Fulfillment & tracking"
      requirePermission="order.view"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Sales' }, { label: 'Orders' }]}
    >
      <div className="orders-root" style={{ overflowX: 'hidden' }}>
        <PageHeader
          tokens={tokens}
          title="Order Management"
          subtitle="Process customer orders, track shipments, manage returns & refunds, and generate invoices at scale."
          breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Sales' }, { label: 'Orders' }]}
          meta={
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Badge tokens={tokens} tone="warning" dot>{counts.pending} pending</Badge>
              <Badge tokens={tokens} tone="info" dot>{counts.processing} in transit</Badge>
              <Badge tokens={tokens} tone="success" dot>{counts.completed} delivered</Badge>
            </div>
          }
          actions={
            <>
              <Button tokens={tokens} variant="outline" size="md" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }}
                icon={<RefreshIcon color={tokens.text.secondary} />}
              >Refresh</Button>
              <Button tokens={tokens} variant="outline" size="md" onClick={exportOrders}
                icon={<DownloadIcon color={tokens.text.secondary} />}
              >Export</Button>
              <Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'info', title: 'Bulk invoice print', message: 'Generating PDFs…' })}
                icon={<PrinterIcon color={tokens.bg.app} />}
              >Print Invoices</Button>
            </>
          }
        />

        {/* KPI STRIP */}
        <div className="kpi-strip">
          {kpiStrip.map(kpi => (
            <div
              key={kpi.key}
              className="kpi-card"
              style={{
                background: tokens.bg.surface,
                border: `1px solid ${tokens.border.subtle}`,
                borderRadius: 14,
                padding: '14px 16px',
                boxShadow: tokens.shadow.sm,
                transition: 'transform 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms ease, border-color 180ms ease',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = tokens.shadow.md;
                e.currentTarget.style.borderColor = tokens.border.strong;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = tokens.shadow.sm;
                e.currentTarget.style.borderColor = tokens.border.subtle;
              }}
              onClick={() => {
                if (kpi.key === 'today') setStatusTab('all');
                else if (kpi.key === 'pending') setStatusTab('pending');
                else if (kpi.key === 'processing') setStatusTab('confirmed');
                else if (kpi.key === 'completed') setStatusTab('delivered');
                else if (kpi.key === 'cancelled') setStatusTab('cancelled');
              }}
            >
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                background: `radial-gradient(circle at top right, ${kpi.accent}14, transparent 70%)`,
                pointerEvents: 'none',
              }} />
              <div style={{
                fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
                textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
                fontFamily: 'Inter, sans-serif',
              }}>{kpi.label}</div>
              <div style={{
                fontSize: 26, fontWeight: 800, color: kpi.accent,
                fontFamily: 'Inter, sans-serif', letterSpacing: '-0.025em', lineHeight: 1.1,
              }}>{kpi.value}</div>
              <div style={{
                fontSize: 10, color: tokens.text.tertiary, marginTop: 6,
                fontFamily: 'Inter, sans-serif',
              }}>
                {kpi.key === 'today' && 'Last 24 hours'}
                {kpi.key === 'pending' && 'Awaiting confirmation'}
                {kpi.key === 'processing' && 'Being fulfilled'}
                {kpi.key === 'completed' && 'Successfully delivered'}
                {kpi.key === 'cancelled' && 'Cancelled orders'}
              </div>
            </div>
          ))}
        </div>

        {/* STATUS TABS */}
        <div className="status-tabs-row">
          <Tabs
            tokens={tokens}
            size="sm"
            tabs={TAB_STATUSES.map(t => ({
              key: t.key,
              label: t.label,
              badge: counts[t.key === 'all' ? 'all' : t.statuses[0].toLowerCase().replace(/\s/g, '')] ?? 0,
            }))}
            active={statusTab}
            onChange={setStatusTab}
          />
        </div>

        {/* TOOLBAR: search + filter toggle */}
        <div className="toolbar-row">
          <div className="search-wrap">
            <SearchInput
              tokens={tokens}
              value={search}
              onChange={setSearch}
              placeholder="Search order ID, customer, phone, tracking, invoice, staff…"
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setShowFilters(v => !v)}
              className="filter-toggle"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 34, padding: '0 12px', borderRadius: 9,
                border: `1px solid ${showFilters ? tokens.border.focus : tokens.border.subtle}`,
                background: showFilters ? tokens.bg.hover : tokens.bg.surface,
                color: showFilters ? tokens.text.primary : tokens.text.secondary,
                fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                cursor: 'pointer', transition: 'all 140ms ease',
              }}
            >
              <FilterIcon color={showFilters ? tokens.text.primary : tokens.text.secondary} />
              Filters
              {activeFilterCount > 0 && (
                <span style={{
                  minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9,
                  background: tokens.text.primary, color: tokens.bg.app,
                  fontSize: 10, fontWeight: 700,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>{activeFilterCount}</span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <Button tokens={tokens} variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
            <div style={{ fontSize: 11, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
              {filtered.length} of {orders.length} orders
            </div>
          </div>
        </div>

        {/* ADVANCED FILTERS PANEL */}
        {showFilters && (
          <div className="filters-panel" style={{
            background: tokens.bg.surface,
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            boxShadow: tokens.shadow.sm,
            animation: 'orders-filter-in 200ms cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div className="filters-grid">
              <FilterField tokens={tokens} label="Payment Status">
                <Select tokens={tokens} value={fPaymentStatus} onChange={e => setFPaymentStatus(e.target.value)}
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'refunded', label: 'Refunded' },
                    { value: 'failed', label: 'Failed' },
                  ]}
                  style={{ height: 34 }}
                />
              </FilterField>
              <FilterField tokens={tokens} label="Courier">
                <Select tokens={tokens} value={fCourier} onChange={e => setFCourier(e.target.value)}
                  options={[{ value: 'all', label: 'All Couriers' }, ...COURIERS.map(c => ({ value: c, label: c }))]}
                  style={{ height: 34 }}
                />
              </FilterField>
              <FilterField tokens={tokens} label="Date Range">
                <Select tokens={tokens} value={fDateRange} onChange={e => setFDateRange(e.target.value)}
                  options={DATE_FILTERS}
                  style={{ height: 34 }}
                />
              </FilterField>
              <FilterField tokens={tokens} label="Payment Method">
                <Select tokens={tokens} value={fPaymentMethod} onChange={e => setFPaymentMethod(e.target.value)}
                  options={[{ value: 'all', label: 'All Methods' }, ...PAYMENT_METHODS.map(m => ({ value: m, label: m }))]}
                  style={{ height: 34 }}
                />
              </FilterField>
              <FilterField tokens={tokens} label="Brand">
                <Select tokens={tokens} value={fBrand} onChange={e => setFBrand(e.target.value)}
                  options={[{ value: 'all', label: 'All Brands' }, ...brandOptions.map(b => ({ value: b, label: b }))]}
                  style={{ height: 34 }}
                />
              </FilterField>
              <FilterField tokens={tokens} label="City">
                <Select tokens={tokens} value={fCity} onChange={e => setFCity(e.target.value)}
                  options={[{ value: 'all', label: 'All Cities' }, ...cityOptions.map(c => ({ value: c, label: c }))]}
                  style={{ height: 34 }}
                />
              </FilterField>
              <FilterField tokens={tokens} label="State">
                <Select tokens={tokens} value={fState} onChange={e => setFState(e.target.value)}
                  options={[{ value: 'all', label: 'All States' }, ...stateOptions.map(s => ({ value: s, label: s }))]}
                  style={{ height: 34 }}
                />
              </FilterField>
              <FilterField tokens={tokens} label="Order Amount">
                <Select tokens={tokens} value={fAmount} onChange={e => setFAmount(e.target.value)}
                  options={AMOUNT_FILTERS}
                  style={{ height: 34 }}
                />
              </FilterField>
            </div>
          </div>
        )}

        {/* ENTERPRISE TABLE */}
        <EnterpriseDataTable<AdminOrder>
          tokens={tokens}
          columns={columns}
          rows={filtered}
          getRowId={o => o.id}
          selectable
          onSelectionChange={setSelected}
          pageSize={25}
          loading={loading}
          onRowClick={o => setDetailOrder(o)}
          emptyTitle="No orders found"
          emptyDescription="Try adjusting your filters or search query."
          bulkActions={() => (
            <>
              <Button tokens={tokens} variant="ghost" size="sm" onClick={bulkInvoice}
                icon={<InvoiceIcon color={tokens.bg.app} />}
              >Print Invoices</Button>
              <Button tokens={tokens} variant="ghost" size="sm" onClick={bulkPrint}
                icon={<PrinterIcon color={tokens.bg.app} />}
              >Generate Labels</Button>
              <Button tokens={tokens} variant="ghost" size="sm" onClick={bulkAssignCourier}>Assign Courier</Button>
              <MenuDivider tokens={tokens} />
              <Dropdown
                tokens={tokens}
                align="right"
                width={180}
                trigger={
                  <Button tokens={tokens} variant="ghost" size="sm">Update Status</Button>
                }
              >
                <MenuItem tokens={tokens} onClick={() => bulkUpdateStatus('Confirmed')}>Mark Confirmed</MenuItem>
                <MenuItem tokens={tokens} onClick={() => bulkUpdateStatus('Packed')}>Mark Packed</MenuItem>
                <MenuItem tokens={tokens} onClick={() => bulkUpdateStatus('Shipped')}>Mark Shipped</MenuItem>
                <MenuItem tokens={tokens} onClick={() => bulkUpdateStatus('Delivered')}>Mark Delivered</MenuItem>
                <MenuDivider tokens={tokens} />
                <MenuItem tokens={tokens} danger onClick={() => bulkUpdateStatus('Cancelled')}>Cancel Orders</MenuItem>
                <MenuItem tokens={tokens} danger onClick={bulkRefund}>Refund Orders</MenuItem>
              </Dropdown>
              <Button tokens={tokens} variant="ghost" size="sm" onClick={bulkExport}>Export</Button>
            </>
          )}
        />

        {/* ORDER DETAIL DRAWER */}
        <Drawer
          tokens={tokens}
          open={Boolean(detailOrder)}
          onClose={() => setDetailOrder(null)}
          title={detailOrder ? `Order ${detailOrder.id}` : ''}
          subtitle={detailOrder ? `${detailOrder.customerName} · ${fmtDateTime(detailOrder.placedAt)}` : ''}
          width={680}
          footer={
            detailOrder && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button tokens={tokens} variant="ghost" size="md"
                  onClick={() => pushToast({ tone: 'info', title: 'Invoice downloaded', message: detailOrder.invoiceNumber })}
                  icon={<InvoiceIcon color={tokens.text.secondary} />}
                >Invoice</Button>
                <Button tokens={tokens} variant="outline" size="md"
                  onClick={() => pushToast({ tone: 'info', title: 'Label printing', message: detailOrder.id })}
                  icon={<PrinterIcon color={tokens.text.secondary} />}
                >Print Label</Button>
                <Button tokens={tokens} variant="outline" size="md"
                  onClick={() => pushToast({ tone: 'info', title: 'Courier tracking', message: detailOrder.trackingNumber ?? 'No tracking' })}
                >Track Shipment</Button>
                <Button tokens={tokens} variant="primary" size="md"
                  onClick={() => pushToast({ tone: 'success', title: 'Email sent', message: 'Customer notified.' })}
                >Notify Customer</Button>
              </div>
            )
          }
        >
          {detailOrder && (
            <OrderDrawerContent
              tokens={tokens}
              order={detailOrder}
              onStatusChange={(s) => updateStatus(detailOrder.id, s)}
              pushToast={pushToast}
            />
          )}
        </Drawer>
      </div>

      <style jsx>{`
        .orders-root { width: 100%; }

        .kpi-strip {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        @media (max-width: 1280px) {
          .kpi-strip { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        }
        @media (max-width: 1024px) {
          .kpi-strip { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .kpi-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 420px) {
          .kpi-strip { grid-template-columns: 1fr; }
        }

        .status-tabs-row {
          margin-bottom: 14px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 2px;
        }
        .status-tabs-row::-webkit-scrollbar { height: 4px; }
        .status-tabs-row::-webkit-scrollbar-thumb { background: ${tokens.border.subtle}; border-radius: 2px; }

        .toolbar-row {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .search-wrap { flex: 1; min-width: 280px; max-width: 480px; }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        @media (max-width: 1024px) {
          .filters-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 768px) {
          .filters-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 480px) {
          .filters-grid { grid-template-columns: 1fr; }
        }

        @keyframes orders-filter-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orders-timeline-in {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes orders-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </AdminLayout>
  );
}

/* ============================================================= */
/* FILTER FIELD WRAPPER                                          */
/* ============================================================= */

function FilterField({ tokens, label, children }: { tokens: Tk; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
        textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5,
        fontFamily: 'Inter, sans-serif',
      }}>{label}</div>
      {children}
    </div>
  );
}

/* ============================================================= */
/* ORDER DRAWER CONTENT                                          */
/* ============================================================= */

function OrderDrawerContent({
  tokens, order, onStatusChange, pushToast,
}: {
  tokens: Tk;
  order: AdminOrder;
  onStatusChange: (s: OrderStatus) => void;
  pushToast: (t: { tone: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string }) => void;
}) {
  const [noteText, setNoteText] = useState('');
  const [localNotes, setLocalNotes] = useState(order.notes);

  function addNote() {
    if (!noteText.trim()) return;
    const newNote = {
      id: `n-${Date.now()}`,
      author: 'You',
      text: noteText.trim(),
      timestamp: Date.now(),
    };
    setLocalNotes(prev => [...prev, newNote]);
    setNoteText('');
    pushToast({ tone: 'success', title: 'Note added', message: 'Internal note saved.' });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* STATUS + AMOUNT HERO */}
      <div style={{
        background: tokens.bg.surfaceAlt,
        borderRadius: 12,
        padding: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
            textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6,
          }}>Order Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <StatusPill tokens={tokens} status={order.status} />
            <StatusPill tokens={tokens} status={order.paymentStatus} />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
            textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4,
          }}>Total</div>
          <div style={{
            fontSize: 24, fontWeight: 800, color: tokens.text.primary,
            fontFamily: 'Inter, sans-serif', letterSpacing: '-0.025em',
          }}>{fmtMoney(order.amount)}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>
            Invoice {order.invoiceNumber}
          </div>
        </div>
      </div>

      {/* QUICK STATUS UPDATE */}
      <div>
        <div style={{
          fontSize: 11, fontWeight: 700, color: tokens.text.secondary,
          marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
        }}>Update Fulfillment Status</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {ALL_STATUSES.map(s => {
            const active = order.status === s;
            return (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                style={{
                  padding: '5px 10px', borderRadius: 7, border: 'none',
                  background: active ? tokens.text.primary : tokens.bg.surfaceAlt,
                  color: active ? tokens.bg.app : tokens.text.secondary,
                  fontSize: 10.5, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 140ms cubic-bezier(0.16,1,0.3,1)',
                }}
              >{s}</button>
            );
          })}
        </div>
      </div>

      {/* TIMELINE */}
      <DrawerSection tokens={tokens} title="Order Timeline">
        <OrderTimeline tokens={tokens} order={order} />
      </DrawerSection>

      {/* ITEMS */}
      <DrawerSection tokens={tokens} title="Items" count={order.items.length}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {order.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10,
                background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0,
              }}>👟</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: tokens.text.primary,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{item.name}</div>
                <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 2 }}>
                  {item.brand} · Size {item.size} · Qty {item.qty}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, flexShrink: 0 }}>
                {fmtMoney(item.price * item.qty)}
              </div>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: `1px solid ${tokens.border.subtle}`,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <PriceRow tokens={tokens} label="Subtotal" value={fmtMoney(order.subtotal)} />
          <PriceRow tokens={tokens} label="Shipping" value={order.shippingCost === 0 ? 'Free' : fmtMoney(order.shippingCost)} />
          <PriceRow tokens={tokens} label="Tax (5%)" value={fmtMoney(order.tax)} />
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 6, paddingTop: 6, borderTop: `1px solid ${tokens.border.subtle}`,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: tokens.text.primary }}>{fmtMoney(order.amount)}</span>
          </div>
        </div>
      </DrawerSection>

      {/* CUSTOMER + ADDRESSES */}
      <DrawerSection tokens={tokens} title="Customer & Addresses">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{
            background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Avatar tokens={tokens} name={order.customerName} size={32} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>
                  {order.customerName}
                </div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary }}>
                  {order.city}, {order.state}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>
                {order.customerEmail}
              </div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>
                {order.customerPhone}
              </div>
            </div>
          </div>
          <div style={{
            background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12,
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, color: tokens.text.tertiary,
              textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6,
            }}>Shipping Address</div>
            <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
              {order.shippingAddress}
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 8, background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12,
        }}>
          <div style={{
            fontSize: 9, fontWeight: 700, color: tokens.text.tertiary,
            textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6,
          }}>Billing Address</div>
          <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
            {order.billingAddress}
          </div>
        </div>
      </DrawerSection>

      {/* PAYMENT */}
      <DrawerSection tokens={tokens} title="Payment Information">
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
        }}>
          <div style={{
            background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12,
          }}>
            <KeyValue tokens={tokens} label="Method" value={order.paymentMethod} />
            <div style={{ height: 8 }} />
            <KeyValue tokens={tokens} label="Status" value={
              <span style={{ display: 'inline-flex' }}>
                <StatusPill tokens={tokens} status={order.paymentStatus} />
              </span>
            } />
          </div>
          <div style={{
            background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12,
          }}>
            <KeyValue tokens={tokens} label="Transaction ID" value={order.transactionId} mono />
            <div style={{ height: 8 }} />
            <KeyValue tokens={tokens} label="Amount" value={fmtMoney(order.amount)} />
          </div>
        </div>
        <button
          onClick={() => pushToast({ tone: 'info', title: 'Invoice generated', message: order.invoiceNumber })}
          style={{
            marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 8,
            border: `1px solid ${tokens.border.subtle}`,
            background: tokens.bg.surface, color: tokens.text.primary,
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', transition: 'all 120ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = tokens.bg.surface; }}
        >
          <InvoiceIcon color={tokens.text.primary} />
          Download Invoice {order.invoiceNumber}
        </button>
      </DrawerSection>

      {/* COURIER & TRACKING */}
      <DrawerSection tokens={tokens} title="Courier & Tracking">
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
        }}>
          <div style={{
            background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12,
          }}>
            <KeyValue tokens={tokens} label="Courier" value={order.courier} />
            <div style={{ height: 8 }} />
            <KeyValue tokens={tokens} label="Assigned To" value={order.assignedStaff} />
          </div>
          <div style={{
            background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12,
          }}>
            <KeyValue tokens={tokens} label="Tracking Number" value={order.trackingNumber ?? '—'} mono />
            <div style={{ height: 8 }} />
            <KeyValue tokens={tokens} label="Expected Delivery" value={
              order.status === 'Delivered' && order.deliveredAt
                ? `Delivered ${fmtDateShort(order.deliveredAt)}`
                : fmtDate(order.expectedDelivery)
            } />
          </div>
        </div>
      </DrawerSection>

      {/* REFUND INFO (if applicable) */}
      {order.refundAmount > 0 && (
        <DrawerSection tokens={tokens} title="Refund Information">
          <div style={{
            background: tokens.status.errorBg, borderRadius: 10, padding: 12,
            border: `1px solid ${tokens.status.error}30`,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: tokens.status.error,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>Refunded</div>
              <div style={{
                fontSize: 16, fontWeight: 800, color: tokens.status.error,
              }}>{fmtMoney(order.refundAmount)}</div>
            </div>
            {order.refundReason && (
              <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
                <strong>Reason:</strong> {order.refundReason}
              </div>
            )}
          </div>
        </DrawerSection>
      )}

      {/* INTERNAL NOTES */}
      <DrawerSection tokens={tokens} title="Internal Notes" count={localNotes.length}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {localNotes.length === 0 && (
            <div style={{
              fontSize: 11, color: tokens.text.tertiary, fontStyle: 'italic',
              padding: '8px 0',
            }}>No internal notes yet.</div>
          )}
          {localNotes.map(note => (
            <div key={note.id} style={{
              background: tokens.bg.surfaceAlt, borderRadius: 8, padding: 10,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 4,
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: tokens.text.primary }}>
                  {note.author}
                </span>
                <span style={{ fontSize: 10, color: tokens.text.tertiary }}>
                  {timeAgo(note.timestamp)}
                </span>
              </div>
              <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
                {note.text}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <input
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addNote(); } }}
              placeholder="Add internal note (Enter to save)…"
              style={{
                flex: 1, height: 34, padding: '0 12px', borderRadius: 8,
                border: `1px solid ${tokens.border.subtle}`,
                background: tokens.bg.surface, color: tokens.text.primary,
                fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none',
                transition: 'border-color 120ms ease',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = tokens.border.focus; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = tokens.border.subtle; }}
            />
            <Button tokens={tokens} variant="primary" size="sm" onClick={addNote}>Add</Button>
          </div>
        </div>
      </DrawerSection>

      {/* ACTIVITY HISTORY */}
      <DrawerSection tokens={tokens} title="Activity History" count={order.activity.length}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {order.activity.map((entry, i) => (
            <div key={entry.id} style={{
              display: 'flex', gap: 10, position: 'relative',
              paddingBottom: i === order.activity.length - 1 ? 0 : 12,
              animation: `orders-timeline-in 240ms cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both`,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: tokens.text.primary, flexShrink: 0, marginTop: 4,
                }} />
                {i < order.activity.length - 1 && (
                  <div style={{
                    width: 1.5, flex: 1, minHeight: 16,
                    background: tokens.border.subtle,
                  }} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: tokens.text.primary,
                }}>{entry.event}</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
                  {fmtDateTime(entry.timestamp)} · by {entry.actor}
                </div>
                {entry.detail && (
                  <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 3, lineHeight: 1.4 }}>
                    {entry.detail}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DrawerSection>
    </div>
  );
}

/* ============================================================= */
/* DRAWER SECTION WRAPPER                                        */
/* ============================================================= */

function DrawerSection({
  tokens, title, count, children,
}: {
  tokens: Tk; title: string; count?: number; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
      }}>
        <h4 style={{
          margin: 0, fontSize: 11, fontWeight: 700, color: tokens.text.secondary,
          textTransform: 'uppercase', letterSpacing: 0.5,
          fontFamily: 'Inter, sans-serif',
        }}>{title}</h4>
        {count !== undefined && count > 0 && (
          <span style={{
            fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
            background: tokens.bg.surfaceAlt, padding: '1px 6px', borderRadius: 6,
          }}>{count}</span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ============================================================= */
/* PRICE ROW                                                     */
/* ============================================================= */

function PriceRow({ tokens, label, value }: { tokens: Tk; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: tokens.text.tertiary }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.secondary }}>{value}</span>
    </div>
  );
}

/* ============================================================= */
/* ORDER TIMELINE                                                */
/* ============================================================= */

function OrderTimeline({ tokens, order }: { tokens: Tk; order: AdminOrder }) {
  const stages: { label: string; timestamp?: number; status: 'done' | 'current' | 'pending' | 'cancelled' }[] = [
    { label: 'Order Placed', timestamp: order.placedAt, status: 'done' },
  ];

  const isCancelled = order.status === 'Cancelled';
  const isReturned = order.status === 'Returned';
  const isRefunded = order.status === 'Refunded';

  if (isCancelled) {
    stages.push({
      label: 'Order Cancelled',
      timestamp: order.placedAt + 2 * 3600_000,
      status: 'cancelled',
    });
  } else if (isReturned) {
    stages.push(
      { label: 'Payment Received', timestamp: order.placedAt + 5 * 60_000, status: 'done' },
      { label: 'Order Confirmed', timestamp: order.placedAt + 30 * 60_000, status: 'done' },
      { label: 'Shipped', timestamp: order.placedAt + 8 * 3600_000, status: 'done' },
      { label: 'Delivered', timestamp: order.expectedDelivery, status: 'done' },
      { label: 'Return Initiated', timestamp: order.placedAt + 48 * 3600_000, status: 'current' },
    );
    if (isRefunded) {
      stages.push({
        label: 'Refund Processed',
        timestamp: order.placedAt + 72 * 3600_000,
        status: 'cancelled',
      });
    }
  } else {
    // Normal fulfillment flow
    const paymentDone = order.paymentStatus === 'Paid' || ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status);
    stages.push({
      label: 'Payment Received',
      timestamp: paymentDone ? order.placedAt + 5 * 60_000 : undefined,
      status: paymentDone ? 'done' : order.status === 'Pending' ? 'current' : 'pending',
    });

    const confirmedDone = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status);
    stages.push({
      label: 'Order Confirmed',
      timestamp: confirmedDone ? order.placedAt + 30 * 60_000 : undefined,
      status: confirmedDone ? 'done' : order.status === 'Pending' ? 'pending' : 'current',
    });

    const packedDone = ['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status);
    stages.push({
      label: 'Packed & Ready',
      timestamp: packedDone ? order.placedAt + 4 * 3600_000 : undefined,
      status: packedDone ? 'done' : order.status === 'Confirmed' ? 'current' : 'pending',
    });

    const shippedDone = ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status);
    stages.push({
      label: 'Shipped',
      timestamp: shippedDone ? order.placedAt + 8 * 3600_000 : undefined,
      status: shippedDone ? 'done' : order.status === 'Packed' ? 'current' : 'pending',
    });

    const ofdDone = ['Out for Delivery', 'Delivered'].includes(order.status);
    stages.push({
      label: 'Out for Delivery',
      timestamp: ofdDone ? order.placedAt + 20 * 3600_000 : undefined,
      status: ofdDone ? 'done' : order.status === 'Shipped' ? 'current' : 'pending',
    });

    const deliveredDone = order.status === 'Delivered';
    stages.push({
      label: 'Delivered',
      timestamp: deliveredDone && order.deliveredAt ? order.deliveredAt : undefined,
      status: deliveredDone ? 'done' : order.status === 'Out for Delivery' ? 'current' : 'pending',
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {stages.map((stage, i) => {
        const isLast = i === stages.length - 1;
        const color = stage.status === 'done' ? tokens.status.success
          : stage.status === 'current' ? tokens.status.info
          : stage.status === 'cancelled' ? tokens.status.error
          : tokens.text.tertiary;
        return (
          <div key={i} style={{
            display: 'flex', gap: 12, position: 'relative',
            paddingBottom: isLast ? 0 : 14,
            animation: `orders-timeline-in 240ms cubic-bezier(0.16,1,0.3,1) ${i * 50}ms both`,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: stage.status === 'done' ? color
                  : stage.status === 'current' ? color
                  : stage.status === 'cancelled' ? color
                  : tokens.bg.surfaceAlt,
                color: stage.status === 'pending' ? tokens.text.tertiary : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, flexShrink: 0,
                border: stage.status === 'current' ? `3px solid ${color}30` : stage.status === 'pending' ? `1.5px solid ${tokens.border.strong}` : 'none',
                animation: stage.status === 'current' ? `orders-pulse 2s ease-in-out infinite` : 'none',
              }}>
                {stage.status === 'done' ? (
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : stage.status === 'cancelled' ? (
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                ) : stage.status === 'current' ? (
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                ) : (
                  <span style={{ fontSize: 9, fontWeight: 700 }}>{i + 1}</span>
                )}
              </div>
              {!isLast && (
                <div style={{
                  width: 2, flex: 1, minHeight: 12,
                  background: stage.status === 'done' ? color : tokens.border.subtle,
                  margin: '2px 0',
                }} />
              )}
            </div>
            <div style={{ paddingBottom: 0, flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12.5, fontWeight: 600,
                color: stage.status === 'pending' ? tokens.text.tertiary : tokens.text.primary,
              }}>{stage.label}</div>
              {stage.timestamp ? (
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>
                  {fmtDateTime(stage.timestamp)}
                </div>
              ) : (
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2, fontStyle: 'italic' }}>
                  {stage.status === 'current' ? 'In progress…' : 'Pending'}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================= */
/* ICONS                                                         */
/* ============================================================= */

function DownloadIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}
function PrinterIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" />
    </svg>
  );
}
function RefreshIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16M3 21v-5h5" />
    </svg>
  );
}
function FilterIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  );
}
function InvoiceIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}
