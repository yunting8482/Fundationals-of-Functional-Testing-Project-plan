import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { users } from '../test-data/testData';

test.describe('Product catalogue - search/discovery', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('positive: inventory products are displayed', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.expectInventoryPage();
    await expect(searchPage.productNames).toHaveCount(6);
  });

  test('positive: products can be sorted by name A to Z', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.sortProducts('az');

    const names = await searchPage.getProductNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('positive: products can be sorted by price low to high', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.sortProducts('lohi');

    const prices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    const numericPrices = prices.map((price) => Number(price.replace('$', '')));
    expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
  });
});
