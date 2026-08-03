/**
 * LNKICKS Enterprise Admin — Marketing & Growth Suite
 * ------------------------------------------------------------
 * Unified marketing command center — one ecosystem view of:
 *  - Active & Scheduled Campaigns (flash sales + banners + coupons)
 *  - Performance KPIs (revenue, conversion, AOV, ROAS)
 *  - Marketing Calendar (next 14 days)
 *  - Channel Performance (SEO, Email, Social, Organic, Paid)
 *  - Recent Activity & Upcoming Launches
 *  - Quick Links to Flash Sale, Coupons, Banners, Reviews, SEO, Notifications
 *
 * Inspired by Shopify Marketing, Klaviyo, Meta Business Suite,
 * Google Merchant Center, Adobe Commerce.
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Badge, Button, Panel, ProgressBar, useToast, Skeleton,
} from '@/components/admin/ui';
import type { AdminThemeTokens } from '@/lib/admin/types';

/* ----------------------------- Types ----------------------------- */

interface Campaign {
  id: string;
  name: string;
  type: 'Flash Sale' | 'Coupon' | 'Banner' | 'Email' | 'Push';
  status: 'Live' | 'Scheduled' | 'Ended' | 'Draft';
  startDate: string;
  endDate: string;
  revenue: number;
  orders: number;
  impressions: number;
  clicks: number;
  conversions: number;
  spent: number;
}

interface CalendarEvent {
  date: string; // YYYY-MM-DD
  title: string;
  type: 'Flash Sale' | 'Coupon' | 'Banner' | 'Email';
  tone: 'critical' | 'warning' | 'info' | 'success';
}

interface ChannelMetric {
  channel: string;
  icon: string;
  visitors: number;
  revenue: number;
  conversion: number;
  delta: number;
  color: string;
}

interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  detail: string;
  time: string;
  tone: 'success' | 'info' | 'warning' | 'critical' | 'neutral';
}

/* ----------------------------- Data ----------------------------- */

const CAMPAIGNS: Campaign[] = [
  { id: 'cp-1', name: 'Independence Day Drop', type: 'Flash Sale', status: 'Scheduled', startDate: '2026-08-15', endDate: '2026-08-17', revenue: 0, orders: 0, impressions: 142000, clicks: 8400, conversions: 0, spent: 12000 },
  { id: 'cp-2', name: 'Mid-Week Madness', type: 'Flash Sale', status: 'Live', startDate: '2026-08-05', endDate: '2026-08-07', revenue: 482000, orders: 142, impressions: 98400, clicks: 6200, conversions: 142, spent: 8500 },
  { id: 'cp-3', name: 'SUMMER20 Coupon', type: 'Coupon', status: 'Live', startDate: '2026-08-01', endDate: '2026-08-31', revenue: 318000, orders: 318, impressions: 0, clicks: 0, conversions: 318, spent: 0 },
  { id: 'cp-4', name: 'Air Jordan Hero Banner', type: 'Banner', status: 'Live', startDate: '2026-08-01', endDate: '2026-08-31', revenue: 224000, orders: 88, impressions: 28400, clicks: 1820, conversions: 88, spent: 0 },
  { id: 'cp-5', name: 'Diwali Drops Popup', type: 'Banner', status: 'Scheduled', startDate: '2026-10-15', endDate: '2026-11-05', revenue: 0, orders: 0, impressions: 0, clicks: 0, conversions: 0, spent: 0 },
  { id: 'cp-6', name: 'BOGO Samba Coupon', type: 'Coupon', status: 'Scheduled', startDate: '2026-08-15', endDate: '2026-08-20', revenue: 0, orders: 0, impressions: 0, clicks: 0, conversions: 0, spent: 0 },
  { id: 'cp-7', name: 'Back to School Flash', type: 'Flash Sale', status: 'Ended', startDate: '2026-07-15', endDate: '2026-07-31', revenue: 612000, orders: 198, impressions: 124000, clicks: 9100, conversions: 198, spent: 9200 },
  { id: 'cp-8', name: 'WELCOME50 First Order', type: 'Coupon', status: 'Live', startDate: '2026-01-01', endDate: '2026-12-31', revenue: 894000, orders: 318, impressions: 0, clicks: 0, conversions: 318, spent: 0 },
];

