/* =========================================================
   Product — canonical product entity
   ---------------------------------------------------------
   This is the single source of truth for product shape
   across ProductRegistry, ProductCard, product detail,
   search, and cart. The legacy "Product" interface in
   components/catalog/ProductCatalogRegistry.ts and the
   "ProductItem" interface in ProductRegistry.ts are both
   retained for backwards compatibility but aliased to
   this canonical type.
   ========================================================= */

/** Stock availability indicator shown on product cards. */
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

/** Gender / target audience used for catalog filters. */
export type ProductGender = 'Men' | 'Women' | 'Unisex';

/**
 * Full product record — used by the product detail page,
 * the search results page, and the product registry.
 */
export interface Product {
  /** Stable internal ID (e.g. `prod-aj1-powder-blue`). */
  id: string;
  /** URL-safe slug used in /product/[slug] routes. */
  slug: string;
  /** Human-readable SKU shown in admin tables. */
  sku: string;
  /** Brand name (e.g. `NIKE`, `ADIDAS`). */
  brand: string;
  /** Top-level category (e.g. `Sneakers`, `Lifestyle`). */
  category: string;
  /** Display name shown on cards and detail pages. */
  name: string;
  /** One-line description used on cards and OG metadata. */
  shortDescription: string;
  /** Selling price in the smallest currency unit (INR). */
  price: number;
  /** Optional was-price for strike-through display. */
  comparePrice?: number;
  /** ISO 4217 currency code (default `INR`). */
  currency: string;
  /** All product image paths (root-relative). */
  images: string[];
  /** Image path used for cards, OG metadata, and thumbnails. */
  primaryImage: string;
  /** Optional hover image shown on card mouseover. */
  hoverImage?: string;
  /** Available size labels (e.g. `UK 7`). */
  availableSizes: string[];
  /** Available color labels (e.g. `Powder Blue`). */
  availableColors: string[];
  /** Stock status badge value. */
  stockStatus: StockStatus;
  /** True if featured on the homepage hero. */
  featured?: boolean;
  /** True if shown in the "New Arrivals" rail. */
  newArrival?: boolean;
  /** True if shown in the "Best Sellers" rail. */
  bestSeller?: boolean;
  /** True if shown in the "Limited Edition" rail. */
  limitedEdition?: boolean;
  /** Aggregate rating 0–5 (one decimal). */
  rating: number;
  /** Number of customer reviews. */
  reviewCount: number;
  /** Free-form tags used by search and filter facets. */
  tags: string[];
  /** SEO <title> for the product detail page. */
  seoTitle: string;
  /** SEO meta description for the product detail page. */
  seoDescription: string;
  /** Canonical path beginning with `/`. */
  canonicalURL: string;
}

/**
 * Lightweight catalog row — used by the legacy
 * ProductCatalogRegistry, the home grid, and the
 * admin inventory table. Excludes SEO and slug fields
 * that are only relevant on the detail page.
 */
export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  /** Optional was-price for strike-through display. */
  origPrice?: number;
  /** Optional badge label (e.g. `NEW`, `HOT`, `SALE`). */
  badge?: string;
  /** Primary image path (root-relative). */
  image: string;
  sku: string;
  gender: ProductGender;
  inStock: boolean;
}

/** Helper type — a Product's slug for routing. */
export type ProductSlug = Product['slug'];
