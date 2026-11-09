import { ApiEndpoints } from '../../../enums/app/app';
import {
    PaginatedProductResponse,
    PaginatedProductResponseSchema,
} from '../../../fixtures/api/schemas/app/productSchema';
import {
    MethodNotAllowedResponse,
    MethodNotAllowedResponseSchema,
    NotFoundResponse,
    NotFoundResponseSchema,
} from '../../../fixtures/api/schemas/util/errorResponseSchema';
import { expect, test } from '../../../fixtures/pom/test-options';
import {
    NO_MATCH_SEARCH_TERM,
    OUT_OF_RANGE_PAGE,
    PRODUCT_SEARCH_TERMS,
} from '../../../test-data/static/app/productSearch';

/**
 * Builds the search URL path with the required `q` query parameter.
 *
 * @param {string} term - The search phrase.
 * @returns {string} The endpoint path with the encoded query string.
 */
const searchUrl = (term: string): string =>
    `${ApiEndpoints.PRODUCT_SEARCH}?q=${encodeURIComponent(term)}`;

/*
 * Contract: Toolshop OpenAPI 5.0.0, operation `searchProduct`
 * (GET /products/search). Documented responses: 200, 404, 405.
 * The endpoint is public: no Authorization header, so no 401/403 rows.
 */
test.describe('GET /products/search', () => {
    for (const term of PRODUCT_SEARCH_TERMS) {
        test(
            `should return 200 and only products matching ${term}`,
            { tag: '@api' },
            async ({ apiRequest }) => {
                const { status, body } =
                    await apiRequest<PaginatedProductResponse>({
                        method: 'GET',
                        url: searchUrl(term),
                        baseUrl: process.env.API_URL,
                    });

                expect(status).toBe(200);
                expect(PaginatedProductResponseSchema.parse(body)).toBeTruthy();
                expect(body.data.length).toBeGreaterThan(0);
                for (const product of body.data) {
                    expect(product.name.toLowerCase()).toContain(
                        term.toLowerCase()
                    );
                }
            }
        );
    }

    // FIXME: no ticket yet. Contract says `from` and `to` are integers, but the
    // API returns `null` for both when no product matches. Un-skip once the
    // API or the OpenAPI document is fixed.
    test.skip(
        'should return 200 and no products when nothing matches',
        { tag: '@api' },
        async ({ apiRequest }) => {
            const { status, body } = await apiRequest<PaginatedProductResponse>(
                {
                    method: 'GET',
                    url: searchUrl(NO_MATCH_SEARCH_TERM),
                    baseUrl: process.env.API_URL,
                }
            );

            expect(status).toBe(200);
            expect(PaginatedProductResponseSchema.parse(body)).toBeTruthy();
            expect(body.data).toHaveLength(0);
        }
    );

    // FIXME: no ticket yet. 404 is documented for this operation, but the API
    // returns 200 with an empty `data` list for a page beyond the last one
    // (also for an unmatched term, page 0 and page -1). Un-skip once the
    // input that produces the documented 404 is known.
    test.skip(
        'should return 404 when the requested page does not exist',
        { tag: '@api' },
        async ({ apiRequest }) => {
            const { status, body } = await apiRequest<NotFoundResponse>({
                method: 'GET',
                url: `${searchUrl(PRODUCT_SEARCH_TERMS[0])}&page=${OUT_OF_RANGE_PAGE}`,
                baseUrl: process.env.API_URL,
            });

            expect(status).toBe(404);
            expect(NotFoundResponseSchema.parse(body)).toBeTruthy();
        }
    );
});

test.describe('POST /products/search', () => {
    test(
        'should return 405 for an unsupported method',
        { tag: '@api' },
        async ({ apiRequest }) => {
            const { status, body } = await apiRequest<MethodNotAllowedResponse>(
                {
                    method: 'POST',
                    url: searchUrl(PRODUCT_SEARCH_TERMS[0]),
                    baseUrl: process.env.API_URL,
                }
            );

            expect(status).toBe(405);
            expect(MethodNotAllowedResponseSchema.parse(body)).toBeTruthy();
        }
    );
});
