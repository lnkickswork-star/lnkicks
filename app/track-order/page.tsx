/**
 * LNKICKS Enterprise Admin — Track Order
 */

'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, StatusPill, Panel, Input, EmptyState, useToast,
} from '@/components/admin/ui';

interface TrackedOrder {
  id: string;
  customer: string;
  courier: string;
  tracking: string;
  status: string;
  eta: string;
  timeline: { time: string; location: string; event: string }[];
}

const MOCK: Record<string, TrackedOrder> = {
  'LNK-2841': {
    id: 'LNK-2841',
    customer: 'Aarav Sharma',
    courier: 'BlueDart',
    tracking: 'BD1234567890',
    status: 'Out for Delivery',
    eta: 'Today, by 7:00 PM',
    timeline: [
      { time: '10:30 AM', location: 'Bengaluru Hub', event: 'Out for delivery' },
      { time: '08:15 AM', location: 'Bengaluru Hub', event: 'Arrived at delivery hub' },
      { time: 'Yesterday 22:40', location: 'Mumbai Sort Facility', event: 'In transit' },
      { time: 'Yesterday 14:20', location: 'Mumbai', event: 'Picked up by courier' },
      { time: '2 days ago', location: 'LNKICKS Warehouse', event: 'Order packed' },
      { time: '2 days ago', location: 'LNKICKS Warehouse', event: 'Order confirmed' },
    ],
  },
};

export default function TrackOrderPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSearch() {
    if (!query.trim()) {
      pushToast({ tone: 'error', title: 'Enter search query', message: 'Order ID, tracking number, phone, or email.' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const q = query.trim().toUpperCase();
      const found = MOCK[q] ?? (q.startsWith('LNK') ? MOCK['LNK-2841'] : null);
      setResult(found ?? null);
      setLoading(false);
      if (!found) pushToast({ tone: 'error', title: 'No order found', message: `No match for "${query}"` });
    }, 600);
  }

  return (
    <AdminLayout
      title="Track Order"
      subtitle="Order tracking center"
      requirePermission="order.view"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Sales' }, { label: 'Track Order' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Tracking Center"
        subtitle="Search by Order ID, tracking number, phone, email, or customer name."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Sales' }, { label: 'Track Order' }]}
      />

      <Panel tokens={tokens} title="Search" subtitle="Enter any identifier">
        <div style={{ display: 'flex', gap: 8 }}>
          <Input tokens={tokens} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Order ID (LNK-2841), tracking number, phone, email…"
            style={{ flex: 1 }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <Button tokens={tokens} variant="primary" size="md" loading={loading} onClick={handleSearch}>Track</Button>
        </div>
      </Panel>

      {result && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel tokens={tokens} title={`Order ${result.id}`} subtitle={result.customer}
            action={<StatusPill tokens={tokens} status={result.status} />}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Courier</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text.primary }}>{result.courier}</div>
                <div style={{ fontSize: 11, color: tokens.text.tertiary, fontFamily: 'ui-monospace, monospace' }}>{result.tracking}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Estimated Delivery</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: tokens.status.success }}>{result.eta}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: tokens.text.tertiary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Status</div>
                <StatusPill tokens={tokens} status={result.status} />
              </div>
            </div>
          </Panel>

          <Panel tokens={tokens} title="Tracking Timeline" subtitle="Live location updates">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {result.timeline.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: i === 0 ? tokens.status.success : tokens.bg.surfaceAlt,
                      color: i === 0 ? '#fff' : tokens.text.tertiary,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, flexShrink: 0,
                    }}>{i === 0 ? '✓' : ''}</div>
                    {i < result.timeline.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 24, background: tokens.border.subtle, margin: '2px 0' }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{t.event}</div>
                    <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 2 }}>{t.location}</div>
                    <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 2 }}>{t.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {!result && !loading && query && (
        <div style={{ marginTop: 16 }}>
          <Panel tokens={tokens}>
            <EmptyState
              tokens={tokens}
              icon={<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={tokens.text.tertiary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.5-4.5" /></svg>}
              title="No order found"
              description="Try a different Order ID, tracking number, phone, or email."
            />
          </Panel>
        </div>
      )}
    </AdminLayout>
  );
}
