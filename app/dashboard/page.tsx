/**
 * LNKICKS Enterprise Admin — Dashboard Home
 * ------------------------------------------------------------
 * Premium executive overview with:
 *  - 12 KPI cards (responsive grid, hover detail, sparklines)
 *  - Sales trend line chart (7d/30d/90d toggle, comparison, export)
 *  - Order status donut + Top products bar + Traffic sources
 *  - 4 data tables: Trending / Best Sellers / Low Stock / Out of Stock
 *  - Live real-time counters updating every 8s
 *  - Quick action bar
 *  - Page header with breadcrumb
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { KPICard } from '@/components/admin/widgets/KPICard';
import { LineChart } from '@/components/admin/charts/LineChart';
import { BarChart } from '@/components/admin/charts/BarChart';
import { DonutChart } from '@/components/admin/charts/DonutChart';
import { PageHeader } from '@/components/admin/PageHeader';
import { Panel, Badge, Button, Tabs, EmptyState, useToast } from '@/components/admin/ui';
import {
  getKPIs, getSalesTrend, getOrderStatusBreakdown,
  getTopProducts, getStockAlerts, getTrafficSources, getLiveDelta,
} from '@/lib/admin/adminData';
import Link from 'next/link';

export default function EnterpriseDashboardPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [kpis, setKpis] = useState(() => getKPIs());
  const [trend] = useState(() => getSalesTrend(30));
  const [statusBreakdown] = useState(() => getOrderStatusBreakdown());
  const [topProducts] = useState(() => getTopProducts(8));
  const [stockAlerts] = useState(() => getStockAlerts());
  const [traffic] = useState(() => getTrafficSources());
  const [liveSales, setLiveSales] = useState(0);
  const [liveOrders, setLiveOrders] = useState(0);
  const [liveUsers, setLiveUsers] = useState(0);
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [compare, setCompare] = useState(false);

  // Live updates — every 8s apply a small delta
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

  const trendData = useMemo(() => {
    const slice = range === '7d' ? trend.slice(-7) : range === '90d' ? trend : trend.slice(-30);
    return slice.map(p => ({
      label: p.label,
      values: compare
        ? [p.revenue, p.orders * 4500, p.visitors * 8]
        : [p.revenue, p.orders * 4500],
    }));
  }, [trend, range, compare]);

  const topProductsBar = useMemo(() =>
    topProducts.slice(0, 6).map(p => ({
      label: p.name.split(' ').slice(0, 2).join(' '),
      value: p.unitsSold,
      color: tokens.chart.series[0],
    })), [topProducts, tokens]);

  const trendingProducts = useMemo(() => topProducts.slice(0, 5), [topProducts]);
  const bestSellers = useMemo(() => [...topProducts].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5), [topProducts]);
  const lowStock = useMemo(() => stockAlerts.filter(s => s.status === 'low'), [stockAlerts]);
  const outOfStock = useMemo(() => stockAlerts.filter(s => s.status === 'out'), [stockAlerts]);

  const formatINR = (v: number) => `₹${(v / 1000).toFixed(0)}k`;
  const formatINRFull = (v: number) => `₹${v.toLocaleString('en-IN')}`;

  function handleExport() {
    pushToast({ tone: 'success', title: 'Export started', message: 'Dashboard data export will be ready in ~30s.' });
  }

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Real-time executive overview"
      requirePermission="dashboard.view"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Dashboard' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Executive Overview"
        subtitle="Monitor sales, orders, customers, and inventory in real time across your entire marketplace."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Dashboard' }]}
        meta={<Badge tokens={tokens} tone="success" dot>Live</Badge>}
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={handleExport}
              icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>}
            >Export</Button>
            <Link href="/reports-analytics">
              <Button tokens={tokens} variant="primary" size="md"
                iconRight={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>}
              >Full Reports</Button>
            </Link>
          </>
        }
      />

      {/* LIVE TICKER */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap',
      }}>
        <LiveBadge tokens={tokens} label="Today's Revenue" value={formatINRFull(78250 + liveSales)} tone="success" pulse />
        <LiveBadge tokens={tokens} label="Live Orders" value={`${1420 + liveOrders}`} tone="info" pulse />
        <LiveBadge tokens={tokens} label="Active Users" value={`${8950 + liveUsers}`} tone="default" />
        <LiveBadge tokens={tokens} label="Server Status" value="All Systems Operational" tone="success" />
      </div>

      {/* KPI GRID — 12 cards, responsive 2/3/4/6 cols */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
        {kpis.map(k => <KPICard key={k.key} kpi={k} tokens={tokens} />)}
      </div>

      {/* CHARTS ROW 1 — Sales trend (wide) + Order status (narrow) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
        gap: 16,
        marginBottom: 24,
      }} className="admin-chart-row-1">
        <Panel
          tokens={tokens}
          title="Sales Trend"
          subtitle="Revenue vs Order Value"
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
              <Button tokens={tokens} variant="ghost" size="sm"
                onClick={() => setCompare(v => !v)}
                icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>}
              >{compare ? 'Hide' : 'Compare'}</Button>
            </div>
          }
        >
          <LineChart
            data={trendData}
            series={compare
              ? [
                  { name: 'Revenue', color: tokens.chart.series[0] },
                  { name: 'Order Value', color: tokens.chart.series[1] },
                  { name: 'Visitors×8', color: tokens.chart.series[2] },
                ]
              : [
                  { name: 'Revenue', color: tokens.chart.series[0] },
                  { name: 'Order Value', color: tokens.chart.series[1] },
                ]
            }
            tokens={tokens}
            height={280}
            formatValue={formatINR}
            showAreaFill
            showCrosshair
          />
        </Panel>

        <Panel tokens={tokens} title="Order Status" subtitle="Distribution by current status">
          <DonutChart
            data={statusBreakdown.map(s => ({ label: s.status, value: s.count, color: s.color }))}
            tokens={tokens}
            size={200}
            thickness={28}
            centerLabel="Total Orders"
            centerValue="1,420"
            formatValue={(v) => String(v)}
          />
        </Panel>
      </div>

      {/* CHARTS ROW 2 — Top products bar + Traffic sources */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
        gap: 16,
        marginBottom: 24,
      }} className="admin-chart-row-2">
        <Panel tokens={tokens} title="Top Products" subtitle="Units sold (last 30 days)">
          <BarChart
            data={topProductsBar}
            tokens={tokens}
            height={260}
            formatValue={(v) => `${v} units`}
          />
        </Panel>

        <Panel tokens={tokens} title="Traffic Sources" subtitle="Visitor share by channel">
          <div style={{ paddingTop: 8 }}>
            {traffic.map((src, i) => (
              <div key={src.source} style={{ marginBottom: 14 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 12, fontWeight: 600, marginBottom: 5,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  <span style={{ color: tokens.text.primary }}>{src.source}</span>
                  <span style={{ color: tokens.text.secondary }}>{src.visitors.toLocaleString('en-IN')} · {src.percentage}%</span>
                </div>
                <div style={{
                  height: 6, borderRadius: 3,
                  background: tokens.bg.surfaceAlt,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${src.percentage}%`,
                    background: src.color,
                    borderRadius: 3,
                    transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
                    animationDelay: `${i * 50}ms`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* TABLES GRID — 4 tables in 2x2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}>
        <Panel tokens={tokens} title="Trending Products" subtitle="Highest momentum this week" padding="none">
          <ProductMiniTable tokens={tokens} rows={trendingProducts} />
        </Panel>

        <Panel tokens={tokens} title="Best Sellers" subtitle="Top units sold (all-time)" padding="none">
          <ProductMiniTable tokens={tokens} rows={bestSellers} />
        </Panel>

        <Panel tokens={tokens} title="Low Stock" subtitle="Restock soon (≤5 units)" padding="none" accent="warning">
          {lowStock.length === 0 ? (
            <EmptyState tokens={tokens} title="All products well stocked" description="No items below threshold." />
          ) : (
            <StockTable tokens={tokens} rows={lowStock} />
          )}
        </Panel>

        <Panel tokens={tokens} title="Out of Stock" subtitle="0 units — restock urgently" padding="none" accent="critical">
          {outOfStock.length === 0 ? (
            <EmptyState tokens={tokens} title="No out-of-stock items" description="Inventory is healthy." />
          ) : (
            <StockTable tokens={tokens} rows={outOfStock} />
          )}
        </Panel>
      </div>

      {/* QUICK ACTIONS FOOTER */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap',
        padding: '16px 0 8px',
      }}>
        <QuickLink href="/add-product" label="+ Add Product" tokens={tokens} />
        <QuickLink href="/orders-management" label="View Orders" tokens={tokens} />
        <QuickLink href="/admin/seo" label="SEO Center" tokens={tokens} />
        <QuickLink href="/admin/banners" label="Manage Banners" tokens={tokens} />
        <QuickLink href="/admin/coupons" label="Create Coupon" tokens={tokens} />
        <QuickLink href="/reports-analytics" label="Full Reports" tokens={tokens} />
      </div>

      <style jsx>{`
        @media (max-width: 1100px) {
          :global(.admin-chart-row-1), :global(.admin-chart-row-2) {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function LiveBadge({
  tokens, label, value, tone, pulse,
}: {
  tokens: ReturnType<typeof useAdminTheme>['tokens'];
  label: string; value: string;
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
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '7px 12px',
      background: bg,
      borderRadius: 8,
      border: `1px solid ${tokens.border.subtle}`,
      fontSize: 12,
      fontFamily: 'Inter, sans-serif',
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%', background: color,
      }} />
      <span style={{ color: tokens.text.secondary, fontWeight: 600 }}>{label}:</span>
      <span style={{ color: tokens.text.primary, fontWeight: 700 }}>{value}</span>
      {pulse && <style jsx>{`
        span:first-child { animation: pulse-ring 2s ease-out infinite; }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 ${color}80; }
          70% { box-shadow: 0 0 0 6px ${color}00; }
          100% { box-shadow: 0 0 0 0 ${color}00; }
        }
      `}</style>}
    </div>
  );
}

function ProductMiniTable({
  tokens, rows,
}: {
  tokens: ReturnType<typeof useAdminTheme>['tokens'];
  rows: ReturnType<typeof getTopProducts>;
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontFamily: 'Inter, sans-serif', fontSize: 12,
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
            <tr key={p.id} style={{
              borderBottom: `1px solid ${tokens.border.subtle}`,
              transition: 'background 100ms ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Td tokens={tokens} align="left" muted>{p.rank}</Td>
              <Td tokens={tokens} align="left">
                <div style={{ fontWeight: 600, color: tokens.text.primary, lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{p.brand} · {p.sku}</div>
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

function StockTable({
  tokens, rows,
}: {
  tokens: ReturnType<typeof useAdminTheme>['tokens'];
  rows: ReturnType<typeof getStockAlerts>;
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontFamily: 'Inter, sans-serif', fontSize: 12,
      }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
            <Th tokens={tokens} align="left">Product</Th>
            <Th tokens={tokens} align="right">Stock</Th>
            <Th tokens={tokens} align="center">Status</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(p => (
            <tr key={p.id} style={{
              borderBottom: `1px solid ${tokens.border.subtle}`,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Td tokens={tokens} align="left">
                <div style={{ fontWeight: 600, color: tokens.text.primary, lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{p.brand} · {p.sku}</div>
              </Td>
              <Td tokens={tokens} align="right" bold>{p.stock}</Td>
              <Td tokens={tokens} align="center">
                <Badge tokens={tokens} tone={p.status === 'out' ? 'critical' : 'warning'} size="sm" dot>
                  {p.status === 'out' ? 'Out' : 'Low'}
                </Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ tokens, align, children }: {
  tokens: ReturnType<typeof useAdminTheme>['tokens'];
  align: 'left' | 'right' | 'center';
  children?: React.ReactNode;
}) {
  return (
    <th style={{
      textAlign: align, padding: '10px 14px',
      fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
      textTransform: 'uppercase', letterSpacing: 0.8,
    }}>{children}</th>
  );
}

function Td({
  tokens, align, muted, bold, children,
}: {
  tokens: ReturnType<typeof useAdminTheme>['tokens'];
  align: 'left' | 'right' | 'center'; muted?: boolean; bold?: boolean;
  children: React.ReactNode;
}) {
  return (
    <td style={{
      textAlign: align, padding: '10px 14px',
      color: muted ? tokens.text.tertiary : bold ? tokens.text.primary : tokens.text.secondary,
      fontWeight: bold ? 700 : 400,
      verticalAlign: 'middle',
    }}>{children}</td>
  );
}

function TrendChip({ tokens, trend }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; trend: 'up' | 'down' | 'flat' }) {
  const color = trend === 'up' ? tokens.status.success : trend === 'down' ? tokens.status.error : tokens.text.tertiary;
  const bg = trend === 'up' ? tokens.status.successBg : trend === 'down' ? tokens.status.errorBg : tokens.bg.surfaceAlt;
  const icon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 22, height: 22, borderRadius: 5,
      background: bg, color, fontSize: 11, fontWeight: 700,
    }}>{icon}</span>
  );
}

function QuickLink({ href, label, tokens }: { href: string; label: string; tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '8px 14px', borderRadius: 8,
        background: tokens.bg.surface,
        border: `1px solid ${tokens.border.subtle}`,
        color: tokens.text.primary, fontSize: 12, fontWeight: 600,
        fontFamily: 'Inter, sans-serif', textDecoration: 'none',
        transition: 'all 120ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = tokens.bg.hover;
        e.currentTarget.style.borderColor = tokens.border.strong;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = tokens.bg.surface;
        e.currentTarget.style.borderColor = tokens.border.subtle;
      }}
    >
      {label}
    </Link>
  );
}

function formatINR(v: number): string {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
  return `₹${v}`;
}
