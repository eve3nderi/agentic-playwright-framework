import { Locator, Page } from '@playwright/test';
import {
    ApiEndpoints,
    AppRoutes,
    Messages,
    SortOptions,
} from '../../enums/app/app';

/**
 * Page Object for the Toolshop home page: product search and the product grid.
 * Locators were captured from the live page with playwright-cli.
 */
export class HomePage {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    get searchInput(): Locator {
        return this.page.getByLabel('Search', { exact: true });
    }

    get searchButton(): Locator {
        return this.page.getByRole('button', { name: 'Search', exact: true });
    }

    // Every product card's name; no named container to scope to, so the app's test id.
    get productNames(): Locator {
        return this.page.getByTestId('product-name');
    }

    get sortDropdown(): Locator {
        return this.page.getByRole('combobox', { name: 'sort' });
    }

    // Every product card's price, shown as "$89.55".
    get productPrices(): Locator {
        return this.page.getByTestId('product-price');
    }

    // ==================== Feedback Locators ====================

    // The term echoed back in the "Searched for: <term>" caption.
    get searchTerm(): Locator {
        return this.page.getByTestId('search-term');
    }

    get noProductsFoundMessage(): Locator {
        return this.page.getByText(Messages.NO_PRODUCTS_FOUND);
    }

    // ==================== Actions ====================

    /**
     * Opens the home page using the configured APP_URL and the HOME route.
     *
     * @returns {Promise<void>} Resolves when navigation is complete.
     */
    async open(): Promise<void> {
        await this.page.goto(`${process.env.APP_URL!}${AppRoutes.HOME}`, {
            waitUntil: 'domcontentloaded',
        });
    }

    /**
     * Searches for products by name and waits for the search API to answer.
     * Listening starts before the click, so the response cannot be missed.
     *
     * @param {string} term - The text to type into the search box.
     * @returns {Promise<void>} Resolves when the search response has arrived.
     */
    async searchFor(term: string): Promise<void> {
        const searchResponse = this.page.waitForResponse((response) =>
            response.url().includes(ApiEndpoints.PRODUCT_SEARCH)
        );
        await this.searchInput.fill(term);
        await this.searchButton.click();
        await searchResponse;
    }

    /**
     * Chooses a sort order from the sort dropdown by its visible label.
     *
     * @param {SortOptions} option - The sort label to select.
     * @returns {Promise<void>} Resolves when the option has been selected.
     */
    async sortBy(option: SortOptions): Promise<void> {
        await this.sortDropdown.selectOption({ label: option });
    }

    /**
     * Reads the prices of the products currently shown, in page order.
     *
     * @returns {Promise<number[]>} The prices as numbers, e.g. "$89.55" becomes 89.55.
     */
    async getProductPrices(): Promise<number[]> {
        const priceTexts = await this.productPrices.allTextContents();
        return priceTexts.map((text) => Number(text.replace(/[^0-9.]/g, '')));
    }
}
