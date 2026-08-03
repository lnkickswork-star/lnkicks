/**
 * LNKICKS Enterprise Admin — SEO Center
 * ------------------------------------------------------------
 * Premium SEO workspace with:
 *  - SEO Health Score
 *  - Meta for Website / Product / Category / Brand / Collection
 *  - Schema & Rich Results
 *  - Sitemap (auto-generated)
 *  - Google integrations (GA4, Search Console, Merchant, Ads)
 *  - Microsoft (Bing, Clarity)
 *  - Social Pixels (FB, Insta, Pinterest, TikTok, etc.)
 *  - AI SEO Assistant (button — generates meta/keywords/FAQ)
 *  - Broken links, missing ALT, duplicate content
 *  - Performance / Core Web Vitals
 */

'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, Panel, Tabs, useToast, Input, Textarea,
  Toggle, ProgressBar, Select, Drawer,
} from '@/components/admin/ui';

type TabKey = 'overview' | 'meta' | 'schema' | 'integrations' | 'pixels' | 'audit' | 'performance';

export default function SEOPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [tab, setTab] = useState<TabKey>('overview');
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <AdminLayout
      title="SEO Center"
      subtitle="Search engine optimization"
      requirePermission="seo.manage"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }, { label: 'SEO Center' }]}
    >
      <PageHeader
        tokens={tokens}
        title="SEO Center"
        subtitle="Manage meta tags, schema, sitemaps, search console, social pixels, and AI-assisted content optimization."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }, { label: 'SEO Center' }]}
        meta={<Badge tokens={tokens} tone="success" dot>Score 87</Badge>}
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'success', title: 'Sitemap regenerated', message: '42 pages added' })}
              icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.text.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0zM12 7v5l3 2" /></svg>}
            >Regenerate Sitemap</Button>
            <Button tokens={tokens} variant="primary" size="md" onClick={() => setAiOpen(true)}
              icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5z" /></svg>}
            >AI SEO Assistant</Button>
          </>
        }
      />

      <Tabs
        tokens={tokens}
        tabs={[
          { key: 'overview', label: 'Overview' },
          { key: 'meta', label: 'Meta Tags' },
          { key: 'schema', label: 'Schema' },
          { key: 'integrations', label: 'Google & Microsoft' },
          { key: 'pixels', label: 'Social Pixels' },
          { key: 'audit', label: 'Content Audit' },
          { key: 'performance', label: 'Performance' },
        ]}
        active={tab}
        onChange={(k) => setTab(k as TabKey)}
      />

      <div style={{ marginTop: 20 }}>
        {tab === 'overview' && <OverviewTab tokens={tokens} />}
        {tab === 'meta' && <MetaTab tokens={tokens} pushToast={pushToast} />}
        {tab === 'schema' && <SchemaTab tokens={tokens} />}
        {tab === 'integrations' && <IntegrationsTab tokens={tokens} pushToast={pushToast} />}
        {tab === 'pixels' && <PixelsTab tokens={tokens} pushToast={pushToast} />}
        {tab === 'audit' && <AuditTab tokens={tokens} />}
        {tab === 'performance' && <PerformanceTab tokens={tokens} />}
      </div>

      <Drawer
        tokens={tokens}
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title="AI SEO Assistant"
        subtitle="Generate optimized SEO content automatically"
        width={520}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => setAiOpen(false)}>Cancel</Button>
            <Button tokens={tokens} variant="primary" onClick={() => {
              pushToast({ tone: 'success', title: 'SEO content generated', message: 'Meta, keywords, FAQ, schema ready.' });
              setAiOpen(false);
            }}>Generate All</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input tokens={tokens} label="Product / Page Name" placeholder="Air Jordan 1 Low Powder Blue" />
          <Select tokens={tokens} label="Content Type"
            options={[
              { value: 'product', label: 'Product Page' },
              { value: 'category', label: 'Category Page' },
              { value: 'blog', label: 'Blog Post' },
              { value: 'homepage', label: 'Homepage' },
            ]}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Toggle tokens={tokens} checked={true} onChange={() => {}} label="Meta Title (60 chars)" />
            <Toggle tokens={tokens} checked={true} onChange={() => {}} label="Meta Description" />
            <Toggle tokens={tokens} checked={true} onChange={() => {}} label="Keywords" />
            <Toggle tokens={tokens} checked={true} onChange={() => {}} label="Short Description" />
            <Toggle tokens={tokens} checked={true} onChange={() => {}} label="Long Description" />
            <Toggle tokens={tokens} checked={true} onChange={() => {}} label="Image ALT Tags" />
            <Toggle tokens={tokens} checked={true} onChange={() => {}} label="FAQ Schema" />
            <Toggle tokens={tokens} checked={true} onChange={() => {}} label="Product Schema" />
          </div>
          <div style={{
            background: tokens.status.infoBg, borderRadius: 10, padding: 12,
            border: `1px solid ${tokens.status.info}30`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: tokens.status.info, marginBottom: 4 }}>💡 Tip</div>
            <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5 }}>
              AI-generated content is a starting point. Always review for accuracy and brand voice before publishing.
            </div>
          </div>
        </div>
      </Drawer>
    </AdminLayout>
  );
}

