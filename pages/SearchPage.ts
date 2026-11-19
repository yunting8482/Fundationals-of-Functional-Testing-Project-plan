import { Page, Locator } from '@playwright/test';

// This is the Products page: the place where users look for products.
// Sauce Demo has no search box, so "search" here means finding products by sorting them.
// It also has the Add to cart buttons, the cart icon and the menu.
export class SearchPage {
  readonly page: Page;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly backToProducts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.backToProducts = page.locator('[data-test="back-to-products"]');
  }

  // The buttons have the product id in their name, for example add-to-cart-sauce-labs-backpack
  addToCartButton(productId: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productId}"]`);
  }

  removeButton(productId: string): Locator {
    return this.page.locator(`[data-test="remove-${productId}"]`);
  }

  async addToCart(productId: string) {
    await this.addToCartButton(productId).click();
  }

  async removeFromCart(productId: string) {
    await this.removeButton(productId).click();
  }

  // option is one of: 'az', 'za', 'lohi', 'hilo'
  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  // Returns the names of the products in the order they are shown
  async getNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  // Returns the prices as numbers, for example '$29.99' becomes 29.99
  async getPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((text) => parseFloat(text.replace('$', '')));
  }

  async openProduct(name: string) {
    await this.itemNames.filter({ hasText: name }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
