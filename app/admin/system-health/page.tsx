/**
 * LNKICKS Enterprise Admin — System Health Monitor
 * ------------------------------------------------------------
 * Live system monitoring with:
 *  - Overall system score gauge
 *  - API Status (12 endpoints with latency + uptime)
 *  - Database (primary + cache, connection pool, queries/sec)
 *  - Storage (object storage, logs, backups usage)
 *  - Memory (RAM + swap with process breakdown)
 *  - CPU (per-core load with top processes)
 *  - Background Jobs (queues + workers)
 *  - Cron Jobs (scheduled tasks with last run)
 *  - Backups (recent + scheduled)
 *  - Logs (application, error, access — last entries)
 *
 * Inspired by AWS CloudWatch, Datadog, New Relic, Grafana,
 * Vercel Dashboard, Microsoft Azure Monitor.
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, Panel, useToast, ProgressBar, Tabs,
} from '@/components/admin/ui';

/* ----------------------------- Types ----------------------------- */

interface ServiceStatus {
  id: string;
  name: string;
  category: 'API' | 'Database' | 'Storage' | 'Memory' | 'CPU' | 'External';
  status: 'Operational' | 'Degraded' | 'Down' | 'Maintenance';
  latency: number;
  uptime: number;
  detail: string;
  history: number[]; // last 12 data points
}

interface MetricCard {
  label: string;
  value: string;
  unit: string;
  pct: number;
  tone: 'success' | 'warning' | 'critical';
  trend: number[];
  detail: string;
}

interface BackgroundJob {
  id: string;
  name: string;
  queue: string;
  pending: number;
  processing: number;
  failed: number;
  completed: number;
  avgDuration: number;
  status: 'Healthy' | 'Busy' | 'Stalled' | 'Failing';
}

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: number;
  nextRun: number;
  duration: number;
  status: 'Success' | 'Failed' | 'Running' | 'Skipped';
}

interface Backup {
  id: string;
  type: 'auto' | 'manual';
  size: string;
  startedAt: number;
  duration: string;
  status: 'Completed' | 'Running' | 'Failed';
}

interface LogEntry {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
  timestamp: number;
}

/* ----------------------------- Data ----------------------------- */

