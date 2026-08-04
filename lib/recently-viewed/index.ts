/**
 * Recently-viewed products storage helpers.
 *
 * Persisted to localStorage under `lnk_recently_viewed` as an array
 * of RecentItem snapshots, newest first. Capped at MAX_ITEMS (24).
 *
 * Usage:
 *   import { pushRecentlyViewed, getRecentlyViewed, clearRecentlyViewed } from '@/lib/recently-viewed';
 */

export const RECENTLY_VIEWED_KEY = 'lnk_recently_viewed';
export const RECENTLY_VIEWED_MAX = 24;

export interface RecentItem {
  id: string;
  brand: string;
  name: string;
  price: string;
  priceValue: number;
  comparePrice?: string;
  image: string;
  href: string;
  viewedAt: string;
}

/** Push a product snapshot to the top of the recently-viewed list. */
export function pushRecentlyViewed(product: Omit<RecentItem, 'viewedAt'>): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const existing: RecentItem[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter((x) => x.id !== product.id);
    const next: RecentItem = { ...product, viewedAt: new Date().toISOString() };
    const updated = [next, ...filtered].slice(0, RECENTLY_VIEWED_MAX);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  } catch {
    // ignore quota / parse errors
  }
}

/** Read the recently-viewed list (newest first). */
export function getRecentlyViewed(): RecentItem[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, RECENTLY_VIEWED_MAX);
  } catch {
    return [];
  }
}

/** Clear the recently-viewed list. */
export function clearRecentlyViewed(): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch {
    // ignore
  }
}
