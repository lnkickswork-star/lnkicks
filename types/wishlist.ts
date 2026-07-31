/* =========================================================
   Wishlist — saved-for-later item and collection
   ---------------------------------------------------------
   Persisted to localStorage under `lnk_wishlist`. Used by
   the AppContext, /wishlist, and ProductCard.
   ========================================================= */

/** A single wishlist entry — lighter than CartItem. */
export interface WishlistItem {
  /** Product ID (matches Product.id). */
  id: string;
  /** Display name (denormalized). */
  name: string;
  /** Optional selling price (INR). */
  price?: number;
  /** Optional product image path (root-relative). */
  image?: string;
}

/** Convenience alias — the full wishlist collection. */
export type Wishlist = WishlistItem[];
