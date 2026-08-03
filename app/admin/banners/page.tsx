/**
 * LNKICKS Enterprise Admin — Banner CMS
 * ------------------------------------------------------------
 * Visual banner management workspace with:
 *  - Desktop / Mobile / Tablet independent slots
 *  - Banner types: Hero, Offer, Category, Popup, Slider
 *  - Drag & drop reordering (priority order)
 *  - Schedule (start/end date), Draft/Publish/Scheduled/Expired
 *  - Desktop + Mobile preview side-by-side
 *  - Version history (audit trail of changes)
 *  - Campaign assignment (link to flash sale / coupon)
 *  - Performance metrics (impressions, clicks, CTR, revenue)
 *
 * Reuses existing Banner data shape.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, Tabs, Drawer, useToast, IconButton,
  Input, Select, Panel, EmptyState, Dropdown, MenuItem, MenuDivider,
} from '@/components/admin/ui';
import { PlusIcon } from '@/components/admin/ui';
import type { AdminThemeTokens } from '@/lib/admin/types';

/* ----------------------------- Types ----------------------------- */

type BannerSlot = 'desktop' | 'mobile' | 'tablet';
type BannerType = 'Homepage Hero' | 'Offer Banner' | 'Category Banner' | 'Popup' | 'Slider';
type BannerStatus = 'Published' | 'Draft' | 'Scheduled' | 'Expired';

interface Banner {
  id: string;
  title: string;
  slot: BannerSlot;
  type: BannerType;
  status: BannerStatus;
  startDate: string;
  endDate: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  overlay: number;
  views: number;
  clicks: number;
  revenue: number;
  position: number;
  campaign?: string;
  lastEdited: string;
  lastEditedBy: string;
  versions: number;
}

/* ----------------------------- Data ----------------------------- */

