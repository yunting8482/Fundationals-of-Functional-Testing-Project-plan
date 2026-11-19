import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Playwright looks for the test files (*.spec.ts) in this folder
  testDir: './tests',

  // A test fails if it takes longer than 30 seconds
  timeout: 30_000,

  // Show a list in the terminal and also make an HTML report
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // With this, page.goto('/') opens the Sauce Demo home page
    baseURL: 'https://www.saucedemo.com',

    // Save a screenshot when a test fails (helps with debugging)
    screenshot: 'only-on-failure',
  },

  // The browsers we test with. Add more here (for example Edge or a phone) if you want.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
