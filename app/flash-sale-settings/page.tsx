/**
 * LNKICKS Enterprise Admin — Flash Sale Campaign Builder
 * ------------------------------------------------------------
 * Premium flash-sale command center with:
 *  - Live Countdown (per-second ticker for active sales)
 *  - Campaign Builder (4-step wizard: details → schedule → products → review)
 *  - Product Assignment (search & pin specific SKUs)
 *  - Inventory Monitoring (per-product stock + threshold alerts)
 *  - Revenue Preview (projected vs actual)
 *  - Performance Metrics (revenue, orders, AOV, conversion, sell-through)
 *  - Status Timeline (Draft → Scheduled → Live → Ended → Archived)
 *
 * Reuses existing FlashSale data shape; only enriches display.
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, Panel, Input, Select, Toggle, useToast, Tabs,
  Drawer, ProgressBar, EmptyState, IconButton,
} from '@/components/admin/ui';
import type { AdminThemeTokens } from '@/lib/admin/types';

/* ----------------------------- Types ----------------------------- */

type SaleStatus = 'Draft' | 'Scheduled' | 'Live' | 'Ended' | 'Archived';
type DiscountType = 'percentage' | 'flat';

interface FlashSaleProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
  image: string;
  price: number;
  stock: number;
  allocated: number;
  sold: number;
  threshold: number;
}

interface FlashSale {
  id: string;
  name: string;
  startDate: string; // ISO datetime
  endDate: string;
  discountType: DiscountType;
  discountValue: number;
  products: FlashSaleProduct[];
  status: SaleStatus;
  showBanner: boolean;
  showCountdown: boolean;
  showOnProductPage: boolean;
  createdAt: string;
  revenue: number;
  orders: number;
  visitors: number;
}

interface TimelineStep {
  label: string;
  status: 'done' | 'current' | 'upcoming';
  time?: string;
}

/* ----------------------------- Data ----------------------------- */

const PRODUCTS_POOL: FlashSaleProduct[] = [
  { id: 'p1', name: 'Air Jordan 1 Low — Powder Blue', brand: 'JORDAN', sku: 'AJ1-PB-001', image: '/jordan_powder_blue_nobg.png', price: 12999, stock: 48, allocated: 30, sold: 18, threshold: 8 },
  { id: 'p2', name: 'Adidas Samba OG — Cloud White', brand: 'ADIDAS', sku: 'SM-OG-CW-002', image: '/samba_og_nobg.png', price: 8999, stock: 4, allocated: 25, sold: 22, threshold: 5 },
  { id: 'p3', name: 'Nike Dunk Low — Panda', brand: 'NIKE', sku: 'ND-L-PD-003', image: '/dunk_low_panda_nobg.png', price: 10999, stock: 62, allocated: 40, sold: 8, threshold: 10 },
  { id: 'p4', name: 'Yeezy Boost 350 V2 — Zebra', brand: 'YEEZY', sku: 'YZ-350-ZB-004', image: '/yeezy_zebra_nobg.png', price: 24999, stock: 18, allocated: 12, sold: 4, threshold: 4 },
  { id: 'p5', name: 'Nike Air Force 1 — Triple White', brand: 'NIKE', sku: 'AF1-TW-005', image: '', price: 7999, stock: 96, allocated: 0, sold: 0, threshold: 12 },
  { id: 'p6', name: 'Adidas Ultraboost 1.0', brand: 'ADIDAS', sku: 'UB-1.0-006', image: '', price: 17999, stock: 28, allocated: 0, sold: 0, threshold: 6 },
  { id: 'p7', name: 'New Balance 530 — Silver Navy', brand: 'NB', sku: 'NB-530-SN-007', image: '', price: 9999, stock: 0, allocated: 0, sold: 0, threshold: 5 },
  { id: 'p8', name: 'Asics Gel-Kayano 14', brand: 'ASICS', sku: 'AS-GK14-008', image: '', price: 13999, stock: 14, allocated: 0, sold: 0, threshold: 4 },
];

