# playwright-project

Automated tests for https://www.saucedemo.com/ with Playwright and TypeScript.

## What to install (once)

1. **Node.js** (version 18 or newer, the LTS version is best): https://nodejs.org
   Check it in a terminal: `node -v` and `npm -v`
2. **VS Code** (you already use it). Optional: the extension "Playwright Test for VS Code".
3. In this folder, install the project:
   ```
   npm install
   npx playwright install
   ```
   `npm install` installs Playwright. `npx playwright install` downloads the browsers
   (Chromium and Firefox) that the tests open. It is a big download, but you do it only once.

Windows PowerShell can block `npm` ("running scripts is disabled"). Then use `npm.cmd` and `npx.cmd`,
or run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

## Run the tests

| Command | What it does |
|---|---|
| `npx playwright test` | Runs all tests in Chromium and Firefox |
| `npx playwright test --project=chromium` | Runs only in Chromium (faster) |
| `npx playwright test --headed` | Shows the browser while the tests run |
| `npx playwright test --ui` | Opens Playwright's test window: very good for learning and debugging |
| `npx playwright test tests/login.spec.ts` | Runs one file |
| `npx playwright show-report` | Opens the HTML report |

## Folders

| Folder / file | What is inside |
|---|---|
| `tests/` | The test files (login, search, checkout) |
| `pages/` | One Page Object for each page: LoginPage, SearchPage (the Products page), CartPage, CheckoutPage |
| `test-data/` | Users, products, messages and a customer: data that the tests use |
| `playwright.config.ts` | The website address, browsers and settings |
| `package.json` | The project name, scripts and the Playwright package |

## Good to know

- TC-23 (slow user) is expected to fail. The slow login is the bug we report.
- The tests were written from the test plan. Run them once on the real site and fix any value that is different
  (for example a price or a message).
