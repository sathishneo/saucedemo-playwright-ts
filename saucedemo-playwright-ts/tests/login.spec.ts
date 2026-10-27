import { test, expect } from '../fixtures';
import { credentials } from '../utils/env';
import { loadJson } from '../utils/testData';

interface LoginCase {
  name: string;
  username: string;
  password: string;
  expectedError: string;
}

const data = loadJson<{ invalidLogins: LoginCase[] }>('users.json');

test.describe('Login', () => {
  // Hook: runs before every test in this block
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid user reaches the products page', async ({ page, loginPage }) => {
    await loginPage.login(credentials.username, credentials.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  // Data-driven: one test is generated for each case in users.json
  for (const testCase of data.invalidLogins) {
    test(`shows an error for ${testCase.name}`, async ({ loginPage }) => {
      await loginPage.login(testCase.username, testCase.password);
      await expect(loginPage.errorMessage).toHaveText(testCase.expectedError);
    });
  }
});
