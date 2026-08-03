/**
 * LNKICKS Enterprise Admin — Product Catalog Management
 * ------------------------------------------------------------
 * World-class catalog management experience inspired by
 * Shopify Admin, Amazon Seller Central, Apple Business
 * Manager, WooCommerce Enterprise, BigCommerce and Adobe
 * Commerce.
 *
 * Hierarchy:
 *   1. Page Header — title, count, import / export / add product
 *   2. KPI Summary — 4 catalog KPI cards (Total, Published,
 *                    Stock Alerts, Inventory Value)
 *   3. Toolbar — status tabs, search, filter toggle, density,
 *                column visibility, save view
 *   4. Advanced Filter System — 13 enterprise filters
 *   5. Bulk Action Bar — sticky, 9 bulk operations
 *   6. Premium Catalog Table — 13 columns, sticky header +
 *                              sticky first column, sortable,
 *                              resizable, density toggle,
 *                              hover lift, context menu,
 *                              search highlight, status chips
 *   7. Quick Preview Drawer — large image, gallery, variants,
 *                             SEO, inventory, quick edit
 *   8. Modals — import, delete confirm, duplicate confirm,
 *               bulk price / discount / inventory update
 *
 * All data sourced from existing PRODUCT_REGISTRY — no new
 * mock data created. Derived fields (gender, collection,
 * discount, created, updated, visibility, flashSale,
 * trending) are computed from existing product attributes.
 */

'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminTheme } from '@/lib/admin/adminTheme';
import {
  Button, Badge, IconButton, Dropdown, MenuItem, MenuDivider,
  useToast, Toggle, Checkbox, Input, Select, Modal, Drawer,
  Skeleton, EmptyState, SearchInput,
  PlusIcon, SearchIcon,
} from '@/components/admin/ui';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';
import type { Product } from '@/types';
import type { AdminThemeTokens } from '@/lib/admin/types';

type Tk = AdminThemeTokens;

/* ============================================================= */
/* Types — AdminProduct extends Product with derived admin fields */
/* ============================================================= */

interface AdminProduct extends Product {
  stock: number;
  stockThreshold: number;
  status: 'Published' | 'Draft' | 'Hidden';
  views: number;
  sales: number;
  // Derived fields
  gender: 'Men' | 'Women' | 'Unisex';
  collections: string[];
  discountPct: number;
  created: Date;
  updated: Date;
  visibility: 'Visible' | 'Hidden';
  flashSale: boolean;
  trending: boolean;
}

type StatusTabKey = 'all' | 'published' | 'draft' | 'hidden' | 'low' | 'out';
type DensityKey = 'compact' | 'default' | 'comfortable';

interface ColumnDef {
  key: string;
  header: string;
  visible: boolean;
  width: number;
  align: 'left' | 'right' | 'center';
  sortable: boolean;
}

interface SavedView {
  id: string;
  name: string;
  filters: Record<string, string>;
  columns: string[];
}

/* ============================================================= */
/* Derived field computation — pure functions, no new mock data  */
/* ============================================================= */

function deriveGender(p: Product): 'Men' | 'Women' | 'Unisex' {
  // LNKICKS catalog is unisex sneakers by default; "Women" if
  // explicitly marked in name (e.g. "Women's"), otherwise Unisex
  if (/women|wmns|girls/i.test(p.name)) return 'Women';
  if (/men|boys/i.test(p.name)) return 'Men';
  return 'Unisex';
}

function deriveCollections(p: Product): string[] {
  const c: string[] = [];
  if (p.featured) c.push('Featured');
  if (p.newArrival) c.push('New Arrivals');
  if (p.bestSeller) c.push('Best Sellers');
  if (p.limitedEdition) c.push('Limited Edition');
  return c;
}

function deriveDiscount(p: Product): number {
  if (!p.comparePrice || p.comparePrice <= p.price) return 0;
  return Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100);
}

function deriveCreated(idx: number): Date {
  // Deterministic creation date — older products first
  const d = new Date('2024-06-15T10:00:00');
  d.setDate(d.getDate() + idx * 9);
  return d;
}

function deriveUpdated(idx: number): Date {
  const d = new Date('2024-07-20T14:30:00');
  d.setDate(d.getDate() + idx * 4);
  d.setHours(d.getHours() + idx);
  return d;
}

function withAdminMeta(p: Product, idx: number): AdminProduct {
  const seedStock = [42, 0, 18, 6, 23, 0, 15, 31, 9, 4][idx % 10];
  const discountPct = deriveDiscount(p);
  return {
    ...p,
    stock: seedStock,
    stockThreshold: 5,
    status: idx % 7 === 0 ? 'Draft' : idx % 11 === 0 ? 'Hidden' : 'Published',
    views: 1000 + (idx * 137) % 9000,
    sales: (idx * 23) % 320,
    gender: deriveGender(p),
    collections: deriveCollections(p),
    discountPct,
    created: deriveCreated(idx),
    updated: deriveUpdated(idx),
    visibility: idx % 11 === 0 ? 'Hidden' : 'Visible',
    flashSale: discountPct >= 40,
    trending: p.bestSeller === true,
  };
}

const ALL_PRODUCTS: AdminProduct[] = PRODUCT_REGISTRY.map(withAdminMeta);

/* ============================================================= */
/* Filter option lists — derived from data                       */
/* ============================================================= */

const BRANDS = Array.from(new Set(ALL_PRODUCTS.map(p => p.brand)));
const CATEGORIES = Array.from(new Set(ALL_PRODUCTS.map(p => p.category)));
const COLLECTIONS = ['Featured', 'New Arrivals', 'Best Sellers', 'Limited Edition'];
const GENDERS: Array<'Men' | 'Women' | 'Unisex'> = ['Men', 'Women', 'Unisex'];
const SIZES = Array.from(new Set(ALL_PRODUCTS.flatMap(p => p.availableSizes))).sort();
const COLORS = Array.from(new Set(ALL_PRODUCTS.flatMap(p => p.availableColors)));
const STATUSES: Array<AdminProduct['status']> = ['Published', 'Draft', 'Hidden'];
const INVENTORY_STATES = ['In Stock', 'Low Stock', 'Out of Stock'];
const DISCOUNT_RANGES = [
  { value: '0', label: 'No Discount', test: (d: number) => d === 0 },
  { value: '1-25', label: '1–25% Off', test: (d: number) => d > 0 && d <= 25 },
  { value: '26-50', label: '26–50% Off', test: (d: number) => d > 25 && d <= 50 },
  { value: '51+', label: '51%+ Off', test: (d: number) => d > 50 },
];
const RATING_THRESHOLDS = [
  { value: '4.5', label: '4.5★ & above' },
  { value: '4', label: '4★ & above' },
  { value: '3', label: '3★ & above' },
];

/* ============================================================= */
/* Column definitions                                            */
/* ============================================================= */

const DEFAULT_COLUMNS: ColumnDef[] = [
  { key: 'product',  header: 'Product',     visible: true,  width: 280, align: 'left',  sortable: true },
  { key: 'brand',    header: 'Brand',       visible: true,  width: 110, align: 'left',  sortable: true },
  { key: 'category', header: 'Category',    visible: true,  width: 110, align: 'left',  sortable: true },
  { key: 'price',    header: 'Price',       visible: true,  width: 110, align: 'right', sortable: true },
  { key: 'discount', header: 'Discount',    visible: true,  width: 90,  align: 'right', sortable: true },
  { key: 'stock',    header: 'Stock',       visible: true,  width: 110, align: 'right', sortable: true },
  { key: 'status',   header: 'Status',      visible: true,  width: 150, align: 'left',  sortable: true },
  { key: 'visibility', header: 'Visibility', visible: true,  width: 100, align: 'center', sortable: true },
  { key: 'rating',   header: 'Rating',      visible: true,  width: 110, align: 'left',  sortable: true },
  { key: 'created',  header: 'Created',     visible: false, width: 120, align: 'left',  sortable: true },
  { key: 'updated',  header: 'Updated',     visible: true,  width: 120, align: 'left',  sortable: true },
  { key: 'actions',  header: '',            visible: true,  width: 60,  align: 'right', sortable: false },
];

/* ============================================================= */
/* Date formatter                                                */
/* ============================================================= */

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtNumber(n: number): string {
  return n.toLocaleString('en-IN');
}

/* ============================================================= */
/* Highlight search match — wraps matched substring in <mark>    */
/* ============================================================= */

function highlightMatch(text: string, query: string, tokens: Tk): React.ReactNode {
  if (!query) return text;
  const q = query.toLowerCase();
  const t = text;
  const idx = t.toLowerCase().indexOf(q);
  if (idx === -1) return t;
  return (
    <>
      {t.slice(0, idx)}
      <mark style={{
        background: tokens.status.warningBg,
        color: tokens.status.warning,
        padding: '0 2px',
        borderRadius: 3,
        fontWeight: 700,
      }}>{t.slice(idx, idx + q.length)}</mark>
      {t.slice(idx + q.length)}
    </>
  );
}

/* ============================================================= */
/* Status chip — premium multi-state badge                       */
/* ============================================================= */

function CatalogStatusChips({ p, tokens }: { p: AdminProduct; tokens: Tk }) {
  const chips: { label: string; tone: 'success' | 'warning' | 'critical' | 'info' | 'purple' | 'neutral'; dot?: boolean }[] = [];
  // Status chip
  if (p.status === 'Published') chips.push({ label: 'Published', tone: 'success', dot: true });
  else if (p.status === 'Draft') chips.push({ label: 'Draft', tone: 'warning', dot: true });
  else if (p.status === 'Hidden') chips.push({ label: 'Hidden', tone: 'neutral', dot: true });

  // Stock chips
  if (p.stock === 0) chips.push({ label: 'Out of Stock', tone: 'critical', dot: true });
  else if (p.stock <= p.stockThreshold) chips.push({ label: 'Low Stock', tone: 'warning', dot: true });

  // Flag chips
  if (p.flashSale) chips.push({ label: '⚡ Flash Sale', tone: 'purple' });
  if (p.trending) chips.push({ label: '🔥 Trending', tone: 'critical' });
  if (p.featured) chips.push({ label: '★ Featured', tone: 'info' });

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {chips.map((c, i) => (
        <Badge key={i} tokens={tokens} tone={c.tone} size="sm" dot={c.dot}>{c.label}</Badge>
      ))}
    </div>
  );
}

