/* =========================================================
   LNKICKS CANONICAL ROUTE REGISTRY & NAVIGATION MANAGER
   ---------------------------------------------------------
   The `RouteMeta` interface is re-exported from /types
   so consumers can keep importing from this module.
   ========================================================= */

import type { RouteMeta } from '@/types';
export type { RouteMeta } from '@/types';

export const ROUTE_REGISTRY: Record<string, RouteMeta> = {
  HOME: { path: '/', title: 'LNKICKS — Stocked & Loaded', layout: 'responsive-app', category: 'core' },

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
