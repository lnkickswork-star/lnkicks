/**
 * LNKICKS Enterprise Admin — Flash Sale Settings
 */

'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, StatusPill, Panel, Input, Select, Toggle, useToast, Tabs,
} from '@/components/admin/ui';

interface FlashSale {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  discount: number;
  products: number;
  status: 'Active' | 'Scheduled' | 'Ended';
  banner: boolean;
}

const SEED: FlashSale[] = [
  { id: 'fs1', name: 'Independence Day Sale', startDate: '2026-08-15', endDate: '2026-08-17', discount: 30, products: 24, status: 'Scheduled', banner: true },
  { id: 'fs2', name: 'Mid-Week Madness', startDate: '2026-08-05', endDate: '2026-08-07', discount: 20, products: 18, status: 'Active', banner: true },
  { id: 'fs3', name: 'Back to School', startDate: '2026-07-15', endDate: '2026-07-31', discount: 25, products: 32, status: 'Ended', banner: false },
];

export default function FlashSalePage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [sales, setSales] = useState<FlashSale[]>(SEED);
  const [tab, setTab] = useState('all');

  const filtered = sales.filter(s => tab === 'all' || s.status.toLowerCase() === tab);

  return (
    <AdminLayout
      title="Flash Sale"
      subtitle="Time-bound promotions"
      requirePermission="product.edit"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Catalog' }, { label: 'Flash Sale' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Flash Sale Settings"
        subtitle="Create time-limited promotions with custom discounts and product selection."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Catalog' }, { label: 'Flash Sale' }]}
        meta={<Badge tokens={tokens} tone="success">{sales.filter(s => s.status === 'Active').length} active</Badge>}
        actions={<Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'success', title: 'New flash sale', message: 'Configure below' })}
          icon={<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={tokens.bg.app} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>}
        >New Flash Sale</Button>}
      />

      <Tabs tokens={tokens} tabs={[
        { key: 'all', label: 'All Sales' },
        { key: 'active', label: 'Active' },
        { key: 'scheduled', label: 'Scheduled' },
        { key: 'ended', label: 'Ended' },
      ]} active={tab} onChange={setTab} />

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(s => (
          <Panel key={s.id} tokens={tokens} padding="sm">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: tokens.text.primary }}>{s.name}</span>
                  <StatusPill tokens={tokens} status={s.status} />
                  {s.banner && <Badge tokens={tokens} tone="info" size="sm">Banner ON</Badge>}
                </div>
                <div style={{ fontSize: 11, color: tokens.text.secondary }}>
                  {new Date(s.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(s.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
                <div style={{ fontSize: 11, color: tokens.text.tertiary, marginTop: 2 }}>{s.products} products · {s.discount}% off</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Button tokens={tokens} variant="outline" size="sm">Edit</Button>
                <Button tokens={tokens} variant="ghost" size="sm" onClick={() => pushToast({ tone: 'info', title: 'Duplicating', message: s.name })}>Duplicate</Button>
                <Button tokens={tokens} variant="ghost" size="sm" onClick={() => { setSales(prev => prev.filter(x => x.id !== s.id)); pushToast({ tone: 'success', title: 'Sale deleted' }); }}>Delete</Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel tokens={tokens} title="Create New Flash Sale" subtitle="Configure a time-bound promotion">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input tokens={tokens} label="Sale Name" placeholder="e.g. Independence Day Sale" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Input tokens={tokens} label="Start Date" type="datetime-local" />
            <Input tokens={tokens} label="End Date" type="datetime-local" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Select tokens={tokens} label="Discount Type"
              options={[{ value: 'percentage', label: 'Percentage Off' }, { value: 'flat', label: 'Flat ₹ Off' }]}
            />
            <Input tokens={tokens} label="Discount Value" type="number" placeholder="30" />
          </div>
          <ToggleRow tokens={tokens} label="Show Banner on Homepage" desc="Display promotional banner during sale period" checked={true} />
          <ToggleRow tokens={tokens} label="Show Countdown Timer" desc="Display countdown on product pages" checked={true} />
          <Button tokens={tokens} variant="primary" size="md" onClick={() => pushToast({ tone: 'success', title: 'Flash sale created' })}>Create Sale</Button>
        </div>
      </Panel>
    </AdminLayout>
  );
}

function ToggleRow({ tokens, label, desc, checked }: { tokens: ReturnType<typeof useAdminTheme>['tokens']; label: string; desc: string; checked: boolean }) {
  const [enabled, setEnabled] = useState(checked);
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt,
      cursor: 'pointer',
    }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>{label}</div>
        <div style={{ fontSize: 11, color: tokens.text.secondary, marginTop: 1 }}>{desc}</div>
      </div>
      <Toggle tokens={tokens} checked={enabled} onChange={setEnabled} />
    </label>
  );
}
