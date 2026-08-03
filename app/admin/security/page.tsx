/**
 * LNKICKS Enterprise Admin — Security Center
 * ------------------------------------------------------------
 * Enterprise security dashboard with:
 *  - Security Score gauge (0-100)
 *  - Login Activity (last 24h, with location)
 *  - Failed Login Attempts (with auto-lock status)
 *  - Active Sessions (live tokens, geolocation)
 *  - 2FA Status (per admin user)
 *  - API Tokens (active tokens with last-used)
 *  - Trusted Devices (per user)
 *  - Password Policy (configurable rules)
 *  - Critical Alerts (security events requiring attention)
 *
 * Inspired by AWS IAM, Google Workspace Security, Microsoft Entra,
 * Cloudflare Access, Okta Security.
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, Panel, useToast, Avatar,
  Toggle, Input, ProgressBar, Tabs,
} from '@/components/admin/ui';
import { listAdminUsers } from '@/lib/admin/adminAuth';
import type { AdminUser } from '@/lib/admin/types';

/* ----------------------------- Types ----------------------------- */

interface LoginEvent {
  id: string;
  user: string;
  email: string;
  success: boolean;
  ip: string;
  location: string;
  device: string;
  os: string;
  timestamp: number;
  method: 'password' | '2fa' | 'google' | 'otp';
}

interface ActiveSession {
  id: string;
  user: string;
  email: string;
  device: string;
  os: string;
  ip: string;
  location: string;
  startedAt: number;
  lastSeenAt: number;
  current: boolean;
}

interface ApiToken {
  id: string;
  name: string;
  token: string;
  scopes: string[];
  createdAt: number;
  lastUsed: number;
  status: 'Active' | 'Expired' | 'Revoked';
}

interface TrustedDevice {
  id: string;
  user: string;
  device: string;
  os: string;
  ip: string;
  location: string;
  trustedAt: number;
  lastSeen: number;
}

interface SecurityAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  detail: string;
  time: string;
  resolved: boolean;
}

/* ----------------------------- Data ----------------------------- */

const LOGIN_EVENTS: LoginEvent[] = Array.from({ length: 18 }, (_, i) => {
  const users = [
    { user: 'LNKICKS Founder', email: 'founder@lnkicks.com' },
    { user: 'Operations Manager', email: 'ops@lnkicks.com' },
    { user: 'Editor Staff', email: 'editor@lnkicks.com' },
    { user: 'Warehouse Lead', email: 'warehouse@lnkicks.com' },
    { user: 'unknown', email: 'attacker@external.io' },
  ];
  const u = users[i % users.length];
  const locs = [
    { city: 'Mumbai, IN', ip: '103.21.243.12' },
    { city: 'Bengaluru, IN', ip: '157.32.156.18' },
    { city: 'Delhi NCR, IN', ip: '49.36.82.214' },
    { city: 'Unknown, IN', ip: '45.227.18.142' },
    { city: 'Singapore, SG', ip: '128.199.84.21' },
  ];
  const loc = locs[i % locs.length];
  const devices = [
    { device: 'Desktop', os: 'macOS' },
    { device: 'Desktop', os: 'Windows' },
    { device: 'iPhone', os: 'iOS' },
    { device: 'Android', os: 'Android' },
  ];
  const d = devices[i % devices.length];
  const methods: LoginEvent['method'][] = ['password', '2fa', 'google', 'otp'];
  const success = i % 5 !== 4; // every 5th is a failure
  return {
    id: `login-${5000 + i}`,
    user: u.user,
    email: u.email,
    success,
    ip: loc.ip,
    location: loc.city,
    device: d.device,
    os: d.os,
    timestamp: Date.now() - i * 1800_000,
    method: methods[i % methods.length],
  };
});

