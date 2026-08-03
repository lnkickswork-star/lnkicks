/**
 * LNKICKS Enterprise Admin — Type System
 * ------------------------------------------------------------
 * Single source of truth for all admin-domain types.
 *
 * Architecture note:
 *  - All types are storage-agnostic. The current implementation is
 *    localStorage-backed (see adminAuth.ts / adminData.ts) but the
 *    shapes mirror Firebase Admin Auth + Firestore so a future
 *    migration is a drop-in replacement.
 *  - RBAC is enforced both in the UI (route guards, nav visibility)
 *    and at the data layer (every mutation is tagged with the actor
 *    role for audit).
 */

/* ------------------------------------------------------------------ */
/* RBAC                                                                */
/* ------------------------------------------------------------------ */

export type AdminRole =
  | 'admin'      // Full access — god mode
  | 'manager'    // Operations: orders, inventory, customers, reports
  | 'editor'     // Catalog: products, banners, content
  | 'support'    // Customer-facing: orders status, refunds, reviews
  | 'warehouse'  // Fulfillment only: stock, packing, shipping
  | 'marketing'; // Campaigns: banners, coupons, SEO, notifications

export type Permission =
  | 'dashboard.view'
  | 'product.create'
  | 'product.edit'
  | 'product.delete'
  | 'product.publish'
  | 'order.view'
  | 'order.update_status'
  | 'order.refund'
  | 'order.cancel'
  | 'customer.view'
  | 'customer.edit'
  | 'wallet.credit'
  | 'wallet.debit'
  | 'coupon.create'
  | 'coupon.edit'
  | 'coupon.delete'
  | 'banner.manage'
  | 'seo.manage'
  | 'inventory.manage'
  | 'review.moderate'
  | 'notification.send'
  | 'report.view'
  | 'report.export'
  | 'settings.manage'
  | 'user.manage'   // create/disable other admin accounts
  | 'audit.view';

/** Role → permissions matrix. Checked by `can()` helper. */
export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  admin: [
    'dashboard.view', 'product.create', 'product.edit', 'product.delete', 'product.publish',
    'order.view', 'order.update_status', 'order.refund', 'order.cancel',
    'customer.view', 'customer.edit', 'wallet.credit', 'wallet.debit',
    'coupon.create', 'coupon.edit', 'coupon.delete', 'banner.manage', 'seo.manage',
    'inventory.manage', 'review.moderate', 'notification.send', 'report.view', 'report.export',
    'settings.manage', 'user.manage', 'audit.view',
  ],
  manager: [
    'dashboard.view', 'product.edit', 'order.view', 'order.update_status', 'order.refund', 'order.cancel',
    'customer.view', 'customer.edit', 'wallet.credit', 'wallet.debit',
    'inventory.manage', 'review.moderate', 'report.view', 'report.export',
  ],
  editor: [
    'dashboard.view', 'product.create', 'product.edit', 'product.publish',
    'banner.manage', 'seo.manage', 'review.moderate',
  ],
  support: [
    'dashboard.view', 'order.view', 'order.update_status', 'order.refund',
    'customer.view', 'review.moderate',
  ],
  warehouse: [
    'dashboard.view', 'product.edit', 'order.view', 'order.update_status', 'inventory.manage',
  ],
  marketing: [
    'dashboard.view', 'banner.manage', 'seo.manage', 'coupon.create', 'coupon.edit',
    'notification.send', 'report.view',
  ],
};

export function can(role: AdminRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

/* ------------------------------------------------------------------ */
/* Admin user / session                                                */
/* ------------------------------------------------------------------ */

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  avatarColor: string;     // deterministic accent for avatar bubble
  phone?: string;
  twoFactorEnabled: boolean;
  createdAt: number;       // epoch ms
  lastLoginAt?: number;
  isActive: boolean;
}

export interface AdminSession {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  avatarColor: string;
  twoFactorEnabled: boolean;
  loggedInAt: number;
  expiresAt: number;       // 8h sliding window
  ipAddress: string;
  userAgent: string;
}

/* ------------------------------------------------------------------ */
/* Audit log                                                           */
/* ------------------------------------------------------------------ */

export type AuditAction =
  | 'login' | 'logout' | 'login_failed'
  | 'product.create' | 'product.update' | 'product.delete' | 'product.publish'
  | 'order.status_update' | 'order.refund' | 'order.cancel'
  | 'customer.update' | 'wallet.credit' | 'wallet.debit'
  | 'coupon.create' | 'coupon.update' | 'coupon.delete'
  | 'banner.update' | 'seo.update' | 'inventory.update'
  | 'review.approve' | 'review.reject' | 'review.reply'
  | 'notification.send' | 'settings.update' | 'user.create' | 'user.disable'
  | 'export.run' | '2fa.toggle';

export interface AuditLogEntry {
  id: string;
  actorUid: string;
  actorName: string;
  actorRole: AdminRole;
  action: AuditAction;
  target?: string;          // entity id / slug / email
  targetKind?: string;      // 'product' | 'order' | 'customer' | ...
  metadata?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: number;
}

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

export interface KPI {
  key: string;
  label: string;
  value: number;
  formattedValue: string;
  delta: number;            // % change vs previous period
  deltaLabel: string;       // 'vs last month' | 'vs yesterday' | ...
  trend: number[];          // sparkline data (last 7-30 points)
  tone: 'positive' | 'negative' | 'neutral';
  icon: string;             // icon key
  accent: string;           // hex color for accent
}

export interface SalesPoint {
  date: string;             // ISO date 'YYYY-MM-DD'
  label: string;            // 'Aug 1' / 'Mon' / etc
  revenue: number;
  orders: number;
  visitors: number;
  conversion: number;       // %
}

export interface OrderStatusBreakdown {
  status: string;
  count: number;
  color: string;
  percentage: number;
}

export interface TopProduct {
  rank: number;
  id: string;
  name: string;
  brand: string;
  sku: string;
  unitsSold: number;
  revenue: number;
  stock: number;
  trend: 'up' | 'down' | 'flat';
  image?: string;
}

export interface StockAlert {
  id: string;
  name: string;
  brand: string;
  sku: string;
  stock: number;
  threshold: number;
  status: 'low' | 'out';
  category: string;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

/* ------------------------------------------------------------------ */
/* Notifications (admin)                                               */
/* ------------------------------------------------------------------ */

export type AdminNotificationType =
  | 'order' | 'stock' | 'review' | 'customer' | 'system' | 'security' | 'marketing';

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

/* ------------------------------------------------------------------ */
/* Theme (dark/light)                                                  */
/* ------------------------------------------------------------------ */

export type AdminThemeMode = 'light' | 'dark' | 'system';

export interface AdminThemeTokens {
  mode: 'light' | 'dark';
  bg: {
    app: string;          // page background
    surface: string;      // cards
    surfaceAlt: string;   // secondary surface
    sidebar: string;
    topbar: string;
    hover: string;
    overlay: string;      // modal backdrop
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    accent: string;
  };
  border: {
    subtle: string;
    strong: string;
    focus: string;
  };
  status: {
    success: string;
    successBg: string;
    warning: string;
    warningBg: string;
    error: string;
    errorBg: string;
    info: string;
    infoBg: string;
  };
  chart: {
    grid: string;
    axis: string;
    series: string[];      // 6-color palette for charts
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
}
