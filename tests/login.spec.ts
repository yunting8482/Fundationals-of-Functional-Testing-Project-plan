import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { USERS, PASSWORD } from '../test-data/users';
import { MESSAGES } from '../test-data/messages';

test.describe('Login and logout', () => {
  let loginPage: LoginPage;
  let productsPage: SearchPage;

  // This runs before every test: open the login page
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new SearchPage(page);
    await loginPage.goto();
  });

  // TC-01: the normal user can log in
  test('TC-01 normal user can log in', async ({ page }) => {
    await loginPage.login(USERS.standard, PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/); // we are on the products page
    await expect(productsPage.title).toHaveText('Products');
    await expect(productsPage.items).toHaveCount(6); // six products are shown
  });

  // TC-02: the other users can log in too (we test each one in a loop)
  const otherUsers = [USERS.problem, USERS.performance, USERS.error, USERS.visual];

  for (const username of otherUsers) {
    test(`TC-02 ${username} can log in`, async ({ page }) => {
      await loginPage.login(username, PASSWORD);

      // performance_glitch_user is slow on purpose, so we wait up to 15 seconds
      await expect(page).toHaveURL(/inventory\.html/, { timeout: 15000 });
      await expect(productsPage.title).toHaveText('Products');
    });
  }

  // TC-03: the locked user gets an error
  test('TC-03 locked user cannot log in', async ({ page }) => {
    await loginPage.login(USERS.locked, PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(MESSAGES.lockedOut);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  // TC-04: wrong password or unknown user
  test('TC-04a wrong password shows an error', async () => {
    await loginPage.login(USERS.standard, 'wrong_password');
    await expect(loginPage.errorMessage).toHaveText(MESSAGES.wrongLogin);
  });

  test('TC-04b unknown user shows an error', async () => {
    await loginPage.login('wrong_user', PASSWORD);
    await expect(loginPage.errorMessage).toHaveText(MESSAGES.wrongLogin);
  });

  // TC-05: empty fields
  test('TC-05a empty username shows an error', async () => {
    await loginPage.login('', PASSWORD);
    await expect(loginPage.errorMessage).toHaveText(MESSAGES.usernameRequired);
  });

  test('TC-05b empty password shows an error', async () => {
    await loginPage.login(USERS.standard, '');
    await expect(loginPage.errorMessage).toHaveText(MESSAGES.passwordRequired);
  });

  // TC-06: the username must match exactly (capital letters are different)
  test('TC-06 username in capital letters is rejected', async () => {
    await loginPage.login('STANDARD_USER', PASSWORD);
    await expect(loginPage.errorMessage).toHaveText(MESSAGES.wrongLogin);
  });

  // TC-07: logout
  test('TC-07 logout goes back to the login page', async () => {
    await loginPage.login(USERS.standard, PASSWORD);
    await productsPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.usernameInput).toHaveValue('');
  });

  // TC-08: a page that needs login cannot be opened without logging in
  test('TC-08 products page cannot be opened without login', async ({ page }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.loginButton).toBeVisible(); // we see the login page
    await expect(productsPage.items).toHaveCount(0);   // no products are shown
  });

  // TC-23: the slow user should log in within 2 seconds.
  // This test is EXPECTED TO FAIL. The slow login is the bug we want to report.
  test('TC-23 slow user logs in within 2 seconds', async ({ page }) => {
    const start = Date.now();

    await loginPage.login(USERS.performance, PASSWORD);
    await expect(productsPage.title).toBeVisible({ timeout: 20000 });

    const seconds = (Date.now() - start) / 1000;
    expect(seconds, `Login took ${seconds} seconds`).toBeLessThanOrEqual(2);
  });
});
