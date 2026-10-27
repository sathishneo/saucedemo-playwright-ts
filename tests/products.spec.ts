import { test, expect } from '../fixtures';

test.describe('Products page', () => {
  test('shows six products', async ({ productsPage }) => {
    await expect(productsPage.title).toHaveText('Products');
    await expect(productsPage.itemNames).toHaveCount(6);
  });

  test.skip('sorts by price low to high', async ({ productsPage }) => {
    await productsPage.sortBy('lohi');
    const prices = await productsPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test.skip('sorts by name Z to A', async ({ productsPage }) => {
    await productsPage.sortBy('za');
    const names = await productsPage.itemNames.allInnerTexts();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });
});
