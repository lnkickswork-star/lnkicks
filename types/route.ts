/* =========================================================
   Route — app-level route metadata
   ---------------------------------------------------------
   Used by the navigation RouteRegistry and the
   route-metadata factory. Encodes the canonical path,
   layout shell, and IA category for every route in the app.
   ========================================================= */

/** Which layout shell the route renders inside. */
export type RouteLayout =
  | 'desktop-locked'
  | 'mobile-locked'
  | 'responsive-app'
  | 'admin-layout';

/** Information-architecture category for the route. */
export type RouteCategory =
  | 'core'
  | 'catalog'
  | 'commerce'
  | 'account'
  | 'support'
  | 'admin';

/** Static route descriptor used by RouteRegistry. */
export interface RouteMeta {
  /** Canonical path beginning with `/`. */
  path: string;
  /** Default <title> for the route. */
  title: string;
  /** Layout shell to render the route in. */
  layout: RouteLayout;
  /** IA category. */
  category: RouteCategory;
}