const SERVICES: ServiceStatus[] = [
  { id: 's-1', name: 'REST API', category: 'API', status: 'Operational', latency: 124, uptime: 99.97, detail: '12 endpoints · v2.4.1', history: [110, 115, 120, 118, 122, 119, 124, 121, 125, 123, 124, 124] },
  { id: 's-2', name: 'Webhook Dispatcher', category: 'API', status: 'Operational', latency: 89, uptime: 99.94, detail: '34 subscribers', history: [82, 85, 88, 90, 87, 89, 91, 88, 90, 89, 89, 89] },
  { id: 's-3', name: 'Auth Service', category: 'API', status: 'Operational', latency: 42, uptime: 99.99, detail: 'JWT + OTP', history: [38, 40, 42, 41, 43, 42, 44, 41, 42, 43, 42, 42] },
  { id: 's-4', name: 'Payment Gateway', category: 'API', status: 'Operational', latency: 210, uptime: 99.92, detail: 'Razorpay + Stripe', history: [200, 205, 215, 208, 212, 210, 218, 215, 210, 212, 210, 210] },
  { id: 's-5', name: 'Primary Database', category: 'Database', status: 'Operational', latency: 8, uptime: 99.99, detail: 'PostgreSQL 16 · 4.2 GB', history: [6, 7, 8, 7, 8, 9, 8, 7, 8, 8, 8, 8] },
  { id: 's-6', name: 'Redis Cache', category: 'Database', status: 'Operational', latency: 2, uptime: 99.98, detail: '128 MB used of 512 MB', history: [2, 2, 3, 2, 2, 2, 3, 2, 2, 2, 2, 2] },
  { id: 's-7', name: 'Object Storage', category: 'Storage', status: 'Operational', latency: 42, uptime: 99.95, detail: '12.8 GB / 100 GB', history: [38, 40, 42, 41, 43, 42, 44, 41, 42, 43, 42, 42] },
  { id: 's-8', name: 'CDN', category: 'Storage', status: 'Operational', latency: 18, uptime: 99.96, detail: 'Cloudflare · 4 edge locations', history: [16, 17, 18, 17, 18, 19, 18, 17, 18, 18, 18, 18] },
  { id: 's-9', name: 'Background Queue', category: 'API', status: 'Degraded', latency: 320, uptime: 99.20, detail: '8 jobs pending · 2 workers', history: [180, 220, 280, 320, 350, 380, 360, 340, 320, 310, 315, 320] },
  { id: 's-10', name: 'Razorpay Gateway', category: 'External', status: 'Operational', latency: 210, uptime: 99.92, detail: 'Last sync 2m ago', history: [200, 205, 215, 208, 212, 210, 218, 215, 210, 212, 210, 210] },
  { id: 's-11', name: 'Delhivery API', category: 'External', status: 'Operational', latency: 380, uptime: 99.85, detail: 'Last sync 6m ago', history: [350, 360, 380, 370, 390, 380, 400, 390, 380, 385, 380, 380] },
  { id: 's-12', name: 'MSG91 SMS', category: 'External', status: 'Maintenance', latency: 0, uptime: 99.70, detail: 'Provider window 02:00–02:30 IST', history: [90, 95, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
];

const METRICS: MetricCard[] = [
  { label: 'CPU Usage', value: '34', unit: '%', pct: 34, tone: 'success', trend: [28, 30, 32, 31, 33, 35, 34, 32, 33, 34, 34, 34], detail: '8 cores · load avg 0.42' },
  { label: 'Memory', value: '4.2', unit: 'GB', pct: 53, tone: 'success', trend: [3.8, 3.9, 4.0, 4.1, 4.2, 4.2, 4.1, 4.2, 4.2, 4.2, 4.2, 4.2], detail: '8 GB total · 4.2 GB used' },
  { label: 'Database Size', value: '4.2', unit: 'GB', pct: 42, tone: 'success', trend: [3.8, 3.9, 4.0, 4.0, 4.1, 4.1, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2], detail: '10 GB limit · 5.8 GB free' },
  { label: 'Storage Used', value: '12.8', unit: 'GB', pct: 13, tone: 'success', trend: [11.5, 11.8, 12.0, 12.2, 12.4, 12.5, 12.6, 12.7, 12.8, 12.8, 12.8, 12.8], detail: '100 GB limit · 87.2 GB free' },
  { label: 'API Latency (p95)', value: '142', unit: 'ms', pct: 28, tone: 'success', trend: [128, 132, 138, 135, 140, 145, 142, 138, 140, 142, 142, 142], detail: 'SLA: <500ms · healthy' },
  { label: 'Error Rate', value: '0.04', unit: '%', pct: 4, tone: 'success', trend: [0.05, 0.04, 0.05, 0.03, 0.04, 0.05, 0.04, 0.04, 0.04, 0.04, 0.04, 0.04], detail: '12 errors / 30k requests' },
  { label: 'Active Connections', value: '142', unit: '', pct: 35, tone: 'success', trend: [120, 128, 135, 140, 145, 148, 142, 138, 140, 142, 142, 142], detail: '400 max pool · 258 free' },
  { label: 'Queue Depth', value: '8', unit: '', pct: 16, tone: 'warning', trend: [4, 6, 8, 12, 16, 14, 10, 8, 6, 8, 8, 8], detail: '2 workers · 4 jobs/worker' },
];

const BACKGROUND_JOBS: BackgroundJob[] = [
  { id: 'j-1', name: 'Order Confirmation Email', queue: 'emails', pending: 0, processing: 2, failed: 0, completed: 482, avgDuration: 320, status: 'Healthy' },
  { id: 'j-2', name: 'Payment Settlement', queue: 'finance', pending: 0, processing: 1, failed: 0, completed: 142, avgDuration: 1240, status: 'Healthy' },
  { id: 'j-3', name: 'Inventory Sync', queue: 'inventory', pending: 8, processing: 1, failed: 2, completed: 89, avgDuration: 890, status: 'Busy' },
  { id: 'j-4', name: 'Webhook Dispatch', queue: 'webhooks', pending: 0, processing: 4, failed: 0, completed: 1240, avgDuration: 180, status: 'Healthy' },
  { id: 'j-5', name: 'Sitemap Regeneration', queue: 'maintenance', pending: 0, processing: 0, failed: 0, completed: 12, avgDuration: 4200, status: 'Healthy' },
  { id: 'j-6', name: 'SEO Score Recalculation', queue: 'maintenance', pending: 4, processing: 0, failed: 0, completed: 8, avgDuration: 8200, status: 'Stalled' },
  { id: 'j-7', name: 'Abandoned Cart Recovery', queue: 'emails', pending: 12, processing: 2, failed: 1, completed: 67, avgDuration: 540, status: 'Busy' },
  { id: 'j-8', name: 'Daily Sales Report', queue: 'reports', pending: 0, processing: 0, failed: 0, completed: 1, avgDuration: 12400, status: 'Healthy' },
];

const CRON_JOBS: CronJob[] = [
  { id: 'c-1', name: 'Daily Database Backup', schedule: '0 3 * * *', lastRun: Date.now() - 5 * 3600_000, nextRun: Date.now() + 19 * 3600_000, duration: 142, status: 'Success' },
  { id: 'c-2', name: 'Sitemap Regeneration', schedule: '0 */6 * * *', lastRun: Date.now() - 2 * 3600_000, nextRun: Date.now() + 4 * 3600_000, duration: 18, status: 'Success' },
  { id: 'c-3', name: 'Low Stock Alert', schedule: '*/30 * * * *', lastRun: Date.now() - 18 * 60_000, nextRun: Date.now() + 12 * 60_000, duration: 4, status: 'Success' },
  { id: 'c-4', name: 'Daily Sales Report', schedule: '0 9 * * *', lastRun: Date.now() - 14 * 3600_000, nextRun: Date.now() + 10 * 3600_000, duration: 12, status: 'Success' },
  { id: 'c-5', name: 'Settlement Payout', schedule: '0 12 * * *', lastRun: Date.now() - 11 * 3600_000, nextRun: Date.now() + 13 * 3600_000, duration: 38, status: 'Success' },
  { id: 'c-6', name: 'Email Digest Send', schedule: '0 8 * * 1', lastRun: Date.now() - 3 * 86400_000, nextRun: Date.now() + 4 * 86400_000, duration: 84, status: 'Success' },
  { id: 'c-7', name: 'SEO Audit Scan', schedule: '0 2 * * 1', lastRun: Date.now() - 3 * 86400_000, nextRun: Date.now() + 4 * 86400_000, duration: 420, status: 'Failed' },
  { id: 'c-8', name: 'Cache Warmup', schedule: '0 1 * * *', lastRun: Date.now() - 7 * 3600_000, nextRun: Date.now() + 17 * 3600_000, duration: 28, status: 'Success' },
];

const BACKUPS: Backup[] = [
  { id: 'bk-1', type: 'auto', size: '24.8 MB', startedAt: Date.now() - 5 * 3600_000, duration: '2m 22s', status: 'Completed' },
  { id: 'bk-2', type: 'manual', size: '24.5 MB', startedAt: Date.now() - 26 * 3600_000, duration: '2m 18s', status: 'Completed' },
  { id: 'bk-3', type: 'auto', size: '24.2 MB', startedAt: Date.now() - 29 * 3600_000, duration: '2m 15s', status: 'Completed' },
  { id: 'bk-4', type: 'auto', size: '23.9 MB', startedAt: Date.now() - 53 * 3600_000, duration: '2m 12s', status: 'Completed' },
  { id: 'bk-5', type: 'auto', size: '23.6 MB', startedAt: Date.now() - 77 * 3600_000, duration: '2m 8s', status: 'Completed' },
];

const LOGS: LogEntry[] = [
  { id: 'l-1', level: 'error', source: 'webhook-dispatcher', message: 'Webhook delivery failed for endpoint https://api.erp.com/lnkicks/sync — HTTP 500 (3 retries)', timestamp: Date.now() - 4 * 60_000 },
  { id: 'l-2', level: 'warn', source: 'inventory-sync', message: 'Inventory sync took 8.2s (threshold 5s) for SKU-1002', timestamp: Date.now() - 8 * 60_000 },
  { id: 'l-3', level: 'info', source: 'auth', message: 'Admin user founder@lnkicks.com logged in from 103.21.243.12', timestamp: Date.now() - 12 * 60_000 },
  { id: 'l-4', level: 'info', source: 'payment', message: 'Razorpay settlement SET-9180 completed · net ₹1,10,544', timestamp: Date.now() - 18 * 60_000 },
  { id: 'l-5', level: 'warn', source: 'rate-limiter', message: 'IP 45.227.18.142 rate-limited (5 failed login attempts)', timestamp: Date.now() - 22 * 60_000 },
  { id: 'l-6', level: 'error', source: 'cron', message: 'Cron job "SEO Audit Scan" failed — exit code 1 · check config', timestamp: Date.now() - 28 * 60_000 },
  { id: 'l-7', level: 'info', source: 'cache', message: 'Redis cache warmed · 1,242 keys · 128 MB', timestamp: Date.now() - 35 * 60_000 },
  { id: 'l-8', level: 'debug', source: 'api', message: 'GET /api/products?limit=20 — 124ms · cache hit', timestamp: Date.now() - 42 * 60_000 },
  { id: 'l-9', level: 'info', source: 'email', message: 'Order confirmation email sent to aarav.s@email.com (ORD-4976)', timestamp: Date.now() - 48 * 60_000 },
  { id: 'l-10', level: 'warn', source: 'inventory', message: 'SKU-1004 Jordan 4 Bred stock below threshold (4/5)', timestamp: Date.now() - 52 * 60_000 },
];

/* ----------------------------- Helpers ----------------------------- */

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function timeUntil(ts: number): string {
  const diff = ts - Date.now();
  if (diff < 0) return timeAgo(ts);
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `in ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `in ${h}h`;
  const d = Math.floor(h / 24);
  return `in ${d}d`;
}

/* ----------------------------- Sparkline ----------------------------- */

function Sparkline({ data, color, w = 100, h = 24 }: { data: number[]; color: string; w?: number; h?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ----------------------------- Page ----------------------------- */

type Tab = 'overview' | 'services' | 'jobs' | 'cron' | 'backups' | 'logs';

export default function SystemHealthPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [tab, setTab] = useState<Tab>('overview');
  const [tick, setTick] = useState(0);

  // Live "tick" — increments every 5s to simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const operationalCount = useMemo(() => SERVICES.filter(s => s.status === 'Operational').length, []);
  const degradedCount = useMemo(() => SERVICES.filter(s => s.status === 'Degraded').length, []);
  const maintenanceCount = useMemo(() => SERVICES.filter(s => s.status === 'Maintenance').length, []);
  const systemScore = useMemo(() => Math.round((operationalCount / SERVICES.length) * 100), [operationalCount]);

  // Apply small jitter to latencies on each tick (visual "live" feel)
  const liveServices = useMemo(() => SERVICES.map(s => ({
    ...s,
    latency: s.status === 'Maintenance' ? 0 : Math.max(1, s.latency + Math.round((Math.sin(tick + s.id.length) * 8))),
  })), [tick]);

  return (
    <AdminLayout
      title="System Health"
      subtitle="Live infrastructure monitoring"
      requirePermission="audit.view"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'System Health' }]}
    >
      <PageHeader
        tokens={tokens}
        title="System Health Monitor"
        subtitle="Real-time monitoring of API, database, storage, memory, CPU, queues, cron jobs, backups, and application logs."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'System Health' }]}
        meta={
          <div style={{ display: 'flex', gap: 8 }}>
            <Badge tokens={tokens} tone="success" dot>{operationalCount} operational</Badge>
            {degradedCount > 0 && <Badge tokens={tokens} tone="warning" dot>{degradedCount} degraded</Badge>}
            {maintenanceCount > 0 && <Badge tokens={tokens} tone="info" dot>{maintenanceCount} maintenance</Badge>}
            <Badge tokens={tokens} tone="neutral" dot>live · updates every 5s</Badge>
          </div>
        }
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'info', title: 'Refreshed', message: 'All metrics re-fetched' })}>Refresh</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'success', title: 'Incident resolved', message: 'All systems operational' })}>Mark All Operational</Button>
          </>
        }
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'services', label: 'Services', badge: SERVICES.length },
          { key: 'jobs', label: 'Background Jobs', badge: BACKGROUND_JOBS.length },
          { key: 'cron', label: 'Cron Jobs', badge: CRON_JOBS.length },
          { key: 'backups', label: 'Backups', badge: BACKUPS.length },
          { key: 'logs', label: 'Logs', badge: LOGS.length },
        ]} active={tab} onChange={(t) => setTab(t as Tab)} />
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <>
          {/* Score + Live metrics */}
          <div className="sys-2col" style={{ marginBottom: 16 }}>
            <Panel tokens={tokens} title="System Health Score" subtitle="Aggregated across all services">
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
                <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="60" fill="none" stroke={tokens.border.subtle} strokeWidth="12" />
                    <circle cx="70" cy="70" r="60" fill="none"
                      stroke={systemScore >= 90 ? tokens.status.success : systemScore >= 70 ? tokens.status.warning : tokens.status.error}
                      strokeWidth="12"
                      strokeDasharray={`${2 * Math.PI * 60 * (systemScore / 100)} ${2 * Math.PI * 60}`}
                      strokeDashoffset={2 * Math.PI * 60 * 0.25}
                      strokeLinecap="round"
                      transform="rotate(-90 70 70)" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{systemScore}</div>
                    <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: -2 }}>/ 100</div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: tokens.text.primary }}>
                    {systemScore >= 90 ? 'All systems operational' : systemScore >= 70 ? 'Minor degradation detected' : 'Major outage — investigate'}
                  </div>
                  <div style={{ fontSize: 12, color: tokens.text.secondary, marginTop: 4, lineHeight: 1.5 }}>
                    {operationalCount} of {SERVICES.length} services operational · {degradedCount} degraded · {maintenanceCount} in maintenance window
                  </div>
                  <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
                    <div style={{ padding: 8, borderRadius: 8, background: `${tokens.status.success}15` }}>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Uptime (30d)</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: tokens.status.success, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>99.97%</div>
                    </div>
                    <div style={{ padding: 8, borderRadius: 8, background: `${tokens.status.info}15` }}>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Avg Latency</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>142ms</div>
                    </div>
                    <div style={{ padding: 8, borderRadius: 8, background: `${tokens.status.warning}15` }}>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Error Rate</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>0.04%</div>
                    </div>
                    <div style={{ padding: 8, borderRadius: 8, background: `${tokens.bg.surfaceAlt}` }}>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Last Incident</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, marginTop: 2 }}>14 days ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel tokens={tokens} title="Live Metrics" subtitle="Updated every 5 seconds">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                {METRICS.slice(0, 6).map(m => {
                  const toneColor = m.tone === 'success' ? tokens.status.success : m.tone === 'warning' ? tokens.status.warning : tokens.status.error;
                  return (
                    <div key={m.label} className="sys-metric-card" style={{ padding: 10, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>{m.label}</span>
                        <Sparkline data={m.trend} color={toneColor} w={48} h={16} />
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>
                        {m.value}<span style={{ fontSize: 10, color: tokens.text.tertiary, marginLeft: 2 }}>{m.unit}</span>
                      </div>
                      <div style={{ fontSize: 9, color: tokens.text.tertiary, marginTop: 2 }}>{m.detail}</div>
                      <ProgressBar tokens={tokens} value={m.pct} color={toneColor} height={3} />
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          {/* Service grid */}
          <Panel tokens={tokens} title="Service Status" subtitle="Live status across all services"
            action={<Button tokens={tokens} variant="ghost" size="sm" onClick={() => setTab('services')}>View all →</Button>}>
            <div className="sys-svc-grid">
              {liveServices.slice(0, 8).map(s => {
                const statusColor = s.status === 'Operational' ? tokens.status.success : s.status === 'Degraded' ? tokens.status.warning : s.status === 'Maintenance' ? tokens.status.info : tokens.status.error;
                return (
                  <div key={s.id} className="sys-svc-card" style={{ borderTop: `3px solid ${statusColor}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{s.name}</span>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor, boxShadow: `0 0 0 3px ${statusColor}25` }} />
                    </div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginBottom: 6 }}>{s.category} · {s.detail}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: tokens.text.secondary }}>
                      <span>Latency: <strong style={{ color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{s.latency === 0 ? '—' : `${s.latency}ms`}</strong></span>
                      <span>Uptime: <strong style={{ color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{s.uptime}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </>
      )}

      {/* Services tab */}
      {tab === 'services' && (
        <Panel tokens={tokens} title="All Services" subtitle="Detailed status for every monitored service">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {liveServices.map(s => {
              const statusColor = s.status === 'Operational' ? tokens.status.success : s.status === 'Degraded' ? tokens.status.warning : s.status === 'Maintenance' ? tokens.status.info : tokens.status.error;
              return (
                <div key={s.id} className="sys-svc-detail" style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1.5fr) 90px 90px 1fr 130px 100px', gap: 12, padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt, alignItems: 'center' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, boxShadow: `0 0 0 3px ${statusColor}25` }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{s.name}</span>
                    </div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2, marginLeft: 16 }}>{s.detail}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Latency</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{s.latency === 0 ? '—' : `${s.latency}ms`}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Uptime</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{s.uptime}%</div>
                  </div>
                  <div><Sparkline data={s.history} color={statusColor} w={100} h={22} /></div>
                  <StatusPill tokens={tokens} status={s.status} />
                  <Button tokens={tokens} variant="ghost" size="sm">Details</Button>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Background Jobs */}
      {tab === 'jobs' && (
        <Panel tokens={tokens} title="Background Jobs" subtitle="Queue health and worker stats">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BACKGROUND_JOBS.map(j => {
              const statusColor = j.status === 'Healthy' ? tokens.status.success : j.status === 'Busy' ? tokens.status.warning : j.status === 'Stalled' ? tokens.status.info : tokens.status.error;
              return (
                <div key={j.id} className="sys-job-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 80px 80px 80px 80px 100px 100px', gap: 12, padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt, alignItems: 'center' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{j.name}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>queue: {j.queue}</div>
                  </div>
                  <div><div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Pending</div><div style={{ fontSize: 12, fontWeight: 700, color: j.pending > 5 ? tokens.status.warning : tokens.text.primary, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{j.pending}</div></div>
                  <div><div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Processing</div><div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{j.processing}</div></div>
                  <div><div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Failed</div><div style={{ fontSize: 12, fontWeight: 700, color: j.failed > 0 ? tokens.status.error : tokens.text.primary, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{j.failed}</div></div>
                  <div><div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Completed</div><div style={{ fontSize: 12, fontWeight: 700, color: tokens.status.success, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{j.completed}</div></div>
                  <div><div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Avg Duration</div><div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{j.avgDuration}ms</div></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor }} />
                    <span style={{ fontSize: 11, color: tokens.text.secondary, fontWeight: 600 }}>{j.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Cron Jobs */}
      {tab === 'cron' && (
        <Panel tokens={tokens} title="Cron Jobs" subtitle="Scheduled tasks and execution history">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {CRON_JOBS.map(c => {
              const statusColor = c.status === 'Success' ? tokens.status.success : c.status === 'Failed' ? tokens.status.error : c.status === 'Running' ? tokens.status.info : tokens.status.warning;
              return (
                <div key={c.id} className="sys-cron-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 130px 130px 100px 100px', gap: 12, padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt, alignItems: 'center' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>schedule: {c.schedule}</div>
                  </div>
                  <div><div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Last Run</div><div style={{ fontSize: 11, color: tokens.text.primary, fontWeight: 600, marginTop: 2 }}>{timeAgo(c.lastRun)}</div></div>
                  <div><div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Next Run</div><div style={{ fontSize: 11, color: tokens.text.primary, fontWeight: 600, marginTop: 2 }}>{timeUntil(c.nextRun)}</div></div>
                  <div><div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Duration</div><div style={{ fontSize: 11, color: tokens.text.primary, fontWeight: 700, fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>{c.duration}s</div></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor }} />
                    <span style={{ fontSize: 11, color: tokens.text.secondary, fontWeight: 600 }}>{c.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Backups */}
      {tab === 'backups' && (
        <Panel tokens={tokens} title="Database Backups" subtitle="Recent backups and restore points"
          action={<Button tokens={tokens} variant="primary" size="sm" onClick={() => pushToast({ tone: 'success', title: 'Backup started', message: 'Will complete in 2-3 minutes' })}>+ Create Backup</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BACKUPS.map(b => (
              <div key={b.id} className="sys-backup-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt, gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${tokens.status.success}15`, color: tokens.status.success, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>💾</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{b.id}</span>
                      <Badge tokens={tokens} tone={b.type === 'auto' ? 'info' : 'neutral'} size="sm">{b.type}</Badge>
                      <StatusPill tokens={tokens} status={b.status} />
                    </div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{b.size} · started {timeAgo(b.startedAt)} · duration {b.duration}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Restore started', message: 'This will take 5-10 minutes' })}>Restore</Button>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'success', title: 'Download started' })}>Download</Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Logs */}
      {tab === 'logs' && (
        <Panel tokens={tokens} title="Application Logs" subtitle="Recent log entries across all services"
          action={<Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'success', title: 'Export started', message: 'Logs exporting to text file' })}>Export</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {LOGS.map(l => {
              const levelColor = l.level === 'error' ? tokens.status.error : l.level === 'warn' ? tokens.status.warning : l.level === 'info' ? tokens.status.info : tokens.text.tertiary;
              return (
                <div key={l.id} className="sys-log-row" style={{ display: 'flex', gap: 10, padding: '8px 10px', borderRadius: 6, background: l.level === 'error' ? `${tokens.status.error}08` : 'transparent', borderBottom: `1px solid ${tokens.border.subtle}`, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 9, fontWeight: 700, color: levelColor, textTransform: 'uppercase', padding: '2px 5px', borderRadius: 3, background: `${levelColor}15`, flexShrink: 0, marginTop: 1, minWidth: 44, textAlign: 'center' }}>{l.level}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 11, color: tokens.text.primary, lineHeight: 1.5 }}>
                      <span style={{ fontFamily: 'ui-monospace, monospace', color: tokens.text.tertiary, fontSize: 10 }}>[{l.source}]</span> {l.message}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: tokens.text.tertiary, flexShrink: 0 }}>{timeAgo(l.timestamp)}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      <style jsx>{`
        :global(.sys-2col) {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 16px;
          align-items: start;
        }
        :global(.sys-svc-grid) {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }
        :global(.sys-metric-card) {
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1), box-shadow 240ms cubic-bezier(0.16,1,0.3,1);
        }
        :global(.sys-metric-card:hover) {
          transform: translateY(-1px);
        }
        :global(.sys-svc-card) {
          background: ${tokens.bg.surfaceAlt};
          border-radius: 10px;
          padding: 10px 12px;
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1), box-shadow 240ms cubic-bezier(0.16,1,0.3,1);
          animation: sysFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.sys-svc-card:hover) {
          transform: translateY(-2px);
          box-shadow: ${tokens.shadow.md};
        }
        :global(.sys-svc-detail), :global(.sys-job-row), :global(.sys-cron-row), :global(.sys-backup-row), :global(.sys-log-row) {
          transition: background 180ms ease;
        }
        :global(.sys-svc-detail:hover), :global(.sys-job-row:hover), :global(.sys-cron-row:hover), :global(.sys-backup-row:hover) {
          background: ${tokens.bg.hover} !important;
        }
        @keyframes sysFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1400px) {
          :global(.sys-svc-grid) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 1100px) {
          :global(.sys-2col) { grid-template-columns: minmax(0, 1fr); }
          :global(.sys-svc-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          :global(.sys-svc-detail) { grid-template-columns: 1fr !important; gap: 6px; }
          :global(.sys-job-row) { grid-template-columns: 1fr 1fr !important; gap: 6px; }
          :global(.sys-cron-row) { grid-template-columns: 1fr !important; gap: 6px; }
        }
        @media (max-width: 640px) {
          :global(.sys-svc-grid) { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
    </AdminLayout>
  );
}
