/**
 * LNKICKS Enterprise Admin — Integrations Center
 * ------------------------------------------------------------
 * Central hub for all third-party integrations:
 *  - Payment Gateways (Razorpay, Stripe, PayPal, PhonePe)
 *  - Shipping Providers (BlueDart, Delhivery, DTDC, Shiprocket)
 *  - Email (SendGrid, SES, Mailgun, Postmark)
 *  - SMS (MSG91, Twilio, Gupshup, TextLocal)
 *  - WhatsApp (WhatsApp Business API)
 *  - Google (Analytics, Search Console, Merchant Center, Ads)
 *  - Meta (Facebook Pixel, Conversions API, Instagram)
 *  - Analytics (Microsoft Clarity, Hotjar, Mixpanel)
 *  - ERP / CRM connectors (Shiprocket, Razorpay X)
 *  - API Tokens (manage keys)
 *  - Webhooks (configure endpoints + view recent deliveries)
 *
 * Inspired by AWS Marketplace, Shopify App Store, Stripe Apps,
 * Microsoft AppSource, Zapier.
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, SearchInput, Tabs, useToast, Panel,
  Drawer, Input, Select, Skeleton, Toggle,
} from '@/components/admin/ui';

/* ----------------------------- Types ----------------------------- */

interface Integration {
  id: string;
  name: string;
  category: 'Payments' | 'Shipping' | 'Email' | 'SMS' | 'WhatsApp' | 'Google' | 'Meta' | 'Analytics' | 'ERP' | 'CRM';
  icon: string;
  desc: string;
  status: 'Connected' | 'Disconnected' | 'Error' | 'Pending';
  lastSync?: number;
  categoryColor: string;
  scopes?: string[];
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  status: 'Active' | 'Paused' | 'Failing';
  lastDelivery: number;
  deliveries24h: number;
  successRate: number;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  status: 'Success' | 'Failed' | 'Pending';
  responseCode: number;
  duration: number;
  timestamp: number;
}

/* ----------------------------- Data ----------------------------- */

