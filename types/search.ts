/* =========================================================
   SearchResult — search & filter response shape
   ---------------------------------------------------------
   Used by the /search page and the search reducer. Encodes
   the active filter state, the matched products, and the
   available facets for follow-up filtering.
   ========================================================= */

import type { Product } from './product';

/** Active filter state on the search page. */
export interface SearchFilters {
  /** Free-text query string. */
  query: string;
  /** Selected brand chip (`All` = no filter). */
  brand: string;
  /** Selected size chip (`All` = no filter). */
  size: string;
  /** Sort option applied to the result set. */
  sortBy: 'Featured' | 'Price: Low to High' | 'Price: High to Low' | 'Newest';
}

/** Available facet values computed from the result set. */
export interface SearchFacets {
  brands: string[];
  sizes: string[];
  popularTags: string[];
}

/** The full search response returned by the search selector. */
export interface SearchResult {
  /** The filters used to produce this result. */
  filters: SearchFilters;
  /** Matched products, sorted per filters.sortBy. */
  products: Product[];
  /** Total match count (= products.length, exposed for clarity). */
  count: number;
  /** Available facets for follow-up filtering. */
  facets: SearchFacets;
}
