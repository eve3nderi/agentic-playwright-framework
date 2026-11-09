import { expect, test } from '../../../fixtures/pom/test-options';
import {
    NO_MATCH_SEARCH_TERM,
    PRODUCT_SEARCH_TERMS,
} from '../../../test-data/static/app/productSearch';

/**
 * Functional tests for the product search on the Toolshop home page.
 */
test.describe('functional product search', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.open();
    });

    for (const term of PRODUCT_SEARCH_TERMS) {
        test(
            `should show only matching products when searching for ${term}`,
            { tag: '@regression' },
            async ({ homePage }) => {
                await test.step(`WHEN user searches for ${term}`, async () => {
                    await homePage.searchFor(term);
                });

                await test.step('THEN only products matching the search are shown', async () => {
                    await expect(homePage.searchTerm).toHaveText(term);
                    await expect(homePage.productNames).not.toHaveCount(0);
                    await expect(
                        homePage.productNames.filter({ hasNotText: term })
                    ).toHaveCount(0);
                });
            }
        );
    }

    test(
        'should show the no-results message when no product matches',
        { tag: '@regression' },
        async ({ homePage }) => {
            await test.step('WHEN user searches for a term no product matches', async () => {
                await homePage.searchFor(NO_MATCH_SEARCH_TERM);
            });

            await test.step('THEN the no-results message is shown and no products are listed', async () => {
                await expect(homePage.noProductsFoundMessage).toBeVisible();
                await expect(homePage.productNames).toHaveCount(0);
            });
        }
    );
});