const SEED_SALES: FlashSale[] = [
  {
    id: 'fs-1', name: 'Mid-Week Madness', startDate: '2026-08-05T00:00:00', endDate: '2026-08-07T23:59:59',
    discountType: 'percentage', discountValue: 20, status: 'Live',
    showBanner: true, showCountdown: true, showOnProductPage: true,
    createdAt: '2026-07-28T10:00:00', revenue: 482000, orders: 142, visitors: 6200,
    products: PRODUCTS_POOL.slice(0, 4),
  },
  {
    id: 'fs-2', name: 'Independence Day Drop', startDate: '2026-08-15T00:00:00', endDate: '2026-08-17T23:59:59',
    discountType: 'percentage', discountValue: 30, status: 'Scheduled',
    showBanner: true, showCountdown: true, showOnProductPage: true,
    createdAt: '2026-07-30T14:00:00', revenue: 0, orders: 0, visitors: 0,
    products: PRODUCTS_POOL.slice(0, 5),
  },
  {
    id: 'fs-3', name: 'Back to School Flash', startDate: '2026-07-15T00:00:00', endDate: '2026-07-31T23:59:59',
    discountType: 'percentage', discountValue: 25, status: 'Ended',
    showBanner: false, showCountdown: true, showOnProductPage: true,
    createdAt: '2026-07-08T09:00:00', revenue: 612000, orders: 198, visitors: 9100,
    products: PRODUCTS_POOL.slice(2, 6),
  },
  {
    id: 'fs-4', name: 'Diwali Sneaker Festival', startDate: '2026-10-20T00:00:00', endDate: '2026-11-05T23:59:59',
    discountType: 'flat', discountValue: 1500, status: 'Draft',
    showBanner: true, showCountdown: false, showOnProductPage: true,
    createdAt: '2026-08-01T12:00:00', revenue: 0, orders: 0, visitors: 0,
    products: [],
  },
];

/* ----------------------------- Helpers ----------------------------- */

function fmtINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function useCountdown(targetIso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, isOver: diff === 0 };
}

function statusTimeline(sale: FlashSale): TimelineStep[] {
  const now = Date.now();
  const start = new Date(sale.startDate).getTime();
  const end = new Date(sale.endDate).getTime();
  const steps: TimelineStep[] = [
    { label: 'Created', status: 'done', time: new Date(sale.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) },
  ];
  if (sale.status === 'Draft') {
    steps.push({ label: 'Scheduled', status: 'current' });
    steps.push({ label: 'Live', status: 'upcoming' });
    steps.push({ label: 'Ended', status: 'upcoming' });
  } else if (sale.status === 'Scheduled' && now < start) {
    steps.push({ label: 'Scheduled', status: 'current', time: new Date(sale.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) });
    steps.push({ label: 'Live', status: 'upcoming' });
    steps.push({ label: 'Ended', status: 'upcoming' });
  } else if (sale.status === 'Live' || (now >= start && now <= end)) {
    steps.push({ label: 'Scheduled', status: 'done', time: new Date(sale.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) });
    steps.push({ label: 'Live', status: 'current', time: 'Ends ' + new Date(sale.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) });
    steps.push({ label: 'Ended', status: 'upcoming' });
  } else {
    steps.push({ label: 'Scheduled', status: 'done', time: new Date(sale.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) });
    steps.push({ label: 'Live', status: 'done', time: 'Ended ' + new Date(sale.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) });
    steps.push({ label: 'Ended', status: 'done' });
  }
  return steps;
}

/* ----------------------------- Page ----------------------------- */

