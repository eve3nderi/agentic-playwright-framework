/**
 * Curated search terms for the product search tests.
 *
 * - `PRODUCT_SEARCH_TERMS` — names of products seeded in the Toolshop demo
 *   catalogue; each search must return only products whose name contains the term.
 *   Verified live with playwright-cli: 'Pliers' → 4 products, 'Hammer' → 6 products.
 * - `NO_MATCH_SEARCH_TERM` — a term no product matches; the page shows the
 *   empty-state message (`Messages.NO_PRODUCTS_FOUND`).
 *
 * Format: `.ts` with `as const` literal exports only (data-strategy, Tier 2).
 */

export const PRODUCT_SEARCH_TERMS = ['Pliers', 'Hammer', 'Saw'] as const;

export const NO_MATCH_SEARCH_TERM = 'xyz' as const;
