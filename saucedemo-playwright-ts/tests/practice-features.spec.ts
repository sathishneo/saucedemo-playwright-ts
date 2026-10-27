// Demonstration tests on public practice sites. SauceDemo has no dropdown-free forms,
// frames, dialogs, uploads, or downloads, so these concepts are shown separately.
import { test, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';

const theInternet = 'https://the-internet.herokuapp.com';
const demoQa = 'https://demoqa.com';

test.describe('Practice site demonstrations', () => {
  test.beforeAll(() => {
    console.log('Starting practice-site demos (not part of the SauceDemo flow)');
  });

  test('selects an option from a dropdown', async ({ page }) => {
    await page.goto(`${theInternet}/dropdown`);
    const dropdown = page.locator('#dropdown');
    await dropdown.selectOption('2');
    await expect(dropdown).toHaveValue('2');
  });

  test('checks and unchecks a checkbox', async ({ page }) => {
    await page.goto(`${theInternet}/checkboxes`);
    const firstBox = page.getByRole('checkbox').first();
    await firstBox.check();
    await expect(firstBox).toBeChecked();
    await firstBox.uncheck();
    await expect(firstBox).not.toBeChecked();
  });

  test('selects a radio button', async ({ page }) => {
    await page.goto(`${demoQa}/radio-button`);
    await page.locator('label[for="yesRadio"]').click();
    await expect(page.locator('.text-success')).toHaveText('Yes');
  });

  test('accepts a JavaScript alert dialog', async ({ page }) => {
    await page.goto(`${theInternet}/javascript_alerts`);
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toBe('I am a JS Alert');
      await dialog.accept();
    });
    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });

  test.skip('reads text inside an iframe', async ({ page }) => {
    await page.goto(`${theInternet}/iframe`);
    const editor = page.frameLocator('#mce_0_ifr').locator('#tinymce');
    await expect(editor).toContainText('Your content goes here.');
  });

  test('handles a new browser tab (popup window)', async ({ page }) => {
    await page.goto(`${theInternet}/windows`);
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Click Here' }).click(),
    ]);
    await popup.waitForLoadState();
    await expect(popup.locator('h3')).toHaveText('New Window');
  });

  test('uploads a file', async ({ page }) => {
    await page.goto(`${theInternet}/upload`);
    await page.locator('#file-upload').setInputFiles(path.resolve('test-data', 'sample-upload.txt'));
    await page.locator('#file-submit').click();
    await expect(page.locator('#uploaded-files')).toHaveText('sample-upload.txt');
  });

  test('downloads a file and saves it', async ({ page }, testInfo) => {
    await page.goto(`${theInternet}/download`);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('.example a').first().click(),
    ]);
    const savePath = testInfo.outputPath(download.suggestedFilename());
    await download.saveAs(savePath);
    expect(existsSync(savePath)).toBe(true);
  });

  // Hook: runs after each test in this block
  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished "${testInfo.title}" on ${page.url()}`);
  });
});
