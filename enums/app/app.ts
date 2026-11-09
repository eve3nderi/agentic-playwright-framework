/**
 * Application-specific constants.
 * Add your application's repeated string values here.
 *
 * @example
 * ```ts
 * import { Messages, ApiEndpoints } from '../../enums/app/app';
 *
 * await expect(page.getByText(Messages.LOGIN_ERROR)).toBeVisible();
 * ```
 */

/** Common UI messages — every value verified against the live demo app */
export enum Messages {
    LOGIN_ERROR = 'Invalid email or password',
    EMAIL_REQUIRED = 'Email is required',
    PASSWORD_REQUIRED = 'Password is required',
    EMAIL_FORMAT_INVALID = 'Email format is invalid',
    NO_PRODUCTS_FOUND = 'There are no products found.',
}

/** Product sort options — the visible labels of the home page sort dropdown */
export enum SortOptions {
    PRICE_HIGH_TO_LOW = 'Price (High - Low)',
}

/** UI route paths */
export enum AppRoutes {
    HOME = '/',
    LOGIN = '/auth/login',
}

/** API endpoint paths */
export enum ApiEndpoints {
    LOGIN = '/users/login',
    LOGOUT = '/users/logout',
    CURRENT_USER = '/users/me',
    REGISTER = '/users/register',
    PRODUCT_SEARCH = '/products/search',
}

/**
 * Auth state files written by the setup projects
 * (`tests/app/auth-api.setup.ts` and `tests/app/auth.setup.ts`).
 */
export enum StorageStatePaths {
    APP = '.auth/app/appStorageState.json',
    API_ACCESS_TOKEN = '.auth/app/apiAccessToken.json',
}