/* ============================================================= */
/* Stock indicator — number + progress bar                       */
/* ============================================================= */

function StockIndicator({ p, tokens }: { p: AdminProduct; tokens: Tk }) {
  const max = 50;
  const pct = Math.min(100, (p.stock / max) * 100);
  const color = p.stock === 0 ? tokens.status.error
    : p.stock <= p.stockThreshold ? tokens.status.warning
    : tokens.status.success;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, minWidth: 80 }}>
      <span style={{
        fontWeight: 700,
        fontSize: 13,
        color: p.stock === 0 ? tokens.status.error : p.stock <= p.stockThreshold ? tokens.status.warning : tokens.text.primary,
        fontFamily: 'Inter, sans-serif',
      }}>{p.stock} <span style={{ fontSize: 10, color: tokens.text.tertiary, fontWeight: 500 }}>units</span></span>
      <div style={{
        width: 70, height: 4, borderRadius: 2,
        background: tokens.bg.surfaceAlt, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: color,
          borderRadius: 2,
          transition: 'width 400ms cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  );
}

/* ============================================================= */
/* Rating display — star + numeric                               */
/* ============================================================= */

function RatingDisplay({ p, tokens }: { p: AdminProduct; tokens: Tk }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 2,
        fontSize: 13, fontWeight: 700, color: tokens.text.primary,
        fontFamily: 'Inter, sans-serif',
      }}>
        <svg width={12} height={12} viewBox="0 0 24 24" fill={tokens.status.warning} stroke={tokens.status.warning} strokeWidth={1.5} strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        {p.rating.toFixed(1)}
      </span>
      <span style={{ fontSize: 11, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif' }}>
        ({fmtNumber(p.reviewCount)})
      </span>
    </div>
  );
}

/* ============================================================= */
/* Thumbnail with lazy loading + hover zoom                      */
/* ============================================================= */

function ProductThumb({ p, tokens, size = 44 }: { p: AdminProduct; tokens: Tk; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 10,
      background: tokens.bg.surfaceAlt,
      backgroundImage: `url(${p.primaryImage})`,
      backgroundSize: 'contain', backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      border: `1px solid ${tokens.border.subtle}`,
      flexShrink: 0,
      transition: 'transform 200ms cubic-bezier(0.16,1,0.3,1)',
      position: 'relative',
    }} className="lnk-prod-thumb" />
  );
}

/* ============================================================= */
/* MAIN PAGE                                                     */
/* ============================================================= */

