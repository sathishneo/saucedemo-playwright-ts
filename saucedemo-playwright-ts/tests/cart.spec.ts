import { test, expect } from '../fixtures';

const ITEM = 'sauce-labs-backpack';

test.describe('Cart', () => {
  // Hook: prints a note when a test fails, to help with debugging
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Test failed: "${testInfo.title}" at ${page.url()}`);
    }
  });

  test('adding an item updates the badge, and removing it clears the badge', async ({ productsPage }) => {
    await productsPage.addToCart(ITEM);
    await expect(productsPage.cartBadge).toHaveText('1');

    await productsPage.page.getByTestId(`remove-${ITEM}`).click();
    await expect(productsPage.cartBadge).toHaveCount(0);
  });

  test('cart page lists the added item', async ({ productsPage, cartPage }) => {
    await productsPage.addToCart(ITEM);
    await productsPage.openCart();
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack']);
  });

  test('removing an item on the cart page empties the cart', async ({ productsPage, cartPage }) => {
    await productsPage.addToCart(ITEM);
    await productsPage.openCart();
    await cartPage.removeItem(ITEM);
    await expect(cartPage.itemNames).toHaveCount(0);
  });
});
