import type { Locator, Page } from '@playwright/test';

// Page Object for the shopping cart page.
export class CartPage {
  readonly page: Page;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async removeItem(itemSlug: string): Promise<void> {
    await this.page.getByTestId(`remove-${itemSlug}`).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
