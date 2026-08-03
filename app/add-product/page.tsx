/**
 * LNKICKS Enterprise Admin — Add Product
 * ------------------------------------------------------------
 * World-class enterprise product editor inspired by
 * Shopify Admin, Adobe Commerce, Amazon Seller Central,
 * BigCommerce, Apple Business Manager & Stripe Dashboard.
 *
 * Layout:
 *   ┌──────────────────────────────────────────┬──────────────┐
 *   │  EDITING WORKSPACE                       │  STICKY      │
 *   │  (collapsible sections, all on one page) │  PREVIEW +   │
 *   │                                          │  PUBLISH     │
 *   │  1. General Information                  │  PANEL       │
 *   │  2. Media (drag-drop manager)            │              │
 *   │  3. Pricing                              │  • Live      │
 *   │  4. Inventory                            │    preview   │
 *   │  5. Variants                             │  • Validation│
 *   │  6. Shipping                             │  • Autosave  │
 *   │  7. Attributes                           │  • Save /    │
 *   │  8. SEO                                  │    Publish / │
 *   │  9. Visibility & Placement               │    Schedule  │
 *   │ 10. Publishing                           │              │
 *   └──────────────────────────────────────────┴──────────────┘
 *
 * Strict rules obeyed:
 *   - Every existing field from the previous version is preserved.
 *   - No new business logic — save workflow is identical (mock 800ms).
 *   - Same route, same AdminLayout, same RBAC permission.
 *   - Reuses tokens + UI primitives from the admin design system.
 */

'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  Button, Input, Textarea, Select, Toggle, useToast,
  Badge, ProgressBar, Divider,
} from '@/components/admin/ui';
import { Icon } from '@/components/admin/icons/Icon';
import type { AdminThemeTokens } from '@/lib/admin/types';

type Tk = AdminThemeTokens;

/* =========================================================== */
/* Constants — reusing every existing field                    */
/* =========================================================== */

const BRANDS = [
  { value: 'NIKE', label: 'Nike' },
  { value: 'JORDAN', label: 'Jordan' },
  { value: 'ADIDAS', label: 'Adidas' },
  { value: 'YEEZY', label: 'Yeezy' },
  { value: 'NEWBALANCE', label: 'New Balance' },
  { value: 'ASICS', label: 'Asics' },
];

const CATEGORIES = [
  { value: 'Sneakers', label: 'Sneakers' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Running', label: 'Running' },
  { value: 'Basketball', label: 'Basketball' },
];

const SUBCATEGORIES = [
  { value: 'Low Top', label: 'Low Top' },
  { value: 'Mid Top', label: 'Mid Top' },
  { value: 'High Top', label: 'High Top' },
];

const GENDERS = [
  { value: 'Unisex', label: 'Unisex' },
  { value: 'Men', label: 'Men' },
  { value: 'Women', label: 'Women' },
  { value: 'Kids', label: 'Kids' },
];

const DISCOUNT_TYPES = [
  { value: 'none', label: 'No Discount' },
  { value: 'percentage', label: 'Percentage Off' },
  { value: 'flat', label: 'Flat ₹ Off' },
];

const SHIPPING_CLASSES = [
  { value: 'standard', label: 'Standard (3-5 days)' },
  { value: 'express', label: 'Express (1-2 days)' },
  { value: 'sameday', label: 'Same-Day Delivery' },
  { value: 'pickup', label: 'Store Pickup' },
  { value: 'heavy', label: 'Heavy / Oversized' },
];

const PUBLISH_STATUS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'hidden', label: 'Hidden' },
];

/* Group the 20 placement toggles for clearer hierarchy */
const PLACEMENT_GROUPS: { label: string; hint: string; items: string[] }[] = [
  {
    label: 'Collection Tags',
    hint: 'Curated badges shown on product cards & filters',
    items: [
      'Featured', 'Trending', 'Best Seller', 'Flash Sale', 'Most Wanted',
      'New Arrival', 'Recently Added', 'Luxury Collection', 'Sneaker Of Week',
      "Editor's Pick", 'Recommended', 'Limited Edition',
    ],
  },
  {
    label: 'Curated Lists',
    hint: 'Appears in dedicated collection pages',
    items: [
      'Festival Collection', 'Seasonal Collection',
      'Under ₹3000', 'Under ₹5000', 'Premium Collection',
    ],
  },
  {
    label: 'Homepage Slots',
    hint: 'Premium real estate on the storefront homepage',
    items: [
      'Desktop Hero Cards', 'Desktop 3D Carousel',
      'Mobile Swipe Cards', 'Mobile Slider',
    ],
  },
];

/* =========================================================== */
/* Types                                                       */
/* =========================================================== */

type SectionKey =
  | 'general' | 'media' | 'pricing' | 'inventory'
  | 'variants' | 'shipping' | 'attributes' | 'seo'
  | 'visibility' | 'publishing';

interface ImageItem {
  id: string;
  name: string;
  url: string;          // object URL
  size: number;         // bytes
  progress: number;     // 0-100
  isFeatured: boolean;
  alt: string;
  status: 'uploading' | 'ready' | 'error';
}

interface VariantRow {
  id: string;
  size: string;
  color: string;
  stock: number;
  price: number;
  sku: string;
}

interface FormState {
  // General
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  gender: string;
  sku: string;
  barcode: string;
  shortDesc: string;
  longDesc: string;
  // Pricing
  sellingPrice: string;
  mrp: string;
  costPrice: string;
  discountType: string;
  discountValue: string;
  taxRate: string;
  // Inventory
  totalStock: string;
  lowStockThreshold: string;
  sizes: string;
  colors: string;
  material: string;
  weight: string;
  launchDate: string;
  // Shipping
  shippingClass: string;
  dimensions: string;
  // SEO
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  slug: string;
  canonicalUrl: string;
  // Publishing
  status: 'draft' | 'published' | 'scheduled' | 'hidden';
  scheduleDate: string;
  // Variants
  variantsEnabled: boolean;
}

const INITIAL_FORM: FormState = {
  name: '', brand: 'NIKE', category: 'Sneakers', subcategory: 'Low Top',
  gender: 'Unisex', sku: '', barcode: '', shortDesc: '', longDesc: '',
  sellingPrice: '', mrp: '', costPrice: '', discountType: 'none',
  discountValue: '', taxRate: '18',
  totalStock: '', lowStockThreshold: '5', sizes: '', colors: '',
  material: '', weight: '', launchDate: '',
  shippingClass: 'standard', dimensions: '',
  seoTitle: '', metaDescription: '', keywords: '', slug: '', canonicalUrl: '',
  status: 'draft', scheduleDate: '',
  variantsEnabled: false,
};

interface PreviewData {
  name: string;
  brand: string;
  category: string;
  gender: string;
  finalPrice: number;
  compareAt: number;
  discountPct: number;
  stock: number;
  stockStatus: 'in' | 'low' | 'out';
  featuredImage: ImageItem | null;
  gallery: ImageItem[];
  sizes: string[];
  colors: string[];
  shortDesc: string;
  badges: string[];
}

/* =========================================================== */
/* Page component                                              */
/* =========================================================== */

