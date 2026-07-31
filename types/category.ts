/* =========================================================
   Category — catalog taxonomy node
   ---------------------------------------------------------
   Used by CategoryRegistry and the /categories and
   /category/[slug] pages.
   ========================================================= */

export interface Category {
  /** Stable internal ID (e.g. `cat-sneakers`). */
  id: string;
  /** URL-safe slug used in /category/[slug] routes. */
  slug: string;
  /** Display name shown on category cards and chips. */
  name: string;
  /** One-line description shown below the name. */
  description: string;
  /** Category card image path (root-relative). */
  image: string;
  /** Emoji or material-symbols ligature used as the icon. */
  icon: string;
  /** Total products tagged with this category. */
  productCount: number;
  /** True if featured on the homepage category rail. */
  featured?: boolean;
}

/** Helper type — a Category's slug for routing. */
export type CategorySlug = Category['slug'];
