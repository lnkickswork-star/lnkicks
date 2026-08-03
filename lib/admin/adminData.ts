/**
 * LNKICKS Enterprise Admin — Mock Analytics Data
 * ------------------------------------------------------------
 * Realistic sneakers marketplace data, deterministic per-session
 * so refreshes don't look random. Live updates are layered on
 * via setInterval in the dashboard (small deltas every 5-15s).
 *
 * Swap with real API calls (Firestore / Postgres / GA4) without
 * touching the UI — same shapes, same hook signatures.
 */

import type {
  KPI, SalesPoint, OrderStatusBreakdown, TopProduct,
  StockAlert, TrafficSource, AdminNotification,
} from './types';

/* Deterministic PRNG so a session looks consistent across reloads */
function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260803);

function rand(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function sparkline(base: number, points = 14, volatility = 0.15): number[] {
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v = Math.max(0, v + (rng() - 0.45) * base * volatility);
    out.push(Math.round(v));
  }
  return out;
}

const PRODUCT_NAMES = [
  { name: 'Air Jordan 1 Retro High OG', brand: 'Jordan', sku: 'AJ1-RH-OG-BC' },
  { name: 'Nike Dunk Low Panda', brand: 'Nike', sku: 'NK-DK-LW-PND' },
  { name: 'Adidas Samba OG', brand: 'Adidas', sku: 'AD-SMB-OG-WHT' },
  { name: 'Yeezy Boost 350 V2 Zebra', brand: 'Yeezy', sku: 'YZ-350-V2-ZBR' },
  { name: 'New Balance 530 Steel Grey', brand: 'New Balance', sku: 'NB-530-STG' },
  { name: 'Nike Air Force 1 Triple White', brand: 'Nike', sku: 'NK-AF1-TW' },
  { name: 'Jordan 4 Bred', brand: 'Jordan', sku: 'AJ4-BRD' },
  { name: 'Adidas Ultraboost 1.0 DNA', brand: 'Adidas', sku: 'AD-UB-10-DNA' },
  { name: 'Asics Gel-Kayano 14', brand: 'Asics', sku: 'AS-GK-14' },
  { name: 'Travis Scott x Jordan 1 Low Mocha', brand: 'Jordan', sku: 'TS-AJ1-LW-MCH' },
  { name: 'Nike Blazer Mid 77', brand: 'Nike', sku: 'NK-BLZ-MD-77' },
  { name: 'Salomon XT-6 Black', brand: 'Salomon', sku: 'SM-XT6-BLK' },
  { name: 'Adidas Gazelle Indoor', brand: 'Adidas', sku: 'AD-GZL-IND' },
  { name: 'Off-White x Nike Air Force 1', brand: 'Nike', sku: 'OW-NK-AF1' },
  { name: 'Converse Chuck 70 Hi', brand: 'Converse', sku: 'CV-CH70-HI' },
  { name: 'Puma Suede Classic', brand: 'Puma', sku: 'PM-SDE-CLS' },
];

/* ------------------------------------------------------------------ */
/* KPIs                                                                */
/* ------------------------------------------------------------------ */

