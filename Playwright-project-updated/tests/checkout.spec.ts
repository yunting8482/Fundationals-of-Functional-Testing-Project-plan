import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users, checkoutCustomer, products } from '../test-data/testData';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('positive: user can complete a purchase', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

    await checkout.openCart();
    await expect(page.getByTestId('inventory-item-name')).toHaveText(products.backpack);

    await checkout.startCheckout();
    await checkout.fillCustomerInformation(
      checkoutCustomer.firstName,
      checkoutCustomer.lastName,
      checkoutCustomer.postalCode,
    );
    await checkout.continueToOverview();

    await expect(page.getByTestId('inventory-item-name')).toHaveText(products.backpack);
    await checkout.finishOrder();

    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  });

  test('negative: checkout cannot continue when first name is missing', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await checkout.openCart();
    await checkout.startCheckout();

    await checkout.fillCustomerInformation('', checkoutCustomer.lastName, checkoutCustomer.postalCode);
    await page.getByTestId('continue').click();

    await expect(page.getByTestId('error')).toContainText('First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