const SEED: Banner[] = [
  { id: 'b1', title: 'Summer Drop 2026 — Air Jordan Collection', slot: 'desktop', type: 'Homepage Hero', status: 'Published', startDate: '2026-08-01', endDate: '2026-08-31', ctaText: 'Shop Now', ctaLink: '/category/jordan', backgroundImage: '/jordan_powder_blue_nobg.png', overlay: 30, views: 28400, clicks: 1820, revenue: 224000, position: 1, campaign: 'Summer Drop 2026', lastEdited: '2026-08-02', lastEditedBy: 'Aarav', versions: 4 },
  { id: 'b2', title: 'Flat 40% Off — Adidas Samba', slot: 'desktop', type: 'Offer Banner', status: 'Published', startDate: '2026-08-02', endDate: '2026-08-10', ctaText: 'Grab Deal', ctaLink: '/category/adidas', backgroundImage: '/samba_og_nobg.png', overlay: 45, views: 18900, clicks: 2410, revenue: 188000, position: 2, campaign: 'Mid-Week Madness', lastEdited: '2026-08-01', lastEditedBy: 'Diya', versions: 2 },
  { id: 'b3', title: 'New Arrivals — Yeezy Boost 350', slot: 'desktop', type: 'Slider', status: 'Published', startDate: '2026-07-25', endDate: '2026-08-25', ctaText: 'Explore', ctaLink: '/category/yeezy', backgroundImage: '/yeezy_zebra_nobg.png', overlay: 50, views: 14200, clicks: 980, revenue: 142000, position: 3, lastEdited: '2026-07-24', lastEditedBy: 'Karthik', versions: 3 },
  { id: 'b4', title: 'New Arrivals — Yeezy Boost 350', slot: 'mobile', type: 'Homepage Hero', status: 'Published', startDate: '2026-07-25', endDate: '2026-08-25', ctaText: 'Explore', ctaLink: '/category/yeezy', backgroundImage: '/yeezy_zebra_nobg.png', overlay: 50, views: 14200, clicks: 980, revenue: 142000, position: 1, campaign: 'Yeezy Drop', lastEdited: '2026-07-24', lastEditedBy: 'Karthik', versions: 3 },
  { id: 'b5', title: 'Festival Special — Diwali Drops', slot: 'mobile', type: 'Popup', status: 'Scheduled', startDate: '2026-10-15', endDate: '2026-11-05', ctaText: 'Preview', ctaLink: '/flash-sale-settings', backgroundImage: '', overlay: 60, views: 0, clicks: 0, revenue: 0, position: 2, campaign: 'Diwali Festival', lastEdited: '2026-08-01', lastEditedBy: 'Diya', versions: 1 },
  { id: 'b6', title: 'Tablet Hero — Premium Sneakers', slot: 'tablet', type: 'Homepage Hero', status: 'Draft', startDate: '2026-08-05', endDate: '2026-09-05', ctaText: 'Shop', ctaLink: '/', backgroundImage: '', overlay: 35, views: 0, clicks: 0, revenue: 0, position: 1, lastEdited: '2026-08-03', lastEditedBy: 'Aarav', versions: 1 },
  { id: 'b7', title: 'Refer & Earn ₹100', slot: 'mobile', type: 'Popup', status: 'Published', startDate: '2026-07-15', endDate: '2026-12-31', ctaText: 'Refer Now', ctaLink: '/profile', backgroundImage: '', overlay: 70, views: 31200, clicks: 1840, revenue: 96000, position: 3, lastEdited: '2026-07-14', lastEditedBy: 'Sara', versions: 5 },
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

export default function BannersPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [banners, setBanners] = useState<Banner[]>(SEED);
  const [slot, setSlot] = useState<BannerSlot>('desktop');
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);
  const [historyBanner, setHistoryBanner] = useState<Banner | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const filtered = useMemo(() => banners.filter(b => b.slot === slot).sort((a, b) => a.position - b.position), [banners, slot]);

  const counts = useMemo(() => ({
    published: banners.filter(b => b.status === 'Published').length,
    scheduled: banners.filter(b => b.status === 'Scheduled').length,
    draft: banners.filter(b => b.status === 'Draft').length,
    totalImpressions: banners.reduce((s, b) => s + b.views, 0),
    totalClicks: banners.reduce((s, b) => s + b.clicks, 0),
    totalRevenue: banners.reduce((s, b) => s + b.revenue, 0),
  }), [banners]);

  const togglePublish = useCallback((id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'Published' ? 'Draft' : 'Published', lastEdited: new Date().toISOString().slice(0, 10), versions: b.versions + 1 } : b));
    pushToast({ tone: 'success', title: 'Status updated' });
  }, [pushToast]);

  const deleteBanner = useCallback((id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    pushToast({ tone: 'success', title: 'Banner deleted' });
  }, [pushToast]);

  const duplicateBanner = useCallback((b: Banner) => {
    const copy: Banner = { ...b, id: `b-${Date.now()}`, title: `${b.title} (Copy)`, status: 'Draft', position: filtered.length + 1, views: 0, clicks: 0, revenue: 0, versions: 1, lastEdited: new Date().toISOString().slice(0, 10) };
    setBanners(prev => [...prev, copy]);
    pushToast({ tone: 'success', title: 'Banner duplicated' });
  }, [pushToast, filtered.length]);

  const movePosition = useCallback((id: string, dir: 'up' | 'down') => {
    setBanners(prev => {
      const sorted = [...prev.filter(b => b.slot === slot)].sort((a, b) => a.position - b.position);
      const idx = sorted.findIndex(b => b.id === id);
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const a = sorted[idx]; const b = sorted[swapIdx];
      const tmp = a.position; a.position = b.position; b.position = tmp;
      return [...prev];
    });
  }, [slot]);

  // Drag & drop reorder
  const onDragStart = useCallback((id: string) => setDraggedId(id), []);
  const onDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
  }, [draggedId]);
  const onDrop = useCallback((targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setBanners(prev => {
      const sorted = [...prev.filter(b => b.slot === slot)].sort((a, b) => a.position - b.position);
      const fromIdx = sorted.findIndex(b => b.id === draggedId);
      const toIdx = sorted.findIndex(b => b.id === targetId);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [moved] = sorted.splice(fromIdx, 1);
      sorted.splice(toIdx, 0, moved);
      sorted.forEach((b, i) => { b.position = i + 1; });
      return [...prev];
    });
    setDraggedId(null);
    pushToast({ tone: 'success', title: 'Order updated' });
  }, [draggedId, slot, pushToast]);

  return (
    <AdminLayout
      title="Banners"
      subtitle="Marketing campaigns"
      requirePermission="banner.manage"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Banners' }]}
    >
      <style jsx global>{`
        @keyframes bn-card-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bn-drag-over { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
        .bn-stagger > * { animation: bn-card-in 450ms cubic-bezier(0.16,1,0.3,1) both; }
        .bn-stagger > *:nth-child(1) { animation-delay: 30ms; }
        .bn-stagger > *:nth-child(2) { animation-delay: 70ms; }
        .bn-stagger > *:nth-child(3) { animation-delay: 110ms; }
        .bn-stagger > *:nth-child(4) { animation-delay: 150ms; }
        .bn-stagger > *:nth-child(5) { animation-delay: 190ms; }
        .bn-dragging { opacity: 0.4; }
        .bn-drag-over { animation: bn-drag-over 200ms ease; }
      `}</style>

      <PageHeader
        tokens={tokens}
        title="Banner CMS"
        subtitle="Visual content management for desktop, mobile, and tablet banners. Drag & drop to reorder, schedule campaigns, preview across devices, and track performance."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Banners' }]}
        meta={
          <span style={{ display: 'inline-flex', gap: 6 }}>
            <Badge tokens={tokens} tone="success">{counts.published} live</Badge>
            <Badge tokens={tokens} tone="info">{counts.scheduled} scheduled</Badge>
          </span>
        }
        actions={
          <Button tokens={tokens} variant="primary" size="md" onClick={() => setCreateOpen(true)}
            icon={<PlusIcon size={14} color={tokens.bg.app} />}
          >New Banner</Button>
        }
      />

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 20 }}>
        <KPIStrip tokens={tokens} label="Impressions" value={fmtNum(counts.totalImpressions)} sub="All live banners" tone="info" />
        <KPIStrip tokens={tokens} label="Clicks" value={fmtNum(counts.totalClicks)} sub={`${counts.totalImpressions > 0 ? ((counts.totalClicks / counts.totalImpressions) * 100).toFixed(1) : '0'}% CTR`} tone="success" />
        <KPIStrip tokens={tokens} label="Revenue" value={fmtINR(counts.totalRevenue)} sub="Attributed to banners" tone="warning" />
        <KPIStrip tokens={tokens} label="Drafts" value={String(counts.draft)} sub="Awaiting publish" tone="critical" />
      </div>

      {/* Slot tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'desktop', label: '🖥️ Desktop', badge: banners.filter(b => b.slot === 'desktop').length },
          { key: 'mobile', label: '📱 Mobile', badge: banners.filter(b => b.slot === 'mobile').length },
          { key: 'tablet', label: '💻 Tablet', badge: banners.filter(b => b.slot === 'tablet').length },
        ]} active={slot} onChange={(k) => setSlot(k as BannerSlot)} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: tokens.text.tertiary }}>↕ Drag to reorder priority</span>
      </div>

      {/* Banner grid */}
      {filtered.length === 0 ? (
        <Panel tokens={tokens}>
          <EmptyState
            tokens={tokens}
            icon={<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 16l5-5 4 4 3-3 6 6" /></svg>}
            title={`No ${slot} banners yet`}
            description={`Create your first ${slot} banner to showcase campaigns, offers, and new arrivals.`}
            action={<Button tokens={tokens} variant="primary" size="md" onClick={() => setCreateOpen(true)} icon={<PlusIcon size={12} color={tokens.bg.app} />}>Create Banner</Button>}
          />
        </Panel>
      ) : (
        <div className="bn-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 14 }}>
          {filtered.map((b, i) => (
            <BannerCard
              key={b.id}
              tokens={tokens}
              banner={b}
              index={i}
              total={filtered.length}
              isDragging={draggedId === b.id}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onEdit={() => setEditBanner(b)}
              onPreview={() => setPreviewBanner(b)}
              onHistory={() => setHistoryBanner(b)}
              onDuplicate={() => duplicateBanner(b)}
              onTogglePublish={() => togglePublish(b.id)}
              onDelete={() => deleteBanner(b.id)}
              onMoveUp={() => movePosition(b.id, 'up')}
              onMoveDown={() => movePosition(b.id, 'down')}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewBanner && (
        <BannerPreviewModal tokens={tokens} banner={previewBanner} onClose={() => setPreviewBanner(null)} />
      )}

      {/* Version History */}
      {historyBanner && (
        <VersionHistoryDrawer tokens={tokens} banner={historyBanner} onClose={() => setHistoryBanner(null)} />
      )}

      {/* Edit / Create Drawer */}
      <Drawer
        tokens={tokens}
        open={Boolean(editBanner) || createOpen}
        onClose={() => { setEditBanner(null); setCreateOpen(false); }}
        title={editBanner ? 'Edit Banner' : 'Create Banner'}
        subtitle={editBanner?.title}
        width={520}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => { setEditBanner(null); setCreateOpen(false); }}>Cancel</Button>
            <Button tokens={tokens} variant="primary" onClick={() => {
              pushToast({ tone: 'success', title: editBanner ? 'Banner saved' : 'Banner created' });
              setEditBanner(null); setCreateOpen(false);
            }}>{editBanner ? 'Save Changes' : 'Create Banner'}</Button>
          </>
        }
      >
        <BannerForm tokens={tokens} banner={editBanner} slot={slot} />
      </Drawer>
    </AdminLayout>
  );
}

/* ----------------------------- Banner Card ----------------------------- */

function BannerCard({ tokens, banner, index, total, isDragging, onDragStart, onDragOver, onDrop, onEdit, onPreview, onHistory, onDuplicate, onTogglePublish, onDelete, onMoveUp, onMoveDown }: {
  tokens: AdminThemeTokens; banner: Banner; index: number; total: number;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (id: string) => void;
  onEdit: () => void; onPreview: () => void; onHistory: () => void;
  onDuplicate: () => void; onTogglePublish: () => void; onDelete: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
}) {
  const aspectRatio = banner.slot === 'mobile' ? '9/12' : banner.slot === 'tablet' ? '4/3' : '16/6';
  const ctr = banner.views > 0 ? (banner.clicks / banner.views) * 100 : 0;
  const isLive = banner.status === 'Published';

  return (
    <div
      draggable
      onDragStart={() => onDragStart(banner.id)}
      onDragOver={(e) => onDragOver(e, banner.id)}
      onDrop={() => onDrop(banner.id)}
      className={isDragging ? 'bn-dragging' : ''}
      style={{
        background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
        borderRadius: 14, overflow: 'hidden', boxShadow: tokens.shadow.sm,
        transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
        cursor: 'grab', position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = tokens.shadow.md; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = tokens.border.strong; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = tokens.shadow.sm; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = tokens.border.subtle; }}
    >
      {/* Preview area */}
      <div style={{
        position: 'relative',
        aspectRatio,
        background: banner.backgroundImage
          ? `linear-gradient(rgba(0,0,0,${banner.overlay / 100}), rgba(0,0,0,${banner.overlay / 100})), url(${banner.backgroundImage})`
          : `linear-gradient(135deg, ${tokens.bg.surfaceAlt}, ${tokens.bg.hover})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 14,
      }}>
        {/* Top badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, background: 'rgba(0,0,0,0.6)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, backdropFilter: 'blur(4px)',
            }}>{banner.position}</div>
            <Badge tokens={tokens} tone="neutral" size="sm">{banner.type}</Badge>
            {banner.campaign && <Badge tokens={tokens} tone="info" size="sm">{banner.campaign}</Badge>}
          </div>
          <StatusPill tokens={tokens} status={banner.status} />
        </div>

        {/* Drag handle indicator */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          opacity: 0, transition: 'opacity 200ms ease',
        }}>
          <div style={{
            padding: '6px 12px', borderRadius: 20, background: 'rgba(0,0,0,0.7)',
            color: '#fff', fontSize: 10, fontWeight: 700, backdropFilter: 'blur(8px)',
          }}>⠿ Drag to reorder</div>
        </div>

        {/* Content overlay */}
        <div style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{banner.title}</div>
          {banner.ctaText && (
            <div style={{
              display: 'inline-block', padding: '4px 10px',
              background: '#fff', color: '#000', borderRadius: 6,
              fontSize: 10, fontWeight: 700,
            }}>{banner.ctaText}</div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: 12 }}>
        {/* Schedule */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: tokens.text.secondary }}>
            📅 {new Date(banner.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(banner.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <IconButton tokens={tokens} icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 15l-6-6-6 6" /></svg>} label="Move up" size={24} onClick={onMoveUp} disabled={index === 0} />
            <IconButton tokens={tokens} icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>} label="Move down" size={24} onClick={onMoveDown} disabled={index === total - 1} />
          </div>
        </div>

        {/* Metrics */}
        {isLive ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 8, padding: '6px 8px', background: tokens.bg.surfaceAlt, borderRadius: 6 }}>
            <div>
              <div style={{ fontSize: 9, color: tokens.text.tertiary, fontWeight: 600 }}>Views</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{fmtNum(banner.views)}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: tokens.text.tertiary, fontWeight: 600 }}>Clicks</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{fmtNum(banner.clicks)}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: tokens.text.tertiary, fontWeight: 600 }}>CTR</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: ctr >= 5 ? tokens.status.success : tokens.status.warning }}>{ctr.toFixed(1)}%</div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '6px 8px', background: tokens.bg.surfaceAlt, borderRadius: 6, marginBottom: 8, fontSize: 11, color: tokens.text.tertiary, textAlign: 'center' }}>
            Not yet published
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 4 }}>
          <Button tokens={tokens} variant="outline" size="sm" onClick={onPreview}>Preview</Button>
          <Button tokens={tokens} variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
          <Button tokens={tokens} variant="ghost" size="sm" onClick={onHistory}>v{banner.versions}</Button>
          <div style={{ flex: 1 }} />
          <Dropdown tokens={tokens} align="right" width={170}
            trigger={<IconButton tokens={tokens} size={26} icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>} label="More" />}
          >
            <MenuItem tokens={tokens} onClick={onTogglePublish}>{isLive ? 'Unpublish' : 'Publish'}</MenuItem>
            <MenuItem tokens={tokens} onClick={onDuplicate}>Duplicate</MenuItem>
            <MenuDivider tokens={tokens} />
            <MenuItem tokens={tokens} danger onClick={onDelete}>Delete</MenuItem>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Banner Preview Modal ----------------------------- */

function BannerPreviewModal({ tokens, banner, onClose }: { tokens: AdminThemeTokens; banner: Banner; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: tokens.bg.overlay,
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{ maxWidth: 1100, width: '100%', background: tokens.bg.surface, borderRadius: 14, padding: 20, boxShadow: tokens.shadow.lg }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: tokens.text.primary }}>Banner Preview</div>
            <div style={{ fontSize: 11, color: tokens.text.secondary }}>{banner.title}</div>
          </div>
          <IconButton tokens={tokens} size={30} icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>} label="Close" onClick={onClose} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          {/* Desktop preview */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, marginBottom: 6 }}>🖥️ DESKTOP · 1920×720</div>
            <div style={{
              aspectRatio: '16/6', borderRadius: 10, overflow: 'hidden', position: 'relative',
              background: banner.backgroundImage
                ? `linear-gradient(rgba(0,0,0,${banner.overlay / 100}), rgba(0,0,0,${banner.overlay / 100})), url(${banner.backgroundImage})`
                : `linear-gradient(135deg, ${tokens.bg.surfaceAlt}, ${tokens.bg.hover})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20,
              border: `1px solid ${tokens.border.subtle}`,
            }}>
              <div style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{banner.title}</div>
                {banner.ctaText && <div style={{ display: 'inline-block', padding: '8px 16px', background: '#fff', color: '#000', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{banner.ctaText}</div>}
              </div>
            </div>
          </div>
          {/* Mobile preview */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, marginBottom: 6 }}>📱 MOBILE · 800×1000</div>
            <div style={{
              aspectRatio: '9/12', borderRadius: 10, overflow: 'hidden', position: 'relative',
              background: banner.backgroundImage
                ? `linear-gradient(rgba(0,0,0,${banner.overlay / 100}), rgba(0,0,0,${banner.overlay / 100})), url(${banner.backgroundImage})`
                : `linear-gradient(135deg, ${tokens.bg.surfaceAlt}, ${tokens.bg.hover})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 14,
              border: `1px solid ${tokens.border.subtle}`,
            }}>
              <div style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>{banner.title}</div>
                {banner.ctaText && <div style={{ display: 'inline-block', padding: '4px 10px', background: '#fff', color: '#000', borderRadius: 5, fontSize: 10, fontWeight: 700 }}>{banner.ctaText}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Version History Drawer ----------------------------- */

function VersionHistoryDrawer({ tokens, banner, onClose }: { tokens: AdminThemeTokens; banner: Banner; onClose: () => void }) {
  const versions = Array.from({ length: banner.versions }, (_, i) => ({
    version: banner.versions - i,
    date: new Date(Date.now() - i * 86400000 * 2).toISOString().slice(0, 10),
    author: ['Aarav', 'Diya', 'Karthik', 'Sara', 'Rohan'][i % 5],
    changes: i === 0 ? 'Current version' : ['Updated CTA text', 'Changed overlay opacity', 'Replaced background image', 'Adjusted schedule', 'Initial creation'][i % 5],
    isCurrent: i === 0,
  }));

  return (
    <Drawer
      tokens={tokens}
      open
      onClose={onClose}
      title="Version History"
      subtitle={banner.title}
      width={480}
      footer={<Button tokens={tokens} variant="ghost" onClick={onClose}>Close</Button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {versions.map((v, i) => (
          <div key={v.version} style={{
            padding: 12, borderRadius: 10, background: v.isCurrent ? tokens.status.successBg : tokens.bg.surfaceAlt,
            border: `1px solid ${v.isCurrent ? tokens.status.success + '40' : tokens.border.subtle}`,
            position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: v.isCurrent ? tokens.status.success : tokens.bg.surface,
                  color: v.isCurrent ? tokens.bg.app : tokens.text.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                }}>{v.version}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>v{v.version}.0</span>
                {v.isCurrent && <Badge tokens={tokens} tone="success" size="sm">Current</Badge>}
              </div>
              <span style={{ fontSize: 10, color: tokens.text.tertiary }}>{v.date}</span>
            </div>
            <div style={{ fontSize: 11, color: tokens.text.secondary, marginLeft: 34, marginBottom: 6 }}>{v.changes}</div>
            <div style={{ fontSize: 10, color: tokens.text.tertiary, marginLeft: 34 }}>by {v.author}</div>
            {i < versions.length - 1 && <div style={{ position: 'absolute', left: 24, top: 38, bottom: -8, width: 2, background: tokens.border.subtle }} />}
          </div>
        ))}
      </div>
    </Drawer>
  );
}

/* ----------------------------- Banner Form ----------------------------- */

function BannerForm({ tokens, banner, slot }: {
  tokens: AdminThemeTokens; banner: Banner | null; slot: BannerSlot;
}) {
  const [overlay, setOverlay] = useState(banner?.overlay ?? 30);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Input tokens={tokens} label="Banner Title" defaultValue={banner?.title ?? ''} placeholder="e.g. Summer Drop 2026" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Select tokens={tokens} label="Slot" defaultValue={banner?.slot ?? slot}
          options={[{ value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Mobile' }, { value: 'tablet', label: 'Tablet' }]}
        />
        <Select tokens={tokens} label="Type" defaultValue={banner?.type ?? 'Homepage Hero'}
          options={[
            { value: 'Homepage Hero', label: 'Homepage Hero' },
            { value: 'Offer Banner', label: 'Offer Banner' },
            { value: 'Category Banner', label: 'Category Banner' },
            { value: 'Popup', label: 'Popup' },
            { value: 'Slider', label: 'Slider' },
          ]}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="Start Date" type="date" defaultValue={banner?.startDate ?? ''} />
        <Input tokens={tokens} label="End Date" type="date" defaultValue={banner?.endDate ?? ''} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input tokens={tokens} label="CTA Text" defaultValue={banner?.ctaText ?? ''} placeholder="Shop Now" />
        <Input tokens={tokens} label="CTA Link" defaultValue={banner?.ctaLink ?? ''} placeholder="/category/jordan" />
      </div>
      <Select tokens={tokens} label="Linked Campaign" defaultValue={banner?.campaign ?? ''}
        options={[
          { value: '', label: '— None —' },
          { value: 'Summer Drop 2026', label: 'Summer Drop 2026' },
          { value: 'Mid-Week Madness', label: 'Mid-Week Madness' },
          { value: 'Independence Day Sale', label: 'Independence Day Sale' },
          { value: 'Diwali Festival', label: 'Diwali Festival' },
        ]}
      />
      <div>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt, marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>Background Overlay ({overlay}%)</span>
        </label>
        <input type="range" min={0} max={100} value={overlay} onChange={e => setOverlay(Number(e.target.value))} style={{ width: '100%', accentColor: tokens.text.primary }} />
      </div>
      <div style={{
        border: `2px dashed ${tokens.border.strong}`,
        borderRadius: 10, padding: 24, textAlign: 'center',
        background: tokens.bg.surfaceAlt,
      }}>
        <div style={{ fontSize: 22, marginBottom: 6 }}>📤</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, marginBottom: 2 }}>Upload Background Image</div>
        <div style={{ fontSize: 10, color: tokens.text.tertiary }}>Recommended: {slot === 'mobile' ? '800×1000' : slot === 'tablet' ? '1200×900' : '1920×720'} · WebP, JPG</div>
      </div>
    </div>
  );
}

/* ----------------------------- KPI Strip ----------------------------- */

function KPIStrip({ tokens, label, value, sub, tone }: {
  tokens: AdminThemeTokens; label: string; value: string; sub: string;
  tone: 'success' | 'info' | 'warning' | 'critical';
}) {
  const accent = tone === 'success' ? tokens.status.success : tone === 'info' ? tokens.status.info : tone === 'warning' ? tokens.status.warning : tokens.status.error;
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
