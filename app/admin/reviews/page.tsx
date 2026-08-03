/**
 * LNKICKS Enterprise Admin — Review Moderation Center
 * ------------------------------------------------------------
 * Enterprise review management with:
 *  - Moderation queue (Pending / Approved / Rejected / Spam)
 *  - Image reviews viewer
 *  - Rating analytics (distribution, trend, by product/brand)
 *  - AI sentiment summary
 *  - Verified purchase badge
 *  - Reply management
 *  - Spam detection panel
 *
 * Reuses existing Review data shape; enriches with sentiment + reply state.
 */

'use client';

import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, SearchInput, Tabs, useToast,
  Avatar, Modal, Textarea, Panel, EmptyState, IconButton,
} from '@/components/admin/ui';
import type { AdminThemeTokens } from '@/lib/admin/types';

/* ----------------------------- Types ----------------------------- */

type ReviewStatus = 'Pending' | 'Approved' | 'Rejected' | 'Spam';

interface Review {
  id: string;
  productName: string;
  brand: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  verifiedPurchase: boolean;
  hasImages: boolean;
  imageUrls?: string[];
  spamScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  hasReply: boolean;
  replyText?: string;
  helpful: number;
  createdAt: number;
  orderId?: string;
}

/* ----------------------------- Data ----------------------------- */

const PRODUCT_NAMES = [
  { name: 'Air Jordan 1 Low — Powder Blue', brand: 'JORDAN' },
  { name: 'Nike Dunk Low — Panda', brand: 'NIKE' },
  { name: 'Adidas Samba OG — Cloud White', brand: 'ADIDAS' },
  { name: 'Yeezy Boost 350 V2 — Zebra', brand: 'YEEZY' },
  { name: 'Nike Air Force 1 — Triple White', brand: 'NIKE' },
  { name: 'New Balance 530 — Silver Navy', brand: 'NB' },
];
const CUSTOMERS = ['Aarav S.', 'Diya V.', 'Karthik I.', 'Sara K.', 'Rohan G.', 'Ananya R.', 'Vikram M.', 'Priya N.'];
const TITLES = ['Fire colorway!', 'Comfortable daily wear', 'Best sneaker ever', 'Sizing issue', 'Authentic and premium', 'Disappointed', 'Worth every rupee', 'Quick delivery'];
const BODIES = [
  'Really impressed with the quality and packaging. LNKICKS delivered on time and the sneakers feel premium. Highly recommended!',
  'The colorway is absolutely stunning in person. Fits true to size and the build quality is exceptional. Will buy again.',
  'Comfortable for daily wear. The sole has good cushioning and the leather feels premium. Worth the price.',
  'Sizing runs slightly small. Had to exchange for a half size up. Otherwise, great sneaker.',
  'Authentic product with original packaging. Verified through brand app. LNKICKS is now my go-to sneaker store.',
  'Disappointed with the delivery time. Took 6 days instead of promised 2. Product quality is okay though.',
  'Worth every rupee. The attention to detail is amazing. Customer support was helpful when I had questions.',
  'Quick delivery and authentic product. The sneaker looks even better in person. Five stars!',
];
const SENTIMENTS: Array<'positive' | 'neutral' | 'negative'> = ['positive', 'positive', 'positive', 'neutral', 'positive', 'negative', 'positive', 'positive'];

function generateReviews(): Review[] {
  return Array.from({ length: 32 }, (_, i) => {
    const p = PRODUCT_NAMES[i % PRODUCT_NAMES.length];
    const r = i % 8;
    const status = i < 8 ? 'Pending' : i < 12 ? 'Spam' : i % 5 === 0 ? 'Rejected' : 'Approved';
    return {
      id: `rev-${2000 + i}`,
      productName: p.name,
      brand: p.brand,
      customerName: CUSTOMERS[i % CUSTOMERS.length],
      rating: [5, 4, 5, 3, 5, 1, 4, 2][r],
      title: TITLES[r],
      body: BODIES[r],
      status: status as ReviewStatus,
      verifiedPurchase: i % 4 !== 0,
      hasImages: i % 3 === 0,
      imageUrls: i % 3 === 0 ? ['/jordan_powder_blue_nobg.png', '/samba_og_nobg.png'].slice(0, (i % 2) + 1) : undefined,
      spamScore: i % 9 === 0 ? 87 : (i * 7) % 100,
      sentiment: SENTIMENTS[r],
      hasReply: i % 5 === 0 && status === 'Approved',
      replyText: i % 5 === 0 ? 'Thank you for your feedback! We are glad you loved your sneakers. See you soon at LNKICKS.' : undefined,
      helpful: Math.floor((i * 3) % 24),
      createdAt: Date.now() - i * 3600_000 * 5,
      orderId: `LNK-${2800 - i}`,
    };
  });
}