const INTEGRATIONS: Integration[] = [
  // Payments
  { id: 'razorpay', name: 'Razorpay', category: 'Payments', icon: '💳', desc: 'UPI, cards, netbanking, wallets', status: 'Connected', lastSync: Date.now() - 2 * 60_000, categoryColor: '#3B82F6', scopes: ['payments.read', 'payments.write', 'refunds.write'] },
  { id: 'stripe', name: 'Stripe', category: 'Payments', icon: '💳', desc: 'International cards, Apple Pay, Google Pay', status: 'Connected', lastSync: Date.now() - 5 * 60_000, categoryColor: '#3B82F6', scopes: ['charges.read', 'charges.write'] },
  { id: 'paypal', name: 'PayPal', category: 'Payments', icon: '🅿️', desc: 'International payments in 200+ countries', status: 'Disconnected', categoryColor: '#3B82F6' },
  { id: 'phonepe', name: 'PhonePe', category: 'Payments', icon: '📱', desc: 'UPI payments via PhonePe', status: 'Disconnected', categoryColor: '#3B82F6' },
  // Shipping
  { id: 'bluedart', name: 'BlueDart', category: 'Shipping', icon: '📦', desc: 'Express courier delivery', status: 'Connected', lastSync: Date.now() - 6 * 60_000, categoryColor: '#F59E0B' },
  { id: 'delhivery', name: 'Delhivery', category: 'Shipping', icon: '📦', desc: 'Pan-India logistics network', status: 'Connected', lastSync: Date.now() - 12 * 60_000, categoryColor: '#F59E0B' },
  { id: 'dtdc', name: 'DTDC', category: 'Shipping', icon: '📦', desc: 'Domestic and international courier', status: 'Connected', lastSync: Date.now() - 18 * 60_000, categoryColor: '#F59E0B' },
  { id: 'shiprocket', name: 'Shiprocket', category: 'Shipping', icon: '🚀', desc: 'Multi-carrier shipping aggregation', status: 'Connected', lastSync: Date.now() - 4 * 60_000, categoryColor: '#F59E0B', scopes: ['orders.read', 'orders.write', 'shipments.write'] },
  // Email
  { id: 'sendgrid', name: 'SendGrid', category: 'Email', icon: '✉️', desc: 'Transactional email delivery', status: 'Connected', lastSync: Date.now() - 60_000, categoryColor: '#8B5CF6', scopes: ['mail.send', 'mail.read'] },
  { id: 'ses', name: 'Amazon SES', category: 'Email', icon: '✉️', desc: 'Scalable email service', status: 'Disconnected', categoryColor: '#8B5CF6' },
  { id: 'mailgun', name: 'Mailgun', category: 'Email', icon: '✉️', desc: 'Email API for developers', status: 'Disconnected', categoryColor: '#8B5CF6' },
  // SMS
  { id: 'msg91', name: 'MSG91', category: 'SMS', icon: '💬', desc: 'OTP and notification SMS', status: 'Connected', lastSync: Date.now() - 90_000, categoryColor: '#10B981', scopes: ['sms.send'] },
  { id: 'twilio', name: 'Twilio', category: 'SMS', icon: '💬', desc: 'Programmable SMS and voice', status: 'Disconnected', categoryColor: '#10B981' },
  { id: 'gupshup', name: 'Gupshup', category: 'SMS', icon: '💬', desc: 'Enterprise messaging', status: 'Disconnected', categoryColor: '#10B981' },
  // WhatsApp
  { id: 'whatsapp', name: 'WhatsApp Business API', category: 'WhatsApp', icon: '🟢', desc: 'Order updates via WhatsApp', status: 'Disconnected', categoryColor: '#22C55E' },
  // Google
  { id: 'ga4', name: 'Google Analytics 4', category: 'Google', icon: '📊', desc: 'Web analytics & user behavior', status: 'Connected', lastSync: Date.now() - 30_000, categoryColor: '#EAB308', scopes: ['analytics.read'] },
  { id: 'gsc', name: 'Google Search Console', category: 'Google', icon: '🔍', desc: 'Search performance & indexing', status: 'Connected', lastSync: Date.now() - 2 * 3600_000, categoryColor: '#EAB308' },
  { id: 'gmc', name: 'Google Merchant Center', category: 'Google', icon: '🛍️', desc: 'Product feed for Shopping ads', status: 'Disconnected', categoryColor: '#EAB308' },
  { id: 'google-ads', name: 'Google Ads', category: 'Google', icon: '🎯', desc: 'Search and display advertising', status: 'Disconnected', categoryColor: '#EAB308' },
  // Meta
  { id: 'fb-pixel', name: 'Facebook Pixel', category: 'Meta', icon: '👍', desc: 'Meta ad attribution tracking', status: 'Connected', lastSync: Date.now() - 45_000, categoryColor: '#6366F1' },
  { id: 'ig', name: 'Instagram Shopping', category: 'Meta', icon: '📸', desc: 'Tag products in Instagram posts', status: 'Disconnected', categoryColor: '#6366F1' },
  // Analytics
  { id: 'clarity', name: 'Microsoft Clarity', category: 'Analytics', icon: '🎯', desc: 'Session recordings & heatmaps', status: 'Connected', lastSync: Date.now() - 5 * 60_000, categoryColor: '#06B6D4' },
  { id: 'hotjar', name: 'Hotjar', category: 'Analytics', icon: '🔥', desc: 'Behavior analytics & feedback', status: 'Disconnected', categoryColor: '#06B6D4' },
  // ERP / CRM
  { id: 'razorpay-x', name: 'Razorpay X (Payouts)', category: 'ERP', icon: '💸', desc: 'Automated vendor payouts', status: 'Disconnected', categoryColor: '#EF4444' },
  { id: 'zoho', name: 'Zoho Inventory', category: 'ERP', icon: '📚', desc: 'Sync stock with Zoho ERP', status: 'Disconnected', categoryColor: '#EF4444' },
];

const WEBHOOKS: Webhook[] = [
  { id: 'wh-1', url: 'https://api.partner.com/webhooks/lnkicks/orders', events: ['order.created', 'order.updated', 'order.cancelled'], secret: 'whsec_••••••••8a3b', status: 'Active', lastDelivery: Date.now() - 2 * 60_000, deliveries24h: 142, successRate: 99.3 },
  { id: 'wh-2', url: 'https://hooks.zapier.com/lnkicks/capture', events: ['customer.created', 'order.paid'], secret: 'whsec_••••••••91fd', status: 'Active', lastDelivery: Date.now() - 8 * 60_000, deliveries24h: 67, successRate: 100 },
  { id: 'wh-3', url: 'https://api.erp.com/lnkicks/sync', events: ['product.updated', 'inventory.adjusted'], secret: 'whsec_••••••••72c1', status: 'Failing', lastDelivery: Date.now() - 2 * 3600_000, deliveries24h: 38, successRate: 76.3 },
  { id: 'wh-4', url: 'https://crm.example.com/lnkicks/customers', events: ['customer.updated', 'customer.deleted'], secret: 'whsec_••••••••44de', status: 'Paused', lastDelivery: Date.now() - 3 * 86400_000, deliveries24h: 0, successRate: 0 },
];

