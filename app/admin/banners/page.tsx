/**
 * LNKICKS Enterprise Admin — Banner Management
 * ------------------------------------------------------------
 * Premium banner management with:
 *  - Desktop / Mobile / Tablet independent banner slots
 *  - Banner types: Homepage Hero, Offer Banner, Category Banner, Popup, Slider
 *  - Schedule (start/end date), Draft/Publish, Preview
 *  - Drag-drop reorder (visual priority order)
 *  - CTA button customization
 *  - Background overlay, animation
 */

'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, Tabs, Drawer, useToast, IconButton,
  Input, Select, EmptyState,
} from '@/components/admin/ui';
import { PlusIcon } from '@/components/admin/ui';

type BannerSlot = 'desktop' | 'mobile' | 'tablet';
type BannerType = 'Homepage Hero' | 'Offer Banner' | 'Category Banner' | 'Popup' | 'Slider';

interface Banner {
  id: string;
  title: string;
  slot: BannerSlot;
  type: BannerType;
  status: 'Published' | 'Draft' | 'Scheduled' | 'Expired';
  startDate: string;
  endDate: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  overlay: number; // 0-100
  views: number;
  clicks: number;
  position: number;
}

const SEED: Banner[] = [
  { id: 'b1', title: 'Summer Drop 2026 — Air Jordan Collection', slot: 'desktop', type: 'Homepage Hero', status: 'Published', startDate: '2026-08-01', endDate: '2026-08-31', ctaText: 'Shop Now', ctaLink: '/category/jordan', backgroundImage: '/jordan_powder_blue_nobg.png', overlay: 30, views: 28400, clicks: 1820, position: 1 },
  { id: 'b2', title: 'Flat 40% Off — Adidas Samba', slot: 'desktop', type: 'Offer Banner', status: 'Published', startDate: '2026-08-02', endDate: '2026-08-10', ctaText: 'Grab Deal', ctaLink: '/category/adidas', backgroundImage: '/samba_og_nobg.png', overlay: 45, views: 18900, clicks: 2410, position: 2 },
  { id: 'b3', title: 'New Arrivals — Yeezy Boost 350', slot: 'mobile', type: 'Homepage Hero', status: 'Published', startDate: '2026-07-25', endDate: '2026-08-25', ctaText: 'Explore', ctaLink: '/category/yeezy', backgroundImage: '/yeezy_zebra_nobg.png', overlay: 50, views: 14200, clicks: 980, position: 1 },
  { id: 'b4', title: 'Festival Special — Diwali Drops', slot: 'mobile', type: 'Popup', status: 'Scheduled', startDate: '2026-10-15', endDate: '2026-11-05', ctaText: 'Preview', ctaLink: '/flash-sale', backgroundImage: '', overlay: 60, views: 0, clicks: 0, position: 2 },
  { id: 'b5', title: 'Tablet Hero — Premium Sneakers', slot: 'tablet', type: 'Homepage Hero', status: 'Draft', startDate: '2026-08-05', endDate: '2026-09-05', ctaText: 'Shop', ctaLink: '/', backgroundImage: '', overlay: 35, views: 0, clicks: 0, position: 1 },
];

