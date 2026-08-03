/**
 * LNKICKS Enterprise Admin — Reports & Analytics
 */

'use client';

import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { LineChart } from '@/components/admin/charts/LineChart';
import { BarChart } from '@/components/admin/charts/BarChart';
import { DonutChart } from '@/components/admin/charts/DonutChart';
import {
  Button, Badge, Panel, Tabs, useToast,
} from '@/components/admin/ui';
import { getSalesTrend, getTrafficSources, getTopProducts, getOrderStatusBreakdown } from '@/lib/admin/adminData';

type Report = 'sales' | 'products' | 'customers' | 'inventory' | 'marketing' | 'seo';

export default function ReportsPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [report, setReport] = useState<Report>('sales');
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');

  const trend = useMemo(() => getSalesTrend(range === '7d' ? 7 : range === '90d' ? 90 : 30), [range]);
  const traffic = useMemo(() => getTrafficSources(), []);
  const topProducts = useMemo(() => getTopProducts(10), []);
  const statusBreakdown = useMemo(() => getOrderStatusBreakdown(), []);

  function handleExport(format: 'pdf' | 'excel' | 'csv') {
    pushToast({ tone: 'success', title: `${format.toUpperCase()} export started`, message: 'File will be ready in ~30s.' });
  }

  return (
    <AdminLayout
      title="Reports"
      subtitle="Analytics & insights"
      requirePermission="report.view"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Overview' }, { label: 'Reports' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Reports & Analytics"
        subtitle="Deep-dive into sales, products, customers, inventory, marketing, and SEO performance."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Overview' }, { label: 'Reports' }]}
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => handleExport('csv')}>CSV</Button>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => handleExport('excel')}>Excel</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={() => handleExport('pdf')}>Export PDF</Button>
          </>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'sales', label: 'Sales' },
          { key: 'products', label: 'Products' },
          { key: 'customers', label: 'Customers' },
          { key: 'inventory', label: 'Inventory' },
          { key: 'marketing', label: 'Marketing' },
          { key: 'seo', label: 'SEO' },
        ]} active={report} onChange={(k) => setReport(k as Report)} />
        <div style={{ flex: 1 }} />
        <Tabs tokens={tokens} size="sm" tabs={[
          { key: '7d', label: '7D' },
          { key: '30d', label: '30D' },
          { key: '90d', label: '90D' },
        ]} active={range} onChange={(k) => setRange(k as typeof range)} />
      </div>

      {report === 'sales' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <StatCard tokens={tokens} label="Total Revenue" value="₹24,89,500" delta="+18.4%" tone="success" />
            <StatCard tokens={tokens} label="Total Orders" value="1,420" delta="+12.1%" tone="success" />
            <StatCard tokens={tokens} label="Avg Order Value" value="₹1,754" delta="+5.8%" tone="success" />
            <StatCard tokens={tokens} label="Refund Rate" value="2.4%" delta="-0.3%" tone="success" />
            <StatCard tokens={tokens} label="Conversion Rate" value="3.2%" delta="+0.4%" tone="success" />
            <StatCard tokens={tokens} label="Cart Abandonment" value="68%" delta="+2.1%" tone="negative" />
          </div>

          <Panel tokens={tokens} title="Revenue & Orders" subtitle={`${range} trend`}>
            <LineChart
              data={trend.map(p => ({ label: p.label, values: [p.revenue, p.orders * 4500] }))}
              series={[
                { name: 'Revenue', color: tokens.chart.series[0] },
                { name: 'Order Value', color: tokens.chart.series[1] },
              ]}
              tokens={tokens}
              height={320}
              formatValue={(v) => `₹${(v / 1000).toFixed(0)}k`}
              showAreaFill
              showCrosshair
            />
          </Panel>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }} className="reports-row">
            <Panel tokens={tokens} title="Order Status" subtitle="Distribution">
              <DonutChart
                data={statusBreakdown.map(s => ({ label: s.status, value: s.count, color: s.color }))}
                tokens={tokens}
                size={180}
                centerLabel="Orders"
                centerValue="1,420"
              />
            </Panel>
            <Panel tokens={tokens} title="Traffic Sources" subtitle="Visitor share">
              <div style={{ paddingTop: 8 }}>
                {traffic.map(src => (
                  <div key={src.source} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: tokens.text.primary, fontWeight: 600 }}>{src.source}</span>
                      <span style={{ color: tokens.text.secondary }}>{src.percentage}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: tokens.bg.surfaceAlt, overflow: 'hidden' }}>
                      <div style={{ width: `${src.percentage}%`, height: '100%', background: src.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {report === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <StatCard tokens={tokens} label="Total Products" value="248" delta="+12" tone="success" />
            <StatCard tokens={tokens} label="Best Sellers" value="34" delta="+5" tone="success" />
            <StatCard tokens={tokens} label="Low Stock" value="12" delta="-4" tone="success" />
            <StatCard tokens={tokens} label="Out of Stock" value="5" delta="+2" tone="negative" />
          </div>
          <Panel tokens={tokens} title="Top 10 Products by Revenue" subtitle={`${range} performance`}>
            <BarChart
              data={topProducts.map(p => ({ label: p.name.split(' ').slice(0, 2).join(' '), value: p.revenue }))}
              tokens={tokens}
              height={320}
              formatValue={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
          </Panel>
        </div>
      )}

      {report === 'customers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <StatCard tokens={tokens} label="Total Customers" value="8,950" delta="+412" tone="success" />
            <StatCard tokens={tokens} label="Active (30d)" value="3,240" delta="+8.4%" tone="success" />
            <StatCard tokens={tokens} label="Avg Lifetime Value" value="₹8,420" delta="+12%" tone="success" />
            <StatCard tokens={tokens} label="Repeat Rate" value="28%" delta="+3%" tone="success" />
          </div>
          <Panel tokens={tokens} title="New Customers" subtitle="Daily signups">
            <LineChart
              data={trend.map(p => ({ label: p.label, values: [Math.round(p.visitors * 0.04)] }))}
              series={[{ name: 'New Customers', color: tokens.chart.series[2] }]}
              tokens={tokens}
              height={300}
              formatValue={(v) => String(v)}
            />
          </Panel>
        </div>
      )}

      {report === 'inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <StatCard tokens={tokens} label="Inventory Value" value="₹42.5L" delta="+8%" tone="success" />
            <StatCard tokens={tokens} label="Avg Margin" value="34%" delta="+2%" tone="success" />
            <StatCard tokens={tokens} label="Stock Turnover" value="4.2x" delta="+0.5" tone="success" />
            <StatCard tokens={tokens} label="Days of Stock" value="42" delta="-3" tone="negative" />
          </div>
        </div>
      )}

      {report === 'marketing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <StatCard tokens={tokens} label="Coupons Used" value="318" delta="+4.8%" tone="success" />
            <StatCard tokens={tokens} label="Wallet Issued" value="₹1,42,500" delta="+7.4%" tone="success" />
            <StatCard tokens={tokens} label="Email Open Rate" value="42%" delta="+3%" tone="success" />
            <StatCard tokens={tokens} label="SMS Delivery Rate" value="98.2%" delta="+0.4%" tone="success" />
          </div>
        </div>
      )}

      {report === 'seo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <StatCard tokens={tokens} label="SEO Health Score" value="87" delta="+3" tone="success" />
            <StatCard tokens={tokens} label="Indexed Pages" value="1,240" delta="+24" tone="success" />
            <StatCard tokens={tokens} label="Avg Position" value="8.4" delta="-1.2" tone="success" />
            <StatCard tokens={tokens} label="Click-through Rate" value="3.8%" delta="+0.6%" tone="success" />
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.reports-row) { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
    </AdminLayout>
  );
}

function StatCard({ tokens, label, value, delta, tone }: {
  tokens: ReturnType<typeof useAdminTheme>['tokens'];
  label: string; value: string; delta: string; tone: 'success' | 'negative';
}) {
  return (
    <div style={{
      background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
      borderRadius: 12, padding: 16, boxShadow: tokens.shadow.sm,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, marginBottom: 6 }}>{value}</div>
      <Badge tokens={tokens} tone={tone === 'success' ? 'success' : 'critical'} size="sm">{delta}</Badge>
    </div>
  );
}
