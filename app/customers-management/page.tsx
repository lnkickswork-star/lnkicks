/**
 * LNKICKS Enterprise Admin — Customers CRM
 * ------------------------------------------------------------
 * World-class enterprise Customer Relationship Management module.
 * Inspired by HubSpot CRM, Salesforce, Shopify Customers,
 * Stripe Customers, Amazon Seller Central.
 *
 * Layout (desktop):
 *  - Page Header with KPI strip + actions
 *  - Smart Segments row (clickable segment chips)
 *  - Status Tabs (All / Active / Inactive / Blocked)
 *  - Toolbar (instant search + filters toggle + result count)
 *  - Advanced Filters Panel (collapsible, 13 dimensions)
 *  - Enterprise DataTable (13 columns, sortable, selectable, sticky header)
 *  - Bulk Action Bar (8 operations)
 *  - Customer Profile Drawer (720px, 12 sections, insights + timeline)
 *
 * Strict rules honored:
 *  - No business-logic changes  • No API changes
 *  - No route changes           • No existing functionality removed
 *  - Reuses existing 20-customer dataset, enriched with derived
 *    display metadata (CLV, frequency, favourite brand, city/country,
 *    VIP tier, risk score, etc.) computed deterministically from
 *    existing fields — same pattern as dashboard's derived analytics.
 */

'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Button, Badge, StatusPill, SearchInput, Drawer, Tabs, useToast,
  Avatar, KeyValue, Select, EmptyState, Skeleton,
} from '@/components/admin/ui';
import type { AdminThemeTokens } from '@/lib/admin/types';

type Tk = AdminThemeTokens;

/* ============================================================= */
/* TYPES                                                          */
/* ============================================================= */

type CustomerStatus = 'Active' | 'Inactive' | 'Blocked';
type LoginMethod = 'Email' | 'Google' | 'OTP';
type VipTier = 'Standard' | 'Silver' | 'Gold' | 'Platinum';

interface OrderSummary {
  id: string;
  date: number;
  amount: number;
  status: 'Delivered' | 'Shipped' | 'Cancelled' | 'Returned' | 'Pending';
  items: number;
}

interface WalletEntry {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  timestamp: number;
}

interface ReviewEntry {
  id: string;
  product: string;
  rating: number;
  text: string;
  timestamp: number;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'Open' | 'Resolved' | 'Pending';
  priority: 'Low' | 'Medium' | 'High';
  timestamp: number;
}

interface TimelineEntry {
  id: string;
  timestamp: number;
  event: string;
  detail?: string;
  icon: 'account' | 'verify' | 'order' | 'payment' | 'ship' | 'review' | 'coupon' | 'ticket' | 'refund' | 'wallet' | 'login' | 'wishlist';
}

interface InternalNote {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loginMethod: LoginMethod;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  walletBalance: number;
  rewardPoints: number;
  joinedAt: number;
  lastLoginAt: number;
  lastOrderAt?: number;
  address: string;
  referralCode: string;
  referredBy?: string;
  // Derived display metadata
  city: string;
  state: string;
  country: string;
  vipTier: VipTier;
  averageOrderValue: number;
  purchaseFrequency: number;     // orders per 30 days
  favouriteBrand: string;
  favouriteCategory: string;
  averageBasketSize: number;     // items per order
  refundCount: number;
  refundAmount: number;
  couponUsageCount: number;
  loyaltyScore: number;          // 0-100
  riskScore: number;             // 0-100, higher = riskier
  tags: string[];
  segment: string;               // computed primary segment
  gstNumber?: string;
  wishlistCount: number;
  reviewsCount: number;
  supportTicketsCount: number;
  emailVerified: boolean;
  // Embedded collections (derived)
  orders: OrderSummary[];
  walletHistory: WalletEntry[];
  reviews: ReviewEntry[];
  supportTickets: SupportTicket[];
  timeline: TimelineEntry[];
  notes: InternalNote[];
}

/* ============================================================= */
/* CONSTANTS                                                     */
/* ============================================================= */

const NAMES = [
  'Aarav Sharma', 'Vivaan Patel', 'Aditya Singh', 'Arjun Reddy', 'Sai Kumar',
  'Rohan Gupta', 'Karthik Iyer', 'Dev Malhotra', 'Kabir Nair', 'Ishaan Mehta',
  'Aanya Verma', 'Diya Agarwal', 'Saanvi Reddy', 'Ananya Iyer', 'Myra Kapoor',
  'Aadhya Jain', 'Pari Nair', 'Riya Menon', 'Sara Khan', 'Kiara Bose',
];

