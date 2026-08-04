/**
 * Per-size inventory store — single source of truth for "Only X left".
 *
 * Backed by localStorage under `lnk_inventory`. Seeded on first access
 * from ProductRegistry with realistic per-(product, size) stock counts.
 * Decremented when an order is placed (see app/checkout/page.tsx →
 * handlePlaceOrder). Read by the product detail page to render the
 * "Only N left" low-stock pill.
 *
 * WHY LOCALSTORAGE (no backend yet):
 *   The site is currently a storefront demo with localStorage-based
 *   cart + orders. The inventory store follows the same pattern so the
 *   UX matches what the user described: "एक बिक गया तो automatically
 *   inventory में change हो जाएगा, यहाँ दिखा देगा only 11 left"
 *   ("once one sells, inventory auto-updates, shows only 11 left").
 *
 *   When a real backend is wired, swap the four exported functions
 *   for fetch() calls — the function signatures are intentionally
 *   backend-friendly (sync now, but trivially convertible to async).
 *
 * STORAGE SHAPE:
 *   {
 *     version: 1,
 *     stock: {
 *       "prod-aj1-powder-blue|EU 40": 12,
 *       "prod-aj1-powder-blue|EU 41": 3,
 *       ...
 *     }
 *   }
 *
 *   The composite key `productId|size` matches the same join used by
 *   the old deterministic hash in app/product/[slug]/page.tsx, so the
 *   migration is drop-in.
 */

import { PRODUCT_REGISTRY } from '@/components/catalog/ProductRegistry';

const STORAGE_KEY = 'lnk_inventory';
const STORAGE_VERSION = 1;
const LOW_STOCK_THRESHOLD = 5;
const OUT_OF_STOCK = 0;

interface InventoryStore {
  version: number;
  stock: Record<string, number>;
}

/**
 * Deterministic seed generator — turns (productId, size) into a stable
 * starting stock count in the range [3, 15].
 *
 * Same (product, size) always seeds the same initial count, so a fresh
 * visitor sees consistent numbers across reloads. The variation across
 * sizes within a product mirrors real retail (some sizes sell faster).
 *
 * Range [3, 15] means ~30% of sizes start low-stock (≤5) — enough that
 * the "Only N left" pill shows up naturally on a few sizes per product,
 * but most sizes have healthy stock.
 */
function seedStock(productId: string, size: string): number {
  let h = 0;
  const s = `${productId}|${size}`;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return 3 + (h % 13); // 3..15
}

/** Read the raw store from localStorage, or seed it on first access. */
function readStore(): InventoryStore {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { version: STORAGE_VERSION, stock: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as InventoryStore;
      if (parsed && parsed.version === STORAGE_VERSION && parsed.stock) {
        return parsed;
      }
    }
  } catch {
    // fall through to reseed
  }
  // Seed fresh — iterate every product × every size
  const stock: Record<string, number> = {};
  for (const product of PRODUCT_REGISTRY) {
    for (const size of product.availableSizes) {
      const key = `${product.id}|${size}`;
      stock[key] = seedStock(product.id, size);
    }
  }
  const store: InventoryStore = { version: STORAGE_VERSION, stock };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota — read paths will still work in-memory
  }
  return store;
}

/** Write the store back to localStorage. */
function writeStore(store: InventoryStore): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota / serialization errors
  }
}

/** Composite key — matches the seeding convention. */
function keyFor(productId: string, size: string): string {
  return `${productId}|${size}`;
}

/**
 * Get the current stock count for a specific (product, size) pair.
 *
 * Returns 0 for unknown combinations (treated as out-of-stock by the
 * caller — disabled size button). This is intentional: a size that
 * isn't in the registry shouldn't be selectable.
 */
export function getStock(productId: string, size: string): number {
  const store = readStore();
  return store.stock[keyFor(productId, size)] ?? 0;
}

/**
 * Get a stock map for every size of a product — convenient for the
 * product detail page which renders all sizes in one pass.
 *
 *   { 'EU 40': 12, 'EU 41': 3, 'EU 42': 7, ... }
 */
export function getStockBySize(productId: string): Record<string, number> {
  const store = readStore();
  const out: Record<string, number> = {};
  for (const product of PRODUCT_REGISTRY) {
    if (product.id !== productId) continue;
    for (const size of product.availableSizes) {
      const k = keyFor(productId, size);
      out[size] = store.stock[k] ?? 0;
    }
  }
  return out;
}

/**
 * Decrement stock for a (product, size) pair by `qty`.
 *
 * Called from app/checkout/page.tsx → handlePlaceOrder when an order
 * is placed. Never goes below 0 — clamped to 0 so an accidental
 * oversell doesn't produce a negative "Only -1 left" badge.
 *
 * Returns the new stock count (useful for callers that want to confirm
 * the decrement happened).
 */
export function decrementStock(
  productId: string,
  size: string,
  qty: number = 1,
): number {
  const store = readStore();
  const k = keyFor(productId, size);
  const current = store.stock[k] ?? 0;
  const next = Math.max(0, current - qty);
  store.stock[k] = next;
  writeStore(store);
  return next;
}

/**
 * Bulk decrement for an entire cart — used by checkout to atomically
 * reduce inventory for every line item in one call.
 *
 * Accepts the loose shape that CartItem[] has: { id, size?, qty }.
 * If size is missing, the decrement is skipped (can't target a size).
 */
export function decrementStockForCart(
  items: Array<{ id: string; size?: string; qty: number }>,
): void {
  if (!items || items.length === 0) return;
  const store = readStore();
  let mutated = false;
  for (const item of items) {
    if (!item.id || !item.size) continue;
    const k = keyFor(item.id, item.size);
    const current = store.stock[k] ?? 0;
    const next = Math.max(0, current - (item.qty || 1));
    if (next !== current) {
      store.stock[k] = next;
      mutated = true;
    }
  }
  if (mutated) writeStore(store);
}

/** True when stock ≤ LOW_STOCK_THRESHOLD and > 0 (so the pill makes sense). */
export function isLowStock(count: number): boolean {
  return count > OUT_OF_STOCK && count <= LOW_STOCK_THRESHOLD;
}

/** True when stock is 0 — caller should disable the size button. */
export function isOutOfStock(count: number): boolean {
  return count <= OUT_OF_STOCK;
}

/** The threshold below which the "Only N left" pill renders. */
export const LOW_STOCK_LIMIT = LOW_STOCK_THRESHOLD;

/**
 * Developer / admin helper — reset inventory back to seeded defaults.
 * Useful for testing the full lifecycle (buy → decrement → reset).
 *
 * Not wired to any UI yet — call from the browser console:
 *   import('@/lib/inventory/stockStore').then(m => m.resetInventory())
 */
export function resetInventory(): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Force reseed on next read
    readStore();
  } catch {
    // ignore
  }
}