/* ----------------------------- Helpers ----------------------------- */

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  return `${Math.floor(diff / 86400000)} days ago`;
}

/* ----------------------------- Page ----------------------------- */

export default function ReviewsPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(generateReviews);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'spam'>('all');
  const [replyOpen, setReplyOpen] = useState<Review | null>(null);
  const [detailReview, setDetailReview] = useState<Review | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => reviews.filter(r => {
    if (search) {
      const q = search.toLowerCase();
      if (!r.productName.toLowerCase().includes(q) && !r.customerName.toLowerCase().includes(q) && !r.title.toLowerCase().includes(q)) return false;
    }
    if (tab !== 'all' && r.status.toLowerCase() !== tab) return false;
    return true;
  }), [reviews, search, tab]);

  const counts = useMemo(() => ({
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'Pending').length,
    approved: reviews.filter(r => r.status === 'Approved').length,
    rejected: reviews.filter(r => r.status === 'Rejected').length,
    spam: reviews.filter(r => r.status === 'Spam').length,
  }), [reviews]);

  const analytics = useMemo(() => {
    const approved = reviews.filter(r => r.status === 'Approved');
    const total = approved.length;
    const distribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: approved.filter(r => r.rating === rating).length,
      pct: total > 0 ? (approved.filter(r => r.rating === rating).length / total) * 100 : 0,
    }));
    const avgRating = total > 0 ? approved.reduce((s, r) => s + r.rating, 0) / total : 0;
    const verifiedCount = approved.filter(r => r.verifiedPurchase).length;
    const withImages = approved.filter(r => r.hasImages).length;
    const withReplies = approved.filter(r => r.hasReply).length;
    const sentiment = {
      positive: approved.filter(r => r.sentiment === 'positive').length,
      neutral: approved.filter(r => r.sentiment === 'neutral').length,
      negative: approved.filter(r => r.sentiment === 'negative').length,
    };
    return { total, distribution, avgRating, verifiedCount, withImages, withReplies, sentiment };
  }, [reviews]);

  function updateStatus(id: string, status: ReviewStatus) {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    pushToast({ tone: 'success', title: `Review ${status.toLowerCase()}` });
  }

  function bulkAction(ids: string[], status: ReviewStatus) {
    setReviews(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r));
    pushToast({ tone: 'success', title: `${ids.length} reviews ${status.toLowerCase()}` });
    setSelected(new Set());
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <AdminLayout
      title="Reviews"
      subtitle="Customer feedback moderation"
      requirePermission="review.moderate"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Reviews' }]}
    >
      <style jsx global>{`
        @keyframes rv-card-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .rv-stagger > * { animation: rv-card-in 420ms cubic-bezier(0.16,1,0.3,1) both; }
        .rv-stagger > *:nth-child(1) { animation-delay: 30ms; }
        .rv-stagger > *:nth-child(2) { animation-delay: 60ms; }
        .rv-stagger > *:nth-child(3) { animation-delay: 90ms; }
        .rv-stagger > *:nth-child(4) { animation-delay: 120ms; }
        .rv-stagger > *:nth-child(5) { animation-delay: 150ms; }
      `}</style>

      <PageHeader
        tokens={tokens}
        title="Review Moderation Center"
        subtitle="Approve, reject, or reply to customer reviews. AI sentiment analysis, spam detection, image reviews, and rating analytics in one workspace."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing', href: '/admin/marketing' }, { label: 'Reviews' }]}
        meta={
          <span style={{ display: 'inline-flex', gap: 6 }}>
            <Badge tokens={tokens} tone="warning">{counts.pending} pending</Badge>
            {counts.spam > 0 && <Badge tokens={tokens} tone="critical">{counts.spam} spam</Badge>}
          </span>
        }
      />

      {/* Rating Analytics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: 16, marginBottom: 20 }}>
        {/* Avg rating + sentiment */}
        <Panel tokens={tokens} title="Overall Rating" subtitle="From approved reviews">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 42, fontWeight: 800, color: tokens.text.primary, letterSpacing: '-0.02em', lineHeight: 1 }}>{analytics.avgRating.toFixed(1)}</div>
              <div style={{ color: '#FBBF24', fontSize: 18, marginTop: 4 }}>{'★'.repeat(Math.round(analytics.avgRating))}{'☆'.repeat(5 - Math.round(analytics.avgRating))}</div>
              <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 4 }}>{analytics.total} reviews</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>AI Sentiment Summary</div>
              <SentimentBar tokens={tokens} label="Positive" count={analytics.sentiment.positive} total={analytics.total} color={tokens.status.success} icon="😊" />
              <SentimentBar tokens={tokens} label="Neutral" count={analytics.sentiment.neutral} total={analytics.total} color={tokens.status.info} icon="😐" />
              <SentimentBar tokens={tokens} label="Negative" count={analytics.sentiment.negative} total={analytics.total} color={tokens.status.error} icon="😟" />
              <div style={{ marginTop: 10, padding: 8, borderRadius: 6, background: tokens.status.infoBg, fontSize: 11, color: tokens.text.secondary, lineHeight: 1.4 }}>
                <strong style={{ color: tokens.status.info }}>AI Summary:</strong> Customers praise the authentic product quality and quick delivery. Some complaints about sizing and shipping delays on specific SKUs.
              </div>
            </div>
          </div>
        </Panel>

        {/* Rating Distribution */}
        <Panel tokens={tokens} title="Rating Distribution" subtitle="Breakdown by star rating">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {analytics.distribution.map(d => (
                <div key={d.rating} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.secondary, minWidth: 16 }}>{d.rating}★</span>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: tokens.bg.surfaceAlt, overflow: 'hidden' }}>
                    <div style={{ width: `${d.pct}%`, height: '100%', background: d.rating >= 4 ? tokens.status.success : d.rating === 3 ? tokens.status.warning : tokens.status.error, borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: tokens.text.primary, minWidth: 24, textAlign: 'right' }}>{d.count}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <MiniStat tokens={tokens} label="Verified" value={String(analytics.verifiedCount)} icon="✓" color={tokens.status.success} />
              <MiniStat tokens={tokens} label="With Photos" value={String(analytics.withImages)} icon="📷" color={tokens.status.info} />
              <MiniStat tokens={tokens} label="Replied" value={String(analytics.withReplies)} icon="💬" color={tokens.status.warning} />
              <MiniStat tokens={tokens} label="Total" value={String(analytics.total)} icon="📊" color={tokens.text.secondary} />
            </div>
          </div>
        </Panel>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'all', label: 'All', badge: counts.all },
          { key: 'pending', label: 'Pending', badge: counts.pending },
          { key: 'approved', label: 'Approved', badge: counts.approved },
          { key: 'rejected', label: 'Rejected', badge: counts.rejected },
          { key: 'spam', label: 'Spam', badge: counts.spam },
        ]} active={tab} onChange={(k) => setTab(k as typeof tab)} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 260 }}>
          <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search product, customer, title…" />
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div style={{
          background: tokens.text.primary, color: tokens.bg.app,
          padding: '8px 14px', borderRadius: 10, marginBottom: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          animation: 'rv-card-in 200ms ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}>
            <span style={{ background: tokens.bg.app, color: tokens.text.primary, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>{selected.size}</span>
            selected
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={() => bulkAction(Array.from(selected), 'Approved')}>Approve All</Button>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={() => bulkAction(Array.from(selected), 'Rejected')}>Reject All</Button>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={() => bulkAction(Array.from(selected), 'Spam')}>Mark Spam</Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {filtered.length === 0 ? (
        <Panel tokens={tokens}>
          <EmptyState tokens={tokens}
            icon={<svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={1.5}><path d="M12 3l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" /></svg>}
            title="No reviews found"
            description="Try adjusting filters or wait for new customer reviews to come in."
          />
        </Panel>
      ) : (
        <div className="rv-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(r => (
            <ReviewCard
              key={r.id}
              tokens={tokens}
              review={r}
              isSelected={selected.has(r.id)}
              onToggleSelect={() => toggleSelect(r.id)}
              onApprove={() => updateStatus(r.id, 'Approved')}
              onReject={() => updateStatus(r.id, 'Rejected')}
              onMarkSpam={() => updateStatus(r.id, 'Spam')}
              onReply={() => setReplyOpen(r)}
              onViewDetail={() => setDetailReview(r)}
            />
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyOpen && (
        <Modal
          tokens={tokens}
          open
          onClose={() => setReplyOpen(null)}
          title="Reply to Review"
          subtitle={`${replyOpen.customerName} on ${replyOpen.productName}`}
          size="lg"
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setReplyOpen(null)}>Cancel</Button>
              <Button tokens={tokens} variant="primary" onClick={() => {
                setReviews(prev => prev.map(r => r.id === replyOpen.id ? { ...r, hasReply: true, replyText: 'Thank you for your feedback! We are glad you loved your sneakers.' } : r));
                pushToast({ tone: 'success', title: 'Reply posted', message: 'Customer will be notified.' });
                setReplyOpen(null);
              }}>Post Reply</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: tokens.bg.surfaceAlt, borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ color: '#FBBF24', fontSize: 14 }}>{'★'.repeat(replyOpen.rating)}{'☆'.repeat(5 - replyOpen.rating)}</span>
                <span style={{ fontWeight: 700, color: tokens.text.primary, fontSize: 12 }}>{replyOpen.rating}.0</span>
                <span style={{ fontSize: 11, color: tokens.text.secondary }}>· {replyOpen.title}</span>
              </div>
              <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.5 }}>{replyOpen.body}</div>
            </div>
            <Textarea tokens={tokens} label="Your Reply" placeholder="Thank you for your feedback! We're glad you loved the sneakers…" defaultValue={replyOpen.replyText} />
          </div>
        </Modal>
      )}

      {/* Detail Modal */}
      {detailReview && (
        <Modal
          tokens={tokens}
          open
          onClose={() => setDetailReview(null)}
          title="Review Detail"
          subtitle={detailReview.id}
          size="lg"
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setDetailReview(null)}>Close</Button>
              <Button tokens={tokens} variant="primary" onClick={() => { setReplyOpen(detailReview); setDetailReview(null); }}>Reply</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Avatar tokens={tokens} name={detailReview.customerName} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{detailReview.customerName}</div>
                <div style={{ fontSize: 11, color: tokens.text.tertiary }}>{timeAgo(detailReview.createdAt)} · Order {detailReview.orderId}</div>
              </div>
              {detailReview.verifiedPurchase && <Badge tokens={tokens} tone="success" size="sm">✓ Verified Purchase</Badge>}
            </div>
            <div style={{ background: tokens.bg.surfaceAlt, borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ color: '#FBBF24', fontSize: 16 }}>{'★'.repeat(detailReview.rating)}{'☆'.repeat(5 - detailReview.rating)}</span>
                <span style={{ fontWeight: 700, color: tokens.text.primary, fontSize: 13 }}>{detailReview.title}</span>
              </div>
              <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.6 }}>{detailReview.body}</div>
            </div>
            {detailReview.imageUrls && detailReview.imageUrls.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Customer Photos</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {detailReview.imageUrls.map((url, i) => (
                    <div key={i} style={{ width: 100, height: 100, borderRadius: 8, background: `url(${url}) center/cover`, border: `1px solid ${tokens.border.subtle}` }} />
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <DetailStat tokens={tokens} label="Sentiment" value={detailReview.sentiment} tone={detailReview.sentiment === 'positive' ? 'success' : detailReview.sentiment === 'negative' ? 'critical' : 'info'} />
              <DetailStat tokens={tokens} label="Spam Score" value={`${detailReview.spamScore}%`} tone={detailReview.spamScore > 70 ? 'critical' : 'neutral'} />
              <DetailStat tokens={tokens} label="Helpful" value={String(detailReview.helpful)} tone="neutral" />
            </div>
            {detailReview.hasReply && detailReview.replyText && (
              <div style={{ background: tokens.status.infoBg, borderRadius: 10, padding: 12, border: `1px solid ${tokens.status.info}30` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: tokens.status.info, marginBottom: 6 }}>💬 LNKICKS Reply</div>
                <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.5 }}>{detailReview.replyText}</div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

/* ----------------------------- Review Card ----------------------------- */

function ReviewCard({ tokens, review, isSelected, onToggleSelect, onApprove, onReject, onMarkSpam, onReply, onViewDetail }: {
  tokens: AdminThemeTokens; review: Review; isSelected: boolean;
  onToggleSelect: () => void; onApprove: () => void; onReject: () => void; onMarkSpam: () => void; onReply: () => void; onViewDetail: () => void;
}) {
  const sentColor = review.sentiment === 'positive' ? tokens.status.success : review.sentiment === 'negative' ? tokens.status.error : tokens.status.info;
  const sentIcon = review.sentiment === 'positive' ? '😊' : review.sentiment === 'negative' ? '😟' : '😐';
  const spamHigh = review.spamScore > 70;

  return (
    <div style={{
      background: tokens.bg.surface, border: `1px solid ${isSelected ? tokens.status.info : tokens.border.subtle}`,
      borderRadius: 12, padding: 14, boxShadow: tokens.shadow.sm,
      transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
      borderLeft: `3px solid ${review.status === 'Pending' ? tokens.status.warning : review.status === 'Approved' ? tokens.status.success : review.status === 'Rejected' ? tokens.text.tertiary : tokens.status.error}`,
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = tokens.shadow.md; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = tokens.shadow.sm; }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <input type="checkbox" checked={isSelected} onChange={onToggleSelect} style={{ marginTop: 4, accentColor: tokens.status.info }} />
        <Avatar tokens={tokens} name={review.customerName} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{review.customerName}</span>
            {review.verifiedPurchase && <Badge tokens={tokens} tone="success" size="sm">✓ Verified</Badge>}
            <span style={{ fontSize: 11, color: tokens.text.tertiary }}>· {timeAgo(review.createdAt)}</span>
          </div>
          <div style={{ fontSize: 11, color: tokens.text.secondary, marginBottom: 4 }}>
            on <span style={{ fontWeight: 600, color: tokens.text.primary }}>{review.productName}</span> · {review.brand} · Order {review.orderId}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ color: '#FBBF24', fontSize: 13 }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: tokens.text.primary }}>{review.rating}.0</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <StatusPill tokens={tokens} status={review.status} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 700, color: sentColor }}>
            {sentIcon} {review.sentiment}
          </span>
        </div>
      </div>

      {/* Review body */}
      <div style={{ marginTop: 8, marginLeft: 46 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary, marginBottom: 4 }}>{review.title}</div>
        <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.5 }}>{review.body}</div>

        {/* Images */}
        {review.imageUrls && review.imageUrls.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {review.imageUrls.map((url, i) => (
              <div key={i} style={{ width: 56, height: 56, borderRadius: 6, background: `url(${url}) center/cover`, border: `1px solid ${tokens.border.subtle}`, cursor: 'pointer' }} onClick={onViewDetail} />
            ))}
          </div>
        )}

        {/* Footer: badges + actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {spamHigh && <Badge tokens={tokens} tone="critical" size="sm">⚠ Spam {review.spamScore}%</Badge>}
            {review.hasImages && <Badge tokens={tokens} tone="info" size="sm">📷 {review.imageUrls?.length} photos</Badge>}
            {review.hasReply && <Badge tokens={tokens} tone="success" size="sm">💬 Replied</Badge>}
            <Badge tokens={tokens} tone="neutral" size="sm">👍 {review.helpful} helpful</Badge>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={onViewDetail}>View</Button>
            {review.status !== 'Approved' && <Button tokens={tokens} variant="ghost" size="sm" onClick={onApprove}>Approve</Button>}
            {review.status !== 'Rejected' && <Button tokens={tokens} variant="ghost" size="sm" onClick={onReject}>Reject</Button>}
            {review.status !== 'Spam' && <IconButton tokens={tokens} size={26} icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={tokens.status.warning} strokeWidth={2}><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>} label="Mark spam" onClick={onMarkSpam} />}
            <Button tokens={tokens} variant="outline" size="sm" onClick={onReply}>Reply</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Sub-components ----------------------------- */

function SentimentBar({ tokens, label, count, total, color, icon }: {
  tokens: AdminThemeTokens; label: string; count: number; total: number; color: string; icon: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontSize: 11, color: tokens.text.secondary }}>{icon} {label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: tokens.text.primary }}>{count} ({pct.toFixed(0)}%)</span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: tokens.bg.surfaceAlt, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function MiniStat({ tokens, label, value, icon, color }: {
  tokens: AdminThemeTokens; label: string; value: string; icon: string; color: string;
}) {
  return (
    <div style={{ padding: 10, borderRadius: 8, background: tokens.bg.surfaceAlt, border: `1px solid ${tokens.border.subtle}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: 12 }}>{icon}</span>
        <span style={{ fontSize: 9, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>{label}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function DetailStat({ tokens, label, value, tone }: {
  tokens: AdminThemeTokens; label: string; value: string; tone: 'success' | 'info' | 'critical' | 'neutral';
}) {
  const color = tone === 'success' ? tokens.status.success : tone === 'info' ? tokens.status.info : tone === 'critical' ? tokens.status.error : tokens.text.primary;
  return (
    <div style={{ padding: 10, borderRadius: 8, background: tokens.bg.surfaceAlt, textAlign: 'center' }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color, textTransform: 'capitalize' }}>{value}</div>
    </div>
  );
}