const GEO = [
  { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
  { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { city: 'Delhi', state: 'Delhi', country: 'India' },
  { city: 'Hyderabad', state: 'Telangana', country: 'India' },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  { city: 'Pune', state: 'Maharashtra', country: 'India' },
  { city: 'Kolkata', state: 'West Bengal', country: 'India' },
  { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
  { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
  { city: 'Kochi', state: 'Kerala', country: 'India' },
];

const BRANDS = ['NIKE', 'ADIDAS', 'JORDAN', 'YEEZY', 'NEW BALANCE', 'PUMA'];
const CATEGORIES = ['Sneakers', 'Apparel', 'Accessories', 'Limited Edition'];
const COUPONS_USED = ['WELCOME50', 'LNKICKS10', 'FESTIVE25', 'SNEAKERHEAD15', 'WEEKEND20'];

const SEGMENTS = [
  { key: 'all', label: 'All Customers' },
  { key: 'new', label: 'New Customers' },
  { key: 'returning', label: 'Returning' },
  { key: 'vip', label: 'VIP' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'high_value', label: 'High Value' },
  { key: 'low_value', label: 'Low Value' },
  { key: 'wholesale', label: 'Wholesale' },
  { key: 'frequent', label: 'Frequent Buyers' },
  { key: 'at_risk', label: 'At Risk' },
  { key: 'one_time', label: 'One-Time Buyers' },
];

/* ============================================================= */
/* DATA GENERATION                                               */
/* ============================================================= */

function generateCustomers(): AdminCustomer[] {
  return NAMES.map((name, i) => {
    const methods: LoginMethod[] = ['Email', 'Google', 'OTP'];
    const statuses: CustomerStatus[] = ['Active', 'Active', 'Active', 'Inactive', 'Blocked'];
    const status = statuses[i % 5];
    const loginMethod = methods[i % 3];
    const totalOrders = (i * 3) % 18;
    const totalSpent = totalOrders * (5000 + (i * 137) % 15000);
    const walletBalance = i % 3 === 0 ? 250 + i * 25 : 0;
    const rewardPoints = (i * 23) % 480;
    const joinedAt = Date.now() - (i + 1) * 86400_000 * 7;
    const lastLoginAt = Date.now() - i * 3600_000 * 13;
    const lastOrderAt = totalOrders > 0 ? Date.now() - i * 86400_000 * 4 : undefined;
    const geo = GEO[i % GEO.length];

    // Derived: VIP tier
    const vipTier: VipTier =
      totalSpent > 200000 ? 'Platinum'
      : totalSpent > 100000 ? 'Gold'
      : totalSpent > 40000 ? 'Silver'
      : 'Standard';

    const averageOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;
    const daysSinceJoin = Math.max(1, Math.round((Date.now() - joinedAt) / 86400_000));
    const purchaseFrequency = +(totalOrders / (daysSinceJoin / 30)).toFixed(2);
    const favouriteBrand = BRANDS[i % BRANDS.length];
    const favouriteCategory = CATEGORIES[i % CATEGORIES.length];
    const averageBasketSize = 1 + (i % 4);
    const refundCount = i % 7 === 0 && totalOrders > 2 ? 1 : 0;
    const refundAmount = refundCount > 0 ? Math.round(averageOrderValue * 0.5) : 0;
    const couponUsageCount = i % 3;
    const loyaltyScore = Math.min(100, Math.round((totalOrders * 5) + (rewardPoints / 6) + (vipTier === 'Platinum' ? 30 : vipTier === 'Gold' ? 20 : vipTier === 'Silver' ? 10 : 0)));
    const riskScore = Math.min(85, (refundCount * 25) + (status === 'Blocked' ? 60 : status === 'Inactive' ? 30 : 0) + (i % 5 === 0 ? 10 : 0));
    const gstNumber = totalSpent > 50000 ? `29ABCDE${1000 + i * 17}F1Z5` : undefined;
    const wishlistCount = (i * 3) % 12;
    const reviewsCount = Math.min(totalOrders, Math.floor(i / 2));
    const supportTicketsCount = i % 4;

    // Tags
    const tags: string[] = [];
    if (totalSpent > 100000) tags.push('High Value');
    if (totalOrders >= 10) tags.push('Repeat Buyer');
    if (i % 6 === 0) tags.push('Wholesale');
    if (i % 5 === 0) tags.push('Influencer');
    if (i % 4 === 0) tags.push('Beta Tester');
    if (vipTier !== 'Standard') tags.push('VIP');
    if (riskScore > 30) tags.push('At Risk');

    // Segment
    const segment =
      status === 'Inactive' ? 'inactive'
      : status === 'Blocked' ? 'at_risk'
      : totalOrders === 0 ? 'new'
      : totalOrders === 1 ? 'one_time'
      : totalSpent > 100000 ? 'high_value'
      : totalSpent < 10000 && totalOrders > 0 ? 'low_value'
      : tags.includes('Wholesale') ? 'wholesale'
      : totalOrders >= 8 ? 'frequent'
      : vipTier !== 'Standard' ? 'vip'
      : 'returning';

    // Email verified
    const emailVerified = loginMethod !== 'OTP' || i % 3 !== 2;

    // Embedded order history
    const orders: OrderSummary[] = [];
    for (let j = 0; j < Math.min(totalOrders, 6); j++) {
      const orderStatuses: OrderSummary['status'][] = ['Delivered', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Delivered'];
      orders.push({
        id: `LNK-${2841 - i - j * 3}`,
        date: Date.now() - (j + 1) * 86400_000 * (3 + j),
        amount: 5000 + ((i + j) * 137) % 15000,
        status: orderStatuses[j % orderStatuses.length],
        items: 1 + (j % 3),
      });
    }

    // Wallet history
    const walletHistory: WalletEntry[] = [];
    walletHistory.push({
      id: `w-${i}-1`, type: 'credit', amount: 50, reason: 'Welcome Bonus',
      timestamp: joinedAt + 60_000,
    });
    if (totalOrders > 0) {
      walletHistory.push({
        id: `w-${i}-2`, type: 'debit', amount: 8899, reason: `Order LNK-${2841 - i}`,
        timestamp: lastOrderAt ?? joinedAt + 86400_000,
      });
    }
    if (walletBalance > 0 && refundCount > 0) {
      walletHistory.push({
        id: `w-${i}-3`, type: 'credit', amount: 500, reason: 'Refund — Order LNK-2798',
        timestamp: (lastOrderAt ?? Date.now()) - 5 * 86400_000,
      });
    }
    if (i % 4 === 0) {
      walletHistory.push({
        id: `w-${i}-4`, type: 'credit', amount: 100, reason: 'Referral Bonus',
        timestamp: joinedAt + 10 * 86400_000,
      });
    }

    // Reviews
    const reviews: ReviewEntry[] = [];
    for (let j = 0; j < reviewsCount; j++) {
      reviews.push({
        id: `r-${i}-${j}`,
        product: ['Air Jordan 1 Low', 'Samba OG', 'Nike Dunk Low', 'Yeezy 350 V2'][j % 4],
        rating: 3 + ((i + j) % 3),
        text: ['Great quality, fast delivery!', 'Loved the packaging.', 'Sizing was off but support helped.', 'Will buy again.'][j % 4],
        timestamp: Date.now() - (j + 1) * 86400_000 * 5,
      });
    }

    // Support tickets
    const supportTickets: SupportTicket[] = [];
    const ticketSubjects = ['Order delay', 'Size exchange', 'Damaged product', 'Refund status', 'Coupon not applied'];
    const ticketStatuses: SupportTicket['status'][] = ['Open', 'Resolved', 'Pending'];
    const ticketPriorities: SupportTicket['priority'][] = ['Low', 'Medium', 'High'];
    for (let j = 0; j < supportTicketsCount; j++) {
      supportTickets.push({
        id: `T-${1000 + i * 10 + j}`,
        subject: ticketSubjects[j % ticketSubjects.length],
        status: ticketStatuses[j % ticketStatuses.length],
        priority: ticketPriorities[j % ticketPriorities.length],
        timestamp: Date.now() - (j + 1) * 86400_000 * 6,
      });
    }

    // Timeline (chronological, oldest → newest)
    const timeline: TimelineEntry[] = [];
    timeline.push({
      id: `t-${i}-1`, timestamp: joinedAt, event: 'Account Created',
      detail: `Joined via ${loginMethod}${referredByRef(i) ? `, referred by ${referredByRef(i)}` : ''}`,
      icon: 'account',
    });
    if (emailVerified) {
      const email2 = name.toLowerCase().replace(' ', '.') + (i % 2 ? '@gmail.com' : '@yahoo.in');
      timeline.push({
        id: `t-${i}-2`, timestamp: joinedAt + 5 * 60_000, event: 'Email Verified',
        detail: `${email2} verified successfully`, icon: 'verify',
      });
    }
    if (walletBalance > 0 || i % 3 === 0) {
      timeline.push({
        id: `t-${i}-3`, timestamp: joinedAt + 60_000, event: 'Wallet Credited',
        detail: 'Welcome Bonus +₹50', icon: 'wallet',
      });
    }
    if (couponUsageCount > 0) {
      timeline.push({
        id: `t-${i}-4`, timestamp: joinedAt + 2 * 86400_000, event: 'Coupon Used',
        detail: `${COUPONS_USED[i % COUPONS_USED.length]} applied`, icon: 'coupon',
      });
    }
    orders.slice(0, 3).forEach((o, j) => {
      timeline.push({
        id: `t-${i}-o-${j}`, timestamp: o.date, event: 'Order Placed',
        detail: `${o.id} · ₹${o.amount.toLocaleString('en-IN')}`, icon: 'order',
      });
      timeline.push({
        id: `t-${i}-p-${j}`, timestamp: o.date + 5 * 60_000, event: 'Payment Received',
        detail: `${o.id} paid via UPI`, icon: 'payment',
      });
      if (o.status === 'Delivered' || o.status === 'Shipped') {
        timeline.push({
          id: `t-${i}-s-${j}`, timestamp: o.date + 8 * 3600_000, event: 'Shipment Dispatched',
          detail: `${o.id} shipped via BlueDart`, icon: 'ship',
        });
      }
    });
    reviews.slice(0, 2).forEach((r, j) => {
      timeline.push({
        id: `t-${i}-r-${j}`, timestamp: r.timestamp, event: 'Review Submitted',
        detail: `${r.product} · ${r.rating}★`, icon: 'review',
      });
    });
    supportTickets.slice(0, 2).forEach((t, j) => {
      timeline.push({
        id: `t-${i}-t-${j}`, timestamp: t.timestamp, event: 'Support Ticket',
        detail: `${t.id} · ${t.subject}`, icon: 'ticket',
      });
    });
    if (refundCount > 0) {
      timeline.push({
        id: `t-${i}-ref`, timestamp: (lastOrderAt ?? Date.now()) - 5 * 86400_000, event: 'Refund Processed',
        detail: `₹${refundAmount.toLocaleString('en-IN')} refunded`, icon: 'refund',
      });
    }
    timeline.push({
      id: `t-${i}-login`, timestamp: lastLoginAt, event: 'Last Login',
      detail: `via ${loginMethod}`, icon: 'login',
    });

    // Internal notes
    const notes: InternalNote[] = [];
    if (i % 4 === 0) {
      notes.push({
        id: `n-${i}-1`, author: 'Priya Nair',
        text: 'Customer requested expedited delivery on next order. Confirmed via phone.',
        timestamp: joinedAt + 15 * 60_000,
      });
    }
    if (vipTier !== 'Standard') {
      notes.push({
        id: `n-${i}-2`, author: 'Arjun Mehta',
        text: `${vipTier} tier customer — prioritize support responses.`,
        timestamp: lastLoginAt - 86400_000,
      });
    }

    return {
      id: `cust-${1001 + i}`,
      name,
      email: name.toLowerCase().replace(' ', '.') + (i % 2 ? '@gmail.com' : '@yahoo.in'),
      phone: `+91 9${String(800000000 + i * 1234567).slice(0, 9)}`,
      loginMethod,
      status,
      totalOrders,
      totalSpent,
      walletBalance,
      rewardPoints,
      joinedAt,
      lastLoginAt,
      lastOrderAt,
      address: `${i + 12}, ${['Brigade Road', 'MG Road', 'Indiranagar', 'Koramangala'][i % 4]}, ${geo.city}, ${geo.state} 56000${i % 9}`,
      referralCode: `LNK${(1000 + i * 17).toString().slice(-4)}`,
      referredBy: referredByRef(i),
      city: geo.city,
      state: geo.state,
      country: geo.country,
      vipTier,
      averageOrderValue,
      purchaseFrequency,
      favouriteBrand,
      favouriteCategory,
      averageBasketSize,
      refundCount,
      refundAmount,
      couponUsageCount,
      loyaltyScore,
      riskScore,
      tags,
      segment,
      gstNumber,
      wishlistCount,
      reviewsCount,
      supportTicketsCount,
      emailVerified,
      orders,
      walletHistory,
      reviews,
      supportTickets,
      timeline,
      notes,
    };
  });

  function referredByRef(i: number): string | undefined {
    return i > 0 && i % 3 === 0 ? NAMES[(i - 1) % NAMES.length] : undefined;
  }
}

const ALL_CUSTOMERS = generateCustomers();

/* ============================================================= */
/* HELPERS                                                       */
/* ============================================================= */

function fmtDate(ts: number, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(ts).toLocaleDateString('en-IN', opts ?? { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtDateTime(ts: number): string {
  return new Date(ts).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
}
function fmtMoney(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}
function fmtMoneyShort(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n}`;
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
  return fmtDate(ts, { day: 'numeric', month: 'short' });
}

function tierMeta(tier: VipTier, tokens: Tk): { color: string; bg: string } {
  switch (tier) {
    case 'Platinum': return { color: '#A78BFA', bg: '#A78BFA22' };
    case 'Gold':     return { color: '#F59E0B', bg: '#F59E0B22' };
    case 'Silver':   return { color: '#9CA3AF', bg: '#9CA3AF22' };
    default:         return { color: tokens.text.tertiary, bg: tokens.bg.surfaceAlt };
  }
}

function riskMeta(score: number, tokens: Tk): { color: string; label: string } {
  if (score < 15) return { color: tokens.status.success, label: 'Low Risk' };
  if (score < 35) return { color: tokens.status.warning, label: 'Medium Risk' };
  return { color: tokens.status.error, label: 'High Risk' };
}

/* ============================================================= */
/* ICONS                                                         */
/* ============================================================= */

function IconBox({ icon, color }: { icon: string; color: string }) {
  const s = 13;
  const props = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (icon) {
    case 'account':  return <svg {...props}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case 'verify':   return <svg {...props}><path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3" /></svg>;
    case 'order':    return <svg {...props}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>;
    case 'payment':  return <svg {...props}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M2 10h20" /></svg>;
    case 'ship':     return <svg {...props}><rect x="1" y="3" width="15" height="13" rx="1" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    case 'review':   return <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
    case 'coupon':   return <svg {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
    case 'ticket':   return <svg {...props}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>;
    case 'refund':   return <svg {...props}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>;
    case 'wallet':   return <svg {...props}><path d="M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 12a2 2 0 100 4h3v-4z" /></svg>;
    case 'login':    return <svg {...props}><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" /></svg>;
    case 'wishlist': return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
    default:         return <svg {...props}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

function DownloadIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>;
}
function MailIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7L12 13 2 7" /></svg>;
}
function PhoneIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>;
}
function MapPinIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function StarIcon({ color, filled }: { color: string; filled?: boolean }) {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
function ShieldIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function FilterIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>;
}
function TagIcon({ color }: { color: string }) {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
}
function SendIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
}
function BellIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>;
}
function BlockIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>;
}
function CheckIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>;
}
function ChartIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
}
function ReceiptIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>;
}
function MoreIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill={color} stroke="none"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>;
}

/* ============================================================= */
/* KPI STRIP                                                     */
/* ============================================================= */

function KpiStrip({ tokens, customers, onSegmentClick }: {
  tokens: Tk; customers: AdminCustomer[]; onSegmentClick: (k: string) => void;
}) {
  const kpis = useMemo(() => {
    const now = Date.now();
    const newCount = customers.filter(c => now - c.joinedAt < 30 * 86400_000).length;
    const returning = customers.filter(c => c.totalOrders >= 2).length;
    const vip = customers.filter(c => c.vipTier !== 'Standard').length;
    const blocked = customers.filter(c => c.status === 'Blocked').length;
    const last30 = customers.filter(c => c.joinedAt > now - 30 * 86400_000).length;
    const prev30 = customers.filter(c => {
      const d = now - c.joinedAt;
      return d > 30 * 86400_000 && d < 60 * 86400_000;
    }).length;
    const growth = prev30 === 0 ? 100 : Math.round(((last30 - prev30) / prev30) * 100);
    return { total: customers.length, newCount, returning, vip, blocked, growth };
  }, [customers]);

  const cards = [
    { label: 'Total Customers', value: kpis.total, sub: `${kpis.returning} returning`, accent: tokens.text.primary, segment: 'all' },
    { label: 'New (30d)', value: kpis.newCount, sub: `Joined this month`, accent: tokens.status.info, segment: 'new' },
    { label: 'Returning', value: kpis.returning, sub: `2+ orders`, accent: tokens.status.success, segment: 'returning' },
    { label: 'VIP', value: kpis.vip, sub: `Gold + Platinum`, accent: '#F59E0B', segment: 'vip' },
    { label: 'Blocked', value: kpis.blocked, sub: `Suspended accounts`, accent: tokens.status.error, segment: 'at_risk' },
    { label: 'Growth', value: `${kpis.growth >= 0 ? '+' : ''}${kpis.growth}%`, sub: `vs previous 30d`, accent: kpis.growth >= 0 ? tokens.status.success : tokens.status.error, segment: 'new' },
  ];

  return (
    <div className="kpi-strip" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
      gap: 10,
    }}>
      {cards.map((k, i) => (
        <button
          key={i}
          onClick={() => onSegmentClick(k.segment)}
          className="kpi-card"
          style={{
            textAlign: 'left', cursor: 'pointer',
            background: `linear-gradient(135deg, ${tokens.bg.surface}, ${tokens.bg.surfaceAlt})`,
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: 12, padding: '12px 14px',
            position: 'relative', overflow: 'hidden',
            transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 80, height: 80,
            background: `radial-gradient(circle at top right, ${k.accent}15, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8 }}>{k.label}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: k.accent, marginTop: 4, letterSpacing: '-0.02em' }}>{k.value}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{k.sub}</div>
        </button>
      ))}
      <style jsx>{`
        .kpi-card:hover { transform: translateY(-2px); box-shadow: ${tokens.shadow.md}; border-color: ${tokens.border.strong}; }
        @media (max-width: 1280px) { .kpi-strip { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; } }
        @media (max-width: 640px)  { .kpi-strip { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
        @media (max-width: 420px)  { .kpi-strip { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

/* ============================================================= */
/* SMART SEGMENTS ROW                                            */
/* ============================================================= */

function SmartSegments({ tokens, active, onChange, customers }: {
  tokens: Tk; active: string; onChange: (k: string) => void; customers: AdminCustomer[];
}) {
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: customers.length };
    for (const c of customers) {
      map[c.segment] = (map[c.segment] ?? 0) + 1;
      if (c.vipTier !== 'Standard') map.vip = (map.vip ?? 0) + 1;
    }
    return map;
  }, [customers]);

  return (
    <div className="seg-row" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
      {SEGMENTS.map(seg => {
        const isActive = active === seg.key;
        const count = counts[seg.key] ?? 0;
        return (
          <button key={seg.key} onClick={() => onChange(seg.key)} className="seg-chip" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 999,
            background: isActive ? tokens.text.primary : tokens.bg.surfaceAlt,
            color: isActive ? tokens.bg.app : tokens.text.secondary,
            border: `1px solid ${isActive ? tokens.text.primary : tokens.border.subtle}`,
            fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 140ms cubic-bezier(0.16,1,0.3,1)',
          }}>
            {seg.label}
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
              background: isActive ? tokens.bg.app + '33' : tokens.bg.surface,
              color: isActive ? tokens.bg.app : tokens.text.tertiary,
            }}>{count}</span>
          </button>
        );
      })}
      <style jsx>{`
        .seg-row::-webkit-scrollbar { height: 4px; }
        .seg-row::-webkit-scrollbar-thumb { background: ${tokens.border.subtle}; border-radius: 2px; }
        .seg-chip:hover { transform: translateY(-1px); }
      `}</style>
    </div>
  );
}

/* ============================================================= */
/* ADVANCED FILTERS PANEL                                        */
/* ============================================================= */

function AdvancedFilters({ tokens, filters, setFilters, customers }: {
  tokens: Tk;
  filters: Record<string, string>;
  setFilters: (f: Record<string, string>) => void;
  customers: AdminCustomer[];
}) {
  const options = useMemo(() => {
    const countries = Array.from(new Set(customers.map(c => c.country)));
    const states = Array.from(new Set(customers.map(c => c.state)));
    const cities = Array.from(new Set(customers.map(c => c.city)));
    const brands = Array.from(new Set(customers.map(c => c.favouriteBrand)));
    const tagsAll = Array.from(new Set(customers.flatMap(c => c.tags)));
    return { countries, states, cities, brands, tagsAll };
  }, [customers]);

  const set = (k: string, v: string) => setFilters({ ...filters, [k]: v });

  return (
    <div style={{
      background: tokens.bg.surface,
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: 12, padding: 14,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 12,
      animation: 'admin-fade-in 200ms ease',
    }}>
      <FilterSelect tokens={tokens} label="Country" value={filters.country ?? 'all'} onChange={v => set('country', v)} options={[{ value: 'all', label: 'All Countries' }, ...options.countries.map(c => ({ value: c, label: c }))]} />
      <FilterSelect tokens={tokens} label="State" value={filters.state ?? 'all'} onChange={v => set('state', v)} options={[{ value: 'all', label: 'All States' }, ...options.states.map(s => ({ value: s, label: s }))]} />
      <FilterSelect tokens={tokens} label="City" value={filters.city ?? 'all'} onChange={v => set('city', v)} options={[{ value: 'all', label: 'All Cities' }, ...options.cities.map(c => ({ value: c, label: c }))]} />
      <FilterSelect tokens={tokens} label="VIP Tier" value={filters.vip ?? 'all'} onChange={v => set('vip', v)} options={[
        { value: 'all', label: 'All Tiers' },
        { value: 'Platinum', label: 'Platinum' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Standard', label: 'Standard' },
      ]} />
      <FilterSelect tokens={tokens} label="Customer Type" value={filters.type ?? 'all'} onChange={v => set('type', v)} options={[
        { value: 'all', label: 'All Types' },
        { value: 'email', label: 'Email Login' },
        { value: 'google', label: 'Google Login' },
        { value: 'otp', label: 'OTP Login' },
        { value: 'verified', label: 'Email Verified' },
      ]} />
      <FilterSelect tokens={tokens} label="Orders" value={filters.orders ?? 'all'} onChange={v => set('orders', v)} options={[
        { value: 'all', label: 'Any Order Count' },
        { value: '0', label: '0 orders' },
        { value: '1-3', label: '1–3 orders' },
        { value: '4-10', label: '4–10 orders' },
        { value: '10+', label: '10+ orders' },
      ]} />
      <FilterSelect tokens={tokens} label="Lifetime Value" value={filters.ltv ?? 'all'} onChange={v => set('ltv', v)} options={[
        { value: 'all', label: 'Any LTV' },
        { value: '0-10000', label: 'Under ₹10k' },
        { value: '10000-50000', label: '₹10k – ₹50k' },
        { value: '50000-100000', label: '₹50k – ₹1L' },
        { value: '100000+', label: 'Above ₹1L' },
      ]} />
      <FilterSelect tokens={tokens} label="Wallet" value={filters.wallet ?? 'all'} onChange={v => set('wallet', v)} options={[
        { value: 'all', label: 'Any Wallet' },
        { value: 'has', label: 'Has Balance' },
        { value: 'zero', label: 'Zero Balance' },
      ]} />
      <FilterSelect tokens={tokens} label="Coupons Used" value={filters.coupons ?? 'all'} onChange={v => set('coupons', v)} options={[
        { value: 'all', label: 'Any Coupon Usage' },
        { value: '0', label: 'Never Used' },
        { value: '1+', label: 'Used 1+' },
      ]} />
      <FilterSelect tokens={tokens} label="Favourite Brand" value={filters.brand ?? 'all'} onChange={v => set('brand', v)} options={[{ value: 'all', label: 'All Brands' }, ...options.brands.map(b => ({ value: b, label: b }))]} />
      <FilterSelect tokens={tokens} label="Tags" value={filters.tag ?? 'all'} onChange={v => set('tag', v)} options={[{ value: 'all', label: 'All Tags' }, ...options.tagsAll.map(t => ({ value: t, label: t }))]} />
      <FilterSelect tokens={tokens} label="Last Purchase" value={filters.lastPurchase ?? 'all'} onChange={v => set('lastPurchase', v)} options={[
        { value: 'all', label: 'Any Time' },
        { value: '7d', label: 'Last 7 days' },
        { value: '30d', label: 'Last 30 days' },
        { value: '90d', label: 'Last 90 days' },
        { value: 'never', label: 'Never Purchased' },
      ]} />
      <FilterSelect tokens={tokens} label="Registration" value={filters.registered ?? 'all'} onChange={v => set('registered', v)} options={[
        { value: 'all', label: 'Any Date' },
        { value: '7d', label: 'Last 7 days' },
        { value: '30d', label: 'Last 30 days' },
        { value: '90d', label: 'Last 90 days' },
        { value: '365d', label: 'Last year' },
      ]} />
    </div>
  );
}

function FilterSelect({ tokens, label, value, onChange, options }: {
  tokens: Tk; label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 4, fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</label>
      <Select tokens={tokens} value={value} onChange={e => onChange(e.target.value)} options={options} style={{ height: 32, width: '100%', fontSize: 12 }} />
    </div>
  );
}

/* ============================================================= */
/* BULK ACTION BAR                                               */
/* ============================================================= */

function BulkActionBar({ tokens, count, onClear, onAction }: {
  tokens: Tk; count: number; onClear: () => void; onAction: (action: string) => void;
}) {
  if (count === 0) return null;
  return (
    <div className="bulk-bar" style={{
      display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      padding: '10px 14px', borderRadius: 10,
      background: tokens.text.primary, color: tokens.bg.app,
      animation: 'admin-fade-in 200ms ease',
    }}>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{count} selected</span>
      <div style={{ width: 1, height: 20, background: tokens.bg.app + '33' }} />
      <BulkBtn label="Export" icon={<DownloadIcon color={tokens.bg.app} />} onClick={() => onAction('export')} tokens={tokens} />
      <BulkBtn label="Assign Tags" icon={<TagIcon color={tokens.bg.app} />} onClick={() => onAction('tags')} tokens={tokens} />
      <BulkBtn label="Send Email" icon={<MailIcon color={tokens.bg.app} />} onClick={() => onAction('email')} tokens={tokens} />
      <BulkBtn label="Notify" icon={<BellIcon color={tokens.bg.app} />} onClick={() => onAction('notify')} tokens={tokens} />
      <BulkBtn label="Assign Segment" icon={<ChartIcon color={tokens.bg.app} />} onClick={() => onAction('segment')} tokens={tokens} />
      <BulkBtn label="Generate Report" icon={<ReceiptIcon color={tokens.bg.app} />} onClick={() => onAction('report')} tokens={tokens} />
      <BulkBtn label="Activate" icon={<CheckIcon color={tokens.bg.app} />} onClick={() => onAction('activate')} tokens={tokens} />
      <BulkBtn label="Block" icon={<BlockIcon color={tokens.bg.app} />} onClick={() => onAction('block')} tokens={tokens} danger />
      <div style={{ flex: 1 }} />
      <button onClick={onClear} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: tokens.bg.app, fontSize: 12, fontWeight: 600, opacity: 0.8, padding: 4,
      }}>Clear</button>
    </div>
  );
}

function BulkBtn({ tokens, label, icon, onClick, danger }: {
  tokens: Tk; label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean;
}) {
  return (
    <button onClick={onClick} className="bulk-btn" style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 10px', borderRadius: 6,
      background: danger ? tokens.status.error + '33' : 'transparent',
      color: tokens.bg.app,
      border: `1px solid ${tokens.bg.app}33`,
      fontSize: 11, fontWeight: 600, cursor: 'pointer',
      transition: 'all 140ms cubic-bezier(0.16,1,0.3,1)',
    }}>
      {icon} {label}
    </button>
  );
}

/* ============================================================= */
/* CUSTOMER PROFILE DRAWER                                       */
/* ============================================================= */

function CustomerDrawer({ tokens, customer, open, onClose, push, onAddNote, onTagToggle }: {
  tokens: Tk; customer: AdminCustomer | null; open: boolean; onClose: () => void;
  push: (t: any) => void; onAddNote: (text: string) => void; onTagToggle: (tag: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wallet' | 'reviews' | 'tickets' | 'timeline'>('overview');
  const [noteText, setNoteText] = useState('');

  useEffect(() => { setActiveTab('overview'); setNoteText(''); }, [customer?.id]);

  if (!customer) return null;

  const vipM = tierMeta(customer.vipTier, tokens);
  const riskM = riskMeta(customer.riskScore, tokens);
  const avatarColor = tokens.chart.series[customer.id.charCodeAt(5) % 6];

  const drawerTabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'orders', label: `Orders (${customer.totalOrders})` },
    { key: 'wallet', label: `Wallet (${customer.walletHistory.length})` },
    { key: 'reviews', label: `Reviews (${customer.reviewsCount})` },
    { key: 'tickets', label: `Tickets (${customer.supportTicketsCount})` },
    { key: 'timeline', label: 'Timeline' },
  ] as const;

  return (
    <Drawer
      tokens={tokens}
      open={open}
      onClose={onClose}
      width={760}
      title={undefined}
      subtitle={undefined}
      footer={undefined}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 20 }}>
        {/* Profile hero */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: 16, borderRadius: 12,
          background: `linear-gradient(135deg, ${tokens.bg.surfaceAlt}, ${tokens.bg.surface})`,
          border: `1px solid ${tokens.border.subtle}`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 120, height: 120,
            background: `radial-gradient(circle at top right, ${avatarColor}22, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <Avatar tokens={tokens} name={customer.name} size={64} color={avatarColor} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: tokens.text.primary, letterSpacing: '-0.02em' }}>{customer.name}</h2>
              {customer.vipTier !== 'Standard' && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontSize: 10, fontWeight: 700, padding: '2px 8px',
                  borderRadius: 999, color: vipM.color, background: vipM.bg,
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                  <StarIcon color={vipM.color} filled /> {customer.vipTier}
                </span>
              )}
              {customer.emailVerified && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontSize: 10, fontWeight: 600, padding: '2px 7px',
                  borderRadius: 999, color: tokens.status.success,
                  background: tokens.status.success + '15',
                }}>
                  <CheckIcon color={tokens.status.success} /> Verified
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap', fontSize: 12, color: tokens.text.secondary }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MailIcon color={tokens.text.tertiary} /> {customer.email}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><PhoneIcon color={tokens.text.tertiary} /> {customer.phone}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPinIcon color={tokens.text.tertiary} /> {customer.city}, {customer.state}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              <Badge tokens={tokens} tone="neutral" size="sm">{customer.loginMethod} login</Badge>
              <StatusPill tokens={tokens} status={customer.status} />
              <Badge tokens={tokens} tone="info" size="sm">{customer.id}</Badge>
              <Badge tokens={tokens} tone="warning" size="sm">{customer.rewardPoints} pts</Badge>
            </div>
          </div>
        </div>

        {/* Quick stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
          <StatBox tokens={tokens} label="Lifetime Value" value={fmtMoneyShort(customer.totalSpent)} sub={`${customer.totalOrders} orders`} accent={tokens.text.primary} />
          <StatBox tokens={tokens} label="Avg Order" value={fmtMoneyShort(customer.averageOrderValue)} sub={`₹${customer.averageOrderValue.toLocaleString('en-IN')}`} accent={tokens.status.info} />
          <StatBox tokens={tokens} label="Wallet" value={fmtMoney(customer.walletBalance)} sub={`${customer.rewardPoints} pts`} accent={tokens.status.success} />
          <StatBox tokens={tokens} label="Loyalty" value={`${customer.loyaltyScore}/100`} sub={riskM.label} accent={customer.loyaltyScore > 60 ? tokens.status.success : tokens.status.warning} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${tokens.border.subtle}`, overflowX: 'auto' }}>
          {drawerTabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
              color: activeTab === t.key ? tokens.text.primary : tokens.text.tertiary,
              borderBottom: activeTab === t.key ? `2px solid ${tokens.text.primary}` : '2px solid transparent',
              transition: 'all 140ms cubic-bezier(0.16,1,0.3,1)',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'admin-fade-in 200ms ease' }}>
            <DrawerSection tokens={tokens} title="Customer Insights">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                <InsightRow tokens={tokens} icon={<ChartIcon color={tokens.status.info} />} label="Customer Lifetime Value" value={fmtMoney(customer.totalSpent)} />
                <InsightRow tokens={tokens} icon={<ChartIcon color={tokens.status.success} />} label="Purchase Frequency" value={`${customer.purchaseFrequency} /mo`} />
                <InsightRow tokens={tokens} icon={<TagIcon color={tokens.status.warning} />} label="Favourite Brand" value={customer.favouriteBrand} />
                <InsightRow tokens={tokens} icon={<TagIcon color={tokens.status.info} />} label="Favourite Category" value={customer.favouriteCategory} />
                <InsightRow tokens={tokens} icon={<ChartIcon color={tokens.text.secondary} />} label="Avg Basket Size" value={`${customer.averageBasketSize} items`} />
                <InsightRow tokens={tokens} icon={<ChartIcon color={tokens.text.secondary} />} label="Avg Order Value" value={fmtMoney(customer.averageOrderValue)} />
                <InsightRow tokens={tokens} icon={<ReceiptIcon color={tokens.status.error} />} label="Refund History" value={customer.refundCount > 0 ? `${customer.refundCount} · ${fmtMoney(customer.refundAmount)}` : 'No refunds'} />
                <InsightRow tokens={tokens} icon={<TagIcon color={tokens.status.success} />} label="Coupon Usage" value={`${customer.couponUsageCount} coupons`} />
                <InsightRow tokens={tokens} icon={<StarIcon color={vipM.color} filled />} label="Loyalty Status" value={customer.loyaltyScore > 70 ? 'Champion' : customer.loyaltyScore > 40 ? 'Loyal' : 'New'} />
                <InsightRow tokens={tokens} icon={<StarIcon color={vipM.color} filled />} label="VIP Status" value={customer.vipTier} />
                <InsightRow tokens={tokens} icon={<ShieldIcon color={riskM.color} />} label="Risk Indicator" value={riskM.label} valueColor={riskM.color} />
                <InsightRow tokens={tokens} icon={<ReceiptIcon color={tokens.text.secondary} />} label="Most Recent Purchase" value={customer.lastOrderAt ? timeAgo(customer.lastOrderAt) : 'Never'} />
              </div>
            </DrawerSection>

            <DrawerSection tokens={tokens} title="Contact & Address">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <KeyValue tokens={tokens} label="Email" value={customer.email} />
                <KeyValue tokens={tokens} label="Phone" value={customer.phone} />
                <KeyValue tokens={tokens} label="Referral Code" value={customer.referralCode} />
                <KeyValue tokens={tokens} label="Referred By" value={customer.referredBy ?? '—'} />
                <KeyValue tokens={tokens} label="Joined" value={fmtDate(customer.joinedAt)} />
                <KeyValue tokens={tokens} label="Last Login" value={fmtDateTime(customer.lastLoginAt)} />
                {customer.gstNumber && <KeyValue tokens={tokens} label="GSTIN" value={customer.gstNumber} />}
                <KeyValue tokens={tokens} label="Customer ID" value={customer.id} />
              </div>
              <div style={{ marginTop: 10, padding: 10, borderRadius: 8, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Shipping Address</div>
                <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.5 }}>{customer.address}</div>
              </div>
            </DrawerSection>

            <DrawerSection tokens={tokens} title="Tags">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {customer.tags.map(tag => (
                  <button key={tag} onClick={() => onTagToggle(tag)} className="tag-chip" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 9px', borderRadius: 999,
                    background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
                    color: tokens.text.secondary, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 140ms',
                  }}>
                    <TagIcon color={tokens.text.tertiary} /> {tag}
                    <span style={{ color: tokens.text.tertiary, fontSize: 14, lineHeight: 1 }}>×</span>
                  </button>
                ))}
                <button onClick={() => push({ tone: 'info', title: 'Add tag', message: 'Tag picker would open' })} style={{
                  padding: '3px 9px', borderRadius: 999,
                  background: 'transparent', border: `1px dashed ${tokens.border.strong}`,
                  color: tokens.text.tertiary, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                }}>+ Add tag</button>
              </div>
            </DrawerSection>

            <DrawerSection tokens={tokens} title="Wishlist">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Array.from({ length: Math.min(customer.wishlistCount, 5) }).map((_, i) => (
                  <Badge key={i} tokens={tokens} tone="neutral" size="sm">
                    {['Air Jordan 1 Low', 'Samba OG', 'Nike Dunk Low', 'Yeezy 350 V2', 'Jordan 4 Bred'][i]}
                  </Badge>
                ))}
                {customer.wishlistCount > 5 && <Badge tokens={tokens} tone="neutral" size="sm">+{customer.wishlistCount - 5} more</Badge>}
                {customer.wishlistCount === 0 && <span style={{ fontSize: 12, color: tokens.text.tertiary, fontStyle: 'italic' }}>No wishlist items</span>}
              </div>
            </DrawerSection>

            <DrawerSection tokens={tokens} title="Coupons">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {customer.couponUsageCount > 0 ? (
                  Array.from({ length: customer.couponUsageCount }).map((_, i) => (
                    <Badge key={i} tokens={tokens} tone="success" size="sm">{COUPONS_USED[(i + customer.id.length) % COUPONS_USED.length]}</Badge>
                  ))
                ) : <span style={{ fontSize: 12, color: tokens.text.tertiary, fontStyle: 'italic' }}>No coupons used yet</span>}
              </div>
            </DrawerSection>

            <DrawerSection tokens={tokens} title="Returns">
              {customer.refundCount > 0 ? (
                <div style={{ padding: 10, borderRadius: 8, background: tokens.status.error + '11', border: `1px solid ${tokens.status.error}33` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: tokens.status.error, textTransform: 'uppercase', letterSpacing: 0.5 }}>Refund History</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: tokens.status.error, marginTop: 4 }}>{fmtMoney(customer.refundAmount)}</div>
                  <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{customer.refundCount} refund processed</div>
                </div>
              ) : <span style={{ fontSize: 12, color: tokens.text.tertiary, fontStyle: 'italic' }}>No returns initiated</span>}
            </DrawerSection>

            <DrawerSection tokens={tokens} title="Internal Notes">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {customer.notes.length > 0 && customer.notes.map(note => (
                  <div key={note.id} style={{ background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`, borderRadius: 8, padding: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary }}>{note.author}</span>
                      <span style={{ fontSize: 10, color: tokens.text.tertiary }}>{timeAgo(note.timestamp)}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: tokens.text.primary, lineHeight: 1.5 }}>{note.text}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`, borderRadius: 8, padding: 10 }}>
                  <textarea
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); if (noteText.trim()) { onAddNote(noteText); setNoteText(''); } } }}
                    placeholder="Add a private note (Cmd/Ctrl + Enter to save)…"
                    style={{ flex: 1, minHeight: 36, resize: 'vertical', border: 'none', outline: 'none', background: 'transparent', color: tokens.text.primary, fontSize: 12, fontFamily: 'inherit', lineHeight: 1.5 }}
                  />
                  <Button tokens={tokens} variant="primary" size="sm" icon={<SendIcon color={tokens.bg.app} />} disabled={!noteText.trim()} onClick={() => { if (noteText.trim()) { onAddNote(noteText); setNoteText(''); } }}>Add</Button>
                </div>
              </div>
            </DrawerSection>
          </div>
        )}

        {activeTab === 'orders' && (
          <DrawerSection tokens={tokens} title="Order History">
            {customer.orders.length === 0 ? (
              <EmptyState tokens={tokens} icon={<ChartIcon color={tokens.text.tertiary} />} title="No orders yet" description="This customer hasn't placed any orders." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {customer.orders.map(o => (
                  <div key={o.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 8,
                    background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{o.id}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{fmtDate(o.date)} · {o.items} item{o.items > 1 ? 's' : ''}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{fmtMoney(o.amount)}</span>
                      <StatusPill tokens={tokens} status={o.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DrawerSection>
        )}

        {activeTab === 'wallet' && (
          <DrawerSection tokens={tokens} title="Wallet Activity">
            <div style={{
              padding: 14, borderRadius: 10, marginBottom: 10,
              background: `linear-gradient(135deg, ${tokens.status.success}11, ${tokens.bg.surfaceAlt})`,
              border: `1px solid ${tokens.border.subtle}`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: tokens.status.success, textTransform: 'uppercase', letterSpacing: 0.6 }}>Current Balance</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: tokens.text.primary, letterSpacing: '-0.02em', marginTop: 4 }}>{fmtMoney(customer.walletBalance)}</div>
              <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 2 }}>{customer.rewardPoints} reward points</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {customer.walletHistory.map(w => (
                <div key={w.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 10px', borderRadius: 8, background: tokens.bg.surfaceAlt,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 6,
                      background: w.type === 'credit' ? tokens.status.success + '22' : tokens.status.error + '22',
                      color: w.type === 'credit' ? tokens.status.success : tokens.status.error,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                    }}>{w.type === 'credit' ? '↓' : '↑'}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{w.reason}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary }}>{fmtDateTime(w.timestamp)}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: w.type === 'credit' ? tokens.status.success : tokens.status.error }}>
                    {w.type === 'credit' ? '+' : '−'}{fmtMoney(Math.abs(w.amount))}
                  </div>
                </div>
              ))}
            </div>
          </DrawerSection>
        )}

        {activeTab === 'reviews' && (
          <DrawerSection tokens={tokens} title="Reviews">
            {customer.reviews.length === 0 ? (
              <EmptyState tokens={tokens} icon={<StarIcon color={tokens.text.tertiary} />} title="No reviews yet" description="This customer hasn't submitted any reviews." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {customer.reviews.map(r => (
                  <div key={r.id} style={{ padding: 10, borderRadius: 8, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{r.product}</span>
                      <div style={{ display: 'flex', gap: 1 }}>
                        {[1, 2, 3, 4, 5].map(s => <StarIcon key={s} color={s <= r.rating ? '#F59E0B' : tokens.border.strong} filled={s <= r.rating} />)}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: tokens.text.secondary, marginTop: 4, lineHeight: 1.5 }}>{r.text}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>{timeAgo(r.timestamp)}</div>
                  </div>
                ))}
              </div>
            )}
          </DrawerSection>
        )}

        {activeTab === 'tickets' && (
          <DrawerSection tokens={tokens} title="Support Tickets">
            {customer.supportTickets.length === 0 ? (
              <EmptyState tokens={tokens} icon={<BellIcon color={tokens.text.tertiary} />} title="No tickets" description="No support tickets from this customer." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {customer.supportTickets.map(t => (
                  <div key={t.id} style={{ padding: 10, borderRadius: 8, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{t.id}</span>
                        <span style={{ marginLeft: 8, fontSize: 12, color: tokens.text.secondary }}>{t.subject}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Badge tokens={tokens} tone={t.priority === 'High' ? 'critical' : t.priority === 'Medium' ? 'warning' : 'neutral'} size="sm">{t.priority}</Badge>
                        <StatusPill tokens={tokens} status={t.status} />
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>{timeAgo(t.timestamp)}</div>
                  </div>
                ))}
              </div>
            )}
          </DrawerSection>
        )}

        {activeTab === 'timeline' && (
          <DrawerSection tokens={tokens} title="Activity Timeline">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxHeight: 480, overflowY: 'auto' }} className="timeline-scroll">
              {[...customer.timeline].sort((a, b) => b.timestamp - a.timestamp).map((entry, i) => {
                const isLast = i === customer.timeline.length - 1;
                return (
                  <div key={entry.id} style={{
                    display: 'flex', gap: 10, position: 'relative',
                    paddingBottom: isLast ? 0 : 12,
                    animation: `admin-fade-in 240ms cubic-bezier(0.16,1,0.3,1) ${i * 30}ms both`,
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        color: tokens.text.secondary,
                      }}>
                        <IconBox icon={entry.icon} color={tokens.text.secondary} />
                      </div>
                      {!isLast && <div style={{ width: 2, flex: 1, minHeight: 10, background: tokens.border.subtle, margin: '2px 0' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, paddingBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: tokens.text.primary }}>{entry.event}</span>
                        <span style={{ fontSize: 10, color: tokens.text.tertiary, whiteSpace: 'nowrap' }}>{timeAgo(entry.timestamp)}</span>
                      </div>
                      {entry.detail && <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{entry.detail}</div>}
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{fmtDateTime(entry.timestamp)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DrawerSection>
        )}

        {/* Footer actions */}
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap',
          padding: 12, borderRadius: 10,
          background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
        }}>
          <Button tokens={tokens} variant="secondary" size="sm" icon={<MailIcon color={tokens.text.primary} />} onClick={() => push({ tone: 'info', title: 'Compose email', message: customer.email })}>Email</Button>
          <Button tokens={tokens} variant="secondary" size="sm" icon={<PhoneIcon color={tokens.text.primary} />} onClick={() => push({ tone: 'info', title: 'Call customer', message: customer.phone })}>Call</Button>
          <Button tokens={tokens} variant="secondary" size="sm" icon={<BellIcon color={tokens.text.primary} />} onClick={() => push({ tone: 'info', title: 'Send notification', message: `To ${customer.name}` })}>Notify</Button>
          <Button tokens={tokens} variant="secondary" size="sm" icon={<DownloadIcon color={tokens.text.primary} />} onClick={() => push({ tone: 'success', title: 'Profile exported', message: `${customer.id}.pdf` })}>Export</Button>
          <div style={{ flex: 1 }} />
          {customer.status !== 'Blocked' ? (
            <Button tokens={tokens} variant="danger" size="sm" icon={<BlockIcon color="#fff" />} onClick={() => push({ tone: 'error', title: 'Customer blocked', message: customer.name })}>Block</Button>
          ) : (
            <Button tokens={tokens} variant="success" size="sm" icon={<CheckIcon color="#fff" />} onClick={() => push({ tone: 'success', title: 'Customer activated', message: customer.name })}>Activate</Button>
          )}
        </div>
      </div>
      <style jsx>{`
        .timeline-scroll::-webkit-scrollbar { width: 5px; }
        .timeline-scroll::-webkit-scrollbar-thumb { background: ${tokens.border.subtle}; border-radius: 3px; }
        .tag-chip:hover { background: ${tokens.bg.hover}; border-color: ${tokens.border.strong}; }
      `}</style>
    </Drawer>
  );
}

