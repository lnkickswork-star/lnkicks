/**
 * LNKICKS Enterprise Admin — Reviews Moderation
 */

'use client';

import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Button, Badge, StatusPill, SearchInput, Tabs, useToast,
  Avatar, Modal, Textarea,
} from '@/components/admin/ui';

interface Review {
  id: string;
  productName: string;
  brand: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  verifiedPurchase: boolean;
  hasImages: boolean;
  spamScore: number;
  createdAt: number;
}

const SEED: Review[] = Array.from({ length: 24 }, (_, i) => ({
  id: `rev-${2000 + i}`,
  productName: ['Air Jordan 1 Low', 'Nike Dunk Low Panda', 'Adidas Samba OG', 'Yeezy 350 V2 Zebra'][i % 4],
  brand: ['NIKE', 'NIKE', 'ADIDAS', 'YEEZY'][i % 4],
  customerName: ['Aarav S.', 'Diya V.', 'Karthik I.', 'Sara K.', 'Rohan G.', 'Ananya R.'][i % 6],
  rating: [5, 4, 5, 3, 5, 1, 4, 2][i % 8],
  title: ['Fire colorway!', 'Comfortable daily wear', 'Best sneaker ever', 'Sizing issue', 'Authentic and premium', 'Disappointed'][i % 6],
  body: 'Really impressed with the quality and packaging. LNKICKS delivered on time and the sneakers feel premium. Highly recommended!',
  status: (['Pending', 'Approved', 'Rejected'] as const)[i % 3],
  verifiedPurchase: i % 4 !== 0,
  hasImages: i % 3 === 0,
  spamScore: i % 9 === 0 ? 87 : (i * 7) % 100,
  createdAt: Date.now() - i * 3600_000 * 5,
}));

export default function ReviewsPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(SEED);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [replyOpen, setReplyOpen] = useState<Review | null>(null);

  const filtered = useMemo(() => reviews.filter(r => {
    if (search && !r.productName.toLowerCase().includes(search.toLowerCase()) && !r.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab !== 'all' && r.status.toLowerCase() !== tab) return false;
    return true;
  }), [reviews, search, tab]);

  const counts = useMemo(() => ({
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'Pending').length,
    approved: reviews.filter(r => r.status === 'Approved').length,
    rejected: reviews.filter(r => r.status === 'Rejected').length,
  }), [reviews]);

  function updateStatus(id: string, status: Review['status']) {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    pushToast({ tone: 'success', title: `Review ${status.toLowerCase()}` });
  }

  function bulkApprove(ids: string[]) {
    setReviews(prev => prev.map(r => ids.includes(r.id) ? { ...r, status: 'Approved' } : r));
    pushToast({ tone: 'success', title: `${ids.length} reviews approved` });
  }

  function bulkReject(ids: string[]) {
    setReviews(prev => prev.map(r => ids.includes(r.id) ? { ...r, status: 'Rejected' } : r));
    pushToast({ tone: 'info', title: `${ids.length} reviews rejected` });
  }

  const columns: Column<Review>[] = [
    {
      key: 'product', header: 'Product', sortable: true, sortValue: r => r.productName,
      render: r => (
        <div>
          <div style={{ fontWeight: 600, color: tokens.text.primary, fontSize: 12 }}>{r.productName}</div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1 }}>{r.brand}</div>
        </div>
      ),
    },
    {
      key: 'customer', header: 'Customer',
      render: r => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar tokens={tokens} name={r.customerName} size={26} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: tokens.text.primary }}>{r.customerName}</div>
            <div style={{ fontSize: 10, color: tokens.text.tertiary }}>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'rating', header: 'Rating', align: 'center', sortable: true, sortValue: r => r.rating,
      render: r => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
          <span style={{ color: '#FBBF24' }}>★</span>
          <span style={{ fontWeight: 700, color: tokens.text.primary, fontSize: 12 }}>{r.rating}</span>
        </div>
      ),
    },
    {
      key: 'review', header: 'Review',
      render: r => (
        <div style={{ maxWidth: 280 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
          <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.body}</div>
        </div>
      ),
    },
    {
      key: 'flags', header: 'Flags', align: 'center',
      render: r => (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          {r.verifiedPurchase && <Badge tokens={tokens} tone="success" size="sm">Verified</Badge>}
          {r.hasImages && <Badge tokens={tokens} tone="info" size="sm">📷</Badge>}
          {r.spamScore > 70 && <Badge tokens={tokens} tone="critical" size="sm">Spam {r.spamScore}%</Badge>}
        </div>
      ),
    },
    {
      key: 'status', header: 'Status', align: 'center', sortable: true, sortValue: r => r.status,
      render: r => <StatusPill tokens={tokens} status={r.status} />,
    },
    {
      key: 'actions', header: '', align: 'right', sortable: false,
      render: r => (
        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 4 }}>
          {r.status !== 'Approved' && <Button tokens={tokens} variant="ghost" size="sm" onClick={() => updateStatus(r.id, 'Approved')}>Approve</Button>}
          {r.status !== 'Rejected' && <Button tokens={tokens} variant="ghost" size="sm" onClick={() => updateStatus(r.id, 'Rejected')}>Reject</Button>}
          <Button tokens={tokens} variant="ghost" size="sm" onClick={() => setReplyOpen(r)}>Reply</Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Reviews"
      subtitle="Customer feedback moderation"
      requirePermission="review.moderate"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }, { label: 'Reviews' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Review Moderation"
        subtitle="Approve, reject, or reply to customer reviews. Detect spam and verify authenticity."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Marketing' }, { label: 'Reviews' }]}
        meta={<Badge tokens={tokens} tone="warning">{counts.pending} pending</Badge>}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'all', label: 'All', badge: counts.all },
          { key: 'pending', label: 'Pending', badge: counts.pending },
          { key: 'approved', label: 'Approved', badge: counts.approved },
          { key: 'rejected', label: 'Rejected', badge: counts.rejected },
        ]} active={tab} onChange={setTab} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 240 }}>
          <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search product or customer…" />
        </div>
      </div>

      <EnterpriseDataTable<Review>
        tokens={tokens} columns={columns} rows={filtered} getRowId={r => r.id}
        pageSize={10} selectable
        bulkActions={(ids) => (
          <>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={() => bulkApprove(ids)}>Approve All</Button>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={() => bulkReject(ids)}>Reject All</Button>
          </>
        )}
      />

      {/* Reply Modal */}
      {replyOpen && (
        <Modal
          tokens={tokens}
          open
          onClose={() => setReplyOpen(null)}
          title="Reply to Review"
          subtitle={`${replyOpen.customerName} on ${replyOpen.productName}`}
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setReplyOpen(null)}>Cancel</Button>
              <Button tokens={tokens} variant="primary" onClick={() => {
                pushToast({ tone: 'success', title: 'Reply posted', message: 'Customer will be notified.' });
                setReplyOpen(null);
              }}>Post Reply</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: tokens.bg.surfaceAlt, borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ color: '#FBBF24' }}>★</span>
                <span style={{ fontWeight: 700, color: tokens.text.primary, fontSize: 12 }}>{replyOpen.rating}</span>
                <span style={{ fontSize: 11, color: tokens.text.secondary }}>· {replyOpen.title}</span>
              </div>
              <div style={{ fontSize: 12, color: tokens.text.secondary, lineHeight: 1.5 }}>{replyOpen.body}</div>
            </div>
            <Textarea tokens={tokens} label="Your Reply" placeholder="Thank you for your feedback! We're glad you loved the sneakers…" />
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
