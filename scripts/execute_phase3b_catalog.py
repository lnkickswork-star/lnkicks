import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
app_dir = os.path.join(project_dir, "app")
catalog_dir = os.path.join(project_dir, "components", "catalog")
os.makedirs(catalog_dir, exist_ok=True)
os.makedirs(os.path.join(app_dir, "category-products"), exist_ok=True)

# 1. ProductCatalogRegistry.ts
catalog_registry_code = """/* =========================================================
   LNKICKS CENTRAL PRODUCT CATALOG REGISTRY
   ========================================================= */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  origPrice?: number;
  badge?: string;
  image: string;
  sku: string;
  gender: 'Men' | 'Women' | 'Unisex';
  inStock: boolean;
}

export const PRODUCT_CATALOG: Product[] = [
  { id: 'jordan-1-powder-blue', name: 'Air Jordan 1 Low Black Powder Blue', brand: 'NIKE', category: 'Sneakers', price: 8899, origPrice: 18899, badge: 'NEW', image: 'jordan_powder_blue_nobg.png', sku: 'AJ1-PB-01', gender: 'Unisex', inStock: true },
  { id: 'samba-og-white', name: 'Samba OG Cloud White Core Black', brand: 'ADIDAS', category: 'Sneakers', price: 9499, origPrice: 16999, badge: 'HOT', image: 'samba_og_nobg.png', sku: 'SAMBA-OG-02', gender: 'Unisex', inStock: true },
  { id: 'nike-af1-black', name: 'Nike Air Force 1 Low Triple Black', brand: 'NIKE', category: 'Lifestyle', price: 6999, origPrice: 10999, badge: 'SALE', image: 'af1_black_nobg.png', sku: 'AF1-BLK-03', gender: 'Men', inStock: true },
  { id: 'puma-velophasis', name: 'Puma Velophasis Luxury Edition', brand: 'PUMA', category: 'Running', price: 8499, origPrice: 14999, badge: 'NEW', image: 'puma_velo_nobg.png', sku: 'PUMA-VELO-04', gender: 'Unisex', inStock: true },
  { id: 'nb-9060-sea-salt', name: 'New Balance 9060 Sea Salt Gold', brand: 'NEW BALANCE', category: 'Lifestyle', price: 12999, origPrice: 19999, badge: 'HOT', image: 'nb_9060_nobg.png', sku: 'NB-9060-05', gender: 'Men', inStock: true },
  { id: 'reebok-club-c', name: 'Reebok Club C 85 Vintage', brand: 'REEBOK', category: 'Lifestyle', price: 7499, origPrice: 11999, image: 'jordan_powder_blue_nobg.png', sku: 'RBK-C85-06', gender: 'Unisex', inStock: true },
  { id: 'onitsuka-mexico-66', name: 'Onitsuka Tiger Mexico 66 Yellow', brand: 'ONITSUKA TIGER', category: 'Sneakers', price: 10999, origPrice: 15999, image: 'af1_black_nobg.png', sku: 'OT-MEX-07', gender: 'Unisex', inStock: true },
  { id: 'dunk-high-royal', name: 'Dunk High Deep Royal Edition', brand: 'NIKE', category: 'Basketball', price: 15360, origPrice: 22000, badge: 'LIMITED', image: 'jordan_powder_blue_nobg.png', sku: 'NK-DUNK-08', gender: 'Unisex', inStock: true }
];
"""

with open(os.path.join(catalog_dir, "ProductCatalogRegistry.ts"), "w", encoding="utf-8") as f:
    f.write(catalog_registry_code)

print("Created components/catalog/ProductCatalogRegistry.ts!")

# 2. app/category-products/page.tsx
catalog_page_code = """'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_CATALOG } from '@/components/catalog/ProductCatalogRegistry';

export default function CategoryProductsPage() {
  return (
    <ResponsiveAppLayout title="CATALOG">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/categories" style={{ color: '#777777', textDecoration: 'none' }}>Categories</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>All Products</span>
      </div>

      {/* HEADER & FILTER BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: 0 }}>Sneakers &amp; Apparel Catalog</h1>
          <p style={{ fontSize: '13px', color: '#777777', margin: '4px 0 0' }}>Showing {PRODUCT_CATALOG.length} authentic products</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/filters" style={{ padding: '10px 20px', background: '#F0F0F2', color: '#111111', borderRadius: '20px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            <span>Filter</span>
          </Link>
          <select style={{ padding: '10px 16px', background: '#ffffff', border: '1px solid #E0E0E0', borderRadius: '20px', fontSize: '12px', fontWeight: 600, color: '#111111', outline: 'none', cursor: 'pointer' }}>
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Drops</option>
          </select>
        </div>
      </div>

      {/* ADAPTIVE PRODUCT GRID (4-col Desktop / 2-col Mobile) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {PRODUCT_CATALOG.map((p) => (
          <ProductCard key={p.id} id={p.id} name={p.name} brand={p.brand} price={p.price} origPrice={p.origPrice} badge={p.badge} image={p.image} />
        ))}
      </div>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "category-products", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(catalog_page_code)

print("Created app/category-products/page.tsx!")
