import { test as base } from '@playwright/test';
import { AppPage } from '../../pages/app/app.page';
import { HomePage } from '../../pages/app/home.page';

/**
 * Framework fixtures for page objects.
 * Add new page object types here as you create them.
 */
export type FrameworkFixtures = {
    /** Main application page object */
    appPage: AppPage;
    /** Home page object: product search and the product grid */
    homePage: HomePage;
    /** Clears cookies, permissions and the app's web storage so the test starts signed out */
    resetStorageState: () => Promise<void>;
};

/**
 * Extended test with page object fixtures.
 * Import this in your test files to access page objects.
 *
 * @example
 * ```ts
 * import { test, expect } from '../fixtures/pom/test-options';
 *
 * test('example test', async ({ appPage }) => {
 *   await appPage.openHomePage();
 *   await expect(appPage.appTitle).toBeVisible();
 * });
 * ```
 */
export const test = base.extend<FrameworkFixtures>({
    appPage: async ({ page }, use) => {
        await use(new AppPage(page));
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    resetStorageState: async ({ context, page }, use) => {
        await use(async () => {
            await context.clearCookies();
            await context.clearPermissions();
            // Web storage is per origin: the page must be on the app before
            // localStorage (where this app keeps its token) can be cleared.
            await page.goto(process.env.APP_URL!, {
                waitUntil: 'domcontentloaded',
            });
            await page.evaluate(() => {
                window.localStorage.clear();
                window.sessionStorage.clear();
            });
        });
    },
});