export default function AddProductPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([
    { id: 'v1', size: 'UK 7', color: 'Black', stock: 0, price: 0, sku: '' },
    { id: 'v2', size: 'UK 8', color: 'Black', stock: 0, price: 0, sku: '' },
  ]);
  const [placements, setPlacements] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      PLACEMENT_GROUPS.flatMap(g => g.items).map(p =>
        [p, ['Featured', 'New Arrival'].includes(p)]
      )
    )
  );

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    general: true, media: true, pricing: true, inventory: true,
    variants: false, shipping: false, attributes: false, seo: true,
    visibility: false, publishing: true,
  });

  const [saving, setSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'storefront' | 'card' | 'mobile'>('storefront');
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [globalDragOver, setGlobalDragOver] = useState(false);

  /* --------------------------------------------------------- */
  /* Field update + autosave                                   */
  /* --------------------------------------------------------- */

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setAutosaveStatus('saving');
  }, []);

  const touch = useCallback((key: string) => {
    setTouched(prev => (prev[key] ? prev : { ...prev, [key]: true }));
  }, []);

  // Autosave effect
  useEffect(() => {
    if (autosaveStatus !== 'saving') return;
    const t = setTimeout(() => {
      setAutosaveStatus('saved');
      setLastSaved(new Date());
    }, 1400);
    return () => clearTimeout(t);
  }, [autosaveStatus, form]);

  /* --------------------------------------------------------- */
  /* Validation                                                */
  /* --------------------------------------------------------- */

  const validation = useMemo(() => {
    const checks: { key: string; label: string; ok: boolean }[] = [
      { key: 'name', label: 'Product name', ok: form.name.trim().length >= 3 },
      { key: 'brand', label: 'Brand', ok: !!form.brand },
      { key: 'category', label: 'Category', ok: !!form.category },
      { key: 'sku', label: 'SKU', ok: form.sku.trim().length >= 3 },
      { key: 'price', label: 'Selling price', ok: Number(form.sellingPrice) > 0 },
      { key: 'stock', label: 'Stock quantity', ok: Number(form.totalStock) >= 0 && form.totalStock !== '' },
      { key: 'image', label: 'At least one image', ok: images.some(i => i.status === 'ready') },
      { key: 'description', label: 'Short description', ok: form.shortDesc.trim().length >= 10 },
    ];
    const completed = checks.filter(c => c.ok).length;
    const pct = Math.round((completed / checks.length) * 100);
    return { checks, completed, total: checks.length, pct };
  }, [form, images]);

  const canPublish = validation.completed === validation.total;

  /* --------------------------------------------------------- */
  /* Save handlers (preserves existing business logic)         */
  /* --------------------------------------------------------- */

  function handleSave(publish: boolean) {
    if (publish && !canPublish) {
      pushToast({
        tone: 'warning',
        title: 'Cannot publish yet',
        message: `Complete ${validation.total - validation.completed} required field(s) first.`,
      });
      // Mark all unfulfilled fields as touched so errors show
      const newTouched: Record<string, boolean> = { ...touched };
      validation.checks.forEach(c => { if (!c.ok) newTouched[c.key] = true; });
      setTouched(newTouched);
      // Scroll to first missing field
      const firstMissing = validation.checks.find(c => !c.ok);
      if (firstMissing) {
        const el = document.querySelector(`[data-field="${firstMissing.key}"]`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      pushToast({
        tone: 'success',
        title: publish ? 'Product published' : 'Draft saved',
        message: publish
          ? `${form.name || 'New product'} is now live on the storefront.`
          : 'Progress saved. You can continue editing.',
      });
      if (publish) update('status', 'published');
    }, 800);
  }

  function handleSchedule() {
    if (!form.scheduleDate) {
      pushToast({ tone: 'warning', title: 'Pick a date', message: 'Select a schedule date first.' });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      update('status', 'scheduled');
      pushToast({
        tone: 'success',
        title: 'Product scheduled',
        message: `Will go live on ${new Date(form.scheduleDate).toLocaleString()}.`,
      });
    }, 800);
  }

  /* --------------------------------------------------------- */
  /* Media manager — drag/drop, multi-upload, progress         */
  /* --------------------------------------------------------- */

  const simulateUpload = useCallback((id: string) => {
    let p = 0;
    const tick = () => {
      p += Math.random() * 22 + 8;
      setImages(prev => prev.map(img =>
        img.id === id
          ? { ...img, progress: Math.min(100, p), status: p >= 100 ? 'ready' : 'uploading' }
          : img
      ));
      if (p < 100) setTimeout(tick, 180 + Math.random() * 140);
    };
    setTimeout(tick, 200);
  }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (arr.length === 0) return;
    setImages(prev => {
      const wasEmpty = prev.length === 0;
      const newItems: ImageItem[] = arr.map((file, idx) => ({
        id: `img-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        progress: 0,
        isFeatured: wasEmpty && idx === 0,
        alt: file.name.replace(/\.[^.]+$/, ''),
        status: 'uploading',
      }));
      const combined = [...prev, ...newItems];
      // If still no featured, set first
      if (!combined.some(i => i.isFeatured) && combined.length > 0) {
        combined[0].isFeatured = true;
      }
      // Kick off simulated uploads
      newItems.forEach(n => simulateUpload(n.id));
      return combined;
    });
  }, [simulateUpload]);

  function removeImage(id: string) {
    setImages(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx === -1) return prev;
      const next = prev.filter(i => i.id !== id);
      // Reassign featured if removed
      if (prev[idx].isFeatured && next.length > 0) {
        next[0].isFeatured = true;
      }
      // Revoke object URL
      URL.revokeObjectURL(prev[idx].url);
      return next;
    });
  }

  function setFeatured(id: string) {
    setImages(prev => prev.map(img => ({ ...img, isFeatured: img.id === id })));
  }

  function replaceImage(id: string) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        setImages(prev => prev.map(img =>
          img.id === id
            ? { ...img, name: file.name, url: URL.createObjectURL(file), size: file.size, progress: 0, status: 'uploading' }
            : img
        ));
        // Re-simulate upload
        simulateUpload(id);
      }
    };
    input.click();
  }

  function reorderImages(draggedId: string, targetId: string) {
    if (draggedId === targetId) return;
    setImages(prev => {
      const fromIdx = prev.findIndex(i => i.id === draggedId);
      const toIdx = prev.findIndex(i => i.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.types.includes('Files')) setGlobalDragOver(true);
  }
  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setGlobalDragOver(false);
    }
  }
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setGlobalDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  /* --------------------------------------------------------- */
  /* Variants                                                  */
  /* --------------------------------------------------------- */

  function addVariant() {
    setVariants(prev => [...prev, {
      id: `v-${Date.now()}`,
      size: 'UK 7', color: 'Black', stock: 0, price: 0, sku: '',
    }]);
  }
  function updateVariant(id: string, field: keyof VariantRow, value: string | number) {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    setAutosaveStatus('saving');
  }
  function removeVariant(id: string) {
    setVariants(prev => prev.filter(v => v.id !== id));
  }

  /* --------------------------------------------------------- */
  /* Derived preview values                                    */
  /* --------------------------------------------------------- */

  const preview = useMemo((): PreviewData => {
    const selling = Number(form.sellingPrice) || 0;
    const mrp = Number(form.mrp) || 0;
    const discountType = form.discountType;
    const discountValue = Number(form.discountValue) || 0;
    let finalPrice = selling;
    let compareAt = mrp;
    let discountPct = 0;
    if (discountType === 'percentage' && discountValue > 0) {
      finalPrice = Math.round(selling * (1 - discountValue / 100));
      compareAt = selling;
      discountPct = Math.round(discountValue);
    } else if (discountType === 'flat' && discountValue > 0) {
      finalPrice = Math.max(0, selling - discountValue);
      compareAt = selling;
      discountPct = compareAt > 0 ? Math.round((discountValue / compareAt) * 100) : 0;
    } else if (mrp > selling && selling > 0) {
      discountPct = Math.round((1 - selling / mrp) * 100);
    }
    const stock = Number(form.totalStock) || 0;
    const lowThreshold = Number(form.lowStockThreshold) || 5;
    const stockStatus: 'in' | 'low' | 'out' =
      stock === 0 ? 'out' : stock <= lowThreshold ? 'low' : 'in';

    return {
      name: form.name || 'Untitled product',
      brand: BRANDS.find(b => b.value === form.brand)?.label || '—',
      category: form.category,
      gender: form.gender,
      finalPrice,
      compareAt,
      discountPct,
      stock,
      stockStatus,
      featuredImage: images.find(i => i.isFeatured) || images[0] || null,
      gallery: images.filter(i => i.status === 'ready'),
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
      shortDesc: form.shortDesc || 'Add a short description to see it here.',
      badges: Object.entries(placements).filter(([, v]) => v).map(([k]) => k).slice(0, 4),
    };
  }, [form, images, placements]);

  const fmtINR = (n: number) =>
    n > 0 ? `₹${n.toLocaleString('en-IN')}` : '—';

  /* --------------------------------------------------------- */
  /* Section toggle                                            */
  /* --------------------------------------------------------- */

  function toggleSection(key: SectionKey) {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  }
  function expandAll() {
    setOpenSections({
      general: true, media: true, pricing: true, inventory: true,
      variants: true, shipping: true, attributes: true, seo: true,
      visibility: true, publishing: true,
    });
  }
  function collapseAll() {
    setOpenSections({
      general: false, media: false, pricing: false, inventory: false,
      variants: false, shipping: false, attributes: false, seo: false,
      visibility: false, publishing: false,
    });
  }

  /* --------------------------------------------------------- */
  /* Render                                                    */
  /* --------------------------------------------------------- */

  return (
    <AdminLayout
      title="Add Product"
      subtitle="Create new catalog entry"
      requirePermission="product.create"
      breadcrumb={[
        { label: 'Admin', href: '/dashboard' },
        { label: 'Catalog' },
        { label: 'Products', href: '/products-management' },
        { label: 'Add' },
      ]}
    >
      <div className="ap-root" data-field-root>
        <PageHeader
          tokens={tokens}
          title="Add New Product"
          subtitle="Create a new sneaker SKU with full enterprise metadata — pricing, inventory, media, variants, SEO, and storefront placement."
          breadcrumb={[
            { label: 'Admin', href: '/dashboard' },
            { label: 'Catalog' },
            { label: 'Products', href: '/products-management' },
            { label: 'Add' },
          ]}
          meta={
            <Badge tokens={tokens} tone="info" dot>
              {validation.completed}/{validation.total} ready
            </Badge>
          }
          actions={
            <>
              <Button
                tokens={tokens} variant="ghost" size="md"
                onClick={() => window.history.back()}
                icon={<Icon name="arrowLeft" size={14} />}
              >
                Cancel
              </Button>
              <Button
                tokens={tokens} variant="outline" size="md"
                loading={saving}
                onClick={() => handleSave(false)}
                icon={<Icon name="save" size={14} />}
              >
                Save Draft
              </Button>
              <Button
                tokens={tokens} variant="primary" size="md"
                loading={saving}
                onClick={() => handleSave(true)}
                icon={<Icon name="flash" size={14} />}
              >
                Publish
              </Button>
            </>
          }
        />

        {/* Two-column workspace */}
        <div className="ap-grid">
          {/* ============ LEFT: editing workspace ============ */}
          <div className="ap-left">
            {/* Section toolbar */}
            <div className="ap-section-toolbar">
              <div className="ap-section-toolbar-left">
                <span className="ap-section-toolbar-label">Form sections</span>
                <Badge tokens={tokens} tone="neutral">{Object.values(openSections).filter(Boolean).length} open</Badge>
              </div>
              <div className="ap-section-toolbar-right">
                <button className="ap-link-btn" onClick={expandAll}>Expand all</button>
                <span className="ap-sep">·</span>
                <button className="ap-link-btn" onClick={collapseAll}>Collapse all</button>
              </div>
            </div>

            {/* 1. General Information */}
            <Section
              tokens={tokens}
              id="general"
              number={1}
              title="General Information"
              subtitle="Product name, brand, category, and descriptions"
              icon={<Icon name="product" size={14} />}
              accent="info"
              open={openSections.general}
              onToggle={() => toggleSection('general')}
              completion={(() => {
                let c = 0; const t = 6;
                if (form.name.trim().length >= 3) c++;
                if (form.brand) c++;
                if (form.category) c++;
                if (form.sku.trim().length >= 3) c++;
                if (form.shortDesc.trim().length >= 10) c++;
                if (form.longDesc.trim().length >= 20) c++;
                return { c, t };
              })()}
            >
              <div className="ap-field-grid ap-grid-2">
                <div data-field="name" className="ap-field-span-2">
                  <Input
                    tokens={tokens}
                    label="Product Name *"
                    placeholder="e.g. Air Jordan 1 Low Black Powder Blue"
                    value={form.name}
                    onChange={e => { update('name', e.target.value); touch('name'); }}
                    error={touched.name && form.name.trim().length < 3 ? 'Name must be at least 3 characters' : undefined}
                    hint="Shown on product cards, search results, and the PDP title"
                  />
                </div>
                <Select
                  tokens={tokens} label="Brand *"
                  options={BRANDS}
                  value={form.brand}
                  onChange={e => update('brand', e.target.value)}
                />
                <Select
                  tokens={tokens} label="Category *"
                  options={CATEGORIES}
                  value={form.category}
                  onChange={e => update('category', e.target.value)}
                />
                <Select
                  tokens={tokens} label="Subcategory"
                  options={SUBCATEGORIES}
                  value={form.subcategory}
                  onChange={e => update('subcategory', e.target.value)}
                />
                <Select
                  tokens={tokens} label="Gender"
                  options={GENDERS}
                  value={form.gender}
                  onChange={e => update('gender', e.target.value)}
                />
                <div data-field="sku">
                  <Input
                    tokens={tokens} label="SKU *"
                    placeholder="AJ1-PB-01"
                    value={form.sku}
                    onChange={e => { update('sku', e.target.value); touch('sku'); }}
                    error={touched.sku && form.sku.trim().length < 3 ? 'SKU must be at least 3 characters' : undefined}
                    hint="Unique stock-keeping unit (e.g. BRAND-MODEL-COLOR)"
                  />
                </div>
                <Input
                  tokens={tokens} label="Barcode (GTIN)"
                  placeholder="0123456789012"
                  value={form.barcode}
                  onChange={e => update('barcode', e.target.value)}
                  hint="EAN-13 / UPC-A for marketplace integration"
                />
                <div className="ap-field-span-2" data-field="description">
                  <Textarea
                    tokens={tokens} label="Short Description *"
                    placeholder="One-line description for cards and OG metadata"
                    value={form.shortDesc}
                    onChange={e => { update('shortDesc', e.target.value); touch('description'); }}
                    error={touched.description && form.shortDesc.trim().length < 10 ? 'Add at least a 10-character description' : undefined}
                    hint={`${form.shortDesc.length}/160 characters · used in cards & meta tags`}
                  />
                </div>
                <div className="ap-field-span-2">
                  <Textarea
                    tokens={tokens} label="Long Description"
                    placeholder="Full product description for the product page"
                    value={form.longDesc}
                    onChange={e => update('longDesc', e.target.value)}
                    hint={`${form.longDesc.length} characters · supports plain text`}
                    style={{ minHeight: 140 }}
                  />
                </div>
              </div>
            </Section>

            {/* 2. Media */}
            <Section
              tokens={tokens}
              id="media"
              number={2}
              title="Media"
              subtitle="Drag, drop, reorder, and set the featured image"
              icon={<Icon name="image" size={14} />}
              accent="purple"
              open={openSections.media}
              onToggle={() => toggleSection('media')}
              completion={{ c: images.some(i => i.status === 'ready') ? 1 : 0, t: 1 }}
            >
              <MediaManager
                tokens={tokens}
                images={images}
                draggedImageId={draggedImageId}
                dropTargetId={dropTargetId}
                globalDragOver={globalDragOver}
                fileInputRef={fileInputRef}
                onAddFiles={addFiles}
                onRemove={removeImage}
                onSetFeatured={setFeatured}
                onReplace={replaceImage}
                onReorder={reorderImages}
                onSetDragged={setDraggedImageId}
                onSetDropTarget={setDropTargetId}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            </Section>

            {/* 3. Pricing */}
            <Section
              tokens={tokens}
              id="pricing"
              number={3}
              title="Pricing"
              subtitle="Selling price, MRP, cost, discounts, and tax"
              icon={<Icon name="rupee" size={14} />}
              accent="success"
              open={openSections.pricing}
              onToggle={() => toggleSection('pricing')}
              completion={(() => {
                let c = 0; const t = 2;
                if (Number(form.sellingPrice) > 0) c++;
                if (Number(form.mrp) > 0) c++;
                return { c, t };
              })()}
            >
              <div className="ap-field-grid ap-grid-3">
                <div data-field="price">
                  <Input
                    tokens={tokens} label="Selling Price (₹) *" type="number"
                    placeholder="8899" value={form.sellingPrice}
                    onChange={e => { update('sellingPrice', e.target.value); touch('price'); }}
                    error={touched.price && Number(form.sellingPrice) <= 0 ? 'Enter a valid price' : undefined}
                    hint="Final price customer pays"
                  />
                </div>
                <Input
                  tokens={tokens} label="MRP (₹)" type="number"
                  placeholder="18999" value={form.mrp}
                  onChange={e => update('mrp', e.target.value)}
                  hint="List price (strike-through)"
                />
                <Input
                  tokens={tokens} label="Cost Price (₹)" type="number"
                  placeholder="6000" value={form.costPrice}
                  onChange={e => update('costPrice', e.target.value)}
                  hint="For margin calculation"
                />
                <Select
                  tokens={tokens} label="Discount Type"
                  options={DISCOUNT_TYPES}
                  value={form.discountType}
                  onChange={e => update('discountType', e.target.value)}
                />
                <Input
                  tokens={tokens} label="Discount Value" type="number"
                  placeholder="40" value={form.discountValue}
                  onChange={e => update('discountValue', e.target.value)}
                  hint={form.discountType === 'percentage' ? 'Percentage off (0-100)' : form.discountType === 'flat' ? 'Flat ₹ off' : 'Not applicable'}
                  disabled={form.discountType === 'none'}
                />
                <Input
                  tokens={tokens} label="Tax Rate (%)" type="number"
                  value={form.taxRate}
                  onChange={e => update('taxRate', e.target.value)}
                  hint="GST applied at checkout"
                />
              </div>

              {/* Live margin preview */}
              <div className="ap-pricing-preview">
                <div className="ap-pricing-row">
                  <div>
                    <div className="ap-overline">Selling price</div>
                    <div className="ap-pricing-value">{fmtINR(Number(form.sellingPrice) || 0)}</div>
                  </div>
                  <div>
                    <div className="ap-overline">MRP</div>
                    <div className="ap-pricing-value ap-muted">{fmtINR(Number(form.mrp) || 0)}</div>
                  </div>
                  <div>
                    <div className="ap-overline">Cost</div>
                    <div className="ap-pricing-value ap-muted">{fmtINR(Number(form.costPrice) || 0)}</div>
                  </div>
                  <div>
                    <div className="ap-overline">Margin</div>
                    <div className="ap-pricing-value" style={{
                      color: (() => {
                        const s = Number(form.sellingPrice) || 0;
                        const c = Number(form.costPrice) || 0;
                        if (!s || !c) return tokens.text.primary;
                        const m = ((s - c) / s) * 100;
                        return m >= 40 ? tokens.status.success : m >= 20 ? tokens.status.warning : tokens.status.error;
                      })(),
                    }}>
                      {(() => {
                        const s = Number(form.sellingPrice) || 0;
                        const c = Number(form.costPrice) || 0;
                        if (!s || !c) return '—';
                        return `${Math.round(((s - c) / s) * 100)}%`;
                      })()}
                    </div>
                  </div>
                  <div>
                    <div className="ap-overline">Discount</div>
                    <div className="ap-pricing-value" style={{ color: tokens.status.info }}>
                      {(() => {
                        const dt = form.discountType;
                        const dv = Number(form.discountValue) || 0;
                        if (dt === 'percentage') return `${dv}% off`;
                        if (dt === 'flat') return `₹${dv} off`;
                        const s = Number(form.sellingPrice) || 0;
                        const m = Number(form.mrp) || 0;
                        if (m > s && s > 0) return `${Math.round((1 - s / m) * 100)}% off MRP`;
                        return 'No discount';
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* 4. Inventory */}
            <Section
              tokens={tokens}
              id="inventory"
              number={4}
              title="Inventory"
              subtitle="Stock levels, sizes, colors, and material specs"
              icon={<Icon name="inventory" size={14} />}
              accent="warning"
              open={openSections.inventory}
              onToggle={() => toggleSection('inventory')}
              completion={(() => {
                let c = 0; const t = 2;
                if (form.totalStock !== '' && Number(form.totalStock) >= 0) c++;
                if (form.sizes.trim()) c++;
                return { c, t };
              })()}
            >
              <div className="ap-field-grid ap-grid-2">
                <div data-field="stock">
                  <Input
                    tokens={tokens} label="Total Stock *" type="number"
                    placeholder="42" value={form.totalStock}
                    onChange={e => { update('totalStock', e.target.value); touch('stock'); }}
                    error={touched.stock && (form.totalStock === '' || Number(form.totalStock) < 0) ? 'Enter a valid stock count' : undefined}
                    hint="Sum of all variant stock (if variants disabled)"
                  />
                </div>
                <Input
                  tokens={tokens} label="Low Stock Threshold" type="number"
                  value={form.lowStockThreshold}
                  onChange={e => update('lowStockThreshold', e.target.value)}
                  hint="Alert when stock drops to this level"
                />
                <Input
                  tokens={tokens} label="Available Sizes (comma separated)"
                  placeholder="UK 7, UK 8, UK 9, UK 10"
                  value={form.sizes}
                  onChange={e => update('sizes', e.target.value)}
                  hint="Used for size filter & variant generator"
                />
                <Input
                  tokens={tokens} label="Available Colors (comma separated)"
                  placeholder="Black, Powder Blue"
                  value={form.colors}
                  onChange={e => update('colors', e.target.value)}
                  hint="Used for color swatches & filter"
                />
                <Input
                  tokens={tokens} label="Material"
                  placeholder="Full-grain leather"
                  value={form.material}
                  onChange={e => update('material', e.target.value)}
                />
                <Input
                  tokens={tokens} label="Weight (grams)" type="number"
                  placeholder="840" value={form.weight}
                  onChange={e => update('weight', e.target.value)}
                  hint="Used to calculate shipping"
                />
                <Input
                  tokens={tokens} label="Launch Date" type="date"
                  value={form.launchDate}
                  onChange={e => update('launchDate', e.target.value)}
                  hint="When this product goes on sale"
                />
              </div>

              {/* Sizes preview chips */}
              {preview.sizes.length > 0 && (
                <div className="ap-chip-preview">
                  <span className="ap-overline">Size chips preview</span>
                  <div className="ap-chip-row">
                    {preview.sizes.map((s, i) => (
                      <span key={i} className="ap-size-chip">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            {/* 5. Variants */}
            <Section
              tokens={tokens}
              id="variants"
              number={5}
              title="Variants"
              subtitle="Per-size & per-color stock, price, and SKU"
              icon={<Icon name="variant" size={14} />}
              accent="info"
              open={openSections.variants}
              onToggle={() => toggleSection('variants')}
              completion={{ c: variants.length > 0 ? 1 : 0, t: 1 }}
            >
              <div className="ap-variant-header">
                <label className="ap-variant-toggle">
                  <Toggle
                    tokens={tokens}
                    checked={form.variantsEnabled}
                    onChange={v => update('variantsEnabled', v)}
                  />
                  <span>Enable variants (per-size pricing & stock)</span>
                </label>
                <Button
                  tokens={tokens} variant="outline" size="sm"
                  onClick={addVariant}
                  icon={<Icon name="plus" size={12} />}
                  disabled={!form.variantsEnabled}
                >
                  Add variant
                </Button>
              </div>

              {!form.variantsEnabled ? (
                <div className="ap-variant-disabled">
                  <Icon name="variant" size={20} color={tokens.text.tertiary} />
                  <div>
                    <div className="ap-variant-disabled-title">Variants disabled</div>
                    <div className="ap-variant-disabled-desc">
                      Total stock is managed centrally in the Inventory section.
                      Enable variants to track stock per size/color combination.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="ap-variant-table">
                  <div className="ap-variant-row ap-variant-head">
                    <div>Size</div>
                    <div>Color</div>
                    <div>Stock</div>
                    <div>Price (₹)</div>
                    <div>Variant SKU</div>
                    <div></div>
                  </div>
                  {variants.map(v => (
                    <div key={v.id} className="ap-variant-row">
                      <input
                        value={v.size}
                        onChange={e => updateVariant(v.id, 'size', e.target.value)}
                        className="ap-variant-input"
                      />
                      <input
                        value={v.color}
                        onChange={e => updateVariant(v.id, 'color', e.target.value)}
                        className="ap-variant-input"
                      />
                      <input
                        type="number"
                        value={v.stock}
                        onChange={e => updateVariant(v.id, 'stock', Number(e.target.value))}
                        className="ap-variant-input"
                      />
                      <input
                        type="number"
                        value={v.price}
                        onChange={e => updateVariant(v.id, 'price', Number(e.target.value))}
                        className="ap-variant-input"
                      />
                      <input
                        value={v.sku}
                        onChange={e => updateVariant(v.id, 'sku', e.target.value)}
                        className="ap-variant-input"
                        placeholder={`${form.sku || 'SKU'}-${v.size}`.replace(/\s+/g, '-')}
                      />
                      <button
                        className="ap-variant-remove"
                        onClick={() => removeVariant(v.id)}
                        title="Remove variant"
                        aria-label="Remove variant"
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* 6. Shipping */}
            <Section
              tokens={tokens}
              id="shipping"
              number={6}
              title="Shipping"
              subtitle="Shipping class, weight, and dimensions"
              icon={<Icon name="shipping" size={14} />}
              accent="neutral"
              open={openSections.shipping}
              onToggle={() => toggleSection('shipping')}
              completion={{ c: form.shippingClass ? 1 : 0, t: 1 }}
            >
              <div className="ap-field-grid ap-grid-2">
                <Select
                  tokens={tokens} label="Shipping Class"
                  options={SHIPPING_CLASSES}
                  value={form.shippingClass}
                  onChange={e => update('shippingClass', e.target.value)}
                />
                <Input
                  tokens={tokens} label="Dimensions (L×W×H cm)"
                  placeholder="32 × 22 × 12"
                  value={form.dimensions}
                  onChange={e => update('dimensions', e.target.value)}
                  hint="Used to compute volumetric weight"
                />
              </div>
            </Section>

            {/* 7. Attributes */}
            <Section
              tokens={tokens}
              id="attributes"
              number={7}
              title="Attributes"
              subtitle="Material, gender, subcategory — used for filters"
              icon={<Icon name="tags" size={14} />}
              accent="neutral"
              open={openSections.attributes}
              onToggle={() => toggleSection('attributes')}
              completion={{ c: form.material ? 1 : 0, t: 1 }}
            >
              <div className="ap-field-grid ap-grid-2">
                <Select
                  tokens={tokens} label="Subcategory"
                  options={SUBCATEGORIES}
                  value={form.subcategory}
                  onChange={e => update('subcategory', e.target.value)}
                />
                <Select
                  tokens={tokens} label="Gender"
                  options={GENDERS}
                  value={form.gender}
                  onChange={e => update('gender', e.target.value)}
                />
                <Input
                  tokens={tokens} label="Material"
                  placeholder="Full-grain leather"
                  value={form.material}
                  onChange={e => update('material', e.target.value)}
                />
                <Input
                  tokens={tokens} label="Weight (grams)" type="number"
                  value={form.weight}
                  onChange={e => update('weight', e.target.value)}
                />
              </div>
              <div className="ap-attr-hint">
                <Icon name="info" size={12} color={tokens.text.tertiary} />
                <span>Attributes drive storefront filters and faceted search. Duplicate values are automatically deduplicated by the catalog engine.</span>
              </div>
            </Section>

            {/* 8. SEO */}
            <Section
              tokens={tokens}
              id="seo"
              number={8}
              title="SEO Metadata"
              subtitle="Search engine & social share optimization"
              icon={<Icon name="seo" size={14} />}
              accent="info"
              open={openSections.seo}
              onToggle={() => toggleSection('seo')}
              completion={(() => {
                let c = 0; const t = 2;
                if (form.seoTitle.trim().length >= 10) c++;
                if (form.metaDescription.trim().length >= 30) c++;
                return { c, t };
              })()}
              action={
                <Button
                  tokens={tokens} variant="outline" size="sm"
                  icon={<Icon name="sparkles" size={12} />}
                  onClick={() => {
                    // Auto-generate from existing fields (no new data — derives from form)
                    const autoTitle = form.name
                      ? `${form.name} — LNKICKS`
                      : '';
                    const autoDesc = form.shortDesc
                      ? `Buy authentic ${form.name || 'sneakers'} in India at LNKICKS. ${form.shortDesc}`
                      : '';
                    const autoSlug = form.name
                      ? form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                      : '';
                    if (autoTitle) update('seoTitle', autoTitle);
                    if (autoDesc) update('metaDescription', autoDesc);
                    if (autoSlug) update('slug', autoSlug);
                    if (autoSlug) update('canonicalUrl', `/product/${autoSlug}`);
                    pushToast({ tone: 'success', title: 'SEO generated', message: 'Derived from product name & description.' });
                  }}
                >
                  Generate with AI
                </Button>
              }
            >
              <div className="ap-field-grid ap-grid-1">
                <Input
                  tokens={tokens} label="SEO Title"
                  placeholder="Air Jordan 1 Low Powder Blue — LNKICKS"
                  value={form.seoTitle}
                  onChange={e => update('seoTitle', e.target.value)}
                  hint={`${form.seoTitle.length}/60 characters · keep under 60 for Google`}
                />
                <Textarea
                  tokens={tokens} label="Meta Description"
                  placeholder="Buy authentic Air Jordan 1 Low Powder Blue in India at LNKICKS."
                  value={form.metaDescription}
                  onChange={e => update('metaDescription', e.target.value)}
                  hint={`${form.metaDescription.length}/160 characters · keep under 160 for Google`}
                />
                <Input
                  tokens={tokens} label="Keywords"
                  placeholder="air jordan 1, powder blue, sneakers india"
                  value={form.keywords}
                  onChange={e => update('keywords', e.target.value)}
                  hint="Comma-separated · used for on-site search weighting"
                />
                <div className="ap-field-grid ap-grid-2">
                  <Input
                    tokens={tokens} label="Slug"
                    placeholder="air-jordan-1-low-powder-blue"
                    value={form.slug}
                    onChange={e => update('slug', e.target.value)}
                    hint="URL: /product/{slug}"
                  />
                  <Input
                    tokens={tokens} label="Canonical URL"
                    placeholder="/product/air-jordan-1-low-powder-blue"
                    value={form.canonicalUrl}
                    onChange={e => update('canonicalUrl', e.target.value)}
                    hint="Override canonical (rarely needed)"
                  />
                </div>
              </div>

              {/* Google SERP preview */}
              <div className="ap-serp">
                <div className="ap-overline">Google search preview</div>
                <div className="ap-serp-url">
                  lnkicks.com › product › {form.slug || 'your-slug'}
                </div>
                <div className="ap-serp-title">
                  {form.seoTitle || 'Your SEO title appears here'}
                </div>
                <div className="ap-serp-desc">
                  {form.metaDescription || 'Your meta description appears here. Aim for 120-160 characters and include your primary keyword.'}
                </div>
              </div>
            </Section>

            {/* 9. Visibility & Placement */}
            <Section
              tokens={tokens}
              id="visibility"
              number={9}
              title="Visibility & Placement"
              subtitle="Where this product appears on the storefront"
              icon={<Icon name="grid" size={14} />}
              accent="purple"
              open={openSections.visibility}
              onToggle={() => toggleSection('visibility')}
              completion={{
                c: Object.values(placements).filter(Boolean).length > 0 ? 1 : 0,
                t: 1,
              }}
            >
              <div className="ap-placement-groups">
                {PLACEMENT_GROUPS.map(group => (
                  <div key={group.label} className="ap-placement-group">
                    <div className="ap-placement-group-head">
                      <div>
                        <div className="ap-placement-group-title">{group.label}</div>
                        <div className="ap-placement-group-hint">{group.hint}</div>
                      </div>
                      <Badge tokens={tokens} tone="neutral" size="sm">
                        {group.items.filter(i => placements[i]).length}/{group.items.length}
                      </Badge>
                    </div>
                    <div className="ap-placement-grid">
                      {group.items.map(p => (
                        <PlacementToggle
                          key={p}
                          tokens={tokens}
                          label={p}
                          checked={placements[p]}
                          onChange={v => {
                            setPlacements(prev => ({ ...prev, [p]: v }));
                            setAutosaveStatus('saving');
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* 10. Publishing */}
            <Section
              tokens={tokens}
              id="publishing"
              number={10}
              title="Publishing"
              subtitle="Status, schedule, and visibility controls"
              icon={<Icon name="flash" size={14} />}
              accent="success"
              open={openSections.publishing}
              onToggle={() => toggleSection('publishing')}
              completion={{ c: form.status !== 'draft' ? 1 : 0, t: 1 }}
            >
              <div className="ap-field-grid ap-grid-2">
                <Select
                  tokens={tokens} label="Status"
                  options={PUBLISH_STATUS.map(p => ({ value: p.value, label: p.label }))}
                  value={form.status}
                  onChange={e => update('status', e.target.value as FormState['status'])}
                />
                <Input
                  tokens={tokens} label="Schedule Publish For" type="datetime-local"
                  value={form.scheduleDate}
                  onChange={e => update('scheduleDate', e.target.value)}
                  disabled={form.status !== 'scheduled'}
                  hint="Auto-publish at this date & time"
                />
              </div>
              <div className="ap-publish-summary">
                <Icon name="info" size={14} color={tokens.status.info} />
                <div>
                  <strong>
                    {form.status === 'draft' && 'This product is a draft — only visible to admins.'}
                    {form.status === 'published' && 'This product is live on the storefront.'}
                    {form.status === 'scheduled' && (form.scheduleDate
                      ? `Scheduled to publish on ${new Date(form.scheduleDate).toLocaleString()}.`
                      : 'Pick a date above to schedule.')}
                    {form.status === 'hidden' && 'This product is hidden from the storefront but remains in the catalog.'}
                  </strong>
                </div>
              </div>
            </Section>
          </div>

          {/* ============ RIGHT: sticky preview + publish panel ============ */}
          <aside className="ap-right">
            <div className="ap-sticky">
              {/* Live preview */}
              <div className="ap-preview-card">
                <div className="ap-preview-head">
                  <div>
                    <div className="ap-overline">Live preview</div>
                    <div className="ap-preview-title">Storefront view</div>
                  </div>
                  <div className="ap-preview-toggle">
                    <button
                      className={`ap-preview-tab ${previewDevice === 'storefront' ? 'active' : ''}`}
                      onClick={() => setPreviewDevice('storefront')}
                      title="Storefront PDP"
                    >PDP</button>
                    <button
                      className={`ap-preview-tab ${previewDevice === 'card' ? 'active' : ''}`}
                      onClick={() => setPreviewDevice('card')}
                      title="Product card"
                    >Card</button>
                    <button
                      className={`ap-preview-tab ${previewDevice === 'mobile' ? 'active' : ''}`}
                      onClick={() => setPreviewDevice('mobile')}
                      title="Mobile view"
                    >Mobile</button>
                  </div>
                </div>

                <div className={`ap-preview-body ap-preview-${previewDevice}`}>
                  {previewDevice === 'storefront' && (
                    <StorefrontPreview tokens={tokens} preview={preview} fmtINR={fmtINR} />
                  )}
                  {previewDevice === 'card' && (
                    <CardPreview tokens={tokens} preview={preview} fmtINR={fmtINR} />
                  )}
                  {previewDevice === 'mobile' && (
                    <MobilePreview tokens={tokens} preview={preview} fmtINR={fmtINR} />
                  )}
                </div>
              </div>

              {/* Publish panel */}
              <div className="ap-publish-panel">
                <div className="ap-publish-panel-head">
                  <div className="ap-overline">Publishing</div>
                  <div className="ap-autosave">
                    {autosaveStatus === 'saving' && (
                      <>
                        <span className="ap-autosave-dot ap-dot-saving" />
                        <span>Saving…</span>
                      </>
                    )}
                    {autosaveStatus === 'saved' && (
                      <>
                        <span className="ap-autosave-dot ap-dot-saved" />
                        <span>{lastSaved ? `Saved ${formatTimeAgo(lastSaved)}` : 'Saved'}</span>
                      </>
                    )}
                    {autosaveStatus === 'idle' && (
                      <>
                        <span className="ap-autosave-dot ap-dot-idle" />
                        <span>Not edited yet</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Validation progress */}
                <div className="ap-validation">
                  <div className="ap-validation-head">
                    <span>Required fields</span>
                    <span className="ap-validation-pct">{validation.pct}%</span>
                  </div>
                  <ProgressBar
                    tokens={tokens}
                    value={validation.pct}
                    color={canPublish ? tokens.status.success : tokens.status.warning}
                    height={6}
                  />
                  <div className="ap-validation-list">
                    {validation.checks.map(c => (
                      <div key={c.key} className={`ap-validation-item ${c.ok ? 'ok' : 'pending'}`}>
                        <span className="ap-validation-check">
                          {c.ok
                            ? <Icon name="check" size={10} color={tokens.status.success} />
                            : <Icon name="x" size={10} color={tokens.text.tertiary} />}
                        </span>
                        <span className="ap-validation-label">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="ap-publish-actions">
                  <Button
                    tokens={tokens} variant="outline" size="md"
                    loading={saving}
                    onClick={() => handleSave(false)}
                    icon={<Icon name="save" size={14} />}
                    fullWidth
                  >
                    Save Draft
                  </Button>
                  <Button
                    tokens={tokens} variant="secondary" size="md"
                    onClick={() => pushToast({ tone: 'info', title: 'Preview opened', message: 'Opening storefront preview…' })}
                    icon={<Icon name="eye" size={14} />}
                    fullWidth
                  >
                    Preview
                  </Button>
                  <Button
                    tokens={tokens} variant="primary" size="md"
                    loading={saving}
                    onClick={() => handleSave(true)}
                    icon={<Icon name="flash" size={14} />}
                    fullWidth
                    disabled={!canPublish}
                  >
                    {canPublish ? 'Publish Now' : `${validation.completed}/${validation.total} required`}
                  </Button>
                  <Button
                    tokens={tokens} variant="ghost" size="sm"
                    onClick={handleSchedule}
                    icon={<Icon name="calendar" size={12} />}
                    fullWidth
                  >
                    Schedule Publish
                  </Button>
                </div>

                <Divider tokens={tokens} />

                <div className="ap-publish-meta">
                  <div className="ap-publish-meta-row">
                    <span>Status</span>
                    <Badge
                      tokens={tokens}
                      tone={form.status === 'published' ? 'success'
                        : form.status === 'scheduled' ? 'info'
                        : form.status === 'hidden' ? 'critical'
                        : 'warning'}
                      dot
                    >
                      {PUBLISH_STATUS.find(p => p.value === form.status)?.label}
                    </Badge>
                  </div>
                  <div className="ap-publish-meta-row">
                    <span>Slug</span>
                    <code className="ap-mono">/{form.slug || 'your-slug'}</code>
                  </div>
                  <div className="ap-publish-meta-row">
                    <span>Last saved</span>
                    <span>{lastSaved ? formatTimeAgo(lastSaved) : 'Never'}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .ap-root {
          overflow-x: hidden;
        }

        /* === Two-column workspace === */
        .ap-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 380px;
          gap: 24px;
          align-items: start;
        }
        .ap-left {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ap-right {
          min-width: 0;
        }
        .ap-sticky {
          position: sticky;
          top: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: calc(100vh - 32px);
          overflow-y: auto;
          padding-right: 2px;
        }
        .ap-sticky::-webkit-scrollbar { width: 6px; }
        .ap-sticky::-webkit-scrollbar-thumb {
          background: ${tokens.border.subtle};
          border-radius: 3px;
        }

        /* === Section toolbar === */
        .ap-section-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 12px;
          gap: 12px;
        }
        .ap-section-toolbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ap-section-toolbar-label {
          font-size: 12px;
          font-weight: 600;
          color: ${tokens.text.secondary};
        }
        .ap-section-toolbar-right {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
        }
        .ap-link-btn {
          background: none;
          border: none;
          padding: 4px 6px;
          font-size: 11px;
          font-weight: 600;
          color: ${tokens.text.secondary};
          cursor: pointer;
          border-radius: 5px;
          transition: all 120ms ease;
          font-family: inherit;
        }
        .ap-link-btn:hover {
          background: ${tokens.bg.hover};
          color: ${tokens.text.primary};
        }
        .ap-sep {
          color: ${tokens.text.tertiary};
        }

        /* === Field grids === */
        .ap-field-grid {
          display: grid;
          gap: 14px;
        }
        .ap-grid-1 { grid-template-columns: minmax(0, 1fr); }
        .ap-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .ap-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ap-field-span-2 { grid-column: span 2; }

        /* === Pricing preview === */
        .ap-pricing-preview {
          margin-top: 16px;
          padding: 12px 14px;
          background: ${tokens.bg.surfaceAlt};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 10px;
        }
        .ap-pricing-row {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }
        .ap-pricing-value {
          font-size: 16px;
          font-weight: 700;
          color: ${tokens.text.primary};
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.01em;
          margin-top: 2px;
        }
        .ap-muted {
          color: ${tokens.text.tertiary};
          font-weight: 600;
          font-size: 14px;
        }

        /* === Size chips preview === */
        .ap-chip-preview {
          margin-top: 14px;
          padding: 10px 12px;
          background: ${tokens.bg.surfaceAlt};
          border-radius: 8px;
        }
        .ap-chip-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 6px;
        }
        .ap-size-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          height: 26px;
          padding: 0 8px;
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: ${tokens.text.primary};
        }

        /* === Variants === */
        .ap-variant-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 12px;
        }
        .ap-variant-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          color: ${tokens.text.primary};
        }
        .ap-variant-disabled {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 24px;
          background: ${tokens.bg.surfaceAlt};
          border: 1px dashed ${tokens.border.strong};
          border-radius: 10px;
        }
        .ap-variant-disabled-title {
          font-size: 13px;
          font-weight: 700;
          color: ${tokens.text.primary};
          margin-bottom: 2px;
        }
        .ap-variant-disabled-desc {
          font-size: 11px;
          color: ${tokens.text.secondary};
          line-height: 1.5;
          max-width: 360px;
        }
        .ap-variant-table {
          border: 1px solid ${tokens.border.subtle};
          border-radius: 10px;
          overflow: hidden;
        }
        .ap-variant-row {
          display: grid;
          grid-template-columns: 80px 100px 70px 90px minmax(0, 1fr) 32px;
          gap: 0;
          align-items: center;
        }
        .ap-variant-row > div,
        .ap-variant-row > input,
        .ap-variant-row > button {
          padding: 8px 10px;
          border-bottom: 1px solid ${tokens.border.subtle};
          font-size: 11px;
        }
        .ap-variant-head > div {
          background: ${tokens.bg.surfaceAlt};
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${tokens.text.tertiary};
        }
        .ap-variant-row:last-child > * {
          border-bottom: none;
        }
        .ap-variant-input {
          border: none;
          background: transparent;
          color: ${tokens.text.primary};
          font-family: inherit;
          font-size: 12px;
          outline: none;
          width: 100%;
        }
        .ap-variant-input:focus {
          background: ${tokens.bg.hover};
        }
        .ap-variant-remove {
          border: none;
          background: transparent;
          color: ${tokens.text.tertiary};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          transition: all 120ms ease;
        }
        .ap-variant-remove:hover {
          color: ${tokens.status.error};
          background: ${tokens.status.errorBg};
        }

        /* === Attributes hint === */
        .ap-attr-hint {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          padding: 10px 12px;
          background: ${tokens.status.infoBg};
          border-radius: 8px;
          font-size: 11px;
          color: ${tokens.text.secondary};
          line-height: 1.5;
          align-items: flex-start;
        }
        .ap-attr-hint span {
          flex: 1;
        }

        /* === SERP preview === */
        .ap-serp {
          margin-top: 16px;
          padding: 14px 16px;
          background: ${tokens.bg.surfaceAlt};
          border-radius: 10px;
        }
        .ap-serp-url {
          font-size: 11px;
          color: ${tokens.text.tertiary};
          margin-top: 6px;
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
        }
        .ap-serp-title {
          font-size: 15px;
          font-weight: 600;
          color: #1a0dab;
          margin-top: 2px;
          line-height: 1.3;
        }
        .ap-serp-desc {
          font-size: 12px;
          color: #4d5156;
          margin-top: 2px;
          line-height: 1.5;
        }
        [data-admin-theme="dark"] .ap-serp-title { color: #8ab4f8; }
        [data-admin-theme="dark"] .ap-serp-desc { color: #bdc1c6; }
        [data-admin-theme="dark"] .ap-serp-url { color: #9aa0a6; }

        /* === Placement === */
        .ap-placement-groups {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ap-placement-group {
          padding: 12px 14px;
          background: ${tokens.bg.surfaceAlt};
          border-radius: 10px;
          border: 1px solid ${tokens.border.subtle};
        }
        .ap-placement-group-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 10px;
        }
        .ap-placement-group-title {
          font-size: 12px;
          font-weight: 700;
          color: ${tokens.text.primary};
        }
        .ap-placement-group-hint {
          font-size: 10px;
          color: ${tokens.text.tertiary};
          margin-top: 1px;
        }
        .ap-placement-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 6px;
        }

        /* === Publish summary === */
        .ap-publish-summary {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          padding: 10px 12px;
          background: ${tokens.status.infoBg};
          border-radius: 8px;
          font-size: 11px;
          color: ${tokens.text.secondary};
          line-height: 1.5;
          align-items: flex-start;
        }
        .ap-publish-summary strong {
          color: ${tokens.text.primary};
          font-weight: 600;
        }

        /* === Live preview card === */
        .ap-preview-card {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 14px;
          box-shadow: ${tokens.shadow.sm};
          overflow: hidden;
        }
        .ap-preview-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-bottom: 1px solid ${tokens.border.subtle};
        }
        .ap-preview-title {
          font-size: 13px;
          font-weight: 700;
          color: ${tokens.text.primary};
          margin-top: 1px;
        }
        .ap-preview-toggle {
          display: inline-flex;
          background: ${tokens.bg.surfaceAlt};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 7px;
          padding: 2px;
          gap: 2px;
        }
        .ap-preview-tab {
          border: none;
          background: transparent;
          color: ${tokens.text.secondary};
          font-size: 10px;
          font-weight: 600;
          font-family: inherit;
          padding: 4px 8px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 120ms ease;
        }
        .ap-preview-tab.active {
          background: ${tokens.bg.surface};
          color: ${tokens.text.primary};
          box-shadow: ${tokens.shadow.sm};
        }
        .ap-preview-body {
          padding: 16px;
          background: ${tokens.bg.app};
        }
        .ap-preview-mobile {
          padding: 16px 24px;
        }

        /* === Publish panel === */
        .ap-publish-panel {
          background: ${tokens.bg.surface};
          border: 1px solid ${tokens.border.subtle};
          border-radius: 14px;
          box-shadow: ${tokens.shadow.sm};
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ap-publish-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .ap-autosave {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: ${tokens.text.secondary};
          font-weight: 500;
        }
        .ap-autosave-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .ap-dot-idle { background: ${tokens.text.tertiary}; }
        .ap-dot-saving {
          background: ${tokens.status.warning};
          animation: ap-pulse 1.2s ease-in-out infinite;
        }
        .ap-dot-saved { background: ${tokens.status.success}; }
        @keyframes ap-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        /* === Validation === */
        .ap-validation {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ap-validation-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 600;
          color: ${tokens.text.secondary};
        }
        .ap-validation-pct {
          font-size: 12px;
          font-weight: 700;
          color: ${tokens.text.primary};
        }
        .ap-validation-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-height: 180px;
          overflow-y: auto;
          margin-top: 4px;
        }
        .ap-validation-list::-webkit-scrollbar { width: 4px; }
        .ap-validation-list::-webkit-scrollbar-thumb {
          background: ${tokens.border.subtle};
          border-radius: 2px;
        }
        .ap-validation-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          padding: 2px 0;
        }
        .ap-validation-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ap-validation-item.ok .ap-validation-check {
          background: ${tokens.status.successBg};
        }
        .ap-validation-item.pending .ap-validation-check {
          background: ${tokens.bg.surfaceAlt};
        }
        .ap-validation-label {
          color: ${tokens.text.secondary};
          font-weight: 500;
        }
        .ap-validation-item.ok .ap-validation-label {
          color: ${tokens.text.primary};
          text-decoration: line-through;
          text-decoration-color: ${tokens.text.tertiary};
        }

        /* === Publish actions === */
        .ap-publish-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* === Publish meta === */
        .ap-publish-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ap-publish-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: ${tokens.text.secondary};
        }
        .ap-publish-meta-row > span:first-child {
          font-weight: 500;
        }
        .ap-mono {
          font-family: ui-monospace, 'SF Mono', Menlo, monospace;
          font-size: 10px;
          color: ${tokens.text.primary};
          background: ${tokens.bg.surfaceAlt};
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* === Overline === */
        .ap-overline {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: ${tokens.text.tertiary};
          margin-bottom: 2px;
        }

        /* === Global file drag overlay === */
        .ap-global-drag-overlay {
          position: fixed;
          inset: 0;
          background: ${tokens.bg.overlay};
          backdrop-filter: blur(4px);
          z-index: 1500;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          animation: ap-fade-in 160ms ease;
        }
        @keyframes ap-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* === Responsive === */
        @media (max-width: 1280px) {
          .ap-grid {
            grid-template-columns: minmax(0, 1fr) 340px;
          }
        }
        @media (max-width: 1100px) {
          .ap-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .ap-sticky {
            position: static;
            max-height: none;
            overflow: visible;
          }
          .ap-right {
            order: 2;
          }
        }
        @media (max-width: 768px) {
          .ap-grid-2 { grid-template-columns: minmax(0, 1fr); }
          .ap-grid-3 { grid-template-columns: minmax(0, 1fr); }
          .ap-field-span-2 { grid-column: span 1; }
          .ap-pricing-row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }
          .ap-variant-row {
            grid-template-columns: 60px 80px 60px 70px minmax(0, 1fr) 28px;
          }
          .ap-variant-row > div,
          .ap-variant-row > input,
          .ap-variant-row > button {
            padding: 6px 8px;
            font-size: 10px;
          }
          .ap-placement-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (max-width: 480px) {
          .ap-preview-toggle {
            display: none;
          }
          .ap-preview-body {
            padding: 12px;
          }
        }
      `}</style>

      {/* Global drag overlay */}
      {globalDragOver && (
        <div className="ap-global-drag-overlay">
          <div style={{
            background: tokens.bg.surface,
            border: `2px dashed ${tokens.text.primary}`,
            borderRadius: 16,
            padding: '32px 48px',
            textAlign: 'center',
            boxShadow: tokens.shadow.lg,
          }}>
            <Icon name="cloudUpload" size={32} color={tokens.text.primary} />
            <div style={{
              fontSize: 16, fontWeight: 700, color: tokens.text.primary,
              marginTop: 8, fontFamily: 'Inter, sans-serif',
            }}>
              Drop images to upload
            </div>
            <div style={{
              fontSize: 12, color: tokens.text.secondary,
              marginTop: 4, fontFamily: 'Inter, sans-serif',
            }}>
              Release anywhere on this page
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

/* =========================================================== */
/* Section — collapsible card with header, completion %       */
/* =========================================================== */

function Section({
  tokens, id, number, title, subtitle, icon, accent,
  open, onToggle, completion, action, children,
}: {
  tokens: Tk;
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: 'info' | 'success' | 'warning' | 'purple' | 'neutral';
  open: boolean;
  onToggle: () => void;
  completion?: { c: number; t: number };
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const accentColor = accent === 'info' ? tokens.status.info
    : accent === 'success' ? tokens.status.success
    : accent === 'warning' ? tokens.status.warning
    : accent === 'purple' ? '#8B5CF6'
    : tokens.text.tertiary;

  const pct = completion ? Math.round((completion.c / completion.t) * 100) : 0;

  return (
    <section
      id={`section-${id}`}
      className="ap-section"
      style={{
        background: tokens.bg.surface,
        border: `1px solid ${tokens.border.subtle}`,
        borderRadius: 14,
        boxShadow: tokens.shadow.sm,
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="ap-section-head"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '14px 18px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: accentColor + '20', color: accentColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {number}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: tokens.text.primary,
              fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ display: 'inline-flex', color: tokens.text.secondary }}>{icon}</span>
              {title}
            </div>
            <div style={{
              fontSize: 11, color: tokens.text.secondary, marginTop: 1,
              fontFamily: 'Inter, sans-serif',
            }}>
              {subtitle}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {completion && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 8px',
              background: pct === 100 ? tokens.status.successBg : tokens.bg.surfaceAlt,
              color: pct === 100 ? tokens.status.success : tokens.text.secondary,
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 700,
            }}>
              {pct === 100 && <Icon name="check" size={10} />}
              {completion.c}/{completion.t}
            </span>
          )}
          {action && <div onClick={e => e.stopPropagation()}>{action}</div>}
          <svg
            width={14} height={14} viewBox="0 0 24 24" fill="none"
            stroke={tokens.text.tertiary}
            strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 180ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>
      <div
        className="ap-section-body"
        style={{
          maxHeight: open ? '9999px' : 0,
          overflow: 'hidden',
          transition: 'max-height 240ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div style={{ padding: '4px 18px 18px', borderTop: `1px solid ${tokens.border.subtle}` }}>
          {children}
        </div>
      </div>
      <style jsx>{`
        .ap-section-head:hover {
          background: ${tokens.bg.hover} !important;
        }
      `}</style>
    </section>
  );
}

/* =========================================================== */
/* PlacementToggle                                            */
/* =========================================================== */

function PlacementToggle({
  tokens, label, checked, onChange,
}: {
  tokens: Tk; label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label
      className="ap-placement-toggle"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8, padding: '8px 10px',
        background: checked ? tokens.status.successBg : tokens.bg.surface,
        border: `1px solid ${checked ? tokens.status.success + '40' : tokens.border.subtle}`,
        borderRadius: 7, cursor: 'pointer',
        transition: 'all 140ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <span style={{
        fontSize: 11, fontWeight: 600,
        color: checked ? tokens.status.success : tokens.text.primary,
        fontFamily: 'Inter, sans-serif',
      }}>{label}</span>
      <Toggle tokens={tokens} checked={checked} onChange={onChange} />
    </label>
  );
}

/* =========================================================== */
/* MediaManager                                               */
/* =========================================================== */

function MediaManager({
  tokens, images, draggedImageId, dropTargetId, globalDragOver, fileInputRef,
  onAddFiles, onRemove, onSetFeatured, onReplace, onReorder,
  onSetDragged, onSetDropTarget,
  onDragEnter, onDragLeave, onDragOver, onDrop,
}: {
  tokens: Tk;
  images: ImageItem[];
  draggedImageId: string | null;
  dropTargetId: string | null;
  globalDragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onAddFiles: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
  onSetFeatured: (id: string) => void;
  onReplace: (id: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  onSetDragged: (id: string | null) => void;
  onSetDropTarget: (id: string | null) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  const featured = images.find(i => i.isFeatured);
  const readyCount = images.filter(i => i.status === 'ready').length;
  const totalSize = images.reduce((sum, i) => sum + i.size, 0);

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{ position: 'relative' }}
    >
      {/* Upload zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${globalDragOver ? tokens.text.primary : tokens.border.strong}`,
          borderRadius: 12,
          padding: '24px 16px',
          textAlign: 'center',
          background: globalDragOver ? tokens.bg.hover : tokens.bg.surfaceAlt,
          cursor: 'pointer',
          transition: 'all 140ms cubic-bezier(0.16,1,0.3,1)',
          marginBottom: 14,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => {
            if (e.target.files) onAddFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: tokens.bg.surface, color: tokens.text.secondary,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 8,
          border: `1px solid ${tokens.border.subtle}`,
        }}>
          <Icon name="cloudUpload" size={20} />
        </div>
        <div style={{
          fontSize: 13, fontWeight: 700, color: tokens.text.primary,
          fontFamily: 'Inter, sans-serif',
        }}>
          Drop images here, or <span style={{ color: tokens.text.accent }}>browse</span>
        </div>
        <div style={{
          fontSize: 11, color: tokens.text.tertiary, marginTop: 4,
          fontFamily: 'Inter, sans-serif',
        }}>
          WebP, JPG, PNG · 1200×1200 recommended · up to 20 images
        </div>
      </div>

      {/* Stats bar */}
      {images.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '8px 12px',
          background: tokens.bg.surfaceAlt,
          borderRadius: 8,
          marginBottom: 12,
          fontSize: 11, color: tokens.text.secondary,
          fontFamily: 'Inter, sans-serif',
        }}>
          <Badge tokens={tokens} tone={readyCount === images.length ? 'success' : 'warning'}>
            {readyCount}/{images.length} ready
          </Badge>
          <span>·</span>
          <span>{formatBytes(totalSize)} total</span>
          {featured && (
            <>
              <span>·</span>
              <span>Featured: <strong style={{ color: tokens.text.primary }}>{featured.name}</strong></span>
            </>
          )}
        </div>
      )}

      {/* Image grid */}
      {images.length === 0 ? (
        <div style={{
          padding: '32px 16px',
          textAlign: 'center',
          color: tokens.text.tertiary,
          fontSize: 12,
          fontFamily: 'Inter, sans-serif',
        }}>
          No images yet. Drop files above to get started.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 10,
        }}>
          {images.map(img => (
            <ImageTile
              key={img.id}
              tokens={tokens}
              image={img}
              isDragged={draggedImageId === img.id}
              isDropTarget={dropTargetId === img.id}
              onSetFeatured={() => onSetFeatured(img.id)}
              onRemove={() => onRemove(img.id)}
              onReplace={() => onReplace(img.id)}
              onDragStart={() => onSetDragged(img.id)}
              onDragEnter={() => onSetDropTarget(img.id)}
              onDragEnd={() => {
                if (draggedImageId && dropTargetId) {
                  onReorder(draggedImageId, dropTargetId);
                }
                onSetDragged(null);
                onSetDropTarget(null);
              }}
            />
          ))}
        </div>
      )}

      {/* Auto-optimization toggles (preserved from previous version) */}
      <div style={{ marginTop: 16 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
          textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
        }}>
          Auto-optimization
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <AutoOptToggle tokens={tokens} label="Convert to WebP" desc="Auto-convert JPG/PNG to WebP format" defaultChecked />
          <AutoOptToggle tokens={tokens} label="Generate AVIF" desc="Create AVIF version for modern browsers" defaultChecked />
          <AutoOptToggle tokens={tokens} label="Auto-watermark" desc="Apply LNKICKS watermark to all images" defaultChecked />
          <AutoOptToggle tokens={tokens} label="AI rename files" desc="SEO-friendly filenames (e.g. lnkicks-air-jordan-1-front.webp)" defaultChecked />
        </div>
      </div>
    </div>
  );
}

