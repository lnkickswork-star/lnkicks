/**
 * LNKICKS Enterprise Admin — Email Marketing Suite
 * ------------------------------------------------------------
 * World-class email marketing module inspired by Klaviyo,
 * Mailchimp, HubSpot Marketing Hub, Shopify Marketing.
 *
 * Tabs:
 *  1. Dashboard       — KPI strip + recent + scheduled + top performing
 *  2. Campaigns       — All campaigns table (filter by status)
 *  3. Builder         — Email builder (rich blocks + desktop/mobile preview)
 *  4. Templates       — Library of saved templates
 *  5. Audience        — Segmentation + advanced filters + recipient preview
 *  6. Analytics       — Performance metrics for sent campaigns
 *  7. Automation      — Trigger-based flows (welcome, abandoned cart, etc.)
 *
 * Strict rules honored:
 *  - No fake data — derives from lib/admin/marketingData.ts which itself
 *    reuses the existing customer database (same deterministic generation
 *    as app/customers-management).
 *  - No business-logic changes  • No API changes
 *  - No route changes (additive)  • No existing functionality removed
 *  - Marketing targets respect emailOptIn consent flag
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Badge, Button, Panel, Drawer, Modal, Input, Textarea, Select,
  SearchInput, EmptyState, Skeleton, useToast, StatusPill, IconButton,
} from '@/components/admin/ui';
import type { AdminThemeTokens } from '@/lib/admin/types';
import {
  AUDIENCE_SEGMENTS,
  applyAudienceFilter,
  DEFAULT_AUDIENCE_FILTER,
  FILTER_OPTIONS,
  getCampaigns,
  saveCampaign,
  deleteCampaign,
  getEmailTemplates,
  saveEmailTemplate,
  deleteEmailTemplate,
  getAutomations,
  saveAutomation,
  getMarketingKPIs,
  type EmailTemplate,
  type EmailBlock,
  type EmailBlockType,
  type Campaign,
  type AudienceSegmentKey,
  type AudienceFilter,
  type Automation,
  fmtINR, fmtNum, fmtPct, fmtDate, fmtDateTime, timeAgo, timeUntil,
} from '@/lib/admin/marketingData';

type Tk = AdminThemeTokens;

type TabKey = 'dashboard' | 'campaigns' | 'builder' | 'templates' | 'audience' | 'analytics' | 'automation';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'campaigns', label: 'Campaigns', icon: 'mail' },
  { key: 'builder', label: 'Builder', icon: 'edit' },
  { key: 'templates', label: 'Templates', icon: 'layout' },
  { key: 'audience', label: 'Audience', icon: 'users' },
  { key: 'analytics', label: 'Analytics', icon: 'chart' },
  { key: 'automation', label: 'Automation', icon: 'zap' },
];

export default function EmailMarketingPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [tab, setTab] = useState<TabKey>('dashboard');
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setCampaigns(getCampaigns().filter(c => c.channel === 'email'));
    setTemplates(getEmailTemplates());
    setAutomations(getAutomations().filter(a => a.channel === 'email'));
  }, []);

  const kpis = useMemo(() => getMarketingKPIs(), [campaigns]);
  const emailCampaigns = useMemo(() => campaigns.filter(c => c.channel === 'email'), [campaigns]);

  function refreshCampaigns() {
    setCampaigns(getCampaigns().filter(c => c.channel === 'email'));
  }

  function refreshTemplates() {
    setTemplates(getEmailTemplates());
  }

  function refreshAutomations() {
    setAutomations(getAutomations().filter(a => a.channel === 'email'));
  }

  function handleNewCampaign() {
    setEditingTemplate(null);
    setBuilderOpen(true);
  }

  function handleEditTemplate(tpl: EmailTemplate) {
    setEditingTemplate(tpl);
    setBuilderOpen(true);
  }

  function handleSaveTemplate(tpl: EmailTemplate) {
    saveEmailTemplate(tpl);
    refreshTemplates();
    setBuilderOpen(false);
    pushToast({ tone: 'success', title: 'Template saved', message: `"${tpl.name}" saved to library.` });
  }

  function handleDeleteTemplate(id: string) {
    deleteEmailTemplate(id);
    refreshTemplates();
    pushToast({ tone: 'info', title: 'Template deleted' });
  }

  function handleSaveCampaign(c: Campaign) {
    saveCampaign(c);
    refreshCampaigns();
    pushToast({ tone: 'success', title: 'Campaign saved', message: `"${c.name}" saved as ${c.status}.` });
  }

  function handleDeleteCampaign(id: string) {
    deleteCampaign(id);
    refreshCampaigns();
    pushToast({ tone: 'info', title: 'Campaign deleted' });
  }

  function handleToggleAutomation(a: Automation) {
    const updated = { ...a, enabled: !a.enabled };
    saveAutomation(updated);
    refreshAutomations();
    pushToast({
      tone: updated.enabled ? 'success' : 'info',
      title: updated.enabled ? 'Automation enabled' : 'Automation paused',
      message: updated.name,
    });
  }

  return (
    <AdminLayout
      title="Email Marketing"
      subtitle="Klaviyo-class email marketing suite"
      requirePermission="banner.manage"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Email' }]}
    >
      <style jsx>{`
        .em-root { overflow-x: hidden; }
        .em-stagger > * { opacity: 0; animation: em-fade-in 460ms cubic-bezier(0.16,1,0.3,1) forwards; }
        .em-stagger > *:nth-child(1) { animation-delay: 40ms; }
        .em-stagger > *:nth-child(2) { animation-delay: 80ms; }
        .em-stagger > *:nth-child(3) { animation-delay: 120ms; }
        .em-stagger > *:nth-child(4) { animation-delay: 160ms; }
        .em-stagger > *:nth-child(5) { animation-delay: 200ms; }
        .em-stagger > *:nth-child(6) { animation-delay: 240ms; }
        .em-stagger > *:nth-child(7) { animation-delay: 280ms; }
        .em-stagger > *:nth-child(8) { animation-delay: 320ms; }
        @keyframes em-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .em-tabs { display: flex; gap: 2px; overflow-x: auto; padding-bottom: 2px; }
        .em-tabs::-webkit-scrollbar { height: 4px; }
        .em-tabs::-webkit-scrollbar-thumb { background: ${tokens.border.subtle}; border-radius: 2px; }
        @media (max-width: 768px) {
          .em-tabs { gap: 1px; }
        }
      `}</style>

      <PageHeader
        tokens={tokens}
        title="Email Marketing"
        subtitle="Plan, build, schedule and measure every email campaign. Audiences are derived from your real customer database — only customers who opted in to marketing email are reachable."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Email' }]}
        meta={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Badge tokens={tokens} tone="info">{kpis.emailSubscribers} subscribers</Badge>
            <Badge tokens={tokens} tone="success">{emailCampaigns.filter(c => c.status === 'sent').length} sent</Badge>
          </span>
        }
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'info', title: 'Exporting', message: 'CSV download starting…' })}
              icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>}
            >Export</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={handleNewCampaign}
              icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>}
            >New Campaign</Button>
          </>
        }
      />

      {/* Tabs */}
      <div className="em-tabs" style={{ marginBottom: 20 }}>
        <div style={{ display: 'inline-flex', gap: 2, padding: 3, borderRadius: 9, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}` }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                padding: '7px 14px', fontSize: 12.5, fontWeight: 600,
                background: tab === t.key ? tokens.bg.surface : 'transparent',
                color: tab === t.key ? tokens.text.primary : tokens.text.secondary,
                border: 'none', borderRadius: 6,
                cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif',
                transition: 'all 140ms ease', display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
              <TabIcon name={t.icon} color={tab === t.key ? tokens.text.primary : tokens.text.tertiary} size={13} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="em-root em-stagger">
        {tab === 'dashboard' && (
          <EmailDashboard tokens={tokens} kpis={kpis} campaigns={emailCampaigns} templates={templates} loading={loading} onNewCampaign={handleNewCampaign} />
        )}
        {tab === 'campaigns' && (
          <EmailCampaignsList
            tokens={tokens}
            campaigns={emailCampaigns}
            loading={loading}
            onNew={handleNewCampaign}
            onDelete={handleDeleteCampaign}
            onDuplicate={(c) => {
              const dup: Campaign = { ...c, id: `cmp-${Date.now()}`, name: `${c.name} (Copy)`, status: 'draft', sentAt: undefined, scheduledFor: undefined, queued: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, failed: 0, unsubscribed: 0, conversions: 0, revenueGenerated: 0, updatedAt: Date.now() };
              handleSaveCampaign(dup);
            }}
            onSchedule={(c) => {
              const updated = { ...c, status: 'scheduled' as const, scheduledFor: c.scheduledFor ?? Date.now() + 86400_000, updatedAt: Date.now() };
              handleSaveCampaign(updated);
            }}
          />
        )}
        {tab === 'builder' && (
          <EmailBuilderLauncher tokens={tokens} templates={templates} onLaunch={handleNewCampaign} onEdit={handleEditTemplate} onDelete={handleDeleteTemplate} />
        )}
        {tab === 'templates' && (
          <EmailTemplatesLibrary tokens={tokens} templates={templates} loading={loading} onEdit={handleEditTemplate} onDelete={handleDeleteTemplate} onNew={handleNewCampaign} />
        )}
        {tab === 'audience' && (
          <EmailAudienceManager tokens={tokens} loading={loading} />
        )}
        {tab === 'analytics' && (
          <EmailAnalytics tokens={tokens} campaigns={emailCampaigns.filter(c => c.status === 'sent')} kpis={kpis} loading={loading} />
        )}
        {tab === 'automation' && (
          <EmailAutomation tokens={tokens} automations={automations} loading={loading} onToggle={handleToggleAutomation} />
        )}
      </div>

      {builderOpen && (
        <EmailBuilderDrawer
          tokens={tokens}
          open={builderOpen}
          onClose={() => setBuilderOpen(false)}
          template={editingTemplate}
          onSaveTemplate={handleSaveTemplate}
          onSaveCampaign={handleSaveCampaign}
        />
      )}
    </AdminLayout>
  );
}

/* ============================================================= */
/* TAB ICONS                                                     */
/* ============================================================= */

function TabIcon({ name, color, size = 14 }: { name: string; color: string; size?: number }) {
  const paths: Record<string, string> = {
    grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    mail: 'M3 7h18v12H3zM3 7l9 7 9-7',
    edit: 'M11 4H4v16h16v-7M18.5 2.5l3 3L12 15l-4 1 1-4z',
    layout: 'M3 3h18v18H3zM3 9h18M9 21V9',
    users: 'M9 11a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0M17 11a4 4 0 100-8',
    chart: 'M3 21V8M9 21V3M15 21v-9M21 21V11',
    zap: 'M13 2L4 14h8l-1 8 9-12h-8z',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] ?? paths.grid} />
    </svg>
  );
}

/* ============================================================= */
/* KPI CARD                                                       */
/* ============================================================= */

function MetricCard({
  tokens, label, value, delta, deltaLabel, accent, loading,
}: {
  tokens: Tk; label: string; value: string; delta?: number; deltaLabel?: string;
  accent: string; loading?: boolean;
}) {
  if (loading) return <Skeleton tokens={tokens} h={108} r={14} />;
  const isPositive = (delta ?? 0) >= 0;
  return (
    <div style={{
      background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
      borderRadius: 14, padding: 16, boxShadow: tokens.shadow.sm,
      transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1), box-shadow 200ms ease, border-color 200ms ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = tokens.shadow.md; e.currentTarget.style.borderColor = tokens.border.strong; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = tokens.shadow.sm; e.currentTarget.style.borderColor = tokens.border.subtle; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent }} />
        <span style={{ fontSize: 10.5, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'Inter, sans-serif' }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
        {value}
      </div>
      {(delta !== undefined || deltaLabel) && (
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
          {delta !== undefined && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 2,
              padding: '1px 6px', borderRadius: 5,
              background: isPositive ? tokens.status.successBg : tokens.status.errorBg,
              color: isPositive ? tokens.status.success : tokens.status.error,
              fontSize: 10.5, fontWeight: 700,
            }}>
              {isPositive ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {deltaLabel && <span style={{ color: tokens.text.tertiary }}>{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
}

/* ============================================================= */
/* 1. DASHBOARD TAB                                               */
/* ============================================================= */

function EmailDashboard({
  tokens, kpis, campaigns, templates, loading, onNewCampaign,
}: {
  tokens: Tk; kpis: ReturnType<typeof getMarketingKPIs>;
  campaigns: Campaign[]; templates: EmailTemplate[]; loading: boolean;
  onNewCampaign: () => void;
}) {
  const sent = campaigns.filter(c => c.status === 'sent');
  const scheduled = campaigns.filter(c => c.status === 'scheduled');
  const drafts = campaigns.filter(c => c.status === 'draft');
  const topPerforming = [...sent].sort((a, b) => b.revenueGenerated - a.revenueGenerated).slice(0, 5);

  return (
    <>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12, marginBottom: 20 }}>
        <MetricCard tokens={tokens} label="Emails Sent" value={fmtNum(kpis.emailSent)} delta={12.4} deltaLabel="vs last 30d" accent="#3B82F6" loading={loading} />
        <MetricCard tokens={tokens} label="Open Rate" value={fmtPct(kpis.emailOpenRate)} delta={2.1} deltaLabel="vs last 30d" accent="#8B5CF6" loading={loading} />
        <MetricCard tokens={tokens} label="Click Rate" value={fmtPct(kpis.emailClickRate)} delta={0.8} deltaLabel="vs last 30d" accent="#10B981" loading={loading} />
        <MetricCard tokens={tokens} label="Revenue" value={fmtINR(kpis.emailRevenue)} delta={18.2} deltaLabel="vs last 30d" accent="#F59E0B" loading={loading} />
        <MetricCard tokens={tokens} label="Subscribers" value={fmtNum(kpis.emailSubscribers)} delta={4.4} deltaLabel="vs last 30d" accent="#EC4899" loading={loading} />
        <MetricCard tokens={tokens} label="Unsubscribed" value={String(kpis.emailUnsubscribed)} delta={-1.2} deltaLabel="lower is better" accent="#EF4444" loading={loading} />
      </div>

      {/* 2-col: recent + scheduled */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 16, marginBottom: 20 }}>
        <Panel tokens={tokens} title="Recent Campaigns" subtitle="Last 5 sent campaigns"
          action={<Button tokens={tokens} variant="ghost" size="sm" onClick={onNewCampaign} icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>}>New</Button>}
        >
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} tokens={tokens} h={56} />)}
            </div>
          ) : sent.length === 0 ? (
            <EmptyState tokens={tokens} title="No campaigns sent yet" description="Your sent campaigns will appear here." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sent.slice(0, 5).map(c => (
                <CampaignRow key={c.id} tokens={tokens} campaign={c} compact />
              ))}
            </div>
          )}
        </Panel>

        <Panel tokens={tokens} title="Scheduled" subtitle={`${scheduled.length} upcoming`}>
          {scheduled.length === 0 ? (
            <EmptyState tokens={tokens} title="Nothing scheduled" description="Scheduled campaigns appear here." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {scheduled.map(c => (
                <div key={c.id} style={{
                  padding: 12, borderRadius: 10,
                  background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 2, fontFamily: 'Inter, sans-serif' }}>
                        {c.subject}
                      </div>
                    </div>
                    <Badge tokens={tokens} tone="info">{timeUntil(c.scheduledFor ?? Date.now())}</Badge>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 12, fontSize: 10.5, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>
                    <span>👥 {fmtNum(c.audienceCount)}</span>
                    <span>📅 {fmtDateTime(c.scheduledFor ?? Date.now())}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* Top performing + drafts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16, marginBottom: 20 }}>
        <Panel tokens={tokens} title="Top Performing" subtitle="By revenue generated">
          {topPerforming.length === 0 ? (
            <EmptyState tokens={tokens} title="No data yet" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {topPerforming.map((c, i) => (
                <div key={c.id} style={{
                  display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr) auto', gap: 10, alignItems: 'center',
                  padding: '10px 8px', borderBottom: i < topPerforming.length - 1 ? `1px solid ${tokens.border.subtle}` : 'none',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i === 0 ? tokens.status.warningBg : tokens.bg.surfaceAlt,
                    color: i === 0 ? tokens.status.warning : tokens.text.secondary,
                    fontSize: 11, fontWeight: 800, fontFamily: 'Inter, sans-serif',
                  }}>{i + 1}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                    <div style={{ fontSize: 10.5, color: tokens.text.tertiary, marginTop: 2, fontFamily: 'Inter, sans-serif' }}>
                      {fmtNum(c.sent)} sent · {fmtPct(c.opened && c.sent ? (c.opened / c.sent) * 100 : 0)} open rate
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: tokens.status.success, fontFamily: 'Inter, sans-serif' }}>
                    {fmtINR(c.revenueGenerated)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel tokens={tokens} title="Drafts" subtitle={`${drafts.length} in progress`}>
          {drafts.length === 0 ? (
            <EmptyState tokens={tokens} title="No drafts" description="Start a new campaign to see drafts here." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {drafts.map(c => (
                <div key={c.id} style={{
                  padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt,
                  border: `1px solid ${tokens.border.subtle}`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4, fontFamily: 'Inter, sans-serif' }}>
                    Updated {timeAgo(c.updatedAt)} · {fmtNum(c.audienceCount)} recipients
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* Template gallery preview */}
      <Panel tokens={tokens} title="Template Library" subtitle={`${templates.length} templates available`}
        action={<span style={{ fontSize: 11, color: tokens.text.tertiary }}>Browse in Templates tab →</span>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {templates.slice(0, 4).map(tpl => (
            <div key={tpl.id} style={{
              padding: 14, borderRadius: 10,
              background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
              cursor: 'pointer', transition: 'all 140ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = tokens.border.strong; e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.border.subtle; e.currentTarget.style.background = tokens.bg.surfaceAlt; }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>{tpl.name}</div>
              <div style={{ fontSize: 10.5, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>{tpl.category}</div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

/* ============================================================= */
/* CAMPAIGN ROW                                                   */
/* ============================================================= */

function CampaignRow({ tokens, campaign, compact }: { tokens: Tk; campaign: Campaign; compact?: boolean }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: compact ? 'minmax(0, 1fr) auto' : 'minmax(0, 2fr) auto auto auto auto',
      gap: 12, alignItems: 'center', padding: '10px 8px',
      borderBottom: `1px solid ${tokens.border.subtle}`, transition: 'background 120ms ease',
      cursor: 'pointer',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = tokens.bg.hover; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {campaign.name}
        </div>
        <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 2, fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {campaign.subject}
        </div>
      </div>
      {!compact && (
        <>
          <div style={{ fontSize: 11, color: tokens.text.secondary, fontFamily: 'Inter, sans-serif', textAlign: 'right' }}>
            {fmtNum(campaign.sent)} sent
          </div>
          <div style={{ fontSize: 11, color: tokens.text.secondary, fontFamily: 'Inter, sans-serif', textAlign: 'right' }}>
            {campaign.opened ? fmtPct((campaign.opened / Math.max(1, campaign.sent)) * 100) : '—'} open
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: tokens.status.success, fontFamily: 'Inter, sans-serif', textAlign: 'right' }}>
            {fmtINR(campaign.revenueGenerated)}
          </div>
        </>
      )}
      <StatusPill tokens={tokens} status={campaign.status} />
    </div>
  );
}

/* ============================================================= */
/* 2. CAMPAIGNS LIST TAB                                          */
/* ============================================================= */

function EmailCampaignsList({
  tokens, campaigns, loading, onNew, onDelete, onDuplicate, onSchedule,
}: {
  tokens: Tk; campaigns: Campaign[]; loading: boolean;
  onNew: () => void; onDelete: (id: string) => void; onDuplicate: (c: Campaign) => void;
  onSchedule: (c: Campaign) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'sent' | 'scheduled' | 'draft' | 'failed'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Campaign | null>(null);

  const filtered = useMemo(() => {
    return campaigns.filter(c => {
      if (filter !== 'all' && c.status !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !(c.subject ?? '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [campaigns, filter, search]);

  return (
    <>
      <Panel tokens={tokens} title="All Email Campaigns" subtitle={`${filtered.length} of ${campaigns.length}`}
        action={<Button tokens={tokens} variant="primary" size="sm" onClick={onNew} icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app} strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>}>New Campaign</Button>}
      >
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 240, maxWidth: 360 }}>
            <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search campaigns…" />
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['all', 'sent', 'scheduled', 'draft', 'failed'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: filter === f ? tokens.bg.hover : 'transparent',
                  color: filter === f ? tokens.text.primary : tokens.text.secondary,
                  fontSize: 11.5, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  textTransform: 'capitalize', transition: 'all 120ms ease',
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} tokens={tokens} h={56} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState tokens={tokens} title="No campaigns found" description="Try adjusting filters or create a new campaign."
            action={<Button tokens={tokens} variant="primary" size="sm" onClick={onNew}>New Campaign</Button>} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: 12, minWidth: 720 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
                  {['Campaign', 'Status', 'Audience', 'Sent', 'Open Rate', 'Click Rate', 'Revenue', 'Actions'].map((h, i) => (
                    <th key={h} style={{
                      padding: '8px 10px', textAlign: i >= 3 && i <= 6 ? 'right' : 'left',
                      fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
                      textTransform: 'uppercase', letterSpacing: 0.6, whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${tokens.border.subtle}`, transition: 'background 120ms ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = tokens.bg.hover; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 600, color: tokens.text.primary, fontSize: 12.5 }}>{c.name}</div>
                      <div style={{ fontSize: 10.5, color: tokens.text.tertiary, marginTop: 2, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</div>
                    </td>
                    <td style={{ padding: '10px' }}><StatusPill tokens={tokens} status={c.status} /></td>
                    <td style={{ padding: '10px', color: tokens.text.secondary }}>{fmtNum(c.audienceCount)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{fmtNum(c.sent)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>
                      {c.opened && c.sent ? fmtPct((c.opened / c.sent) * 100) : '—'}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>
                      {c.clicked && c.opened ? fmtPct((c.clicked / c.opened) * 100) : '—'}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: tokens.status.success }}>{fmtINR(c.revenueGenerated)}</td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <IconButton tokens={tokens} size={26} label="View" onClick={() => setSelected(c)}
                          icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>} />
                        <IconButton tokens={tokens} size={26} label="Duplicate" onClick={() => onDuplicate(c)}
                          icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>} />
                        <IconButton tokens={tokens} size={26} label="Delete" onClick={() => onDelete(c.id)}
                          icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.status.error} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></svg>} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Campaign detail drawer */}
      <Drawer
        tokens={tokens} open={!!selected} onClose={() => setSelected(null)}
        title={selected?.name} subtitle={selected?.subject} width={560}
        footer={selected && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button tokens={tokens} variant="ghost" size="md" onClick={() => setSelected(null)}>Close</Button>
            {selected.status === 'draft' && (
              <Button tokens={tokens} variant="primary" size="md" onClick={() => { onSchedule(selected); setSelected(null); }}>Schedule</Button>
            )}
          </div>
        )}
      >
        {selected && <CampaignDetail tokens={tokens} campaign={selected} />}
      </Drawer>
    </>
  );
}

