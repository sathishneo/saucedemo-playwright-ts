import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Loads variables from a local .env file (never committed; see .env.example)
dotenv.config();

const isCI = !!process.env.CI;
const baseURL = process.env.BASE_URL ?? 'https://www.saucedemo.com';

// Shared file written by tests/auth.setup.ts and read by tests that reuse a logged-in session
export const authFile = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  fullyParallel: true,                 // tests inside a file also run in parallel
  forbidOnly: isCI,                    // fail CI if someone commits test.only
  retries: isCI ? 2 : 0,               // retry flaky tests in CI only
  workers: isCI ? 2 : undefined,       // undefined = Playwright picks based on CPU cores
  timeout: 30_000,

  reporter: [
    ['list'],                                            // readable console output
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }], // for Jenkins
  ],

  use: {
    baseURL,
    testIdAttribute: 'data-test',       // SauceDemo uses data-test attributes, so getByTestId works
    actionTimeout: 10_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1. Runs first: logs in once and saves the session to playwright/.auth/user.json
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    // 2. Browser projects: depend on setup, and skip the setup file itself
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
    },
  ],
});
