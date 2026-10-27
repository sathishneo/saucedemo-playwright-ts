import type { Locator, Page } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

// Page Object for the inventory (products) page.
export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly sortDropdown: Locator;
  readonly itemNames: Locator;
  readonly prices: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.sortDropdown = page.getByTestId('product_sort_container');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.prices = page.getByTestId('inventory-item-price');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  // Dropdown: picks an option by its value (az, za, lohi, hilo)
  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  // Item slugs look like "sauce-labs-backpack"
  async addToCart(itemSlug: string): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${itemSlug}`).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  // Reads all prices as numbers, e.g. "$29.99" becomes 29.99
  async getPrices(): Promise<number[]> {
    const texts = await this.prices.allInnerTexts();
    return texts.map((text) => Number(text.replace('$', '')));
  }
}
