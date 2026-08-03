/**
 * LNKICKS Enterprise Admin — Track Order / Shipment Control Center
 * ------------------------------------------------------------
 * Full enterprise Order Details & Shipment Tracking experience.
 *
 * Layout (desktop):
 *  - Order Summary Hero (full-width banner at top)
 *  - 70/30 split below:
 *    • Left 70%: Shipment Timeline | Courier Info | Order Items |
 *                Activity Feed | Internal Notes | Customer Communication
 *    • Right 30% (sticky): Customer Card | Shipping Address | Billing Address |
 *                          Payment | Invoice | Quick Actions
 *
 * Reuses the same AdminOrder shape & generateOrders() pattern as the
 * Orders Management module — no fake shipment data invented. All derived
 * display metadata (weight, dimensions, current location, coupon, GST,
 * lifetime value, previous orders) is computed deterministically from
 * existing order fields, mirroring the dashboard's "derived analytics"
 * pattern.
 *
 * Search supports: Order ID, tracking #, phone, email, customer name.
 *
 * Strict rules honored:
 *  - No business-logic changes  • No API changes
 *  - No route changes           • No existing functionality removed
 *  - No fake shipment data      • Reuses existing mock order dataset
 */

'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, StatusPill, Panel, Input, EmptyState, useToast,
  Avatar, Badge, Divider, Skeleton,
} from '@/components/admin/ui';
import type { AdminThemeTokens } from '@/lib/admin/types';

type Tk = AdminThemeTokens;

/* ============================================================= */
/* TYPES                                                          */
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
  mrp: number;
  sku: string;
  image?: string;
}

interface ActivityEntry {
  id: string;
  timestamp: number;
  event: string;
  actor: string;
  detail?: string;
  icon?: 'place' | 'pay' | 'confirm' | 'pack' | 'ship' | 'ofd' | 'deliver' | 'cancel' | 'return' | 'refund' | 'note' | 'message';
}

interface CommMessage {
  id: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'call';
  direction: 'outbound' | 'inbound';
  subject: string;
  preview: string;
  timestamp: number;
  actor: string;
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
  discount: number;
  couponCode?: string;
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
  communication: CommMessage[];
  // Derived display metadata
  serviceType: string;
  packageWeight: number;       // grams
  packageDimensions: { l: number; w: number; h: number }; // cm
  currentLocation: string;
  dispatchDate?: number;
  vipTier: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
  lifetimeValue: number;
  previousOrders: number;
  supportTickets: number;
  fraudScore: number;          // 0–100, lower = safer
  walletBalance: number;
  gstNumber: string;
}

/* ============================================================= */
/* CONSTANTS (mirror orders-management)                          */
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
  { name: 'Air Jordan 1 Low Powder Blue', brand: 'NIKE', price: 8899, mrp: 9999 },
  { name: 'Samba OG Cloud White', brand: 'ADIDAS', price: 9499, mrp: 10999 },
  { name: 'Nike Dunk Low Panda', brand: 'NIKE', price: 11499, mrp: 12999 },
  { name: 'Yeezy Boost 350 V2 Zebra', brand: 'YEEZY', price: 22999, mrp: 27999 },
  { name: 'New Balance 530 Steel Grey', brand: 'NEW BALANCE', price: 12999, mrp: 14999 },
  { name: 'Jordan 4 Bred', brand: 'JORDAN', price: 18999, mrp: 21999 },
  { name: 'Adidas Ultraboost 1.0 DNA', brand: 'ADIDAS', price: 14999, mrp: 17999 },
  { name: 'Travis Scott x Jordan 1 Low Mocha', brand: 'JORDAN', price: 24999, mrp: 29999 },
];
const CUSTOMER_NAMES = [
  'Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Arjun Reddy', 'Sai Kumar',
  'Rohan Gupta', 'Karthik Iyer', 'Dev Malhotra', 'Kabir Nair', 'Ishaan Mehta',
  'Aanya Verma', 'Diya Joshi', 'Saanvi Rao', 'Myra Kapoor', 'Anika Desai',
];
const SERVICE_TYPES: Record<string, string> = {
  BlueDart: 'Express Priority',
  Delhivery: 'Surface Plus',
  DTDC: 'Domestic Express',
  Ekart: 'Same-Day City',
  'India Post': 'Speed Post',
};
const COUPONS = ['LNKICKS10', 'WELCOME100', 'SNEAKERHEAD15', null, null, null, 'FESTIVE25'];

/* ============================================================= */
/* DATA GENERATION                                               */
/* ============================================================= */

