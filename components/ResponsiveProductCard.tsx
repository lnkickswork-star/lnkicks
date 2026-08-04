'use client';

import { ProductCard as DesktopProductCard } from '@/components/ui/ProductCard';
import { ProductCard as MobileProductCard } from '@/components/mobile/ProductCard';
import { useIsMobile } from '@/lib/mobile/utils/useIsMobile';
import type { Product, CatalogProduct } from '@/types';

/**
 * ResponsiveProductCard — UA-aware wrapper that renders the mobile
 * ProductCard on mobile devices and the desktop ProductCard on desktop.
 *
 * Why this exists:
 *   The shared `Product` and `CatalogProduct` types have different field
 *   names (Product uses `comparePrice` + `primaryImage` + `slug`;
 *   CatalogProduct uses `origPrice` + `image` + no slug). The desktop and
 *   mobile ProductCard components also have different prop signatures.
 *   This wrapper normalizes both shapes and routes to the right card.
 *
 * Desktop rendering is UNCHANGED — the desktop ProductCard is rendered
 * exactly as before on desktop. Only mobile visitors get the new
 * Apple/Nike/GOAT-inspired card with the signature quarter-circle "+"
 * Add to Cart button.
 *
 * Used by:
 *   - /search
 *   - /products
 *   - /category-products
 *   - /category/[slug]
 *   - /product/[slug] (related items)
 */

export interface ResponsiveProductCardProps {
  /** A full Product (from PRODUCT_REGISTRY) — preferred. */
  product?: Product;
  /** A CatalogProduct (from PRODUCT_CATALOG) — legacy shorthand. */
  catalogProduct?: CatalogProduct;
}

/** Derive a badge string from Product flags. */
function deriveBadge(p: Product): string | undefined {
  if (p.newArrival) return 'NEW';
  if (p.limitedEdition) return 'LIMITED';
  if (p.bestSeller) return 'HOT';
  return undefined;
}

/** Derive a category label from Product flags (shown above title in blue). */
function deriveCategoryLabel(p: Product): string {
  if (p.bestSeller) return 'Best Seller';
  if (p.newArrival) return 'New Arrival';
  if (p.limitedEdition) return 'Limited Edition';
  return p.category || p.brand || 'Sneakers';
}

export function ResponsiveProductCard({
  product,
  catalogProduct,
}: ResponsiveProductCardProps) {
  const isMobile = useIsMobile();

  // During SSR + first paint, render nothing — MobileLayout also returns
  // null during this phase, so the user sees no flash. After hydration,
  // the correct card renders.
  if (isMobile === null) return null;

  // ── CatalogProduct path (legacy PRODUCT_CATALOG shape) ────────────
  if (catalogProduct) {
    const cp = catalogProduct;
    if (isMobile) {
      return (
        <MobileProductCard
          id={cp.id}
          name={cp.name}
          brand={cp.brand}
          image={cp.image.startsWith('/') ? cp.image : `/${cp.image}`}
          price={cp.price}
          comparePrice={cp.origPrice}
          href="/products"
          category={cp.category || cp.brand}
          badge={cp.badge}
          width="100%"
        />
      );
    }
    return (
      <DesktopProductCard
        id={cp.id}
        name={cp.name}
        brand={cp.brand}
        price={cp.price}
        origPrice={cp.origPrice}
        badge={cp.badge}
        image={cp.image}
      />
    );
  }

  // ── Product path (canonical PRODUCT_REGISTRY shape) ───────────────
  if (!product) return null;
  const p = product;

  if (isMobile) {
    return (
      <MobileProductCard
        id={p.id}
        name={p.name}
        brand={p.brand}
        image={p.primaryImage}
        price={p.price}
        comparePrice={p.comparePrice}
        slug={p.slug}
        category={deriveCategoryLabel(p)}
        badge={deriveBadge(p)}
        rating={p.rating}
        width="100%"
      />
    );
  }

  return (
    <DesktopProductCard
      id={p.id}
      name={p.name}
      brand={p.brand}
      price={p.price}
      origPrice={p.comparePrice}
      badge={deriveBadge(p)}
      image={p.primaryImage}
      slug={p.slug}
    />
  );
}

export default ResponsiveProductCard;