export default function BannersPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [banners, setBanners] = useState<Banner[]>(SEED);
  const [slot, setSlot] = useState<BannerSlot>('desktop');
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = banners.filter(b => b.slot === slot).sort((a, b) => a.position - b.position);

  function togglePublish(id: string) {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'Published' ? 'Draft' : 'Published' } : b));
    pushToast({ tone: 'success', title: 'Status updated' });
  }

  function deleteBanner(id: string) {
    setBanners(prev => prev.filter(b => b.id !== id));
    pushToast({ tone: 'success', title: 'Banner deleted' });
  }

  function movePosition(id: string, dir: 'up' | 'down') {
    setBanners(prev => {
      const sorted = [...prev.filter(b => b.slot === slot)].sort((a, b) => a.position - b.position);
      const idx = sorted.findIndex(b => b.id === id);
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const a = sorted[idx]; const b = sorted[swapIdx];
      const tmp = a.position; a.position = b.position; b.position = tmp;
      return [...prev];
    });
  }

  return (
    <AdminLayout
      title="Banners"
      subtitle="Marketing campaigns"
      requirePermission="banner.manage"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }, { label: 'Banners' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Banner Management"
        subtitle="Manage desktop, mobile, and tablet banners independently. Schedule campaigns, customize CTAs, and track performance."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }, { label: 'Banners' }]}
        meta={<Badge tokens={tokens} tone="info">{banners.filter(b => b.status === 'Published').length} live</Badge>}
        actions={
          <Button tokens={tokens} variant="primary" size="md" onClick={() => setCreateOpen(true)}
            icon={<PlusIcon size={14} color={tokens.bg.app} />}
          >New Banner</Button>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <Tabs
          tokens={tokens}
          tabs={[
            { key: 'desktop', label: '🖥️ Desktop', badge: banners.filter(b => b.slot === 'desktop').length },
            { key: 'mobile', label: '📱 Mobile', badge: banners.filter(b => b.slot === 'mobile').length },
            { key: 'tablet', label: '💻 Tablet', badge: banners.filter(b => b.slot === 'tablet').length },
          ]}
          active={slot}
          onChange={(k) => setSlot(k as BannerSlot)}
        />
      </div>

      {/* Banner grid */}
      {filtered.length === 0 ? (
        <EmptyState
          tokens={tokens}
          icon={<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 16l5-5 4 4 3-3 6 6" /></svg>}
          title="No banners yet"
          description={`Create your first ${slot} banner to showcase campaigns, offers, and new arrivals.`}
          action={<Button tokens={tokens} variant="primary" size="md" onClick={() => setCreateOpen(true)} icon={<PlusIcon size={12} color={tokens.bg.app} />}>Create Banner</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {filtered.map((b) => (
            <div key={b.id} style={{
              background: tokens.bg.surface,
              border: `1px solid ${tokens.border.subtle}`,
              borderRadius: 14, overflow: 'hidden',
              boxShadow: tokens.shadow.sm,
              transition: 'box-shadow 180ms ease, transform 180ms ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = tokens.shadow.md; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = tokens.shadow.sm; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Preview area */}
              <div style={{
                position: 'relative',
                aspectRatio: slot === 'mobile' ? '9/12' : slot === 'tablet' ? '4/3' : '16/6',
                background: b.backgroundImage
                  ? `linear-gradient(rgba(0,0,0,${b.overlay / 100}), rgba(0,0,0,${b.overlay / 100})), url(${b.backgroundImage})`
                  : `linear-gradient(135deg, ${tokens.bg.surfaceAlt}, ${tokens.bg.hover})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: 16,
              }}>
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                  <StatusPill tokens={tokens} status={b.status} />
                </div>
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <Badge tokens={tokens} tone="neutral" size="sm">{b.type}</Badge>
                </div>
                <div style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.2 }}>{b.title}</div>
                  {b.ctaText && (
                    <div style={{
                      display: 'inline-block', padding: '4px 10px',
                      background: '#fff', color: '#000', borderRadius: 6,
                      fontSize: 10, fontWeight: 700,
                    }}>{b.ctaText}</div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: tokens.text.secondary }}>
                    {new Date(b.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(b.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <IconButton tokens={tokens} icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 15l-6-6-6 6" /></svg>} label="Move up" size={26} onClick={() => movePosition(b.id, 'up')} />
                    <IconButton tokens={tokens} icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>} label="Move down" size={26} onClick={() => movePosition(b.id, 'down')} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 11 }}>
                  <span style={{ color: tokens.text.secondary }}>👁 {b.views.toLocaleString('en-IN')}</span>
                  <span style={{ color: tokens.text.secondary }}>👆 {b.clicks.toLocaleString('en-IN')}</span>
                  <span style={{ color: tokens.text.tertiary }}>CTR {b.views ? ((b.clicks / b.views) * 100).toFixed(1) : 0}%</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button tokens={tokens} variant="outline" size="sm" onClick={() => setEditBanner(b)}>Edit</Button>
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => togglePublish(b.id)}>
                    {b.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </Button>
                  <div style={{ flex: 1 }} />
                  <Button tokens={tokens} variant="ghost" size="sm" onClick={() => deleteBanner(b.id)}
                    icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={tokens.status.error} strokeWidth={2}><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M10 11v6M14 11v6" /></svg>}
                  >Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Drawer */}
      <Drawer
        tokens={tokens}
        open={Boolean(editBanner) || createOpen}
        onClose={() => { setEditBanner(null); setCreateOpen(false); }}
        title={editBanner ? 'Edit Banner' : 'Create Banner'}
        subtitle={editBanner?.title}
        width={500}
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

function BannerForm({ tokens, banner, slot }: {
  tokens: ReturnType<typeof useAdminTheme>['tokens'];
  banner: Banner | null;
  slot: BannerSlot;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Input tokens={tokens} label="Banner Title" defaultValue={banner?.title ?? ''} placeholder="e.g. Summer Drop 2026" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Select tokens={tokens} label="Slot"
          defaultValue={banner?.slot ?? slot}
          options={[
            { value: 'desktop', label: 'Desktop' },
            { value: 'mobile', label: 'Mobile' },
            { value: 'tablet', label: 'Tablet' },
          ]}
        />
        <Select tokens={tokens} label="Type"
          defaultValue={banner?.type ?? 'Homepage Hero'}
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
      <div>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt, marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>Background Overlay ({banner?.overlay ?? 30}%)</span>
        </label>
        <input type="range" min={0} max={100} defaultValue={banner?.overlay ?? 30} style={{ width: '100%', accentColor: tokens.text.primary }} />
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