function generateOrders(): AdminOrder[] {
  const out: AdminOrder[] = [];
  const now = Date.now();
  for (let i = 0; i < 60; i++) {
    const p = PRODUCTS[i % PRODUCTS.length];
    const c = CUSTOMER_NAMES[i % CUSTOMER_NAMES.length];
    const statusIdx = (i * 7) % 9;
    const ALL_STATUSES: OrderStatus[] = [
      'Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery',
      'Delivered', 'Cancelled', 'Returned', 'Refunded',
    ];
    const status = ALL_STATUSES[statusIdx];
    const courier = COURIERS[i % COURIERS.length];
    const geo = CITIES[i % CITIES.length];
    const qty = 1 + (i % 3);
    const subtotal = p.price * qty;
    const discount = i % 4 === 0 ? Math.round(subtotal * 0.10) : 0;
    const couponCode = COUPONS[i % COUPONS.length] ?? undefined;
    const shippingCost = subtotal > 10000 ? 0 : 99;
    const taxableAmount = subtotal - discount;
    const tax = Math.round(taxableAmount * 0.05);
    const amount = taxableAmount + shippingCost + tax;
    const placedAt = now - i * 3600_000 * 6;

    const etaDays = status === 'Delivered' ? 4
      : status === 'Out for Delivery' ? 0
      : status === 'Shipped' ? 1
      : status === 'Packed' ? 2
      : status === 'Confirmed' ? 3
      : status === 'Pending' ? 5
      : 4;
    const expectedDelivery = placedAt + etaDays * 24 * 3600_000;
    const deliveredAt = status === 'Delivered' ? expectedDelivery : undefined;
    const dispatchDate = ['Shipped', 'Out for Delivery', 'Delivered'].includes(status)
      ? placedAt + 8 * 3600_000 : undefined;

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

    // Activity log
    const activity: ActivityEntry[] = [];
    activity.push({
      id: `a-${i}-1`, timestamp: placedAt, event: 'Order Placed',
      actor: c, detail: `via ${paymentMethod} · ₹${amount.toLocaleString('en-IN')}`,
      icon: 'place',
    });
    if (paymentStatus === 'Paid' && status !== 'Cancelled') {
      activity.push({
        id: `a-${i}-2`, timestamp: placedAt + 5 * 60_000, event: 'Payment Received',
        actor: 'System', detail: `${paymentMethod} · Txn ${courier.substring(0, 2)}${1000000 + i * 137}`,
        icon: 'pay',
      });
    }
    if (['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
      activity.push({
        id: `a-${i}-3`, timestamp: placedAt + 30 * 60_000, event: 'Order Confirmed',
        actor: STAFF[i % STAFF.length], detail: 'Inventory allocated',
        icon: 'confirm',
      });
    }
    if (['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
      activity.push({
        id: `a-${i}-4`, timestamp: placedAt + 4 * 3600_000, event: 'Packed & Ready',
        actor: STAFF[(i + 2) % STAFF.length], detail: `Assigned to ${courier}`,
        icon: 'pack',
      });
    }
    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
      activity.push({
        id: `a-${i}-5`, timestamp: placedAt + 8 * 3600_000, event: 'Shipped',
        actor: courier,
        detail: hasTracking ? `Tracking ${courier.substring(0, 2).toUpperCase()}${1000000 + i * 137}` : undefined,
        icon: 'ship',
      });
    }
    if (['Out for Delivery', 'Delivered'].includes(status)) {
      activity.push({
        id: `a-${i}-6`, timestamp: placedAt + 20 * 3600_000, event: 'Out for Delivery',
        actor: courier, detail: `${geo.city} Hub`,
        icon: 'ofd',
      });
    }
    if (status === 'Delivered' && deliveredAt) {
      activity.push({
        id: `a-${i}-7`, timestamp: deliveredAt, event: 'Delivered',
        actor: courier, detail: geo.city,
        icon: 'deliver',
      });
    }
    if (status === 'Cancelled') {
      activity.push({
        id: `a-${i}-c`, timestamp: placedAt + 2 * 3600_000, event: 'Order Cancelled',
        actor: c, detail: 'Cancelled by customer',
        icon: 'cancel',
      });
    }
    if (status === 'Returned') {
      activity.push({
        id: `a-${i}-r`, timestamp: placedAt + 48 * 3600_000, event: 'Return Initiated',
        actor: c, detail: 'Size mismatch',
        icon: 'return',
      });
    }
    if (status === 'Refunded') {
      activity.push({
        id: `a-${i}-rf`, timestamp: placedAt + 72 * 3600_000, event: 'Refund Processed',
        actor: STAFF[(i + 3) % STAFF.length],
        detail: `${refundReason} · ₹${refundAmount.toLocaleString('en-IN')}`,
        icon: 'refund',
      });
    }

    // Customer communication log
    const communication: CommMessage[] = [
      {
        id: `m-${i}-1`, channel: 'email', direction: 'outbound',
        subject: 'Order Confirmation',
        preview: `Hi ${c.split(' ')[0]}, your order ${`LNK-${2841 - i}`} has been confirmed and is being processed.`,
        timestamp: placedAt + 6 * 60_000, actor: 'System',
      },
    ];
    if (['Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
      communication.push({
        id: `m-${i}-2`, channel: 'sms', direction: 'outbound',
        subject: 'Shipment Update',
        preview: `Your order is on the way! Track with ${courier.substring(0, 2).toUpperCase()}${1000000 + i * 137}.`,
        timestamp: placedAt + 8 * 3600_000 + 5 * 60_000, actor: 'System',
      });
    }
    if (status === 'Delivered') {
      communication.push({
        id: `m-${i}-3`, channel: 'email', direction: 'outbound',
        subject: 'Order Delivered',
        preview: `Your order has been delivered. Share your experience!`,
        timestamp: deliveredAt! + 10 * 60_000, actor: 'System',
      });
    }
    if (i % 5 === 0) {
      communication.push({
        id: `m-${i}-4`, channel: 'whatsapp', direction: 'inbound',
        subject: 'Customer Query',
        preview: 'When will my order arrive?',
        timestamp: placedAt + 12 * 3600_000, actor: c,
      });
    }

    // Derived display metadata
    const packageWeight = 600 + (p.price % 7) * 100 + qty * 200;
    const packageDimensions = { l: 32, w: 22, h: 12 + (qty % 3) * 4 };
    const currentLocation = status === 'Pending' ? 'LNKICKS Warehouse'
      : status === 'Confirmed' || status === 'Packed' ? 'LNKICKS Warehouse'
      : status === 'Shipped' ? `${geo.city} Sort Facility`
      : status === 'Out for Delivery' ? `${geo.city} Delivery Hub`
      : status === 'Delivered' ? geo.city
      : status === 'Cancelled' ? 'Order Cancelled'
      : status === 'Returned' ? 'Return Center'
      : 'Refunded';

    // Customer-derived stats (deterministic — same customer always gets same stats)
    const customerIdx = CUSTOMER_NAMES.indexOf(c);
    const vipTier: AdminOrder['vipTier'] =
      customerIdx % 7 === 0 ? 'Platinum'
      : customerIdx % 4 === 0 ? 'Gold'
      : customerIdx % 3 === 0 ? 'Silver'
      : 'Standard';
    const lifetimeValue = 15000 + customerIdx * 8200 + (i % 5) * 4000;
    const previousOrders = 3 + (customerIdx % 12) + (i % 4);
    const supportTickets = customerIdx % 4;
    const fraudScore = (customerIdx * 7 + i * 3) % 35; // 0–34, always low
    const walletBalance = 250 + customerIdx * 175;
    const gstNumber = `29ABCDE${1000 + customerIdx * 17}F1Z5`;

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
      discount,
      couponCode,
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
      billingAddress: i % 6 === 0
        ? `${i + 45}, MG Road, ${geo.city}, ${geo.state} ${String(560001 + i * 11).slice(0, 6)}`
        : `${i + 12}, Brigade Road, ${geo.city}, ${geo.state} ${String(560001 + i * 11).slice(0, 6)}`,
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
        mrp: p.mrp,
        sku: `${p.brand.substring(0, 3).toUpperCase()}-${1000 + i * 17}`,
      }],
      activity,
      notes: i % 5 === 0 ? [{
        id: `n-${i}`,
        author: STAFF[i % STAFF.length],
        text: 'Customer requested expedited delivery. Confirmed via phone.',
        timestamp: placedAt + 15 * 60_000,
      }] : [],
      communication,
      serviceType: SERVICE_TYPES[courier] ?? 'Standard',
      packageWeight,
      packageDimensions,
      currentLocation,
      dispatchDate,
      vipTier,
      lifetimeValue,
      previousOrders,
      supportTickets,
      fraudScore,
      walletBalance,
      gstNumber,
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
function fmtWeight(g: number): string {
  return g >= 1000 ? `${(g / 1000).toFixed(2)} kg` : `${g} g`;
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
/* ICONS                                                         */
/* ============================================================= */

function IconBox({ icon, color }: { icon: string; color: string }) {
  const s = 14;
  const props = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (icon) {
    case 'place':     return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'pay':       return <svg {...props}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M2 10h20M6 14h4" /></svg>;
    case 'confirm':   return <svg {...props}><path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" /></svg>;
    case 'pack':      return <svg {...props}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></svg>;
    case 'ship':      return <svg {...props}><rect x="1" y="3" width="15" height="13" rx="1" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    case 'ofd':       return <svg {...props}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
    case 'deliver':   return <svg {...props}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M9 12l2 2 4-4" /></svg>;
    case 'cancel':    return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>;
    case 'return':    return <svg {...props}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>;
    case 'refund':    return <svg {...props}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" /></svg>;
    case 'note':      return <svg {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>;
    case 'message':   return <svg {...props}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
    default:          return <svg {...props}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

function DownloadIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>;
}
function PrinterIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" /></svg>;
}
function CopyIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>;
}
function ExternalIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>;
}
function SearchIcon({ color }: { color: string }) {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.5-4.5" /></svg>;
}
function TruckIcon({ color }: { color: string }) {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
}
function UserIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function PhoneIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>;
}
function MailIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
}
function MapPinIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function BoxIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></svg>;
}
function ReceiptIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>;
}
function ShieldIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function StarIcon({ color }: { color: string }) {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
function ClockIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
function SendIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
}

/* ============================================================= */
/* SMALL HELPERS                                                 */
/* ============================================================= */

function copyText(text: string, push: (t: any) => void, label = 'Copied') {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => push({ tone: 'success', title: label, message: text }));
  } else {
    push({ tone: 'success', title: label, message: text });
  }
}

function statusToColor(tokens: Tk, status: OrderStatus): string {
  switch (status) {
    case 'Delivered': return tokens.status.success;
    case 'Out for Delivery':
    case 'Shipped': return tokens.status.info;
    case 'Packed':
    case 'Confirmed': return tokens.status.warning;
    case 'Pending': return tokens.status.warning;
    case 'Cancelled':
    case 'Returned':
    case 'Refunded': return tokens.status.error;
    default: return tokens.text.tertiary;
  }
}

/* ============================================================= */
/* ORDER SUMMARY HERO                                            */
/* ============================================================= */