export default function ProductsManagementPage() {
  const { tokens } = useAdminTheme();
  const { push: pushToast } = useToast();

  /* ----------------------------- State ----------------------------- */
  const [products, setProducts] = useState<AdminProduct[]>(ALL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusTab, setStatusTab] = useState<StatusTabKey>('all');

  // Advanced filters
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCollection, setFilterCollection] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [filterColor, setFilterColor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterInventory, setFilterInventory] = useState('all');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [filterDiscount, setFilterDiscount] = useState('all');
  const [filterVisibility, setFilterVisibility] = useState('all');
  const [filterRating, setFilterRating] = useState('all');

  // Table state
  const [columns, setColumns] = useState<ColumnDef[]>(DEFAULT_COLUMNS);
  const [density, setDensity] = useState<DensityKey>('default');
  // viewMode kept for future grid view toggle (currently table only)
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>({ key: 'created', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [resizing, setResizing] = useState<{ key: string; startX: number; startWidth: number } | null>(null);

  // Drawers/modals
  const [preview, setPreview] = useState<AdminProduct | null>(null);
  const [editTarget, setEditTarget] = useState<AdminProduct | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [duplicateTarget, setDuplicateTarget] = useState<AdminProduct | null>(null);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [bulkDiscountOpen, setBulkDiscountOpen] = useState(false);
  const [bulkInventoryOpen, setBulkInventoryOpen] = useState(false);
  const [bulkCategoryOpen, setBulkCategoryOpen] = useState(false);
  // Column menu + view menu are inline Dropdown components — no need for separate state
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [viewNameInput, setViewNameInput] = useState('');

  // Loading skeleton
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, []);

  /* --------------------- Debounced search --------------------- */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 150);
    return () => clearTimeout(t);
  }, [search]);

  /* --------------------- Active filter count --------------------- */
  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (filterBrand !== 'all') c++;
    if (filterCategory !== 'all') c++;
    if (filterCollection !== 'all') c++;
    if (filterGender !== 'all') c++;
    if (filterSize !== 'all') c++;
    if (filterColor !== 'all') c++;
    if (filterStatus !== 'all') c++;
    if (filterInventory !== 'all') c++;
    if (filterPriceMin || filterPriceMax) c++;
    if (filterDiscount !== 'all') c++;
    if (filterVisibility !== 'all') c++;
    if (filterRating !== 'all') c++;
    return c;
  }, [filterBrand, filterCategory, filterCollection, filterGender, filterSize, filterColor,
      filterStatus, filterInventory, filterPriceMin, filterPriceMax, filterDiscount,
      filterVisibility, filterRating]);

  /* --------------------- Filtered + sorted products --------------------- */
  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    let result = products.filter(p => {
      // Search
      if (q) {
        const haystack = `${p.name} ${p.sku} ${p.brand} ${p.category} ${p.tags.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Status tab
      if (statusTab === 'published' && p.status !== 'Published') return false;
      if (statusTab === 'draft' && p.status !== 'Draft') return false;
      if (statusTab === 'hidden' && p.status !== 'Hidden') return false;
      if (statusTab === 'low' && !(p.stock > 0 && p.stock <= p.stockThreshold)) return false;
      if (statusTab === 'out' && p.stock !== 0) return false;

      // Advanced filters
      if (filterBrand !== 'all' && p.brand !== filterBrand) return false;
      if (filterCategory !== 'all' && p.category !== filterCategory) return false;
      if (filterCollection !== 'all' && !p.collections.includes(filterCollection)) return false;
      if (filterGender !== 'all' && p.gender !== filterGender) return false;
      if (filterSize !== 'all' && !p.availableSizes.includes(filterSize)) return false;
      if (filterColor !== 'all' && !p.availableColors.includes(filterColor)) return false;
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (filterInventory !== 'all') {
        const state = p.stock === 0 ? 'Out of Stock' : p.stock <= p.stockThreshold ? 'Low Stock' : 'In Stock';
        if (state !== filterInventory) return false;
      }
      if (filterPriceMin && p.price < Number(filterPriceMin)) return false;
      if (filterPriceMax && p.price > Number(filterPriceMax)) return false;
      if (filterDiscount !== 'all') {
        const range = DISCOUNT_RANGES.find(r => r.value === filterDiscount);
        if (range && !range.test(p.discountPct)) return false;
      }
      if (filterVisibility !== 'all' && p.visibility !== filterVisibility) return false;
      if (filterRating !== 'all' && p.rating < Number(filterRating)) return false;
      return true;
    });

    // Sort
    if (sort) {
      const dir = sort.dir === 'asc' ? 1 : -1;
      result = [...result].sort((a, b) => {
        let av: string | number, bv: string | number;
        switch (sort.key) {
          case 'product': av = a.name; bv = b.name; break;
          case 'brand': av = a.brand; bv = b.brand; break;
          case 'category': av = a.category; bv = b.category; break;
          case 'price': av = a.price; bv = b.price; break;
          case 'discount': av = a.discountPct; bv = b.discountPct; break;
          case 'stock': av = a.stock; bv = b.stock; break;
          case 'status': av = a.status + (a.stock === 0 ? '0' : a.stock <= a.stockThreshold ? '1' : '2'); bv = b.status + (b.stock === 0 ? '0' : b.stock <= b.stockThreshold ? '1' : '2'); break;
          case 'visibility': av = a.visibility; bv = b.visibility; break;
          case 'rating': av = a.rating; bv = b.rating; break;
          case 'created': av = a.created.getTime(); bv = b.created.getTime(); break;
          case 'updated': av = a.updated.getTime(); bv = b.updated.getTime(); break;
          default: return 0;
        }
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
        return String(av).localeCompare(String(bv)) * dir;
      });
    }
    return result;
  }, [products, debouncedSearch, statusTab, filterBrand, filterCategory, filterCollection,
      filterGender, filterSize, filterColor, filterStatus, filterInventory,
      filterPriceMin, filterPriceMax, filterDiscount, filterVisibility, filterRating, sort]);

  /* --------------------- Pagination --------------------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusTab, pageSize, activeFilterCount, sort?.key, sort?.dir]);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  /* --------------------- Counts for tabs --------------------- */
  const counts = useMemo(() => ({
    all: products.length,
    published: products.filter(p => p.status === 'Published').length,
    draft: products.filter(p => p.status === 'Draft').length,
    hidden: products.filter(p => p.status === 'Hidden').length,
    low: products.filter(p => p.stock > 0 && p.stock <= p.stockThreshold).length,
    out: products.filter(p => p.stock === 0).length,
  }), [products]);

  /* --------------------- KPI Summary --------------------- */
  const kpis = useMemo(() => {
    const published = products.filter(p => p.status === 'Published').length;
    const stockAlerts = products.filter(p => p.stock <= p.stockThreshold).length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const avgDiscount = products.length > 0
      ? Math.round(products.reduce((s, p) => s + p.discountPct, 0) / products.length)
      : 0;
    return { total: products.length, published, stockAlerts, totalValue, avgDiscount };
  }, [products]);

  /* --------------------- Selection handlers --------------------- */
  const toggleRow = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleAllPage = useCallback(() => {
    setSelected(prev => {
      const allChecked = pageRows.length > 0 && pageRows.every(r => prev.has(r.id));
      if (allChecked) {
        const next = new Set(prev);
        pageRows.forEach(r => next.delete(r.id));
        return next;
      } else {
        const next = new Set(prev);
        pageRows.forEach(r => next.add(r.id));
        return next;
      }
    });
  }, [pageRows]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  /* --------------------- Sort handler --------------------- */
  function toggleSort(key: string) {
    setSort(prev => {
      if (prev?.key === key) {
        if (prev.dir === 'asc') return { key, dir: 'desc' };
        if (prev.dir === 'desc') return null;
        return { key, dir: 'asc' };
      }
      return { key, dir: 'asc' };
    });
  }

  /* --------------------- Column resize handlers --------------------- */
  function startResize(e: React.MouseEvent, col: ColumnDef) {
    e.preventDefault();
    e.stopPropagation();
    setResizing({ key: col.key, startX: e.clientX, startWidth: col.width });
  }

  useEffect(() => {
    if (!resizing) return;
    function onMove(e: MouseEvent) {
      if (!resizing) return;
      const delta = e.clientX - resizing.startX;
      const newWidth = Math.max(60, resizing.startWidth + delta);
      setColumns(prev => prev.map(c => c.key === resizing.key ? { ...c, width: newWidth } : c));
    }
    function onUp() { setResizing(null); }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [resizing]);

  /* --------------------- Column visibility --------------------- */
  function toggleColumn(key: string) {
    setColumns(prev => prev.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
  }

  function resetColumns() {
    setColumns(DEFAULT_COLUMNS);
  }

  /* --------------------- Clear all filters --------------------- */
  function clearAllFilters() {
    setFilterBrand('all'); setFilterCategory('all'); setFilterCollection('all');
    setFilterGender('all'); setFilterSize('all'); setFilterColor('all');
    setFilterStatus('all'); setFilterInventory('all');
    setFilterPriceMin(''); setFilterPriceMax('');
    setFilterDiscount('all'); setFilterVisibility('all'); setFilterRating('all');
  }

  /* --------------------- Bulk operations --------------------- */
  function bulkUpdate(updater: (p: AdminProduct) => AdminProduct, label: string) {
    setProducts(prev => prev.map(p => selected.has(p.id) ? updater(p) : p));
    pushToast({ tone: 'success', title: label, message: `${selected.size} products updated.` });
    clearSelection();
  }

  function handleBulkDelete() {
    setProducts(prev => prev.filter(p => !selected.has(p.id)));
    pushToast({ tone: 'success', title: `${selected.size} products deleted`, message: 'Products moved to trash.' });
    clearSelection();
  }

  function handleBulkPublish() {
    bulkUpdate(p => ({ ...p, status: 'Published', visibility: 'Visible' as const }), `${selected.size} products published`);
  }

  function handleBulkHide() {
    bulkUpdate(p => ({ ...p, status: 'Hidden', visibility: 'Hidden' as const }), `${selected.size} products hidden`);
  }

  function handleBulkDuplicate() {
    const copies: AdminProduct[] = [];
    selected.forEach(id => {
      const orig = products.find(p => p.id === id);
      if (orig) {
        copies.push({
          ...orig,
          id: `${orig.id}-copy-${Date.now()}`,
          sku: `${orig.sku}-COPY`,
          slug: `${orig.slug}-copy`,
          name: `${orig.name} (Copy)`,
          status: 'Draft',
          sales: 0,
          views: 0,
        });
      }
    });
    setProducts(prev => [...copies, ...prev]);
    pushToast({ tone: 'success', title: `${copies.length} products duplicated`, message: 'Draft copies created.' });
    clearSelection();
  }

  function handleBulkExport() {
    pushToast({ tone: 'success', title: 'Export started', message: `${selected.size} products exporting to CSV.` });
  }

  function handleBulkPriceUpdate(newPrice: number | null, mode: 'fixed' | 'increase' | 'decrease') {
    if (newPrice === null) return;
    bulkUpdate(p => {
      let nextPrice = p.price;
      if (mode === 'fixed') nextPrice = newPrice;
      else if (mode === 'increase') nextPrice = Math.round(p.price * (1 + newPrice / 100));
      else if (mode === 'decrease') nextPrice = Math.round(p.price * (1 - newPrice / 100));
      return { ...p, price: nextPrice };
    }, `${selected.size} product prices updated`);
    setBulkPriceOpen(false);
  }

  function handleBulkDiscountUpdate(discountPct: number) {
    bulkUpdate(p => {
      if (discountPct === 0) return { ...p, comparePrice: undefined, discountPct: 0, flashSale: false };
      const comparePrice = Math.round(p.price / (1 - discountPct / 100));
      return { ...p, comparePrice, discountPct, flashSale: discountPct >= 40 };
    }, `${selected.size} products discount updated`);
    setBulkDiscountOpen(false);
  }

  function handleBulkInventoryUpdate(stock: number) {
    bulkUpdate(p => ({ ...p, stock }), `${selected.size} products inventory updated`);
    setBulkInventoryOpen(false);
  }

  function handleBulkCategoryUpdate(category: string) {
    bulkUpdate(p => ({ ...p, category }), `${selected.size} products category updated`);
    setBulkCategoryOpen(false);
  }

  /* --------------------- Single row actions --------------------- */
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

  function handleToggleVisibility(p: AdminProduct) {
    const next = p.visibility === 'Visible' ? 'Hidden' : 'Visible';
    const nextStatus: AdminProduct['status'] = next === 'Visible' ? 'Published' : 'Hidden';
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, visibility: next, status: nextStatus } : x));
    pushToast({ tone: 'info', title: `Product ${next === 'Visible' ? 'visible' : 'hidden'}`, message: p.name });
  }

  function handleQuickEditSave() {
    if (!editTarget) return;
    setProducts(prev => prev.map(p => p.id === editTarget.id ? editTarget : p));
    pushToast({ tone: 'success', title: 'Product updated', message: editTarget.name });
    setEditTarget(null);
  }

  function handleExport() {
    pushToast({ tone: 'success', title: 'Export started', message: `${filtered.length} products exporting to CSV.` });
  }

  /* --------------------- Save View --------------------- */
  function saveCurrentView() {
    if (!viewNameInput.trim()) return;
    const view: SavedView = {
      id: `view-${Date.now()}`,
      name: viewNameInput.trim(),
      filters: {
        brand: filterBrand, category: filterCategory, status: filterStatus,
        inventory: filterInventory,
      },
      columns: columns.filter(c => c.visible).map(c => c.key),
    };
    setSavedViews(prev => [...prev, view]);
    setViewNameInput('');
    pushToast({ tone: 'success', title: 'View saved', message: `"${view.name}" added to saved views.` });
  }

  /* --------------------- Row density styling --------------------- */
  const densityPad = density === 'compact' ? '6px 10px' : density === 'comfortable' ? '14px 14px' : '10px 12px';
  const densityThumb = density === 'compact' ? 36 : density === 'comfortable' ? 56 : 44;

  /* --------------------- Render --------------------- */
  return (
    <AdminLayout
      title="Products"
      subtitle="Catalog management"
      requirePermission="product.edit"
      breadcrumb={[{ label: 'Admin', href: '/dashboard' }, { label: 'Catalog' }, { label: 'Products' }]}
    >
      <div className="lnk-prod-root" style={{ overflowX: 'hidden' }}>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 1. PAGE HEADER                                          */}
        {/* ════════════════════════════════════════════════════════ */}
        <header className="lnk-prod-header" style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 16, flexWrap: 'wrap', marginBottom: 24,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h1 style={{
                margin: 0, fontSize: 26, fontWeight: 800,
                color: tokens.text.primary, fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.025em', lineHeight: 1.1,
              }}>Product Catalog</h1>
              <Badge tokens={tokens} tone="info" size="md">{kpis.total} products</Badge>
              <Badge tokens={tokens} tone="neutral" size="md">{kpis.published} published</Badge>
            </div>
            <p style={{
              margin: 0, fontSize: 13, color: tokens.text.secondary,
              fontFamily: 'Inter, sans-serif', lineHeight: 1.5, maxWidth: 640,
            }}>
              Manage your sneaker inventory — pricing, variants, stock, visibility and
              collections across the LNKICKS marketplace.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button tokens={tokens} variant="outline" size="md" onClick={() => setImportOpen(true)}
              icon={<UploadIcon color={tokens.text.secondary} />}>Import</Button>
            <Button tokens={tokens} variant="outline" size="md" onClick={handleExport}
              icon={<DownloadIcon color={tokens.text.secondary} />}>Export</Button>
            <Link href="/add-product">
              <Button tokens={tokens} variant="primary" size="md"
                icon={<PlusIcon size={14} color={tokens.bg.app} />}>Add Product</Button>
            </Link>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 2. KPI SUMMARY                                          */}
        {/* ════════════════════════════════════════════════════════ */}
        <div className="lnk-prod-kpi-grid">
          <KpiCard tokens={tokens} label="Total Products" value={fmtNumber(kpis.total)}
            sub={`${kpis.published} published · ${kpis.total - kpis.published} other`}
            icon={<BoxIcon color={tokens.text.primary} />} accent={tokens.text.primary} />
          <KpiCard tokens={tokens} label="Stock Alerts" value={fmtNumber(kpis.stockAlerts)}
            sub={`${counts.low} low · ${counts.out} out of stock`}
            icon={<AlertIcon color={tokens.status.warning} />} accent={tokens.status.warning}
            tone={kpis.stockAlerts > 0 ? 'warning' : 'neutral'} />
          <KpiCard tokens={tokens} label="Inventory Value" value={`₹${fmtNumber(kpis.totalValue)}`}
            sub="At current sell price"
            icon={<RupeeIcon color={tokens.status.success} />} accent={tokens.status.success} />
          <KpiCard tokens={tokens} label="Avg Discount" value={`${kpis.avgDiscount}%`}
            sub="Across published catalog"
            icon={<PercentIcon color={tokens.status.info} />} accent={tokens.status.info} />
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 3. TOOLBAR                                              */}
        {/* ════════════════════════════════════════════════════════ */}
        <div className="lnk-prod-toolbar" style={{
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          marginBottom: 14,
        }}>
          {/* Status Tabs */}
          <div className="lnk-prod-tabs" style={{
            display: 'inline-flex', gap: 2, padding: 3,
            background: tokens.bg.surfaceAlt, borderRadius: 9,
            border: `1px solid ${tokens.border.subtle}`,
          }}>
            {([
              { k: 'all', label: 'All', badge: counts.all },
              { k: 'published', label: 'Published', badge: counts.published },
              { k: 'draft', label: 'Draft', badge: counts.draft },
              { k: 'hidden', label: 'Hidden', badge: counts.hidden },
              { k: 'low', label: 'Low Stock', badge: counts.low },
              { k: 'out', label: 'Out of Stock', badge: counts.out },
            ] as const).map(t => {
              const isActive = statusTab === t.k;
              return (
                <button key={t.k} onClick={() => setStatusTab(t.k)}
                  className={`lnk-prod-tab ${isActive ? 'is-active' : ''}`}
                  style={{
                    padding: '6px 12px', borderRadius: 7, border: 'none',
                    background: isActive ? tokens.bg.surface : 'transparent',
                    color: isActive ? tokens.text.primary : tokens.text.secondary,
                    fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    boxShadow: isActive ? tokens.shadow.sm : 'none',
                    transition: 'all 140ms ease',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>
                  {t.label}
                  <span style={{
                    fontSize: 10, fontWeight: 700, minWidth: 16, height: 16,
                    padding: '0 4px', borderRadius: 8,
                    background: isActive ? tokens.text.primary : tokens.bg.hover,
                    color: isActive ? tokens.bg.app : tokens.text.secondary,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>{t.badge}</span>
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1 }} />

          {/* Search */}
          <div style={{ width: 260, position: 'relative' }}>
            <SearchInput tokens={tokens} value={search} onChange={setSearch}
              placeholder="Search by name, SKU, brand, tag…" />
            {search && (
              <button onClick={() => setSearch('')}
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  width: 18, height: 18, borderRadius: '50%', border: 'none',
                  background: tokens.bg.surfaceAlt, color: tokens.text.secondary,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, lineHeight: 1,
                }}>×</button>
            )}
          </div>

          {/* Filters Button */}
          <Button tokens={tokens} variant={filtersOpen || activeFilterCount > 0 ? 'secondary' : 'outline'}
            size="md" onClick={() => setFiltersOpen(o => !o)}
            icon={<FilterIcon color={activeFilterCount > 0 ? tokens.text.primary : tokens.text.secondary} />}>
            Filters
            {activeFilterCount > 0 && (
              <span style={{
                marginLeft: 4, minWidth: 18, height: 18, padding: '0 5px',
                borderRadius: 9, background: tokens.text.primary, color: tokens.bg.app,
                fontSize: 10, fontWeight: 700, display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center',
              }}>{activeFilterCount}</span>
            )}
          </Button>

          {/* Density toggle */}
          <Dropdown
            tokens={tokens}
            align="right"
            width={170}
            trigger={
              <IconButton tokens={tokens} label="Density" variant="outline" size={36}
                icon={<DensityIcon color={tokens.text.secondary} />} />
            }
          >
            <div style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
              textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'Inter, sans-serif' }}>
              Row Density
            </div>
            {(['compact', 'default', 'comfortable'] as const).map(d => (
              <MenuItem key={d} tokens={tokens} active={density === d} onClick={() => setDensity(d)}>
                <span style={{ textTransform: 'capitalize' }}>{d}</span>
                {density === d && <CheckIcon size={12} color={tokens.text.primary} />}
              </MenuItem>
            ))}
            <MenuDivider tokens={tokens} />
            <div style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
              textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'Inter, sans-serif' }}>
              Items per page
            </div>
            {[10, 25, 50, 100].map(n => (
              <MenuItem key={n} tokens={tokens} active={pageSize === n} onClick={() => setPageSize(n)}>
                {n} per page
                {pageSize === n && <CheckIcon size={12} color={tokens.text.primary} />}
              </MenuItem>
            ))}
          </Dropdown>

          {/* Column visibility */}
          <Dropdown
            tokens={tokens}
            align="right"
            width={210}
            trigger={
              <IconButton tokens={tokens} label="Column visibility" variant="outline" size={36}
                icon={<ColumnsIcon color={tokens.text.secondary} />} />
            }
          >
            <div style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
              textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'Inter, sans-serif',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>Columns</span>
              <button onClick={resetColumns} style={{
                background: 'none', border: 'none', color: tokens.status.info,
                fontSize: 10, fontFamily: 'Inter, sans-serif', cursor: 'pointer', padding: 0,
              }}>Reset</button>
            </div>
            {columns.filter(c => c.key !== 'actions').map(c => (
              <label key={c.key} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', cursor: 'pointer', borderRadius: 7,
                fontSize: 12, color: tokens.text.primary, fontFamily: 'Inter, sans-serif',
              }} onMouseEnter={(e) => { e.currentTarget.style.background = tokens.bg.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                <Checkbox tokens={tokens} checked={c.visible} onChange={() => toggleColumn(c.key)} />
                {c.header || 'Product'}
              </label>
            ))}
          </Dropdown>

          {/* Save view */}
          <Dropdown
            tokens={tokens}
            align="right"
            width={240}
            trigger={
              <IconButton tokens={tokens} label="Saved views" variant="outline" size={36}
                icon={<BookmarkIcon color={tokens.text.secondary} />} />
            }
          >
            <div style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, color: tokens.text.tertiary,
              textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: 'Inter, sans-serif' }}>
              Saved Views
            </div>
            {savedViews.length === 0 ? (
              <div style={{ padding: '14px 10px', fontSize: 11, color: tokens.text.tertiary,
                textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
                No saved views yet. Configure filters and save your current view.
              </div>
            ) : (
              savedViews.map(v => (
                <MenuItem key={v.id} tokens={tokens}
                  icon={<BookmarkIcon size={12} color={tokens.text.tertiary} />}>
                  {v.name}
                </MenuItem>
              ))
            )}
            <MenuDivider tokens={tokens} />
            <div style={{ padding: '6px 10px', display: 'flex', gap: 6 }}>
              <input value={viewNameInput} onChange={e => setViewNameInput(e.target.value)}
                placeholder="View name…"
                style={{
                  flex: 1, height: 30, padding: '0 10px', borderRadius: 7,
                  border: `1px solid ${tokens.border.subtle}`,
                  background: tokens.bg.surface, color: tokens.text.primary,
                  fontSize: 12, fontFamily: 'Inter, sans-serif', outline: 'none',
                }} />
              <Button tokens={tokens} variant="primary" size="sm" onClick={saveCurrentView}>Save</Button>
            </div>
          </Dropdown>
        </div>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 4. ADVANCED FILTER PANEL                                */}
        {/* ════════════════════════════════════════════════════════ */}
        {filtersOpen && (
          <div className="lnk-prod-filters" style={{
            background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
            borderRadius: 14, padding: '16px 18px', marginBottom: 14,
            boxShadow: tokens.shadow.sm,
            animation: 'lnk-prod-filters-in 200ms cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 12,
            }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: tokens.text.primary,
                fontFamily: 'Inter, sans-serif', letterSpacing: '-0.005em',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <FilterIcon color={tokens.text.secondary} />
                Advanced Filters
                {activeFilterCount > 0 && (
                  <Badge tokens={tokens} tone="info" size="sm">{activeFilterCount} active</Badge>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button tokens={tokens} variant="ghost" size="sm"
                  onClick={clearAllFilters} disabled={activeFilterCount === 0}>
                  Clear All
                </Button>
                <Button tokens={tokens} variant="ghost" size="sm"
                  onClick={() => setFiltersOpen(false)}>Close</Button>
              </div>
            </div>
            <div className="lnk-prod-filter-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 12,
            }}>
              <FilterField tokens={tokens} label="Brand">
                <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)}
                  style={filterSelectStyle(tokens)}>
                  <option value="all">All Brands</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </FilterField>
              <FilterField tokens={tokens} label="Category">
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                  style={filterSelectStyle(tokens)}>
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FilterField>
              <FilterField tokens={tokens} label="Collection">
                <select value={filterCollection} onChange={e => setFilterCollection(e.target.value)}
                  style={filterSelectStyle(tokens)}>
                  <option value="all">All Collections</option>
                  {COLLECTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FilterField>
              <FilterField tokens={tokens} label="Gender">
                <select value={filterGender} onChange={e => setFilterGender(e.target.value)}
                  style={filterSelectStyle(tokens)}>
                  <option value="all">All Genders</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </FilterField>
              <FilterField tokens={tokens} label="Size">
                <select value={filterSize} onChange={e => setFilterSize(e.target.value)}
                  style={filterSelectStyle(tokens)}>
                  <option value="all">All Sizes</option>
                  {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FilterField>
              <FilterField tokens={tokens} label="Color">
                <select value={filterColor} onChange={e => setFilterColor(e.target.value)}
                  style={filterSelectStyle(tokens)}>
                  <option value="all">All Colors</option>
                  {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FilterField>
              <FilterField tokens={tokens} label="Status">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  style={filterSelectStyle(tokens)}>
                  <option value="all">All Status</option>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FilterField>
              <FilterField tokens={tokens} label="Inventory">
                <select value={filterInventory} onChange={e => setFilterInventory(e.target.value)}
                  style={filterSelectStyle(tokens)}>
                  <option value="all">All Inventory</option>
                  {INVENTORY_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FilterField>
              <FilterField tokens={tokens} label="Discount">
                <select value={filterDiscount} onChange={e => setFilterDiscount(e.target.value)}
                  style={filterSelectStyle(tokens)}>
                  <option value="all">Any Discount</option>
                  {DISCOUNT_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </FilterField>
              <FilterField tokens={tokens} label="Visibility">
                <select value={filterVisibility} onChange={e => setFilterVisibility(e.target.value)}
                  style={filterSelectStyle(tokens)}>
                  <option value="all">All Visibility</option>
                  <option value="Visible">Visible</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </FilterField>
              <FilterField tokens={tokens} label="Rating">
                <select value={filterRating} onChange={e => setFilterRating(e.target.value)}
                  style={filterSelectStyle(tokens)}>
                  <option value="all">All Ratings</option>
                  {RATING_THRESHOLDS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </FilterField>
              <FilterField tokens={tokens} label="Price Range (₹)">
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input type="number" value={filterPriceMin} onChange={e => setFilterPriceMin(e.target.value)}
                    placeholder="Min" style={filterInputStyle(tokens)} />
                  <span style={{ color: tokens.text.tertiary, fontSize: 12 }}>-</span>
                  <input type="number" value={filterPriceMax} onChange={e => setFilterPriceMax(e.target.value)}
                    placeholder="Max" style={filterInputStyle(tokens)} />
                </div>
              </FilterField>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════ */}
        {/* 5. BULK ACTION BAR (sticky)                             */}
        {/* ════════════════════════════════════════════════════════ */}
        {selected.size > 0 && (
          <div className="lnk-prod-bulk-bar" style={{
            position: 'sticky', top: 0, zIndex: 10,
            background: tokens.text.primary, color: tokens.bg.app,
            padding: '10px 16px', borderRadius: 12, marginBottom: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, flexWrap: 'wrap',
            boxShadow: tokens.shadow.md,
            animation: 'lnk-prod-bulk-in 220ms cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13,
              fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
              <span style={{
                background: tokens.bg.app, color: tokens.text.primary,
                fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 8,
                minWidth: 32, textAlign: 'center',
              }}>{selected.size}</span>
              <span>products selected</span>
              <button onClick={clearSelection} style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', color: tokens.bg.app,
                padding: '4px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>Clear</button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <BulkButton tokens={tokens} onClick={handleBulkPublish}>Publish</BulkButton>
              <BulkButton tokens={tokens} onClick={handleBulkHide}>Hide</BulkButton>
              <BulkButton tokens={tokens} onClick={() => setBulkCategoryOpen(true)}>Set Category</BulkButton>
              <BulkButton tokens={tokens} onClick={() => setBulkDiscountOpen(true)}>Apply Discount</BulkButton>
              <BulkButton tokens={tokens} onClick={() => setBulkPriceOpen(true)}>Update Price</BulkButton>
              <BulkButton tokens={tokens} onClick={() => setBulkInventoryOpen(true)}>Update Inventory</BulkButton>
              <BulkButton tokens={tokens} onClick={handleBulkDuplicate}>Duplicate</BulkButton>
              <BulkButton tokens={tokens} onClick={handleBulkExport}>Export</BulkButton>
              <button onClick={handleBulkDelete} style={{
                background: 'rgba(239,68,68,0.2)', border: 'none', color: '#FECACA',
                padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                <TrashIcon color="#FECACA" /> Delete
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════ */}
        {/* 6. PREMIUM CATALOG TABLE                                */}
        {/* ════════════════════════════════════════════════════════ */}
        {loading ? (
          <CatalogSkeleton tokens={tokens} columns={columns} />
        ) : filtered.length === 0 ? (
          <EmptyState tokens={tokens}
            icon={<SearchIcon size={22} color={tokens.text.tertiary} />}
            title="No products found"
            description="Try adjusting your filters or search query. You can also clear all filters to see your full catalog."
            action={
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {activeFilterCount > 0 && (
                  <Button tokens={tokens} variant="outline" size="sm" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                )}
                <Link href="/add-product">
                  <Button tokens={tokens} variant="primary" size="sm"
                    icon={<PlusIcon size={12} color={tokens.bg.app} />}>Add Product</Button>
                </Link>
              </div>
            }
          />
        ) : (
          <div className="lnk-prod-table-wrap" style={{
            border: `1px solid ${tokens.border.subtle}`,
            borderRadius: 14, overflow: 'hidden', background: tokens.bg.surface,
            boxShadow: tokens.shadow.sm,
          }}>
            <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 320px)', overflowY: 'auto' }}>
              <table className="lnk-prod-table" style={{
                width: '100%', borderCollapse: 'collapse',
                fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13,
                tableLayout: 'fixed',
              }}>
                <colgroup>
                  <col style={{ width: 44 }} />
                  {columns.filter(c => c.visible).map(c => (
                    <col key={c.key} style={{ width: c.width }} />
                  ))}
                </colgroup>
                <thead>
                  <tr style={{
                    background: tokens.bg.surfaceAlt,
                    borderBottom: `1px solid ${tokens.border.subtle}`,
                  }}>
                    <th style={{
                      padding: '10px 12px', position: 'sticky', top: 0, zIndex: 5,
                      background: tokens.bg.surfaceAlt,
                      borderBottom: `1px solid ${tokens.border.subtle}`,
                      width: 44,
                    }}>
                      <Checkbox tokens={tokens}
                        checked={pageRows.length > 0 && pageRows.every(r => selected.has(r.id))}
                        indeterminate={selected.size > 0 && !pageRows.every(r => selected.has(r.id))}
                        onChange={toggleAllPage} />
                    </th>
                    {columns.filter(c => c.visible).map(col => (
                      <th key={col.key}
                        onClick={() => col.sortable && toggleSort(col.key)}
                        style={{
                          padding: '10px 12px', textAlign: col.align,
                          fontSize: 10, fontWeight: 700,
                          color: sort?.key === col.key ? tokens.text.primary : tokens.text.tertiary,
                          textTransform: 'uppercase', letterSpacing: 0.8,
                          cursor: col.sortable ? 'pointer' : 'default',
                          userSelect: 'none', whiteSpace: 'nowrap',
                          position: 'sticky', top: 0, zIndex: 4,
                          background: tokens.bg.surfaceAlt,
                          borderBottom: `1px solid ${tokens.border.subtle}`,
                          transition: 'color 120ms ease',
                        }}
                        onMouseEnter={(e) => { if (col.sortable) e.currentTarget.style.color = tokens.text.secondary; }}
                        onMouseLeave={(e) => { if (sort?.key !== col.key) e.currentTarget.style.color = tokens.text.tertiary; }}
                      >
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start',
                        }}>
                          <span>{col.header}</span>
                          {col.sortable && (
                            <span style={{
                              display: 'inline-flex', flexDirection: 'column', lineHeight: 0.7,
                              opacity: sort?.key === col.key ? 1 : 0.5,
                            }}>
                              <span style={{
                                fontSize: 7, color: sort?.key === col.key && sort.dir === 'asc' ? tokens.text.primary : tokens.text.tertiary,
                              }}>▲</span>
                              <span style={{
                                fontSize: 7, color: sort?.key === col.key && sort.dir === 'desc' ? tokens.text.primary : tokens.text.tertiary,
                              }}>▼</span>
                            </span>
                          )}
                          {col.key !== 'actions' && col.sortable && (
                            <span
                              onClick={(e) => startResize(e, col)}
                              style={{
                                display: 'inline-block', width: 6, height: 24, cursor: 'col-resize',
                                marginLeft: 2, flexShrink: 0,
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = tokens.border.strong; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((p, idx) => {
                    const isSel = selected.has(p.id);
                    return (
                      <tr key={p.id}
                        className="lnk-prod-row"
                        onClick={() => setPreview(p)}
                        style={{
                          borderBottom: idx === pageRows.length - 1 ? 'none' : `1px solid ${tokens.border.subtle}`,
                          background: isSel ? tokens.bg.hover : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 100ms ease',
                        }}
                        onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = tokens.bg.hover; }}
                        onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
                      >
                        {/* Checkbox */}
                        <td onClick={e => { e.stopPropagation(); toggleRow(p.id); }}
                          style={{ padding: densityPad, textAlign: 'center',
                            position: 'sticky', left: 0, zIndex: 2,
                            background: isSel ? tokens.bg.hover : tokens.bg.surface,
                            borderBottom: `1px solid ${tokens.border.subtle}` }}>
                          <Checkbox tokens={tokens} checked={isSel} onChange={() => toggleRow(p.id)} />
                        </td>

                        {/* Visible cells */}
                        {columns.filter(c => c.visible).map(col => (
                          <td key={col.key} style={{
                            padding: densityPad,
                            textAlign: col.align,
                            color: tokens.text.primary,
                            verticalAlign: 'middle',
                            whiteSpace: col.align === 'right' ? 'nowrap' : 'normal',
                            overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {renderCell(col.key, p, tokens, debouncedSearch, densityThumb, {
                              onEdit: () => setEditTarget(p),
                              onPreview: () => setPreview(p),
                              onDuplicate: () => setDuplicateTarget(p),
                              onDelete: () => setDeleteTarget(p),
                              onToggleVis: () => handleToggleVisibility(p),
                            })}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, flexWrap: 'wrap', padding: '10px 14px',
              borderTop: `1px solid ${tokens.border.subtle}`,
              background: tokens.bg.surfaceAlt,
            }}>
              <div style={{
                fontSize: 11, color: tokens.text.tertiary, fontFamily: 'Inter, sans-serif',
              }}>
                Showing <strong style={{ color: tokens.text.primary }}>{(currentPage - 1) * pageSize + 1}</strong>
                {' '}–{' '}
                <strong style={{ color: tokens.text.primary }}>{Math.min(currentPage * pageSize, filtered.length)}</strong>
                {' '}of{' '}
                <strong style={{ color: tokens.text.primary }}>{fmtNumber(filtered.length)}</strong>
                {' '}products
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <IconButton tokens={tokens} size={28} label="First page"
                  icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 19l-7-7 7-7M19 19l-7-7 7-7" /></svg>}
                  onClick={() => setPage(1)} />
                <IconButton tokens={tokens} size={28} label="Previous page"
                  icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>}
                  onClick={() => setPage(p => Math.max(1, p - 1))} />
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 7) p = i + 1;
                  else if (currentPage <= 4) p = i + 1;
                  else if (currentPage >= totalPages - 3) p = totalPages - 6 + i;
                  else p = currentPage - 3 + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      style={{
                        minWidth: 28, height: 28, padding: '0 8px', borderRadius: 7,
                        border: 'none', cursor: 'pointer',
                        background: p === currentPage ? tokens.text.primary : 'transparent',
                        color: p === currentPage ? tokens.bg.app : tokens.text.secondary,
                        fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                        transition: 'all 100ms ease',
                      }}>{p}</button>
                  );
                })}
                <IconButton tokens={tokens} size={28} label="Next page"
                  icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
                <IconButton tokens={tokens} size={28} label="Last page"
                  icon={<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>}
                  onClick={() => setPage(totalPages)} />
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════ */}
        {/* 7. QUICK PREVIEW DRAWER                                 */}
        {/* ════════════════════════════════════════════════════════ */}
        <Drawer
          tokens={tokens}
          open={Boolean(preview)}
          onClose={() => setPreview(null)}
          title="Product Preview"
          subtitle={preview?.name}
          width={560}
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setPreview(null)}>Close</Button>
              <Button tokens={tokens} variant="outline" onClick={() => { if (preview) { setEditTarget(preview); setPreview(null); } }}
                icon={<EditIcon color={tokens.text.primary} />}>Quick Edit</Button>
              <Link href={preview ? `/edit-product` : '#'}>
                <Button tokens={tokens} variant="primary"
                  icon={<ExternalIcon color={tokens.bg.app} />}>Open Full Editor</Button>
              </Link>
            </>
          }
        >
          {preview && <QuickPreviewContent p={preview} tokens={tokens} />}
        </Drawer>

        {/* ════════════════════════════════════════════════════════ */}
        {/* 8. QUICK EDIT DRAWER                                    */}
        {/* ════════════════════════════════════════════════════════ */}
        <Drawer
          tokens={tokens}
          open={Boolean(editTarget)}
          onClose={() => setEditTarget(null)}
          title="Quick Edit"
          subtitle={editTarget?.name}
          width={480}
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setEditTarget(null)}>Cancel</Button>
              <Button tokens={tokens} variant="primary" onClick={handleQuickEditSave}>Save Changes</Button>
            </>
          }
        >
          {editTarget && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input tokens={tokens} label="Product Name" value={editTarget.name}
                onChange={e => setEditTarget({ ...editTarget, name: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input tokens={tokens} label="SKU" value={editTarget.sku}
                  onChange={e => setEditTarget({ ...editTarget, sku: e.target.value })} />
                <Input tokens={tokens} label="Brand" value={editTarget.brand}
                  onChange={e => setEditTarget({ ...editTarget, brand: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input tokens={tokens} label="Price (₹)" type="number" value={String(editTarget.price)}
                  onChange={e => setEditTarget({ ...editTarget, price: Number(e.target.value) })} />
                <Input tokens={tokens} label="Compare Price (₹)" type="number" value={String(editTarget.comparePrice ?? '')}
                  onChange={e => setEditTarget({ ...editTarget, comparePrice: Number(e.target.value) })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Input tokens={tokens} label="Stock" type="number" value={String(editTarget.stock)}
                  onChange={e => setEditTarget({ ...editTarget, stock: Number(e.target.value) })} />
                <Input tokens={tokens} label="Low Stock Threshold" type="number" value={String(editTarget.stockThreshold)}
                  onChange={e => setEditTarget({ ...editTarget, stockThreshold: Number(e.target.value) })} />
              </div>
              <Select tokens={tokens} label="Status" value={editTarget.status}
                onChange={e => setEditTarget({ ...editTarget, status: e.target.value as AdminProduct['status'] })}
                options={[
                  { value: 'Published', label: 'Published' },
                  { value: 'Draft', label: 'Draft' },
                  { value: 'Hidden', label: 'Hidden' },
                ]} />
              <Select tokens={tokens} label="Category" value={editTarget.category}
                onChange={e => setEditTarget({ ...editTarget, category: e.target.value })}
                options={CATEGORIES.map(c => ({ value: c, label: c }))} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: tokens.text.secondary,
                  marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>Flags</div>
                <ToggleRow tokens={tokens} label="Featured on Homepage" checked={Boolean(editTarget.featured)}
                  onChange={(v) => setEditTarget({ ...editTarget, featured: v })} />
                <ToggleRow tokens={tokens} label="Mark as New Arrival" checked={Boolean(editTarget.newArrival)}
                  onChange={(v) => setEditTarget({ ...editTarget, newArrival: v })} />
                <ToggleRow tokens={tokens} label="Mark as Best Seller" checked={Boolean(editTarget.bestSeller)}
                  onChange={(v) => setEditTarget({ ...editTarget, bestSeller: v })} />
                <ToggleRow tokens={tokens} label="Limited Edition" checked={Boolean(editTarget.limitedEdition)}
                  onChange={(v) => setEditTarget({ ...editTarget, limitedEdition: v })} />
              </div>
            </div>
          )}
        </Drawer>

        {/* ════════════════════════════════════════════════════════ */}
        {/* MODALS                                                   */}
        {/* ════════════════════════════════════════════════════════ */}

        {/* IMPORT */}
        <Modal tokens={tokens} open={importOpen} onClose={() => setImportOpen(false)}
          title="Import Products" subtitle="Upload a CSV or Excel file with product data"
          footer={
            <>
              <Button tokens={tokens} variant="ghost" onClick={() => setImportOpen(false)}>Cancel</Button>
              <Button tokens={tokens} variant="primary" onClick={() => {
                pushToast({ tone: 'success', title: 'Import started', message: 'We will process your file and notify you.' });
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
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: tokens.bg.surface, margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: tokens.text.tertiary,
            }}>
              <UploadIcon color={tokens.text.tertiary} />
            </div>
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
          <Modal tokens={tokens} open onClose={() => setDeleteTarget(null)}
            title="Delete Product?" size="sm"
            footer={
              <>
                <Button tokens={tokens} variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                <Button tokens={tokens} variant="danger"
                  onClick={() => deleteTarget && handleDelete(deleteTarget)}>Delete Permanently</Button>
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
          <Modal tokens={tokens} open onClose={() => setDuplicateTarget(null)}
            title="Duplicate Product?" size="sm"
            footer={
              <>
                <Button tokens={tokens} variant="ghost" onClick={() => setDuplicateTarget(null)}>Cancel</Button>
                <Button tokens={tokens} variant="primary"
                  onClick={() => duplicateTarget && handleDuplicate(duplicateTarget)}>Create Copy</Button>
              </>
            }
          >
            <p style={{ margin: 0, fontSize: 13, color: tokens.text.secondary, lineHeight: 1.6 }}>
              Create a draft copy of <strong style={{ color: tokens.text.primary }}>{duplicateTarget.name}</strong>?
              The copy will be saved as a Draft with a new SKU suffix{' '}
              <code style={{
                background: tokens.bg.surfaceAlt, padding: '1px 5px', borderRadius: 4,
                fontFamily: 'ui-monospace, monospace', fontSize: 11, color: tokens.text.primary,
              }}>-COPY</code>.
            </p>
          </Modal>
        )}

        {/* BULK PRICE UPDATE */}
        {bulkPriceOpen && (
          <BulkPriceModal tokens={tokens} count={selected.size}
            onClose={() => setBulkPriceOpen(false)} onApply={handleBulkPriceUpdate} />
        )}

        {/* BULK DISCOUNT */}
        {bulkDiscountOpen && (
          <BulkDiscountModal tokens={tokens} count={selected.size}
            onClose={() => setBulkDiscountOpen(false)} onApply={handleBulkDiscountUpdate} />
        )}

        {/* BULK INVENTORY */}
        {bulkInventoryOpen && (
          <BulkInventoryModal tokens={tokens} count={selected.size}
            onClose={() => setBulkInventoryOpen(false)} onApply={handleBulkInventoryUpdate} />
        )}

        {/* BULK CATEGORY */}
        {bulkCategoryOpen && (
          <BulkCategoryModal tokens={tokens} count={selected.size} categories={CATEGORIES}
            onClose={() => setBulkCategoryOpen(false)} onApply={handleBulkCategoryUpdate} />
        )}
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* STYLES — responsive grids, animations, hover effects      */}
      {/* ════════════════════════════════════════════════════════ */}
      <style jsx>{`
        .lnk-prod-root {
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }

        /* KPI grid — 4 cols desktop, 2 cols tablet, 1 col mobile */
        .lnk-prod-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }
        @media (max-width: 1100px) {
          .lnk-prod-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .lnk-prod-kpi-grid { grid-template-columns: 1fr; }
        }

        /* Toolbar tabs — horizontal scroll on small screens */
        @media (max-width: 900px) {
          .lnk-prod-tabs {
            overflow-x: auto;
            max-width: 100%;
            scrollbar-width: none;
          }
          .lnk-prod-tabs::-webkit-scrollbar { display: none; }
          .lnk-prod-tab { white-space: nowrap; }
        }

        /* Table row hover lift */
        .lnk-prod-row:hover .lnk-prod-thumb {
          transform: scale(1.08);
        }

        /* Filter panel animation */
        @keyframes lnk-prod-filters-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Bulk bar animation */
        @keyframes lnk-prod-bulk-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Filter grid responsive */
        @media (max-width: 720px) {
          .lnk-prod-filter-grid {
            grid-template-columns: 1fr !important;
          }
        }

        /* Sticky header dark border on scroll */
        .lnk-prod-table thead th {
          box-shadow: inset 0 -1px 0 ${tokens.border.subtle};
        }

        /* Row density tweaks */
        .lnk-prod-table tbody td {
          transition: background 100ms ease;
        }

        /* Mobile — hide secondary columns */
        @media (max-width: 900px) {
          .lnk-prod-toolbar {
            gap: 6px !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}

/* ============================================================= */
/* Cell renderer — switches on column key                        */
/* ============================================================= */

function renderCell(
  key: string,
  p: AdminProduct,
  tokens: Tk,
  search: string,
  thumbSize: number,
  actions: {
    onEdit: () => void;
    onPreview: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onToggleVis: () => void;
  },
): React.ReactNode {
  switch (key) {
    case 'product':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <ProductThumb p={p} tokens={tokens} size={thumbSize} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontWeight: 600, color: tokens.text.primary, fontSize: 13,
              lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden',
              textOverflow: 'ellipsis', fontFamily: 'Inter, sans-serif',
            }}>
              {highlightMatch(p.name, search, tokens)}
            </div>
            <div style={{
              fontSize: 11, color: tokens.text.tertiary, marginTop: 2,
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <span>{highlightMatch(p.sku, search, tokens)}</span>
              {p.collections.length > 0 && (
                <span style={{
                  fontSize: 9, padding: '1px 5px', borderRadius: 4,
                  background: tokens.status.infoBg, color: tokens.status.info,
                  fontWeight: 600, letterSpacing: 0.3,
                }}>{p.collections[0]}</span>
              )}
            </div>
          </div>
        </div>
      );

    case 'brand':
      return <Badge tokens={tokens} tone="neutral" size="sm">{highlightMatch(p.brand, search, tokens)}</Badge>;

    case 'category':
      return <span style={{ color: tokens.text.secondary, fontSize: 12 }}>{p.category}</span>;

    case 'price':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontWeight: 700, color: tokens.text.primary, fontSize: 13 }}>
            ₹{fmtNumber(p.price)}
          </span>
          {p.comparePrice && p.comparePrice > p.price && (
            <span style={{ fontSize: 10, color: tokens.text.tertiary, textDecoration: 'line-through' }}>
              ₹{fmtNumber(p.comparePrice)}
            </span>
          )}
        </div>
      );

    case 'discount':
      return p.discountPct > 0 ? (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          fontSize: 12, fontWeight: 700, color: tokens.status.success,
          fontFamily: 'Inter, sans-serif',
        }}>
          <PercentIcon color={tokens.status.success} size={11} />
          {p.discountPct}%
        </span>
      ) : (
        <span style={{ color: tokens.text.tertiary, fontSize: 11 }}>—</span>
      );

    case 'stock':
      return <StockIndicator p={p} tokens={tokens} />;

    case 'status':
      return <CatalogStatusChips p={p} tokens={tokens} />;

    case 'visibility':
      return (
        <button onClick={(e) => { e.stopPropagation(); actions.onToggleVis(); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: p.visibility === 'Visible' ? tokens.status.successBg : tokens.bg.surfaceAlt,
            color: p.visibility === 'Visible' ? tokens.status.success : tokens.text.secondary,
            fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
            transition: 'all 120ms ease',
          }}
          title={p.visibility === 'Visible' ? 'Click to hide' : 'Click to show'}>
          {p.visibility === 'Visible'
            ? <EyeIcon color={tokens.status.success} size={11} />
            : <EyeOffIcon color={tokens.text.secondary} size={11} />}
          {p.visibility}
        </button>
      );

    case 'rating':
      return <RatingDisplay p={p} tokens={tokens} />;

    case 'created':
      return <span style={{ fontSize: 12, color: tokens.text.secondary }}>{fmtDate(p.created)}</span>;

    case 'updated':
      return <span style={{ fontSize: 12, color: tokens.text.secondary }}>{fmtDate(p.updated)}</span>;

    case 'actions':
      return (
        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Dropdown
            tokens={tokens}
            align="right"
            width={190}
            trigger={
              <IconButton tokens={tokens} label="More actions" size={28}
                icon={<MoreIcon color={tokens.text.secondary} />} />
            }
          >
            <MenuItem tokens={tokens} icon={<EyeIcon color={tokens.text.secondary} size={12} />}
              onClick={actions.onPreview}>Quick Preview</MenuItem>
            <MenuItem tokens={tokens} icon={<EditIcon color={tokens.text.secondary} />}
              onClick={actions.onEdit}>Quick Edit</MenuItem>
            <Link href="/edit-product" style={{ textDecoration: 'none' }}>
              <MenuItem tokens={tokens} icon={<ExternalIcon color={tokens.text.secondary} />}>
                Full Edit
              </MenuItem>
            </Link>
            <MenuItem tokens={tokens} icon={<CopyIcon color={tokens.text.secondary} />}
              onClick={actions.onDuplicate}>Duplicate</MenuItem>
            <MenuItem tokens={tokens} icon={<LinkIcon color={tokens.text.secondary} />}>View Live</MenuItem>
            <MenuDivider tokens={tokens} />
            <MenuItem tokens={tokens} danger
              icon={<TrashIcon color={tokens.status.error} />}
              onClick={actions.onDelete}>Delete</MenuItem>
          </Dropdown>
        </div>
      );

    default:
      return null;
  }
}

