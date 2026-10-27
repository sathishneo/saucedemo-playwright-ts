import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { credentials } from '../utils/env';

const authFile = 'playwright/.auth/user.json';

// Runs once before the browser projects. Saves cookies and storage so other tests skip the login screen.
setup('authenticate and save storage state', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(credentials.username, credentials.password);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: authFile });
});