const WEBHOOK_DELIVERIES: WebhookDelivery[] = Array.from({ length: 20 }, (_, i) => {
  const events = ['order.created', 'order.updated', 'order.paid', 'order.cancelled', 'customer.created', 'product.updated', 'inventory.adjusted'];
  const statuses: WebhookDelivery['status'][] = i % 11 === 0 ? ['Failed'] : i % 17 === 0 ? ['Pending'] : ['Success'];
  const codes = statuses[0] === 'Failed' ? [500, 502, 503, 408] : [200, 200, 200, 201];
  return {
    id: `del-${5000 + i}`,
    webhookId: WEBHOOKS[i % WEBHOOKS.length].id,
    event: events[i % events.length],
    status: statuses[0],
    responseCode: codes[i % codes.length],
    duration: 80 + (i * 37) % 480,
    timestamp: Date.now() - i * 6 * 60_000,
  };
});

const CATEGORIES = ['All', 'Payments', 'Shipping', 'Email', 'SMS', 'WhatsApp', 'Google', 'Meta', 'Analytics', 'ERP', 'CRM'] as const;

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

/* ----------------------------- Page ----------------------------- */

type Tab = 'integrations' | 'webhooks' | 'apikeys' | 'deliveries';

export default function IntegrationsPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [tab, setTab] = useState<Tab>('integrations');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('All');
  const [configTarget, setConfigTarget] = useState<Integration | null>(null);
  const [webhookOpen, setWebhookOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(t);
  }, []);

  const filteredIntegrations = useMemo(() => INTEGRATIONS.filter(i => {
    if (category !== 'All' && i.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!i.name.toLowerCase().includes(q) && !i.desc.toLowerCase().includes(q) && !i.category.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [category, search]);

  const stats = useMemo(() => ({
    total: INTEGRATIONS.length,
    connected: INTEGRATIONS.filter(i => i.status === 'Connected').length,
    error: INTEGRATIONS.filter(i => i.status === 'Error').length,
    pending: INTEGRATIONS.filter(i => i.status === 'Pending').length,
    webhooksActive: WEBHOOKS.filter(w => w.status === 'Active').length,
    webhooksFailing: WEBHOOKS.filter(w => w.status === 'Failing').length,
  }), []);

  const handleToggleIntegration = useCallback((_id: string, name: string, currentStatus: Integration['status']) => {
    if (currentStatus === 'Connected') {
      pushToast({ tone: 'warning', title: 'Integration disconnected', message: name });
    } else {
      pushToast({ tone: 'success', title: 'Integration connected', message: name });
    }
  }, [pushToast]);

  return (
    <AdminLayout
      title="Integrations"
      subtitle="Third-party services & API connectors"
      requirePermission="settings.manage"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Integrations' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Integration Center"
        subtitle="Connect payment gateways, shipping providers, communication channels, analytics, and ERP/CRM systems from one place."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Operations', href: '/admin/operations' }, { label: 'Integrations' }]}
        meta={
          <div style={{ display: 'flex', gap: 8 }}>
            <Badge tokens={tokens} tone="success" dot>{stats.connected} connected</Badge>
            {stats.error > 0 && <Badge tokens={tokens} tone="critical" dot>{stats.error} error</Badge>}
            <Badge tokens={tokens} tone="info">{stats.total - stats.connected} available</Badge>
          </div>
        }
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => setWebhookOpen(true)}>+ New Webhook</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'success', title: 'Browse marketplace', message: 'Opening integrations catalog' })}>Browse Catalog</Button>
          </>
        }
      />

      {/* KPI strip */}
      <div className="int-kpi-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="int-kpi-card">
              <Skeleton tokens={tokens} w="60%" h={10} />
              <div style={{ height: 8 }} />
              <Skeleton tokens={tokens} w="50%" h={20} />
            </div>
          ))
        ) : (
          <>
            <div className="int-kpi-card" style={{ borderTop: `3px solid ${tokens.status.success}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Connected</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.success, marginTop: 4 }}>{stats.connected}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>of {stats.total} integrations</div>
            </div>
            <div className="int-kpi-card" style={{ borderTop: `3px solid ${tokens.text.tertiary}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Available</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>{stats.total - stats.connected - stats.error}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>not yet connected</div>
            </div>
            <div className="int-kpi-card" style={{ borderTop: `3px solid ${tokens.status.error}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Errors</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.status.error, marginTop: 4 }}>{stats.error}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>need attention</div>
            </div>
            <div className="int-kpi-card" style={{ borderTop: `3px solid ${tokens.status.info}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Active Webhooks</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>{stats.webhooksActive}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{stats.webhooksFailing} failing</div>
            </div>
            <div className="int-kpi-card" style={{ borderTop: `3px solid ${tokens.status.warning}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>Categories</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>{CATEGORIES.length - 1}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>integration types</div>
            </div>
            <div className="int-kpi-card" style={{ borderTop: `3px solid ${tokens.text.accent}` }}>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.3 }}>API Tokens</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: tokens.text.primary, marginTop: 4 }}>3</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>2 active · 1 expired</div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'integrations', label: 'Integrations', badge: stats.total },
          { key: 'webhooks', label: 'Webhooks', badge: WEBHOOKS.length },
          { key: 'apikeys', label: 'API Keys' },
          { key: 'deliveries', label: 'Webhook Deliveries', badge: WEBHOOK_DELIVERIES.length },
        ]} active={tab} onChange={(t) => setTab(t as Tab)} />
      </div>

      {/* Integrations tab */}
      {tab === 'integrations' && (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 280, flex: 1, minWidth: 220 }}>
              <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search integrations…" />
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="int-cat-chip"
                  style={{
                    padding: '6px 10px', borderRadius: 6, border: `1px solid ${category === c ? tokens.border.focus : tokens.border.subtle}`,
                    background: category === c ? tokens.bg.hover : 'transparent',
                    color: category === c ? tokens.text.primary : tokens.text.secondary,
                    fontSize: 11, fontWeight: category === c ? 700 : 500, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >{c}</button>
              ))}
            </div>
          </div>
          <div className="int-grid">
            {filteredIntegrations.map((int, i) => {
              const statusColor = int.status === 'Connected' ? tokens.status.success : int.status === 'Error' ? tokens.status.error : int.status === 'Pending' ? tokens.status.warning : tokens.text.tertiary;
              return (
                <div key={int.id} className="int-card" style={{ animationDelay: `${i * 30}ms` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: `${int.categoryColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{int.icon}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{int.name}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{int.category}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5, marginBottom: 10, minHeight: 33 }}>{int.desc}</div>
                  {int.scopes && int.scopes.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                      {int.scopes.slice(0, 3).map(s => <Badge key={s} tokens={tokens} tone="info" size="sm">{s}</Badge>)}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${tokens.border.subtle}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor }} />
                      <span style={{ fontSize: 10, color: tokens.text.secondary }}>{int.status === 'Connected' && int.lastSync ? `Synced ${timeAgo(int.lastSync)}` : int.status}</span>
                    </div>
                    {int.status === 'Connected' ? (
                      <Button tokens={tokens} variant="outline" size="sm" onClick={() => setConfigTarget(int)}>Configure</Button>
                    ) : (
                      <Button tokens={tokens} variant="primary" size="sm" onClick={() => handleToggleIntegration(int.id, int.name, int.status)}>Connect</Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Webhooks tab */}
      {tab === 'webhooks' && (
        <Panel tokens={tokens} title="Webhook Endpoints" subtitle="Configure webhook receivers and view delivery stats"
          action={<Button tokens={tokens} variant="primary" size="sm" onClick={() => setWebhookOpen(true)}>+ New Webhook</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {WEBHOOKS.map(w => {
              const statusColor = w.status === 'Active' ? tokens.status.success : w.status === 'Failing' ? tokens.status.error : tokens.text.tertiary;
              return (
                <div key={w.id} className="int-webhook-row" style={{ padding: '14px 16px', borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{w.url}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor }} />
                          <span style={{ fontSize: 10, color: tokens.text.secondary, fontWeight: 600 }}>{w.status}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>Secret: {w.secret} · last delivery {timeAgo(w.lastDelivery)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Copied', message: 'Webhook secret' })}>Copy Secret</Button>
                      <Button tokens={tokens} variant="outline" size="sm" onClick={() => setTab('deliveries')}>View Deliveries</Button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 10, color: tokens.text.secondary }}>
                    <span><strong style={{ color: tokens.text.primary }}>{w.deliveries24h}</strong> deliveries (24h)</span>
                    <span><strong style={{ color: w.successRate >= 95 ? tokens.status.success : w.successRate >= 80 ? tokens.status.warning : tokens.status.error }}>{w.successRate}%</strong> success rate</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                    {w.events.map(e => <Badge key={e} tokens={tokens} tone="neutral" size="sm">{e}</Badge>)}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {/* API Keys tab */}
      {tab === 'apikeys' && (
        <Panel tokens={tokens} title="API Keys" subtitle="Manage API access tokens for external systems"
          action={<Button tokens={tokens} variant="primary" size="sm" onClick={() => pushToast({ tone: 'success', title: 'API key created', message: 'Copy now — shown only once' })}>+ Generate Key</Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { name: 'Production API Key', key: 'lnk_live_sk_9876543210abcdef', created: '2026-01-15', lastUsed: '2 hours ago', status: 'Active' },
              { name: 'Test API Key', key: 'lnk_test_sk_1234567890abcdef', created: '2026-01-15', lastUsed: '5 days ago', status: 'Active' },
              { name: 'Webhook Secret', key: 'whsec_••••••••••••••••', created: '2026-02-01', lastUsed: '1 hour ago', status: 'Active' },
              { name: 'Mobile App Token', key: 'lnk_live_sk_5555••••', created: '2025-08-12', lastUsed: '90 days ago', status: 'Expired' },
            ].map(k => (
              <div key={k.name} className="int-token-row" style={{ padding: '14px 16px', borderRadius: 10, background: tokens.bg.surfaceAlt }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{k.name}</span>
                    <StatusPill tokens={tokens} status={k.status} />
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Copied to clipboard', message: k.name })}>Copy</Button>
                    <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'warning', title: 'Are you sure?', message: 'This will revoke the key immediately' })}>Revoke</Button>
                  </div>
                </div>
                <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: tokens.text.secondary, background: tokens.bg.surface, padding: '6px 8px', borderRadius: 6, wordBreak: 'break-all' }}>{k.key}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10, color: tokens.text.tertiary }}>
                  <span>Created: {k.created}</span>
                  <span>Last used: {k.lastUsed}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Webhook Deliveries tab */}
      {tab === 'deliveries' && (
        <Panel tokens={tokens} title="Webhook Deliveries" subtitle="Recent webhook delivery attempts across all endpoints">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {WEBHOOK_DELIVERIES.map(d => {
              const wh = WEBHOOKS.find(w => w.id === d.webhookId);
              const statusColor = d.status === 'Success' ? tokens.status.success : d.status === 'Failed' ? tokens.status.error : tokens.status.warning;
              return (
                <div key={d.id} className="int-delivery-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 4px', borderBottom: `1px solid ${tokens.border.subtle}` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 12, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>{d.event}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wh?.url ?? d.webhookId}</div>
                  </div>
                  <div style={{ fontSize: 11, color: tokens.text.secondary, fontFamily: 'ui-monospace, monospace', flexShrink: 0 }}>
                    <span style={{ color: statusColor, fontWeight: 700 }}>{d.responseCode}</span>
                    <span style={{ color: tokens.text.tertiary, marginLeft: 4 }}>({d.duration}ms)</span>
                  </div>
                  <StatusPill tokens={tokens} status={d.status} />
                  <span style={{ fontSize: 10, color: tokens.text.tertiary, flexShrink: 0, minWidth: 60, textAlign: 'right' }}>{timeAgo(d.timestamp)}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Configure Integration Drawer */}
      {configTarget && (
        <Drawer
          tokens={tokens}
          open={!!configTarget}
          onClose={() => setConfigTarget(null)}
          title={`Configure ${configTarget.name}`}
          subtitle={configTarget.desc}
          width={480}
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setConfigTarget(null)}>Cancel</Button>
              <Button tokens={tokens} variant="primary" onClick={() => { pushToast({ tone: 'success', title: 'Settings saved', message: configTarget.name }); setConfigTarget(null); }}>Save</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, background: tokens.bg.surfaceAlt }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: `${configTarget.categoryColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{configTarget.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{configTarget.name}</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{configTarget.category} · {configTarget.status}</div>
              </div>
            </div>
            <Input tokens={tokens} label="API Key" type="password" defaultValue="••••••••••••••••" />
            <Input tokens={tokens} label="API Secret" type="password" defaultValue="••••••••••••••••" />
            <Input tokens={tokens} label="Webhook URL (optional)" placeholder="https://your-app.com/webhooks/..." />
            <Select tokens={tokens} label="Environment"
              options={[{ value: 'production', label: 'Production' }, { value: 'test', label: 'Test / Sandbox' }]}
              defaultValue="production"
            />
            {configTarget.scopes && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>Required Scopes</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {configTarget.scopes.map(s => <Badge key={s} tokens={tokens} tone="info" size="sm">{s}</Badge>)}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>Auto-sync</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>Sync data every 5 minutes</div>
              </div>
              <Toggle tokens={tokens} checked={true} onChange={() => {}} />
            </div>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'info', title: 'Test connection', message: 'Sending test request…' })}>Test Connection</Button>
          </div>
        </Drawer>
      )}

      {/* New Webhook Drawer */}
      <Drawer
        tokens={tokens}
        open={webhookOpen}
        onClose={() => setWebhookOpen(false)}
        title="New Webhook Endpoint"
        subtitle="Receive real-time event notifications"
        width={480}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => setWebhookOpen(false)}>Cancel</Button>
            <Button tokens={tokens} variant="primary" onClick={() => { pushToast({ tone: 'success', title: 'Webhook created', message: 'Secret generated · copy now' }); setWebhookOpen(false); }}>Create Webhook</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input tokens={tokens} label="Endpoint URL" placeholder="https://your-app.com/webhooks/lnkicks" />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>Events to Subscribe</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['order.created', 'order.updated', 'order.paid', 'order.cancelled', 'customer.created', 'customer.updated', 'product.updated', 'inventory.adjusted'].map(e => (
                <label key={e} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, background: tokens.bg.surfaceAlt, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={e.startsWith('order')} style={{ accentColor: tokens.text.accent }} />
                  <span style={{ fontSize: 11, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{e}</span>
                </label>
              ))}
            </div>
          </div>
          <Input tokens={tokens} label="Description (optional)" placeholder="e.g. Sync orders to ERP" />
          <div style={{ padding: 12, borderRadius: 8, background: `${tokens.status.info}15`, border: `1px solid ${tokens.status.info}30`, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
            💡 A webhook secret will be generated automatically. Use it to verify the <code style={{ fontFamily: 'ui-monospace, monospace' }}>X-Webhook-Signature</code> header on incoming requests.
          </div>
        </div>
      </Drawer>

      <style jsx>{`
        :global(.int-kpi-grid) {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 16px;
        }
        :global(.int-kpi-card) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 12px;
          padding: 12px;
          box-shadow: ${tokens.shadow.sm};
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1), box-shadow 240ms cubic-bezier(0.16,1,0.3,1);
          animation: intFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.int-kpi-card:hover) {
          transform: translateY(-2px);
          box-shadow: ${tokens.shadow.md};
        }
        :global(.int-grid) {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        :global(.int-card) {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 14px;
          padding: 16px;
          box-shadow: ${tokens.shadow.sm};
          transition: transform 240ms cubic-bezier(0.16,1,0.3,1), box-shadow 240ms cubic-bezier(0.16,1,0.3,1), border-color 240ms ease;
          animation: intFadeIn 360ms cubic-bezier(0.16,1,0.3,1) both;
        }
        :global(.int-card:hover) {
          transform: translateY(-2px);
          box-shadow: ${tokens.shadow.md};
          border-color: ${tokens.border.strong};
        }
        :global(.int-cat-chip:hover) {
          background: ${tokens.bg.hover};
        }
        :global(.int-webhook-row), :global(.int-token-row), :global(.int-delivery-row) {
          transition: background 180ms ease;
        }
        :global(.int-webhook-row:hover), :global(.int-token-row:hover), :global(.int-delivery-row:hover) {
          background: ${tokens.bg.hover} !important;
        }
        @keyframes intFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1400px) {
          :global(.int-kpi-grid) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          :global(.int-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 1100px) {
          :global(.int-kpi-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          :global(.int-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 768px) {
          :global(.int-kpi-grid) { grid-template-columns: minmax(0, 1fr); }
          :global(.int-grid) { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
    </AdminLayout>
  );
}