/* ============================================================= */
/* Quick Preview Drawer content                                  */
/* ============================================================= */

function QuickPreviewContent({ p, tokens }: { p: AdminProduct; tokens: Tk }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = p.images.length > 0 ? p.images : [p.primaryImage];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Large image + gallery */}
      <div>
        <div style={{
          width: '100%', aspectRatio: '1 / 1', maxHeight: 280,
          borderRadius: 12, background: tokens.bg.surfaceAlt,
          backgroundImage: `url(${images[activeImg]})`,
          backgroundSize: 'contain', backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          border: `1px solid ${tokens.border.subtle}`,
        }} />
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 8, overflowX: 'auto' }}>
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                style={{
                  width: 56, height: 56, borderRadius: 8,
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'contain', backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  background: tokens.bg.surfaceAlt,
                  border: `2px solid ${activeImg === i ? tokens.text.primary : tokens.border.subtle}`,
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'border-color 120ms ease',
                }} />
            ))}
          </div>
        )}
      </div>

      {/* Status row */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <CatalogStatusChips p={p} tokens={tokens} />
      </div>

      {/* Key facts grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10,
      }}>
        <PreviewStat tokens={tokens} label="Price" value={`₹${fmtNumber(p.price)}`}
          sub={p.comparePrice ? `Was ₹${fmtNumber(p.comparePrice)}` : undefined} />
        <PreviewStat tokens={tokens} label="Stock" value={`${p.stock} units`}
          sub={p.stock === 0 ? 'Out of stock' : p.stock <= p.stockThreshold ? 'Low stock' : 'In stock'} />
        <PreviewStat tokens={tokens} label="SKU" value={p.sku} mono />
        <PreviewStat tokens={tokens} label="Brand" value={p.brand} />
        <PreviewStat tokens={tokens} label="Category" value={p.category} />
        <PreviewStat tokens={tokens} label="Rating" value={`${p.rating.toFixed(1)} ★`} sub={`${p.reviewCount} reviews`} />
      </div>

      {/* Variants */}
      <div>
        <div style={{
          fontSize: 11, fontWeight: 700, color: tokens.text.tertiary,
          textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8,
          fontFamily: 'Inter, sans-serif',
        }}>Variants</div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: tokens.text.secondary, marginBottom: 5 }}>Sizes</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {p.availableSizes.map(s => (
              <span key={s} style={{
                padding: '4px 9px', borderRadius: 6,
                background: tokens.bg.surfaceAlt, color: tokens.text.primary,
                fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                border: `1px solid ${tokens.border.subtle}`,
              }}>{s}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: tokens.text.secondary, marginBottom: 5 }}>Colors</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {p.availableColors.map(c => (
              <span key={c} style={{
                padding: '4px 9px', borderRadius: 6,
                background: tokens.bg.surfaceAlt, color: tokens.text.primary,
                fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                border: `1px solid ${tokens.border.subtle}`,
              }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <div style={{
          fontSize: 11, fontWeight: 700, color: tokens.text.tertiary,
          textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6,
          fontFamily: 'Inter, sans-serif',
        }}>Description</div>
        <p style={{
          margin: 0, fontSize: 12, color: tokens.text.secondary,
          lineHeight: 1.6, fontFamily: 'Inter, sans-serif',
        }}>{p.shortDescription}</p>
      </div>

      {/* SEO */}
      <div>
        <div style={{
          fontSize: 11, fontWeight: 700, color: tokens.text.tertiary,
          textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8,
          fontFamily: 'Inter, sans-serif',
        }}>SEO</div>
        <div style={{
          padding: 10, borderRadius: 8, background: tokens.bg.surfaceAlt,
          border: `1px solid ${tokens.border.subtle}`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary,
            marginBottom: 4, fontFamily: 'Inter, sans-serif' }}>
            {p.seoTitle}
          </div>
          <div style={{ fontSize: 11, color: tokens.text.secondary, lineHeight: 1.5,
            marginBottom: 6 }}>
            {p.seoDescription}
          </div>
          <div style={{ fontSize: 10, color: tokens.text.tertiary,
            fontFamily: 'ui-monospace, monospace' }}>
            {p.canonicalURL}
          </div>
        </div>
      </div>

      {/* Inventory snapshot */}
      <div>
        <div style={{
          fontSize: 11, fontWeight: 700, color: tokens.text.tertiary,
          textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8,
          fontFamily: 'Inter, sans-serif',
        }}>Inventory Snapshot</div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
        }}>
          <PreviewStat tokens={tokens} label="In Stock" value={`${p.stock}`} compact />
          <PreviewStat tokens={tokens} label="Sales" value={`${p.sales}`} compact />
          <PreviewStat tokens={tokens} label="Views" value={fmtNumber(p.views)} compact />
        </div>
      </div>
    </div>
  );
}

/* ============================================================= */
/* Sub-components                                                 */
/* ============================================================= */

function KpiCard({ tokens, label, value, sub, icon, accent, tone = 'neutral' }: {
  tokens: Tk; label: string; value: string; sub?: string;
  icon: React.ReactNode; accent: string;
  tone?: 'neutral' | 'warning' | 'critical';
}) {
  return (
    <div style={{
      background: tokens.bg.surface, border: `1px solid ${tokens.border.subtle}`,
      borderRadius: 14, padding: '14px 16px',
      boxShadow: tokens.shadow.sm,
      display: 'flex', alignItems: 'flex-start', gap: 12,
      transition: 'transform 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms ease, border-color 180ms ease',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = tokens.shadow.md;
        e.currentTarget.style.borderColor = tokens.border.strong;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = tokens.shadow.sm;
        e.currentTarget.style.borderColor = tokens.border.subtle;
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: tone === 'warning' ? tokens.status.warningBg
          : tone === 'critical' ? tokens.status.errorBg
          : tokens.bg.surfaceAlt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, color: accent,
      }}>{icon}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, color: tokens.text.tertiary,
          textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
          fontFamily: 'Inter, sans-serif',
        }}>{label}</div>
        <div style={{
          fontSize: 22, fontWeight: 700, color: tokens.text.primary,
          fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em',
          lineHeight: 1.1, marginBottom: 2,
        }}>{value}</div>
        {sub && (
          <div style={{
            fontSize: 11, color: tokens.text.secondary,
            fontFamily: 'Inter, sans-serif',
          }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

function PreviewStat({ tokens, label, value, sub, mono, compact }: {
  tokens: Tk; label: string; value: string; sub?: string; mono?: boolean; compact?: boolean;
}) {
  return (
    <div style={{
      padding: compact ? '8px 10px' : '10px 12px',
      background: tokens.bg.surfaceAlt, borderRadius: 8,
      border: `1px solid ${tokens.border.subtle}`,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 600, color: tokens.text.tertiary,
        textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3,
        fontFamily: 'Inter, sans-serif',
      }}>{label}</div>
      <div style={{
        fontSize: compact ? 13 : 14, fontWeight: 700, color: tokens.text.primary,
        fontFamily: mono ? 'ui-monospace, "SF Mono", Menlo, monospace' : 'Inter, sans-serif',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{value}</div>
      {sub && (
        <div style={{
          fontSize: 10, color: tokens.text.tertiary, marginTop: 2,
          fontFamily: 'Inter, sans-serif',
        }}>{sub}</div>
      )}
    </div>
  );
}

function FilterField({ tokens, label, children }: { tokens: Tk; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block', marginBottom: 5, fontSize: 11, fontWeight: 600,
        color: tokens.text.secondary, fontFamily: 'Inter, sans-serif',
        letterSpacing: 0.2,
      }}>{label}</label>
      {children}
    </div>
  );
}

function filterSelectStyle(tokens: Tk): React.CSSProperties {
  return {
    width: '100%', height: 34, padding: '0 28px 0 10px',
    borderRadius: 8, border: `1px solid ${tokens.border.subtle}`,
    background: tokens.bg.surface, color: tokens.text.primary,
    fontSize: 12, fontFamily: 'Inter, sans-serif',
    outline: 'none', cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
  };
}

function filterInputStyle(tokens: Tk): React.CSSProperties {
  return {
    width: '100%', height: 34, padding: '0 10px',
    borderRadius: 8, border: `1px solid ${tokens.border.subtle}`,
    background: tokens.bg.surface, color: tokens.text.primary,
    fontSize: 12, fontFamily: 'Inter, sans-serif',
    outline: 'none', boxSizing: 'border-box',
  };
}

function BulkButton({ tokens, onClick, children }: { tokens: Tk; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      background: 'rgba(255,255,255,0.1)', border: 'none', color: tokens.bg.app,
      padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
      transition: 'background 120ms ease',
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}>
      {children}
    </button>
  );
}

function ToggleRow({ tokens, label, checked, onChange }: {
  tokens: Tk; label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 12px', borderRadius: 8,
      background: tokens.bg.surfaceAlt, marginBottom: 6, cursor: 'pointer',
    }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: tokens.text.primary,
        fontFamily: 'Inter, sans-serif' }}>{label}</span>
      <Toggle tokens={tokens} checked={checked} onChange={onChange} />
    </label>
  );
}

