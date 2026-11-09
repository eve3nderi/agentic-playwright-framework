import { expect, test } from '../../../fixtures/pom/test-options';
import { SortOptions } from '../../../enums/app/app';

/**
 * Functional tests for sorting products on the Toolshop home page.
 * Checks the first page of results.
 */
test.describe('functional product sort', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.open();
    });

    test(
        'should list products from highest to lowest price when sorted by price high to low',
        { tag: '@regression' },
        async ({ homePage }) => {
            await test.step('WHEN user sorts by price high to low', async () => {
                await homePage.sortBy(SortOptions.PRICE_HIGH_TO_LOW);
            });

            await test.step('THEN each price is higher than or equal to the next one', async () => {
                await expect(homePage.productPrices).not.toHaveCount(0);
                await expect
                    .poll(async () => {
                        const prices = await homePage.getProductPrices();
                        return prices.every(
                            (price, index) =>
                                index === 0 || prices[index - 1] >= price
                        );
                    })
                    .toBe(true);
            });
        }
    );
});
