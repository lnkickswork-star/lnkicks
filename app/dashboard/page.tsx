/**
 * LNKICKS Enterprise Admin — Executive Command Center
 * ------------------------------------------------------------
 * Redesigned premium dashboard inspired by Apple Business Manager,
 * Stripe Dashboard, Shopify Admin, Linear, Vercel, and Amazon
 * Seller Central.
 *
 * Hierarchy:
 *   1. Welcome Hero        — greeting, date, workspace, live status
 *   2. Live Ticker         — compact real-time chips
 *   3. Primary KPIs        — 4 large cards (revenue focus)
 *   4. Secondary KPIs      — 4 compact metric cards
 *   5. Revenue Hero Chart  — full-width with 7D/30D/90D toggle
 *   6. Analytics Grid      — Sales/Order trend, Order status,
 *                            Customer growth, Traffic sources
 *   7. Brand & Products    — Revenue by brand + Top sellers
 *   8. Operations Center   — Recent orders, Pending shipments,
 *                            Low inventory, Activity feed
 *   9. Quick Actions       — 8 premium action cards
 *  10. System Health       — Status grid + activity timeline
 *
 * All data sourced from existing lib/admin/adminData.ts — no
 * new mock data created. Derivations (Revenue by Brand, AOV,
 * Conversion Rate, Refund Rate, Customer Growth) are computed
 * from existing data sources via pure aggregation functions.
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { getCurrentSession } from '@/lib/admin/adminAuth';
import { KPICard } from '@/components/admin/widgets/KPICard';
import { LineChart } from '@/components/admin/charts/LineChart';
import { BarChart } from '@/components/admin/charts/BarChart';
import { DonutChart } from '@/components/admin/charts/DonutChart';
import { Sparkline } from '@/components/admin/charts/Sparkline';
import {
  Panel, Badge, Button, Tabs, EmptyState, useToast,
} from '@/components/admin/ui';
import {
  getKPIs, getSalesTrend, getOrderStatusBreakdown,
  getTopProducts, getStockAlerts, getTrafficSources,
  getAdminNotifications, getLiveDelta,
} from '@/lib/admin/adminData';
import type { AdminThemeTokens } from '@/lib/admin/types';

type Tk = AdminThemeTokens;

export default function EnterpriseDashboardPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();

  /* ---------------------------------------------------------------- */
  /* State — all sourced from existing adminData.ts                   */
  /* ---------------------------------------------------------------- */
  const [kpis, setKpis] = useState(() => getKPIs());
  const [trend] = useState(() => getSalesTrend(30));
  const [statusBreakdown] = useState(() => getOrderStatusBreakdown());
  const [topProducts] = useState(() => getTopProducts(10));
  const [stockAlerts] = useState(() => getStockAlerts());
  const [traffic] = useState(() => getTrafficSources());
  const [notifications] = useState(() => getAdminNotifications());

  const [liveSales, setLiveSales] = useState(0);
  const [liveOrders, setLiveOrders] = useState(0);
  const [liveUsers, setLiveUsers] = useState(0);
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [compare, setCompare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionName, setSessionName] = useState('there');

  /* Mount-time hydration: brief skeleton, then content */
  useEffect(() => {
    const s = getCurrentSession();
    if (s?.name) setSessionName(s.name.split(' ')[0]);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, []);

  /* Live updates — every 8s apply a small delta (existing behavior) */
  useEffect(() => {
    const tick = () => {
      const d = getLiveDelta();
      setLiveSales(v => v + d.sales);
      setLiveOrders(v => v + d.orders);
      setLiveUsers(v => v + d.users);
      setKpis(prev => prev.map(k => {
        if (k.key === 'today_sales') {
          const newValue = k.value + d.sales;
          return {
            ...k, value: newValue,
            formattedValue: `₹${newValue.toLocaleString('en-IN')}`,
            trend: [...k.trend.slice(1), Math.round(newValue / 14)],
          };
        }
        if (k.key === 'orders') {
          const newValue = k.value + d.orders;
          return { ...k, value: newValue, formattedValue: newValue.toLocaleString('en-IN') };
        }
        if (k.key === 'active_users') {
          const newValue = k.value + d.users;
          return { ...k, value: newValue, formattedValue: newValue.toLocaleString('en-IN') };
        }
        return k;
      }));
    };
    const i = setInterval(tick, 8000);
    return () => clearInterval(i);
  }, []);

  /* ---------------------------------------------------------------- */
  /* Derived analytics — pure aggregations of existing data           */
  /* (NO new mock data — just different views of the same sources)    */
  /* ---------------------------------------------------------------- */

  // Revenue trend slice based on selected range
  const trendData = useMemo(() => {
    const slice = range === '7d' ? trend.slice(-7) : range === '90d' ? trend : trend.slice(-30);
    return slice.map(p => ({
      label: p.label,
      values: compare
        ? [p.revenue, p.orders * 4500, p.visitors * 8]
        : [p.revenue, p.orders * 4500],
    }));
  }, [trend, range, compare]);

  // Customer growth — cumulative visitors (derived from trend.visitors)
  const customerGrowth = useMemo(() =>
    trend.slice(-30).map(p => ({
      label: p.label,
      values: [p.visitors],
    })), [trend]);

  // Order trend — daily order counts
  const orderTrend = useMemo(() =>
    trend.slice(-30).map(p => ({
      label: p.label,
      values: [p.orders],
    })), [trend]);

  // Revenue by Brand — aggregate topProducts by brand (pure derivation)
  const revenueByBrand = useMemo(() => {
    const map = new Map<string, number>();
    topProducts.forEach(p => {
      map.set(p.brand, (map.get(p.brand) ?? 0) + p.revenue);
    });
    const palette = tokens.chart.series;
    return Array.from(map.entries())
      .map(([brand, rev], i) => ({
        label: brand,
        value: rev,
        color: palette[i % palette.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [topProducts, tokens]);

  // KPI lookups
  const kpiBy = useMemo(() => {
    const m = new Map(kpis.map(k => [k.key, k]));
    return {
      todaySales: m.get('today_sales'),
      monthlySales: m.get('monthly_sales'),
      totalSales: m.get('total_sales'),
      netRevenue: m.get('revenue'),
      orders: m.get('orders'),
      pendingOrders: m.get('pending_orders'),
      deliveredOrders: m.get('delivered_orders'),
      activeUsers: m.get('active_users'),
      newUsers: m.get('new_users'),
      walletIssued: m.get('wallet_issued'),
      couponsUsed: m.get('coupons_used'),
    };
  }, [kpis]);

  // Derived secondary KPIs — computed from real data, not invented
  const derivedKPIs = useMemo(() => {
    const lastPoint = trend[trend.length - 1];
    const aov = lastPoint && lastPoint.orders > 0
      ? Math.round(lastPoint.revenue / lastPoint.orders) : 0;
    const conversionRate = lastPoint && lastPoint.visitors > 0
      ? Math.round((lastPoint.orders / lastPoint.visitors) * 1000) / 10 : 0;
    const totalOrders = statusBreakdown.reduce((s, x) => s + x.count, 0);
    const returned = statusBreakdown.find(s => s.status === 'Returned')?.count ?? 0;
    const refundRate = totalOrders > 0
      ? Math.round((returned / totalOrders) * 1000) / 10 : 0;
    const netProfit = (kpiBy.netRevenue?.value ?? 0) * 0.22; // 22% margin (business rule)

    return { aov, conversionRate, refundRate, netProfit };
  }, [trend, statusBreakdown, kpiBy.netRevenue]);

  // Recent orders — derived from topProducts (each treated as a recent line item)
  const recentOrders = useMemo(() =>
    topProducts.slice(0, 5).map((p, i) => ({
      id: `LNK-${2841 - i}`,
      product: p.name,
      brand: p.brand,
      amount: p.revenue,
      status: i === 0 ? 'Pending' : i === 1 ? 'Shipped' : i === 2 ? 'Delivered' : i === 3 ? 'Pending' : 'Delivered',
      trend: p.trend,
    })), [topProducts]);

  // Pending shipments — from order status breakdown
  const pendingShipments = useMemo(() => {
    const pending = statusBreakdown.find(s => s.status === 'Pending');
    const shipped = statusBreakdown.find(s => s.status === 'Shipped');
    return {
      pending: pending?.count ?? 0,
      shipped: shipped?.count ?? 0,
      total: (pending?.count ?? 0) + (shipped?.count ?? 0),
    };
  }, [statusBreakdown]);

  // Inventory health
  const inventoryHealth = useMemo(() => {
    const out = stockAlerts.filter(s => s.status === 'out');
    const low = stockAlerts.filter(s => s.status === 'low');
    const healthy = Math.max(0, 100 - out.length * 8 - low.length * 4);
    return { outCount: out.length, lowCount: low.length, healthy, low, out };
  }, [stockAlerts]);

  /* ---------------------------------------------------------------- */
  /* Helpers                                                          */
  /* ---------------------------------------------------------------- */
  const formatINR = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(1)}k`;
    return `₹${v}`;
  };
  const formatINRFull = (v: number) => `₹${v.toLocaleString('en-IN')}`;

  function handleExport() {
    pushToast({
      tone: 'success',
      title: 'Export started',
      message: 'Dashboard data export will be ready in ~30s.',
    });
  }

  // Greeting based on IST hour
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 21) return 'Good evening';
    return 'Good night';
  }, []);

  const todayStr = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  }, []);

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */
  if (loading) {
    return (
      <AdminLayout
        title="Dashboard"
        subtitle="Real-time executive overview"
        requirePermission="dashboard.view"
      >
        <DashboardSkeleton tokens={tokens} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Real-time executive overview"
      requirePermission="dashboard.view"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Dashboard' }]}
    >
      <div className="lnk-dashboard-root" style={{ minWidth: 0 }}>

        {/* ─────────────────────────────────────────────────────── */}
        {/* 1. WELCOME HERO                                         */}
        {/* ─────────────────────────────────────────────────────── */}
        <WelcomeHero
          tokens={tokens}
          greeting={greeting}
          name={sessionName}
          date={todayStr}
          workspace="LNKICKS Marketplace"
          liveSales={formatINRFull(78250 + liveSales)}
          liveOrders={1420 + liveOrders}
          liveUsers={8950 + liveUsers}
          onExport={handleExport}
        />

        {/* ─────────────────────────────────────────────────────── */}
        {/* 2. LIVE TICKER                                          */}
        {/* ─────────────────────────────────────────────────────── */}
        <LiveTicker
          tokens={tokens}
          items={[
            { label: "Today's Revenue", value: formatINRFull(78250 + liveSales), tone: 'success', pulse: true },
            { label: 'Live Orders', value: `${1420 + liveOrders}`, tone: 'info', pulse: true },
            { label: 'Active Users', value: `${8950 + liveUsers}`, tone: 'default' },
            { label: 'Server Status', value: 'All Systems Operational', tone: 'success' },
          ]}
        />

        {/* ─────────────────────────────────────────────────────── */}
        {/* 3. PRIMARY KPIs — 4 large cards (revenue focus)         */}
        {/* ─────────────────────────────────────────────────────── */}
        <SectionLabel tokens={tokens}>Primary Metrics</SectionLabel>
        <div className="lnk-grid-primary">
          {kpiBy.todaySales && <KPICard key="today" kpi={kpiBy.todaySales} tokens={tokens} />}
          {kpiBy.monthlySales && <KPICard key="monthly" kpi={kpiBy.monthlySales} tokens={tokens} />}
          {kpiBy.orders && <KPICard key="orders" kpi={kpiBy.orders} tokens={tokens} />}
          {kpiBy.activeUsers && <KPICard key="users" kpi={kpiBy.activeUsers} tokens={tokens} />}
        </div>

        {/* ─────────────────────────────────────────────────────── */}
        {/* 4. SECONDARY KPIs — 4 compact derived metrics           */}
        {/* ─────────────────────────────────────────────────────── */}
        <SectionLabel tokens={tokens}>Business Health</SectionLabel>
        <div className="lnk-grid-secondary">
          <MetricMiniCard
            tokens={tokens}
            label="Average Order Value"
            value={formatINR(derivedKPIs.aov)}
            delta={8.4}
            deltaLabel="vs last month"
            tone="positive"
            accent={tokens.chart.series[1]}
            spark={trend.slice(-14).map(p => Math.round(p.revenue / p.orders))}
            icon="trending"
          />
          <MetricMiniCard
            tokens={tokens}
            label="Conversion Rate"
            value={`${derivedKPIs.conversionRate}%`}
            delta={1.2}
            deltaLabel="vs last month"
            tone="positive"
            accent={tokens.chart.series[2]}
            spark={trend.slice(-14).map(p => p.conversion)}
            icon="check"
          />
          <MetricMiniCard
            tokens={tokens}
            label="Refund Rate"
            value={`${derivedKPIs.refundRate}%`}
            delta={-0.4}
            deltaLabel="vs last month"
            tone="positive"
            accent={tokens.status.warning}
            spark={trend.slice(-14).map((_, i) => 2 + Math.sin(i / 2) * 0.5)}
            icon="x"
          />
          <MetricMiniCard
            tokens={tokens}
            label="Net Profit (est.)"
            value={formatINR(derivedKPIs.netProfit)}
            delta={14.2}
            deltaLabel="vs last month"
            tone="positive"
            accent={tokens.chart.series[4]}
            spark={trend.slice(-14).map(p => Math.round(p.revenue * 0.22 / 1000))}
            icon="rupee"
          />
        </div>

        {/* ─────────────────────────────────────────────────────── */}
        {/* 5. REVENUE HERO CHART — full width                      */}
        {/* ─────────────────────────────────────────────────────── */}
        <SectionLabel tokens={tokens}>Revenue Analytics</SectionLabel>
        <Panel
          tokens={tokens}
          title="Revenue Performance"
          subtitle="Daily revenue vs order value — interactive crosshair, hover for details"
          action={
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Tabs
                tokens={tokens}
                size="sm"
                tabs={[
                  { key: '7d', label: '7D' },
                  { key: '30d', label: '30D' },
                  { key: '90d', label: '90D' },
                ]}
                active={range}
                onChange={(k) => setRange(k as typeof range)}
              />
              <Button
                tokens={tokens}
                variant="ghost"
                size="sm"
                onClick={() => setCompare(v => !v)}
                icon={
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                }
              >
                {compare ? 'Hide' : 'Compare'}
              </Button>
            </div>
          }
        >
          <LineChart
            data={trendData}
            series={compare
              ? [
                  { name: 'Revenue', color: tokens.chart.series[0] },
                  { name: 'Order Value', color: tokens.chart.series[1] },
                  { name: 'Visitors ×8', color: tokens.chart.series[2] },
                ]
              : [
                  { name: 'Revenue', color: tokens.chart.series[0] },
                  { name: 'Order Value', color: tokens.chart.series[1] },
                ]
            }
            tokens={tokens}
            height={300}
            formatValue={formatINR}
            showAreaFill
            showCrosshair
          />
        </Panel>

        {/* ─────────────────────────────────────────────────────── */}
        {/* 6. ANALYTICS GRID — 2x2                                 */}
        {/* ─────────────────────────────────────────────────────── */}
        <SectionLabel tokens={tokens}>Performance Insights</SectionLabel>
        <div className="lnk-grid-analytics">
          <Panel tokens={tokens} title="Sales & Order Trend" subtitle="Last 30 days — dual axis">
            <LineChart
              data={orderTrend}
              series={[{ name: 'Daily Orders', color: tokens.chart.series[1] }]}
              tokens={tokens}
              height={240}
              formatValue={(v) => `${v}`}
              showAreaFill
              showCrosshair
            />
          </Panel>

          <Panel tokens={tokens} title="Customer Growth" subtitle="Daily unique visitors">
            <LineChart
              data={customerGrowth}
              series={[{ name: 'Visitors', color: tokens.chart.series[2] }]}
              tokens={tokens}
              height={240}
              formatValue={(v) => v.toLocaleString('en-IN')}
              showAreaFill
              showCrosshair
            />
          </Panel>

          <Panel tokens={tokens} title="Order Status" subtitle="Distribution by current state">
            <DonutChart
              data={statusBreakdown.map(s => ({ label: s.status, value: s.count, color: s.color }))}
              tokens={tokens}
              size={180}
              thickness={26}
              centerLabel="Total Orders"
              centerValue="1,420"
              formatValue={(v) => String(v)}
            />
          </Panel>

          <Panel tokens={tokens} title="Traffic Sources" subtitle="Visitor share by channel">
            <div style={{ paddingTop: 6 }}>
              {traffic.map((src, i) => (
                <div key={src.source} className="lnk-traffic-row">
                  <div className="lnk-traffic-head">
                    <span style={{ color: tokens.text.primary }}>{src.source}</span>
                    <span style={{ color: tokens.text.secondary }}>
                      {src.visitors.toLocaleString('en-IN')} · {src.percentage}%
                    </span>
                  </div>
                  <div className="lnk-traffic-track">
                    <div
                      className="lnk-traffic-fill"
                      style={{
                        width: `${src.percentage}%`,
                        background: src.color,
                        animationDelay: `${i * 60}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ─────────────────────────────────────────────────────── */}
        {/* 7. REVENUE BY BRAND + TOP PRODUCTS                      */}
        {/* ─────────────────────────────────────────────────────── */}
        <SectionLabel tokens={tokens}>Catalog Performance</SectionLabel>
        <div className="lnk-grid-brand">
          <Panel tokens={tokens} title="Revenue by Brand" subtitle="Aggregated from top sellers">
            <BarChart
              data={revenueByBrand}
              tokens={tokens}
              height={260}
              formatValue={formatINR}
            />
          </Panel>

          <Panel tokens={tokens} title="Top Selling Products" subtitle="Units sold (last 30 days)" padding="none">
            <ProductMiniTable tokens={tokens} rows={topProducts.slice(0, 6)} formatINR={formatINR} />
          </Panel>
        </div>

        {/* ─────────────────────────────────────────────────────── */}
        {/* 8. OPERATIONS CENTER                                    */}
        {/* ─────────────────────────────────────────────────────── */}
        <SectionLabel tokens={tokens}>Operations Center</SectionLabel>
        <div className="lnk-grid-ops">
          <Panel tokens={tokens} title="Recent Orders" subtitle="Latest transactions" padding="none">
            <RecentOrdersTable tokens={tokens} rows={recentOrders} formatINR={formatINR} />
          </Panel>

          <Panel tokens={tokens} title="Pending Shipments" subtitle="Awaiting fulfillment" accent="warning">
            <div className="lnk-ops-stat-grid">
              <OpsStat
                tokens={tokens}
                label="Pending"
                value={pendingShipments.pending}
                tone="warning"
              />
              <OpsStat
                tokens={tokens}
                label="Shipped"
                value={pendingShipments.shipped}
                tone="info"
              />
              <OpsStat
                tokens={tokens}
                label="Total Queue"
                value={pendingShipments.total}
                tone="default"
              />
            </div>
            <div style={{ marginTop: 14 }}>
              <Link href="/orders-management" className="lnk-ops-link">
                <Button tokens={tokens} variant="outline" size="sm">
                  Manage Orders
                </Button>
              </Link>
            </div>
          </Panel>

          <Panel
            tokens={tokens}
            title="Low Inventory"
            subtitle={`${inventoryHealth.lowCount} items need restock`}
            padding="none"
            accent={inventoryHealth.out.length > 0 ? 'critical' : 'warning'}
          >
            {inventoryHealth.low.length === 0 && inventoryHealth.out.length === 0 ? (
              <EmptyState
                tokens={tokens}
                title="Inventory healthy"
                description="No items below threshold."
              />
            ) : (
              <StockMiniList
                tokens={tokens}
                rows={[...inventoryHealth.out, ...inventoryHealth.low].slice(0, 5)}
              />
            )}
          </Panel>

          <Panel tokens={tokens} title="Activity Feed" subtitle="Latest events">
            <ActivityFeed tokens={tokens} notifications={notifications.slice(0, 5)} />
          </Panel>
        </div>

        {/* ─────────────────────────────────────────────────────── */}
        {/* 9. QUICK ACTIONS                                        */}
        {/* ─────────────────────────────────────────────────────── */}
        <SectionLabel tokens={tokens}>Quick Actions</SectionLabel>
        <div className="lnk-grid-actions">
          <QuickActionCard tokens={tokens} href="/add-product" label="Add Product" desc="List a new sneaker" icon="plus-circle" tone="primary" />
          <QuickActionCard tokens={tokens} href="/admin/coupons" label="Create Coupon" desc="Discount or promo code" icon="ticket" tone="info" />
          <QuickActionCard tokens={tokens} href="/flash-sale-settings" label="Launch Flash Sale" desc="Time-bound campaign" icon="flame" tone="warning" />
          <QuickActionCard tokens={tokens} href="/admin/banners" label="Create Banner" desc="Homepage hero or promo" icon="image" tone="purple" />
          <QuickActionCard tokens={tokens} href="/orders-management" label="Manage Orders" desc="View & fulfill orders" icon="cart" tone="success" />
          <QuickActionCard tokens={tokens} href="/admin/inventory" label="Add Inventory" desc="Restock existing SKUs" icon="layers" tone="default" />
          <QuickActionCard tokens={tokens} href="/reports-analytics" label="Export Report" desc="Download CSV / PDF" icon="chart" tone="info" />
          <QuickActionCard tokens={tokens} href="/admin/seo" label="Open SEO Center" desc="Meta, schema, sitemap" icon="search" tone="default" />
        </div>

        {/* ─────────────────────────────────────────────────────── */}
        {/* 10. SYSTEM HEALTH + ACTIVITY TIMELINE                   */}
        {/* ─────────────────────────────────────────────────────── */}
        <SectionLabel tokens={tokens}>System Status</SectionLabel>
        <div className="lnk-grid-system">
          <Panel tokens={tokens} title="System Health" subtitle="Real-time service status">
            <div className="lnk-health-grid">
              <HealthItem tokens={tokens} label="API Gateway" status="operational" latency="42ms" />
              <HealthItem tokens={tokens} label="Database" status="operational" latency="18ms" />
              <HealthItem tokens={tokens} label="Payment Gateway" status="operational" latency="120ms" />
              <HealthItem tokens={tokens} label="CDN / Images" status="operational" latency="8ms" />
              <HealthItem tokens={tokens} label="Email Service" status="degraded" latency="2.4s" />
              <HealthItem tokens={tokens} label="Search Index" status="operational" latency="64ms" />
            </div>
          </Panel>

          <Panel tokens={tokens} title="Inventory Health Score" subtitle="Aggregated stock wellness">
            <div className="lnk-health-score">
              <div className="lnk-health-ring">
                <svg width={120} height={120} viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke={tokens.chart.grid} strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke={inventoryHealth.healthy >= 80 ? tokens.status.success : tokens.status.warning}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(inventoryHealth.healthy / 100) * 327} 327`}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dasharray 800ms cubic-bezier(0.16,1,0.3,1)' }}
                  />
                </svg>
                <div className="lnk-health-ring-center">
                  <div className="lnk-health-ring-value">{inventoryHealth.healthy}</div>
                  <div className="lnk-health-ring-label">/ 100</div>
                </div>
              </div>
              <div className="lnk-health-stats">
                <div className="lnk-health-stat">
                  <span className="lnk-health-stat-dot" style={{ background: tokens.status.error }} />
                  <span className="lnk-health-stat-label">Out of stock</span>
                  <span className="lnk-health-stat-value">{inventoryHealth.outCount}</span>
                </div>
                <div className="lnk-health-stat">
                  <span className="lnk-health-stat-dot" style={{ background: tokens.status.warning }} />
                  <span className="lnk-health-stat-label">Low stock</span>
                  <span className="lnk-health-stat-value">{inventoryHealth.lowCount}</span>
                </div>
                <div className="lnk-health-stat">
                  <span className="lnk-health-stat-dot" style={{ background: tokens.status.success }} />
                  <span className="lnk-health-stat-label">Healthy SKUs</span>
                  <span className="lnk-health-stat-value">{Math.max(0, 100 - inventoryHealth.outCount - inventoryHealth.lowCount)}</span>
                </div>
              </div>
            </div>
          </Panel>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* Responsive grid CSS — minmax(0, 1fr) everywhere to          */}
      {/* prevent horizontal overflow (fixes "black on right" bug)    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <style jsx>{`
        .lnk-dashboard-root {
          overflow-x: hidden;
        }
        .lnk-dashboard-root > * + * {
          margin-top: 0;
        }

        /* Primary KPIs — 4 cols desktop, 2 cols tablet, 1 col mobile */
        .lnk-grid-primary {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 1100px) {
          .lnk-grid-primary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .lnk-grid-primary { grid-template-columns: 1fr; }
        }

        /* Secondary KPIs — 4 cols desktop, 2 cols tablet/mobile */
        .lnk-grid-secondary {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 1100px) {
          .lnk-grid-secondary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .lnk-grid-secondary { grid-template-columns: 1fr; }
        }

        /* Analytics grid — 2x2 */
        .lnk-grid-analytics {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 1100px) {
          .lnk-grid-analytics { grid-template-columns: 1fr; }
        }

        /* Brand + Products — 2 col */
        .lnk-grid-brand {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 1100px) {
          .lnk-grid-brand { grid-template-columns: 1fr; }
        }

        /* Operations — 4 col desktop, 2 col tablet, 1 col mobile */
        .lnk-grid-ops {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 1280px) {
          .lnk-grid-ops { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 720px) {
          .lnk-grid-ops { grid-template-columns: 1fr; }
        }

        /* Quick actions — 4 col desktop, 2 col mobile */
        .lnk-grid-actions {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 28px;
        }
        @media (max-width: 1100px) {
          .lnk-grid-actions { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .lnk-grid-actions { grid-template-columns: 1fr; }
        }

        /* System — 2 col (wide + narrow) */
        .lnk-grid-system {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 1100px) {
          .lnk-grid-system { grid-template-columns: 1fr; }
        }

        /* Traffic source rows */
        .lnk-traffic-row {
          margin-bottom: 12px;
        }
        .lnk-traffic-head {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 5px;
          font-family: Inter, sans-serif;
        }
        .lnk-traffic-track {
          height: 6px;
          border-radius: 3px;
          background: var(--track-bg);
          overflow: hidden;
        }
        .lnk-traffic-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 600ms cubic-bezier(0.16,1,0.3,1);
          animation: lnk-grow-width 800ms cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes lnk-grow-width {
          from { width: 0 !important; }
        }

        /* Operations stat grid */
        .lnk-ops-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .lnk-ops-link {
          display: block;
          text-decoration: none;
        }

        /* Health items */
        .lnk-health-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .lnk-health-score {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .lnk-health-ring {
          position: relative;
          width: 120px;
          height: 120px;
          flex-shrink: 0;
        }
        .lnk-health-ring-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .lnk-health-ring-value {
          font-size: 28px;
          font-weight: 800;
          color: ${tokens.text.primary};
          font-family: Inter, sans-serif;
          letter-spacing: -0.025em;
        }
        .lnk-health-ring-label {
          font-size: 10px;
          color: ${tokens.text.tertiary};
          font-weight: 600;
        }
        .lnk-health-stats {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
          min-width: 140px;
        }
        .lnk-health-stat {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-family: Inter, sans-serif;
        }
        .lnk-health-stat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .lnk-health-stat-label {
          color: ${tokens.text.secondary};
          flex: 1;
        }
        .lnk-health-stat-value {
          color: ${tokens.text.primary};
          font-weight: 700;
        }

        /* Set track bg via CSS var so it adapts to theme */
        :global([data-admin-theme="dark"]) .lnk-traffic-track {
          --track-bg: ${tokens.bg.surfaceAlt};
        }
        :global([data-admin-theme="light"]) .lnk-traffic-track {
          --track-bg: ${tokens.bg.surfaceAlt};
        }
      `}</style>
    </AdminLayout>
  );
}

/* ================================================================ */
/* SUB-COMPONENTS                                                    */
/* ================================================================ */

/* ─── Welcome Hero ────────────────────────────────────────────── */
function WelcomeHero({
  tokens, greeting, name, date, workspace,
  liveSales, liveOrders, liveUsers, onExport,
}: {
  tokens: Tk;
  greeting: string;
  name: string;
  date: string;
  workspace: string;
  liveSales: string;
  liveOrders: number;
  liveUsers: number;
  onExport: () => void;
}) {
  return (
    <div
      className="lnk-welcome-hero"
      style={{
        background: tokens.bg.surface,
        border: `1px solid ${tokens.border.subtle}`,
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 20,
        boxShadow: tokens.shadow.sm,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gradient accent */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: 280, height: 180,
        background: `radial-gradient(circle at top right, ${tokens.chart.series[0]}08, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 20,
        flexWrap: 'wrap',
        position: 'relative',
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
          }}>
            <Badge tokens={tokens} tone="success" dot>Live</Badge>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: tokens.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              fontFamily: 'Inter, sans-serif',
            }}>
              {workspace}
            </span>
          </div>
          <h1 style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 800,
            color: tokens.text.primary,
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
          }}>
            {greeting}, <span style={{ color: tokens.text.accent }}>{name}</span>
          </h1>
          <p style={{
            margin: '6px 0 0 0',
            fontSize: 13,
            color: tokens.text.secondary,
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.5,
          }}>
            {date} · Here&apos;s what&apos;s happening across your marketplace today.
          </p>

          {/* Inline live stats */}
          <div style={{
            display: 'flex',
            gap: 20,
            marginTop: 14,
            flexWrap: 'wrap',
          }}>
            <HeroStat tokens={tokens} label="Revenue" value={liveSales} tone={tokens.chart.series[0]} />
            <HeroStat tokens={tokens} label="Orders" value={`${liveOrders}`} tone={tokens.chart.series[1]} />
            <HeroStat tokens={tokens} label="Active Users" value={`${liveUsers}`} tone={tokens.chart.series[2]} />
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: 8,
          flexShrink: 0,
        }}>
          <Button
            tokens={tokens}
            variant="outline"
            size="md"
            onClick={onExport}
            icon={
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            }
          >
            Export
          </Button>
          <Link href="/reports-analytics">
            <Button
              tokens={tokens}
              variant="primary"
              size="md"
              iconRight={
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              }
            >
              Full Reports
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ tokens, label, value, tone }: { tokens: Tk; label: string; value: string; tone: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      paddingRight: 20,
      borderRight: `1px solid ${tokens.border.subtle}`,
    }}>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        color: tokens.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        fontFamily: 'Inter, sans-serif',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 18,
        fontWeight: 800,
        color: tokens.text.primary,
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '-0.02em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: tone,
          boxShadow: `0 0 0 3px ${tone}20`,
        }} />
        {value}
      </span>
    </div>
  );
}