const CHANNELS: ChannelMetric[] = [
  { channel: 'Organic Search', icon: '🔍', visitors: 42100, revenue: 1240000, conversion: 2.8, delta: 12.4, color: '#10B981' },
  { channel: 'Direct', icon: '🔗', visitors: 28400, revenue: 880000, conversion: 3.1, delta: 4.2, color: '#3B82F6' },
  { channel: 'Instagram', icon: '📸', visitors: 18900, revenue: 420000, conversion: 2.2, delta: 18.7, color: '#EC4899' },
  { channel: 'Facebook Ads', icon: '👍', visitors: 14200, revenue: 380000, conversion: 2.7, delta: -3.4, color: '#6366F1' },
  { channel: 'Google Ads', icon: '🎯', visitors: 9800, revenue: 290000, conversion: 3.0, delta: 8.1, color: '#F59E0B' },
  { channel: 'Email', icon: '✉️', visitors: 6200, revenue: 410000, conversion: 6.4, delta: 22.3, color: '#8B5CF6' },
];

const ACTIVITY: ActivityItem[] = [
  { id: 'a1', icon: '🔥', title: 'Mid-Week Madness went live', detail: 'Flash sale · 18 products · 20% off', time: '12 min ago', tone: 'success' },
  { id: 'a2', icon: '⭐', title: '12 new reviews pending', detail: '8 five-star · 3 four-star · 1 one-star', time: '34 min ago', tone: 'warning' },
  { id: 'a3', icon: '📣', title: 'SUMMER20 crossed 300 uses', detail: 'Revenue impact: ₹318,000', time: '1 hour ago', tone: 'info' },
  { id: 'a4', icon: '🔍', title: 'SEO score improved to 87', detail: 'Fixed 4 missing meta descriptions', time: '2 hours ago', tone: 'success' },
  { id: 'a5', icon: '🖼️', title: 'New banner published — Air Jordan Hero', detail: 'Desktop · 28,400 impressions', time: '3 hours ago', tone: 'info' },
  { id: 'a6', icon: '🔔', title: 'Low stock alert — Samba OG', detail: '4 units remaining · restock needed', time: '5 hours ago', tone: 'critical' },
];

const KPIS = [
  { label: 'Marketing Revenue', value: '₹41.2L', delta: 14.2, trend: 'up' as const, accent: '#10B981', sparkline: [28, 32, 30, 36, 38, 42, 41] },
  { label: 'Active Campaigns', value: '12', delta: 3, trend: 'up' as const, accent: '#3B82F6', sparkline: [8, 9, 10, 9, 11, 12, 12] },
  { label: 'Conversion Rate', value: '3.4%', delta: 0.4, trend: 'up' as const, accent: '#8B5CF6', sparkline: [2.8, 2.9, 3.1, 3.0, 3.2, 3.3, 3.4] },
  { label: 'ROAS', value: '4.8×', delta: 0.3, trend: 'up' as const, accent: '#F59E0B', sparkline: [4.1, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8] },
  { label: 'Email Subscribers', value: '24,820', delta: 8.1, trend: 'up' as const, accent: '#EC4899', sparkline: [22, 22.5, 23, 23.5, 24, 24.4, 24.8] },
  { label: 'Avg. Order Value', value: '₹4,820', delta: -1.2, trend: 'down' as const, accent: '#EF4444', sparkline: [5.1, 5.0, 4.95, 4.9, 4.85, 4.83, 4.82] },
];

const QUICK_LINKS = [
  { href: '/flash-sale-settings', label: 'Flash Sale', desc: 'Time-bound promos', icon: '🔥', tone: '#EF4444' },
  { href: '/admin/coupons', label: 'Coupons', desc: 'Discount codes', icon: '🎟️', tone: '#8B5CF6' },
  { href: '/admin/banners', label: 'Banners', desc: 'Visual CMS', icon: '🖼️', tone: '#3B82F6' },
  { href: '/admin/seo', label: 'SEO Center', desc: 'Search optimization', icon: '🔍', tone: '#10B981' },
  { href: '/admin/reviews', label: 'Reviews', desc: 'Moderation queue', icon: '⭐', tone: '#F59E0B' },
  { href: '/admin/notifications', label: 'Notifications', desc: 'Alert center', icon: '🔔', tone: '#EC4899' },
];

