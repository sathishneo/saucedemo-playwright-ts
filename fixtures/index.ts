import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { credentials } from '../utils/env';

// Custom fixtures: each test receives ready-made page objects instead of building them by hand.
type AppFixtures = {
  loginPage: LoginPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productsPage: ProductsPage; // custom fixture that logs in first, then hands over the products page
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  productsPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(credentials.username, credentials.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await use(new ProductsPage(page));
  },
});

export { expect };