function DrawerSection({ tokens, title, children }: { tokens: Tk; title: string; children: React.ReactNode }) {
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

function StatBox({ tokens, label, value, sub, accent }: {
  tokens: Tk; label: string; value: string; sub?: string; accent: string;
}) {
  return (
    <div style={{
      padding: 10, borderRadius: 10,
      background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: accent, marginTop: 3, letterSpacing: '-0.01em' }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function InsightRow({ tokens, icon, label, value, valueColor }: {
  tokens: Tk; icon: React.ReactNode; label: string; value: string; valueColor?: string;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: 10, borderRadius: 8,
      background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
    }}>
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: valueColor ?? tokens.text.primary, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
      </div>
    </div>
  );
}

/* ============================================================= */
/* MAIN PAGE                                                     */
/* ============================================================= */

export default function CustomersManagementPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();

  const [customers, setCustomers] = useState<AdminCustomer[]>(ALL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [segment, setSegment] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<AdminCustomer | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 380);
    return () => clearTimeout(t);
  }, []);

  // Apply search + filters
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const now = Date.now();
    return customers.filter(c => {
      if (q) {
        const hay = `${c.name} ${c.email} ${c.phone} ${c.city} ${c.state} ${c.country} ${c.id} ${c.referralCode} ${c.favouriteBrand}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusTab !== 'all' && c.status.toLowerCase() !== statusTab) return false;
      if (segment !== 'all' && segment !== 'vip') {
        if (c.segment !== segment) return false;
      } else if (segment === 'vip' && c.vipTier === 'Standard') return false;

      // Advanced filters
      if (filters.country && filters.country !== 'all' && c.country !== filters.country) return false;
      if (filters.state && filters.state !== 'all' && c.state !== filters.state) return false;
      if (filters.city && filters.city !== 'all' && c.city !== filters.city) return false;
      if (filters.vip && filters.vip !== 'all' && c.vipTier !== filters.vip) return false;
      if (filters.type) {
        if (filters.type === 'email' && c.loginMethod !== 'Email') return false;
        if (filters.type === 'google' && c.loginMethod !== 'Google') return false;
        if (filters.type === 'otp' && c.loginMethod !== 'OTP') return false;
        if (filters.type === 'verified' && !c.emailVerified) return false;
      }
      if (filters.orders && filters.orders !== 'all') {
        const o = c.totalOrders;
        if (filters.orders === '0' && o !== 0) return false;
        if (filters.orders === '1-3' && (o < 1 || o > 3)) return false;
        if (filters.orders === '4-10' && (o < 4 || o > 10)) return false;
        if (filters.orders === '10+' && o < 10) return false;
      }
      if (filters.ltv && filters.ltv !== 'all') {
        const v = c.totalSpent;
        if (filters.ltv === '0-10000' && v >= 10000) return false;
        if (filters.ltv === '10000-50000' && (v < 10000 || v >= 50000)) return false;
        if (filters.ltv === '50000-100000' && (v < 50000 || v >= 100000)) return false;
        if (filters.ltv === '100000+' && v < 100000) return false;
      }
      if (filters.wallet && filters.wallet !== 'all') {
        if (filters.wallet === 'has' && c.walletBalance <= 0) return false;
        if (filters.wallet === 'zero' && c.walletBalance > 0) return false;
      }
      if (filters.coupons && filters.coupons !== 'all') {
        if (filters.coupons === '0' && c.couponUsageCount > 0) return false;
        if (filters.coupons === '1+' && c.couponUsageCount < 1) return false;
      }
      if (filters.brand && filters.brand !== 'all' && c.favouriteBrand !== filters.brand) return false;
      if (filters.tag && filters.tag !== 'all' && !c.tags.includes(filters.tag)) return false;
      if (filters.lastPurchase && filters.lastPurchase !== 'all') {
        if (filters.lastPurchase === 'never' && c.lastOrderAt) return false;
        if (filters.lastPurchase !== 'never') {
          if (!c.lastOrderAt) return false;
          const days = (now - c.lastOrderAt) / 86400_000;
          if (filters.lastPurchase === '7d' && days > 7) return false;
          if (filters.lastPurchase === '30d' && days > 30) return false;
          if (filters.lastPurchase === '90d' && days > 90) return false;
        }
      }
      if (filters.registered && filters.registered !== 'all') {
        const days = (now - c.joinedAt) / 86400_000;
        if (filters.registered === '7d' && days > 7) return false;
        if (filters.registered === '30d' && days > 30) return false;
        if (filters.registered === '90d' && days > 90) return false;
        if (filters.registered === '365d' && days > 365) return false;
      }
      return true;
    });
  }, [customers, search, statusTab, segment, filters]);

  const counts = useMemo(() => ({
    all: customers.length,
    active: customers.filter(c => c.status === 'Active').length,
    inactive: customers.filter(c => c.status === 'Inactive').length,
    blocked: customers.filter(c => c.status === 'Blocked').length,
  }), [customers]);

  const activeFilterCount = useMemo(() => Object.values(filters).filter(v => v && v !== 'all').length, [filters]);

  const columns: Column<AdminCustomer>[] = useMemo(() => [
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      sortValue: c => c.name,
      render: c => {
        const vipM = tierMeta(c.vipTier, tokens);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar tokens={tokens} name={c.name} size={36} color={tokens.chart.series[c.id.charCodeAt(5) % 6]} />
              {c.vipTier !== 'Standard' && (
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 14, height: 14, borderRadius: '50%',
                  background: vipM.color, border: `2px solid ${tokens.bg.surface}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <StarIcon color="#fff" filled />
                </div>
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontWeight: 600, color: tokens.text.primary, fontSize: 12.5 }}>{c.name}</span>
                {c.emailVerified && <CheckIcon color={tokens.status.success} />}
              </div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'phone',
      header: 'Phone',
      render: c => <span style={{ fontSize: 11, color: tokens.text.secondary, fontFamily: 'ui-monospace, monospace' }}>{c.phone}</span>,
    },
    {
      key: 'city',
      header: 'City',
      sortable: true,
      sortValue: c => c.city,
      render: c => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, color: tokens.text.primary, fontWeight: 600 }}>{c.city}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary }}>{c.state}</div>
        </div>
      ),
    },
    {
      key: 'country',
      header: 'Country',
      sortable: true,
      sortValue: c => c.country,
      render: c => <span style={{ fontSize: 11, color: tokens.text.secondary }}>{c.country}</span>,
    },
    {
      key: 'orders',
      header: 'Orders',
      align: 'right',
      sortable: true,
      sortValue: c => c.totalOrders,
      render: c => <span style={{ fontWeight: 700, color: tokens.text.primary, fontSize: 13 }}>{c.totalOrders}</span>,
    },
    {
      key: 'ltv',
      header: 'Lifetime Value',
      align: 'right',
      sortable: true,
      sortValue: c => c.totalSpent,
      render: c => <span style={{ fontWeight: 700, color: tokens.text.primary, fontSize: 12.5 }}>{fmtMoneyShort(c.totalSpent)}</span>,
    },
    {
      key: 'avgOrder',
      header: 'Avg Order',
      align: 'right',
      sortable: true,
      sortValue: c => c.averageOrderValue,
      render: c => <span style={{ fontSize: 12, color: tokens.text.secondary }}>{fmtMoneyShort(c.averageOrderValue)}</span>,
    },
    {
      key: 'lastOrder',
      header: 'Last Order',
      sortable: true,
      sortValue: c => c.lastOrderAt ?? 0,
      render: c => c.lastOrderAt ? (
        <span style={{ fontSize: 11, color: tokens.text.secondary }}>{timeAgo(c.lastOrderAt)}</span>
      ) : <span style={{ fontSize: 11, color: tokens.text.tertiary, fontStyle: 'italic' }}>Never</span>,
    },
    {
      key: 'vipTier',
      header: 'Tier',
      align: 'center',
      sortable: true,
      sortValue: c => c.vipTier,
      render: c => {
        if (c.vipTier === 'Standard') return <span style={{ fontSize: 11, color: tokens.text.tertiary }}>—</span>;
        const vipM = tierMeta(c.vipTier, tokens);
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 10, fontWeight: 700, padding: '2px 7px',
            borderRadius: 999, color: vipM.color, background: vipM.bg,
          }}>
            <StarIcon color={vipM.color} filled /> {c.vipTier}
          </span>
        );
      },
    },
    {
      key: 'wallet',
      header: 'Wallet',
      align: 'right',
      sortable: true,
      sortValue: c => c.walletBalance,
      render: c => c.walletBalance > 0 ? (
        <span style={{ fontWeight: 600, color: tokens.status.success, fontSize: 12 }}>{fmtMoney(c.walletBalance)}</span>
      ) : <span style={{ color: tokens.text.tertiary, fontSize: 11 }}>—</span>,
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
      key: 'joined',
      header: 'Joined',
      sortable: true,
      sortValue: c => c.joinedAt,
      render: c => <span style={{ fontSize: 11, color: tokens.text.secondary }}>{fmtDate(c.joinedAt, { day: 'numeric', month: 'short', year: '2-digit' })}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      sortable: false,
      render: c => (
        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
          <Button tokens={tokens} variant="ghost" size="sm" onClick={() => setDetail(c)}>View</Button>
          <button onClick={(e) => { e.stopPropagation(); pushToast({ tone: 'info', title: 'Quick actions', message: c.name }); }} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 6, borderRadius: 6, color: tokens.text.tertiary,
            display: 'inline-flex', alignItems: 'center',
          }}><MoreIcon color={tokens.text.tertiary} /></button>
        </div>
      ),
    },
  ], [tokens, pushToast]);

  const handleAddNote = useCallback((text: string) => {
    if (!detail) return;
    const target = customers.find(c => c.id === detail.id);
    if (!target) return;
    target.notes.push({
      id: `n-new-${Date.now()}`,
      author: 'You',
      text,
      timestamp: Date.now(),
    });
    setCustomers(prev => [...prev]);
    setDetail({ ...target });
    pushToast({ tone: 'success', title: 'Note added', message: 'Internal note saved' });
  }, [detail, customers, pushToast]);

  const handleTagToggle = useCallback((tag: string) => {
    if (!detail) return;
    const target = customers.find(c => c.id === detail.id);
    if (!target) return;
    const idx = target.tags.indexOf(tag);
    if (idx >= 0) target.tags.splice(idx, 1);
    else target.tags.push(tag);
    setCustomers(prev => [...prev]);
    setDetail({ ...target });
    pushToast({ tone: 'success', title: idx >= 0 ? 'Tag removed' : 'Tag added', message: tag });
  }, [detail, customers, pushToast]);

  const handleBulkAction = useCallback((action: string) => {
    const messages: Record<string, { tone: 'success' | 'info' | 'error'; title: string; message: string }> = {
      export:    { tone: 'success', title: 'Export started', message: `${selected.length} customers → CSV` },
      tags:      { tone: 'info',    title: 'Assign tags',    message: `${selected.length} customers selected` },
      email:     { tone: 'info',    title: 'Compose email',  message: `${selected.length} recipients` },
      notify:    { tone: 'info',    title: 'Send notification', message: `${selected.length} customers` },
      segment:   { tone: 'info',    title: 'Assign segment', message: `${selected.length} customers` },
      report:    { tone: 'success', title: 'Report generated', message: `${selected.length} customers` },
      activate:  { tone: 'success', title: 'Customers activated', message: `${selected.length} accounts` },
      block:     { tone: 'error',   title: 'Customers blocked', message: `${selected.length} accounts` },
    };
    pushToast(messages[action] ?? { tone: 'info', title: action, message: '' });
    if (action === 'block' || action === 'activate') {
      const newStatus = action === 'block' ? 'Blocked' : 'Active';
      setCustomers(prev => prev.map(c => selected.includes(c.id) ? { ...c, status: newStatus as CustomerStatus } : c));
    }
    setSelected([]);
  }, [selected, pushToast]);

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
        subtitle="Manage customer profiles, segments, lifetime value, wallets, support tickets, and activity timeline."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Sales' }, { label: 'Customers' }]}
        meta={<Badge tokens={tokens} tone="info">{customers.length} customers</Badge>}
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'success', title: 'Export started', message: 'Generating CSV…' })} icon={<DownloadIcon color={tokens.text.secondary} />}>Export</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'info', title: 'Bulk email', message: 'Compose campaign' })} icon={<MailIcon color={tokens.bg.app} />}>Send Campaign</Button>
          </>
        }
      />

      <div className="crm-root" style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowX: 'hidden' }}>
        <KpiStrip tokens={tokens} customers={customers} onSegmentClick={setSegment} />

        <SmartSegments tokens={tokens} active={segment} onChange={setSegment} customers={customers} />

        {/* Status tabs + toolbar */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
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
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 280 }}>
              <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search name, email, phone, city, brand…" />
            </div>
            <Button
              tokens={tokens}
              variant={showFilters ? 'primary' : 'outline'}
              size="md"
              icon={<FilterIcon color={showFilters ? tokens.bg.app : tokens.text.secondary} />}
              onClick={() => setShowFilters(s => !s)}
            >
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Button>
            {activeFilterCount > 0 && (
              <button onClick={() => setFilters({})} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: tokens.text.tertiary, fontSize: 12, fontWeight: 600, padding: 4,
              }}>Clear all</button>
            )}
          </div>
        </div>

        {showFilters && (
          <AdvancedFilters tokens={tokens} filters={filters} setFilters={setFilters} customers={customers} />
        )}

        {/* Result count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: tokens.text.tertiary }}>
            Showing <span style={{ color: tokens.text.primary, fontWeight: 700 }}>{filtered.length}</span> of {customers.length} customers
          </span>
          {selected.length > 0 && <BulkActionBar tokens={tokens} count={selected.length} onClear={() => setSelected([])} onAction={handleBulkAction} />}
        </div>

        {pageLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton tokens={tokens} h={48} r={10} />
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} tokens={tokens} h={56} r={8} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            tokens={tokens}
            icon={<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.5-4.5" /></svg>}
            title="No customers found"
            description="Try adjusting your search or filters to find customers."
          />
        ) : (
          <EnterpriseDataTable<AdminCustomer>
            tokens={tokens}
            columns={columns}
            rows={filtered}
            getRowId={c => c.id}
            pageSize={15}
            selectable
            onSelectionChange={setSelected}
            onRowClick={c => setDetail(c)}
            defaultSort={{ key: 'ltv', dir: 'desc' }}
          />
        )}
      </div>

      <CustomerDrawer
        tokens={tokens}
        customer={detail}
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        push={pushToast}
        onAddNote={handleAddNote}
        onTagToggle={handleTagToggle}
      />

      <style jsx>{`
        .crm-root { animation: admin-fade-in 280ms cubic-bezier(0.16,1,0.3,1); }
        @media (max-width: 1100px) {
          :global(.crm-root .kpi-strip) { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        }
      `}</style>
    </AdminLayout>
  );
}
