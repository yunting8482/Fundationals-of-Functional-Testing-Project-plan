import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async remove(productId: string) {
    await this.page.locator(`[data-test="remove-${productId}"]`).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