/* ------------------- Tabs ------------------- */

function OverviewTab({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  const score = 87;
  const issues = [
    { label: 'Missing meta descriptions', count: 8, tone: 'warning' as const },
    { label: 'Missing ALT tags', count: 14, tone: 'critical' as const },
    { label: 'Duplicate content', count: 2, tone: 'warning' as const },
    { label: 'Broken links', count: 1, tone: 'critical' as const },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: 16 }}>
      <Panel tokens={tokens} title="SEO Health Score" subtitle="Based on 24 metrics">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16, gap: 10 }}>
          <div style={{ position: 'relative', width: 140, height: 140 }}>
            <svg width={140} height={140} viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="60" fill="none" stroke={tokens.bg.surfaceAlt} strokeWidth={12} />
              <circle cx="70" cy="70" r="60" fill="none" stroke={score >= 80 ? tokens.status.success : score >= 60 ? tokens.status.warning : tokens.status.error}
                strokeWidth={12} strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 377} 377`}
                transform="rotate(-90 70 70)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: tokens.text.primary }}>{score}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>Good</div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: tokens.text.secondary, marginBottom: 4 }}>Improvements needed:</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              {issues.map(i => (
                <Badge key={i.label} tokens={tokens} tone={i.tone} size="sm">{i.count} {i.label}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Panel>
      <Panel tokens={tokens} title="Indexed Pages" subtitle="Search Console snapshot">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          <StatBox tokens={tokens} label="Indexed" value="1,240" tone="success" />
          <StatBox tokens={tokens} label="Crawling" value="32" tone="info" />
          <StatBox tokens={tokens} label="Excluded" value="18" tone="neutral" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h4 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>Top performing pages</h4>
          {[
            { url: '/product/air-jordan-1-low-powder-blue', clicks: 4200, impressions: 28400, ctr: 14.8 },
            { url: '/category/jordan', clicks: 3100, impressions: 18900, ctr: 16.4 },
            { url: '/product/samba-og-cloud-white', clicks: 2800, impressions: 22100, ctr: 12.7 },
            { url: '/category/adidas', clicks: 1900, impressions: 14600, ctr: 13.0 },
          ].map(p => (
            <div key={p.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
              <div style={{ fontSize: 11, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace' }}>{p.url}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
                <span style={{ color: tokens.text.secondary }}>{p.clicks.toLocaleString('en-IN')} clicks</span>
                <span style={{ color: tokens.text.tertiary }}>{p.impressions.toLocaleString('en-IN')} impr</span>
                <span style={{ color: tokens.status.success, fontWeight: 700 }}>{p.ctr}%</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function MetaTab({ tokens, pushToast }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; pushToast: (t: any) => void }) {
  const [scope, setScope] = useState('homepage');
  return (
    <Panel tokens={tokens} title="Meta Tags Editor" subtitle="Manage SEO metadata across all page types"
      action={<Select tokens={tokens} value={scope} onChange={e => setScope(e.target.value)}
        options={[
          { value: 'homepage', label: 'Homepage' },
          { value: 'product', label: 'Product Pages' },
          { value: 'category', label: 'Category Pages' },
          { value: 'brand', label: 'Brand Pages' },
          { value: 'collection', label: 'Collection Pages' },
          { value: 'blog', label: 'Blog Posts' },
        ]}
        style={{ height: 32, width: 160 }}
      />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Input tokens={tokens} label="Meta Title" defaultValue="LNKICKS — Premium Sneakers, Air Jordan, Yeezy, Adidas | India's #1 Sneaker Store"
          hint="60 characters recommended · Currently 82 chars" />
        <Textarea tokens={tokens} label="Meta Description" defaultValue="Shop authentic Air Jordan, Nike Dunk, Yeezy, Adidas Samba & more premium sneakers at LNKICKS. Free shipping in India. COD available. 7-day returns."
          hint="160 characters recommended · Currently 145 chars" />
        <Input tokens={tokens} label="Meta Keywords" defaultValue="sneakers india, air jordan, yeezy, nike dunk, adidas samba, premium sneakers, sneaker store india" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input tokens={tokens} label="Canonical URL" defaultValue="https://lnkicks.vercel.app/" />
          <Input tokens={tokens} label="Slug" defaultValue="/" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input tokens={tokens} label="OpenGraph Title" defaultValue="LNKICKS — India's #1 Premium Sneaker Store" />
          <Input tokens={tokens} label="Twitter Card Title" defaultValue="LNKICKS — Premium Sneakers" />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <Button tokens={tokens} variant="primary" onClick={() => pushToast({ tone: 'success', title: 'Meta saved', message: `${scope} meta updated` })}>Save Meta</Button>
          <Button tokens={tokens} variant="outline" onClick={() => pushToast({ tone: 'info', title: 'AI generating', message: 'Meta description in progress…' })}>Generate with AI</Button>
        </div>
      </div>
    </Panel>
  );
}

function SchemaTab({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  const schemas = [
    { name: 'Organization Schema', status: 'Active', desc: 'Brand info, logo, contact, social profiles' },
    { name: 'Product Schema', status: 'Active', desc: 'Price, availability, rating, reviews for every product' },
    { name: 'Breadcrumb Schema', status: 'Active', desc: 'Navigation trail on category & product pages' },
    { name: 'FAQ Schema', status: 'Partial', desc: 'Q&A on product pages — 8 of 42 pages have FAQs' },
    { name: 'Review Schema', status: 'Active', desc: 'Aggregated rating from verified reviews' },
    { name: 'Video Schema', status: 'Disabled', desc: 'Product video markup for rich results' },
    { name: 'Image Schema', status: 'Active', desc: 'Image metadata for Google Images' },
  ];
  return (
    <Panel tokens={tokens} title="Structured Data" subtitle="JSON-LD schema markup for rich results">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {schemas.map(s => (
          <div key={s.name} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt,
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{s.name}</div>
              <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{s.desc}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StatusPill tokens={tokens} status={s.status} />
              <Toggle tokens={tokens} checked={s.status !== 'Disabled'} onChange={() => {}} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function IntegrationsTab({ tokens, pushToast }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; pushToast: (t: any) => void }) {
  const integrations = [
    { name: 'Google Analytics 4', icon: '📊', status: 'connected', desc: 'Track visitor behavior, conversions, and funnels' },
    { name: 'Google Search Console', icon: '🔍', status: 'connected', desc: 'Monitor search performance, indexing, sitemaps' },
    { name: 'Google Tag Manager', icon: '🏷️', status: 'connected', desc: 'Manage all tracking tags without code changes' },
    { name: 'Google Merchant Center', icon: '🛍️', status: 'disconnected', desc: 'Submit product feed for Shopping Ads' },
    { name: 'Google Ads', icon: '💰', status: 'connected', desc: 'Run search, display, and Shopping campaigns' },
    { name: 'Google Business Profile', icon: '📍', status: 'disconnected', desc: 'Local business listing and reviews' },
    { name: 'Bing Webmaster Tools', icon: '🅱️', status: 'disconnected', desc: 'Index and monitor on Bing search' },
    { name: 'Microsoft Clarity', icon: '🔬', status: 'connected', desc: 'Free heatmaps, session recordings, and analytics' },
    { name: 'Microsoft Ads', icon: '💰', status: 'disconnected', desc: 'Run ads on Bing, Yahoo, AOL' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
      {integrations.map(int => (
        <div key={int.name} style={{
          background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
          borderRadius: 12, padding: 14, boxShadow: tokens.shadow.sm,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: tokens.bg.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{int.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{int.name}</div>
              <StatusPill tokens={tokens} status={int.status === 'connected' ? 'Connected' : 'Disconnected'} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: tokens.text.secondary, marginBottom: 10, lineHeight: 1.5 }}>{int.desc}</div>
          <Button tokens={tokens} variant={int.status === 'connected' ? 'outline' : 'primary'} size="sm" fullWidth
            onClick={() => pushToast({ tone: int.status === 'connected' ? 'info' : 'success', title: int.status === 'connected' ? 'Opening settings' : 'Connecting…', message: int.name })}
          >{int.status === 'connected' ? 'Configure' : 'Connect'}</Button>
        </div>
      ))}
    </div>
  );
}

function PixelsTab({ tokens, pushToast }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; pushToast: (t: any) => void }) {
  const pixels = [
    { name: 'Facebook Pixel', id: 'FB-9876543210', status: 'Active' },
    { name: 'Instagram', id: 'via FB Pixel', status: 'Active' },
    { name: 'Pinterest Tag', id: 'PT-1234567890', status: 'Active' },
    { name: 'TikTok Pixel', id: 'TT-0987654321', status: 'Disabled' },
    { name: 'Snapchat Pixel', id: 'SC-5678901234', status: 'Disabled' },
    { name: 'LinkedIn Insight', id: 'LI-3456789012', status: 'Active' },
    { name: 'Twitter Pixel', id: 'TW-7890123456', status: 'Disabled' },
  ];
  return (
    <Panel tokens={tokens} title="Social Media Pixels" subtitle="Conversion tracking pixels for paid social">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pixels.map(p => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{p.name}</div>
              <div style={{ fontSize: 11, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace', marginTop: 1 }}>{p.id}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <StatusPill tokens={tokens} status={p.status} />
              <Toggle tokens={tokens} checked={p.status === 'Active'} onChange={() => pushToast({ tone: 'info', title: 'Pixel toggled', message: p.name })} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function AuditTab({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  const issues = [
    { type: 'Missing ALT', severity: 'critical', count: 14, desc: 'Images missing alt text on product pages' },
    { type: 'Missing Meta Description', severity: 'warning', count: 8, desc: 'Pages with no meta description set' },
    { type: 'Duplicate Content', severity: 'warning', count: 2, desc: 'Products with identical descriptions' },
    { type: 'Broken Links', severity: 'critical', count: 1, desc: '404 errors from internal links' },
    { type: 'Missing Canonical', severity: 'warning', count: 5, desc: 'Pages without canonical URLs' },
    { type: 'Orphan Pages', severity: 'info', count: 3, desc: 'Pages with no internal links pointing to them' },
    { type: 'Redirect Loops', severity: 'critical', count: 0, desc: 'No redirect loops detected' },
  ];
  return (
    <Panel tokens={tokens} title="Content Audit" subtitle="Identify SEO issues across the site"
      action={<Button tokens={tokens} variant="outline" size="sm" onClick={() => {}}>Re-run Audit</Button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {issues.map(issue => (
          <div key={issue.type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Badge tokens={tokens} tone={issue.severity === 'critical' ? 'critical' : issue.severity === 'warning' ? 'warning' : 'info'} size="sm">{issue.severity}</Badge>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{issue.type}</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{issue.desc}</div>
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: issue.count > 0 ? tokens.status.warning : tokens.status.success }}>{issue.count}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function PerformanceTab({ tokens }: { tokens: ReturnType<typeof useAdminTheme>['tokens'] }) {
  const metrics = [
    { name: 'Largest Contentful Paint (LCP)', value: '1.8s', target: '< 2.5s', score: 92, status: 'good' },
    { name: 'Cumulative Layout Shift (CLS)', value: '0.04', target: '< 0.1', score: 95, status: 'good' },
    { name: 'Interaction to Next Paint (INP)', value: '180ms', target: '< 200ms', score: 78, status: 'needs improvement' },
    { name: 'First Input Delay (FID)', value: '90ms', target: '< 100ms', score: 88, status: 'good' },
    { name: 'Time to First Byte (TTFB)', value: '420ms', target: '< 600ms', score: 84, status: 'good' },
    { name: 'Total Blocking Time (TBT)', value: '120ms', target: '< 200ms', score: 86, status: 'good' },
  ];
  const lighthouseScores = [
    { category: 'Performance', score: 88 },
    { category: 'Accessibility', score: 94 },
    { category: 'Best Practices', score: 96 },
    { category: 'SEO', score: 92 },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Panel tokens={tokens} title="Lighthouse Scores" subtitle="Last audit: 2 hours ago">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {lighthouseScores.map(s => {
            const color = s.score >= 90 ? tokens.status.success : s.score >= 50 ? tokens.status.warning : tokens.status.error;
            return (
              <div key={s.category} style={{ textAlign: 'center', padding: 16, background: tokens.bg.surfaceAlt, borderRadius: 10 }}>
                <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 8px' }}>
                  <svg width={80} height={80} viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke={tokens.bg.surface} strokeWidth={6} />
                    <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"
                      strokeDasharray={`${(s.score / 100) * 201} 201`} transform="rotate(-90 40 40)" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: tokens.text.primary }}>{s.score}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary }}>{s.category}</div>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel tokens={tokens} title="Core Web Vitals" subtitle="Real user metrics (last 28 days)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {metrics.map(m => (
            <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{m.name}</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>Target: {m.target}</div>
              </div>
              <div style={{ width: 100 }}>
                <ProgressBar tokens={tokens} value={m.score} color={m.score >= 90 ? tokens.status.success : m.score >= 70 ? tokens.status.warning : tokens.status.error} />
              </div>
              <div style={{ minWidth: 60, textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{m.value}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function StatBox({ tokens, label, value, tone }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; label: string; value: string; tone: 'success' | 'info' | 'neutral' }) {
  const color = tone === 'success' ? tokens.status.success : tone === 'info' ? tokens.status.info : tokens.text.secondary;
  return (
    <div style={{ background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{label}</div>
    </div>
  );
}