function AutoOptToggle({
  tokens, label, desc, defaultChecked,
}: {
  tokens: Tk; label: string; desc: string; defaultChecked: boolean;
}) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 10px', borderRadius: 8,
      background: on ? tokens.status.successBg : tokens.bg.surfaceAlt,
      border: `1px solid ${on ? tokens.status.success + '30' : tokens.border.subtle}`,
      cursor: 'pointer',
      transition: 'all 140ms ease',
    }}>
      <div>
        <div style={{
          fontSize: 12, fontWeight: 600,
          color: on ? tokens.status.success : tokens.text.primary,
        }}>{label}</div>
        <div style={{
          fontSize: 10, color: tokens.text.secondary, marginTop: 1,
        }}>{desc}</div>
      </div>
      <Toggle tokens={tokens} checked={on} onChange={setOn} />
    </label>
  );
}

function ImageTile({
  tokens, image, isDragged, isDropTarget,
  onSetFeatured, onRemove, onReplace,
  onDragStart, onDragEnter, onDragEnd,
}: {
  tokens: Tk;
  image: ImageItem;
  isDragged: boolean;
  isDropTarget: boolean;
  onSetFeatured: () => void;
  onRemove: () => void;
  onReplace: () => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      style={{
        position: 'relative',
        aspectRatio: '1',
        borderRadius: 10,
        overflow: 'hidden',
        border: `2px solid ${
          image.isFeatured ? tokens.status.success
          : isDropTarget ? tokens.text.primary
          : tokens.border.subtle
        }`,
        background: tokens.bg.surfaceAlt,
        opacity: isDragged ? 0.4 : 1,
        cursor: 'grab',
        transition: 'all 140ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.alt}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: image.status === 'uploading' ? 'blur(2px) brightness(0.85)' : 'none',
        }}
      />

      {/* Featured badge */}
      {image.isFeatured && (
        <div style={{
          position: 'absolute', top: 6, left: 6,
          background: tokens.status.success,
          color: '#fff',
          fontSize: 9, fontWeight: 700,
          padding: '2px 6px',
          borderRadius: 4,
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          <Icon name="star" size={9} /> Featured
        </div>
      )}

      {/* Drag handle */}
      <div
        style={{
          position: 'absolute', top: 6, right: 6,
          background: tokens.bg.overlay,
          color: '#fff',
          width: 22, height: 22,
          borderRadius: 5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'grab',
        }}
      >
        <Icon name="moreVertical" size={12} color="#fff" />
      </div>

      {/* Progress bar */}
      {image.status === 'uploading' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 4,
        }}>
          <div style={{
            width: '70%', height: 4,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              width: `${image.progress}%`,
              height: '100%',
              background: '#fff',
              borderRadius: 2,
              transition: 'width 200ms ease',
            }} />
          </div>
          <div style={{ color: '#fff', fontSize: 10, fontWeight: 600 }}>
            {Math.round(image.progress)}%
          </div>
        </div>
      )}

      {/* Hover actions */}
      {image.status === 'ready' && (
        <div
          className="ap-tile-actions"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '6px 8px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))',
            display: 'flex', gap: 4, justifyContent: 'flex-end',
            opacity: 0,
            transition: 'opacity 140ms ease',
          }}
        >
          {!image.isFeatured && (
            <button
              onClick={(e) => { e.stopPropagation(); onSetFeatured(); }}
              title="Set as featured"
              aria-label="Set as featured"
              style={tileBtnStyle}
            >
              <Icon name="star" size={11} color="#fff" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onReplace(); }}
            title="Replace"
            aria-label="Replace image"
            style={tileBtnStyle}
          >
            <Icon name="refresh" size={11} color="#fff" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            title="Remove"
            aria-label="Remove image"
            style={tileBtnStyle}
          >
            <Icon name="trash" size={11} color="#fff" />
          </button>
        </div>
      )}

      <style jsx>{`
        .ap-tile-actions { opacity: 0; }
        div:hover .ap-tile-actions { opacity: 1; }
      `}</style>
    </div>
  );
}

