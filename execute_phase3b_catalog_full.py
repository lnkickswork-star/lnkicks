import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
app_dir = os.path.join(project_dir, "app")
cat_dir = os.path.join(project_dir, "components", "catalog")
os.makedirs(cat_dir, exist_ok=True)
os.makedirs(os.path.join(app_dir, "products"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "category", "[slug]"), exist_ok=True)

# 1. ProductRegistry.ts
product_registry_code = """/* =========================================================
   LNKICKS CENTRALIZED PRODUCT REGISTRY & DATA MODEL
   ========================================================= */

export interface ProductItem {
  id: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  name: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  currency: string;
  images: string[];
  primaryImage: string;
  hoverImage?: string;
  availableSizes: string[];
  availableColors: string[];
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  limitedEdition?: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  canonicalURL: string;
}

export const PRODUCT_REGISTRY: ProductItem[] = [
  {
    id: 'prod-aj1-powder-blue',
    slug: 'air-jordan-1-low-black-powder-blue',
    sku: 'AJ1-PB-01',
    brand: 'NIKE',
    category: 'Sneakers',
    name: 'Air Jordan 1 Low Black Powder Blue',
    shortDescription: 'Classic low-top silhouette in iconic Carolina blue and black leather.',
    price: 8899,
    comparePrice: 18899,
    currency: 'INR',
    images: ['/jordan_powder_blue_nobg.png'],
    primaryImage: '/jordan_powder_blue_nobg.png',
    availableSizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Powder Blue', 'Black'],
    stockStatus: 'In Stock',
    featured: true,
    newArrival: true,
    rating: 4.9,
    reviewCount: 128,
    tags: ['Jordan', 'Low', 'Powder Blue'],
    seoTitle: 'Air Jordan 1 Low Powder Blue — LNKICKS',
    seoDescription: 'Buy authentic Air Jordan 1 Low Powder Blue in India.',
    canonicalURL: '/product/air-jordan-1-low-black-powder-blue'
  },
  {
    id: 'prod-samba-og-white',
    slug: 'samba-og-cloud-white-core-black',
    sku: 'SAMBA-OG-02',
    brand: 'ADIDAS',
    category: 'Sneakers',
    name: 'Samba OG Cloud White Core Black',
    shortDescription: 'Timeless terrace sneaker with full-grain leather and gum sole.',
    price: 9499,
    comparePrice: 16999,
    currency: 'INR',
    images: ['/samba_og_nobg.png'],
    primaryImage: '/samba_og_nobg.png',
    availableSizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9'],
    availableColors: ['White', 'Core Black'],
    stockStatus: 'In Stock',
    bestSeller: true,
    rating: 4.8,
    reviewCount: 94,
    tags: ['Samba', 'Adidas', 'Terrace'],
    seoTitle: 'Adidas Samba OG White — LNKICKS',
    seoDescription: 'Authentic Adidas Samba OG Cloud White in India.',
    canonicalURL: '/product/samba-og-cloud-white-core-black'
  },
  {
    id: 'prod-af1-triple-black',
    slug: 'nike-air-force-1-low-triple-black',
    sku: 'AF1-BLK-03',
    brand: 'NIKE',
    category: 'Lifestyle',
    name: 'Nike Air Force 1 Low Triple Black',
    shortDescription: 'Stealthy all-black leather Air Force 1 with encapsulated Nike Air cushion.',
    price: 6999,
    comparePrice: 10999,
    currency: 'INR',
    images: ['/af1_black_nobg.png'],
    primaryImage: '/af1_black_nobg.png',
    availableSizes: ['UK 8', 'UK 9', 'UK 10'],
    availableColors: ['Black'],
    stockStatus: 'In Stock',
    featured: true,
    rating: 4.7,
    reviewCount: 210,
    tags: ['AF1', 'Triple Black', 'Nike'],
    seoTitle: 'Nike Air Force 1 Triple Black — LNKICKS',
    seoDescription: 'Shop Nike Air Force 1 Low Triple Black online.',
    canonicalURL: '/product/nike-air-force-1-low-triple-black'
  },
  {
    id: 'prod-puma-velophasis',
    slug: 'puma-velophasis-luxury-edition',
    sku: 'PUMA-VELO-04',
    brand: 'PUMA',
    category: 'Running',
    name: 'Puma Velophasis Luxury Edition',
    shortDescription: 'Y2K hybrid runner with metallic overlays and breathable mesh.',
    price: 8499,
    comparePrice: 14999,
    currency: 'INR',
    images: ['/puma_velo_nobg.png'],
    primaryImage: '/puma_velo_nobg.png',
    availableSizes: ['UK 7', 'UK 8', 'UK 9'],
    availableColors: ['Silver', 'Grey'],
    stockStatus: 'In Stock',
    newArrival: true,
    rating: 4.6,
    reviewCount: 45,
    tags: ['Puma', 'Runner', 'Velophasis'],
    seoTitle: 'Puma Velophasis — LNKICKS',
    seoDescription: 'Buy Puma Velophasis Luxury Edition.',
    canonicalURL: '/product/puma-velophasis-luxury-edition'
  },
  {
    id: 'prod-nb-9060-sea-salt',
    slug: 'new-balance-9060-sea-salt-gold',
    sku: 'NB-9060-05',
    brand: 'NEW BALANCE',
    category: 'Lifestyle',
    name: 'New Balance 9060 Sea Salt Gold',
    shortDescription: 'Futuristic chunky silhouette with ABZORB dual-density midsole.',
    price: 12999,
    comparePrice: 19999,
    currency: 'INR',
    images: ['/nb_9060_nobg.png'],
    primaryImage: '/nb_9060_nobg.png',
    availableSizes: ['UK 8', 'UK 9', 'UK 10', 'UK 11'],
    availableColors: ['Sea Salt', 'Gold'],
    stockStatus: 'In Stock',
    limitedEdition: true,
    rating: 4.9,
    reviewCount: 180,
    tags: ['NB 9060', 'New Balance', 'Sea Salt'],
    seoTitle: 'New Balance 9060 Sea Salt Gold — LNKICKS',
    seoDescription: 'Authentic New Balance 9060 Sea Salt Gold.',
    canonicalURL: '/product/new-balance-9060-sea-salt-gold'
  }
];
"""