const ACTIVE_SESSIONS: ActiveSession[] = [
  { id: 'sess-current', user: 'LNKICKS Founder', email: 'founder@lnkicks.com', device: 'Desktop', os: 'macOS', ip: '103.21.243.12', location: 'Mumbai, IN', startedAt: Date.now() - 2 * 3600_000, lastSeenAt: Date.now() - 30_000, current: true },
  { id: 'sess-2', user: 'Operations Manager', email: 'ops@lnkicks.com', device: 'Desktop', os: 'Windows', ip: '49.36.82.214', location: 'Delhi NCR, IN', startedAt: Date.now() - 5 * 3600_000, lastSeenAt: Date.now() - 4 * 60_000, current: false },
  { id: 'sess-3', user: 'Editor Staff', email: 'editor@lnkicks.com', device: 'iPhone', os: 'iOS', ip: '157.32.156.18', location: 'Bengaluru, IN', startedAt: Date.now() - 1 * 3600_000, lastSeenAt: Date.now() - 90_000, current: false },
  { id: 'sess-4', user: 'Warehouse Lead', email: 'warehouse@lnkicks.com', device: 'Android', os: 'Android', ip: '182.71.12.89', location: 'Hyderabad, IN', startedAt: Date.now() - 8 * 3600_000, lastSeenAt: Date.now() - 12 * 60_000, current: false },
];

const API_TOKENS: ApiToken[] = [
  { id: 'tok-1', name: 'Production API Key', token: 'lnk_live_sk_9876••••', scopes: ['read', 'write', 'webhooks'], createdAt: Date.now() - 200 * 86400_000, lastUsed: Date.now() - 2 * 3600_000, status: 'Active' },
  { id: 'tok-2', name: 'Test API Key', token: 'lnk_test_sk_1234••••', scopes: ['read', 'write'], createdAt: Date.now() - 200 * 86400_000, lastUsed: Date.now() - 5 * 86400_000, status: 'Active' },
  { id: 'tok-3', name: 'Webhook Secret', token: 'whsec_••••••••', scopes: ['webhooks'], createdAt: Date.now() - 180 * 86400_000, lastUsed: Date.now() - 1 * 3600_000, status: 'Active' },
  { id: 'tok-4', name: 'Mobile App Token', token: 'lnk_live_sk_5555••••', scopes: ['read'], createdAt: Date.now() - 365 * 86400_000, lastUsed: Date.now() - 90 * 86400_000, status: 'Expired' },
  { id: 'tok-5', name: 'Legacy Integration', token: 'lnk_live_sk_9999••••', scopes: ['read', 'write'], createdAt: Date.now() - 500 * 86400_000, lastUsed: Date.now() - 200 * 86400_000, status: 'Revoked' },
];

const TRUSTED_DEVICES: TrustedDevice[] = [
  { id: 'td-1', user: 'LNKICKS Founder', device: 'MacBook Pro', os: 'macOS', ip: '103.21.243.12', location: 'Mumbai, IN', trustedAt: Date.now() - 90 * 86400_000, lastSeen: Date.now() - 30_000 },
  { id: 'td-2', user: 'LNKICKS Founder', device: 'iPhone 15 Pro', os: 'iOS', ip: '103.21.243.12', location: 'Mumbai, IN', trustedAt: Date.now() - 60 * 86400_000, lastSeen: Date.now() - 6 * 3600_000 },
  { id: 'td-3', user: 'Operations Manager', device: 'Windows Desktop', os: 'Windows', ip: '49.36.82.214', location: 'Delhi NCR, IN', trustedAt: Date.now() - 45 * 86400_000, lastSeen: Date.now() - 4 * 60_000 },
  { id: 'td-4', user: 'Editor Staff', device: 'iPhone 14', os: 'iOS', ip: '157.32.156.18', location: 'Bengaluru, IN', trustedAt: Date.now() - 30 * 86400_000, lastSeen: Date.now() - 90_000 },
];

const SECURITY_ALERTS: SecurityAlert[] = [
  { id: 'sa-1', severity: 'Critical', title: '3 failed login attempts', detail: 'IP 45.227.18.142 · 8 min ago · account locked', time: '8m ago', resolved: false },
  { id: 'sa-2', severity: 'High', title: '2FA not enabled for 2 admins', detail: 'Warehouse Lead · Editor Staff', time: '1h ago', resolved: false },
  { id: 'sa-3', severity: 'Medium', title: 'Login from new location', detail: 'Editor Staff · Singapore, SG · unfamiliar IP', time: '3h ago', resolved: false },
  { id: 'sa-4', severity: 'Medium', title: 'API token expired', detail: 'Mobile App Token · expired 90 days ago', time: '5h ago', resolved: false },
  { id: 'sa-5', severity: 'Low', title: 'New API key generated', detail: 'Production API Key · by LNKICKS Founder', time: '1d ago', resolved: true },
  { id: 'sa-6', severity: 'Low', title: 'Password changed', detail: 'Operations Manager · password rotation', time: '2d ago', resolved: true },
];

