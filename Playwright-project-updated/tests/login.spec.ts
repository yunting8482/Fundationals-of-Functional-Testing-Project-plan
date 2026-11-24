import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/testData';

test.describe('Login', () => {
  test('positive: standard user can log in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('negative: locked-out user cannot log in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await loginPage.expectLoginError(/locked out/i);
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  test('negative: incorrect username and password show an error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.invalid.username, users.invalid.password);

    await loginPage.expectLoginError(/do not match/i);
  });

  test('negative: empty credentials show a required-field error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');

    await loginPage.expectLoginError(/username is required/i);
  });
});
