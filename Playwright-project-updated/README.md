# SauceDemo Playwright Testing Project

## 1. Project information

- **Application Under Test:** https://www.saucedemo.com/
- **Testing tool:** Playwright Test
- **Programming language:** TypeScript
- **Browser:** Chromium
- **Project type:** End-to-end UI testing

## 2. Group information

Please complete this section with your real group details.

| Member name | Student ID (if required by teacher) | Responsibility |
|---|---|---|
| Member 1 | Add details | Test cases / automation |
| Member 2 | Add details | Page Objects / automation |
| Member 3 | Add details | README / execution / review |

### Contribution tracking

Each member should:
1. Create their own Git branch.
2. Make meaningful commits under their own GitHub account.
3. Open a Pull Request.
4. Ask another group member to review the changes.
5. Merge only after review.

Do not share GitHub passwords or personal access tokens.

## 3. Test Strategy

### 3.1 Test objectives

- Verify that valid users can log in.
- Verify that invalid and locked-out users cannot log in.
- Verify that the product catalogue is displayed and can be sorted.
- Verify that a user can add a product to the cart and complete checkout.
- Verify that required checkout fields display validation messages.

### 3.2 Test scope

**In scope**
- Login: valid credentials, invalid credentials, locked-out user, empty credentials.
- Product catalogue: product display, sorting by name, sorting by price.
- Checkout: add to cart, cart contents, customer information validation, successful order.

**Out of scope**
- Real payment processing (the site is a demo).
- Security penetration testing.
- Load and performance testing.
- Testing real customer data or real purchases.

### 3.3 Test approach

- End-to-end browser testing using Playwright.
- Positive testing: verify that expected valid user journeys succeed.
- Negative testing: verify that invalid input or restricted users are handled correctly.
- Use Page Object Model (POM) to keep repeated page interactions reusable.
- Use stable `data-test` selectors where available.
- Use assertions (`expect`) to verify the actual result against the expected result.

**Note about the assignment's `search.spec.ts`:** SauceDemo does not have a text-search input on its inventory page. This project uses product catalogue discovery and sorting in `search.spec.ts` instead. If the teacher requires an actual search box, confirm whether another website or a different feature should be tested.

### 3.4 Test environment

- Website: https://www.saucedemo.com/
- Tool: Playwright Test
- Language: TypeScript
- Browser: Chromium
- Execution environment: local computer / GitHub Actions (optional)

### 3.5 Test data

| Scenario | Username | Password | Expected result |
|---|---|---|---|
| Standard user | `standard_user` | `secret_sauce` | Login succeeds |
| Locked user | `locked_out_user` | `secret_sauce` | Login is blocked |
| Invalid user | `not_a_real_user` | `wrong_password` | Error is displayed |

Checkout test data:
- First name: Taylor
- Last name: Tester
- Postal code: 12345
- Product: Sauce Labs Backpack

These are public demo test credentials and sample checkout values, not real personal information.

### 3.6 Entry criteria

- Node.js and npm are installed.
- Project dependencies are installed.
- Playwright Chromium browser is installed.
- SauceDemo is reachable.
- Test data is available.

### 3.7 Exit criteria

- All planned tests have been executed.
- Test results and any failures have been reviewed.
- Failed tests have been investigated and documented.
- The group has reviewed the test report.

## 4. Project structure

```text
saucedemo-playwright-project/
├── tests/
│   ├── login.spec.ts
│   ├── search.spec.ts
│   └── checkout.spec.ts
├── pages/
│   ├── LoginPage.ts
│   ├── SearchPage.ts
│   └── CheckoutPage.ts
├── test-data/
│   └── testData.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## 5. Installation

Requirements: Node.js LTS and npm.

Open this folder in VS Code. Open Terminal and run:

```bash
npm install
npx playwright install chromium
```

## 6. Execute the test suite

Run all tests:

```bash
npm test
```

Run with a visible browser:

```bash
npm run test:headed
```

Open Playwright UI mode:

```bash
npm run test:ui
```

Run one test file:

```bash
npm run test:login
npm run test:search
npm run test:checkout
```

Run TypeScript type checking:

```bash
npm run typecheck
```

Open the HTML report after a test run:

```bash
npm run report
```

## 7. Test case summary

| Test ID | Test scenario | Type | Expected result |
|---|---|---|---|
| LOGIN-01 | Login with standard user | Positive | Products page is displayed |
| LOGIN-02 | Login with locked-out user | Negative | Locked-out error is displayed |
| LOGIN-03 | Login with incorrect credentials | Negative | Login error is displayed |
| LOGIN-04 | Login with empty fields | Negative | Username-required error is displayed |
| SEARCH-01 | Display product catalogue | Positive | Six products are displayed |
| SEARCH-02 | Sort products A to Z | Positive | Product names are ascending |
| SEARCH-03 | Sort products by price low to high | Positive | Prices are ascending |
| CHECKOUT-01 | Complete purchase | Positive | Order confirmation is displayed |
| CHECKOUT-02 | Continue with missing first name | Negative | Required-field error is displayed |

## 8. Page Object Model

- `LoginPage.ts`: reusable login locators and login actions.
- `SearchPage.ts`: product catalogue and sorting interactions.
- `CheckoutPage.ts`: reusable cart and checkout actions.

## 9. Notes and limitations

- SauceDemo is a demo website. The checkout flow does not represent a real payment.
- The `search.spec.ts` file tests product discovery through sorting because the site does not provide a text-search field.
- Test results can change if the demo website changes. Review locators and expected text if a test fails.
- This project is a starter template. The group should review the requirements, run the tests, and record actual results before submitting.
