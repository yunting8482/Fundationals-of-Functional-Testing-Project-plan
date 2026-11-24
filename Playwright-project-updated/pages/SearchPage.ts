import { expect, type Locator, type Page } from '@playwright/test';

// SauceDemo does not provide a text-search box.
// This page object represents finding products in the catalogue using sorting.
export class SearchPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly productNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('title');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.productNames = page.getByTestId('inventory-item-name');
  }

  async expectInventoryPage() {
    await expect(this.pageTitle).toHaveText('Products');
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames() {
    return this.productNames.allTextContents();
  }
}