export default function FlashSalePage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [sales, setSales] = useState<FlashSale[]>(SEED_SALES);
  const [tab, setTab] = useState<'all' | 'live' | 'scheduled' | 'ended' | 'draft'>('all');
  const [builderOpen, setBuilderOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<FlashSale | null>(null);

  const filtered = useMemo(() => {
    if (tab === 'all') return sales;
    return sales.filter(s => s.status.toLowerCase() === tab);
  }, [sales, tab]);

  const counts = useMemo(() => ({
    all: sales.length,
    live: sales.filter(s => s.status === 'Live').length,
    scheduled: sales.filter(s => s.status === 'Scheduled').length,
    ended: sales.filter(s => s.status === 'Ended').length,
    draft: sales.filter(s => s.status === 'Draft').length,
  }), [sales]);

  const totals = useMemo(() => {
    const live = sales.filter(s => s.status === 'Live');
    return {
      revenue: live.reduce((s, x) => s + x.revenue, 0),
      orders: live.reduce((s, x) => s + x.orders, 0),
      visitors: live.reduce((s, x) => s + x.visitors, 0),
    };
  }, [sales]);

  function deleteSale(id: string) {
    setSales(prev => prev.filter(s => s.id !== id));
    pushToast({ tone: 'success', title: 'Flash sale deleted' });
  }

  function duplicateSale(s: FlashSale) {
    const copy: FlashSale = { ...s, id: `fs-${Date.now()}`, name: `${s.name} (Copy)`, status: 'Draft', revenue: 0, orders: 0, visitors: 0, createdAt: new Date().toISOString() };
    setSales(prev => [copy, ...prev]);
    pushToast({ tone: 'success', title: 'Sale duplicated', message: copy.name });
  }

  return (
    <AdminLayout
      title="Flash Sale"
      subtitle="Time-bound promotions"
      requirePermission="product.edit"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Flash Sale' }]}
    >
      <style jsx global>{`
        @keyframes fs-card-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fs-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
        .fs-stagger > * { animation: fs-card-in 460ms cubic-bezier(0.16,1,0.3,1) both; }
        .fs-stagger > *:nth-child(1) { animation-delay: 30ms; }
        .fs-stagger > *:nth-child(2) { animation-delay: 70ms; }
        .fs-stagger > *:nth-child(3) { animation-delay: 110ms; }
        .fs-stagger > *:nth-child(4) { animation-delay: 150ms; }
        .fs-pulse { animation: fs-pulse 1.5s ease-in-out infinite; }
      `}</style>

      <PageHeader
        tokens={tokens}
        title="Flash Sale Campaign Builder"
        subtitle="Plan, launch, and measure time-bound promotions. Live countdowns, product assignment, inventory monitoring, and revenue projections in one workspace."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Flash Sale' }]}
        meta={<Badge tokens={tokens} tone="success" dot>{counts.live} live</Badge>}
        actions={
          <Button tokens={tokens} variant="primary" size="md" onClick={() => { setSelectedSale(null); setBuilderOpen(true); }}
            icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>}
          >New Flash Sale</Button>
        }
      />

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 20 }}>
        <KPIStrip tokens={tokens} label="Live Revenue" value={fmtINR(totals.revenue)} tone="success" sub="Across live sales" />
        <KPIStrip tokens={tokens} label="Live Orders" value={String(totals.orders)} tone="info" sub="From active campaigns" />
        <KPIStrip tokens={tokens} label="Conversion" value={`${totals.visitors > 0 ? ((totals.orders / totals.visitors) * 100).toFixed(1) : '0'}%`} tone="purple" sub="Orders ÷ visitors" />
        <KPIStrip tokens={tokens} label="Avg. Order Value" value={totals.orders > 0 ? fmtINR(totals.revenue / totals.orders) : '—'} tone="warning" sub="Per completed order" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'all', label: 'All Sales', badge: counts.all },
          { key: 'live', label: 'Live', badge: counts.live },
          { key: 'scheduled', label: 'Scheduled', badge: counts.scheduled },
          { key: 'ended', label: 'Ended', badge: counts.ended },
          { key: 'draft', label: 'Drafts', badge: counts.draft },
        ]} active={tab} onChange={(k) => setTab(k as typeof tab)} />
      </div>

      {/* Sales List */}
      {filtered.length === 0 ? (
        <Panel tokens={tokens}>
          <EmptyState tokens={tokens}
            icon={<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={1.5}><path d="M12 3s4 4 4 8a4 4 0 11-8 0c0-1 .5-2 .5-2S8 11 8 13M12 3c0 4 4 5 4 9a4 4 0 11-8 0c0-2 1-3 1-3" /></svg>}
            title="No flash sales yet"
            description="Create your first time-bound promotion to drive urgency and conversion."
            action={<Button tokens={tokens} variant="primary" size="md" onClick={() => setBuilderOpen(true)}>Create Flash Sale</Button>}
          />
        </Panel>
      ) : (
        <div className="fs-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(sale => (
            <FlashSaleCard
              key={sale.id}
              tokens={tokens}
              sale={sale}
              onEdit={() => { setSelectedSale(sale); setBuilderOpen(true); }}
              onDuplicate={() => duplicateSale(sale)}
              onDelete={() => deleteSale(sale.id)}
            />
          ))}
        </div>
      )}

      {/* Builder Drawer */}
      <FlashSaleBuilderDrawer
        tokens={tokens}
        open={builderOpen}
        sale={selectedSale}
        onClose={() => { setBuilderOpen(false); setSelectedSale(null); }}
        onSave={(name) => {
          pushToast({ tone: 'success', title: selectedSale ? 'Flash sale updated' : 'Flash sale created', message: name });
          setBuilderOpen(false);
          setSelectedSale(null);
        }}
      />
    </AdminLayout>
  );
}

