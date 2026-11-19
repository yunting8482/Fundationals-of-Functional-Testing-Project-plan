import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { USERS, PASSWORD } from '../test-data/users';
import { PRODUCTS, ALL_PRODUCTS } from '../test-data/products';

// Tests for the Products page: sorting, add to cart, remove, product details
test.describe('Products page', () => {
  let productsPage: SearchPage;

  // Before every test: log in as the normal user
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new SearchPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(productsPage.title).toHaveText('Products');
  });

  // The product names and prices in the order we expect
  const names = ALL_PRODUCTS.map((p) => p.name);
  const prices = ALL_PRODUCTS.map((p) => p.price);

  // TC-10 and TC-11: sorting
  // expect.poll keeps checking until the list is sorted (or it runs out of time)
  test('TC-11a sort by name A to Z', async () => {
    await productsPage.sortBy('az');
    await expect.poll(() => productsPage.getNames()).toEqual([...names].sort());
  });

  test('TC-11b sort by name Z to A', async () => {
    await productsPage.sortBy('za');
    await expect.poll(() => productsPage.getNames()).toEqual([...names].sort().reverse());
  });

  test('TC-10a sort by price low to high', async () => {
    await productsPage.sortBy('lohi');
    await expect.poll(() => productsPage.getPrices()).toEqual([...prices].sort((a, b) => a - b));
  });

  test('TC-10b sort by price high to low', async () => {
    await productsPage.sortBy('hilo');
    await expect.poll(() => productsPage.getPrices()).toEqual([...prices].sort((a, b) => b - a));
  });

  // TC-12: add a product to the cart
  test('TC-12 add to cart changes the button and the cart number', async () => {
    await productsPage.addToCart(PRODUCTS.backpack.id);

    await expect(productsPage.cartBadge).toHaveText('1');
    await expect(productsPage.removeButton(PRODUCTS.backpack.id)).toBeVisible();
  });

  // TC-13: remove a product from the products page
  test('TC-13 remove clears the cart number', async () => {
    await productsPage.addToCart(PRODUCTS.backpack.id);
    await productsPage.removeFromCart(PRODUCTS.backpack.id);

    await expect(productsPage.cartBadge).toHaveCount(0); // no number is shown
    await expect(productsPage.addToCartButton(PRODUCTS.backpack.id)).toBeVisible();
  });

  // TC-14: product details page
  test('TC-14 product details page shows the product', async ({ page }) => {
    await productsPage.openProduct(PRODUCTS.backpack.name);

    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(productsPage.itemNames).toHaveText(PRODUCTS.backpack.name);
    await expect(productsPage.itemPrices).toHaveText('$29.99');

    await productsPage.backToProducts.click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(productsPage.items).toHaveCount(6);
  });
});
