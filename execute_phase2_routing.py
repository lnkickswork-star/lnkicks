import os

project_dir = r"c:\Users\sagar\Desktop\lnkcks"
app_dir = os.path.join(project_dir, "app")
nav_dir = os.path.join(project_dir, "components", "navigation")
os.makedirs(nav_dir, exist_ok=True)

# 1. RouteRegistry.ts (components/navigation/RouteRegistry.ts)
route_registry_code = """/* =========================================================
   LNKICKS CANONICAL ROUTE REGISTRY & NAVIGATION MANAGER
   ========================================================= */

export interface RouteMeta {
  path: string;
  title: string;
  layout: 'desktop-locked' | 'mobile-locked' | 'responsive-app' | 'admin-layout';
  category: 'core' | 'catalog' | 'commerce' | 'account' | 'support' | 'admin';
}

export const ROUTE_REGISTRY: Record<string, RouteMeta> = {
  HOME: { path: '/', title: 'LNKICKS — Stocked & Loaded', layout: 'desktop-locked', category: 'core' },
  DESKTOP_HOME: { path: '/desktop', title: 'LNKICKS — Stocked & Loaded', layout: 'desktop-locked', category: 'core' },
  MOBILE_HOME: { path: '/mobile', title: 'LNKICKS — Mobile App', layout: 'mobile-locked', category: 'core' },
  
  CATEGORIES: { path: '/categories', title: 'Categories — LNKICKS', layout: 'responsive-app', category: 'catalog' },
  CATEGORY_PRODUCTS: { path: '/category-products', title: 'Sneakers & Apparel — LNKICKS', layout: 'responsive-app', category: 'catalog' },
  PRODUCT_DETAIL: { path: '/product-detail', title: 'Product Detail — LNKICKS', layout: 'responsive-app', category: 'catalog' },
  SEARCH: { path: '/search', title: 'Search — LNKICKS', layout: 'responsive-app', category: 'catalog' },
  FILTERS: { path: '/filters', title: 'Filter Products — LNKICKS', layout: 'responsive-app', category: 'catalog' },

  CART: { path: '/cart', title: 'Shopping Cart — LNKICKS', layout: 'responsive-app', category: 'commerce' },
  CHECKOUT: { path: '/checkout', title: 'Checkout — LNKICKS', layout: 'responsive-app', category: 'commerce' },
  ORDER_SUCCESS: { path: '/order-success', title: 'Order Success — LNKICKS', layout: 'responsive-app', category: 'commerce' },

  PROFILE: { path: '/profile', title: 'User Profile — LNKICKS', layout: 'responsive-app', category: 'account' },
  MY_ORDERS: { path: '/my-orders', title: 'My Orders — LNKICKS', layout: 'responsive-app', category: 'account' },
  ORDER_DETAIL: { path: '/order-detail', title: 'Order Details — LNKICKS', layout: 'responsive-app', category: 'account' },
  ADDRESSES: { path: '/addresses', title: 'Saved Addresses — LNKICKS', layout: 'responsive-app', category: 'account' },
  WISHLIST: { path: '/wishlist', title: 'My Wishlist — LNKICKS', layout: 'responsive-app', category: 'account' },

  ADMIN_LOGIN: { path: '/admin-login', title: 'Admin Portal Login — LNKICKS', layout: 'admin-layout', category: 'admin' },
  DASHBOARD: { path: '/dashboard', title: 'Admin Dashboard — LNKICKS', layout: 'admin-layout', category: 'admin' },
};
"""

with open(os.path.join(nav_dir, "RouteRegistry.ts"), "w", encoding="utf-8") as f:
    f.write(route_registry_code)

print("Created components/navigation/RouteRegistry.ts!")

# 2. app/not-found.tsx
not_found_code = """'use client';

import React from 'react';
import Link from 'next/link';
import { ResponsiveAppLayout } from '@/components/layout/ResponsiveAppLayout';

export default function NotFound() {
  return (
    <ResponsiveAppLayout title="404 NOT FOUND">
      <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '72px', fontWeight: 800, color: '#111111', lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 700, margin: '16px 0 8px', textTransform: 'uppercase' }}>Page Not Found</h1>
        <p style={{ fontSize: '14px', color: '#777777', marginBottom: '28px' }}>The page or drop you are looking for does not exist or has been moved.</p>
        <Link href="/" style={{ display: 'inline-block', padding: '14px 32px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em' }}>
          RETURN TO HOME
        </Link>
      </div>
    </ResponsiveAppLayout>
  );
}
"""

with open(os.path.join(app_dir, "not-found.tsx"), "w", encoding="utf-8") as f:
    f.write(not_found_code)

print("Created app/not-found.tsx!")

# 3. app/error.tsx
error_code = """'use client';

import React from 'react';

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: "'Inter', sans-serif", background: '#ffffff', minHeight: '100vh' }}>
      <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '32px', fontWeight: 800, color: '#111111' }}>Something went wrong!</h2>
      <p style={{ fontSize: '14px', color: '#777777', margin: '12px 0 24px' }}>{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={() => reset()} style={{ padding: '14px 32px', background: '#111111', color: '#ffffff', borderRadius: '30px', fontFamily: "'Oswald', sans-serif", fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
        TRY AGAIN
      </button>
    </div>
  );
}
"""

with open(os.path.join(app_dir, "error.tsx"), "w", encoding="utf-8") as f:
    f.write(error_code)

print("Created app/error.tsx!")

# 4. app/loading.tsx
loading_code = """'use client';

import React from 'react';

export default function Loading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#ffffff' }}>
      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 800, letterSpacing: '0.14em', color: '#111111' }}>
        LNKICKS...
      </div>
    </div>
  );
}
"""

with open(os.path.join(app_dir, "loading.tsx"), "w", encoding="utf-8") as f:
    f.write(loading_code)

print("Created app/loading.tsx!")