const tileBtnStyle: React.CSSProperties = {
  border: 'none',
  background: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(4px)',
  color: '#fff',
  width: 22, height: 22,
  borderRadius: 5,
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 120ms ease',
};

/* =========================================================== */
/* Storefront preview                                         */
/* =========================================================== */

function StorefrontPreview({
  tokens, preview, fmtINR,
}: {
  tokens: Tk;
  preview: PreviewData;
  fmtINR: (n: number) => string;
}) {
  return (
    <div style={{
      background: tokens.bg.surface,
      borderRadius: 10,
      overflow: 'hidden',
      border: `1px solid ${tokens.border.subtle}`,
    }}>
      {/* Image area */}
      <div style={{
        aspectRatio: '4/3',
        background: tokens.bg.surfaceAlt,
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {preview.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview.featuredImage.url} alt={preview.featuredImage.alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', color: tokens.text.tertiary }}>
            <Icon name="image" size={28} color={tokens.text.tertiary} />
            <div style={{ fontSize: 10, marginTop: 4 }}>No image</div>
          </div>
        )}

        {/* Discount badge */}
        {preview.discountPct > 0 && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            background: tokens.status.error, color: '#fff',
            padding: '3px 8px', borderRadius: 4,
            fontSize: 10, fontWeight: 700,
          }}>
            -{preview.discountPct}%
          </div>
        )}

        {/* Badges */}
        {preview.badges.length > 0 && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: '60%',
            justifyContent: 'flex-end',
          }}>
            {preview.badges.slice(0, 2).map(b => (
              <span key={b} style={{
                background: 'rgba(255,255,255,0.95)',
                color: tokens.text.primary,
                padding: '2px 6px', borderRadius: 4,
                fontSize: 9, fontWeight: 600,
              }}>{b}</span>
            ))}
          </div>
        )}

        {/* Gallery thumbnails */}
        {preview.gallery.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 8, left: 8,
            display: 'flex', gap: 4,
          }}>
            {preview.gallery.slice(0, 4).map((g) => (
              <div key={g.id} style={{
                width: 24, height: 24, borderRadius: 4,
                overflow: 'hidden',
                border: `1.5px solid ${g.isFeatured ? tokens.text.primary : 'rgba(255,255,255,0.5)'}`,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.url} alt={g.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
          textTransform: 'uppercase', letterSpacing: 0.8,
        }}>
          {preview.brand} · {preview.category}
        </div>
        <div style={{
          fontSize: 14, fontWeight: 700, color: tokens.text.primary,
          marginTop: 2, lineHeight: 1.3,
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {preview.name}
        </div>
        <div style={{
          fontSize: 11, color: tokens.text.secondary, marginTop: 4,
          lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {preview.shortDesc}
        </div>

        {/* Sizes */}
        {preview.sizes.length > 0 && (
          <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
            {preview.sizes.slice(0, 6).map((s, i) => (
              <span key={i} style={{
                padding: '2px 6px',
                background: tokens.bg.surfaceAlt,
                border: `1px solid ${tokens.border.subtle}`,
                borderRadius: 4,
                fontSize: 9, fontWeight: 600, color: tokens.text.primary,
              }}>{s}</span>
            ))}
          </div>
        )}

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
          <span style={{
            fontSize: 18, fontWeight: 800, color: tokens.text.primary,
            fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em',
          }}>
            {fmtINR(preview.finalPrice)}
          </span>
          {preview.compareAt > preview.finalPrice && preview.compareAt > 0 && (
            <span style={{
              fontSize: 12, color: tokens.text.tertiary,
              textDecoration: 'line-through',
            }}>
              {fmtINR(preview.compareAt)}
            </span>
          )}
        </div>

        {/* Stock + delivery */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
          padding: '6px 8px',
          background: tokens.bg.surfaceAlt, borderRadius: 6,
          fontSize: 10, color: tokens.text.secondary,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: preview.stockStatus === 'in' ? tokens.status.success
              : preview.stockStatus === 'low' ? tokens.status.warning
              : tokens.status.error,
            fontWeight: 700,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: preview.stockStatus === 'in' ? tokens.status.success
                : preview.stockStatus === 'low' ? tokens.status.warning
                : tokens.status.error,
            }} />
            {preview.stockStatus === 'in' ? 'In stock'
              : preview.stockStatus === 'low' ? `Low stock (${preview.stock})`
              : 'Out of stock'}
          </span>
          <span style={{ color: tokens.text.tertiary }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Icon name="truck" size={10} color={tokens.text.tertiary} />
            Free delivery
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================== */
/* Card preview (grid card as it appears in collections)      */
/* =========================================================== */

function CardPreview({
  tokens, preview, fmtINR,
}: {
  tokens: Tk;
  preview: PreviewData;
  fmtINR: (n: number) => string;
}) {
  return (
    <div style={{
      background: tokens.bg.surface,
      borderRadius: 12,
      overflow: 'hidden',
      border: `1px solid ${tokens.border.subtle}`,
      boxShadow: tokens.shadow.sm,
    }}>
      <div style={{
        aspectRatio: '1',
        background: tokens.bg.surfaceAlt,
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {preview.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview.featuredImage.url} alt={preview.featuredImage.alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Icon name="image" size={28} color={tokens.text.tertiary} />
        )}
        {preview.discountPct > 0 && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            background: tokens.status.error, color: '#fff',
            padding: '2px 6px', borderRadius: 4,
            fontSize: 9, fontWeight: 700,
          }}>
            -{preview.discountPct}%
          </div>
        )}
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div style={{
          fontSize: 9, fontWeight: 700, color: tokens.text.tertiary,
          textTransform: 'uppercase', letterSpacing: 0.8,
        }}>{preview.brand}</div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: tokens.text.primary,
          marginTop: 2, lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{preview.name}</div>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6,
        }}>
          <span style={{
            fontSize: 14, fontWeight: 800, color: tokens.text.primary,
          }}>{fmtINR(preview.finalPrice)}</span>
          {preview.compareAt > preview.finalPrice && preview.compareAt > 0 && (
            <span style={{
              fontSize: 10, color: tokens.text.tertiary,
              textDecoration: 'line-through',
            }}>{fmtINR(preview.compareAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================== */
/* Mobile preview                                             */
/* =========================================================== */

function MobilePreview({
  tokens, preview, fmtINR,
}: {
  tokens: Tk;
  preview: PreviewData;
  fmtINR: (n: number) => string;
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        width: 220,
        background: tokens.bg.surface,
        borderRadius: 18,
        border: `1px solid ${tokens.border.subtle}`,
        boxShadow: tokens.shadow.md,
        overflow: 'hidden',
      }}>
        {/* Status bar */}
        <div style={{
          padding: '4px 12px',
          background: tokens.bg.surfaceAlt,
          fontSize: 8, color: tokens.text.tertiary,
          textAlign: 'center', fontWeight: 600,
        }}>9:41 · lnkicks.com</div>
        {/* Image */}
        <div style={{
          aspectRatio: '1',
          background: tokens.bg.surfaceAlt,
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {preview.featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.featuredImage.url} alt={preview.featuredImage.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Icon name="image" size={24} color={tokens.text.tertiary} />
          )}
          {preview.discountPct > 0 && (
            <div style={{
              position: 'absolute', top: 6, left: 6,
              background: tokens.status.error, color: '#fff',
              padding: '2px 5px', borderRadius: 3,
              fontSize: 8, fontWeight: 700,
            }}>-{preview.discountPct}%</div>
          )}
        </div>
        {/* Body */}
        <div style={{ padding: '8px 10px' }}>
          <div style={{
            fontSize: 7, fontWeight: 700, color: tokens.text.tertiary,
            textTransform: 'uppercase', letterSpacing: 0.6,
          }}>{preview.brand}</div>
          <div style={{
            fontSize: 11, fontWeight: 600, color: tokens.text.primary,
            marginTop: 1, lineHeight: 1.3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{preview.name}</div>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4,
          }}>
            <span style={{
              fontSize: 12, fontWeight: 800, color: tokens.text.primary,
            }}>{fmtINR(preview.finalPrice)}</span>
            {preview.compareAt > preview.finalPrice && preview.compareAt > 0 && (
              <span style={{
                fontSize: 9, color: tokens.text.tertiary,
                textDecoration: 'line-through',
              }}>{fmtINR(preview.compareAt)}</span>
            )}
          </div>
          {/* CTA */}
          <div style={{
            marginTop: 6,
            padding: '5px 0',
            background: tokens.text.primary,
            color: tokens.bg.app,
            borderRadius: 6,
            textAlign: 'center',
            fontSize: 9, fontWeight: 700,
          }}>Add to Cart</div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================== */
/* Helpers                                                    */
/* =========================================================== */

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 5_000) return 'just now';
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