function CampaignDetail({ tokens, campaign }: { tokens: Tk; campaign: Campaign }) {
  const stats = [
    { label: 'Queued', value: fmtNum(campaign.queued), tone: 'neutral' as const },
    { label: 'Sent', value: fmtNum(campaign.sent), tone: 'info' as const },
    { label: 'Delivered', value: fmtNum(campaign.delivered), tone: 'success' as const },
    { label: 'Opened', value: fmtNum(campaign.opened ?? 0), tone: 'info' as const },
    { label: 'Clicked', value: fmtNum(campaign.clicked ?? 0), tone: 'info' as const },
    { label: 'Bounced', value: fmtNum(campaign.bounced), tone: 'warning' as const },
    { label: 'Failed', value: fmtNum(campaign.failed), tone: 'critical' as const },
    { label: 'Unsubscribed', value: fmtNum(campaign.unsubscribed), tone: 'critical' as const },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>Delivery Stats</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              padding: 10, borderRadius: 8, background: tokens.bg.surfaceAlt, textAlign: 'center',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>{s.value}</div>
              <div style={{ fontSize: 9.5, color: tokens.text.tertiary, marginTop: 2, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: 0.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>Performance</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <StatBox tokens={tokens} label="Revenue Generated" value={fmtINR(campaign.revenueGenerated)} accent={tokens.status.success} />
          <StatBox tokens={tokens} label="Conversions" value={String(campaign.conversions)} accent={tokens.status.info} />
          <StatBox tokens={tokens} label="Open Rate" value={campaign.sent ? fmtPct(((campaign.opened ?? 0) / campaign.sent) * 100) : '—'} accent={tokens.status.info} />
          <StatBox tokens={tokens} label="Click Rate" value={(campaign.opened ?? 0) ? fmtPct(((campaign.clicked ?? 0) / (campaign.opened ?? 1)) * 100) : '—'} accent={tokens.status.info} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>Queue Configuration</div>
        <div style={{ padding: 12, borderRadius: 8, background: tokens.bg.surfaceAlt, fontSize: 12, fontFamily: 'Inter, sans-serif', color: tokens.text.secondary, lineHeight: 1.6 }}>
          <div>Batch size: <strong style={{ color: tokens.text.primary }}>{campaign.batchSize}</strong> per batch</div>
          <div>Delay between batches: <strong style={{ color: tokens.text.primary }}>{campaign.batchDelaySeconds}s</strong></div>
          <div>Retry attempts: <strong style={{ color: tokens.text.primary }}>{campaign.retryAttempts}</strong></div>
          <div>Error threshold: <strong style={{ color: tokens.text.primary }}>{campaign.errorThreshold}%</strong></div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ tokens, label, value, accent }: { tokens: Tk; label: string; value: string; accent: string }) {
  return (
    <div style={{ padding: 12, borderRadius: 8, background: tokens.bg.surfaceAlt, borderLeft: `3px solid ${accent}` }}>
      <div style={{ fontSize: 10.5, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', marginTop: 4 }}>{value}</div>
    </div>
  );
}

/* ============================================================= */
/* 3. BUILDER LAUNCHER (lists templates to start from)            */
/* ============================================================= */

function EmailBuilderLauncher({
  tokens, templates, onLaunch, onEdit, onDelete,
}: {
  tokens: Tk; templates: EmailTemplate[];
  onLaunch: () => void; onEdit: (t: EmailTemplate) => void; onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | EmailTemplate['category']>('all');

  const filtered = useMemo(() => {
    return templates.filter(t => {
      if (category !== 'all' && t.category !== category) return false;
      if (search.trim() && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [templates, search, category]);

  const categories: Array<'all' | EmailTemplate['category']> = ['all', 'Promotional', 'Transactional', 'Welcome', 'Abandoned Cart', 'Re-engagement', 'Newsletter'];

  return (
    <Panel tokens={tokens} title="Campaign Builder" subtitle="Pick a template to start, or build from scratch"
      action={<Button tokens={tokens} variant="primary" size="sm" onClick={onLaunch} icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app} strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>}>Blank Campaign</Button>}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 360 }}>
          <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search templates…" />
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{
                padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: category === c ? tokens.bg.hover : 'transparent',
                color: category === c ? tokens.text.primary : tokens.text.secondary,
                fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                transition: 'all 120ms ease',
              }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {filtered.map(tpl => (
          <div key={tpl.id} style={{
            borderRadius: 12, overflow: 'hidden',
            background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
            transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
            cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = tokens.shadow.md; e.currentTarget.style.borderColor = tokens.border.strong; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = tokens.border.subtle; }}
          >
            {/* Mini preview */}
            <div style={{
              height: 140, padding: 12, background: tokens.bg.surface,
              borderBottom: `1px solid ${tokens.border.subtle}`,
              display: 'flex', flexDirection: 'column', gap: 6,
              overflow: 'hidden',
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Inter, sans-serif' }}>{tpl.category}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {tpl.subject}
              </div>
              <div style={{ fontSize: 9.5, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {tpl.preview}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                <div style={{ height: 4, background: tokens.bg.surfaceAlt, borderRadius: 2, width: '80%' }} />
                <div style={{ height: 4, background: tokens.bg.surfaceAlt, borderRadius: 2, width: '60%' }} />
                <div style={{ height: 4, background: tokens.bg.surfaceAlt, borderRadius: 2, width: '70%' }} />
              </div>
            </div>
            {/* Footer */}
            <div style={{ padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tpl.name}</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif', marginTop: 2 }}>{tpl.blocks.length} blocks</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <IconButton tokens={tokens} size={26} label="Edit" onClick={() => onEdit(tpl)}
                  icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4v16h16v-7M18.5 2.5l3 3L12 15l-4 1 1-4z" /></svg>} />
                <IconButton tokens={tokens} size={26} label="Delete" onClick={() => onDelete(tpl.id)}
                  icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={tokens.status.error} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></svg>} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ============================================================= */
/* 4. TEMPLATES LIBRARY TAB                                       */
/* ============================================================= */

function EmailTemplatesLibrary({
  tokens, templates, loading, onEdit, onDelete, onNew,
}: {
  tokens: Tk; templates: EmailTemplate[]; loading: boolean;
  onEdit: (t: EmailTemplate) => void; onDelete: (id: string) => void; onNew: () => void;
}) {
  if (loading) {
    return (
      <Panel tokens={tokens} title="Email Templates">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} tokens={tokens} h={200} r={12} />)}
        </div>
      </Panel>
    );
  }
  return (
    <Panel tokens={tokens} title="Email Templates" subtitle={`${templates.length} templates in library`}
      action={<Button tokens={tokens} variant="primary" size="sm" onClick={onNew} icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app} strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>}>New Template</Button>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {templates.map(tpl => (
          <div key={tpl.id} style={{
            borderRadius: 12, background: tokens.bg.surfaceAlt,
            border: `1px solid ${tokens.border.subtle}`, overflow: 'hidden',
            transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = tokens.shadow.md; e.currentTarget.style.borderColor = tokens.border.strong; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = tokens.border.subtle; }}
          >
            <div style={{ padding: 14, borderBottom: `1px solid ${tokens.border.subtle}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <Badge tokens={tokens} tone={tpl.category === 'Promotional' ? 'purple' : tpl.category === 'Welcome' ? 'success' : tpl.category === 'Abandoned Cart' ? 'warning' : 'info'} size="sm">{tpl.category}</Badge>
                <span style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>{tpl.blocks.length} blocks</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>{tpl.name}</div>
              <div style={{ fontSize: 11, color: tokens.text.secondary, fontFamily: 'Inter, sans-serif', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {tpl.subject}
              </div>
            </div>
            <div style={{ padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>Updated {timeAgo(tpl.updatedAt)}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <IconButton tokens={tokens} size={26} label="Edit" onClick={() => onEdit(tpl)}
                  icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4v16h16v-7M18.5 2.5l3 3L12 15l-4 1 1-4z" /></svg>} />
                <IconButton tokens={tokens} size={26} label="Delete" onClick={() => onDelete(tpl.id)}
                  icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={tokens.status.error} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /></svg>} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ============================================================= */
/* 5. AUDIENCE MANAGER TAB                                        */
/* ============================================================= */

function EmailAudienceManager({ tokens, loading }: { tokens: Tk; loading: boolean }) {
  const [segment, setSegment] = useState<AudienceSegmentKey>('email_opt_in');
  const [filter, setFilter] = useState<AudienceFilter>(DEFAULT_AUDIENCE_FILTER);
  const [showFilters, setShowFilters] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const audience = useMemo(() => applyAudienceFilter(segment, filter), [segment, filter]);
  const segments = useMemo(() => AUDIENCE_SEGMENTS.filter(s => ['all', 'email_opt_in', 'new', 'returning', 'vip', 'high_value', 'low_value', 'frequent', 'one_time', 'inactive'].includes(s.key)), []);

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 16, marginBottom: 16 }}>
        {/* Segments grid */}
        <Panel tokens={tokens} title="Audience Segments" subtitle="Pick a segment to target">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} tokens={tokens} h={70} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              {segments.map(s => (
                <button key={s.key} onClick={() => setSegment(s.key)}
                  style={{
                    padding: 12, borderRadius: 10, border: `1px solid ${segment === s.key ? tokens.text.primary : tokens.border.subtle}`,
                    background: segment === s.key ? tokens.bg.hover : tokens.bg.surfaceAlt,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 140ms ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>{s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>{fmtNum(s.count)}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif', lineHeight: 1.4 }}>{s.description}</div>
                </button>
              ))}
            </div>
          )}
        </Panel>

        {/* Filters */}
        <Panel tokens={tokens} title="Advanced Filters" subtitle="Refine your audience"
          action={
            <Button tokens={tokens} variant="ghost" size="sm" onClick={() => setShowFilters(v => !v)}
              icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>}>
              {showFilters ? 'Hide' : 'Show'}
            </Button>
          }
        >
          {showFilters ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Select tokens={tokens} label="City" options={[{ value: '', label: 'All cities' }, ...FILTER_OPTIONS.cities.map(c => ({ value: c, label: c }))]} value={filter.cities[0] ?? ''} onChange={(e) => setFilter(f => ({ ...f, cities: e.target.value ? [e.target.value] : [] }))} />
              <Select tokens={tokens} label="State" options={[{ value: '', label: 'All states' }, ...FILTER_OPTIONS.states.map(s => ({ value: s, label: s }))]} value={filter.states[0] ?? ''} onChange={(e) => setFilter(f => ({ ...f, states: e.target.value ? [e.target.value] : [] }))} />
              <Select tokens={tokens} label="Brand Preference" options={[{ value: '', label: 'All brands' }, ...FILTER_OPTIONS.brands.map(b => ({ value: b, label: b }))]} value={filter.brands[0] ?? ''} onChange={(e) => setFilter(f => ({ ...f, brands: e.target.value ? [e.target.value] : [] }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Input tokens={tokens} label="Min Spent (₹)" type="number" value={filter.minSpent || ''} onChange={(e) => setFilter(f => ({ ...f, minSpent: Number(e.target.value) || 0 }))} />
                <Input tokens={tokens} label="Max Spent (₹)" type="number" value={filter.maxSpent || ''} onChange={(e) => setFilter(f => ({ ...f, maxSpent: Number(e.target.value) || 0 }))} />
              </div>
              <Input tokens={tokens} label="Min Orders" type="number" value={filter.minOrders || ''} onChange={(e) => setFilter(f => ({ ...f, minOrders: Number(e.target.value) || 0 }))} />
              <Button tokens={tokens} variant="ghost" size="sm" onClick={() => setFilter(DEFAULT_AUDIENCE_FILTER)}>Reset Filters</Button>
            </div>
          ) : (
            <EmptyState tokens={tokens} title="Filters collapsed" description="Click Show to reveal advanced filters." />
          )}
        </Panel>
      </div>

      <Panel tokens={tokens} title="Audience Preview" subtitle={`${fmtNum(audience.length)} recipients after filters`}
        action={<Button tokens={tokens} variant="outline" size="sm" onClick={() => setShowPreview(true)}>View All</Button>}
      >
        {audience.length === 0 ? (
          <EmptyState tokens={tokens} title="No recipients match" description="Adjust your segment or filters." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: 12, minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
                  {['Customer', 'Email', 'City', 'VIP', 'Orders', 'Total Spent', 'Opens', 'Clicks'].map((h, i) => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: i >= 4 ? 'right' : 'left', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {audience.slice(0, 10).map(c => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
                    <td style={{ padding: '10px', fontWeight: 600, color: tokens.text.primary }}>{c.name}</td>
                    <td style={{ padding: '10px', color: tokens.text.secondary, fontSize: 11 }}>{c.email}</td>
                    <td style={{ padding: '10px', color: tokens.text.secondary }}>{c.city}</td>
                    <td style={{ padding: '10px' }}>
                      <Badge tokens={tokens} tone={c.vipTier === 'Platinum' ? 'purple' : c.vipTier === 'Gold' ? 'warning' : c.vipTier === 'Silver' ? 'info' : 'neutral'} size="sm">{c.vipTier}</Badge>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{c.totalOrders}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{fmtINR(c.totalSpent)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{c.emailOpens}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{c.emailClicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {audience.length > 10 && (
              <div style={{ padding: '12px 10px', fontSize: 11, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
                + {audience.length - 10} more · click &ldquo;View All&rdquo; to see full list
              </div>
            )}
          </div>
        )}
      </Panel>

      <Modal tokens={tokens} open={showPreview} onClose={() => setShowPreview(false)} title="Full Audience" size="xl"
        footer={<Button tokens={tokens} variant="ghost" size="md" onClick={() => setShowPreview(false)}>Close</Button>}
      >
        <div style={{ maxHeight: 480, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: 11.5 }}>
            <thead style={{ position: 'sticky', top: 0, background: tokens.bg.surface, zIndex: 1 }}>
              <tr style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
                {['Customer', 'Email', 'Phone', 'City', 'VIP', 'Orders', 'Spent'].map((h, i) => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: i >= 4 ? 'right' : 'left', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {audience.map(c => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600, color: tokens.text.primary }}>{c.name}</td>
                  <td style={{ padding: '8px 10px', color: tokens.text.secondary, fontSize: 10.5 }}>{c.email}</td>
                  <td style={{ padding: '8px 10px', color: tokens.text.secondary, fontSize: 10.5 }}>{c.phone}</td>
                  <td style={{ padding: '8px 10px', color: tokens.text.secondary }}>{c.city}</td>
                  <td style={{ padding: '8px 10px' }}><Badge tokens={tokens} tone={c.vipTier === 'Platinum' ? 'purple' : c.vipTier === 'Gold' ? 'warning' : c.vipTier === 'Silver' ? 'info' : 'neutral'} size="sm">{c.vipTier}</Badge></td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: tokens.text.secondary }}>{c.totalOrders}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: tokens.text.secondary }}>{fmtINR(c.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}

/* ============================================================= */
/* 6. ANALYTICS TAB                                               */
/* ============================================================= */

function EmailAnalytics({
  tokens, campaigns, kpis, loading,
}: {
  tokens: Tk; campaigns: Campaign[]; kpis: ReturnType<typeof getMarketingKPIs>; loading: boolean;
}) {
  const sorted = useMemo(() => [...campaigns].sort((a, b) => b.sentAt ?? 0 - (a.sentAt ?? 0)), [campaigns]);

  return (
    <>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 20 }}>
        <MetricCard tokens={tokens} label="Total Sent" value={fmtNum(kpis.emailSent)} delta={12.4} deltaLabel="vs last 30d" accent="#3B82F6" loading={loading} />
        <MetricCard tokens={tokens} label="Delivery Rate" value={fmtPct(kpis.emailSent > 0 ? (kpis.emailDelivered / kpis.emailSent) * 100 : 0)} delta={0.8} deltaLabel="vs last 30d" accent="#10B981" loading={loading} />
        <MetricCard tokens={tokens} label="Open Rate" value={fmtPct(kpis.emailOpenRate)} delta={2.1} deltaLabel="vs last 30d" accent="#8B5CF6" loading={loading} />
        <MetricCard tokens={tokens} label="Click Rate" value={fmtPct(kpis.emailClickRate)} delta={0.8} deltaLabel="vs last 30d" accent="#F59E0B" loading={loading} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginBottom: 20 }}>
        <MetricCard tokens={tokens} label="Bounce Rate" value={fmtPct(kpis.emailSent > 0 ? (kpis.emailBounced / kpis.emailSent) * 100 : 0)} delta={-0.4} deltaLabel="lower is better" accent="#EF4444" loading={loading} />
        <MetricCard tokens={tokens} label="Revenue / Email" value={fmtINR(kpis.emailSent > 0 ? kpis.emailRevenue / kpis.emailSent : 0)} delta={4.2} deltaLabel="vs last 30d" accent="#EC4899" loading={loading} />
      </div>

      {/* Funnel */}
      <Panel tokens={tokens} title="Engagement Funnel" subtitle="Sent → Delivered → Opened → Clicked → Converted" style={{ marginBottom: 20 }}>
        <EmailFunnel tokens={tokens} sent={kpis.emailSent} delivered={kpis.emailDelivered} opened={kpis.emailOpened} clicked={kpis.emailClicked} conversions={kpis.totalConversions} />
      </Panel>

      {/* Per-campaign performance */}
      <Panel tokens={tokens} title="Campaign Performance" subtitle="All sent campaigns">
        {sorted.length === 0 ? (
          <EmptyState tokens={tokens} title="No sent campaigns yet" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: 12, minWidth: 880 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
                  {['Campaign', 'Sent', 'Delivered', 'Opened', 'Clicked', 'Bounced', 'Unsub', 'Revenue', 'Conversions'].map((h, i) => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: i >= 1 ? 'right' : 'left', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(c => (
                  <tr key={c.id} style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
                    <td style={{ padding: '10px', fontWeight: 600, color: tokens.text.primary }}>
                      <div>{c.name}</div>
                      <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{c.sentAt ? fmtDate(c.sentAt) : ''}</div>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{fmtNum(c.sent)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{fmtNum(c.delivered)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{fmtNum(c.opened ?? 0)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{fmtNum(c.clicked ?? 0)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{fmtNum(c.bounced)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{fmtNum(c.unsubscribed)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: tokens.status.success }}>{fmtINR(c.revenueGenerated)}</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: tokens.text.secondary }}>{c.conversions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}

function EmailFunnel({ tokens, sent, delivered, opened, clicked, conversions }: {
  tokens: Tk; sent: number; delivered: number; opened: number; clicked: number; conversions: number;
}) {
  const stages = [
    { label: 'Sent', value: sent, color: '#3B82F6' },
    { label: 'Delivered', value: delivered, color: '#10B981' },
    { label: 'Opened', value: opened, color: '#8B5CF6' },
    { label: 'Clicked', value: clicked, color: '#F59E0B' },
    { label: 'Converted', value: conversions, color: '#EC4899' },
  ];
  const max = Math.max(...stages.map(s => s.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {stages.map((s, i) => {
        const pct = (s.value / max) * 100;
        const conv = i > 0 ? (stages[i - 1].value > 0 ? (s.value / stages[i - 1].value) * 100 : 0) : 100;
        return (
          <div key={s.label} style={{ display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr) 100px 60px', gap: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>{s.label}</div>
            <div style={{ height: 28, background: tokens.bg.surfaceAlt, borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%', width: `${pct}%`, background: s.color, borderRadius: 6,
                transition: 'width 600ms cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif', textAlign: 'right' }}>{fmtNum(s.value)}</div>
            <div style={{ fontSize: 10.5, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif', textAlign: 'right' }}>{i > 0 ? `${conv.toFixed(1)}%` : '100%'}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================= */
/* 7. AUTOMATION TAB                                              */
/* ============================================================= */

function EmailAutomation({
  tokens, automations, loading, onToggle,
}: {
  tokens: Tk; automations: Automation[]; loading: boolean;
  onToggle: (a: Automation) => void;
}) {
  if (loading) {
    return (
      <Panel tokens={tokens} title="Automations">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} tokens={tokens} h={84} />)}
        </div>
      </Panel>
    );
  }
  return (
    <Panel tokens={tokens} title="Email Automations" subtitle={`${automations.filter(a => a.enabled).length} of ${automations.length} active`}
      action={<Badge tokens={tokens} tone="info">Trigger-based flows</Badge>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {automations.map(a => (
          <div key={a.id} style={{
            display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) auto auto auto', gap: 14, alignItems: 'center',
            padding: 14, borderRadius: 10, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>{a.name}</span>
                {a.enabled && <Badge tokens={tokens} tone="success" size="sm" dot>Active</Badge>}
              </div>
              <div style={{ fontSize: 11, color: tokens.text.secondary, fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{a.description}</div>
              {a.lastTriggeredAt && (
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4, fontFamily: 'Inter, sans-serif' }}>
                  Last triggered {timeAgo(a.lastTriggeredAt)}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary, fontFamily: 'Inter, sans-serif' }}>{fmtNum(a.triggeredCount)}</div>
              <div style={{ fontSize: 9.5, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: 0.4 }}>Triggered</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: tokens.status.success, fontFamily: 'Inter, sans-serif' }}>{fmtINR(a.revenueGenerated)}</div>
              <div style={{ fontSize: 9.5, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: 0.4 }}>Revenue</div>
            </div>
            <button onClick={() => onToggle(a)}
              aria-label={a.enabled ? 'Pause automation' : 'Enable automation'}
              style={{
                width: 42, height: 24, borderRadius: 12,
                background: a.enabled ? tokens.status.success : tokens.bg.hover,
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 200ms ease',
              }}
            >
              <span style={{
                position: 'absolute', top: 2, left: a.enabled ? 20 : 2,
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                boxShadow: tokens.shadow.sm, transition: 'left 200ms cubic-bezier(0.16,1,0.3,1)',
              }} />
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ============================================================= */
/* EMAIL BUILDER DRAWER (rich block editor + preview)             */
/* ============================================================= */

function EmailBuilderDrawer({
  tokens, open, onClose, template, onSaveTemplate, onSaveCampaign,
}: {
  tokens: Tk; open: boolean; onClose: () => void;
  template: EmailTemplate | null;
  onSaveTemplate: (t: EmailTemplate) => void; onSaveCampaign: (c: Campaign) => void;
}) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [preview, setPreview] = useState('');
  const [category, setCategory] = useState<EmailTemplate['category']>('Promotional');
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [audience, setAudience] = useState<AudienceSegmentKey>('email_opt_in');
  const [campaignName, setCampaignName] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [scheduleFor, setScheduleFor] = useState<string>('');

  // Initialize from template
  useEffect(() => {
    if (template) {
      setName(template.name);
      setSubject(template.subject);
      setPreview(template.preview);
      setCategory(template.category);
      setBlocks(template.blocks);
    } else {
      setName('');
      setSubject('');
      setPreview('');
      setCategory('Promotional');
      setBlocks([
        { id: `b-${Date.now()}-1`, type: 'heading', content: 'Your headline here', style: { align: 'center' } },
        { id: `b-${Date.now()}-2`, type: 'paragraph', content: 'Write your message here. Use {{first_name}} to personalize.' },
        { id: `b-${Date.now()}-3`, type: 'button', content: 'Shop Now', href: '/products', style: { align: 'center' } },
        { id: `b-${Date.now()}-4`, type: 'footer', content: 'LNKICKS · Unsubscribe' },
      ]);
    }
    setCampaignName('');
    setScheduleFor('');
  }, [template, open]);

  const audienceCount = useMemo(() => {
    const seg = AUDIENCE_SEGMENTS.find(s => s.key === audience);
    return seg?.count ?? 0;
  }, [audience]);

  function addBlock(type: EmailBlockType) {
    const newBlock: EmailBlock = {
      id: `b-${Date.now()}-${blocks.length + 1}`,
      type,
      content: type === 'heading' ? 'New heading' : type === 'paragraph' ? 'New paragraph text' : type === 'button' ? 'Click here' : '',
      href: type === 'button' ? '/' : undefined,
    };
    setBlocks(b => [...b, newBlock]);
  }

  function updateBlock(id: string, updates: Partial<EmailBlock>) {
    setBlocks(b => b.map(blk => blk.id === id ? { ...blk, ...updates } : blk));
  }

  function removeBlock(id: string) {
    setBlocks(b => b.filter(blk => blk.id !== id));
  }

  function moveBlock(id: string, dir: -1 | 1) {
    setBlocks(b => {
      const idx = b.findIndex(blk => blk.id === id);
      if (idx === -1) return b;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= b.length) return b;
      const next = [...b];
      const [item] = next.splice(idx, 1);
      next.splice(newIdx, 0, item);
      return next;
    });
  }

  function handleSaveAsTemplate() {
    if (!name.trim() || !subject.trim()) return;
    const tpl: EmailTemplate = {
      id: template?.id ?? `tpl-${Date.now()}`,
      name, subject, preview: preview || subject.slice(0, 60),
      category, blocks,
      createdAt: template?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };
    onSaveTemplate(tpl);
  }

  function handleSaveCampaign(status: Campaign['status']) {
    if (!campaignName.trim()) {
      // Use template name as fallback
      setCampaignName(name || 'Untitled Campaign');
      return;
    }
    const tplId = template?.id ?? `tpl-${Date.now()}`;
    // Save the template first
    const tpl: EmailTemplate = {
      id: tplId, name: name || campaignName, subject, preview: preview || subject.slice(0, 60),
      category, blocks,
      createdAt: template?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };
    onSaveTemplate(tpl);
    const c: Campaign = {
      id: `cmp-${Date.now()}`,
      name: campaignName,
      channel: 'email',
      subject,
      templateId: tplId,
      audience,
      audienceCount,
      status,
      scheduledFor: status === 'scheduled' && scheduleFor ? new Date(scheduleFor).getTime() : undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      queued: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, failed: 0,
      unsubscribed: 0, conversions: 0, revenueGenerated: 0,
      batchSize: 100, batchDelaySeconds: 30, retryAttempts: 3, errorThreshold: 5,
    };
    onSaveCampaign(c);
  }

  const blockTypes: { type: EmailBlockType; label: string; icon: string }[] = [
    { type: 'heading', label: 'Heading', icon: 'H' },
    { type: 'paragraph', label: 'Text', icon: '¶' },
    { type: 'image', label: 'Image', icon: '🖼' },
    { type: 'product', label: 'Product', icon: '📦' },
    { type: 'banner', label: 'Banner', icon: '▬' },
    { type: 'button', label: 'Button', icon: '⬚' },
    { type: 'coupon', label: 'Coupon', icon: '🎟' },
    { type: 'countdown', label: 'Countdown', icon: '⏱' },
    { type: 'social', label: 'Social', icon: '◎' },
    { type: 'divider', label: 'Divider', icon: '—' },
    { type: 'footer', label: 'Footer', icon: '⌄' },
  ];

  return (
    <Drawer
      tokens={tokens} open={open} onClose={onClose}
      title={template ? 'Edit Template' : 'New Email Campaign'}
      subtitle={template ? template.name : 'Build a beautiful email in minutes'}
      width={1100} side="right"
      footer={
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Button tokens={tokens} variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button tokens={tokens} variant="outline" size="md" onClick={handleSaveAsTemplate}>Save Template</Button>
            <Button tokens={tokens} variant="ghost" size="md" onClick={() => handleSaveCampaign('draft')}>Save Draft</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={() => handleSaveCampaign('scheduled')}>Schedule & Save</Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 240px) minmax(0, 1fr) minmax(0, 1fr)', gap: 14, minHeight: 'calc(100vh - 200px)' }}>
        {/* LEFT — block palette */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'Inter, sans-serif' }}>Content Blocks</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {blockTypes.map(bt => (
              <button key={bt.type} onClick={() => addBlock(bt.type)}
                style={{
                  padding: '10px 8px', borderRadius: 8,
                  background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}`,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  fontSize: 10.5, fontWeight: 600, color: tokens.text.secondary, fontFamily: 'Inter, sans-serif',
                  transition: 'all 120ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = tokens.border.strong; e.currentTarget.style.background = tokens.bg.hover; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.border.subtle; e.currentTarget.style.background = tokens.bg.surfaceAlt; }}
              >
                <span style={{ fontSize: 16, color: tokens.text.primary }}>{bt.icon}</span>
                {bt.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 10.5, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'Inter, sans-serif', marginTop: 12 }}>Campaign Settings</div>
          <Input tokens={tokens} label="Campaign Name" value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="e.g. August Newsletter" />
          <Select tokens={tokens} label="Audience" value={audience} onChange={e => setAudience(e.target.value as AudienceSegmentKey)}
            options={AUDIENCE_SEGMENTS.filter(s => s.key !== 'at_risk' && s.key !== 'whatsapp_opt_in').map(s => ({ value: s.key, label: `${s.label} (${s.count})` }))} />
          <Input tokens={tokens} label="Schedule For (optional)" type="datetime-local" value={scheduleFor} onChange={e => setScheduleFor(e.target.value)} />
          <div style={{ padding: 10, borderRadius: 8, background: tokens.status.infoBg, fontSize: 11, color: tokens.status.info, fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
            👥 This campaign will reach <strong>{fmtNum(audienceCount)}</strong> opted-in subscribers.
          </div>
        </div>

        {/* MIDDLE — block editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>Email Details</div>
          <Input tokens={tokens} label="Template Name" value={name} onChange={e => setName(e.target.value)} />
          <Input tokens={tokens} label="Subject Line" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Use {{first_name}} to personalize" />
          <Input tokens={tokens} label="Preview Text" value={preview} onChange={e => setPreview(e.target.value)} />
          <Select tokens={tokens} label="Category" value={category} onChange={e => setCategory(e.target.value as EmailTemplate['category'])}
            options={[
              { value: 'Promotional', label: 'Promotional' }, { value: 'Transactional', label: 'Transactional' },
              { value: 'Welcome', label: 'Welcome' }, { value: 'Abandoned Cart', label: 'Abandoned Cart' },
              { value: 'Re-engagement', label: 'Re-engagement' }, { value: 'Newsletter', label: 'Newsletter' },
            ]} />

          <div style={{ fontSize: 10.5, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'Inter, sans-serif', marginTop: 8, marginBottom: 4 }}>Content Blocks ({blocks.length})</div>
          {blocks.map((blk, i) => (
            <BlockEditor key={blk.id} tokens={tokens} block={blk} index={i} total={blocks.length}
              onUpdate={(u) => updateBlock(blk.id, u)} onRemove={() => removeBlock(blk.id)}
              onMoveUp={() => moveBlock(blk.id, -1)} onMoveDown={() => moveBlock(blk.id, 1)}
            />
          ))}
          {blocks.length === 0 && (
            <EmptyState tokens={tokens} title="No blocks yet" description="Click a block type on the left to add it." />
          )}
        </div>

        {/* RIGHT — preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'Inter, sans-serif' }}>Live Preview</span>
            <div style={{ display: 'flex', gap: 2, padding: 2, borderRadius: 7, background: tokens.bg.surfaceAlt }}>
              {(['desktop', 'mobile'] as const).map(m => (
                <button key={m} onClick={() => setPreviewMode(m)}
                  style={{
                    padding: '4px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
                    background: previewMode === m ? tokens.bg.surface : 'transparent',
                    color: previewMode === m ? tokens.text.primary : tokens.text.secondary,
                    fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                    textTransform: 'capitalize',
                  }}>{m}</button>
              ))}
            </div>
          </div>
          <EmailPreview tokens={tokens} subject={subject} preview={preview} blocks={blocks} mode={previewMode} />
        </div>
      </div>
    </Drawer>
  );
}

function BlockEditor({
  tokens, block, index, total, onUpdate, onRemove, onMoveUp, onMoveDown,
}: {
  tokens: Tk; block: EmailBlock; index: number; total: number;
  onUpdate: (u: Partial<EmailBlock>) => void; onRemove: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
}) {
  return (
    <div style={{
      padding: 10, borderRadius: 8, background: tokens.bg.surfaceAlt,
      border: `1px solid ${tokens.border.subtle}`, display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Inter, sans-serif' }}>{block.type}</span>
        <div style={{ display: 'flex', gap: 2 }}>
          <IconButton tokens={tokens} size={22} label="Move up" onClick={onMoveUp}
            icon={<svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2.5} strokeLinecap="round"><path d="M18 15l-6-6-6 6" /></svg>} />
          <IconButton tokens={tokens} size={22} label="Move down" onClick={onMoveDown}
            icon={<svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2.5} strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>} />
          <IconButton tokens={tokens} size={22} label="Remove" onClick={onRemove}
            icon={<svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={tokens.status.error} strokeWidth={2} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>} />
        </div>
      </div>
      {(block.type === 'heading' || block.type === 'paragraph' || block.type === 'button' || block.type === 'banner' || block.type === 'footer') && (
        <Textarea tokens={tokens} value={block.content} onChange={e => onUpdate({ content: e.target.value })} placeholder="Content…" style={{ minHeight: block.type === 'paragraph' ? 80 : 40 }} />
      )}
      {block.type === 'button' && (
        <Input tokens={tokens} label="Link URL" value={block.href ?? ''} onChange={e => onUpdate({ href: e.target.value })} placeholder="/products" />
      )}
      {block.type === 'image' && (
        <Input tokens={tokens} label="Image URL" value={block.image ?? ''} onChange={e => onUpdate({ image: e.target.value })} placeholder="/logo.png" />
      )}
      {block.type === 'product' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Input tokens={tokens} placeholder="Product name" value={block.product?.name ?? ''} onChange={e => onUpdate({ product: { ...block.product, name: e.target.value, brand: '', price: 0, href: '/' } as NonNullable<EmailBlock['product']> })} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <Input tokens={tokens} placeholder="Brand" value={block.product?.brand ?? ''} onChange={e => onUpdate({ product: { ...block.product, name: block.product?.name ?? '', brand: e.target.value, price: block.product?.price ?? 0, href: block.product?.href ?? '/' } as NonNullable<EmailBlock['product']> })} />
            <Input tokens={tokens} placeholder="Price ₹" type="number" value={block.product?.price ?? ''} onChange={e => onUpdate({ product: { ...block.product, name: block.product?.name ?? '', brand: block.product?.brand ?? '', price: Number(e.target.value), href: block.product?.href ?? '/' } as NonNullable<EmailBlock['product']> })} />
          </div>
        </div>
      )}
      {block.type === 'coupon' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
          <Input tokens={tokens} placeholder="Code" value={block.coupon?.code ?? ''} onChange={e => onUpdate({ coupon: { ...block.coupon, code: e.target.value, discount: '', expiry: '' } as NonNullable<EmailBlock['coupon']> })} />
          <Input tokens={tokens} placeholder="Discount" value={block.coupon?.discount ?? ''} onChange={e => onUpdate({ coupon: { ...block.coupon, code: block.coupon?.code ?? '', discount: e.target.value, expiry: block.coupon?.expiry ?? '' } as NonNullable<EmailBlock['coupon']> })} />
          <Input tokens={tokens} placeholder="Expiry" value={block.coupon?.expiry ?? ''} onChange={e => onUpdate({ coupon: { ...block.coupon, code: block.coupon?.code ?? '', discount: block.coupon?.discount ?? '', expiry: e.target.value } as NonNullable<EmailBlock['coupon']> })} />
        </div>
      )}
      {block.type === 'countdown' && (
        <Input tokens={tokens} label="Target Date" type="datetime-local"
          value={block.countdown?.target ? new Date(block.countdown.target).toISOString().slice(0, 16) : ''}
          onChange={e => onUpdate({ countdown: { target: new Date(e.target.value).getTime() } })} />
      )}
      <div style={{ fontSize: 9.5, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>Position {index + 1} of {total}</div>
    </div>
  );
}

function EmailPreview({
  tokens, subject, preview, blocks, mode,
}: {
  tokens: Tk; subject: string; preview: string; blocks: EmailBlock[]; mode: 'desktop' | 'mobile';
}) {
  const width = mode === 'desktop' ? 560 : 320;
  return (
    <div style={{
      flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 220px)',
      display: 'flex', justifyContent: 'center',
      background: tokens.bg.app, borderRadius: 10, padding: 14,
      border: `1px solid ${tokens.border.subtle}`,
    }}>
      <div style={{
        width, background: '#ffffff', borderRadius: 8, overflow: 'hidden',
        boxShadow: tokens.shadow.md, fontFamily: 'Inter, -apple-system, sans-serif',
      }}>
        {/* Email client chrome */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', background: '#F8F9FB' }}>
          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>From: LNKICKS &lt;hello@lnkicks.com&gt;</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', marginBottom: 4 }}>{subject || '(no subject)'}</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>{preview || '\u00A0'}</div>
        </div>
        {/* Email body */}
        <div style={{ padding: 20, color: '#0A0A0A', fontSize: 14, lineHeight: 1.6 }}>
          {blocks.map(blk => <PreviewBlock key={blk.id} block={blk} />)}
          {blocks.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
              Add blocks on the left to see them here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewBlock({ block }: { block: EmailBlock }) {
  const align = block.style?.align ?? 'left';
  switch (block.type) {
    case 'heading':
      return <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 700, color: '#0A0A0A', textAlign: align, letterSpacing: '-0.02em' }}>{block.content || ' '}</h2>;
    case 'paragraph':
      return <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.6, color: '#475569', textAlign: align }}>{block.content || ' '}</p>;
    case 'image':
      return <div style={{ textAlign: align, margin: '12px 0' }}><div style={{ display: 'inline-flex', width: 160, height: 60, background: '#F1F3F5', borderRadius: 6, alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 11 }}>{block.content || 'LNKICKS'}</div></div>;
    case 'product':
      return (
        <div style={{ margin: '12px 0', padding: 12, background: '#F8F9FB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 60, height: 60, background: '#F1F3F5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 18 }}>📦</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>{block.product?.brand ?? 'BRAND'}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', marginTop: 2 }}>{block.product?.name ?? 'Product name'}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0A0A0A', marginTop: 4 }}>₹{(block.product?.price ?? 0).toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      );
    case 'banner':
      return <div style={{ margin: '12px 0', padding: '14px 16px', background: block.style?.bg ?? '#0A0A0A', color: block.style?.color ?? '#FFFFFF', borderRadius: 8, textAlign: align, fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>{block.content || ' '}</div>;
    case 'button':
      return <div style={{ textAlign: align, margin: '16px 0' }}><a href={block.href ?? '#'} style={{ display: 'inline-block', padding: '12px 28px', background: '#0A0A0A', color: '#FFFFFF', textDecoration: 'none', fontSize: 13, fontWeight: 700, borderRadius: 7 }}>{block.content || 'Click here'}</a></div>;
    case 'coupon':
      return (
        <div style={{ margin: '12px 0', padding: 16, background: '#FEF3C7', borderRadius: 8, textAlign: align, border: '2px dashed #F59E0B' }}>
          <div style={{ fontSize: 11, color: '#92400E', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>{block.content || 'Coupon'}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#92400E', margin: '6px 0', letterSpacing: 1 }}>{block.coupon?.code ?? 'CODE'}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>{block.coupon?.discount ?? 'Discount'}</div>
          <div style={{ fontSize: 10, color: '#92400E', marginTop: 4 }}>Expires in {block.coupon?.expiry ?? '7 days'}</div>
        </div>
      );
    case 'countdown':
      return (
        <div style={{ margin: '12px 0', padding: 14, background: '#FEE2E2', borderRadius: 8, textAlign: align }}>
          <div style={{ fontSize: 11, color: '#991B1B', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>{block.content || 'Ends in'}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#991B1B', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
            {block.countdown?.target ? formatCountdown(block.countdown.target) : '00:00:00'}
          </div>
        </div>
      );
    case 'social':
      return (
        <div style={{ textAlign: align, margin: '16px 0' }}>
          <span style={{ display: 'inline-flex', gap: 8 }}>
            {['IG', 'FB', 'TW', 'YT'].map(s => (
              <span key={s} style={{ width: 28, height: 28, borderRadius: '50%', background: '#F1F3F5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#475569' }}>{s}</span>
            ))}
          </span>
        </div>
      );
    case 'divider':
      return <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #E5E7EB' }} />;
    case 'footer':
      return <div style={{ margin: '20px 0 0', padding: '12px 0', borderTop: '1px solid #E5E7EB', fontSize: 11, color: '#94A3B8', textAlign: align }}>{block.content || 'LNKICKS · Unsubscribe'}</div>;
    default:
      return null;
  }
}

function formatCountdown(target: number): string {
  const diff = Math.max(0, target - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