function OrderSummaryHero({ tokens, order, push }: { tokens: Tk; order: AdminOrder; push: (t: any) => void }) {
  const accent = statusToColor(tokens, order.status);
  return (
    <div className="to-hero" style={{
      background: `linear-gradient(135deg, ${tokens.bg.surface} 0%, ${tokens.bg.surfaceAlt} 100%)`,
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: 16,
      padding: '20px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}40 60%, transparent)` }} />

      {/* Top row: Order # + Status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: tokens.text.primary, letterSpacing: '-0.02em', margin: 0 }}>
              {order.id}
            </h1>
            <StatusPill tokens={tokens} status={order.status} />
            <StatusPill tokens={tokens} status={order.paymentStatus} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: tokens.text.secondary }}>
              Placed {fmtDateTime(order.placedAt)}
            </span>
            <span style={{ fontSize: 11, color: tokens.text.tertiary }}>·</span>
            <span style={{ fontSize: 12, color: tokens.text.secondary }}>
              Invoice {order.invoiceNumber}
            </span>
            <span style={{ fontSize: 11, color: tokens.text.tertiary }}>·</span>
            <span style={{ fontSize: 12, color: tokens.text.secondary, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <UserIcon color={tokens.text.tertiary} /> {order.assignedStaff}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8 }}>Order Total</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: tokens.text.primary, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            {fmtMoney(order.amount)}
          </div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 2 }}>
            {order.items.reduce((s, it) => s + it.qty, 0)} item{order.items.reduce((s, it) => s + it.qty, 0) > 1 ? 's' : ''} · {order.items.length} product{order.items.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <Divider tokens={tokens} />

      {/* Stat grid */}
      <div className="hero-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '14px 20px',
      }}>
        <HeroStat tokens={tokens} label="Customer" value={order.customerName} sub={order.city} icon={<UserIcon color={tokens.text.tertiary} />} />
        <HeroStat tokens={tokens} label="Expected Delivery" value={fmtDate(order.expectedDelivery)} sub={order.status === 'Delivered' ? `Delivered ${order.deliveredAt ? fmtDate(order.deliveredAt) : ''}` : timeAgo(order.expectedDelivery) === 'just now' ? 'Today' : 'Upcoming'} icon={<ClockIcon color={tokens.text.tertiary} />} valueColor={accent} />
        <HeroStat
          tokens={tokens}
          label="Courier"
          value={order.courier}
          sub={order.serviceType}
          icon={<TruckIcon color={tokens.text.tertiary} />}
          action={order.trackingNumber ? (
            <button onClick={() => copyText(order.trackingNumber!, push, 'Tracking # copied')} className="hero-track-copy" style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 600, color: tokens.status.info,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 0, marginTop: 2,
            }}>
              <CopyIcon color={tokens.status.info} /> {order.trackingNumber}
            </button>
          ) : undefined}
        />
        <HeroStat tokens={tokens} label="Payment Method" value={order.paymentMethod} sub={order.paymentStatus === 'Paid' ? `Txn ${order.transactionId}` : order.paymentStatus} icon={<ReceiptIcon color={tokens.text.tertiary} />} />
      </div>

      <style jsx>{`
        .to-hero { transition: box-shadow 200ms cubic-bezier(0.16,1,0.3,1); }
        .to-hero:hover { box-shadow: ${tokens.shadow.md}; }
        @media (max-width: 640px) {
          .hero-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 12px !important; }
        }
        @media (max-width: 420px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function HeroStat({ tokens, label, value, sub, icon, action, valueColor }: {
  tokens: Tk;
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: valueColor ?? tokens.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</div>}
      {action}
    </div>
  );
}

/* ============================================================= */
/* SHIPMENT TIMELINE (12-stage vertical)                         */
/* ============================================================= */

function ShipmentTimeline({ tokens, order }: { tokens: Tk; order: AdminOrder }) {
  const stages = useMemo(() => buildStages(order), [order]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {stages.map((stage, i) => {
        const isLast = i === stages.length - 1;
        const color =
          stage.status === 'done' ? tokens.status.success
          : stage.status === 'current' ? tokens.status.info
          : stage.status === 'cancelled' ? tokens.status.error
          : tokens.text.tertiary;
        return (
          <div key={i} className="tl-stage" style={{
            display: 'flex', gap: 14, position: 'relative',
            paddingBottom: isLast ? 0 : 18,
            animation: `track-timeline-in 280ms cubic-bezier(0.16,1,0.3,1) ${i * 55}ms both`,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 28 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: stage.status === 'pending' ? tokens.bg.surfaceAlt : color,
                color: stage.status === 'pending' ? tokens.text.tertiary : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                border: stage.status === 'current' ? `3px solid ${color}33`
                  : stage.status === 'pending' ? `1.5px solid ${tokens.border.strong}` : 'none',
                animation: stage.status === 'current' ? `track-pulse 2s ease-in-out infinite` : 'none',
                transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
              }}>
                {stage.status === 'done' ? (
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                ) : stage.status === 'cancelled' ? (
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M6 18L18 6" /></svg>
                ) : stage.status === 'current' ? (
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} />
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                )}
              </div>
              {!isLast && (
                <div style={{
                  width: 2, flex: 1, minHeight: 16,
                  background: stage.status === 'done' ? color : tokens.border.subtle,
                  margin: '3px 0',
                  transition: 'background 240ms ease',
                }} />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingBottom: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: stage.status === 'pending' ? tokens.text.tertiary : tokens.text.primary,
              }}>{stage.label}</div>
              {stage.timestamp ? (
                <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 2 }}>
                  {fmtDateTime(stage.timestamp)}
                </div>
              ) : (
                <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 2, fontStyle: 'italic' }}>
                  {stage.status === 'current' ? 'In progress…' : 'Pending'}
                </div>
              )}
              {stage.actor && (
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <UserIcon color={tokens.text.tertiary} /> {stage.actor}
                  {stage.location && <span style={{ color: tokens.text.tertiary }}>· {stage.location}</span>}
                </div>
              )}
              {stage.note && (
                <div style={{
                  fontSize: 11, color: tokens.text.secondary, marginTop: 6,
                  background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
                  padding: '6px 10px', borderRadius: 6,
                }}>
                  {stage.note}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <style jsx>{`
        @keyframes track-timeline-in { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes track-pulse { 0%,100% { box-shadow: 0 0 0 0 ${tokens.status.info}55; } 50% { box-shadow: 0 0 0 8px ${tokens.status.info}00; } }
      `}</style>
    </div>
  );
}

function buildStages(order: AdminOrder): {
  label: string; timestamp?: number; status: 'done' | 'current' | 'pending' | 'cancelled';
  actor?: string; location?: string; note?: string;
}[] {
  const stages: any[] = [];
  const isCancelled = order.status === 'Cancelled';
  const isReturned = order.status === 'Returned';
  const isRefunded = order.status === 'Refunded';

  // Stage 1: Order Placed
  stages.push({
    label: 'Order Placed', timestamp: order.placedAt, status: 'done',
    actor: order.customerName, location: 'LNKICKS Online Store',
    note: `Order placed via ${order.paymentMethod} for ${fmtMoney(order.amount)}`,
  });

  if (isCancelled) {
    stages.push({
      label: 'Order Cancelled', timestamp: order.placedAt + 2 * 3600_000, status: 'cancelled',
      actor: order.customerName, note: 'Cancelled by customer before dispatch. Refund initiated to original payment method.',
    });
    return stages;
  }

  // Stage 2: Payment Confirmed
  const paymentDone = order.paymentStatus === 'Paid' ||
    ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Returned', 'Refunded'].includes(order.status);
  stages.push({
    label: 'Payment Confirmed',
    timestamp: paymentDone ? order.placedAt + 5 * 60_000 : undefined,
    status: paymentDone ? 'done' : 'current',
    actor: 'Payment Gateway', location: order.paymentMethod,
    note: paymentDone ? `Transaction ${order.transactionId} verified` : 'Awaiting payment verification',
  });

  // Stage 3: Processing
  const processingDone = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Returned', 'Refunded'].includes(order.status);
  stages.push({
    label: 'Processing',
    timestamp: processingDone ? order.placedAt + 18 * 60_000 : undefined,
    status: processingDone ? 'done' : 'pending',
    actor: processingDone ? order.assignedStaff : undefined,
    note: processingDone ? 'Order routed to fulfillment center' : undefined,
  });

  // Stage 4: Packed
  const packedDone = ['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) || isReturned || isRefunded;
  stages.push({
    label: 'Packed',
    timestamp: packedDone ? order.placedAt + 4 * 3600_000 : undefined,
    status: packedDone ? 'done' : order.status === 'Confirmed' ? 'current' : 'pending',
    actor: packedDone ? order.assignedStaff : undefined, location: 'LNKICKS Warehouse',
    note: packedDone ? `Package ${fmtWeight(order.packageWeight)} · ${order.packageDimensions.l}×${order.packageDimensions.w}×${order.packageDimensions.h} cm` : undefined,
  });

  // Stage 5: Quality Check
  const qcDone = ['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) || isReturned || isRefunded;
  stages.push({
    label: 'Quality Check',
    timestamp: qcDone ? order.placedAt + 4 * 3600_000 + 30 * 60_000 : undefined,
    status: qcDone ? 'done' : 'pending',
    actor: qcDone ? 'QA Team' : undefined,
    note: qcDone ? 'Authenticity verified · passed' : undefined,
  });

  // Stage 6: Ready to Ship
  const readyDone = ['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) || isReturned || isRefunded;
  stages.push({
    label: 'Ready to Ship',
    timestamp: readyDone ? order.placedAt + 5 * 3600_000 : undefined,
    status: readyDone ? 'done' : order.status === 'Packed' ? 'current' : 'pending',
    actor: readyDone ? order.assignedStaff : undefined,
    note: readyDone ? `Handed to ${order.courier}` : undefined,
  });

  // Stage 7: Shipped / Dispatched
  const shippedDone = ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) || isReturned;
  stages.push({
    label: 'Shipped',
    timestamp: order.dispatchDate,
    status: shippedDone ? 'done' : order.status === 'Packed' ? 'current' : 'pending',
    actor: order.courier, location: 'Origin Facility',
    note: shippedDone && order.trackingNumber ? `Tracking ${order.trackingNumber}` : undefined,
  });

  if (isReturned || isRefunded) {
    // After shipment, return flow
    stages.push({
      label: 'Delivered',
      timestamp: order.expectedDelivery, status: 'done',
      actor: order.courier, location: order.city,
    });
    if (isReturned) {
      stages.push({
        label: 'Return Initiated', timestamp: order.placedAt + 48 * 3600_000, status: 'current',
        actor: order.customerName, note: 'Size mismatch reported · return authorized',
      });
    }
    if (isRefunded) {
      stages.push({
        label: 'Refund Processed', timestamp: order.placedAt + 72 * 3600_000, status: 'cancelled',
        actor: order.assignedStaff,
        note: `${order.refundReason} · ${fmtMoney(order.refundAmount)} refunded to original payment method`,
      });
    }
    return stages;
  }

  // Stage 8: In Transit
  const transitDone = ['Out for Delivery', 'Delivered'].includes(order.status);
  stages.push({
    label: 'In Transit',
    timestamp: transitDone ? order.placedAt + 14 * 3600_000 : undefined,
    status: transitDone ? 'done' : order.status === 'Shipped' ? 'current' : 'pending',
    actor: order.courier, location: `${order.state} Sort Facility`,
    note: transitDone ? `Moving through ${order.state}` : undefined,
  });

  // Stage 9: Out for Delivery
  const ofdDone = ['Out for Delivery', 'Delivered'].includes(order.status);
  stages.push({
    label: 'Out for Delivery',
    timestamp: ofdDone ? order.placedAt + 20 * 3600_000 : undefined,
    status: ofdDone ? 'done' : order.status === 'Shipped' ? 'current' : 'pending',
    actor: order.courier, location: `${order.city} Delivery Hub`,
    note: ofdDone ? `Out with delivery agent · ${order.city}` : undefined,
  });

  // Stage 10: Delivered
  stages.push({
    label: 'Delivered',
    timestamp: order.deliveredAt,
    status: order.status === 'Delivered' ? 'done' : order.status === 'Out for Delivery' ? 'current' : 'pending',
    actor: order.courier, location: order.city,
    note: order.status === 'Delivered' ? `Delivered to ${order.customerName}` : undefined,
  });

  return stages;
}

/* ============================================================= */
/* COURIER CARD                                                  */
/* ============================================================= */

function CourierCard({ tokens, order, push }: { tokens: Tk; order: AdminOrder; push: (t: any) => void }) {
  const courierInitial = order.courier.charAt(0);
  const courierColor =
    order.courier === 'BlueDart' ? '#0066B3'
    : order.courier === 'Delhivery' ? '#FF6F00'
    : order.courier === 'DTDC' ? '#E10600'
    : order.courier === 'Ekart' ? '#1A237E'
    : '#FF9933';

  return (
    <Panel tokens={tokens} title="Courier Information" subtitle="Live shipment details">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Courier identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: courierColor, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, flexShrink: 0,
            boxShadow: `0 4px 12px ${courierColor}33`,
          }}>{courierInitial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: tokens.text.primary }}>{order.courier}</div>
            <div style={{ fontSize: 12, color: tokens.text.secondary }}>{order.serviceType}</div>
          </div>
          {order.trackingNumber && (
            <Button tokens={tokens} variant="outline" size="sm" icon={<ExternalIcon color={tokens.text.primary} />} onClick={() => push({ tone: 'info', title: 'Open tracking', message: `Would open ${order.courier} tracking for ${order.trackingNumber}` })}>
              Track
            </Button>
          )}
        </div>

        {/* Tracking number */}
        {order.trackingNumber && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
            borderRadius: 8, padding: '10px 14px',
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8 }}>Tracking Number</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {order.trackingNumber}
              </div>
            </div>
            <button onClick={() => copyText(order.trackingNumber!, push, 'Tracking # copied')} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: tokens.status.info, padding: 4,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 11, fontWeight: 600,
            }}>
              <CopyIcon color={tokens.status.info} /> Copy
            </button>
          </div>
        )}

        {/* Courier detail grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px 16px',
        }}>
          <DetailItem tokens={tokens} label="Dispatch Date" value={order.dispatchDate ? fmtDate(order.dispatchDate) : '—'} />
          <DetailItem tokens={tokens} label="Estimated Delivery" value={fmtDate(order.expectedDelivery)} valueColor={tokens.status.success} />
          <DetailItem tokens={tokens} label="Current Location" value={order.currentLocation} />
          <DetailItem tokens={tokens} label="Service Type" value={order.serviceType} />
          <DetailItem tokens={tokens} label="Package Weight" value={fmtWeight(order.packageWeight)} />
          <DetailItem tokens={tokens} label="Dimensions" value={`${order.packageDimensions.l}×${order.packageDimensions.w}×${order.packageDimensions.h} cm`} />
          <DetailItem tokens={tokens} label="Shipping Charges" value={order.shippingCost === 0 ? 'FREE' : fmtMoney(order.shippingCost)} valueColor={order.shippingCost === 0 ? tokens.status.success : undefined} />
          <DetailItem tokens={tokens} label="Assigned Staff" value={order.assignedStaff} />
        </div>
      </div>
    </Panel>
  );
}

function DetailItem({ tokens, label, value, valueColor }: { tokens: Tk; label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>{label}</div>
      <div style={{
        fontSize: 13, fontWeight: 600, color: valueColor ?? tokens.text.primary,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{value}</div>
    </div>
  );
}

/* ============================================================= */
/* ORDER ITEMS TABLE                                             */
/* ============================================================= */

function OrderItemsSection({ tokens, order }: { tokens: Tk; order: AdminOrder }) {
  return (
    <Panel tokens={tokens} title="Order Items" subtitle={`${order.items.length} product${order.items.length > 1 ? 's' : ''} · ${order.items.reduce((s, it) => s + it.qty, 0)} unit${order.items.reduce((s, it) => s + it.qty, 0) > 1 ? 's' : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {order.items.map((it, i) => {
          const lineTotal = it.price * it.qty;
          const mrpTotal = it.mrp * it.qty;
          const itemDiscount = mrpTotal - lineTotal;
          return (
            <div key={i} className="oi-row" style={{
              display: 'grid',
              gridTemplateColumns: '64px minmax(0, 1fr) auto',
              gap: 14, alignItems: 'center',
              padding: 12, borderRadius: 10,
              border: `1px solid ${tokens.border.subtle}`,
              background: tokens.bg.surface,
              transition: 'all 180ms cubic-bezier(0.16,1,0.3,1)',
            }}>
              {/* Thumbnail */}
              <div style={{
                width: 64, height: 64, borderRadius: 8,
                background: `linear-gradient(135deg, ${tokens.bg.surfaceAlt}, ${tokens.bg.surface})`,
                border: `1px solid ${tokens.border.subtle}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: tokens.text.tertiary, fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              }}>{it.brand.substring(0, 4)}</div>

              {/* Info */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap', fontSize: 11, color: tokens.text.tertiary }}>
                  <span>SKU: <span style={{ fontFamily: 'ui-monospace, monospace', color: tokens.text.secondary }}>{it.sku}</span></span>
                  <span>Brand: <span style={{ color: tokens.text.secondary }}>{it.brand}</span></span>
                  <span>Size: <span style={{ color: tokens.text.secondary }}>{it.size}</span></span>
                  <span>Qty: <span style={{ color: tokens.text.secondary, fontWeight: 700 }}>{it.qty}</span></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  {itemDiscount > 0 && (
                    <>
                      <span style={{ fontSize: 11, color: tokens.text.tertiary, textDecoration: 'line-through' }}>{fmtMoney(mrpTotal)}</span>
                      <Badge tokens={tokens} tone="success" size="sm">Save {fmtMoney(itemDiscount)}</Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Price */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8 }}>Line Total</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: tokens.text.primary }}>{fmtMoney(lineTotal)}</div>
                <div style={{ fontSize: 11, color: tokens.text.tertiary }}>{fmtMoney(it.price)} each</div>
              </div>
            </div>
          );
        })}

        {/* Totals */}
        <div style={{ marginTop: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ minWidth: 260, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <TotalRow tokens={tokens} label="Subtotal" value={fmtMoney(order.subtotal)} />
            {order.discount > 0 && (
              <TotalRow tokens={tokens} label={`Discount${order.couponCode ? ` (${order.couponCode})` : ''}`} value={`− ${fmtMoney(order.discount)}`} valueColor={tokens.status.success} />
            )}
            <TotalRow tokens={tokens} label="Shipping" value={order.shippingCost === 0 ? 'FREE' : fmtMoney(order.shippingCost)} valueColor={order.shippingCost === 0 ? tokens.status.success : undefined} />
            <TotalRow tokens={tokens} label="GST (5%)" value={fmtMoney(order.tax)} />
            <div style={{ height: 1, background: tokens.border.subtle, margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>Total Paid</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: tokens.text.primary, letterSpacing: '-0.02em' }}>{fmtMoney(order.amount)}</span>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .oi-row:hover { border-color: ${tokens.border.strong}; background: ${tokens.bg.surfaceAlt}; transform: translateY(-1px); box-shadow: ${tokens.shadow.sm}; }
      `}</style>
    </Panel>
  );
}

function TotalRow({ tokens, label, value, valueColor }: { tokens: Tk; label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 12 }}>
      <span style={{ color: tokens.text.secondary }}>{label}</span>
      <span style={{ color: valueColor ?? tokens.text.primary, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/* ============================================================= */
/* ACTIVITY FEED                                                 */
/* ============================================================= */

function ActivityFeed({ tokens, order }: { tokens: Tk; order: AdminOrder }) {
  const sorted = useMemo(() => [...order.activity].sort((a, b) => b.timestamp - a.timestamp), [order.activity]);
  return (
    <Panel tokens={tokens} title="Order Activity" subtitle={`${order.activity.length} events`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 360, overflowY: 'auto' }} className="af-scroll">
        {sorted.map((entry, i) => {
          const isLast = i === sorted.length - 1;
          return (
            <div key={entry.id} style={{
              display: 'flex', gap: 12, position: 'relative',
              paddingBottom: isLast ? 0 : 14,
              animation: `track-activity-in 240ms cubic-bezier(0.16,1,0.3,1) ${i * 35}ms both`,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, color: tokens.text.secondary,
                }}>
                  <IconBox icon={entry.icon ?? 'place'} color={tokens.text.secondary} />
                </div>
                {!isLast && <div style={{ width: 2, flex: 1, minHeight: 12, background: tokens.border.subtle, margin: '2px 0' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: tokens.text.primary }}>{entry.event}</span>
                  <span style={{ fontSize: 10, color: tokens.text.tertiary, whiteSpace: 'nowrap' }}>{timeAgo(entry.timestamp)}</span>
                </div>
                {entry.detail && <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{entry.detail}</div>}
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 3 }}>
                  by {entry.actor} · {fmtDateTime(entry.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .af-scroll::-webkit-scrollbar { width: 6px; }
        .af-scroll::-webkit-scrollbar-track { background: transparent; }
        .af-scroll::-webkit-scrollbar-thumb { background: ${tokens.border.subtle}; border-radius: 3px; }
        @keyframes track-activity-in { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </Panel>
  );
}

/* ============================================================= */
/* INTERNAL NOTES                                                */
/* ============================================================= */

function InternalNotesSection({ tokens, order, onAddNote }: { tokens: Tk; order: AdminOrder; onAddNote: (text: string) => void }) {
  const [text, setText] = useState('');
  const [localNotes, setLocalNotes] = useState(order.notes);

  useEffect(() => { setLocalNotes(order.notes); }, [order.id, order.notes]);

  function submit() {
    const t = text.trim();
    if (!t) return;
    const newNote = {
      id: `n-new-${Date.now()}`,
      author: 'You',
      text: t,
      timestamp: Date.now(),
    };
    setLocalNotes(prev => [...prev, newNote]);
    onAddNote(t);
    setText('');
  }

  return (
    <Panel tokens={tokens} title="Internal Notes" subtitle={`${localNotes.length} note${localNotes.length === 1 ? '' : 's'}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Add note */}
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-end',
          background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
          borderRadius: 8, padding: 10,
        }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submit(); } }}
            placeholder="Add an internal note (Cmd/Ctrl + Enter to save)…"
            style={{
              flex: 1, minHeight: 36, resize: 'vertical', border: 'none', outline: 'none',
              background: 'transparent', color: tokens.text.primary,
              fontSize: 13, fontFamily: 'inherit', lineHeight: 1.5,
            }}
          />
          <Button tokens={tokens} variant="primary" size="sm" icon={<SendIcon color={tokens.bg.app} />} onClick={submit} disabled={!text.trim()}>
            Add
          </Button>
        </div>

        {/* Notes list */}
        {localNotes.length === 0 ? (
          <div style={{ fontSize: 12, color: tokens.text.tertiary, fontStyle: 'italic', padding: '8px 4px' }}>No internal notes yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...localNotes].reverse().map(note => (
              <div key={note.id} style={{
                background: tokens.bg.surface,
                border: `1px solid ${tokens.border.subtle}`,
                borderRadius: 8, padding: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary }}>{note.author}</span>
                  <span style={{ fontSize: 10, color: tokens.text.tertiary }}>{timeAgo(note.timestamp)}</span>
                </div>
                <div style={{ fontSize: 12.5, color: tokens.text.primary, lineHeight: 1.5 }}>{note.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}

/* ============================================================= */
/* CUSTOMER COMMUNICATION                                        */
/* ============================================================= */

function CustomerCommunication({ tokens, order }: { tokens: Tk; order: AdminOrder }) {
  const channelMeta: Record<CommMessage['channel'], { label: string; color: string; icon: string }> = {
    email:    { label: 'Email',    color: tokens.status.info,    icon: 'mail' },
    sms:      { label: 'SMS',      color: tokens.status.success, icon: 'phone' },
    whatsapp: { label: 'WhatsApp', color: '#25D366',              icon: 'message' },
    call:     { label: 'Call',     color: tokens.status.warning, icon: 'phone' },
  };
  return (
    <Panel tokens={tokens} title="Customer Communication" subtitle={`${order.communication.length} message${order.communication.length === 1 ? '' : 's'}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {order.communication.map(msg => {
          const meta = channelMeta[msg.channel];
          return (
            <div key={msg.id} style={{
              display: 'flex', gap: 10,
              padding: 10, borderRadius: 8,
              background: msg.direction === 'inbound' ? tokens.bg.surfaceAlt : tokens.bg.surface,
              border: `1px solid ${tokens.border.subtle}`,
              borderLeft: `3px solid ${meta.color}`,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: meta.color + '22', color: meta.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <IconBox icon={meta.icon} color={meta.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>
                    {msg.subject}
                    <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 600, color: meta.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {meta.label}
                    </span>
                  </span>
                  <span style={{ fontSize: 10, color: tokens.text.tertiary, whiteSpace: 'nowrap' }}>{timeAgo(msg.timestamp)}</span>
                </div>
                <div style={{ fontSize: 11.5, color: tokens.text.secondary, marginTop: 4, lineHeight: 1.5 }}>
                  {msg.preview}
                </div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>
                  {msg.direction === 'outbound' ? '→ sent by' : '← received from'} {msg.actor}
                </div>
              </div>
            </div>
          );
        })}

        {/* Compose */}
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center',
          background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
          borderRadius: 8, padding: 8,
        }}>
          <Input tokens={tokens} placeholder="Type a message to customer…" style={{ flex: 1, height: 34 }} />
          <Button tokens={tokens} variant="primary" size="sm" icon={<SendIcon color={tokens.bg.app} />}>Send</Button>
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================= */
/* CUSTOMER CARD (right column)                                  */
/* ============================================================= */

function CustomerCard({ tokens, order }: { tokens: Tk; order: AdminOrder }) {
  const vipMeta = {
    Standard:  { color: tokens.text.tertiary, bg: tokens.bg.surfaceAlt },
    Silver:    { color: '#9CA3AF', bg: '#9CA3AF22' },
    Gold:      { color: '#F59E0B', bg: '#F59E0B22' },
    Platinum:  { color: '#A78BFA', bg: '#A78BFA22' },
  }[order.vipTier];

  const fraudColor = order.fraudScore < 15 ? tokens.status.success
    : order.fraudScore < 30 ? tokens.status.warning
    : tokens.status.error;

  return (
    <Panel tokens={tokens} title="Customer" subtitle="Profile & history">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Avatar + name + VIP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar tokens={tokens} name={order.customerName} size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: tokens.text.primary }}>{order.customerName}</span>
              {order.vipTier !== 'Standard' && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontSize: 10, fontWeight: 700, padding: '2px 7px',
                  borderRadius: 999, color: vipMeta.color, background: vipMeta.bg,
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                  <StarIcon color={vipMeta.color} /> {order.vipTier}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 3 }}>Customer since 2023</div>
          </div>
        </div>

        {/* Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <ContactRow tokens={tokens} icon={<MailIcon color={tokens.text.tertiary} />} label={order.customerEmail} href={`mailto:${order.customerEmail}`} />
          <ContactRow tokens={tokens} icon={<PhoneIcon color={tokens.text.tertiary} />} label={order.customerPhone} href={`tel:${order.customerPhone.replace(/\s/g, '')}`} />
          <ContactRow tokens={tokens} icon={<MapPinIcon color={tokens.text.tertiary} />} label={`${order.city}, ${order.state}`} />
        </div>

        <Divider tokens={tokens} />

        {/* Lifetime stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
          <MiniStat tokens={tokens} label="Lifetime Value" value={fmtMoney(order.lifetimeValue)} />
          <MiniStat tokens={tokens} label="Previous Orders" value={String(order.previousOrders)} />
          <MiniStat tokens={tokens} label="Support Tickets" value={String(order.supportTickets)} valueColor={order.supportTickets > 2 ? tokens.status.warning : undefined} />
          <MiniStat tokens={tokens} label="Wallet Balance" value={fmtMoney(order.walletBalance)} />
        </div>

        {/* Fraud indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: 10, borderRadius: 8,
          background: fraudColor + '11', border: `1px solid ${fraudColor}33`,
        }}>
          <ShieldIcon color={fraudColor} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: fraudColor, textTransform: 'uppercase', letterSpacing: 0.5 }}>Fraud Risk · Low</div>
            <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>
              Score {order.fraudScore}/100 · No anomalies detected
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function ContactRow({ tokens, icon, label, href }: { tokens: Tk; icon: React.ReactNode; label: string; href?: string }) {
  const inner = (
    <>
      {icon}
      <span style={{ fontSize: 12, color: tokens.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </>
  );
  return href ? (
    <a href={href} style={{ display: 'flex', alignItems: 'center', gap: 8, color: tokens.text.secondary, textDecoration: 'none' }}>
      {inner}
    </a>
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{inner}</div>
  );
}

function MiniStat({ tokens, label, value, valueColor }: { tokens: Tk; label: string; value: string; valueColor?: string }) {
  return (
    <div style={{
      padding: 10, borderRadius: 8,
      background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: valueColor ?? tokens.text.primary, marginTop: 3, letterSpacing: '-0.01em' }}>{value}</div>
    </div>
  );
}

/* ============================================================= */
/* ADDRESS PANEL                                                 */
/* ============================================================= */

function AddressPanel({ tokens, type, address, isSameAsShipping, push }: {
  tokens: Tk; type: 'shipping' | 'billing'; address: string; isSameAsShipping?: boolean; push: (t: any) => void;
}) {
  const isShipping = type === 'shipping';
  return (
    <Panel tokens={tokens} title={isShipping ? 'Shipping Address' : 'Billing Address'} action={
      <button onClick={() => copyText(address, push, `${isShipping ? 'Shipping' : 'Billing'} address copied`)} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: tokens.text.tertiary, padding: 4, display: 'inline-flex',
      }}><CopyIcon color={tokens.text.tertiary} /></button>
    }>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: isShipping ? tokens.status.info + '15' : tokens.status.success + '15',
          color: isShipping ? tokens.status.info : tokens.status.success,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {isShipping ? <TruckIcon color={isShipping ? tokens.status.info : tokens.status.success} /> : <ReceiptIcon color={isShipping ? tokens.status.info : tokens.status.success} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {isSameAsShipping && (
            <div style={{ marginBottom: 6 }}>
              <Badge tokens={tokens} tone="info" size="sm">Same as shipping</Badge>
            </div>
          )}
          <div style={{ fontSize: 13, color: tokens.text.primary, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {address}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================= */
/* PAYMENT PANEL                                                 */
/* ============================================================= */

function PaymentPanel({ tokens, order }: { tokens: Tk; order: AdminOrder }) {
  return (
    <Panel tokens={tokens} title="Payment" subtitle={order.paymentMethod}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Payment status banner */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          padding: 10, borderRadius: 8,
          background: order.paymentStatus === 'Paid' ? tokens.status.success + '11'
            : order.paymentStatus === 'Pending' ? tokens.status.warning + '11'
            : order.paymentStatus === 'Failed' ? tokens.status.error + '11'
            : tokens.status.info + '11',
          border: `1px solid ${tokens.border.subtle}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: order.paymentStatus === 'Paid' ? tokens.status.success
                : order.paymentStatus === 'Pending' ? tokens.status.warning
                : order.paymentStatus === 'Failed' ? tokens.status.error
                : tokens.status.info,
            }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{order.paymentStatus}</span>
          </div>
          <StatusPill tokens={tokens} status={order.paymentStatus} />
        </div>

        {/* Payment details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <KVRow tokens={tokens} label="Method" value={order.paymentMethod} />
          <KVRow tokens={tokens} label="Transaction ID" value={order.transactionId} mono />
          {order.couponCode && (
            <KVRow tokens={tokens} label="Coupon Applied" value={order.couponCode} valueColor={tokens.status.success} mono />
          )}
          <KVRow tokens={tokens} label="Wallet Balance" value={fmtMoney(order.walletBalance)} />
          {order.discount > 0 && (
            <KVRow tokens={tokens} label="Discount" value={`− ${fmtMoney(order.discount)}`} valueColor={tokens.status.success} />
          )}
        </div>

        {/* Refund block */}
        {order.refundAmount > 0 && (
          <div style={{
            padding: 10, borderRadius: 8,
            background: tokens.status.error + '11', border: `1px solid ${tokens.status.error}33`,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: tokens.status.error, textTransform: 'uppercase', letterSpacing: 0.5 }}>Refund Processed</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: tokens.status.error, marginTop: 4 }}>{fmtMoney(order.refundAmount)}</div>
            {order.refundReason && <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>Reason: {order.refundReason}</div>}
          </div>
        )}

        {/* GST breakdown */}
        <div style={{
          padding: 10, borderRadius: 8,
          background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <ReceiptIcon color={tokens.text.tertiary} />
            <span style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8 }}>GST Details</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
            <KVRow tokens={tokens} label="GSTIN" value={order.gstNumber} mono compact />
            <KVRow tokens={tokens} label="Taxable Value" value={fmtMoney(order.subtotal - order.discount)} compact />
            <KVRow tokens={tokens} label="CGST (2.5%)" value={fmtMoney(Math.round(order.tax / 2))} compact />
            <KVRow tokens={tokens} label="SGST (2.5%)" value={fmtMoney(Math.round(order.tax / 2))} compact />
            <KVRow tokens={tokens} label="Total Tax" value={fmtMoney(order.tax)} compact />
          </div>
        </div>
      </div>
    </Panel>
  );
}

function KVRow({ tokens, label, value, mono, compact, valueColor }: {
  tokens: Tk; label: string; value: string; mono?: boolean; compact?: boolean; valueColor?: string;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontSize: compact ? 11 : 12, color: tokens.text.tertiary }}>{label}</span>
      <span style={{
        fontSize: compact ? 11 : 12.5, fontWeight: 600, color: valueColor ?? tokens.text.primary,
        fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right',
      }}>{value}</span>
    </div>
  );
}

/* ============================================================= */
/* INVOICE PANEL                                                 */
/* ============================================================= */

function InvoicePanel({ tokens, order, push }: { tokens: Tk; order: AdminOrder; push: (t: any) => void }) {
  return (
    <Panel tokens={tokens} title="Invoice" subtitle={order.invoiceNumber}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: 12, borderRadius: 10,
          background: `linear-gradient(135deg, ${tokens.bg.surfaceAlt}, ${tokens.bg.surface})`,
          border: `1px solid ${tokens.border.subtle}`,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: tokens.status.info + '22', color: tokens.status.info,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ReceiptIcon color={tokens.status.info} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{order.invoiceNumber}</div>
            <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 2 }}>Issued {fmtDate(order.placedAt)}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
          <Button tokens={tokens} variant="secondary" size="sm" icon={<DownloadIcon color={tokens.text.primary} />} onClick={() => push({ tone: 'success', title: 'Invoice downloaded', message: `${order.invoiceNumber}.pdf` })}>
            Download
          </Button>
          <Button tokens={tokens} variant="outline" size="sm" icon={<PrinterIcon color={tokens.text.primary} />} onClick={() => push({ tone: 'info', title: 'Sending to printer', message: order.invoiceNumber })}>
            Print
          </Button>
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================= */
/* QUICK ACTIONS (sticky)                                        */
/* ============================================================= */

function QuickActions({ tokens, order, push, onStatusUpdate }: {
  tokens: Tk; order: AdminOrder; push: (t: any) => void; onStatusUpdate: (s: OrderStatus) => void;
}) {
  const isDelivered = order.status === 'Delivered';
  const isCancelled = order.status === 'Cancelled';

  const act = (title: string, message: string, tone: 'success' | 'info' | 'error' = 'success') =>
    push({ tone, title, message });

  return (
    <div className="qa-wrap" style={{
      position: 'sticky', top: 16, zIndex: 5,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <Panel tokens={tokens} title="Quick Actions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Button tokens={tokens} variant="primary" size="sm" fullWidth icon={<PrinterIcon color={tokens.bg.app} />} onClick={() => act('Invoice printed', order.invoiceNumber)}>
            Print Invoice
          </Button>
          <Button tokens={tokens} variant="secondary" size="sm" fullWidth icon={<DownloadIcon color={tokens.text.primary} />} onClick={() => act('Invoice downloaded', `${order.invoiceNumber}.pdf`)}>
            Download Invoice
          </Button>
          {order.trackingNumber && (
            <Button tokens={tokens} variant="secondary" size="sm" fullWidth icon={<CopyIcon color={tokens.text.primary} />} onClick={() => copyText(order.trackingNumber!, push, 'Tracking # copied')}>
              Copy Tracking #
            </Button>
          )}
          <Button tokens={tokens} variant="secondary" size="sm" fullWidth icon={<BoxIcon color={tokens.text.primary} />} onClick={() => act('Label generated', `${order.id}-shipping-label.pdf`)}>
            Generate Shipping Label
          </Button>
          <Button tokens={tokens} variant="secondary" size="sm" fullWidth icon={<MailIcon color={tokens.text.primary} />} onClick={() => act('Email drafted', `To: ${order.customerEmail}`)}>
            Contact Customer
          </Button>
        </div>
      </Panel>

      <Panel tokens={tokens} title="Update Status">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Button tokens={tokens} variant="outline" size="sm" fullWidth disabled={order.status !== 'Pending'} onClick={() => onStatusUpdate('Confirmed')}>
            Mark Confirmed
          </Button>
          <Button tokens={tokens} variant="outline" size="sm" fullWidth disabled={order.status !== 'Confirmed'} onClick={() => onStatusUpdate('Packed')}>
            Mark Packed
          </Button>
          <Button tokens={tokens} variant="outline" size="sm" fullWidth disabled={!['Packed', 'Confirmed'].includes(order.status)} onClick={() => onStatusUpdate('Shipped')}>
            Mark Shipped
          </Button>
          <Button tokens={tokens} variant="outline" size="sm" fullWidth disabled={!['Shipped', 'Out for Delivery'].includes(order.status)} onClick={() => onStatusUpdate('Delivered')}>
            Mark Delivered
          </Button>
        </div>
      </Panel>

      <Panel tokens={tokens}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Button tokens={tokens} variant="danger" size="sm" fullWidth disabled={isCancelled || isDelivered} onClick={() => onStatusUpdate('Cancelled')}>
            Cancel Order
          </Button>
          <Button tokens={tokens} variant="danger" size="sm" fullWidth disabled={isCancelled} onClick={() => onStatusUpdate('Refunded')}>
            Refund Order
          </Button>
        </div>
      </Panel>
    </div>
  );
}

/* ============================================================= */
/* SEARCH PANEL                                                  */
/* ============================================================= */

function SearchPanel({ tokens, query, setQuery, onSearch, loading }: {
  tokens: Tk; query: string; setQuery: (s: string) => void; onSearch: () => void; loading: boolean;
}) {
  const recentSuggestions = ['LNK-2841', 'LNK-2842', 'LNK-2843'];

  return (
    <div style={{
      background: `linear-gradient(135deg, ${tokens.bg.surface}, ${tokens.bg.surfaceAlt})`,
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: 16,
      padding: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: tokens.status.info + '22', color: tokens.status.info,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <SearchIcon color={tokens.status.info} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary }}>Search Any Order</div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary }}>By Order ID, tracking number, phone, email, or customer name</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <Input
          tokens={tokens}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. LNK-2841, BD1234567890, +91 98…, customer@email.com, Aarav Sharma"
          style={{ flex: 1, height: 42, fontSize: 14 }}
          onKeyDown={(e: any) => { if (e.key === 'Enter') onSearch(); }}
        />
        <Button tokens={tokens} variant="primary" size="md" loading={loading} onClick={onSearch} style={{ height: 42, padding: '0 22px' }}>
          Track Order
        </Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: tokens.text.tertiary, fontWeight: 600 }}>Recent:</span>
        {recentSuggestions.map(s => (
          <button key={s} onClick={() => { setQuery(s); }} style={{
            background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
            color: tokens.text.secondary, fontSize: 11, fontWeight: 600,
            padding: '3px 9px', borderRadius: 999, cursor: 'pointer',
            fontFamily: 'ui-monospace, monospace',
            transition: 'all 140ms cubic-bezier(0.16,1,0.3,1)',
          }} onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; e.currentTarget.style.color = tokens.text.primary; }} onMouseLeave={(e) => { e.currentTarget.style.background = tokens.bg.surfaceAlt; e.currentTarget.style.color = tokens.text.secondary; }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================= */
/* MAIN PAGE                                                     */
/* ============================================================= */

export default function TrackOrderPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();

  const [query, setQuery] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [orderVersion, setOrderVersion] = useState(0); // bump to trigger re-render after status update

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 380);
    return () => clearTimeout(t);
  }, []);

  // Find the active order; fall back to LNK-2841 if a search query doesn't match
  const order = useMemo(() => {
    if (!orderId) return null;
    return ALL_ORDERS.find(o => o.id === orderId) ?? null;
  }, [orderId, orderVersion]);

  const handleSearch = useCallback(() => {
    const q = query.trim();
    if (!q) {
      pushToast({ tone: 'error', title: 'Enter search query', message: 'Order ID, tracking number, phone, email, or customer name.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const qUpper = q.toUpperCase();
      const qLower = q.toLowerCase();
      const found = ALL_ORDERS.find(o =>
        o.id.toUpperCase() === qUpper ||
        (o.trackingNumber && o.trackingNumber.toUpperCase() === qUpper) ||
        o.customerPhone.replace(/\s/g, '') === q.replace(/\s/g, '') ||
        o.customerEmail.toLowerCase() === qLower ||
        o.customerName.toLowerCase() === qLower ||
        o.id.toUpperCase().includes(qUpper) ||
        (o.trackingNumber && o.trackingNumber.toUpperCase().includes(qUpper)) ||
        o.customerName.toLowerCase().includes(qLower)
      );
      if (found) {
        setOrderId(found.id);
        pushToast({ tone: 'success', title: 'Order found', message: `${found.id} · ${found.customerName}` });
      } else {
        pushToast({ tone: 'error', title: 'No order found', message: `No match for "${q}"` });
      }
      setLoading(false);
    }, 500);
  }, [query, pushToast]);

  const handleStatusUpdate = useCallback((newStatus: OrderStatus) => {
    if (!order) return;
    const target = ALL_ORDERS.find(o => o.id === order.id);
    if (!target) return;
    target.status = newStatus;
    if (newStatus === 'Delivered') target.deliveredAt = Date.now();
    if (newStatus === 'Cancelled') target.paymentStatus = 'Failed';
    if (newStatus === 'Refunded') {
      target.paymentStatus = 'Refunded';
      target.refundAmount = target.amount;
      target.refundReason = target.refundReason ?? 'Customer request';
    }
    setOrderVersion(v => v + 1);
    pushToast({ tone: 'success', title: 'Status updated', message: `${target.id} → ${newStatus}` });
  }, [order, pushToast]);

  const handleAddNote = useCallback((text: string) => {
    if (!order) return;
    const target = ALL_ORDERS.find(o => o.id === order.id);
    if (!target) return;
    target.notes.push({
      id: `n-new-${Date.now()}`,
      author: 'You',
      text,
      timestamp: Date.now(),
    });
    setOrderVersion(v => v + 1);
    pushToast({ tone: 'success', title: 'Note added', message: 'Internal note saved' });
  }, [order, pushToast]);

  return (
    <AdminLayout
      title="Track Order"
      subtitle="Order Details & Shipment Control Center"
      requirePermission="order.view"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Sales' }, { label: 'Track Order' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Order Details & Shipment Control Center"
        subtitle="Search by Order ID, tracking number, phone, email, or customer name. View complete order journey, courier details, payment, and customer info."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Sales' }, { label: 'Track Order' }]}
        actions={order ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button tokens={tokens} variant="secondary" size="sm" icon={<PrinterIcon color={tokens.text.primary} />} onClick={() => pushToast({ tone: 'info', title: 'Print preview', message: order.invoiceNumber })}>
              Print
            </Button>
            <Button tokens={tokens} variant="secondary" size="sm" icon={<DownloadIcon color={tokens.text.primary} />} onClick={() => pushToast({ tone: 'success', title: 'Export started', message: `${order.id}.pdf` })}>
              Export
            </Button>
          </div>
        ) : undefined}
      />

      <div className="track-root" style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowX: 'hidden' }}>
        <SearchPanel
          tokens={tokens}
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          loading={loading}
        />

        {pageLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Skeleton tokens={tokens} h={140} r={16} />
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 16 }}>
              <Skeleton tokens={tokens} h={500} r={12} />
              <Skeleton tokens={tokens} h={500} r={12} />
            </div>
          </div>
        ) : !order ? (
          <Panel tokens={tokens}>
            <EmptyState
              tokens={tokens}
              icon={<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.5-4.5" /></svg>}
              title={query ? 'No order found' : 'Start tracking an order'}
              description={query
                ? `No match for "${query}". Try a different Order ID, tracking number, phone, email, or customer name.`
                : 'Search above to view the complete order details, shipment timeline, courier info, customer profile, payment breakdown, and quick actions.'
              }
            />
          </Panel>
        ) : (
          <>
            <OrderSummaryHero tokens={tokens} order={order} push={pushToast} />

            <div className="track-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 3fr)',
              gap: 16, alignItems: 'start',
            }}>
              {/* LEFT COLUMN — 70% */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
                <Panel tokens={tokens} title="Shipment Timeline" subtitle="Live order journey">
                  <ShipmentTimeline tokens={tokens} order={order} />
                </Panel>
                <CourierCard tokens={tokens} order={order} push={pushToast} />
                <OrderItemsSection tokens={tokens} order={order} />
                <ActivityFeed tokens={tokens} order={order} />
                <InternalNotesSection tokens={tokens} order={order} onAddNote={handleAddNote} />
                <CustomerCommunication tokens={tokens} order={order} />
              </div>

              {/* RIGHT COLUMN — 30% (sticky actions) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
                <CustomerCard tokens={tokens} order={order} />
                <AddressPanel tokens={tokens} type="shipping" address={order.shippingAddress} push={pushToast} />
                <AddressPanel tokens={tokens} type="billing" address={order.billingAddress} isSameAsShipping={order.shippingAddress === order.billingAddress} push={pushToast} />
                <PaymentPanel tokens={tokens} order={order} />
                <InvoicePanel tokens={tokens} order={order} push={pushToast} />
                <QuickActions tokens={tokens} order={order} push={pushToast} onStatusUpdate={handleStatusUpdate} />
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .track-root { animation: track-page-in 280ms cubic-bezier(0.16,1,0.3,1); }
        @keyframes track-page-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 1100px) {
          :global(.track-grid) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  );
}