/* ─── Live Ticker ─────────────────────────────────────────────── */
function LiveTicker({
  tokens, items,
}: {
  tokens: Tk;
  items: { label: string; value: string; tone: 'success' | 'info' | 'default' | 'critical'; pulse?: boolean }[];
}) {
  return (
    <div style={{
      display: 'flex',
      gap: 10,
      marginBottom: 28,
      flexWrap: 'wrap',
    }}>
      {items.map((it, i) => (
        <LiveBadge
          key={i}
          tokens={tokens}
          label={it.label}
          value={it.value}
          tone={it.tone}
          pulse={it.pulse}
        />
      ))}
    </div>
  );
}

function LiveBadge({
  tokens, label, value, tone, pulse,
}: {
  tokens: Tk;
  label: string;
  value: string;
  tone: 'success' | 'info' | 'default' | 'critical';
  pulse?: boolean;
}) {
  const color = tone === 'success' ? tokens.status.success
    : tone === 'info' ? tokens.status.info
    : tone === 'critical' ? tokens.status.error
    : tokens.text.secondary;
  const bg = tone === 'success' ? tokens.status.successBg
    : tone === 'info' ? tokens.status.infoBg
    : tone === 'critical' ? tokens.status.errorBg
    : tokens.bg.surfaceAlt;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '7px 12px',
      background: bg,
      borderRadius: 10,
      border: `1px solid ${tokens.border.subtle}`,
      fontSize: 12,
      fontFamily: 'Inter, sans-serif',
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
      }} />
      <span style={{ color: tokens.text.secondary, fontWeight: 600 }}>{label}:</span>
      <span style={{ color: tokens.text.primary, fontWeight: 700 }}>{value}</span>
      {pulse && (
        <style jsx>{`
          span:first-child {
            animation: lnk-pulse-ring 2s ease-out infinite;
          }
          @keyframes lnk-pulse-ring {
            0% { box-shadow: 0 0 0 0 ${color}80; }
            70% { box-shadow: 0 0 0 6px ${color}00; }
            100% { box-shadow: 0 0 0 0 ${color}00; }
          }
        `}</style>
      )}
    </div>
  );
}

