/**
 * LNKICKS Enterprise Admin — Operations & System Control Center
 * ------------------------------------------------------------
 * Unified operations hub — one ecosystem view of:
 *  - Inventory Health (stock value, low/out, forecast)
 *  - Wallet (balance, pending payouts, transactions)
 *  - System Status (API, DB, storage, memory, CPU, uptime)
 *  - Security Alerts (failed logins, 2FA coverage, active sessions)
 *  - Recent Audit Logs (last 6 events with IP/device)
 *  - Recent Configuration Changes
 *  - User Activity (active admins, login times)
 *  - Quick Links to all 8 operations modules
 *
 * Inspired by AWS Console, Google Workspace Admin, Stripe Dashboard,
 * Shopify Plus Admin, Apple Business Manager, Microsoft Admin Center.
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Badge, Button, Panel, ProgressBar, useToast, Skeleton, Avatar, StatusPill,
} from '@/components/admin/ui';
import { getCurrentSession, listAdminUsers, getAuditLog } from '@/lib/admin/adminAuth';
import type { AdminUser } from '@/lib/admin/types';

/* ----------------------------- Types ----------------------------- */

interface KpiCard {
  label: string;
  value: string;
  delta: number;
  deltaLabel: string;
  trend: 'up' | 'down' | 'flat';
  accent: string;
  icon: string;
  sparkline: number[];
}

interface ServiceStatus {
  name: string;
  category: 'API' | 'Database' | 'Storage' | 'Background' | 'External';
  status: 'Operational' | 'Degraded' | 'Down' | 'Maintenance';
  latency: number; // ms
  uptime: number;  // %
  detail: string;
}

interface AuditRow {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  device: string;
  time: string;
  tone: 'success' | 'info' | 'warning' | 'critical' | 'neutral';
}

interface QuickLink {
  href: string;
  label: string;
  desc: string;
  icon: string;
  tone: string;
}

/* ----------------------------- Data ----------------------------- */

const KPIS: KpiCard[] = [
  { label: 'Inventory Value', value: '₹42.5L', delta: 4.2, deltaLabel: 'vs last week', trend: 'up', accent: '#10B981', icon: '📦', sparkline: [38, 39, 40, 41, 41.5, 42, 42.5] },
  { label: 'Wallet Outstanding', value: '₹1.42L', delta: -2.1, deltaLabel: 'vs yesterday', trend: 'down', accent: '#3B82F6', icon: '💳', sparkline: [1.6, 1.55, 1.5, 1.48, 1.46, 1.44, 1.42] },
  { label: 'Pending Payouts', value: '₹3.84L', delta: 8.4, deltaLabel: 'vs last week', trend: 'up', accent: '#F59E0B', icon: '⏳', sparkline: [2.9, 3.1, 3.2, 3.4, 3.5, 3.7, 3.84] },
  { label: 'API Uptime (30d)', value: '99.97%', delta: 0.03, deltaLabel: 'SLA 99.9%', trend: 'up', accent: '#8B5CF6', icon: '⚡', sparkline: [99.92, 99.94, 99.93, 99.95, 99.96, 99.97, 99.97] },
  { label: 'Security Score', value: '87/100', delta: 2, deltaLabel: 'vs last scan', trend: 'up', accent: '#EC4899', icon: '🛡️', sparkline: [82, 83, 84, 85, 85, 86, 87] },
  { label: 'Active Admins', value: '5', delta: 0, deltaLabel: '1 idle', trend: 'flat', accent: '#06B6D4', icon: '👥', sparkline: [4, 5, 5, 5, 5, 5, 5] },
];

