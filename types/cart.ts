/* =========================================================
   CartItem — shopping cart line item
   ---------------------------------------------------------
   Persisted to localStorage under `lnk_cart`. Used by the
   AppContext, /cart, /checkout, and ProductCard.
   ========================================================= */

export interface CartItem {
  /** Product ID (matches Product.id). */
  id: string;
  /** Display name (denormalized for cart rendering). */
  name: string;
  /** Selling price per unit (INR). */
  price: number;
  /** Product image path (root-relative). */
  image: string;
  /** Selected size label, if applicable. */
  size?: string;
  /** Selected color label, if applicable. */
  color?: string;
  /** Quantity in the cart (>=1). */
  qty: number;
}

/** Derived cart totals returned by cart selector helpers. */
export interface CartTotals {
  /** Sum of price * qty across all items. */
  subtotal: number;
  /** Flat 10% member discount. */
  discount: number;
  /** 5% GST applied to (subtotal - discount). */
  tax: number;
  /** Final payable amount. */
  total: number;
  /** Total quantity across all line items. */
  itemCount: number;
}
