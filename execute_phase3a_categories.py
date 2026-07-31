import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
app_dir = os.path.join(project_dir, "app")
cat_dir = os.path.join(project_dir, "components", "category")
os.makedirs(cat_dir, exist_ok=True)
os.makedirs(os.path.join(app_dir, "category", "[slug]"), exist_ok=True)

# 1. CategoryRegistry.ts
category_registry_code = """/* =========================================================
   LNKICKS CENTRAL CATEGORY REGISTRY & MODEL
   ========================================================= */

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  featured?: boolean;
}

export const CATEGORY_REGISTRY: Category[] = [
  { id: 'cat-sneakers', slug: 'sneakers', name: 'Sneakers', description: 'Hyped drops, iconic silhouettes, and luxury athletic sneakers.', image: 'jordan_powder_blue_nobg.png', icon: '👟', productCount: 450, featured: true },
  { id: 'cat-running', slug: 'running', name: 'Running & Performance', description: 'High-performance running shoes built for maximum speed & comfort.', image: 'samba_og_nobg.png', icon: '⚡', productCount: 220, featured: true },
  { id: 'cat-basketball', slug: 'basketball', name: 'Basketball', description: 'Retro Jordans and signature basketball footwear.', image: 'jordan_powder_blue_nobg.png', icon: '🏀', productCount: 310, featured: true },
  { id: 'cat-lifestyle', slug: 'lifestyle', name: 'Lifestyle & Streetwear', description: 'Everyday casual heat and streetwear statement kicks.', image: 'af1_black_nobg.png', icon: '🔥', productCount: 520, featured: true },
  { id: 'cat-training', slug: 'training', name: 'Training & Gym', description: 'Durable cross-trainers and workout footwear.', image: 'puma_velo_nobg.png', icon: '💪', productCount: 180 },
  { id: 'cat-slides', slug: 'slides', name: 'Slides & Foam', description: 'Luxury foam slides and comfortable slip-ons.', image: 'samba_og_nobg.png', icon: '🩴', productCount: 140 },
  { id: 'cat-accessories', slug: 'accessories', name: 'Accessories & Care', description: 'Premium shoe cleaner kits, socks, and keychains.', image: 'nb_9060_nobg.png', icon: '🎒', productCount: 95 },
  { id: 'cat-limited', slug: 'limited-edition', name: 'Limited Edition', description: 'Exclusive member-only drops and rare grails.', image: 'jordan_powder_blue_nobg.png', icon: '👑', productCount: 65, featured: true }
];
"""

with open(os.path.join(cat_dir, "CategoryRegistry.ts"), "w", encoding="utf-8") as f:
    f.write(category_registry_code)

print("Created components/category/CategoryRegistry.ts!")

# 2. app/categories/page.tsx
categories_page_code = """'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { CATEGORY_REGISTRY } from '@/components/category/CategoryRegistry';

export default function CategoriesPage() {
  return (
    <ResponsiveAppLayout title="CATEGORIES">
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>Categories</span>
      </div>

      {/* HERO BANNER */}
      <div style={{ background: '#111111', borderRadius: '24px', padding: '36px 32px', color: '#ffffff', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FF3B30', marginBottom: '8px' }}>EXPLORE CATALOG</div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '36px', fontWeight: 800, textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>Sneaker &amp; Apparel Categories</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', maxWidth: '480px', marginTop: '12px', marginBottom: 0 }}>Browse our curated collection by brand, performance, or lifestyle style.</p>
      </div>

      {/* CATEGORIES ADAPTIVE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
        {CATEGORY_REGISTRY.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '20px', border: '1px solid #EBEBEB', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '210px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', transition: 'transform 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '28px' }}>{cat.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#777777', background: '#F6F6F6', padding: '4px 10px', borderRadius: '12px' }}>{cat.productCount} Items</span>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: '0 0 6px' }}>{cat.name}</h3>
                <p style={{ fontSize: '12px', color: '#777777', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{cat.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "categories", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(categories_page_code)

print("Created app/categories/page.tsx!")

# 3. app/category/[slug]/page.tsx
category_slug_code = """'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';
import { CATEGORY_REGISTRY } from '@/components/category/CategoryRegistry';

export default function CategorySlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const category = CATEGORY_REGISTRY.find(c => c.slug === slug) || {
    name: slug ? slug.toUpperCase().replace('-', ' ') : 'CATEGORY',
    description: 'Explore premium authentic items in this category.',
    icon: '👟',
    productCount: 120
  };

  return (
    <ResponsiveAppLayout title={category.name}>
      {/* BREADCRUMB */}
      <div style={{ fontSize: '12px', color: '#777777', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ color: '#777777', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/categories" style={{ color: '#777777', textDecoration: 'none' }}>Categories</Link>
        <span>/</span>
        <span style={{ color: '#111111', fontWeight: 600 }}>{category.name}</span>
      </div>

      {/* CATEGORY HEADER */}
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '36px 32px', border: '1px solid #EBEBEB', marginBottom: '32px' }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>{category.icon}</div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, textTransform: 'uppercase', color: '#111111', margin: 0 }}>{category.name}</h1>
        <p style={{ fontSize: '14px', color: '#777777', marginTop: '8px', marginBottom: 0 }}>{category.description}</p>
      </div>

      {/* CATEGORY PRODUCTS LINK PLACEHOLDER */}
      <div style={{ textAlign: 'center', padding: '60px 20px', background: '#F8F8FA', borderRadius: '24px' }}>
        <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '20px', fontWeight: 800, color: '#111111' }}>{category.productCount} Products Available</h3>
        <p style={{ fontSize: '13px', color: '#777777', margin: '8px 0 24px' }}>View all products listed under {category.name}.</p>
        <Link href={`/category-products?cat=${slug}`} style={{ display: 'inline-block', padding: '14px 32px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em' }}>
          VIEW ALL PRODUCTS →
        </Link>
      </div>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "category", "[slug]", "page.tsx"), "w", encoding="utf-8") as f:
    f.write(category_slug_code)

print("Created app/category/[slug]/page.tsx!")
