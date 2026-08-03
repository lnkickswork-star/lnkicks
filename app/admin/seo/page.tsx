/**
 * LNKICKS Enterprise Admin — SEO Center
 * ------------------------------------------------------------
 * Enterprise SEO command center with:
 *  - SEO Health Score (gauge + 24 sub-metrics)
 *  - Meta Tags (title, description, keywords, OG, Twitter Card, canonical)
 *  - Structured Data (JSON-LD schema library)
 *  - Sitemap + Robots.txt + Canonical URLs
 *  - Index Status (Google + Bing)
 *  - Broken Links table
 *  - Performance Insights (Lighthouse + Core Web Vitals)
 *  - Google & Microsoft integrations
 *  - Social Pixels (FB, IG, Pinterest, TikTok, etc.)
 *  - AI SEO Assistant
 */

'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, Panel, Tabs, useToast, Input, Textarea,
  Toggle, ProgressBar, Select, Drawer, EmptyState,
} from '@/components/admin/ui';
import type { AdminThemeTokens } from '@/lib/admin/types';

type TabKey = 'overview' | 'meta' | 'schema' | 'sitemap' | 'index' | 'integrations' | 'pixels' | 'audit' | 'performance';

/* ----------------------------- Page ----------------------------- */

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
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'SEO Center' }]}
    >
      <style jsx global>{`
        @keyframes seo-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .seo-stagger > * { animation: seo-fade-in 420ms cubic-bezier(0.16,1,0.3,1) both; }
        .seo-stagger > *:nth-child(1) { animation-delay: 30ms; }
        .seo-stagger > *:nth-child(2) { animation-delay: 70ms; }
        .seo-stagger > *:nth-child(3) { animation-delay: 110ms; }
      `}</style>

      <PageHeader
        tokens={tokens}
        title="SEO Center"
        subtitle="Manage meta tags, schema, sitemaps, search console, social pixels, and AI-assisted content optimization — all in one workspace."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'SEO Center' }]}
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
          { key: 'sitemap', label: 'Sitemap & Robots' },
          { key: 'index', label: 'Index Status' },
          { key: 'integrations', label: 'Integrations' },
          { key: 'pixels', label: 'Social Pixels' },
          { key: 'audit', label: 'Content Audit' },
          { key: 'performance', label: 'Performance' },
        ]}
        active={tab}
        onChange={(k) => setTab(k as TabKey)}
      />

      <div className="seo-stagger" style={{ marginTop: 20 }}>
        {tab === 'overview' && <OverviewTab tokens={tokens} />}
        {tab === 'meta' && <MetaTab tokens={tokens} pushToast={pushToast} />}
        {tab === 'schema' && <SchemaTab tokens={tokens} />}
        {tab === 'sitemap' && <SitemapTab tokens={tokens} pushToast={pushToast} />}
        {tab === 'index' && <IndexTab tokens={tokens} />}
        {tab === 'integrations' && <IntegrationsTab tokens={tokens} pushToast={pushToast} />}
        {tab === 'pixels' && <PixelsTab tokens={tokens} pushToast={pushToast} />}
        {tab === 'audit' && <AuditTab tokens={tokens} pushToast={pushToast} />}
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

/* ----------------------------- Overview Tab ----------------------------- */

