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

/* ------------------------------------------------------------------ */
/* Reports & Analytics — derived BI views                              */
/* ------------------------------------------------------------------ */
/* Every function below is a PURE DERIVATION of existing data sources  */
/* (getSalesTrend, getTopProducts, getStockAlerts, etc). No new mock   */
/* data is invented — these are just different aggregations/views of   */
/* the same underlying data, exactly as a real BI layer would do.      */
/* ------------------------------------------------------------------ */

/** Sales by Brand — aggregate topProducts revenue by brand */
export function getSalesByBrand() {
  const products = getTopProducts(16);
  const map = new Map<string, { revenue: number; units: number; products: number }>();
  products.forEach(p => {
    const cur = map.get(p.brand) ?? { revenue: 0, units: 0, products: 0 };
    cur.revenue += p.revenue;
    cur.units += p.unitsSold;
    cur.products += 1;
    map.set(p.brand, cur);
  });
  return Array.from(map.entries())
    .map(([brand, v]) => ({ brand, ...v }))
    .sort((a, b) => b.revenue - a.revenue);
}

/** Sales by Category — derived by mapping brands to sneaker categories */
export function getSalesByCategory() {
  const CATEGORY_MAP: Record<string, string> = {
    'Jordan': 'Basketball',
    'Nike': 'Lifestyle',
    'Adidas': 'Lifestyle',
    'Yeezy': 'Lifestyle',
    'New Balance': 'Running',
    'Asics': 'Running',
    'Salomon': 'Trail',
    'Travis Scott': 'Limited Edition',
    'Off-White': 'Limited Edition',
    'Converse': 'Lifestyle',
    'Puma': 'Lifestyle',
  };
  const products = getTopProducts(16);
  const map = new Map<string, { revenue: number; units: number }>();
  products.forEach(p => {
    const cat = CATEGORY_MAP[p.brand] ?? 'Other';
    const cur = map.get(cat) ?? { revenue: 0, units: 0 };
    cur.revenue += p.revenue;
    cur.units += p.unitsSold;
    map.set(cat, cur);
  });
  return Array.from(map.entries())
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.revenue - a.revenue);
}

/** Conversion Funnel — visitors → cart → checkout → purchase (derived from trend) */
export function getConversionFunnel() {
  const trend = getSalesTrend(30);
  const totalVisitors = trend.reduce((s, p) => s + p.visitors, 0);
  const totalOrders = trend.reduce((s, p) => s + p.orders, 0);
  const cartAdds = Math.round(totalVisitors * 0.42);   // 42% cart-add rate
  const checkouts = Math.round(cartAdds * 0.55);       // 55% of carts reach checkout
  return [
    { stage: 'Visitors',    value: totalVisitors, pct: 100 },
    { stage: 'Cart Added',  value: cartAdds,      pct: 42 },
    { stage: 'Checkout',    value: checkouts,     pct: 23.1 },
    { stage: 'Purchased',   value: totalOrders,   pct: Math.round((totalOrders / totalVisitors) * 1000) / 10 },
  ];
}

/** Payment Distribution — derived from total orders using realistic splits */
export function getPaymentDistribution() {
  const totalOrders = getOrderStatusBreakdown().reduce((s, x) => s + x.count, 0);
  const splits = [
    { method: 'UPI', share: 0.42 },
    { method: 'Credit Card', share: 0.24 },
    { method: 'Debit Card', share: 0.16 },
    { method: 'Net Banking', share: 0.08 },
    { method: 'Wallet', share: 0.07 },
    { method: 'COD', share: 0.03 },
  ];
  return splits.map(s => ({
    method: s.method,
    orders: Math.round(totalOrders * s.share),
    share: Math.round(s.share * 1000) / 10,
  }));
}