/* ----------------------------- Helpers ----------------------------- */

function fmtINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function fmtNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

/* ----------------------------- Page ----------------------------- */

export default function MarketingHomePage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const stats = useMemo(() => {
    const live = CAMPAIGNS.filter(c => c.status === 'Live');
    const scheduled = CAMPAIGNS.filter(c => c.status === 'Scheduled');
    const totalRevenue = CAMPAIGNS.reduce((s, c) => s + c.revenue, 0);
    const totalOrders = CAMPAIGNS.reduce((s, c) => s + c.orders, 0);
    const totalSpent = CAMPAIGNS.reduce((s, c) => s + c.spent, 0);
    const roas = totalSpent > 0 ? (totalRevenue / totalSpent) : 0;
    return {
      liveCount: live.length,
      scheduledCount: scheduled.length,
      totalRevenue,
      totalOrders,
      totalSpent,
      roas,
    };
  }, []);

  const calendarEvents = useMemo<CalendarEvent[]>(() => buildCalendarEvents(), []);

  return (
    <AdminLayout
      title="Marketing"
      subtitle="Growth suite"
      requirePermission="banner.manage"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }]}
    >
      <style jsx global>{`
        @keyframes mkt-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mkt-pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        .mkt-stagger > * { opacity: 0; animation: mkt-fade-in 480ms cubic-bezier(0.16,1,0.3,1) forwards; }
        .mkt-stagger > *:nth-child(1) { animation-delay: 40ms; }
        .mkt-stagger > *:nth-child(2) { animation-delay: 80ms; }
        .mkt-stagger > *:nth-child(3) { animation-delay: 120ms; }
        .mkt-stagger > *:nth-child(4) { animation-delay: 160ms; }
        .mkt-stagger > *:nth-child(5) { animation-delay: 200ms; }
        .mkt-stagger > *:nth-child(6) { animation-delay: 240ms; }
        .mkt-stagger > *:nth-child(7) { animation-delay: 280ms; }
        .mkt-stagger > *:nth-child(8) { animation-delay: 320ms; }
        .mkt-pulse { animation: mkt-pulse-dot 1.8s ease-in-out infinite; }
      `}</style>

      <PageHeader
        tokens={tokens}
        title="Marketing & Growth Suite"
        subtitle="One command center for flash sales, coupons, banners, SEO, reviews, and notifications. Plan, launch, and measure every campaign from a single ecosystem."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }]}
        meta={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: tokens.status.success }} className="mkt-pulse" />
            <Badge tokens={tokens} tone="success">{stats.liveCount} live</Badge>
            <Badge tokens={tokens} tone="info">{stats.scheduledCount} scheduled</Badge>
          </span>
        }
        actions={
          <>
            <RangePicker tokens={tokens} value={range} onChange={setRange} />
            <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'info', title: 'Exporting report', message: 'PDF · CSV · Sheets' })}
              icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>}
            >Export</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'success', title: 'Campaign wizard', message: 'Launch new campaign' })}
              icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>}
            >New Campaign</Button>
          </>
        }
      />

      {/* KPI Strip */}
      <div className="mkt-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12, marginBottom: 20 }}>
        {KPIS.map((kpi) => (
          <KPICard key={kpi.label} tokens={tokens} loading={loading} {...kpi} />
        ))}
      </div>

      {/* Main grid: 2 cols (campaigns left, calendar + activity right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 16, marginBottom: 20 }}>
        {/* Campaign Performance Table */}
        <Panel tokens={tokens} title="Campaign Performance" subtitle="All active & scheduled campaigns"
          action={
            <Link href="/flash-sale-settings" style={{ fontSize: 12, fontWeight: 600, color: tokens.status.info, textDecoration: 'none' }}>View all →</Link>
          }
        >
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} tokens={tokens} h={42} />)}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: 12, minWidth: 560 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
                    {['Campaign', 'Status', 'Period', 'Revenue', 'Orders', 'ROAS'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: h === 'Revenue' || h === 'Orders' || h === 'ROAS' ? 'right' : 'left', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CAMPAIGNS.slice(0, 7).map(c => {
                    const roas = c.spent > 0 ? (c.revenue / c.spent) : 0;
                    const statusColor = c.status === 'Live' ? tokens.status.success : c.status === 'Scheduled' ? tokens.status.info : c.status === 'Ended' ? tokens.text.tertiary : tokens.status.warning;
                    return (
                      <tr key={c.id} style={{ borderBottom: `1px solid ${tokens.border.subtle}`, transition: 'background 120ms ease' }}
                        onMouseEnter={e => { e.currentTarget.style.background = tokens.bg.hover; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 28, height: 28, borderRadius: 7, background: tokens.bg.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                              {c.type === 'Flash Sale' ? '🔥' : c.type === 'Coupon' ? '🎟️' : c.type === 'Banner' ? '🖼️' : c.type === 'Email' ? '✉️' : '🔔'}
                            </span>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                              <div style={{ fontSize: 10, color: tokens.text.tertiary }}>{c.type}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: statusColor }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, opacity: c.status === 'Live' ? 1 : 0.6 }} className={c.status === 'Live' ? 'mkt-pulse' : ''} />
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px', fontSize: 11, color: tokens.text.secondary, whiteSpace: 'nowrap' }}>
                          {new Date(c.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(c.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: tokens.text.primary, whiteSpace: 'nowrap' }}>{fmtINR(c.revenue)}</td>
                        <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary, whiteSpace: 'nowrap' }}>{c.orders || '—'}</td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600, color: roas > 0 ? tokens.status.success : tokens.text.tertiary, whiteSpace: 'nowrap' }}>{roas > 0 ? `${roas.toFixed(1)}×` : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        {/* Right column: Calendar + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <MarketingCalendar tokens={tokens} events={calendarEvents} loading={loading} />
          <ActivityFeed tokens={tokens} items={ACTIVITY} loading={loading} />
        </div>
      </div>

      {/* Channel Performance */}
      <Panel tokens={tokens} title="Channel Performance" subtitle="Revenue, conversion & spend by acquisition channel — last 30 days"
        action={<Badge tokens={tokens} tone="info">{range}</Badge>}
      >
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} tokens={tokens} h={120} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
            {CHANNELS.map(ch => (
              <div key={ch.channel} style={{
                padding: 14, borderRadius: 12, background: tokens.bg.surfaceAlt,
                border: `1px solid ${tokens.border.subtle}`,
                transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1), border-color 200ms ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = tokens.border.strong; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = tokens.border.subtle; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${ch.color}1A`, color: ch.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{ch.icon}</div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{ch.channel}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: ch.delta >= 0 ? tokens.status.success : tokens.status.error }}>
                    {ch.delta >= 0 ? '▲' : '▼'} {Math.abs(ch.delta)}%
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, marginBottom: 2 }}>Visitors</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary }}>{fmtNum(ch.visitors)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, marginBottom: 2 }}>Revenue</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary }}>{fmtINR(ch.revenue)}</div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: tokens.text.tertiary }}>Conv. rate</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: tokens.text.primary }}>{ch.conversion}%</span>
                  </div>
                  <ProgressBar tokens={tokens} value={Math.min(100, ch.conversion * 12)} color={ch.color} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* Quick Links */}
      <div className="mkt-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12, marginTop: 20 }}>
        {QUICK_LINKS.map(q => (
          <Link key={q.href} href={q.href} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: 16, borderRadius: 14, background: tokens.bg.surface,
              border: `1px solid ${tokens.border.subtle}`, boxShadow: tokens.shadow.sm,
              transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
              height: '100%', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = tokens.shadow.md; e.currentTarget.style.borderColor = q.tone + '80'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = tokens.shadow.sm; e.currentTarget.style.borderColor = tokens.border.subtle; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${q.tone}1A`, color: q.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 10 }}>{q.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, marginBottom: 2 }}>{q.label}</div>
              <div style={{ fontSize: 11, color: tokens.text.tertiary }}>{q.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Responsive grid */}
      <style jsx>{`
        @media (max-width: 1400px) {
          :global(.mkt-stagger[style*='repeat(6, minmax(0, 1fr))']) { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 1100px) {
          :global([style*='minmax(0, 1.6fr) minmax(0, 1fr)']) { grid-template-columns: 1fr !important; }
          :global(.mkt-stagger[style*='repeat(6, minmax(0, 1fr))']) { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 768px) {
          :global(.mkt-stagger[style*='repeat(6, minmax(0, 1fr))']) { grid-template-columns: 1fr !important; }
          :global([style*='repeat(3, minmax(0, 1fr))']) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  );
}

/* ----------------------------- Sub-components ----------------------------- */

function RangePicker({ tokens, value, onChange }: { tokens: AdminThemeTokens; value: '7d' | '30d' | '90d'; onChange: (v: '7d' | '30d' | '90d') => void }) {
  return (
    <div style={{ display: 'inline-flex', background: tokens.bg.surfaceAlt, borderRadius: 8, padding: 3, border: `1px solid ${tokens.border.subtle}` }}>
      {(['7d', '30d', '90d'] as const).map(r => (
        <button key={r} onClick={() => onChange(r)} style={{
          padding: '6px 12px', fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
          border: 'none', background: value === r ? tokens.bg.surface : 'transparent',
          color: value === r ? tokens.text.primary : tokens.text.tertiary,
          borderRadius: 6, cursor: 'pointer', transition: 'all 150ms ease',
          boxShadow: value === r ? tokens.shadow.sm : 'none',
        }}>{r}</button>
      ))}
    </div>
  );
}

function KPICard({ tokens, label, value, delta, trend, accent, sparkline, loading }: {
  tokens: AdminThemeTokens;
  label: string; value: string; delta: number; trend: 'up' | 'down';
  accent: string; sparkline: number[]; loading: boolean;
}) {
  if (loading) {
    return (
      <div style={{ padding: 14, borderRadius: 12, background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}` }}>
        <Skeleton tokens={tokens} h={10} w={80} />
        <div style={{ height: 8 }} />
        <Skeleton tokens={tokens} h={20} w={100} />
        <div style={{ height: 8 }} />
        <Skeleton tokens={tokens} h={24} />
      </div>
    );
  }
  const max = Math.max(...sparkline);
  const min = Math.min(...sparkline);
  const range = max - min || 1;
  const points = sparkline.map((v, i) => `${(i / (sparkline.length - 1)) * 100},${28 - ((v - min) / range) * 24}`).join(' ');
  const positive = trend === 'up';
  return (
    <div style={{
      padding: 14, borderRadius: 12, background: tokens.bg.surface,
      border: `1px solid ${tokens.border.subtle}`, boxShadow: tokens.shadow.sm,
      transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = tokens.shadow.md; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = tokens.shadow.sm; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent, opacity: 0.7 }} />
      <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: positive ? tokens.status.success : tokens.status.error }}>
          {positive ? '▲' : '▼'} {Math.abs(delta)}%
        </span>
        <svg width={70} height={28} viewBox="0 0 100 28" preserveAspectRatio="none" style={{ flexShrink: 0 }}>
          <polyline points={points} fill="none" stroke={accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function MarketingCalendar({ tokens, events, loading }: { tokens: AdminThemeTokens; events: CalendarEvent[]; loading: boolean }) {
  const today = new Date('2026-08-04');
  const days = useMemo(() => {
    const arr: { date: Date; iso: string; day: number; isToday: boolean; events: CalendarEvent[] }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      arr.push({ date: d, iso, day: d.getDate(), isToday: i === 0, events: events.filter(e => e.date === iso) });
    }
    return arr;
  }, [today, events]);

  if (loading) {
    return (
      <Panel tokens={tokens} title="Marketing Calendar" subtitle="Next 14 days">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {Array.from({ length: 14 }).map((_, i) => <Skeleton key={i} tokens={tokens} h={56} />)}
        </div>
      </Panel>
    );
  }

  return (
    <Panel tokens={tokens} title="Marketing Calendar" subtitle="Next 14 days — scheduled launches"
      action={<Badge tokens={tokens} tone="info">{events.length} events</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 6 }}>
        {days.map(d => (
          <div key={d.iso} style={{
            minHeight: 64, padding: 6, borderRadius: 8,
            background: d.isToday ? `${tokens.status.info}10` : tokens.bg.surfaceAlt,
            border: d.isToday ? `1px solid ${tokens.status.info}50` : `1px solid ${tokens.border.subtle}`,
            display: 'flex', flexDirection: 'column', gap: 3,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 9, color: tokens.text.tertiary, fontWeight: 600, textTransform: 'uppercase' }}>
                {d.date.toLocaleDateString('en-IN', { weekday: 'short' })}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: d.isToday ? tokens.status.info : tokens.text.primary }}>{d.day}</span>
            </div>
            {d.events.slice(0, 2).map((e, i) => {
              const color = e.tone === 'critical' ? tokens.status.error : e.tone === 'warning' ? tokens.status.warning : e.tone === 'success' ? tokens.status.success : tokens.status.info;
              return (
                <div key={i} style={{
                  fontSize: 9, fontWeight: 600, color,
                  padding: '2px 4px', borderRadius: 4,
                  background: `${color}1A`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }} title={e.title}>{e.title}</div>
              );
            })}
            {d.events.length > 2 && <div style={{ fontSize: 9, color: tokens.text.tertiary }}>+{d.events.length - 2} more</div>}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ActivityFeed({ tokens, items, loading }: { tokens: AdminThemeTokens; items: ActivityItem[]; loading: boolean }) {
  return (
    <Panel tokens={tokens} title="Recent Activity" subtitle="Latest marketing events"
      action={<Badge tokens={tokens} tone="success" dot>{items.length}</Badge>}
    >
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} tokens={tokens} h={48} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.slice(0, 6).map((a, i) => {
            const toneColor = a.tone === 'success' ? tokens.status.success : a.tone === 'critical' ? tokens.status.error : a.tone === 'warning' ? tokens.status.warning : a.tone === 'info' ? tokens.status.info : tokens.text.tertiary;
            return (
              <div key={a.id} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '8px 10px', borderRadius: 8,
                transition: 'background 120ms ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = tokens.bg.hover; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: tokens.bg.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{a.icon}</div>
                  {i < items.length - 1 && <div style={{ position: 'absolute', left: 14, top: 30, bottom: -10, width: 2, background: tokens.border.subtle }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{a.title}</span>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: toneColor, flexShrink: 0 }} />
                  </div>
                  <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.4 }}>{a.detail}</div>
                  <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 3 }}>{a.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

/* ----------------------------- Calendar builder ----------------------------- */

function buildCalendarEvents(): CalendarEvent[] {
  return [
    { date: '2026-08-05', title: 'Mid-Week Madness', type: 'Flash Sale', tone: 'critical' },
    { date: '2026-08-07', title: 'Mid-Week Madness ends', type: 'Flash Sale', tone: 'warning' },
    { date: '2026-08-10', title: 'Banner: Samba Offer ends', type: 'Banner', tone: 'warning' },
    { date: '2026-08-15', title: 'Independence Day Sale', type: 'Flash Sale', tone: 'critical' },
    { date: '2026-08-15', title: 'BOGO Samba Coupon', type: 'Coupon', tone: 'info' },
    { date: '2026-08-17', title: 'Independence Day ends', type: 'Flash Sale', tone: 'warning' },
    { date: '2026-08-20', title: 'BOGO Samba ends', type: 'Coupon', tone: 'warning' },
    { date: '2026-08-22', title: 'Email: New Arrivals Drop', type: 'Email', tone: 'info' },
    { date: '2026-08-25', title: 'Mobile Banner refresh', type: 'Banner', tone: 'success' },
    { date: '2026-08-31', title: 'SUMMER20 expires', type: 'Coupon', tone: 'warning' },
    { date: '2026-09-05', title: 'Tablet Hero ends', type: 'Banner', tone: 'warning' },
    { date: '2026-09-15', title: 'JORDAN15 expires', type: 'Coupon', tone: 'warning' },
  ];
}
