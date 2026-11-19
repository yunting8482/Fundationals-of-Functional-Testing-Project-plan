import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, PASSWORD } from '../test-data/users';
import { MESSAGES } from '../test-data/messages';
import { PRODUCTS, calculateTotals } from '../test-data/products';
import { VALID_CUSTOMER } from '../test-data/customer';

// Tests for the cart and the checkout
test.describe('Cart and checkout', () => {
  let productsPage: SearchPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  // Before every test: log in as the normal user
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new SearchPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(productsPage.title).toHaveText('Products');
  });

  // A small helper: add products, open the cart and click Checkout
  async function goToCheckout(productIds: string[]) {
    for (const id of productIds) {
      await productsPage.addToCart(id);
    }
    await productsPage.openCart();
    await cartPage.checkout();
  }

  // ---------------- Cart ----------------

  test('TC-13b remove an item on the cart page', async () => {
    await productsPage.addToCart(PRODUCTS.backpack.id);
    await productsPage.openCart();
    await expect(cartPage.items).toHaveCount(1);

    await cartPage.remove(PRODUCTS.backpack.id);

    await expect(cartPage.items).toHaveCount(0);
    await expect(productsPage.cartBadge).toHaveCount(0);
  });

  test('TC-15 the cart keeps its items after a refresh', async ({ page }) => {
    await productsPage.addToCart(PRODUCTS.backpack.id);
    await productsPage.addToCart(PRODUCTS.bikeLight.id);

    await productsPage.openProduct(PRODUCTS.backpack.name); // go to another page
    await page.reload();                                    // refresh
    await productsPage.openCart();

    await expect(cartPage.items).toHaveCount(2);
    await expect(productsPage.cartBadge).toHaveText('2');
  });

  // ---------------- Checkout: your information ----------------

  // TC-16: each field is required. We test one empty field at a time.
  const missingFieldCases = [
    { missing: 'First Name', firstName: '', lastName: 'Virtanen', postalCode: '00100' },
    { missing: 'Last Name', firstName: 'Anna', lastName: '', postalCode: '00100' },
    { missing: 'Postal Code', firstName: 'Anna', lastName: 'Virtanen', postalCode: '' },
  ];

  for (const testCase of missingFieldCases) {
    test(`TC-16 ${testCase.missing} is required`, async ({ page }) => {
      await goToCheckout([PRODUCTS.backpack.id]);

      await checkoutPage.fillInfo(testCase);
      await checkoutPage.continue();

      await expect(checkoutPage.errorMessage).toContainText(`${testCase.missing} is required`);
      await expect(page).toHaveURL(/checkout-step-one\.html/); // we stay on the same step
    });
  }

  // TC-17: unusual text must not break the page, and a script in the text must not run
  const unusualTexts = [
    { label: '150 characters', text: 'x'.repeat(150) },
    { label: 'script text', text: '<script>alert(1)</script>' },
  ];

  for (const unusual of unusualTexts) {
    test(`TC-17 unusual text is handled safely: ${unusual.label}`, async ({ page }) => {
      let alertShown = false;
      page.on('dialog', async (dialog) => {
        alertShown = true; // a script ran: this is a bug
        await dialog.dismiss();
      });

      await goToCheckout([PRODUCTS.backpack.id]);
      await checkoutPage.fillInfo({ firstName: unusual.text, lastName: unusual.text, postalCode: '00100' });
      await checkoutPage.continue();

      await expect(page).toHaveURL(/checkout-step-two\.html/);
      expect(alertShown).toBe(false);
    });
  }

  // ---------------- Checkout: overview ----------------

  // TC-18: the total is the item total plus tax
  test('TC-18 overview shows the correct item total, tax and total', async () => {
    const products = [PRODUCTS.backpack, PRODUCTS.bikeLight];
    const totals = calculateTotals(products); // 39.98, 3.20, 43.18

    await goToCheckout([PRODUCTS.backpack.id, PRODUCTS.bikeLight.id]);
    await checkoutPage.fillInfo(VALID_CUSTOMER);
    await checkoutPage.continue();

    await expect(checkoutPage.subtotalLabel).toContainText(`$${totals.subtotal.toFixed(2)}`);
    await expect(checkoutPage.taxLabel).toContainText(`$${totals.tax.toFixed(2)}`);
    await expect(checkoutPage.totalLabel).toContainText(`$${totals.total.toFixed(2)}`);
  });

  // TC-20: Cancel keeps the items in the cart
  test('TC-20 cancel keeps the item in the cart', async ({ page }) => {
    await goToCheckout([PRODUCTS.backpack.id]);

    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.items).toHaveCount(1);
  });

  // ---------------- The whole purchase ----------------

  // TC-19: buy two products from start to end
  test('TC-19 complete a purchase', async ({ page }) => {
    await productsPage.addToCart(PRODUCTS.backpack.id);
    await productsPage.addToCart(PRODUCTS.bikeLight.id);
    await expect(productsPage.cartBadge).toHaveText('2');

    await productsPage.openCart();
    await expect(cartPage.items).toHaveCount(2);
    await cartPage.checkout();

    await checkoutPage.fillInfo(VALID_CUSTOMER);
    await checkoutPage.continue();
    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText(MESSAGES.orderComplete);
    await expect(productsPage.cartBadge).toHaveCount(0); // the cart is empty now

    await checkoutPage.backHomeButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