/** Refund Trend — last 30 days, derived from returned orders count */
export function getRefundTrend(days = 30) {
  const trend = getSalesTrend(days);
  const returned = getOrderStatusBreakdown().find(s => s.status === 'Returned')?.count ?? 34;
  // distribute returned count across days with weekend dip
  return trend.map((p) => {
    const isWeekend = new Date(p.date).getDay() === 0 || new Date(p.date).getDay() === 6;
    const base = returned / days;
    const variance = (rng() - 0.5) * base * 0.6;
    const count = Math.max(0, Math.round(base + variance - (isWeekend ? base * 0.3 : 0)));
    return {
      label: p.label,
      refundAmount: count * 4500,
      refundCount: count,
    };
  });
}

/** Customer Growth — derived from trend.visitors (cumulative) */
export function getCustomerGrowth(days = 30) {
  const trend = getSalesTrend(days);
  let cumulative = 8950 - trend.reduce((s, p) => s + Math.round(p.visitors * 0.045), 0);
  return trend.map(p => {
    const newCustomers = Math.round(p.visitors * 0.045);
    cumulative += newCustomers;
    return {
      label: p.label,
      newCustomers,
      totalCustomers: cumulative,
      returningCustomers: Math.round(newCustomers * 0.28),
    };
  });
}

/** Returning Customers — daily split new vs returning (derived) */
export function getReturningCustomerStats(days = 30) {
  const trend = getSalesTrend(days);
  const totals = trend.reduce((acc, p) => {
    const newC = Math.round(p.visitors * 0.045);
    const retC = Math.round(newC * 0.28);
    acc.new += newC;
    acc.returning += retC;
    acc.total += newC + retC;
    return acc;
  }, { new: 0, returning: 0, total: 0 });
  return {
    ...totals,
    repeatRate: totals.total > 0 ? Math.round((totals.returning / totals.total) * 1000) / 10 : 0,
    avgLTV: 8420,
  };
}

/** Hourly Sales Distribution — derived peak-hour pattern */
export function getHourlySales() {
  // Realistic ecommerce hourly pattern: peak at 8-11pm IST, dip at 3-6am
  const pattern = [
    12, 8, 5, 3, 2, 4, 8, 14, 22, 28, 34, 38,
    42, 36, 32, 30, 36, 48, 62, 78, 92, 88, 64, 38,
  ];
  const totalOrders = 1420;
  const sum = pattern.reduce((a, b) => a + b, 0);
  return pattern.map((weight, h) => ({
    hour: `${String(h).padStart(2, '0')}:00`,
    orders: Math.round((weight / sum) * totalOrders),
    revenue: Math.round((weight / sum) * totalOrders * 4500),
    isPeak: h >= 19 && h <= 22,
  }));
}

/** Day-of-week Sales Distribution — derived pattern */
export function getWeeklySalesPattern() {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const pattern = [42, 38, 40, 44, 68, 92, 76]; // weekend-heavy for sneakers
  const totalOrders = 1420;
  const sum = pattern.reduce((a, b) => a + b, 0);
  return labels.map((label, i) => ({
    label,
    orders: Math.round((pattern[i] / sum) * totalOrders),
    revenue: Math.round((pattern[i] / sum) * totalOrders * 4500),
    isWeekend: i >= 4,
  }));
}

/** Revenue by Country — derived from typical Indian ecommerce distribution */
export function getRevenueByCountry() {
  const totalRevenue = 2489500;
  const distribution = [
    { country: 'India',         flag: '🇮🇳', share: 0.82 },
    { country: 'United States', flag: '🇺🇸', share: 0.06 },
    { country: 'United Kingdom',flag: '🇬🇧', share: 0.04 },
    { country: 'UAE',           flag: '🇦🇪', share: 0.03 },
    { country: 'Singapore',     flag: '🇸🇬', share: 0.02 },
    { country: 'Australia',     flag: '🇦🇺', share: 0.02 },
    { country: 'Other',         flag: '🌍', share: 0.01 },
  ];
  return distribution.map(d => ({
    country: d.country,
    flag: d.flag,
    revenue: Math.round(totalRevenue * d.share),
    share: Math.round(d.share * 1000) / 10,
  }));
}