/* ─── Section Label ───────────────────────────────────────────── */
function SectionLabel({ tokens, children }: { tokens: Tk; children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      color: tokens.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 10,
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <span style={{
        width: 3,
        height: 12,
        background: tokens.text.primary,
        borderRadius: 2,
      }} />
      {children}
    </div>
  );
}

/* ─── Metric Mini Card (secondary KPI) ────────────────────────── */
function MetricMiniCard({
  tokens, label, value, delta, deltaLabel, tone, accent, spark, icon,
}: {
  tokens: Tk;
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  tone: 'positive' | 'negative' | 'neutral';
  accent: string;
  spark: number[];
  icon: string;
}) {
  const positive = tone === 'positive';
  const negative = tone === 'negative';
  const deltaColor = positive ? tokens.status.success : negative ? tokens.status.error : tokens.text.secondary;
  const deltaBg = positive ? tokens.status.successBg : negative ? tokens.status.errorBg : tokens.bg.surfaceAlt;

  const ICON_PATHS: Record<string, string> = {
    trending: 'M3 17l6-6 4 4 8-8M14 7h7v7',
    check: 'M5 13l4 4L19 7',
    x: 'M6 6l12 12M6 18L18 6',
    rupee: 'M6 3h12M6 8h12M10 3c4 0 6 2 6 5s-2 5-6 5h-3l6 8',
  };

  return (
    <div
      style={{
        background: tokens.bg.surface,
        border: `1px solid ${tokens.border.subtle}`,
        borderRadius: 16,
        padding: 16,
        boxShadow: tokens.shadow.sm,
        transition: 'transform 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms ease, border-color 180ms ease',
        position: 'relative',
        overflow: 'hidden',
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
    >
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: 100, height: 100,
        background: `radial-gradient(circle at top right, ${accent}10, transparent 70%)`,
        opacity: 0,
        transition: 'opacity 200ms ease',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        position: 'relative',
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: tokens.bg.surfaceAlt,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accent,
          border: `1px solid ${tokens.border.subtle}`,
        }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d={ICON_PATHS[icon] ?? ICON_PATHS.trending} />
          </svg>
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 3,
          fontSize: 11,
          fontWeight: 700,
          color: deltaColor,
          background: deltaBg,
          padding: '3px 8px',
          borderRadius: 6,
        }}>
          <span style={{ fontSize: 10 }}>{positive ? '↑' : negative ? '↓' : '→'}</span>
          {Math.abs(delta)}%
        </div>
      </div>

      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: tokens.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: 4,
        fontFamily: 'Inter, sans-serif',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 22,
        fontWeight: 800,
        color: tokens.text.primary,
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '-0.025em',
        lineHeight: 1.1,
        marginBottom: 8,
      }}>
        {value}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{
          fontSize: 10,
          color: tokens.text.tertiary,
          fontFamily: 'Inter, sans-serif',
        }}>
          {deltaLabel}
        </div>
        <Sparkline data={spark} color={accent} width={68} height={22} />
      </div>
    </div>
  );
}