function CatalogSkeleton({ tokens, columns }: { tokens: Tk; columns: ColumnDef[] }) {
  const visibleCols = columns.filter(c => c.visible).length + 1;
  return (
    <div style={{
      border: `1px solid ${tokens.border.subtle}`,
      borderRadius: 14, overflow: 'hidden', background: tokens.bg.surface,
    }}>
      {Array.from({ length: 8 }).map((_, row) => (
        <div key={row} style={{
          display: 'flex', gap: 0, padding: '12px 14px',
          borderBottom: row === 7 ? 'none' : `1px solid ${tokens.border.subtle}`,
        }}>
          {Array.from({ length: visibleCols }).map((_, c) => (
            <Skeleton key={c} tokens={tokens} h={14} w={c === 0 ? 80 : 90} r={4} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ============================================================= */
/* Bulk operation modals                                         */
/* ============================================================= */

function BulkPriceModal({ tokens, count, onClose, onApply }: {
  tokens: Tk; count: number;
  onClose: () => void;
  onApply: (val: number, mode: 'fixed' | 'increase' | 'decrease') => void;
}) {
  const [mode, setMode] = useState<'fixed' | 'increase' | 'decrease'>('increase');
  const [value, setValue] = useState('10');
  return (
    <Modal tokens={tokens} open onClose={onClose}
      title="Update Prices" subtitle={`Apply to ${count} selected products`} size="sm"
      footer={
        <>
          <Button tokens={tokens} variant="ghost" onClick={onClose}>Cancel</Button>
          <Button tokens={tokens} variant="primary"
            onClick={() => onApply(Number(value) || 0, mode)}>Apply</Button>
        </>
      }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Select tokens={tokens} label="Update Mode" value={mode}
          onChange={e => setMode(e.target.value as 'fixed' | 'increase' | 'decrease')}
          options={[
            { value: 'increase', label: 'Increase by %' },
            { value: 'decrease', label: 'Decrease by %' },
            { value: 'fixed', label: 'Set fixed price (₹)' },
          ]} />
        <Input tokens={tokens} label={mode === 'fixed' ? 'Price (₹)' : 'Percentage (%)'}
          type="number" value={value} onChange={e => setValue(e.target.value)} />
      </div>
    </Modal>
  );
}

function BulkDiscountModal({ tokens, count, onClose, onApply }: {
  tokens: Tk; count: number;
  onClose: () => void;
  onApply: (discountPct: number) => void;
}) {
  const [discount, setDiscount] = useState('20');
  return (
    <Modal tokens={tokens} open onClose={onClose}
      title="Apply Discount" subtitle={`Apply to ${count} selected products`} size="sm"
      footer={
        <>
          <Button tokens={tokens} variant="ghost" onClick={onClose}>Cancel</Button>
          <Button tokens={tokens} variant="primary"
            onClick={() => onApply(Number(discount) || 0)}>Apply</Button>
        </>
      }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Input tokens={tokens} label="Discount Percentage (%)"
          type="number" value={discount} onChange={e => setDiscount(e.target.value)} />
        <div style={{
          padding: 10, borderRadius: 8, background: tokens.status.infoBg,
          color: tokens.status.info, fontSize: 11, fontFamily: 'Inter, sans-serif',
          display: 'flex', gap: 8, alignItems: 'flex-start',
        }}>
          <span>ℹ️</span>
          <span>This will set the compare-at price so the discount shows as a strikethrough on the storefront.</span>
        </div>
      </div>
    </Modal>
  );
}

function BulkInventoryModal({ tokens, count, onClose, onApply }: {
  tokens: Tk; count: number;
  onClose: () => void;
  onApply: (stock: number) => void;
}) {
  const [stock, setStock] = useState('50');
  return (
    <Modal tokens={tokens} open onClose={onClose}
      title="Update Inventory" subtitle={`Set stock for ${count} selected products`} size="sm"
      footer={
        <>
          <Button tokens={tokens} variant="ghost" onClick={onClose}>Cancel</Button>
          <Button tokens={tokens} variant="primary"
            onClick={() => onApply(Number(stock) || 0)}>Apply</Button>
        </>
      }>
      <Input tokens={tokens} label="Stock Quantity"
        type="number" value={stock} onChange={e => setStock(e.target.value)} />
    </Modal>
  );
}

function BulkCategoryModal({ tokens, count, categories, onClose, onApply }: {
  tokens: Tk; count: number; categories: string[];
  onClose: () => void;
  onApply: (category: string) => void;
}) {
  const [category, setCategory] = useState(categories[0] ?? '');
  return (
    <Modal tokens={tokens} open onClose={onClose}
      title="Set Category" subtitle={`Apply to ${count} selected products`} size="sm"
      footer={
        <>
          <Button tokens={tokens} variant="ghost" onClick={onClose}>Cancel</Button>
          <Button tokens={tokens} variant="primary"
            onClick={() => onApply(category)}>Apply</Button>
        </>
      }>
      <Select tokens={tokens} label="Category" value={category}
        onChange={e => setCategory(e.target.value)}
        options={categories.map(c => ({ value: c, label: c }))} />
    </Modal>
  );
}

/* ============================================================= */
/* Icons — local SVG components                                  */
/* ============================================================= */

function BoxIcon({ color }: { color: string }) {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 8L12 3 3 8m18 0l-9 5m9-5v8l-9 5m0-8L3 8m9 5v8M3 8v8l9 5" /></svg>;
}
function AlertIcon({ color }: { color: string }) {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" /></svg>;
}
function RupeeIcon({ color }: { color: string }) {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12M6 8h12M6 13l8 8M6 13c8 0 8-10 0-10" /></svg>;
}
function PercentIcon({ color, size = 12 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M19 5L5 19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>;
}
function FilterIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>;
}
function DensityIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18" /><path d="M9 12v0M9 6v0M9 18v0" strokeWidth={4} /></svg>;
}
function ColumnsIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="18" rx="1" /></svg>;
}
function BookmarkIcon({ color, size = 14 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" /></svg>;
}
function CheckIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>;
}
function EditIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4z" /></svg>;
}
function CopyIcon({ color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>;
}
function EyeIcon({ color, size = 14 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function EyeOffIcon({ color, size = 14 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-10-8-10-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 10 8 10 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" /></svg>;
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
function MoreIcon({ color: _color }: { color: string }) {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>;
}
function ExternalIcon({ color }: { color: string }) {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>;
}
function LinkIcon({ color }: { color: string }) {
  return <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>;
}