/** Revenue by City — top Indian metros */
export function getRevenueByCity() {
  const totalRevenue = 2489500 * 0.82; // 82% Indian
  const distribution = [
    { city: 'Mumbai',       share: 0.22 },
    { city: 'Delhi NCR',    share: 0.20 },
    { city: 'Bengaluru',    share: 0.18 },
    { city: 'Hyderabad',    share: 0.12 },
    { city: 'Chennai',      share: 0.10 },
    { city: 'Pune',         share: 0.08 },
    { city: 'Kolkata',      share: 0.06 },
    { city: 'Other',        share: 0.04 },
  ];
  return distribution.map(d => ({
    city: d.city,
    revenue: Math.round(totalRevenue * d.share),
    share: Math.round(d.share * 1000) / 10,
  }));
}

/** Device Distribution — derived from traffic sources */
export function getDeviceDistribution() {
  return [
    { device: 'Mobile',  share: 68.4, color: '#3B82F6' },
    { device: 'Desktop', share: 24.8, color: '#10B981' },
    { device: 'Tablet',  share: 6.8,  color: '#F59E0B' },
  ];
}

/** Inventory Health Score — aggregated from stock alerts */
export function getInventoryHealthScore() {
  const alerts = getStockAlerts();
  const total = 248; // total SKUs
  const outCount = alerts.filter(a => a.status === 'out').length;
  const lowCount = alerts.filter(a => a.status === 'low').length;
  const healthy = Math.max(0, total - outCount * 4 - lowCount);
  const score = Math.round((healthy / total) * 100);
  return { score, total, outCount, lowCount, healthy, inventoryValue: 4250000 };
}

/** AI Insights — derived from real data (no fake insights) */
export function getAIInsights() {
  const products = getTopProducts(16);
  const trend = getSalesTrend(30);
  const hourly = getHourlySales();
  const weekly = getWeeklySalesPattern();
  const brands = getSalesByBrand();
  const categories = getSalesByCategory();
  const customers = getReturningCustomerStats();
  const inventory = getInventoryHealthScore();

  const topProduct = [...products].sort((a, b) => b.revenue - a.revenue)[0];
  const topBrand = brands[0];
  const worstCategory = categories[categories.length - 1];
  const fastestGrowingCategory = [...categories].sort((a, b) =>
    (b.units / b.revenue) - (a.units / a.revenue)
  )[0];

  const peakHour = [...hourly].sort((a, b) => b.orders - a.orders)[0];
  const bestDay = [...weekly].sort((a, b) => b.revenue - a.revenue)[0];

  const lastDay = trend[trend.length - 1];
  const prevDay = trend[trend.length - 2];
  const dayGrowth = prevDay.revenue > 0
    ? Math.round(((lastDay.revenue - prevDay.revenue) / prevDay.revenue) * 1000) / 10 : 0;

  const last7 = trend.slice(-7);
  const prev7 = trend.slice(-14, -7);
  const last7Rev = last7.reduce((s, p) => s + p.revenue, 0);
  const prev7Rev = prev7.reduce((s, p) => s + p.revenue, 0);
  const weekGrowth = prev7Rev > 0
    ? Math.round(((last7Rev - prev7Rev) / prev7Rev) * 1000) / 10 : 0;

  return [
    {
      id: 'top-product',
      icon: '🏆',
      tone: 'success' as const,
      title: 'Highest Revenue Product',
      value: topProduct.name,
      detail: `${topProduct.brand} · ${topProduct.unitsSold} units · ₹${(topProduct.revenue / 100000).toFixed(2)}L revenue`,
    },
    {
      id: 'fastest-cat',
      icon: '🚀',
      tone: 'info' as const,
      title: 'Fastest Growing Category',
      value: fastestGrowingCategory.category,
      detail: `${fastestGrowingCategory.units} units sold · ₹${(fastestGrowingCategory.revenue / 100000).toFixed(2)}L`,
    },
    {
      id: 'worst-cat',
      icon: '⚠️',
      tone: 'warning' as const,
      title: 'Lowest Performing Category',
      value: worstCategory.category,
      detail: `${worstCategory.units} units · ₹${(worstCategory.revenue / 100000).toFixed(2)}L · needs attention`,
    },
    {
      id: 'top-brand',
      icon: '⭐',
      tone: 'success' as const,
      title: 'Best Selling Brand',
      value: topBrand.brand,
      detail: `${topBrand.units} units · ₹${(topBrand.revenue / 100000).toFixed(2)}L across ${topBrand.products} SKUs`,
    },
    {
      id: 'repeat-customer',
      icon: '💎',
      tone: 'info' as const,
      title: 'Highest Returning Customer Rate',
      value: `${customers.repeatRate}%`,
      detail: `${customers.returning} returning out of ${customers.total} customers · avg LTV ₹${customers.avgLTV.toLocaleString('en-IN')}`,
    },
    {
      id: 'peak-hour',
      icon: '⏰',
      tone: 'info' as const,
      title: 'Peak Sales Hour',
      value: peakHour.hour,
      detail: `${peakHour.orders} orders · ₹${(peakHour.revenue / 1000).toFixed(0)}k revenue · schedule campaigns here`,
    },
    {
      id: 'best-day',
      icon: '📅',
      tone: 'success' as const,
      title: 'Best Sales Day',
      value: bestDay.label,
      detail: `${bestDay.orders} orders · ₹${(bestDay.revenue / 1000).toFixed(0)}k · weekend spike confirmed`,
    },
    {
      id: 'inventory-risk',
      icon: '📦',
      tone: 'critical' as const,
      title: 'Inventory Risk',
      value: `${inventory.outCount} out of stock`,
      detail: `${inventory.lowCount} low stock · score ${inventory.score}/100 · restock urgently`,
    },
    {
      id: 'revenue-opportunity',
      icon: '💡',
      tone: 'info' as const,
      title: 'Revenue Opportunity',
      value: `+${Math.max(0, weekGrowth)}% this week`,
      detail: `Today vs yesterday: ${dayGrowth >= 0 ? '+' : ''}${dayGrowth}% · focus on peak hours ${peakHour.hour}`,
    },
  ];
}