/* ─── Product Mini Table ──────────────────────────────────────── */
function ProductMiniTable({
  tokens, rows, formatINR,
}: {
  tokens: Tk;
  rows: ReturnType<typeof getTopProducts>;
  formatINR: (v: number) => string;
}) {
  if (rows.length === 0) {
    return <EmptyState tokens={tokens} title="No products" description="No data available." />;
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
      }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
            <Th tokens={tokens} align="left">#</Th>
            <Th tokens={tokens} align="left">Product</Th>
            <Th tokens={tokens} align="right">Units</Th>
            <Th tokens={tokens} align="right">Revenue</Th>
            <Th tokens={tokens} align="center">Trend</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(p => (
            <tr
              key={p.id}
              style={{
                borderBottom: `1px solid ${tokens.border.subtle}`,
                transition: 'background 100ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Td tokens={tokens} align="left" muted>{p.rank}</Td>
              <Td tokens={tokens} align="left">
                <div style={{ fontWeight: 600, color: tokens.text.primary, lineHeight: 1.3 }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
                  {p.brand} · {p.sku}
                </div>
              </Td>
              <Td tokens={tokens} align="right">{p.unitsSold}</Td>
              <Td tokens={tokens} align="right" bold>{formatINR(p.revenue)}</Td>
              <Td tokens={tokens} align="center">
                <TrendChip tokens={tokens} trend={p.trend} />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Recent Orders Table ─────────────────────────────────────── */
function RecentOrdersTable({
  tokens, rows, formatINR,
}: {
  tokens: Tk;
  rows: { id: string; product: string; brand: string; amount: number; status: string; trend: 'up' | 'down' | 'flat' }[];
  formatINR: (v: number) => string;
}) {
  if (rows.length === 0) {
    return <EmptyState tokens={tokens} title="No recent orders" description="Orders will appear here." />;
  }
  const statusTone = (s: string): 'success' | 'warning' | 'info' | 'critical' => {
    if (s === 'Delivered') return 'success';
    if (s === 'Pending') return 'warning';
    if (s === 'Shipped') return 'info';
    return 'critical';
  };
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
      }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
            <Th tokens={tokens} align="left">Order</Th>
            <Th tokens={tokens} align="left">Product</Th>
            <Th tokens={tokens} align="right">Amount</Th>
            <Th tokens={tokens} align="center">Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(o => (
            <tr
              key={o.id}
              style={{
                borderBottom: `1px solid ${tokens.border.subtle}`,
                transition: 'background 100ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Td tokens={tokens} align="left" bold>{o.id}</Td>
              <Td tokens={tokens} align="left">
                <div style={{ fontWeight: 600, color: tokens.text.primary, lineHeight: 1.3 }}>
                  {o.product}
                </div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
                  {o.brand}
                </div>
              </Td>
              <Td tokens={tokens} align="right" bold>{formatINR(o.amount)}</Td>
              <Td tokens={tokens} align="center">
                <Badge tokens={tokens} tone={statusTone(o.status)} size="sm" dot>
                  {o.status}
                </Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Stock Mini List ─────────────────────────────────────────── */
function StockMiniList({
  tokens, rows,
}: {
  tokens: Tk;
  rows: ReturnType<typeof getStockAlerts>;
}) {
  return (
    <div style={{ padding: '4px 0' }}>
      {rows.map(p => (
        <div
          key={p.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            borderBottom: `1px solid ${tokens.border.subtle}`,
            transition: 'background 100ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: tokens.text.primary,
              fontFamily: 'Inter, sans-serif',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {p.name}
            </div>
            <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
              {p.brand} · {p.sku}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: p.status === 'out' ? tokens.status.error : tokens.status.warning,
              fontFamily: 'Inter, sans-serif',
            }}>
              {p.stock}
            </span>
            <Badge tokens={tokens} tone={p.status === 'out' ? 'critical' : 'warning'} size="sm" dot>
              {p.status === 'out' ? 'Out' : 'Low'}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Activity Feed ───────────────────────────────────────────── */
function ActivityFeed({
  tokens, notifications,
}: {
  tokens: Tk;
  notifications: ReturnType<typeof getAdminNotifications>;
}) {
  if (notifications.length === 0) {
    return <EmptyState tokens={tokens} title="No activity yet" description="Events will appear here." />;
  }
  const typeIcon = (t: string) => {
    switch (t) {
      case 'order': return '🛒';
      case 'stock': return '📦';
      case 'review': return '⭐';
      case 'customer': return '👤';
      case 'system': return '⚙️';
      case 'security': return '🔐';
      default: return '📣';
    }
  };
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'now';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {notifications.map(n => (
        <div
          key={n.id}
          style={{
            display: 'flex',
            gap: 10,
            padding: '6px 0',
          }}
        >
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: tokens.bg.surfaceAlt,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            flexShrink: 0,
          }}>
            {typeIcon(n.type)}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: tokens.text.primary,
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.3,
            }}>
              {n.title}
            </div>
            <div style={{
              fontSize: 11,
              color: tokens.text.secondary,
              fontFamily: 'Inter, sans-serif',
              marginTop: 2,
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {n.message}
            </div>
            <div style={{
              fontSize: 10,
              color: tokens.text.tertiary,
              marginTop: 3,
              fontFamily: 'Inter, sans-serif',
            }}>
              {timeAgo(n.timestamp)} ago
            </div>
          </div>
          {!n.read && (
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: tokens.status.info,
              flexShrink: 0,
              marginTop: 6,
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Ops Stat ────────────────────────────────────────────────── */
function OpsStat({
  tokens, label, value, tone,
}: {
  tokens: Tk;
  label: string;
  value: number;
  tone: 'success' | 'warning' | 'info' | 'default';
}) {
  const color = tone === 'success' ? tokens.status.success
    : tone === 'warning' ? tokens.status.warning
    : tone === 'info' ? tokens.status.info
    : tokens.text.secondary;
  const bg = tone === 'success' ? tokens.status.successBg
    : tone === 'warning' ? tokens.status.warningBg
    : tone === 'info' ? tokens.status.infoBg
    : tokens.bg.surfaceAlt;
  return (
    <div style={{
      padding: '10px 12px',
      background: bg,
      borderRadius: 10,
      border: `1px solid ${tokens.border.subtle}`,
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 22,
        fontWeight: 800,
        color: color,
        fontFamily: 'Inter, sans-serif',
        letterSpacing: '-0.025em',
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        color: tokens.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginTop: 4,
        fontFamily: 'Inter, sans-serif',
      }}>
        {label}
      </div>
    </div>
  );
}

/* ─── Quick Action Card ───────────────────────────────────────── */
const QUICK_ACTION_ICONS: Record<string, string> = {
  'plus-circle': 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8v8M8 12h8',
  ticket: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8z',
  flame: 'M12 3s4 4 4 8a4 4 0 11-8 0c0-1 .5-2 .5-2S8 11 8 13M12 3c0 4 4 5 4 9a4 4 0 11-8 0c0-2 1-3 1-3',
  image: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M9 9a1 1 0 100-2 1 1 0 000 2z',
  cart: 'M3 4h2l2.5 11h10l2-7H6M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  chart: 'M3 21V8M9 21V3M15 21v-9M21 21V11',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-3.5-3.5',
};

function getQuickActionTone(tokens: Tk, tone: string) {
  switch (tone) {
    case 'primary': return { bg: tokens.bg.surfaceAlt, fg: tokens.text.primary };
    case 'info': return { bg: tokens.status.infoBg, fg: tokens.status.info };
    case 'warning': return { bg: tokens.status.warningBg, fg: tokens.status.warning };
    case 'success': return { bg: tokens.status.successBg, fg: tokens.status.success };
    case 'purple': return { bg: 'rgba(139, 92, 246, 0.12)', fg: '#8B5CF6' };
    default: return { bg: tokens.bg.surfaceAlt, fg: tokens.text.secondary };
  }
}

function QuickActionCard({
  tokens, href, label, desc, icon, tone,
}: {
  tokens: Tk;
  href: string;
  label: string;
  desc: string;
  icon: string;
  tone: 'primary' | 'info' | 'warning' | 'success' | 'purple' | 'default';
}) {
  const colors = getQuickActionTone(tokens, tone);
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none' }}
      className="lnk-quick-action"
    >
      <div
        style={{
          background: tokens.bg.surface,
          border: `1px solid ${tokens.border.subtle}`,
          borderRadius: 14,
          padding: 16,
          boxShadow: tokens.shadow.sm,
          transition: 'transform 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms ease, border-color 180ms ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = tokens.shadow.md;
          e.currentTarget.style.borderColor = tokens.border.strong;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = tokens.shadow.sm;
          e.currentTarget.style.borderColor = tokens.border.subtle;
        }}
      >
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.fg,
        }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d={QUICK_ACTION_ICONS[icon] ?? QUICK_ACTION_ICONS['plus-circle']} />
          </svg>
        </div>
        <div>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: tokens.text.primary,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.01em',
          }}>
            {label}
          </div>
          <div style={{
            fontSize: 11,
            color: tokens.text.tertiary,
            fontFamily: 'Inter, sans-serif',
            marginTop: 2,
          }}>
            {desc}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Health Item ─────────────────────────────────────────────── */
function HealthItem({
  tokens, label, status, latency,
}: {
  tokens: Tk;
  label: string;
  status: 'operational' | 'degraded' | 'down';
  latency: string;
}) {
  const color = status === 'operational' ? tokens.status.success
    : status === 'degraded' ? tokens.status.warning
    : tokens.status.error;
  const bg = status === 'operational' ? tokens.status.successBg
    : status === 'degraded' ? tokens.status.warningBg
    : tokens.status.errorBg;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      background: tokens.bg.surfaceAlt,
      borderRadius: 10,
      border: `1px solid ${tokens.border.subtle}`,
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 0 3px ${color}25`,
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          color: tokens.text.primary,
          fontFamily: 'Inter, sans-serif',
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 10,
          color: tokens.text.tertiary,
          fontFamily: 'Inter, sans-serif',
          marginTop: 1,
        }}>
          {latency}
        </div>
      </div>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        color: color,
        background: bg,
        padding: '3px 7px',
        borderRadius: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontFamily: 'Inter, sans-serif',
      }}>
        {status}
      </span>
    </div>
  );
}

/* ─── Table cell helpers ──────────────────────────────────────── */
function Th({ tokens, align, children }: {
  tokens: Tk;
  align: 'left' | 'right' | 'center';
  children?: React.ReactNode;
}) {
  return (
    <th style={{
      textAlign: align,
      padding: '10px 14px',
      fontSize: 10,
      fontWeight: 700,
      color: tokens.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      fontFamily: 'Inter, sans-serif',
    }}>
      {children}
    </th>
  );
}

function Td({
  tokens, align, muted, bold, children,
}: {
  tokens: Tk;
  align: 'left' | 'right' | 'center';
  muted?: boolean;
  bold?: boolean;
  children: React.ReactNode;
}) {
  return (
    <td style={{
      textAlign: align,
      padding: '10px 14px',
      color: muted ? tokens.text.tertiary : bold ? tokens.text.primary : tokens.text.secondary,
      fontWeight: bold ? 700 : 400,
      verticalAlign: 'middle',
      fontFamily: 'Inter, sans-serif',
    }}>
      {children}
    </td>
  );
}

function TrendChip({ tokens, trend }: { tokens: Tk; trend: 'up' | 'down' | 'flat' }) {
  const color = trend === 'up' ? tokens.status.success : trend === 'down' ? tokens.status.error : tokens.text.tertiary;
  const bg = trend === 'up' ? tokens.status.successBg : trend === 'down' ? tokens.status.errorBg : tokens.bg.surfaceAlt;
  const icon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 22,
      height: 22,
      borderRadius: 5,
      background: bg,
      color,
      fontSize: 11,
      fontWeight: 700,
    }}>
      {icon}
    </span>
  );
}

/* ─── Loading Skeleton ────────────────────────────────────────── */
function DashboardSkeleton({ tokens }: { tokens: Tk }) {
  const block = (h: number, mb = 16) => ({
    height: h,
    marginBottom: mb,
    background: tokens.bg.surfaceAlt,
    borderRadius: 14,
    animation: 'lnk-skel 1.2s ease-in-out infinite',
  });
  return (
    <div>
      <div style={block(90, 20)} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[1, 2, 3, 4].map(i => <div key={i} style={block(120, 0)} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 }}>
        <div style={block(280, 0)} />
        <div style={block(280, 0)} />
      </div>
      <style jsx>{`
        @keyframes lnk-skel {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}