/* ----------------------------- Flash Sale Card ----------------------------- */

function FlashSaleCard({ tokens, sale, onEdit, onDuplicate, onDelete }: {
  tokens: AdminThemeTokens;
  sale: FlashSale;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const isLive = sale.status === 'Live';
  const isScheduled = sale.status === 'Scheduled';
  const isEnded = sale.status === 'Ended';
  const countdown = useCountdown(sale.endDate);
  const startCountdown = useCountdown(sale.startDate);
  const timeline = useMemo(() => statusTimeline(sale), [sale]);

  const totalAllocated = sale.products.reduce((s, p) => s + p.allocated, 0);
  const totalSold = sale.products.reduce((s, p) => s + p.sold, 0);
  const sellThrough = totalAllocated > 0 ? (totalSold / totalAllocated) * 100 : 0;
  const lowStockProducts = sale.products.filter(p => p.stock <= p.threshold);
  const outOfStockProducts = sale.products.filter(p => p.stock === 0);

  const projectedRevenue = useMemo(() => {
    return sale.products.reduce((sum, p) => {
      const discounted = sale.discountType === 'percentage'
        ? p.price * (1 - sale.discountValue / 100)
        : Math.max(0, p.price - sale.discountValue);
      return sum + discounted * p.allocated;
    }, 0);
  }, [sale]);

  return (
    <div style={{
      background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
      borderRadius: 14, padding: 18, boxShadow: tokens.shadow.sm,
      transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = tokens.shadow.md; e.currentTarget.style.borderColor = tokens.border.strong; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = tokens.shadow.sm; e.currentTarget.style.borderColor = tokens.border.subtle; }}
    >
      {/* Live ribbon */}
      {isLive && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${tokens.status.success}, ${tokens.status.info})` }} />}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: tokens.text.primary, letterSpacing: '-0.02em' }}>{sale.name}</h3>
            <StatusPill tokens={tokens} status={sale.status} />
            {isLive && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: tokens.status.success, padding: '2px 8px', borderRadius: 12, background: tokens.status.successBg }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: tokens.status.success }} className="fs-pulse" />LIVE NOW</span>}
            {sale.showBanner && <Badge tokens={tokens} tone="info" size="sm">Banner</Badge>}
            {sale.showCountdown && <Badge tokens={tokens} tone="warning" size="sm">Countdown</Badge>}
          </div>
          <div style={{ fontSize: 12, color: tokens.text.secondary, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span>📅 {new Date(sale.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} — {new Date(sale.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            <span>🏷️ {sale.discountType === 'percentage' ? `${sale.discountValue}% off` : `₹${sale.discountValue} off`}</span>
            <span>📦 {sale.products.length} products</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button tokens={tokens} variant="outline" size="sm" onClick={onEdit}>Edit</Button>
          <Button tokens={tokens} variant="ghost" size="sm" onClick={onDuplicate}>Duplicate</Button>
          <IconButton tokens={tokens} size={28} label="Delete"
            icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.status.error} strokeWidth={2}><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M10 11v6M14 11v6" /></svg>}
            onClick={onDelete}
          />
        </div>
      </div>

      {/* Live Countdown / Time to start */}
      {(isLive || isScheduled) && (
        <div style={{
          background: isLive ? tokens.status.successBg : tokens.status.infoBg,
          border: `1px solid ${isLive ? tokens.status.success + '40' : tokens.status.info + '40'}`,
          borderRadius: 10, padding: 12, marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>{isLive ? '⏰' : '🗓️'}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: isLive ? tokens.status.success : tokens.status.info, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {isLive ? 'Sale ends in' : 'Sale starts in'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {isLive ? (
                <>
                  <CountdownUnit tokens={tokens} label="Days" value={countdown.days} accent={tokens.status.success} />
                  <CountdownUnit tokens={tokens} label="Hrs" value={countdown.hours} accent={tokens.status.success} />
                  <CountdownUnit tokens={tokens} label="Min" value={countdown.minutes} accent={tokens.status.success} />
                  <CountdownUnit tokens={tokens} label="Sec" value={countdown.seconds} accent={tokens.status.success} pulse />
                </>
              ) : (
                <>
                  <CountdownUnit tokens={tokens} label="Days" value={startCountdown.days} accent={tokens.status.info} />
                  <CountdownUnit tokens={tokens} label="Hrs" value={startCountdown.hours} accent={tokens.status.info} />
                  <CountdownUnit tokens={tokens} label="Min" value={startCountdown.minutes} accent={tokens.status.info} />
                  <CountdownUnit tokens={tokens} label="Sec" value={startCountdown.seconds} accent={tokens.status.info} pulse />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Timeline */}
      <div style={{ marginBottom: 14, padding: '10px 12px', background: tokens.bg.surfaceAlt, borderRadius: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Status Timeline</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {timeline.map((step, i) => {
            const color = step.status === 'done' ? tokens.status.success : step.status === 'current' ? tokens.status.info : tokens.text.tertiary;
            return (
              <div key={step.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 60 }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: step.status === 'done' ? color : step.status === 'current' ? color : tokens.bg.surface,
                    border: `2px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: step.status === 'current' ? tokens.bg.app : step.status === 'done' ? tokens.bg.app : 'transparent',
                    fontSize: 9, fontWeight: 800,
                    boxShadow: step.status === 'current' ? `0 0 0 4px ${color}25` : 'none',
                  }}>{step.status === 'done' ? '✓' : step.status === 'current' ? '•' : ''}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: step.status === 'upcoming' ? tokens.text.tertiary : tokens.text.primary, whiteSpace: 'nowrap' }}>{step.label}</div>
                  {step.time && <div style={{ fontSize: 9, color: tokens.text.tertiary, whiteSpace: 'nowrap' }}>{step.time}</div>}
                </div>
                {i < timeline.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: step.status === 'done' ? tokens.status.success : tokens.border.subtle, borderRadius: 1 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance + Products grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 14 }}>
        {/* Performance metrics */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Performance</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginBottom: 10 }}>
            <MetricTile tokens={tokens} label="Revenue" value={isEnded || isLive ? fmtINR(sale.revenue) : '—'} hint={isEnded || isLive ? 'Actual' : 'Not started'} />
            <MetricTile tokens={tokens} label="Projected" value={fmtINR(projectedRevenue)} hint="If allocated sold" tone="info" />
            <MetricTile tokens={tokens} label="Orders" value={String(sale.orders || 0)} hint="From this sale" />
            <MetricTile tokens={tokens} label="Visitors" value={sale.visitors.toLocaleString('en-IN')} hint="During sale period" />
          </div>
          {/* Sell-through bar */}
          <div style={{ padding: '8px 10px', background: tokens.bg.surfaceAlt, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary }}>Sell-through rate</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: tokens.text.primary }}>{sellThrough.toFixed(1)}% ({totalSold}/{totalAllocated})</span>
            </div>
            <ProgressBar tokens={tokens} value={sellThrough} color={sellThrough >= 75 ? tokens.status.success : sellThrough >= 40 ? tokens.status.warning : tokens.status.error} />
          </div>
        </div>

        {/* Inventory + Products */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6 }}>Product Inventory</div>
            {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
              <Badge tokens={tokens} tone="critical" size="sm">{outOfStockProducts.length} out · {lowStockProducts.length} low</Badge>
            )}
          </div>
          {sale.products.length === 0 ? (
            <div style={{ padding: 14, background: tokens.bg.surfaceAlt, borderRadius: 8, textAlign: 'center', fontSize: 11, color: tokens.text.tertiary }}>
              No products assigned yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 180, overflowY: 'auto' }}>
              {sale.products.map(p => {
                const stockPct = (p.stock / Math.max(p.threshold * 4, 1)) * 100;
                const stockColor = p.stock === 0 ? tokens.status.error : p.stock <= p.threshold ? tokens.status.warning : tokens.status.success;
                return (
                  <div key={p.id} style={{
                    display: 'flex', gap: 8, alignItems: 'center',
                    padding: '6px 8px', borderRadius: 6, background: tokens.bg.surfaceAlt,
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 6, flexShrink: 0,
                      background: p.image ? `url(${p.image}) center/cover` : tokens.bg.surface,
                      border: `1px solid ${tokens.border.subtle}`,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: 9, color: tokens.text.tertiary }}>{p.brand} · {p.sku}</div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 60 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: stockColor }}>{p.stock} left</div>
                      <div style={{ fontSize: 9, color: tokens.text.tertiary }}>{p.sold}/{p.allocated} sold</div>
                    </div>
                    <div style={{ width: 4, height: 24, borderRadius: 2, background: tokens.bg.surface, overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
                      <div style={{ width: '100%', height: `${Math.min(100, stockPct)}%`, background: stockColor }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Sub-components ----------------------------- */

function CountdownUnit({ tokens, label, value, accent, pulse }: {
  tokens: AdminThemeTokens; label: string; value: number; accent: string; pulse?: boolean;
}) {
  return (
    <div style={{
      minWidth: 48, padding: '6px 8px', borderRadius: 8,
      background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
      textAlign: 'center',
    }}>
      <div className={pulse ? 'fs-pulse' : ''} style={{ fontSize: 16, fontWeight: 800, color: accent, fontFamily: 'ui-monospace, monospace', lineHeight: 1 }}>{String(value).padStart(2, '0')}</div>
      <div style={{ fontSize: 9, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function MetricTile({ tokens, label, value, hint, tone }: {
  tokens: AdminThemeTokens; label: string; value: string; hint?: string; tone?: 'info' | 'success' | 'warning';
}) {
  const color = tone === 'info' ? tokens.status.info : tone === 'success' ? tokens.status.success : tone === 'warning' ? tokens.status.warning : tokens.text.primary;
  return (
    <div style={{ padding: 10, borderRadius: 8, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}` }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
      {hint && <div style={{ fontSize: 9, color: tokens.text.tertiary, marginTop: 2 }}>{hint}</div>}
    </div>
  );
}

function KPIStrip({ tokens, label, value, tone, sub }: {
  tokens: AdminThemeTokens; label: string; value: string;
  tone: 'success' | 'info' | 'warning' | 'purple'; sub: string;
}) {
  const accent = tone === 'success' ? tokens.status.success : tone === 'info' ? tokens.status.info : tone === 'warning' ? tokens.status.warning : '#8B5CF6';
  return (
    <div style={{
      padding: 14, borderRadius: 12, background: tokens.bg.surface,
      border: `1px solid ${tokens.border.subtle}`, boxShadow: tokens.shadow.sm,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: accent }} />
      <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

/* ----------------------------- Builder Drawer ----------------------------- */

function FlashSaleBuilderDrawer({ tokens, open, sale, onClose, onSave }: {
  tokens: AdminThemeTokens;
  open: boolean;
  sale: FlashSale | null;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState(20);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showBanner, setShowBanner] = useState(true);
  const [showCountdown, setShowCountdown] = useState(true);
  const [showOnProductPage, setShowOnProductPage] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    if (open) {
      setStep(0);
      setName(sale?.name ?? '');
      setDiscountType(sale?.discountType ?? 'percentage');
      setDiscountValue(sale?.discountValue ?? 20);
      setStartDate(sale?.startDate?.slice(0, 16) ?? '');
      setEndDate(sale?.endDate?.slice(0, 16) ?? '');
      setShowBanner(sale?.showBanner ?? true);
      setShowCountdown(sale?.showCountdown ?? true);
      setShowOnProductPage(sale?.showOnProductPage ?? true);
      setSelectedProducts(new Set((sale?.products ?? []).map(p => p.id)));
      setProductSearch('');
    }
  }, [open, sale]);

  const filteredProducts = useMemo(() => {
    if (!productSearch) return PRODUCTS_POOL;
    const q = productSearch.toLowerCase();
    return PRODUCTS_POOL.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }, [productSearch]);

  const toggleProduct = useCallback((id: string) => {
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const projectedRevenue = useMemo(() => {
    return PRODUCTS_POOL.filter(p => selectedProducts.has(p.id)).reduce((sum, p) => {
      const discounted = discountType === 'percentage' ? p.price * (1 - discountValue / 100) : Math.max(0, p.price - discountValue);
      return sum + discounted * Math.min(p.stock, 30);
    }, 0);
  }, [selectedProducts, discountType, discountValue]);

  const steps = ['Details', 'Schedule', 'Products', 'Review'];

  return (
    <Drawer
      tokens={tokens}
      open={open}
      onClose={onClose}
      title={sale ? 'Edit Flash Sale' : 'New Flash Sale'}
      subtitle={sale?.name}
      width={640}
      footer={
        <>
          {step > 0 && <Button tokens={tokens} variant="ghost" onClick={() => setStep(s => s - 1)}>Back</Button>}
          <div style={{ flex: 1 }} />
          <Button tokens={tokens} variant="ghost" onClick={onClose}>Cancel</Button>
          {step < 3 ? (
            <Button tokens={tokens} variant="primary" onClick={() => setStep(s => s + 1)}>Continue</Button>
          ) : (
            <Button tokens={tokens} variant="primary" onClick={() => onSave(name || 'Untitled Sale')}>{sale ? 'Save Changes' : 'Create Sale'}</Button>
          )}
        </>
      }
    >
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 18 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: i < step ? tokens.status.success : i === step ? tokens.status.info : tokens.bg.surfaceAlt,
              color: i <= step ? tokens.bg.app : tokens.text.tertiary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, border: `2px solid ${i <= step ? 'transparent' : tokens.border.subtle}`,
            }}>{i < step ? '✓' : i + 1}</div>
            <span style={{ fontSize: 11, fontWeight: 600, color: i <= step ? tokens.text.primary : tokens.text.tertiary }}>{s}</span>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? tokens.status.success : tokens.border.subtle, borderRadius: 1 }} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input tokens={tokens} label="Sale Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Independence Day Sale" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Select tokens={tokens} label="Discount Type" value={discountType} onChange={e => setDiscountType(e.target.value as DiscountType)}
              options={[{ value: 'percentage', label: 'Percentage Off (%)' }, { value: 'flat', label: 'Flat ₹ Off' }]}
            />
            <Input tokens={tokens} label={discountType === 'percentage' ? 'Discount %' : 'Discount ₹'} type="number" value={String(discountValue)} onChange={e => setDiscountValue(Number(e.target.value))} />
          </div>
          <div style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8 }}>Display Options</div>
            <ToggleRow tokens={tokens} label="Homepage Banner" desc="Show promotional banner during sale period" checked={showBanner} onChange={setShowBanner} />
            <ToggleRow tokens={tokens} label="Countdown Timer" desc="Display live countdown on product pages" checked={showCountdown} onChange={setShowCountdown} />
            <ToggleRow tokens={tokens} label="Product Page Badge" desc="Show 'Flash Sale' badge on assigned products" checked={showOnProductPage} onChange={setShowOnProductPage} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input tokens={tokens} label="Start Date & Time" type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <Input tokens={tokens} label="End Date & Time" type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div style={{ padding: 12, borderRadius: 10, background: tokens.status.infoBg, border: `1px solid ${tokens.status.info}30` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: tokens.status.info, marginBottom: 4 }}>💡 Scheduling Tip</div>
            <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
              Flash sales perform best during 6 PM – 10 PM IST on weekdays and 11 AM – 9 PM on weekends. Avoid scheduling overlapping sales on the same product range.
            </div>
          </div>
          {startDate && endDate && (
            <div style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 6 }}>Duration Preview</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, marginBottom: 4 }}>
                {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)} days
              </div>
              <div style={{ fontSize: 11, color: tokens.text.tertiary }}>
                {new Date(startDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} → {new Date(endDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Input tokens={tokens} placeholder="Search products by name, brand, SKU…" value={productSearch} onChange={e => setProductSearch(e.target.value)} />
            <Badge tokens={tokens} tone="info">{selectedProducts.size} selected</Badge>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, padding: 4, borderRadius: 8, border: `1px solid ${tokens.border.subtle}` }}>
            {filteredProducts.map(p => {
              const sel = selectedProducts.has(p.id);
              const stockColor = p.stock === 0 ? tokens.status.error : p.stock <= p.threshold ? tokens.status.warning : tokens.status.success;
              return (
                <div key={p.id} onClick={() => toggleProduct(p.id)} style={{
                  display: 'flex', gap: 10, alignItems: 'center', padding: 8, borderRadius: 8,
                  background: sel ? tokens.status.infoBg : tokens.bg.surfaceAlt,
                  border: `1px solid ${sel ? tokens.status.info + '50' : tokens.border.subtle}`,
                  cursor: 'pointer', transition: 'all 120ms ease',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                    background: p.image ? `url(${p.image}) center/cover` : tokens.bg.surface,
                    border: `1px solid ${tokens.border.subtle}`,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary }}>{p.brand} · {p.sku} · ₹{p.price.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: stockColor }}>{p.stock} in stock</div>
                    <div style={{ fontSize: 9, color: tokens.text.tertiary }}>{p.stock <= p.threshold ? 'Low stock' : 'Available'}</div>
                  </div>
                  <div style={{
                    width: 18, height: 18, borderRadius: 5, border: `2px solid ${sel ? tokens.status.info : tokens.border.strong}`,
                    background: sel ? tokens.status.info : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: tokens.bg.app, fontSize: 11, fontWeight: 800,
                  }}>{sel ? '✓' : ''}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: 14, borderRadius: 10, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Campaign Summary</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: tokens.text.primary, marginBottom: 6 }}>{name || 'Untitled Sale'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
              <div><span style={{ color: tokens.text.tertiary }}>Discount:</span> <span style={{ fontWeight: 600, color: tokens.text.primary }}>{discountType === 'percentage' ? `${discountValue}%` : `₹${discountValue}`}</span></div>
              <div><span style={{ color: tokens.text.tertiary }}>Products:</span> <span style={{ fontWeight: 600, color: tokens.text.primary }}>{selectedProducts.size}</span></div>
              <div><span style={{ color: tokens.text.tertiary }}>Banner:</span> <span style={{ fontWeight: 600, color: showBanner ? tokens.status.success : tokens.text.tertiary }}>{showBanner ? 'On' : 'Off'}</span></div>
              <div><span style={{ color: tokens.text.tertiary }}>Countdown:</span> <span style={{ fontWeight: 600, color: showCountdown ? tokens.status.success : tokens.text.tertiary }}>{showCountdown ? 'On' : 'Off'}</span></div>
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: tokens.status.successBg, border: `1px solid ${tokens.status.success}30` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: tokens.status.success, marginBottom: 4 }}>💰 Revenue Projection</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, letterSpacing: '-0.02em' }}>{fmtINR(projectedRevenue)}</div>
            <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>If all allocated inventory sells out at the discounted price</div>
          </div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary, lineHeight: 1.5 }}>
            Once created, the sale will appear in the schedule. You can edit, duplicate, or delete it at any time before it goes live.
          </div>
        </div>
      )}
    </Drawer>
  );
}

function ToggleRow({ tokens, label, desc, checked, onChange }: {
  tokens: AdminThemeTokens; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 10px', marginBottom: 4, borderRadius: 8, cursor: 'pointer',
      background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{label}</div>
        <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{desc}</div>
      </div>
      <Toggle tokens={tokens} checked={checked} onChange={onChange} />
    </label>
  );
}