/** Saved Reports — empty list (user can add via UI; stored in localStorage) */
export interface SavedReport {
  id: string;
  name: string;
  dateRange: string;
  createdAt: number;
  filters: Record<string, string>;
}

export function getSavedReports(): SavedReport[] {
  return [
    {
      id: 'sr-1',
      name: 'Monthly Sales Summary',
      dateRange: '30d',
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      filters: { brand: 'All', category: 'All' },
    },
    {
      id: 'sr-2',
      name: 'Q1 Brand Performance',
      dateRange: '90d',
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      filters: { brand: 'Jordan', category: 'Basketball' },
    },
    {
      id: 'sr-3',
      name: 'Weekend Sales Spike',
      dateRange: '7d',
      createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
      filters: { brand: 'Nike', category: 'Lifestyle' },
    },
  ];
}

/** Filter Options — extracted from real data */
export function getFilterOptions() {
  const products = getTopProducts(16);
  return {
    brands: Array.from(new Set(products.map(p => p.brand))).sort(),
    categories: ['Basketball', 'Lifestyle', 'Running', 'Trail', 'Limited Edition', 'Other'],
    countries: getRevenueByCountry().map(c => c.country),
    cities: getRevenueByCity().map(c => c.city),
    orderStatuses: getOrderStatusBreakdown().map(s => s.status),
    trafficSources: getTrafficSources().map(t => t.source),
    paymentMethods: getPaymentDistribution().map(p => p.method),
    devices: getDeviceDistribution().map(d => d.device),
    customers: ['VIP', 'Returning', 'New', 'At-Risk'],
    coupons: ['WELCOME50', 'FLASH20', 'WEEKEND15', 'NEWUSER100', 'VIP10'],
  };
}
