/* =========================================================
   LNKICKS — SHARED TYPE LIBRARY
   ---------------------------------------------------------
   Canonical TypeScript interfaces for the LNKICKS codebase.
   Every domain entity used across pages, components, contexts,
   and registries MUST import its type from this directory.

   Design principles:
     • One interface per file (barrel-exported here).
     • Strict-mode compatible (no implicit any, no untyped
       generics, optional fields marked with `?`).
     • Field names match the JSON shape persisted to
       localStorage so runtime parsing requires no mapping.
     • Interfaces favor composition — page-specific extensions
       belong in the page, not in the shared type.
     ========================================================= */

export * from './product';
export * from './category';
export * from './user';
export * from './cart';
export * from './order';
export * from './wishlist';
export * from './search';
export * from './api-response';
export * from './route';
