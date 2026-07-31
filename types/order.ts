/* =========================================================
   Order — placed order record
   ---------------------------------------------------------
   Persisted to localStorage under `lnk_orders`. Used by
   /my-orders, /order-detail, /order-success, /track-order,
   and /orders-management.
   ========================================================= */

import type { CartItem } from './cart';
import type { UserAddress } from './user';

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMode = 'UPI' | 'Card' | 'NetBanking' | 'COD' | 'Wallet';

export interface OrderItem {
  /** Display name (snapshot at order time). */
  name: string;
  /** Quantity ordered. */
  qty: number;
  /** Unit price snapshot (INR). */
  price: number;
  /** Product image path (root-relative). */
  image?: string;
  /** Size snapshot, if applicable. */
  size?: string;
}

export interface Order {
  /** Human-readable order ID (e.g. `LNK-784912`). */
  orderId: string;
  /** ISO 8601 placement timestamp. */
  date: string;
  /** Final payable amount (INR). */
  total: number;
  /** Selected payment mode. */
  paymentMode: PaymentMode;
  /** Snapshot of items at order time. */
  items: OrderItem[] | CartItem[];
  /** Snapshot of shipping address. */
  shipping?: UserAddress;
  /** Current fulfillment status. */
  status?: OrderStatus;
  /** Optional tracking number for shipped orders. */
  trackingNumber?: string;
  /** Optional courier partner name. */
  courier?: string;
}

/** Helper type — a row in the admin orders management table. */
export type OrderTableRow = Pick<
  Order,
  'orderId' | 'date' | 'total' | 'paymentMode' | 'status'
> & {
  /** Customer name (denormalized for admin view). */
  customer: string;
  /** Total item count across all line items. */
  itemsCount: number;
};
