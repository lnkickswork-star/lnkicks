/**
 * LNKICKS Enterprise Admin — Add Product
 */

'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Panel, Input, Textarea, Select, Toggle, useToast, Tabs,
} from '@/components/admin/ui';

type Step = 'basic' | 'pricing' | 'inventory' | 'images' | 'seo' | 'placement';

export default function AddProductPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [step, setStep] = useState<Step>('basic');
  const [saving, setSaving] = useState(false);

  function handleSave(publish: boolean) {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      pushToast({ tone: 'success', title: publish ? 'Product published' : 'Draft saved', message: 'Product added to catalog.' });
    }, 800);
  }

  return (
    <AdminLayout
      title="Add Product"
      subtitle="Create new catalog entry"
      requirePermission="product.create"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Catalog' }, { label: 'Products', href: '/products-management' }, { label: 'Add' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Add New Product"
        subtitle="Create a new sneaker SKU with full enterprise metadata — pricing, inventory, images, SEO, and homepage placement."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Catalog' }, { label: 'Products', href: '/products-management' }, { label: 'Add' }]}
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" loading={saving} onClick={() => handleSave(false)}>Save Draft</Button>
            <Button tokens={tokens} variant="primary" size="md" loading={saving} onClick={() => handleSave(true)}>Publish Product</Button>
          </>
        }
      />

      <div style={{ marginBottom: 16 }}>
        <Tabs tokens={tokens} tabs={[
          { key: 'basic', label: '1. Basic Info' },
          { key: 'pricing', label: '2. Pricing' },
          { key: 'inventory', label: '3. Inventory' },
          { key: 'images', label: '4. Images' },
          { key: 'seo', label: '5. SEO' },
          { key: 'placement', label: '6. Placement' },
        ]} active={step} onChange={(k) => setStep(k as Step)} />
      </div>

      {step === 'basic' && (
        <Panel tokens={tokens} title="Basic Information" subtitle="Product name, brand, category">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input tokens={tokens} label="Product Name" placeholder="e.g. Air Jordan 1 Low Black Powder Blue" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Select tokens={tokens} label="Brand"
                options={[
                  { value: 'NIKE', label: 'Nike' },
                  { value: 'JORDAN', label: 'Jordan' },
                  { value: 'ADIDAS', label: 'Adidas' },
                  { value: 'YEEZY', label: 'Yeezy' },
                  { value: 'NEWBALANCE', label: 'New Balance' },
                  { value: 'ASICS', label: 'Asics' },
                ]}
              />
              <Select tokens={tokens} label="Category"
                options={[
                  { value: 'Sneakers', label: 'Sneakers' },
                  { value: 'Lifestyle', label: 'Lifestyle' },
                  { value: 'Running', label: 'Running' },
                  { value: 'Basketball', label: 'Basketball' },
                ]}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Select tokens={tokens} label="Subcategory"
                options={[
                  { value: 'Low Top', label: 'Low Top' },
                  { value: 'Mid Top', label: 'Mid Top' },
                  { value: 'High Top', label: 'High Top' },
                ]}
              />
              <Select tokens={tokens} label="Gender"
                options={[
                  { value: 'Unisex', label: 'Unisex' },
                  { value: 'Men', label: 'Men' },
                  { value: 'Women', label: 'Women' },
                  { value: 'Kids', label: 'Kids' },
                ]}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Input tokens={tokens} label="SKU" placeholder="AJ1-PB-01" />
              <Input tokens={tokens} label="Barcode" placeholder="0123456789012" />
            </div>
            <Textarea tokens={tokens} label="Short Description" placeholder="One-line description for cards and OG metadata" />
            <Textarea tokens={tokens} label="Long Description" placeholder="Full product description for the product page" />
          </div>
        </Panel>
      )}

      {step === 'pricing' && (
        <Panel tokens={tokens} title="Pricing" subtitle="Selling price, MRP, and discounts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <Input tokens={tokens} label="Selling Price (₹)" type="number" placeholder="8899" />
              <Input tokens={tokens} label="MRP (₹)" type="number" placeholder="18999" />
              <Input tokens={tokens} label="Cost Price (₹)" type="number" placeholder="6000" hint="For margin calc" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Select tokens={tokens} label="Discount Type"
                options={[
                  { value: 'none', label: 'No Discount' },
                  { value: 'percentage', label: 'Percentage Off' },
                  { value: 'flat', label: 'Flat ₹ Off' },
                ]}
              />
              <Input tokens={tokens} label="Discount Value" type="number" placeholder="40" />
            </div>
            <Input tokens={tokens} label="Tax Rate (%)" type="number" defaultValue="18" />
          </div>
        </Panel>
      )}

      {step === 'inventory' && (
        <Panel tokens={tokens} title="Inventory" subtitle="Stock, sizes, colors, materials">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Input tokens={tokens} label="Total Stock" type="number" placeholder="42" />
              <Input tokens={tokens} label="Low Stock Threshold" type="number" defaultValue="5" />
            </div>
            <Input tokens={tokens} label="Available Sizes (comma separated)" placeholder="UK 7, UK 8, UK 9, UK 10" />
            <Input tokens={tokens} label="Available Colors (comma separated)" placeholder="Black, Powder Blue" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Input tokens={tokens} label="Material" placeholder="Full-grain leather" />
              <Input tokens={tokens} label="Weight (grams)" type="number" placeholder="840" />
            </div>
            <Input tokens={tokens} label="Launch Date" type="date" />
          </div>
        </Panel>
      )}

      {step === 'images' && (
        <Panel tokens={tokens} title="Product Images" subtitle="Main, views, 360, gallery">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Main Image</div>
              <div style={{ border: `2px dashed ${tokens.border.strong}`, borderRadius: 12, padding: 32, textAlign: 'center', background: tokens.bg.surfaceAlt }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary, marginBottom: 2 }}>Drop image here</div>
                <div style={{ fontSize: 10, color: tokens.text.tertiary }}>WebP, JPG · 1200×1200 recommended</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Additional Views</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                {['Front', 'Back', 'Left', 'Right', 'Top', 'Bottom'].map(v => (
                  <div key={v} style={{ aspectRatio: '1', border: `1px dashed ${tokens.border.strong}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: tokens.text.tertiary, background: tokens.bg.surfaceAlt }}>
                    {v}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: tokens.text.secondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Auto-Optimization</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <ToggleRow tokens={tokens} label="Convert to WebP" desc="Auto-convert JPG/PNG to WebP format" checked={true} />
                <ToggleRow tokens={tokens} label="Generate AVIF" desc="Create AVIF version for modern browsers" checked={true} />
                <ToggleRow tokens={tokens} label="Auto-watermark" desc="Apply LNKICKS watermark to all images" checked={true} />
                <ToggleRow tokens={tokens} label="AI rename files" desc="SEO-friendly filenames (e.g. allen-kicks-air-jordan-1-front.webp)" checked={true} />
              </div>
            </div>
          </div>
        </Panel>
      )}

      {step === 'seo' && (
        <Panel tokens={tokens} title="SEO Metadata" subtitle="Search engine optimization"
          action={<Button tokens={tokens} variant="outline" size="sm" onClick={() => pushToast({ tone: 'info', title: 'AI generating SEO…' })}>Generate with AI</Button>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input tokens={tokens} label="SEO Title" placeholder="Air Jordan 1 Low Powder Blue — LNKICKS" hint="60 chars recommended" />
            <Textarea tokens={tokens} label="Meta Description" placeholder="Buy authentic Air Jordan 1 Low Powder Blue in India at LNKICKS." hint="160 chars recommended" />
            <Input tokens={tokens} label="Keywords" placeholder="air jordan 1, powder blue, sneakers india" />
            <Input tokens={tokens} label="Slug" placeholder="air-jordan-1-low-powder-blue" />
            <Input tokens={tokens} label="Canonical URL" placeholder="/product/air-jordan-1-low-powder-blue" />
          </div>
        </Panel>
      )}

      {step === 'placement' && (
        <Panel tokens={tokens} title="Homepage Placement" subtitle="Where this product should appear">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Featured', 'Trending', 'Best Seller', 'Flash Sale', 'Most Wanted',
              'New Arrival', 'Recently Added', 'Luxury Collection', 'Sneaker Of Week',
              "Editor's Pick", 'Recommended', 'Limited Edition', 'Festival Collection',
              'Seasonal Collection', 'Under ₹3000', 'Under ₹5000', 'Premium Collection',
              'Desktop Hero Cards', 'Desktop 3D Carousel', 'Mobile Swipe Cards', 'Mobile Slider',
            ].map(p => (
              <ToggleRow key={p} tokens={tokens} label={p} desc={`Display this product in the ${p} section`} checked={['Featured', 'New Arrival'].includes(p)} />
            ))}
          </div>
        </Panel>
      )}
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