const SERVICES: ServiceStatus[] = [
  { name: 'REST API', category: 'API', status: 'Operational', latency: 124, uptime: 99.97, detail: '12 endpoints' },
  { name: 'Webhook Dispatcher', category: 'API', status: 'Operational', latency: 89, uptime: 99.94, detail: '34 subscribers' },
  { name: 'Primary Database', category: 'Database', status: 'Operational', latency: 8, uptime: 99.99, detail: 'PostgreSQL 16 · 4.2 GB' },
  { name: 'Redis Cache', category: 'Database', status: 'Operational', latency: 2, uptime: 99.98, detail: '128 MB used' },
  { name: 'Object Storage', category: 'Storage', status: 'Operational', latency: 42, uptime: 99.95, detail: '12.8 GB / 100 GB' },
  { name: 'Background Queue', category: 'Background', status: 'Degraded', latency: 320, uptime: 99.20, detail: '8 jobs pending' },
  { name: 'Razorpay Gateway', category: 'External', status: 'Operational', latency: 210, uptime: 99.92, detail: 'Last sync 2m ago' },
  { name: 'Delhivery API', category: 'External', status: 'Operational', latency: 380, uptime: 99.85, detail: 'Last sync 6m ago' },
  { name: 'MSG91 SMS', category: 'External', status: 'Maintenance', latency: 0, uptime: 99.70, detail: 'Provider window 02:00–02:30 IST' },
];

