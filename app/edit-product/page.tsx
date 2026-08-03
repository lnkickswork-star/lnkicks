/**
 * LNKICKS Enterprise Admin — Edit Product
 * Reuses Add Product flow but pre-filled. For demo, shows the same form.
 */

'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Badge, Panel, Input, Textarea, Select, Toggle, useToast,
} from '@/components/admin/ui';

export default function EditProductPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      pushToast({ tone: 'success', title: 'Product updated', message: 'Changes saved to catalog.' });
    }, 700);
  }

  return (
    <AdminLayout
      title="Edit Product"
      subtitle="Modify existing catalog entry"
      requirePermission="product.edit"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Catalog' }, { label: 'Products', href: '/products-management' }, { label: 'Edit' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Edit Product"
        subtitle="Update product information, pricing, inventory, images, and SEO."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Catalog' }, { label: 'Products', href: '/products-management' }, { label: 'Edit' }]}
        meta={<Badge tokens={tokens} tone="info" dot>Editing</Badge>}
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => pushToast({ tone: 'info', title: 'View live', message: 'Opening product page' })}>View Live</Button>
            <Button tokens={tokens} variant="primary" size="md" loading={saving} onClick={handleSave}>Save Changes</Button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 16 }} className="edit-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel tokens={tokens} title="Basic Information">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input tokens={tokens} label="Product Name" defaultValue="Air Jordan 1 Low Black Powder Blue" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Select tokens={tokens} label="Brand" defaultValue="NIKE"
                  options={[{ value: 'NIKE', label: 'Nike' }, { value: 'JORDAN', label: 'Jordan' }, { value: 'ADIDAS', label: 'Adidas' }]}
                />
                <Select tokens={tokens} label="Category" defaultValue="Sneakers"
                  options={[{ value: 'Sneakers', label: 'Sneakers' }, { value: 'Lifestyle', label: 'Lifestyle' }]}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input tokens={tokens} label="SKU" defaultValue="AJ1-PB-01" />
                <Input tokens={tokens} label="Barcode" defaultValue="0123456789012" />
              </div>
              <Textarea tokens={tokens} label="Short Description" defaultValue="Classic low-top silhouette in iconic Carolina blue and black leather." />
              <Textarea tokens={tokens} label="Long Description" defaultValue="The Air Jordan 1 Low brings the iconic look of the original AJ1 to a low-top silhouette. Featuring premium leather upper, encapsulated Air-Sole unit for lightweight cushioning, and a rubber outsole with circular tread pattern for multidirectional traction." />
            </div>
          </Panel>

          <Panel tokens={tokens} title="Pricing & Inventory">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <Input tokens={tokens} label="Selling Price (₹)" type="number" defaultValue="8899" />
                <Input tokens={tokens} label="MRP (₹)" type="number" defaultValue="18899" />
                <Input tokens={tokens} label="Stock" type="number" defaultValue="42" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input tokens={tokens} label="Sizes" defaultValue="UK 7, UK 8, UK 9, UK 10" />
                <Input tokens={tokens} label="Colors" defaultValue="Powder Blue, Black" />
              </div>
            </div>
          </Panel>

          <Panel tokens={tokens} title="SEO Metadata"
            action={<Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'info', title: 'AI generating SEO…' })}>Generate with AI</Button>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input tokens={tokens} label="SEO Title" defaultValue="Air Jordan 1 Low Powder Blue — LNKICKS" />
              <Textarea tokens={tokens} label="Meta Description" defaultValue="Buy authentic Air Jordan 1 Low Powder Blue in India at LNKICKS. Free shipping, COD available, 7-day returns." />
              <Input tokens={tokens} label="Keywords" defaultValue="air jordan 1, powder blue, sneakers india" />
              <Input tokens={tokens} label="Slug" defaultValue="air-jordan-1-low-black-powder-blue" />
            </div>
          </Panel>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel tokens={tokens} title="Status">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Select tokens={tokens} label="Product Status" defaultValue="Published"
                options={[{ value: 'Published', label: 'Published' }, { value: 'Draft', label: 'Draft' }, { value: 'Archived', label: 'Archived' }]}
              />
              <ToggleRow tokens={tokens} label="Featured" desc="Show on homepage" checked={true} />
              <ToggleRow tokens={tokens} label="New Arrival" desc="Mark as new" checked={true} />
              <ToggleRow tokens={tokens} label="Best Seller" desc="Top selling" checked={false} />
              <ToggleRow tokens={tokens} label="Trending" desc="High momentum" checked={false} />
            </div>
          </Panel>

          <Panel tokens={tokens} title="Product Image">
            <div style={{
              aspectRatio: '1', borderRadius: 10, overflow: 'hidden',
              backgroundImage: 'url(/jordan_powder_blue_nobg.png)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              background: tokens.bg.surfaceAlt,
              border: `1px solid ${tokens.border.subtle}`,
              marginBottom: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
            }}>👟</div>
            <Button tokens={tokens} variant="outline" size="sm" fullWidth>Change Image</Button>
          </Panel>

          <Panel tokens={tokens} title="Stats">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Stat label="Views" value="8,420" />
              <Stat label="Sales" value="142" />
              <Stat label="Revenue" value="₹12,62,058" />
              <Stat label="Rating" value="4.9 ★ (128)" />
              <Stat label="Added" value="3 months ago" />
            </div>
          </Panel>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1000px) {
          :global(.edit-grid) { grid-template-columns: minmax(0, 1fr) !important; }
        }
      `}</style>
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

function Stat({ label, value }: { label: string; value: string }) {
  const { tokens } = useAdminTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: tokens.text.tertiary }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: tokens.text.primary }}>{value}</span>
    </div>
  );
}