function OverviewTab({ tokens }: { tokens: AdminThemeTokens }) {
  const score = 87;
  const issues = [
    { label: 'Missing meta descriptions', count: 8, tone: 'warning' as const },
    { label: 'Missing ALT tags', count: 14, tone: 'critical' as const },
    { label: 'Duplicate content', count: 2, tone: 'warning' as const },
    { label: 'Broken links', count: 1, tone: 'critical' as const },
  ];
  const subScores = [
    { label: 'On-Page SEO', score: 92, color: '#10B981' },
    { label: 'Technical SEO', score: 88, color: '#3B82F6' },
    { label: 'Content Quality', score: 84, color: '#8B5CF6' },
    { label: 'User Experience', score: 90, color: '#F59E0B' },
    { label: 'Mobile Usability', score: 95, color: '#EC4899' },
    { label: 'Page Speed', score: 78, color: '#EF4444' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: 16 }}>
      {/* Score Gauge */}
      <Panel tokens={tokens} title="SEO Health Score" subtitle="Based on 24 metrics">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16, gap: 14 }}>
          <div style={{ position: 'relative', width: 160, height: 160 }}>
            <svg width={160} height={160} viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke={tokens.bg.surfaceAlt} strokeWidth={14} />
              <circle cx="80" cy="80" r="68" fill="none" stroke={score >= 80 ? tokens.status.success : score >= 60 ? tokens.status.warning : tokens.status.error}
                strokeWidth={14} strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 427} 427`}
                transform="rotate(-90 80 80)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 42, fontWeight: 800, color: tokens.text.primary, letterSpacing: '-0.02em' }}>{score}</div>
              <div style={{ fontSize: 10, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>Good · Top 12%</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 8 }}>Improvements needed</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              {issues.map(i => (
                <Badge key={i.label} tokens={tokens} tone={i.tone} size="sm">{i.count} {i.label}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Top Performing Pages */}
      <Panel tokens={tokens} title="Indexed Pages" subtitle="Search Console snapshot">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10, marginBottom: 16 }}>
          <StatBox tokens={tokens} label="Indexed" value="1,240" tone="success" />
          <StatBox tokens={tokens} label="Crawling" value="32" tone="info" />
          <StatBox tokens={tokens} label="Excluded" value="18" tone="neutral" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h4 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: tokens.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>Top performing pages</h4>
          {[
            { url: '/product/air-jordan-1-low-powder-blue', clicks: 4200, impressions: 28400, ctr: 14.8, position: 3.2 },
            { url: '/category/jordan', clicks: 3100, impressions: 18900, ctr: 16.4, position: 2.8 },
            { url: '/product/samba-og-cloud-white', clicks: 2800, impressions: 22100, ctr: 12.7, position: 4.5 },
            { url: '/category/adidas', clicks: 1900, impressions: 14600, ctr: 13.0, position: 5.1 },
          ].map(p => (
            <div key={p.url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: tokens.bg.surfaceAlt, transition: 'background 120ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={e => { e.currentTarget.style.background = tokens.bg.surfaceAlt; }}
            >
              <div style={{ fontSize: 11, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace', minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.url}</div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11, flexShrink: 0 }}>
                <span style={{ color: tokens.text.secondary }}>{p.clicks.toLocaleString('en-IN')} clicks</span>
                <span style={{ color: tokens.text.tertiary }}>{p.impressions.toLocaleString('en-IN')} impr</span>
                <span style={{ color: tokens.text.tertiary }}>#{p.position}</span>
                <span style={{ color: tokens.status.success, fontWeight: 700 }}>{p.ctr}%</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Sub-Scores */}
      <Panel tokens={tokens} title="SEO Category Scores" subtitle="Breakdown by category" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12 }}>
          {subScores.map(s => (
            <div key={s.label} style={{ padding: 12, borderRadius: 10, background: tokens.bg.surfaceAlt, textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 70, height: 70, margin: '0 auto 6px' }}>
                <svg width={70} height={70} viewBox="0 0 70 70">
                  <circle cx="35" cy="35" r="28" fill="none" stroke={tokens.bg.surface} strokeWidth={5} />
                  <circle cx="35" cy="35" r="28" fill="none" stroke={s.color} strokeWidth={5} strokeLinecap="round"
                    strokeDasharray={`${(s.score / 100) * 176} 176`} transform="rotate(-90 35 35)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: tokens.text.primary }}>{s.score}</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.secondary }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ----------------------------- Meta Tab ----------------------------- */

function MetaTab({ tokens, pushToast }: { tokens: AdminThemeTokens; pushToast: (t: any) => void }) {
  const [scope, setScope] = useState('homepage');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 320px)', gap: 16 }}>
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
            hint="60 characters recommended · Currently 82 chars · ⚠️ Too long" />
          <Textarea tokens={tokens} label="Meta Description" defaultValue="Shop authentic Air Jordan, Nike Dunk, Yeezy, Adidas Samba & more premium sneakers at LNKICKS. Free shipping in India. COD available. 7-day returns."
            hint="160 characters recommended · Currently 145 chars · ✓ Optimal length" />
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

      {/* Search Preview */}
      <Panel tokens={tokens} title="Search Result Preview" subtitle="Google SERP appearance">
        <div style={{ padding: 14, background: tokens.bg.surfaceAlt, borderRadius: 10, fontFamily: 'Inter, sans-serif' }}>
          <div style={{ fontSize: 11, color: tokens.text.tertiary, marginBottom: 4 }}>google.com</div>
          <div style={{ fontSize: 16, color: '#1a0dab', fontWeight: 400, marginBottom: 2, lineHeight: 1.3 }}>LNKICKS — Premium Sneakers, Air Jordan, Yeezy, Adidas | India&apos;s #1 Sneaker Store</div>
          <div style={{ fontSize: 12, color: '#006621', marginBottom: 4 }}>https://lnkicks.vercel.app</div>
          <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.4 }}>Shop authentic Air Jordan, Nike Dunk, Yeezy, Adidas Samba & more premium sneakers at LNKICKS. Free shipping in India. COD available. 7-day returns.</div>
        </div>
        <div style={{ marginTop: 12, padding: 14, background: tokens.bg.surfaceAlt, borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 6 }}>Social Card Preview</div>
          <div style={{
            aspectRatio: '1.91/1', borderRadius: 8, overflow: 'hidden',
            background: `linear-gradient(135deg, ${tokens.bg.surface}, ${tokens.bg.surfaceAlt})`,
            border: `1px solid ${tokens.border.subtle}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 10,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.primary }}>LNKICKS — India&apos;s #1 Premium Sneaker Store</div>
            <div style={{ fontSize: 9, color: tokens.text.tertiary, marginTop: 2 }}>lnkicks.vercel.app</div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ----------------------------- Schema Tab ----------------------------- */