const QUICK_LINKS: QuickLink[] = [
  { href: '/admin/inventory', label: 'Inventory', desc: 'Warehouse & stock', icon: '📦', tone: '#10B981' },
  { href: '/admin/wallet', label: 'Wallet', desc: 'Customer balances', icon: '💳', tone: '#3B82F6' },
  { href: '/settings-panel', label: 'Settings', desc: 'Configuration', icon: '⚙️', tone: '#6366F1' },
  { href: '/admin/audit', label: 'Audit Logs', desc: 'Activity trail', icon: '📋', tone: '#F59E0B' },
  { href: '/admin/roles', label: 'Roles & Permissions', desc: 'RBAC matrix', icon: '👥', tone: '#8B5CF6' },
  { href: '/admin/security', label: 'Security Center', desc: 'Login · 2FA · sessions', icon: '🛡️', tone: '#EC4899' },
  { href: '/admin/integrations', label: 'Integrations', desc: 'Gateways & APIs', icon: '🔌', tone: '#06B6D4' },
  { href: '/admin/system-health', label: 'System Health', desc: 'Live monitoring', icon: '📊', tone: '#EF4444' },
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

function actionTone(action: string): AuditRow['tone'] {
  if (action.includes('delete') || action.includes('failed') || action.includes('disable')) return 'critical';
  if (action.includes('create') || action.includes('approve') || action.includes('login')) return 'success';
  if (action.includes('update') || action.includes('refund')) return 'warning';
  if (action.includes('logout') || action.includes('view')) return 'neutral';
  return 'info';
}

/* ----------------------------- Sparkline ----------------------------- */

function Sparkline({ data, color, w = 88, h = 28 }: { data: number[]; color: string; w?: number; h?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const last = data[data.length - 1];
  const lastX = w;
  const lastY = h - ((last - min) / range) * (h - 4) - 2;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={2.4} fill={color} />
    </svg>
  );
}

/* ----------------------------- Page ----------------------------- */

export default function OperationsHomePage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [audits, setAudits] = useState<AuditRow[]>([]);
  const [activeUsers, setActiveUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    // Simulate brief loading skeleton for premium feel
    const t = setTimeout(() => {
      void getCurrentSession();
      const users = listAdminUsers();
      setActiveUsers(users);
      const raw = getAuditLog(50);
      const rows: AuditRow[] = raw.map(l => ({
        id: l.id,
        actor: l.actorName,
        action: l.action,
        target: l.target ?? '—',
        ip: l.ipAddress,
        device: l.userAgent?.substring(0, 28) ?? 'unknown',
        time: timeAgo(l.timestamp),
        tone: actionTone(l.action),
      }));
      setAudits(rows.slice(0, 8));
      setLoading(false);
    }, 280);
    return () => clearTimeout(t);
  }, []);

  const operationalCount = useMemo(() => SERVICES.filter(s => s.status === 'Operational').length, []);
  const degradedCount = useMemo(() => SERVICES.filter(s => s.status === 'Degraded').length, []);
  const maintenanceCount = useMemo(() => SERVICES.filter(s => s.status === 'Maintenance').length, []);
  const systemScore = useMemo(() => Math.round((operationalCount / SERVICES.length) * 100), [operationalCount]);

  return (
    <>
      <AdminLayout
        title="Operations Center"
        subtitle="Unified system & operations command center"
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations' }]}
      >
        <PageHeader
          tokens={tokens}
          title="Operations Control Center"
          subtitle="Monitor inventory, wallet, security, system health, and audit activity from a single pane of glass."
          breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations' }]}
          meta={
            <div style={{ display: 'flex', gap: 8 }}>
              <Badge tokens={tokens} tone="success" dot>{operationalCount} Operational</Badge>
              {degradedCount > 0 && <Badge tokens={tokens} tone="warning" dot>{degradedCount} Degraded</Badge>}
              {maintenanceCount > 0 && <Badge tokens={tokens} tone="info" dot>{maintenanceCount} Maintenance</Badge>}
            </div>
          }
          actions={
            <>
              <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'info', title: 'Refreshing…', message: 'Reloading system metrics.' })}>Refresh</Button>
              <Link href="/admin/system-health"><Button tokens={tokens} variant="primary" size="md">View System Health</Button></Link>
            </>
          }
        />

        {/* KPI Strip */}
        <div className="ops-kpi-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="ops-kpi-card">
                <Skeleton tokens={tokens} w="60%" h={10} />
                <div style={{ height: 8 }} />
                <Skeleton tokens={tokens} w="80%" h={20} />
                <div style={{ height: 8 }} />
                <Skeleton tokens={tokens} w="100%" h={28} />
              </div>
            ))
          ) : (
            KPIS.map((k, i) => (
              <div key={k.label} className="ops-kpi-card" style={{ animationDelay: `${i * 40}ms` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.4 }}>{k.label}</span>
                  <span style={{ fontSize: 16 }}>{k.icon}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>{k.value}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: k.trend === 'up' ? tokens.status.success : k.trend === 'down' ? tokens.status.error : tokens.text.tertiary, fontWeight: 600 }}>
                    <span>{k.trend === 'up' ? '↗' : k.trend === 'down' ? '↘' : '→'}</span>
                    <span>{k.delta > 0 ? '+' : ''}{k.delta}{k.label.includes('%') || k.label.includes('Score') ? '' : k.label.includes('₹') || k.label.includes('Value') || k.label.includes('Payouts') || k.label.includes('Outstanding') ? '' : '%'}</span>
                    <span style={{ color: tokens.text.tertiary, fontWeight: 400, marginLeft: 2 }}>{k.deltaLabel}</span>
                  </div>
                  <Sparkline data={k.sparkline} color={k.accent} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Two-column layout: System Status + Recent Audit */}
        <div className="ops-2col">
          {/* LEFT: System Status */}
          <Panel tokens={tokens} title="System Status" subtitle="Live service health across API, database, storage, and external providers"
            action={<Link href="/admin/system-health"><Button tokens={tokens} variant="ghost" size="sm">Open monitor →</Button></Link>}>
            {/* Score hero */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderRadius: 12, background: tokens.bg.surfaceAlt, marginBottom: 12 }}>
              <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke={tokens.border.subtle} strokeWidth="6" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke={systemScore >= 90 ? tokens.status.success : systemScore >= 70 ? tokens.status.warning : tokens.status.error} strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 28 * (systemScore / 100)} ${2 * Math.PI * 28}`}
                    strokeDashoffset={2 * Math.PI * 28 * 0.25}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: tokens.text.primary }}>{systemScore}</div>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>System Health Score</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>
                  {operationalCount}/{SERVICES.length} services operational · {degradedCount > 0 ? `${degradedCount} degraded` : 'no degraded services'} · last checked just now
                </div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  {SERVICES.slice(0, 6).map(s => (
                    <div key={s.name} title={`${s.name} — ${s.status}`} style={{
                      width: 10, height: 10, borderRadius: 3,
                      background: s.status === 'Operational' ? tokens.status.success : s.status === 'Degraded' ? tokens.status.warning : s.status === 'Maintenance' ? tokens.status.info : tokens.status.error,
                    }} />
                  ))}
                  <span style={{ fontSize: 10, color: tokens.text.tertiary, marginLeft: 4 }}>+{SERVICES.length - 6} more</span>
                </div>
              </div>
            </div>

            {/* Service list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
                    <Skeleton tokens={tokens} w="40%" h={10} />
                  </div>
                ))
              ) : (
                SERVICES.slice(0, 7).map(s => {
                  const statusColor = s.status === 'Operational' ? tokens.status.success : s.status === 'Degraded' ? tokens.status.warning : s.status === 'Maintenance' ? tokens.status.info : tokens.status.error;
                  return (
                    <div key={s.name} className="ops-svc-row" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt, gap: 12,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, boxShadow: `0 0 0 3px ${statusColor}25`, flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{s.detail}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{s.latency === 0 ? '—' : `${s.latency}ms`}</div>
                          <div style={{ fontSize: 9, color: tokens.text.tertiary }}>latency</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{s.uptime}%</div>
                          <div style={{ fontSize: 9, color: tokens.text.tertiary }}>uptime</div>
                        </div>
                        <StatusPill tokens={tokens} status={s.status} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Panel>

          {/* RIGHT: Recent Audit */}
          <Panel tokens={tokens} title="Recent Activity" subtitle="Latest admin actions across the system"
            action={<Link href="/admin/audit"><Button tokens={tokens} variant="ghost" size="sm">View all →</Button></Link>}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
                    <Skeleton tokens={tokens} w="70%" h={10} />
                  </div>
                ))}
              </div>
            ) : audits.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: tokens.text.tertiary, fontSize: 12 }}>No recent activity.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {audits.map((a, i) => {
                  const toneColor = a.tone === 'success' ? tokens.status.success : a.tone === 'warning' ? tokens.status.warning : a.tone === 'critical' ? tokens.status.error : a.tone === 'info' ? tokens.status.info : tokens.text.tertiary;
                  return (
                    <div key={a.id} className="ops-audit-row" style={{
                      display: 'flex', gap: 12, padding: '10px 4px',
                      borderBottom: i === audits.length - 1 ? 'none' : `1px solid ${tokens.border.subtle}`,
                      alignItems: 'flex-start',
                    }}>
                      <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: toneColor, marginTop: 2 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{a.actor}</span>
                          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: toneColor, padding: '2px 6px', borderRadius: 4, background: `${toneColor}15`, fontWeight: 600 }}>{a.action}</span>
                          <span style={{ fontSize: 10, color: tokens.text.tertiary, marginLeft: 'auto' }}>{a.time}</span>
                        </div>
                        <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 3, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <span>Target: <span style={{ color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{a.target}</span></span>
                          <span>IP: <span style={{ fontFamily: 'ui-monospace, monospace' }}>{a.ip}</span></span>
                          <span>{a.device}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>

        {/* Inventory + Wallet snapshot */}
        <div className="ops-2col" style={{ marginTop: 16 }}>
          <Panel tokens={tokens} title="Inventory Health" subtitle="Stock overview across warehouses"
            action={<Link href="/admin/inventory"><Button tokens={tokens} variant="ghost" size="sm">Open →</Button></Link>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 12 }}>
              <div style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Stock Value</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>₹42.5L</div>
                <div style={{ fontSize: 10, color: tokens.status.success, marginTop: 2 }}>↗ +4.2% WoW</div>
              </div>
              <div style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.4 }}>SKUs Tracked</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>248</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>across 3 warehouses</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: tokens.text.secondary }}>
                <span>In Stock</span><span style={{ fontWeight: 700, color: tokens.status.success }}>231 (93%)</span>
              </div>
              <ProgressBar tokens={tokens} value={93} color={tokens.status.success} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: tokens.text.secondary, marginTop: 4 }}>
                <span>Low Stock</span><span style={{ fontWeight: 700, color: tokens.status.warning }}>12 (5%)</span>
              </div>
              <ProgressBar tokens={tokens} value={5} color={tokens.status.warning} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: tokens.text.secondary, marginTop: 4 }}>
                <span>Out of Stock</span><span style={{ fontWeight: 700, color: tokens.status.error }}>5 (2%)</span>
              </div>
              <ProgressBar tokens={tokens} value={2} color={tokens.status.error} />
            </div>
            <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: `${tokens.status.warning}15`, border: `1px solid ${tokens.status.warning}30`, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
              <strong style={{ color: tokens.status.warning }}>⚠ Restock alert:</strong> 5 SKUs below threshold. Auto-PO enabled for top 3.
            </div>
          </Panel>

          <Panel tokens={tokens} title="Wallet & Payouts" subtitle="Customer wallet activity and pending settlements"
            action={<Link href="/admin/wallet"><Button tokens={tokens} variant="ghost" size="sm">Open →</Button></Link>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 12 }}>
              <div style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Outstanding</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>₹1.42L</div>
                <div style={{ fontSize: 10, color: tokens.status.success, marginTop: 2 }}>↘ -2.1% vs yesterday</div>
              </div>
              <div style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.4 }}>Pending Payouts</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>₹3.84L</div>
                <div style={{ fontSize: 10, color: tokens.status.warning, marginTop: 2 }}>14 settlements queued</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { id: 'SET-9182', amount: '₹84,200', status: 'Processing', tone: 'info' as const },
                { id: 'SET-9181', amount: '₹62,500', status: 'Pending', tone: 'warning' as const },
                { id: 'SET-9180', amount: '₹1,12,800', status: 'Completed', tone: 'success' as const },
                { id: 'SET-9179', amount: '₹48,900', status: 'Completed', tone: 'success' as const },
              ].map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 6, background: tokens.bg.surfaceAlt }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{s.id}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>2h ago · Razorpay X</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{s.amount}</span>
                    <Badge tokens={tokens} tone={s.tone} size="sm">{s.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Active admins + Security alerts */}
        <div className="ops-2col" style={{ marginTop: 16 }}>
          <Panel tokens={tokens} title="Active Admin Users" subtitle={`${activeUsers.length} team members with system access`}
            action={<Link href="/admin/roles"><Button tokens={tokens} variant="ghost" size="sm">Manage roles →</Button></Link>}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
                    <Skeleton tokens={tokens} w="50%" h={10} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {activeUsers.slice(0, 5).map(u => (
                  <div key={u.uid} className="ops-user-row" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt, gap: 10,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <Avatar tokens={tokens} name={u.name} size={32} color={u.avatarColor} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</span>
                          {u.twoFactorEnabled && <span title="2FA enabled" style={{ color: tokens.status.success }}>✓</span>}
                        </div>
                        <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>
                          {u.email} · last login {u.lastLoginAt ? timeAgo(u.lastLoginAt) : 'never'}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <Badge tokens={tokens} tone="neutral" size="sm">{u.role}</Badge>
                      <StatusPill tokens={tokens} status={u.isActive ? 'Active' : 'Disabled'} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel tokens={tokens} title="Security Alerts" subtitle="Recent security events requiring attention"
            action={<Link href="/admin/security"><Button tokens={tokens} variant="ghost" size="sm">Open center →</Button></Link>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="ops-sec-alert" style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: `${tokens.status.error}10`, border: `1px solid ${tokens.status.error}30` }}>
                <span style={{ fontSize: 16 }}>🚨</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>3 failed login attempts</div>
                  <div style={{ fontSize: 10, color: tokens.text.secondary, marginTop: 2 }}>IP 103.21.243.12 · 8 min ago · account locked</div>
                </div>
                <Badge tokens={tokens} tone="critical" size="sm">Critical</Badge>
              </div>
              <div className="ops-sec-alert" style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: `${tokens.status.warning}10`, border: `1px solid ${tokens.status.warning}30` }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>2FA not enabled for 2 admins</div>
                  <div style={{ fontSize: 10, color: tokens.text.secondary, marginTop: 2 }}>Warehouse Lead · Editor Staff</div>
                </div>
                <Badge tokens={tokens} tone="warning" size="sm">High</Badge>
              </div>
              <div className="ops-sec-alert" style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: `${tokens.status.info}10`, border: `1px solid ${tokens.status.info}30` }}>
                <span style={{ fontSize: 16 }}>🔑</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>New API key generated</div>
                  <div style={{ fontSize: 10, color: tokens.text.secondary, marginTop: 2 }}>Production API Key · by LNKICKS Founder · 1h ago</div>
                </div>
                <Badge tokens={tokens} tone="info" size="sm">Info</Badge>
              </div>
              <div className="ops-sec-alert" style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: `${tokens.status.success}10`, border: `1px solid ${tokens.status.success}30` }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>Security scan complete</div>
                  <div style={{ fontSize: 10, color: tokens.text.secondary, marginTop: 2 }}>Score: 87/100 · 0 critical issues</div>
                </div>
                <Badge tokens={tokens} tone="success" size="sm">Resolved</Badge>
              </div>
            </div>
          </Panel>
        </div>

        {/* Quick Links */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, marginBottom: 10, fontFamily: 'Inter, sans-serif' }}>Operations Modules</div>
          <div className="ops-quick-grid">
            {QUICK_LINKS.map((q, i) => (
              <Link key={q.href} href={q.href} className="ops-quick-card" style={{ animationDelay: `${i * 30}ms` }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${q.tone}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 10 }}>
                  {q.icon}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, marginBottom: 2 }}>{q.label}</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary }}>{q.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </AdminLayout>

      <style jsx>{`
        :global(.ops-kpi-grid) {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        :global(.ops-2col) {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 16px;
          align-items: start;
        }
        :global(.ops-kpi-card) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 14px;
          padding: 14px;
          box-shadow: ${tokens.shadow.sm};
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1),
                      box-shadow 240ms cubic-bezier(0.16,1,0.3,1),
                      border-color 240ms ease;
          animation: opsFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.ops-kpi-card:hover) {
          transform: translateY(-2px);
          box-shadow: ${tokens.shadow.md};
          border-color: ${tokens.border.strong};
        }
        :global(.ops-quick-grid) {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        :global(.ops-quick-card) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 14px;
          padding: 16px;
          box-shadow: ${tokens.shadow.sm};
          text-decoration: none;
          display: block;
          cursor: pointer;
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1),
                      box-shadow 240ms cubic-bezier(0.16,1,0.3,1),
                      border-color 240ms ease;
          animation: opsFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.ops-quick-card:hover) {
          transform: translateY(-2px);
          box-shadow: ${tokens.shadow.md};
          border-color: ${tokens.border.strong};
        }
        :global(.ops-svc-row), :global(.ops-audit-row), :global(.ops-user-row), :global(.ops-sec-alert) {
          transition: background 180ms ease;
        }
        :global(.ops-svc-row:hover), :global(.ops-user-row:hover) {
          background: ${tokens.bg.hover} !important;
        }
        @keyframes opsFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1400px) {
          :global(.ops-kpi-grid) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          :global(.ops-quick-grid) { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (max-width: 1100px) {
          :global(.ops-kpi-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          :global(.ops-2col) { grid-template-columns: minmax(0, 1fr); }
          :global(.ops-quick-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          :global(.ops-kpi-grid) { grid-template-columns: minmax(0, 1fr); }
          :global(.ops-quick-grid) { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
    </>
  );
}