with open(os.path.join(cat_dir, "ProductRegistry.ts"), "w", encoding="utf-8") as f:
    f.write(product_registry_code)

print("Created components/catalog/ProductRegistry.ts!")

# 2. app/products/page.tsx
products_page_code = """'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';

export default function ProductsPage() {
  return (
    <ResponsiveAppLayout title="ALL PRODUCTS">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>All Products</span>
      </div>

      {/* COLLECTION BANNER */}
      <div style={{ background: '#111111', borderRadius: '24px', padding: '36px 32px', color: '#ffffff', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FF3B30', marginBottom: '6px' }}>LNKICKS COLLECTION</div>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', margin: 0 }}>Authentic Luxury Footwear</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '8px', marginBottom: 0 }}>Showing {PRODUCT_REGISTRY.length} authentic products</p>
        </div>
      </div>

      {/* TOOLBAR: FILTER DRAWER & SORT DROPDOWN SHELL */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{ padding: '10px 20px', background: '#F0F0F2', color: '#111111', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            <span>Filter (Brand, Size, Color)</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#777777', fontWeight: 500 }}>Sort by:</span>
          <select style={{ padding: '10px 16px', background: '#ffffff', border: '1px solid #E0E0E0', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#111111', outline: 'none', cursor: 'pointer' }}>
            <option>Featured</option>
            <option>Newest</option>
            <option>Price: Low → High</option>
            <option>Price: High → Low</option>
            <option>Best Selling</option>
          </select>
        </div>
      </div>

      {/* ADAPTIVE PRODUCT GRID (4-col Desktop / 2-col Mobile) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {PRODUCT_REGISTRY.map((p) => (
          <ProductCard key={p.id} id={p.id} name={p.name} brand={p.brand} price={p.price} origPrice={p.comparePrice} badge={p.newArrival ? 'NEW' : p.limitedEdition ? 'LIMITED' : p.bestSeller ? 'HOT' : undefined} image={p.primaryImage} />
        ))}
      </div>

      {/* PAGINATION UI SHELL */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #E0E0E0', background: '#ffffff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Prev</button>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#111111', color: '#ffffff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>1</button>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #E0E0E0', background: '#ffffff', fontSize: '12px', fontWeight 600, cursor: 'pointer' }}>2</button>
        <button style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #E0E0E0', background: '#ffffff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Next</button>
      </div>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "products", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(products_page_code)

print("Created app/products/page.tsx!")

# 3. app/category/[slug]/page.tsx (Updated with Product Listing Grid)
category_slug_products_code = """'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';

export default function CategorySlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const categoryName = slug ? slug.toUpperCase().replace('-', ' ') : 'CATEGORY';

  return (
    <ResponsiveAppLayout title={categoryName}>
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/categories" style={{ color: '#777777', textDecoration: 'none' }}>Categories</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>{categoryName}</span>
      </div>

      {/* CATEGORY TITLE & SUMMARY */}
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid #EBEBEB', marginBottom: '28px' }}>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: 0 }}>{categoryName}</h1>
        <p style={{ fontSize: '13px', color: '#777777', marginTop: '6px', marginBottom: 0 }}>Showing authentic luxury items in {categoryName}.</p>
      </div>

      {/* ADAPTIVE PRODUCT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {PRODUCT_REGISTRY.map((p) => (
          <ProductCard key={p.id} id={p.id} name={p.name} brand={p.brand} price={p.price} origPrice={p.comparePrice} badge={p.newArrival ? 'NEW' : p.limitedEdition ? 'LIMITED' : p.bestSeller ? 'HOT' : undefined} image={p.primaryImage} />
        ))}
      </div>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "category", "[slug]", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(category_slug_products_code)

print("Updated app/category/[slug]/page.tsx!")