export function getKPIs(): KPI[] {
  return [
    {
      key: 'total_sales',
      label: 'Total Sales',
      value: 2489500,
      formattedValue: '₹24,89,500',
      delta: 18.4,
      deltaLabel: 'vs last month',
      trend: sparkline(80000, 14, 0.18),
      tone: 'positive',
      icon: 'rupee',
      accent: '#0A0A0A',
    },
    {
      key: 'today_sales',
      label: "Today's Sales",
      value: 78250,
      formattedValue: '₹78,250',
      delta: 6.2,
      deltaLabel: 'vs yesterday',
      trend: sparkline(5500, 14, 0.25),
      tone: 'positive',
      icon: 'rupee',
      accent: '#3B82F6',
    },
    {
      key: 'monthly_sales',
      label: 'Monthly Sales',
      value: 684500,
      formattedValue: '₹6,84,500',
      delta: 12.1,
      deltaLabel: 'vs last month',
      trend: sparkline(22000, 14, 0.15),
      tone: 'positive',
      icon: 'calendar',
      accent: '#10B981',
    },
    {
      key: 'revenue',
      label: 'Net Revenue',
      value: 1987400,
      formattedValue: '₹19,87,400',
      delta: 14.8,
      deltaLabel: 'vs last month',
      trend: sparkline(65000, 14, 0.16),
      tone: 'positive',
      icon: 'trending',
      accent: '#8B5CF6',
    },
    {
      key: 'orders',
      label: 'Total Orders',
      value: 1420,
      formattedValue: '1,420',
      delta: 12.1,
      deltaLabel: 'vs last month',
      trend: sparkline(45, 14, 0.18),
      tone: 'positive',
      icon: 'cart',
      accent: '#0A0A0A',
    },
    {
      key: 'pending_orders',
      label: 'Pending Orders',
      value: 87,
      formattedValue: '87',
      delta: -4.2,
      deltaLabel: 'vs yesterday',
      trend: sparkline(8, 14, 0.30),
      tone: 'negative',
      icon: 'clock',
      accent: '#F59E0B',
    },
    {
      key: 'delivered_orders',
      label: 'Delivered Orders',
      value: 1184,
      formattedValue: '1,184',
      delta: 9.7,
      deltaLabel: 'vs last month',
      trend: sparkline(38, 14, 0.14),
      tone: 'positive',
      icon: 'check',
      accent: '#10B981',
    },
    {
      key: 'cancelled_orders',
      label: 'Cancelled Orders',
      value: 47,
      formattedValue: '47',
      delta: -8.1,
      deltaLabel: 'vs last month',
      trend: sparkline(3, 14, 0.20),
      tone: 'negative',
      icon: 'x',
      accent: '#EF4444',
    },
    {
      key: 'active_users',
      label: 'Active Users',
      value: 8950,
      formattedValue: '8,950',
      delta: 24.5,
      deltaLabel: 'vs last month',
      trend: sparkline(280, 14, 0.22),
      tone: 'positive',
      icon: 'users',
      accent: '#0A0A0A',
    },
    {
      key: 'new_users',
      label: 'New Users',
      value: 412,
      formattedValue: '412',
      delta: 31.2,
      deltaLabel: 'vs last month',
      trend: sparkline(14, 14, 0.30),
      tone: 'positive',
      icon: 'user-plus',
      accent: '#3B82F6',
    },
    {
      key: 'wallet_issued',
      label: 'Wallet Balance Issued',
      value: 142500,
      formattedValue: '₹1,42,500',
      delta: 7.4,
      deltaLabel: 'vs last month',
      trend: sparkline(4500, 14, 0.15),
      tone: 'positive',
      icon: 'wallet',
      accent: '#8B5CF6',
    },
    {
      key: 'coupons_used',
      label: 'Coupons Used',
      value: 318,
      formattedValue: '318',
      delta: 4.8,
      deltaLabel: 'vs last month',
      trend: sparkline(10, 14, 0.20),
      tone: 'positive',
      icon: 'ticket',
      accent: '#EC4899',
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Sales trend (30-day)                                                */
/* ------------------------------------------------------------------ */

export function getSalesTrend(days = 30): SalesPoint[] {
  const out: SalesPoint[] = [];
  const today = new Date('2026-08-03T00:00:00');
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const base = isWeekend ? 22000 : 28000;
    const revenue = Math.round(base + (rng() - 0.4) * 12000);
    const orders = Math.round(revenue / 4500 + rng() * 8);
    const visitors = Math.round(orders * (8 + rng() * 4));
    const conversion = Math.round((orders / visitors) * 1000) / 10;
    out.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      revenue,
      orders,
      visitors,
      conversion,
    });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Order status breakdown                                              */
/* ------------------------------------------------------------------ */

export function getOrderStatusBreakdown(): OrderStatusBreakdown[] {
  const raw = [
    { status: 'Delivered', count: 1184, color: '#10B981' },
    { status: 'Pending', count: 87, color: '#F59E0B' },
    { status: 'Shipped', count: 68, color: '#3B82F6' },
    { status: 'Cancelled', count: 47, color: '#EF4444' },
    { status: 'Returned', count: 34, color: '#8B5CF6' },
  ];
  const total = raw.reduce((s, x) => s + x.count, 0);
  return raw.map(x => ({
    ...x,
    percentage: Math.round((x.count / total) * 1000) / 10,
  }));
}

/* ------------------------------------------------------------------ */
/* Top products                                                        */
/* ------------------------------------------------------------------ */

export function getTopProducts(count = 10): TopProduct[] {
  return PRODUCT_NAMES.slice(0, count).map((p, i) => {
    const units = rand(80, 320) - i * 8;
    const price = rand(8999, 24999);
    const trendRoll = rng();
    return {
      rank: i + 1,
      id: `prod-${1000 + i}`,
      name: p.name,
      brand: p.brand,
      sku: p.sku,
      unitsSold: units,
      revenue: units * price,
      stock: rand(0, 120),
      trend: trendRoll > 0.6 ? 'up' : trendRoll > 0.3 ? 'flat' : 'down',
    };
  });
}

/* ------------------------------------------------------------------ */
/* Stock alerts                                                        */
/* ------------------------------------------------------------------ */

export function getStockAlerts(): StockAlert[] {
  const low: StockAlert[] = [];
  const out: StockAlert[] = [];
  const sample = [...PRODUCT_NAMES].sort(() => rng() - 0.5).slice(0, 12);
  sample.forEach((p, i) => {
    const stock = rand(0, 12);
    if (stock === 0) {
      out.push({
        id: `stk-${i}`,
        name: p.name,
        brand: p.brand,
        sku: p.sku,
        stock: 0,
        threshold: 5,
        status: 'out',
        category: 'Sneakers',
      });
    } else if (stock <= 5) {
      low.push({
        id: `stk-${i}`,
        name: p.name,
        brand: p.brand,
        sku: p.sku,
        stock,
        threshold: 5,
        status: 'low',
        category: 'Sneakers',
      });
    }
  });
  return [...out, ...low].slice(0, 10);
}

/* ------------------------------------------------------------------ */
/* Traffic sources                                                     */
/* ------------------------------------------------------------------ */

export function getTrafficSources(): TrafficSource[] {
  const raw = [
    { source: 'Direct', visitors: 2840, color: '#0A0A0A' },
    { source: 'Organic Search', visitors: 4120, color: '#3B82F6' },
    { source: 'Instagram', visitors: 1980, color: '#EC4899' },
    { source: 'Google Ads', visitors: 1420, color: '#10B981' },
    { source: 'Referral', visitors: 760, color: '#F59E0B' },
    { source: 'WhatsApp', visitors: 580, color: '#8B5CF6' },
  ];
  const total = raw.reduce((s, x) => s + x.visitors, 0);
  return raw.map(x => ({
    ...x,
    percentage: Math.round((x.visitors / total) * 1000) / 10,
  }));
}

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export function getAdminNotifications(): AdminNotification[] {
  const now = Date.now();
  return [
    {
      id: 'n1', type: 'order', severity: 'success',
      title: 'New order #LNK-2841',
      message: '₹18,999 — Travis Scott x Jordan 1 Low Mocha',
      timestamp: now - 2 * 60 * 1000, read: false, link: '/orders-management',
    },
    {
      id: 'n2', type: 'stock', severity: 'critical',
      title: 'Out of stock alert',
      message: 'Nike Dunk Low Panda — 0 units remaining',
      timestamp: now - 18 * 60 * 1000, read: false, link: '/dashboard',
    },
    {
      id: 'n3', type: 'review', severity: 'info',
      title: 'New 5★ review pending approval',
      message: 'Yeezy Boost 350 V2 Zebra — "Fire colorway!"',
      timestamp: now - 45 * 60 * 1000, read: false, link: '/dashboard',
    },
    {
      id: 'n4', type: 'customer', severity: 'warning',
      title: 'High-value customer complaint',
      message: 'Order #LNK-2798 — delivery delay reported',
      timestamp: now - 2 * 60 * 60 * 1000, read: true, link: '/orders-management',
    },
    {
      id: 'n5', type: 'system', severity: 'info',
      title: 'Sitemap auto-generated',
      message: '42 product pages added to sitemap.xml',
      timestamp: now - 5 * 60 * 60 * 1000, read: true,
    },
    {
      id: 'n6', type: 'security', severity: 'warning',
      title: 'New admin login',
      message: 'Operations Manager signed in from Chrome / Mumbai',
      timestamp: now - 8 * 60 * 60 * 1000, read: true,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Live-update delta (small numbers added on each tick)                */
/* ------------------------------------------------------------------ */

export function getLiveDelta(): {
  sales: number; orders: number; users: number; notifications: number;
} {
  return {
    sales: rand(2500, 12000),
    orders: rand(0, 3),
    users: rand(0, 5),
    notifications: rng() > 0.7 ? 1 : 0,
  };
}
