import { test, expect } from '@playwright/test';

// Reuses the session saved by auth.setup.ts. No login screen is visited in this test.
test.use({ storageState: 'playwright/.auth/user.json' });

test('reuses saved session and opens products page directly', async ({ page }) => {
  await page.goto('/inventory.html');
  await expect(page.getByTestId('title')).toHaveText('Products');
});
