/**
 * LNKICKS Enterprise Admin — Products Management
 * ------------------------------------------------------------
 * Premium catalog management with:
 *  - Enterprise DataTable (sortable columns, pagination, row selection)
 *  - Bulk actions (Edit, Archive, Delete, Export selected)
 *  - Advanced filters (search, brand, category, status)
 *  - Quick edit drawer
 *  - Status badges (In Stock / Low Stock / Out of Stock)
 *  - Stock indicator with progress
 *  - Image preview thumbnails
 *  - Import / Export CSV
 *  - Duplicate / Archive / Delete row actions
 *  - Empty state, loading skeleton
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import { PageHeader } from '@/components/admin/PageHeader';
import { EnterpriseDataTable, type Column } from '@/components/admin/EnterpriseDataTable';
import {
  Button, Badge, StatusPill, Input, Select, SearchInput, Drawer, Modal,
  Dropdown, MenuItem, MenuDivider, Tabs, useToast, Toggle,
  IconButton,
} from '@/components/admin/ui';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';
import type { Product } from '@/types';
import { PlusIcon, SearchIcon } from '@/components/admin/ui';

interface AdminProduct extends Product {
  stock: number;
  stockThreshold: number;
  status: 'Published' | 'Draft' | 'Archived';
  views: number;
  sales: number;
}

// Extend products with admin-only fields
function withAdminMeta(p: Product, idx: number): AdminProduct {
  const seedStock = [42, 0, 18, 6, 23, 0, 15, 31, 9, 4][idx % 10];
  return {
    ...p,
    stock: seedStock,
    stockThreshold: 5,
    status: idx % 7 === 0 ? 'Draft' : idx % 11 === 0 ? 'Archived' : 'Published',
    views: 1000 + (idx * 137) % 9000,
    sales: (idx * 23) % 320,
  };
}

const ALL_PRODUCTS: AdminProduct[] = PRODUCT_REGISTRY.map(withAdminMeta);

const BRANDS = ['All', ...Array.from(new Set(ALL_PRODUCTS.map(p => p.brand)))];
const CATEGORIES = ['All', ...Array.from(new Set(ALL_PRODUCTS.map(p => p.category)))];
const STATUSES = ['All', 'Published', 'Draft', 'Archived'];

export default function ProductsManagementPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();
  const [products, setProducts] = useState<AdminProduct[]>(ALL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusTab, setStatusTab] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [quickEdit, setQuickEdit] = useState<AdminProduct | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [duplicateTarget, setDuplicateTarget] = useState<AdminProduct | null>(null);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
      if (brand !== 'All' && p.brand !== brand) return false;
      if (category !== 'All' && p.category !== category) return false;
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      if (statusTab === 'low' && p.stock >= p.stockThreshold) return false;
      if (statusTab === 'out' && p.stock > 0) return false;
      return true;
    });
  }, [products, search, brand, category, statusFilter, statusTab]);

  const counts = useMemo(() => ({
    all: products.length,
    low: products.filter(p => p.stock > 0 && p.stock <= p.stockThreshold).length,
    out: products.filter(p => p.stock === 0).length,
  }), [products]);

  function handleBulkDelete() {
    setProducts(prev => prev.filter(p => !selected.includes(p.id)));
    pushToast({ tone: 'success', title: `${selected.length} products deleted`, message: 'Products moved to trash.' });
    setSelected([]);
  }

  function handleBulkArchive() {
    setProducts(prev => prev.map(p => selected.includes(p.id) ? { ...p, status: 'Archived' } : p));
    pushToast({ tone: 'info', title: `${selected.length} products archived` });
    setSelected([]);
  }

  function handleBulkPublish() {
    setProducts(prev => prev.map(p => selected.includes(p.id) ? { ...p, status: 'Published' } : p));
    pushToast({ tone: 'success', title: `${selected.length} products published` });
    setSelected([]);
  }

  function handleDelete(p: AdminProduct) {
    setProducts(prev => prev.filter(x => x.id !== p.id));
    pushToast({ tone: 'success', title: 'Product deleted', message: p.name });
    setDeleteTarget(null);
  }

  function handleDuplicate(p: AdminProduct) {
    const copy: AdminProduct = {
      ...p,
      id: `${p.id}-copy-${Date.now()}`,
      sku: `${p.sku}-COPY`,
      slug: `${p.slug}-copy`,
      name: `${p.name} (Copy)`,
      status: 'Draft',
      sales: 0,
      views: 0,
    };
    setProducts(prev => [copy, ...prev]);
    pushToast({ tone: 'success', title: 'Product duplicated', message: 'Created draft copy.' });
    setDuplicateTarget(null);
  }

  function handleSaveQuickEdit() {
    if (!quickEdit) return;
    setProducts(prev => prev.map(p => p.id === quickEdit.id ? quickEdit : p));
    pushToast({ tone: 'success', title: 'Product updated', message: quickEdit.name });
    setQuickEdit(null);
  }

  function handleExport() {
    pushToast({ tone: 'success', title: 'Export started', message: `${filtered.length} products exporting to CSV.` });
  }

  const columns: Column<AdminProduct>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      sortValue: (p) => p.name,
      render: (p) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: tokens.bg.surfaceAlt, flexShrink: 0,
            backgroundImage: `url(${p.primaryImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            border: `1px solid ${tokens.border.subtle}`,
          }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: tokens.text.primary, fontSize: 12.5, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {p.name}
            </div>
            <div style={{ fontSize: 10, color: tokens.text.tertiary, marginTop: 1, fontFamily: 'ui-monospace, monospace' }}>
              {p.sku}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'brand',
      header: 'Brand',
      sortable: true,
      sortValue: (p) => p.brand,
      render: (p) => <Badge tokens={tokens} tone="neutral" size="sm">{p.brand}</Badge>,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      sortValue: (p) => p.category,
      render: (p) => <span style={{ color: tokens.text.secondary }}>{p.category}</span>,
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      sortable: true,
      sortValue: (p) => p.price,
      render: (p) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontWeight: 700, color: tokens.text.primary }}>₹{p.price.toLocaleString('en-IN')}</span>
          {p.comparePrice && (
            <span style={{ fontSize: 10, color: tokens.text.tertiary, textDecoration: 'line-through' }}>
              ₹{p.comparePrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      align: 'right',
      sortable: true,
      sortValue: (p) => p.stock,
      render: (p) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, minWidth: 80 }}>
          <span style={{ fontWeight: 700, color: p.stock === 0 ? tokens.status.error : p.stock <= p.stockThreshold ? tokens.status.warning : tokens.text.primary }}>
            {p.stock}
          </span>
          <div style={{ width: 60, height: 4, borderRadius: 2, background: tokens.bg.surfaceAlt, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (p.stock / 50) * 100)}%`,
              height: '100%',
              background: p.stock === 0 ? tokens.status.error : p.stock <= p.stockThreshold ? tokens.status.warning : tokens.status.success,
              borderRadius: 2,
            }} />
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      sortValue: (p) => p.status,
      render: (p) => <StatusPill tokens={tokens} status={p.stock === 0 ? 'Out of Stock' : p.stock <= p.stockThreshold ? 'Low Stock' : p.status} />,
    },
    {
      key: 'sales',
      header: 'Sales',
      align: 'right',
      sortable: true,
      sortValue: (p) => p.sales,
      render: (p) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontWeight: 600, color: tokens.text.primary }}>{p.sales}</span>
          <span style={{ fontSize: 10, color: tokens.text.tertiary }}>{p.views.toLocaleString('en-IN')} views</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      sortable: false,
      render: (p) => (
        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Dropdown
            tokens={tokens}
            align="right"
            width={180}
            trigger={
              <IconButton
                tokens={tokens}
                icon={<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>}
                label="More actions"
                size={28}
              />
            }
          >
            <MenuItem tokens={tokens} icon={<EditIcon color={tokens.text.secondary} />} onClick={() => setQuickEdit(p)}>
              Quick Edit
            </MenuItem>
            <Link href="/edit-product" style={{ textDecoration: 'none' }}>
              <MenuItem tokens={tokens} icon={<EditIcon color={tokens.text.secondary} />}>Full Edit</MenuItem>
            </Link>
            <MenuItem tokens={tokens} icon={<CopyIcon color={tokens.text.secondary} />} onClick={() => setDuplicateTarget(p)}>
              Duplicate
            </MenuItem>
            <MenuItem tokens={tokens} icon={<EyeIcon color={tokens.text.secondary} />}>View Live</MenuItem>
            <MenuDivider tokens={tokens} />
            <MenuItem tokens={tokens} icon={<TrashIcon color={tokens.status.error} />} danger onClick={() => setDeleteTarget(p)}>
              Delete
            </MenuItem>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Products"
      subtitle="Catalog management"
      requirePermission="product.edit"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Catalog' }, { label: 'Products' }]}
    >
      <PageHeader
        tokens={tokens}
        title="Product Inventory"
        subtitle="Manage 50,000+ sneaker SKUs — pricing, stock, status, and visibility across the marketplace."
        breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Catalog' }, { label: 'Products' }]}
        meta={<Badge tokens={tokens} tone="info">{products.length} products</Badge>}
        actions={
          <>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => setImportOpen(true)}
              icon={<UploadIcon color={tokens.text.secondary} />}
            >Import</Button>
            <Button tokens={tokens} variant="outline" size="md" onClick={handleExport}
              icon={<DownloadIcon color={tokens.text.secondary} />}
            >Export</Button>
            <Link href="/add-product">
              <Button tokens={tokens} variant="primary" size="md"
                icon={<PlusIcon size={14} color={tokens.bg.app} />}
              >Add Product</Button>
            </Link>
          </>
        }
      />

      {/* STATUS TABS + FILTERS */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <Tabs
          tokens={tokens}
          tabs={[
            { key: 'all', label: 'All', badge: counts.all },
            { key: 'low', label: 'Low Stock', badge: counts.low },
            { key: 'out', label: 'Out of Stock', badge: counts.out },
          ]}
          active={statusTab}
          onChange={setStatusTab}
        />
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ width: 200 }}>
            <SearchInput tokens={tokens} value={search} onChange={setSearch} placeholder="Search name or SKU…" />
          </div>
          <Select
            tokens={tokens}
            value={brand}
            onChange={e => setBrand(e.target.value)}
            options={BRANDS.map(b => ({ value: b, label: b === 'All' ? 'All Brands' : b }))}
            style={{ height: 34, width: 130 }}
          />
          <Select
            tokens={tokens}
            value={category}
            onChange={e => setCategory(e.target.value)}
            options={CATEGORIES.map(c => ({ value: c, label: c === 'All' ? 'All Categories' : c }))}
            style={{ height: 34, width: 150 }}
          />
          <Select
            tokens={tokens}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={STATUSES.map(s => ({ value: s, label: s === 'All' ? 'All Status' : s }))}
            style={{ height: 34, width: 130 }}
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <EnterpriseDataTable<AdminProduct>
        tokens={tokens}
        columns={columns}
        rows={filtered}
        getRowId={p => p.id}
        selectable
        onSelectionChange={setSelected}
        pageSize={10}
        bulkActions={(ids) => (
          <>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={handleBulkPublish}>Publish</Button>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={handleBulkArchive}>Archive</Button>
            <Button tokens={tokens} variant="ghost" size="sm" onClick={handleExport}>Export</Button>
            <Button tokens={tokens} variant="danger" size="sm" onClick={handleBulkDelete}>Delete ({ids.length})</Button>
          </>
        )}
        emptyTitle="No products found"
        emptyDescription="Try adjusting filters or add a new product to your catalog."
        emptyAction={<Link href="/add-product"><Button tokens={tokens} variant="primary" size="sm" icon={<PlusIcon size={12} color={tokens.bg.app} />}>Add Product</Button></Link>}
        emptyIcon={<SearchIcon size={20} color={tokens.text.tertiary} />}
      />

      {/* QUICK EDIT DRAWER */}
      <Drawer
        tokens={tokens}
        open={Boolean(quickEdit)}
        onClose={() => setQuickEdit(null)}
        title="Quick Edit"
        subtitle={quickEdit?.name}
        width={480}
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => setQuickEdit(null)}>Cancel</Button>
            <Button tokens={tokens} variant="primary" onClick={handleSaveQuickEdit}>Save Changes</Button>
          </>
        }
      >
        {quickEdit && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input tokens={tokens} label="Product Name" value={quickEdit.name}
              onChange={e => setQuickEdit({ ...quickEdit, name: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Input tokens={tokens} label="SKU" value={quickEdit.sku}
                onChange={e => setQuickEdit({ ...quickEdit, sku: e.target.value })} />
              <Input tokens={tokens} label="Brand" value={quickEdit.brand}
                onChange={e => setQuickEdit({ ...quickEdit, brand: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Input tokens={tokens} label="Price (₹)" type="number" value={String(quickEdit.price)}
                onChange={e => setQuickEdit({ ...quickEdit, price: Number(e.target.value) })} />
              <Input tokens={tokens} label="Compare Price (₹)" type="number" value={String(quickEdit.comparePrice ?? '')}
                onChange={e => setQuickEdit({ ...quickEdit, comparePrice: Number(e.target.value) })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Input tokens={tokens} label="Stock" type="number" value={String(quickEdit.stock)}
                onChange={e => setQuickEdit({ ...quickEdit, stock: Number(e.target.value) })} />
              <Input tokens={tokens} label="Low Stock Threshold" type="number" value={String(quickEdit.stockThreshold)}
                onChange={e => setQuickEdit({ ...quickEdit, stockThreshold: Number(e.target.value) })} />
            </div>
            <Select tokens={tokens} label="Status" value={quickEdit.status}
              onChange={e => setQuickEdit({ ...quickEdit, status: e.target.value as AdminProduct['status'] })}
              options={[
                { value: 'Published', label: 'Published' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Archived', label: 'Archived' },
              ]} />
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt, marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>Featured on Homepage</span>
                <Toggle tokens={tokens} checked={Boolean(quickEdit.featured)} onChange={(v) => setQuickEdit({ ...quickEdit, featured: v })} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt, marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>Mark as New Arrival</span>
                <Toggle tokens={tokens} checked={Boolean(quickEdit.newArrival)} onChange={(v) => setQuickEdit({ ...quickEdit, newArrival: v })} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: tokens.bg.surfaceAlt }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary }}>Mark as Best Seller</span>
                <Toggle tokens={tokens} checked={Boolean(quickEdit.bestSeller)} onChange={(v) => setQuickEdit({ ...quickEdit, bestSeller: v })} />
              </label>
            </div>
          </div>
        )}
      </Drawer>

      {/* IMPORT MODAL */}
      <Modal
        tokens={tokens}
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import Products"
        subtitle="Upload a CSV file with product data"
        footer={
          <>
            <Button tokens={tokens} variant="ghost" onClick={() => setImportOpen(false)}>Cancel</Button>
            <Button tokens={tokens} variant="primary" onClick={() => {
              pushToast({ tone: 'success', title: 'Import started', message: 'We will process your CSV and notify you.' });
              setImportOpen(false);
            }}>Upload & Import</Button>
          </>
        }
      >
        <div style={{
          border: `2px dashed ${tokens.border.strong}`,
          borderRadius: 12, padding: 32, textAlign: 'center',
          background: tokens.bg.surfaceAlt, marginBottom: 12,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: tokens.text.primary, marginBottom: 4 }}>
            Drop your CSV here, or click to browse
          </div>
          <div style={{ fontSize: 11, color: tokens.text.tertiary }}>
            Max 10MB · CSV, XLSX supported
          </div>
        </div>
        <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.6 }}>
          <strong style={{ color: tokens.text.primary }}>Required columns:</strong> name, sku, brand, category, price, stock.
          Optional: comparePrice, colors, sizes, images, status.
        </div>
      </Modal>

      {/* DELETE CONFIRM */}
      {deleteTarget && (
        <Modal
          tokens={tokens}
          open
          onClose={() => setDeleteTarget(null)}
          title="Delete Product?"
          size="sm"
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button tokens={tokens} variant="danger" onClick={() => deleteTarget && handleDelete(deleteTarget)}>Delete Permanently</Button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 13, color: tokens.text.secondary, lineHeight: 1.6 }}>
            Are you sure you want to delete <strong style={{ color: tokens.text.primary }}>{deleteTarget.name}</strong>?
            This action cannot be undone. The product will be moved to trash and permanently removed after 30 days.
          </p>
        </Modal>
      )}

      {/* DUPLICATE CONFIRM */}
      {duplicateTarget && (
        <Modal
          tokens={tokens}
          open
          onClose={() => setDuplicateTarget(null)}
          title="Duplicate Product?"
          size="sm"
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setDuplicateTarget(null)}>Cancel</Button>
              <Button tokens={tokens} variant="primary" onClick={() => duplicateTarget && handleDuplicate(duplicateTarget)}>Create Copy</Button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 13, color: tokens.text.secondary, lineHeight: 1.6 }}>
            Create a draft copy of <strong style={{ color: tokens.text.primary }}>{duplicateTarget.name}</strong>?
            The copy will be saved as a Draft with a new SKU suffix <code style={{ background: tokens.bg.surfaceAlt, padding: '1px 4px', borderRadius: 4, fontFamily: 'monospace' }}>-COPY</code>.
          </p>
        </Modal>
      )}
    </AdminLayout>
  );
}

/* Icons */
function EditIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4z" /></svg>;
}
function CopyIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>;
}
function EyeIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function TrashIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" /></svg>;
}
function UploadIcon({ color }: { color: string }) {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>;
}
function DownloadIcon({ color }: { color: string }) {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>;
}
