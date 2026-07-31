/* =========================================================
   User — authenticated user profile
   ---------------------------------------------------------
   Persisted to localStorage under `lnk_user`. Used by the
   /profile, /login, /register, and /checkout pages.
   ========================================================= */

export interface UserAddress {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  /** Optional phone for delivery contact. */
  phone?: string;
  /** True if this is the default shipping address. */
  isDefault?: boolean;
}

export interface User {
  /** Internal user ID (e.g. `usr-001`). */
  id: string;
  /** Display name shown in header / profile. */
  name: string;
  /** Login email — unique. */
  email: string;
  /** Optional phone with country code. */
  phone?: string;
  /** Optional avatar image path. */
  avatar?: string;
  /** Saved addresses for checkout. */
  addresses: UserAddress[];
  /** Loyalty tier badge. */
  tier: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
  /** Loyalty points balance. */
  loyaltyPoints: number;
  /** ISO 8601 account creation timestamp. */
  joinedAt: string;
}

/** Public projection of User — safe to embed in JWT / cookies. */
export type PublicUser = Omit<User, 'addresses'> & {
  addressCount: number;
};