/* ----------------------------- Helpers ----------------------------- */

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function calculateSecurityScore(users: AdminUser[]): { score: number; breakdown: { label: string; score: number; max: number; tone: 'success' | 'warning' | 'critical' }[] } {
  const total = users.length || 1;
  const twoFaCount = users.filter(u => u.twoFactorEnabled).length;
  const twoFaPct = (twoFaCount / total) * 100;

  // Score breakdown (out of 100)
  const twoFaScore = Math.round(twoFaPct * 0.3);                   // 30 max
  const sessionScore = 22;                                          // sessions enforced (assumed)
  const passwordScore = 18;                                         // password policy (assumed default)
  const ipScore = 8;                                                // IP restrictions not enabled
  const auditScore = 12;                                            // audit logging on
  const failedLoginProtection = 5;                                  // 5 max — failed login lockout enabled

  const total2 = twoFaScore + sessionScore + passwordScore + ipScore + auditScore + failedLoginProtection;
  return {
    score: total2,
    breakdown: [
      { label: '2FA Coverage', score: twoFaScore, max: 30, tone: twoFaPct === 100 ? 'success' : twoFaPct >= 50 ? 'warning' : 'critical' },
      { label: 'Session Management', score: sessionScore, max: 22, tone: 'success' },
      { label: 'Password Policy', score: passwordScore, max: 20, tone: 'warning' },
      { label: 'IP Restrictions', score: ipScore, max: 10, tone: 'critical' },
      { label: 'Audit Logging', score: auditScore, max: 13, tone: 'success' },
      { label: 'Failed Login Protection', score: failedLoginProtection, max: 5, tone: 'success' },
    ],
  };
}

/* ----------------------------- Page ----------------------------- */

type Tab = 'overview' | 'logins' | 'sessions' | 'tokens' | 'devices' | 'policy';

