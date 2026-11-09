import { z } from 'zod/v4';
import type { output as zOutput } from 'zod/v4';

/*
 * Product search response schemas.
 *
 * Source: Toolshop API OpenAPI document, version 5.0.0 (OpenAPI 3.2.0),
 * served at `${API_URL}/docs` — operation `searchProduct`
 * (GET /products/search), response 200 `PaginatedProductResponse`,
 * items `ProductResponse`, nested `BrandResponse`, `CategoryResponse`,
 * `ImageResponse`. Read 2026-11-09.
 *
 * The contract lists no `required` fields. Fields the live API omits in
 * search results are therefore `.optional()` (contract-compatible):
 * `BrandResponse.slug`, `CategoryResponse.parent_id`, `.slug`,
 * `.sub_categories`. Every other documented field is required.
 */

export const BrandResponseSchema = z.strictObject({
    id: z.string(),
    name: z.string(),
    slug: z.string().optional(),
});

const CategoryResponseBaseSchema = z.strictObject({
    id: z.string(),
    parent_id: z.string().nullable().optional(),
    name: z.string(),
    slug: z.string().optional(),
});

export type CategoryResponse = zOutput<typeof CategoryResponseBaseSchema> & {
    sub_categories?: CategoryResponse[];
};

export const CategoryResponseSchema: z.ZodType<CategoryResponse> =
    CategoryResponseBaseSchema.extend({
        get sub_categories() {
            return z.array(CategoryResponseSchema).optional();
        },
    });

export const ImageResponseSchema = z.strictObject({
    id: z.string(),
    by_name: z.string(),
    by_url: z.string(),
    source_name: z.string(),
    source_url: z.string(),
    file_name: z.string(),
    title: z.string(),
});

export const ProductResponseSchema = z.strictObject({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    is_location_offer: z.boolean(),
    is_rental: z.boolean(),
    in_stock: z.boolean(),
    co2_rating: z.string(),
    is_eco_friendly: z.boolean(),
    brand: BrandResponseSchema,
    category: CategoryResponseSchema,
    product_image: ImageResponseSchema,
});

export const PaginatedProductResponseSchema = z.strictObject({
    current_page: z.int(),
    data: z.array(ProductResponseSchema),
    from: z.int(),
    last_page: z.int(),
    per_page: z.int(),
    to: z.int(),
    total: z.int(),
});

// Type exports
export type BrandResponse = zOutput<typeof BrandResponseSchema>;
export type ImageResponse = zOutput<typeof ImageResponseSchema>;
export type ProductResponse = zOutput<typeof ProductResponseSchema>;
export type PaginatedProductResponse = zOutput<
    typeof PaginatedProductResponseSchema
>;
