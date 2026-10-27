import { test, expect } from '../fixtures';
import type { CheckoutInfo } from '../pages/CheckoutPage';
import { loadJson } from '../utils/testData';

interface CheckoutCase extends CheckoutInfo {
  name: string;
  expectedError: string;
}

const data = loadJson<{ validInfo: CheckoutInfo; invalidInfo: CheckoutCase[] }>('checkout.json');

test.describe('Checkout', () => {
  // Each test starts with one item in the cart and the checkout form open
  test.beforeEach(async ({ productsPage, cartPage }) => {
    await productsPage.addToCart('sauce-labs-backpack');
    await productsPage.openCart();
    await cartPage.checkout();
  });

  test('completes an order with valid information', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo(data.validInfo);
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  for (const testCase of data.invalidInfo) {
    test.skip(`shows validation error for ${testCase.name}`, async ({ checkoutPage }) => {
      await checkoutPage.fillInfo(testCase);
      await checkoutPage.continueToOverview();
      await expect(checkoutPage.errorMessage).toHaveText(testCase.expectedError);
    });
  }
});