export default function SecurityPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    const t = setTimeout(() => {
      setUsers(listAdminUsers());
    }, 240);
    return () => clearTimeout(t);
  }, []);

  const secScore = useMemo(() => calculateSecurityScore(users), [users]);
  const failedLogins = useMemo(() => LOGIN_EVENTS.filter(e => !e.success), []);
  const successfulLogins = useMemo(() => LOGIN_EVENTS.filter(e => e.success), []);
  const unresolvedAlerts = useMemo(() => SECURITY_ALERTS.filter(a => !a.resolved), []);
  const criticalAlerts = useMemo(() => unresolvedAlerts.filter(a => a.severity === 'Critical' || a.severity === 'High'), []);

  const handleRevokeSession = useCallback((id: string) => {
    pushToast({ tone: 'success', title: 'Session revoked', message: `Session ${id} terminated` });
  }, [pushToast]);

  const handleRevokeToken = useCallback((id: string) => {
    pushToast({ tone: 'warning', title: 'Token revoked', message: `Token ${id} no longer valid` });
  }, [pushToast]);

  const handleResolveAlert = useCallback((id: string) => {
    pushToast({ tone: 'success', title: 'Alert resolved', message: id });
  }, [pushToast]);

  return (
    <AdminLayout
      title="Security Center"
      subtitle="Login activity, sessions, and threat monitoring"
      requirePermission="audit.view"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Security' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Security Center"
        subtitle="Monitor login activity, manage active sessions, audit API tokens, configure password policy, and respond to security alerts."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Security' }]}
        meta={
          <div style={{ display: 'flex', gap: 8 }}>
            <Badge tokens={tokens} tone={secScore.score >= 80 ? 'success' : secScore.score >= 60 ? 'warning' : 'critical'} dot>Score {secScore.score}/100</Badge>
            {criticalAlerts.length > 0 && <Badge tokens={tokens} tone="critical" dot>{criticalAlerts.length} critical</Badge>}
          </div>
        }
        actions={<Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'info', title: 'Security scan started', message: 'Full audit running in background' })}>Run Security Scan</Button>}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'logins', label: 'Login Activity', badge: LOGIN_EVENTS.length },
          { key: 'sessions', label: 'Active Sessions', badge: ACTIVE_SESSIONS.length },
          { key: 'tokens', label: 'API Tokens', badge: API_TOKENS.filter(t => t.status === 'Active').length },
          { key: 'devices', label: 'Trusted Devices', badge: TRUSTED_DEVICES.length },
          { key: 'policy', label: 'Password Policy' },
        ]} active={tab} onChange={(t) => setTab(t as Tab)} />
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <>
          {/* Score + Alerts */}
          <div className="sec-2col" style={{ marginBottom: 16 }}>
            {/* Score gauge */}
            <Panel tokens={tokens} title="Security Score" subtitle="Composite score across 6 dimensions">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke={tokens.border.subtle} strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none"
                      stroke={secScore.score >= 80 ? tokens.status.success : secScore.score >= 60 ? tokens.status.warning : tokens.status.error}
                      strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 50 * (secScore.score / 100)} ${2 * Math.PI * 50}`}
                      strokeDashoffset={2 * Math.PI * 50 * 0.25}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: tokens.text.primary }}>{secScore.score}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: -2 }}>/ 100</div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary }}>
                    {secScore.score >= 80 ? 'Strong security posture' : secScore.score >= 60 ? 'Moderate — needs improvement' : 'Weak — immediate action required'}
                  </div>
                  <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 4, lineHeight: 1.5 }}>
                    {criticalAlerts.length > 0 ? `${criticalAlerts.length} critical alert${criticalAlerts.length !== 1 ? 's' : ''} require attention. ` : ''}
                    {users.filter(u => !u.twoFactorEnabled).length} of {users.length} admins do not have 2FA enabled.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {secScore.breakdown.map(b => (
                  <div key={b.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: tokens.text.secondary }}>{b.label}</span>
                      <span style={{ color: tokens.text.primary, fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>{b.score}/{b.max}</span>
                    </div>
                    <ProgressBar tokens={tokens} value={(b.score / b.max) * 100}
                      color={b.tone === 'success' ? tokens.status.success : b.tone === 'warning' ? tokens.status.warning : tokens.status.error}
                      height={5} />
                  </div>
                ))}
              </div>
            </Panel>

            {/* Critical alerts */}
            <Panel tokens={tokens} title="Security Alerts" subtitle={`${unresolvedAlerts.length} unresolved`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SECURITY_ALERTS.slice(0, 5).map(a => {
                  const sevColor = a.severity === 'Critical' ? tokens.status.error : a.severity === 'High' ? tokens.status.warning : a.severity === 'Medium' ? tokens.status.info : tokens.text.tertiary;
                  return (
                    <div key={a.id} className="sec-alert" style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: a.resolved ? tokens.bg.surfaceAlt : `${sevColor}10`, border: `1px solid ${a.resolved ? tokens.border.subtle : `${sevColor}30`}` }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{a.severity === 'Critical' ? '🚨' : a.severity === 'High' ? '⚠️' : a.severity === 'Medium' ? 'ℹ️' : '✓'}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{a.title}</span>
                          <Badge tokens={tokens} tone={a.severity === 'Critical' ? 'critical' : a.severity === 'High' ? 'warning' : a.severity === 'Medium' ? 'info' : 'neutral'} size="sm">{a.severity}</Badge>
                          {a.resolved && <Badge tokens={tokens} tone="success" size="sm">Resolved</Badge>}
                        </div>
                        <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{a.detail}</div>
                        <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{a.time}</div>
                      </div>
                      {!a.resolved && <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleResolveAlert(a.id)}>Resolve</Button>}
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          {/* Quick stats */}
          <div className="sec-stat-grid">
            <div className="sec-stat-card" style={{ borderTop: `3px solid ${tokens.status.success}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Successful Logins (24h)</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.success, marginTop: 4 }}>{successfulLogins.length}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>across {new Set(successfulLogins.map(l => l.user)).size} users</div>
            </div>
            <div className="sec-stat-card" style={{ borderTop: `3px solid ${tokens.status.error}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Failed Logins (24h)</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.error, marginTop: 4 }}>{failedLogins.length}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>from {new Set(failedLogins.map(l => l.ip)).size} IPs</div>
            </div>
            <div className="sec-stat-card" style={{ borderTop: `3px solid ${tokens.status.info}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Active Sessions</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>{ACTIVE_SESSIONS.length}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>across {new Set(ACTIVE_SESSIONS.map(s => s.location)).size} locations</div>
            </div>
            <div className="sec-stat-card" style={{ borderTop: `3px solid ${tokens.status.warning}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>2FA Coverage</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.warning, marginTop: 4 }}>{Math.round((users.filter(u => u.twoFactorEnabled).length / Math.max(users.length, 1)) * 100)}%</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{users.filter(u => u.twoFactorEnabled).length}/{users.length} admins</div>
            </div>
            <div className="sec-stat-card" style={{ borderTop: `3px solid ${tokens.text.accent}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Active API Tokens</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>{API_TOKENS.filter(t => t.status === 'Active').length}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{API_TOKENS.filter(t => t.status === 'Expired').length} expired</div>
            </div>
            <div className="sec-stat-card" style={{ borderTop: `3px solid ${tokens.status.success}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Trusted Devices</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>{TRUSTED_DEVICES.length}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>across {new Set(TRUSTED_DEVICES.map(d => d.user)).size} users</div>
            </div>
          </div>
        </>
      )}

      {/* Login Activity */}
      {tab === 'logins' && (
        <Panel tokens={tokens} title="Login Activity (Last 24 Hours)" subtitle="Every login attempt across admin accounts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {LOGIN_EVENTS.map(e => {
              const sevColor = e.success ? tokens.status.success : tokens.status.error;
              return (
                <div key={e.id} className="sec-login-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${sevColor}15`, color: sevColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                    {e.success ? '✓' : '✕'}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{e.user}</span>
                      <Badge tokens={tokens} tone="neutral" size="sm">{e.method.toUpperCase()}</Badge>
                      {!e.success && <Badge tokens={tokens} tone="critical" size="sm">Failed</Badge>}
                    </div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>
                      {e.email} · {e.ip} · {e.location} · {e.device} {e.os}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: tokens.text.primary, fontWeight: 600 }}>{timeAgo(e.timestamp)}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{new Date(e.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Active Sessions */}
      {tab === 'sessions' && (
        <Panel tokens={tokens} title="Active Sessions" subtitle="Currently logged-in admin sessions"
          action={<Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'warning', title: 'Revoke all other sessions?', message: 'This will sign out all other devices.' })}>Revoke All Others</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ACTIVE_SESSIONS.map(s => (
              <div key={s.id} className="sec-session-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 10, background: s.current ? `${tokens.status.success}10` : tokens.bg.surfaceAlt, border: s.current ? `1px solid ${tokens.status.success}30` : `1px solid ${tokens.border.subtle}` }}>
                <Avatar tokens={tokens} name={s.user} size={40} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{s.user}</span>
                    {s.current && <Badge tokens={tokens} tone="success" size="sm" dot>Current</Badge>}
                  </div>
                  <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{s.email} · {s.device} {s.os} · {s.ip}</div>
                  <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>Started {timeAgo(s.startedAt)} · last seen {timeAgo(s.lastSeenAt)} · {s.location}</div>
                </div>
                {!s.current && <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleRevokeSession(s.id)}>Revoke</Button>}
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* API Tokens */}
      {tab === 'tokens' && (
        <Panel tokens={tokens} title="API Tokens" subtitle="Active, expired, and revoked API tokens"
          action={<Button tokens={tokens} variant="primary" size="sm" onClick={() => pushToast({ tone: 'success', title: 'Token created', message: 'Copy now — shown only once' })}>+ Generate Token</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {API_TOKENS.map(t => {
              const statusColor = t.status === 'Active' ? tokens.status.success : t.status === 'Expired' ? tokens.status.warning : tokens.status.error;
              return (
                <div key={t.id} className="sec-token-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${statusColor}15`, color: statusColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🔑</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{t.name}</span>
                      <StatusPill tokens={tokens} status={t.status} />
                    </div>
                    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: tokens.text.secondary, marginTop: 3 }}>{t.token}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      {t.scopes.map(s => <Badge key={s} tokens={tokens} tone="info" size="sm">{s}</Badge>)}
                    </div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>Created {timeAgo(t.createdAt)} · last used {timeAgo(t.lastUsed)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Copied', message: t.name })}>Copy</Button>
                    {t.status === 'Active' && <Button tokens={tokens} variant="ghost" size="sm" onClick={() => handleRevokeToken(t.id)}>Revoke</Button>}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Trusted Devices */}
      {tab === 'devices' && (
        <Panel tokens={tokens} title="Trusted Devices" subtitle="Devices that have been verified for skip-2FA">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TRUSTED_DEVICES.map(d => (
              <div key={d.id} className="sec-device-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: tokens.bg.surface, color: tokens.text.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {d.os === 'iOS' ? '📱' : d.os === 'Android' ? '📱' : '💻'}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{d.device}</span>
                    <Badge tokens={tokens} tone="neutral" size="sm">{d.os}</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{d.user} · {d.ip} · {d.location}</div>
                  <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>Trusted {timeAgo(d.trustedAt)} · last seen {timeAgo(d.lastSeen)}</div>
                </div>
                <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'warning', title: 'Device untrusted', message: d.device })}>Untrust</Button>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Password Policy */}
      {tab === 'policy' && (
        <div className="sec-2col">
          <Panel tokens={tokens} title="Password Policy" subtitle="Rules enforced for all admin passwords">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <PolicyRow tokens={tokens} label="Minimum length" value="12 characters" />
              <PolicyRow tokens={tokens} label="Uppercase letter" value="Required" checked />
              <PolicyRow tokens={tokens} label="Lowercase letter" value="Required" checked />
              <PolicyRow tokens={tokens} label="Number" value="Required" checked />
              <PolicyRow tokens={tokens} label="Special character" value="Required" checked />
              <PolicyRow tokens={tokens} label="Password history" value="Last 5 passwords blocked" />
              <PolicyRow tokens={tokens} label="Password expiry" value="90 days" />
              <PolicyRow tokens={tokens} label="Max login attempts" value="5 attempts · 15 min lockout" />
            </div>
          </Panel>
          <Panel tokens={tokens} title="Session & Access Policy" subtitle="Session timeout and IP restrictions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>Session Timeout</div>
                  <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>Auto-logout after inactivity</div>
                </div>
                <Input tokens={tokens} type="number" defaultValue="8" style={{ width: 70 }} />
              </div>
              <ToggleRow tokens={tokens} label="Force 2FA for all admins" desc="Require TOTP on every admin login" checked={false} />
              <ToggleRow tokens={tokens} label="IP Whitelist" desc="Only allow admin login from specific IPs" checked={false} />
              <Input tokens={tokens} label="Allowed IPs (comma separated)" placeholder="103.21.243.12, 49.36.82.214" />
              <ToggleRow tokens={tokens} label="Activity Logging" desc="Log all admin actions to audit trail" checked={true} />
              <ToggleRow tokens={tokens} label="Failed Login Alerts" desc="Email admins on repeated failed logins" checked={true} />
              <ToggleRow tokens={tokens} label="Password Rotation" desc="Force password change every 90 days" checked={false} />
            </div>
          </Panel>
        </div>
      )}

      <style jsx>{`
        :global(.sec-stat-grid) {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
        }
        :global(.sec-stat-card) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 12px;
          padding: 12px;
          box-shadow: ${tokens.shadow.sm};
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1), box-shadow 240ms cubic-bezier(0.16,1,0.3,1);
          animation: secFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.sec-stat-card:hover) {
          transform: translateY(-2px);
          box-shadow: ${tokens.shadow.md};
        }
        :global(.sec-2col) {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 16px;
          align-items: start;
        }
        :global(.sec-login-row), :global(.sec-session-row), :global(.sec-token-row), :global(.sec-device-row) {
          transition: background 180ms ease;
        }
        :global(.sec-login-row:hover), :global(.sec-session-row:hover), :global(.sec-token-row:hover), :global(.sec-device-row:hover) {
          background: ${tokens.bg.hover} !important;
        }
        @keyframes secFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1400px) {
          :global(.sec-stat-grid) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 1100px) {
          :global(.sec-stat-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          :global(.sec-2col) { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 640px) {
          :global(.sec-stat-grid) { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
    </AdminLayout>
  );
}

/* ----------------------------- Helpers ----------------------------- */

function PolicyRow({ tokens, label, value, checked }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; label: string; value: string; checked?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{label}</div>
        <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{value}</div>
      </div>
      {checked !== undefined && <Toggle tokens={tokens} checked={checked} onChange={() => {}} />}
    </div>
  );
}

function ToggleRow({ tokens, label, desc, checked }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; label: string; desc: string; checked: boolean }) {
  const [enabled, setEnabled] = useState(checked);
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt, cursor: 'pointer' }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{label}</div>
        <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{desc}</div>
      </div>
      <Toggle tokens={tokens} checked={enabled} onChange={setEnabled} />
    </label>
  );
}