function SchemaTab({ tokens }: { tokens: AdminThemeTokens }) {
  const schemas = [
    { name: 'Organization Schema', status: 'Active', desc: 'Brand info, logo, contact, social profiles', coverage: '100%' },
    { name: 'Product Schema', status: 'Active', desc: 'Price, availability, rating, reviews for every product', coverage: '100%' },
    { name: 'Breadcrumb Schema', status: 'Active', desc: 'Navigation trail on category & product pages', coverage: '100%' },
    { name: 'FAQ Schema', status: 'Partial', desc: 'Q&A on product pages — 8 of 42 pages have FAQs', coverage: '19%' },
    { name: 'Review Schema', status: 'Active', desc: 'Aggregated rating from verified reviews', coverage: '100%' },
    { name: 'Video Schema', status: 'Disabled', desc: 'Product video markup for rich results', coverage: '0%' },
    { name: 'Image Schema', status: 'Active', desc: 'Image metadata for Google Images', coverage: '100%' },
    { name: 'Article Schema', status: 'Disabled', desc: 'Blog post markup for news & articles', coverage: '0%' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
      <Panel tokens={tokens} title="Structured Data" subtitle="JSON-LD schema markup for rich results">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {schemas.map(s => (
            <div key={s.name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt,
              transition: 'background 120ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = tokens.bg.hover; }}
              onMouseLeave={e => { e.currentTarget.style.background = tokens.bg.surfaceAlt; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{s.name}</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{s.desc}</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>Coverage: {s.coverage}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <StatusPill tokens={tokens} status={s.status} />
                <Toggle tokens={tokens} checked={s.status !== 'Disabled'} onChange={() => {}} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel tokens={tokens} title="JSON-LD Preview" subtitle="Sample product schema">
        <div style={{
          background: '#0d1117', borderRadius: 10, padding: 14,
          fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#c9d1d9',
          overflow: 'auto', maxHeight: 460, lineHeight: 1.5,
        }}>
          <pre style={{ margin: 0 }}>{`{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Air Jordan 1 Low Powder Blue",
  "image": "https://lnkicks.vercel.app/jordan.png",
  "description": "Premium Air Jordan 1 Low in powder blue colorway.",
  "brand": {
    "@type": "Brand",
    "name": "JORDAN"
  },
  "sku": "AJ1-PB-001",
  "offers": {
    "@type": "Offer",
    "url": "https://lnkicks.vercel.app/product/aj1-pb",
    "priceCurrency": "INR",
    "price": "12999",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "142"
  }
}`}</pre>
        </div>
      </Panel>
    </div>
  );
}

/* ----------------------------- Sitemap Tab ----------------------------- */

function SitemapTab({ tokens, pushToast }: { tokens: AdminThemeTokens; pushToast: (t: any) => void }) {
  const sitemapUrls = [
    { url: 'https://lnkicks.vercel.app/sitemap.xml', count: 1240, lastGen: '2 hours ago', status: 'Healthy' },
    { url: 'https://lnkicks.vercel.app/sitemap-products.xml', count: 980, lastGen: '2 hours ago', status: 'Healthy' },
    { url: 'https://lnkicks.vercel.app/sitemap-categories.xml', count: 142, lastGen: '2 hours ago', status: 'Healthy' },
    { url: 'https://lnkicks.vercel.app/sitemap-brands.xml', count: 78, lastGen: '2 hours ago', status: 'Healthy' },
    { url: 'https://lnkicks.vercel.app/sitemap-blog.xml', count: 40, lastGen: '1 day ago', status: 'Stale' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 16 }}>
      <Panel tokens={tokens} title="Sitemap" subtitle="Auto-generated XML sitemaps"
        action={<Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'success', title: 'Sitemap regenerated' })}>Regenerate</Button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sitemapUrls.map(s => (
            <div key={s.url} style={{ padding: 10, borderRadius: 8, background: tokens.bg.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 11, color: tokens.text.primary, fontFamily: 'ui-monospace, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.url}</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{s.count} URLs · {s.lastGen}</div>
              </div>
              <StatusPill tokens={tokens} status={s.status} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel tokens={tokens} title="Robots.txt" subtitle="Crawl directives">
        <div style={{
          background: '#0d1117', borderRadius: 10, padding: 14,
          fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#c9d1d9',
          lineHeight: 1.5,
        }}>
          <pre style={{ margin: 0 }}>{`User-agent: *
Allow: /
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /api

User-agent: Googlebot
Allow: /

Sitemap: https://lnkicks.vercel.app/sitemap.xml`}</pre>
        </div>
      </Panel>

      <Panel tokens={tokens} title="Canonical URLs" subtitle="Prevent duplicate content issues" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { url: '/product/air-jordan-1-low', canonical: 'https://lnkicks.vercel.app/product/air-jordan-1-low-powder-blue' },
            { url: '/category/jordan?page=2', canonical: 'https://lnkicks.vercel.app/category/jordan' },
            { url: '/category/adidas?sort=price', canonical: 'https://lnkicks.vercel.app/category/adidas' },
          ].map(c => (
            <div key={c.url} style={{ display: 'flex', gap: 12, padding: '8px 10px', borderRadius: 6, background: tokens.bg.surfaceAlt, fontSize: 11 }}>
              <span style={{ color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace', minWidth: 200 }}>{c.url}</span>
              <span style={{ color: tokens.text.tertiary }}>→</span>
              <span style={{ color: tokens.text.primary, fontFamily: 'ui-monospace, monospace', flex: 1 }}>{c.canonical}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ----------------------------- Index Status Tab ----------------------------- */

function IndexTab({ tokens }: { tokens: AdminThemeTokens }) {
  const indexData = [
    { engine: 'Google', icon: '🔍', indexed: 1240, crawling: 32, excluded: 18, error: 4, total: 1294, color: '#4285F4' },
    { engine: 'Bing', icon: '🅱️', indexed: 1180, crawling: 18, excluded: 12, error: 2, total: 1212, color: '#008373' },
    { engine: 'Yandex', icon: '🟡', indexed: 980, crawling: 8, excluded: 4, error: 1, total: 993, color: '#FF0000' },
  ];
  const brokenLinks = [
    { url: '/product/yeezy-350-v2-zebra-old', status: 404, foundOn: '/category/yeezy', lastSeen: '2 days ago' },
    { url: '/blog/2025-summer-trends', status: 404, foundOn: '/blog', lastSeen: '5 days ago' },
    { url: '/category/sneakers?brand=nike&page=99', status: 404, foundOn: 'Google SERP', lastSeen: '1 week ago' },
    { url: '/product/air-force-1-triple-white', status: 500, foundOn: 'Internal link', lastSeen: '3 hours ago' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Panel tokens={tokens} title="Index Status" subtitle="Pages indexed by search engine">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          {indexData.map(eng => {
            const pct = (eng.indexed / eng.total) * 100;
            return (
              <div key={eng.engine} style={{ padding: 14, borderRadius: 12, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${eng.color}1A`, color: eng.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{eng.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{eng.engine}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary }}>{eng.total} total URLs</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: tokens.status.success }}>{eng.indexed.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', fontWeight: 700 }}>Indexed</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: tokens.status.info }}>{eng.crawling}</div>
                    <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', fontWeight: 700 }}>Crawling</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: tokens.text.secondary }}>{eng.excluded}</div>
                    <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', fontWeight: 700 }}>Excluded</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: tokens.status.error }}>{eng.error}</div>
                    <div style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', fontWeight: 700 }}>Errors</div>
                  </div>
                </div>
                <ProgressBar tokens={tokens} value={pct} color={eng.color} />
                <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 4 }}>{pct.toFixed(1)}% coverage</div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel tokens={tokens} title="Broken Links" subtitle="4xx & 5xx errors detected across the site"
        action={<Button tokens={tokens} variant="outline" size="sm">Re-scan</Button>}
      >
        {brokenLinks.length === 0 ? (
          <EmptyState tokens={tokens} icon={<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={1.5}><path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="No broken links found" description="All internal and external links are healthy." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif', fontSize: 12, minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
                  {['URL', 'Status', 'Found On', 'Last Seen', ''].map(h => (
                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brokenLinks.map(b => (
                  <tr key={b.url} style={{ borderBottom: `1px solid ${tokens.border.subtle}` }}>
                    <td style={{ padding: '8px 10px', fontFamily: 'ui-monospace, monospace', color: tokens.text.primary, fontSize: 11 }}>{b.url}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <Badge tokens={tokens} tone={b.status >= 500 ? 'critical' : 'warning'} size="sm">{b.status}</Badge>
                    </td>
                    <td style={{ padding: '8px 10px', color: tokens.text.secondary, fontSize: 11 }}>{b.foundOn}</td>
                    <td style={{ padding: '8px 10px', color: tokens.text.tertiary, fontSize: 11 }}>{b.lastSeen}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                      <Button tokens={tokens} variant="ghost" size="sm">Fix</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ----------------------------- Integrations Tab ----------------------------- */

function IntegrationsTab({ tokens, pushToast }: { tokens: AdminThemeTokens; pushToast: (t: any) => void }) {
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
          transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = tokens.shadow.md; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = tokens.shadow.sm; }}
        >
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

/* ----------------------------- Pixels Tab ----------------------------- */

function PixelsTab({ tokens, pushToast }: { tokens: AdminThemeTokens; pushToast: (t: any) => void }) {
  const pixels = [
    { name: 'Facebook Pixel', id: 'FB-9876543210', status: 'Active', events: 8 },
    { name: 'Instagram', id: 'via FB Pixel', status: 'Active', events: 8 },
    { name: 'Pinterest Tag', id: 'PT-1234567890', status: 'Active', events: 6 },
    { name: 'TikTok Pixel', id: 'TT-0987654321', status: 'Disabled', events: 0 },
    { name: 'Snapchat Pixel', id: 'SC-5678901234', status: 'Disabled', events: 0 },
    { name: 'LinkedIn Insight', id: 'LI-3456789012', status: 'Active', events: 4 },
    { name: 'Twitter Pixel', id: 'TW-7890123456', status: 'Disabled', events: 0 },
  ];
  return (
    <Panel tokens={tokens} title="Social Media Pixels" subtitle="Conversion tracking pixels for paid social">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pixels.map(p => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{p.name}</div>
              <div style={{ fontSize: 11, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace', marginTop: 1 }}>{p.id} · {p.events} events tracked</div>
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

/* ----------------------------- Audit Tab ----------------------------- */

function AuditTab({ tokens, pushToast }: { tokens: AdminThemeTokens; pushToast: (t: any) => void }) {
  const issues = [
    { type: 'Missing ALT', severity: 'critical', count: 14, desc: 'Images missing alt text on product pages', pages: ['/product/aj1-low', '/product/samba-og', '...'] },
    { type: 'Missing Meta Description', severity: 'warning', count: 8, desc: 'Pages with no meta description set', pages: ['/blog/3', '/blog/4', '...'] },
    { type: 'Duplicate Content', severity: 'warning', count: 2, desc: 'Products with identical descriptions', pages: ['/product/af1-tw', '/product/af1-black'] },
    { type: 'Broken Links', severity: 'critical', count: 1, desc: '404 errors from internal links', pages: ['/product/yeezy-old'] },
    { type: 'Missing Canonical', severity: 'warning', count: 5, desc: 'Pages without canonical URLs', pages: ['/category/nike?page=2', '...'] },
    { type: 'Orphan Pages', severity: 'info', count: 3, desc: 'Pages with no internal links pointing to them', pages: ['/blog/old-post', '...'] },
    { type: 'Redirect Loops', severity: 'critical', count: 0, desc: 'No redirect loops detected', pages: [] },
  ];
  return (
    <Panel tokens={tokens} title="Content Audit" subtitle="Identify SEO issues across the site"
      action={<Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Re-running audit', message: 'Scanning 1,294 URLs…' })}>Re-run Audit</Button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {issues.map(issue => (
          <div key={issue.type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
              <Badge tokens={tokens} tone={issue.severity === 'critical' ? 'critical' : issue.severity === 'warning' ? 'warning' : 'info'} size="sm">{issue.severity}</Badge>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{issue.type}</div>
                <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{issue.desc}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {issue.count > 0 && <span style={{ fontSize: 10, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace' }}>{issue.pages[0]}</span>}
              <div style={{ fontSize: 18, fontWeight: 800, color: issue.count > 0 ? (issue.severity === 'critical' ? tokens.status.error : tokens.status.warning) : tokens.status.success }}>{issue.count}</div>
              {issue.count > 0 && <Button tokens={tokens} variant="ghost" size="sm">Fix</Button>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ----------------------------- Performance Tab ----------------------------- */

function PerformanceTab({ tokens }: { tokens: AdminThemeTokens }) {
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
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

/* ----------------------------- Helpers ----------------------------- */

function StatBox({ tokens, label, value, tone }: { tokens: AdminThemeTokens; label: string; value: string; tone: 'success' | 'info' | 'neutral' }) {
  const color = tone === 'success' ? tokens.status.success : tone === 'info' ? tokens.status.info : tokens.text.secondary;
  return (
    <div style={{ background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{label}</div>
    </div>
  );
}
