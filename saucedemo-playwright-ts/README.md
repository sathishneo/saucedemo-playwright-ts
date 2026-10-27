# SauceDemo Playwright + TypeScript Framework

A small, beginner-friendly test framework for [SauceDemo](https://www.saucedemo.com/) using Playwright, TypeScript, and the Page Object Model.

## 1. Windows + VS Code setup (step by step)

1. **Install Node.js LTS** from https://nodejs.org (version 18.18 or newer). Verify in a terminal:
   ```
   node -v
   npm -v
   ```
2. **Install VS Code** from https://code.visualstudio.com. Optional: add the "Playwright Test for VSCode" extension.
3. **Unzip** the project to a short path such as `C:\projects\saucedemo-playwright-ts`.
4. **Open the folder** in VS Code: File > Open Folder.
5. **Open a terminal** in VS Code: Terminal > New Terminal. If PowerShell blocks `npm`, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, or use Command Prompt.
6. **Install dependencies:**
   ```
   npm ci
   ```
7. **Install browsers:**
   ```
   npx playwright install
   ```
8. **Create your local settings file:**
   ```
   copy .env.example .env
   ```
9. **Run all tests:**
   ```
   npm test
   ```
10. **Open the HTML report:**
    ```
    npm run report
    ```

## 2. Commands

| Goal | Command |
|---|---|
| Run all tests (all browsers) | `npm test` |
| Chromium only | `npm run test:chromium` |
| Firefox only | `npm run test:firefox` |
| WebKit only | `npm run test:webkit` |
| One file | `npx playwright test tests/login.spec.ts` |
| One test by name | `npx playwright test -g "valid user"` |
| Watch the browser | `npm run test:headed` |
| Step through with the debugger | `npm run test:debug` |
| Open the HTML report | `npm run report` |
| Open a trace | `npx playwright show-trace test-results/<folder>/trace.zip` |
| Type check (lint) | `npm run lint` |
| Use more workers | `npx playwright test --workers=4` |

## 3. Folder-by-folder guide

| Folder or file | Purpose |
|---|---|
| `tests/` | Test scenarios. Each `*.spec.ts` is one group of related tests. `auth.setup.ts` is the one-time login. |
| `pages/` | Page Object Model classes. Each class holds locators and actions for one screen. |
| `fixtures/` | Custom Playwright fixtures. Tests receive page objects and a pre-logged-in products page without setup code. |
| `test-data/` | JSON files for data-driven tests, plus a sample file for the upload demo. |
| `utils/` | Small helpers: reading credentials from environment variables and loading JSON. |
| `playwright/.auth/` | Saved login session (`user.json`). Created at run time. Git ignores it. |
| `playwright.config.ts` | Central settings: base URL, reporters, retries, workers, screenshots, videos, traces, and browser projects. |
| `package.json` | Dependencies and npm scripts. |
| `tsconfig.json` | Strict TypeScript settings. |
| `.env.example` | Template for local environment variables. Copy it to `.env`. |
| `.gitignore` | Keeps secrets, reports, and session files out of Git. |
| `Jenkinsfile` | Jenkins pipeline. |
| `.github/workflows/playwright.yml` | GitHub Actions pipeline. |

## 4. How one test flows through the framework

Take `tests/cart.spec.ts`, the test "adding an item updates the badge":

1. **Config:** `playwright.config.ts` sets the base URL (`/` resolves to saucedemo.com), the `data-test` attribute used by `getByTestId`, and the browsers to run. The `setup` project runs first, so the session is already saved in `playwright/.auth/user.json`.
2. **Fixture:** the test asks for `productsPage`. The custom fixture in `fixtures/index.ts` opens the login page, logs in with credentials from `utils/env.ts`, and hands over a `ProductsPage` object.
3. **Page object:** `productsPage.addToCart('sauce-labs-backpack')` runs the click defined in `pages/ProductsPage.ts`. The page object contains the locators and actions, not the test logic.
4. **Auto-waiting:** `click()` waits until the button is visible and enabled. You never need `waitForTimeout`.
5. **Assertion:** `expect(productsPage.cartBadge).toHaveText('1')` retries until the badge shows the expected text or the timeout expires. That retry is why assertions are the only "wait" in the test.
6. **Report:** if the test fails, Playwright saves a screenshot, a video, and a trace, and writes the result to the HTML and JUnit reports.

## 5. Reports and debugging

- **HTML report:** `npm run report` opens `playwright-report/index.html`. Click a failed test to see the error, screenshot, video, and trace.
- **Trace viewer:** the trace shows every action, DOM snapshot, and network request. Open it with `npx playwright show-trace test-results/<test-folder>/trace.zip`, or click "View trace" in the HTML report.
- **JUnit XML:** `test-results/junit.xml` is written on every run. Jenkins reads this file.
- **Screenshots and videos:** saved in `test-results/` only for failed tests.

## 6. Concept-to-file mapping

| Concept | Where it lives |
|---|---|
| Page Object Model | `pages/*.ts` |
| Reusable methods | `ProductsPage.sortBy`, `ProductsPage.addToCart`, `CheckoutPage.fillInfo` |
| Data-driven testing (JSON) | `test-data/users.json`, `test-data/checkout.json`, loaded by `utils/testData.ts`, used in `tests/login.spec.ts` and `tests/checkout.spec.ts` |
| Built-in fixtures (`page`, `context`, `browser`, `request`) | `page` in most specs; `request` in `tests/api.spec.ts`; `browser` and `context` shown in `tests/auth.setup.ts` (`page.context()`) |
| Custom fixtures | `fixtures/index.ts` (`loginPage`, `cartPage`, `checkoutPage`, `productsPage`) |
| Authentication with `storageState` | `tests/auth.setup.ts` (writes), `tests/auth-storage.spec.ts` (reads), config `projects.dependencies` |
| Auto-waiting, explicit waits, assertions | Everywhere; `toHaveText`, `toHaveCount`, `toBeChecked` in `tests/*.spec.ts` |
| Locators | `getByTestId` in `pages/`; `getByRole` in `tests/practice-features.spec.ts` |
| Dropdowns | `ProductsPage.sortBy` (SauceDemo); `practice-features.spec.ts` (`selectOption`) |
| Checkboxes | `practice-features.spec.ts` |
| Radio buttons | `practice-features.spec.ts` (demoqa.com) |
| Multiple tabs and windows | `practice-features.spec.ts` (`waitForEvent('popup')`) |
| Popups and dialogs | `practice-features.spec.ts` (alert via `page.once('dialog')`) |
| Frames and iframes | `practice-features.spec.ts` (`frameLocator`) |
| File upload | `practice-features.spec.ts` (`setInputFiles`) |
| File download | `practice-features.spec.ts` (`waitForEvent('download')`) |
| Hooks | `beforeEach` in `login.spec.ts`, `checkout.spec.ts`; `afterEach` in `cart.spec.ts`, `practice-features.spec.ts`; `beforeAll` in `practice-features.spec.ts`. `afterAll` is not used. |
| Parallel execution, workers, retries | `playwright.config.ts` (`fullyParallel`, `workers`, `retries`) |
| Browser projects | `playwright.config.ts` (`chromium`, `firefox`, `webkit`) |
| API testing | `tests/api.spec.ts` |
| Environment variables | `.env.example`, `playwright.config.ts` (`dotenv`), `utils/env.ts` |
| Screenshots, videos, traces, reports | `playwright.config.ts` (`use` and `reporter`) |

## 7. Jenkins setup checklist

1. Install the plugins: **NodeJS**, **JUnit** (usually preinstalled), and **HTML Publisher** (optional, for an HTML report tab).
2. Go to Manage Jenkins > Tools > NodeJS, add an installation named `NodeJS-20` with version 20.x, and tick "Install automatically".
3. Create a Pipeline job and point it to this repository, or paste the `Jenkinsfile`.
4. Agent: the agent needs Git, Node, and the ability to run `bat` (Windows) or `sh` (Linux). The Jenkinsfile chooses automatically.
5. Environment variables: set `BASE_URL` and `SAUCE_*` in the job or pipeline `environment` block. For private credentials, use Manage Jenkins > Credentials (Username with password) and bind them with `withCredentials`.
6. Run the job. Check the **Test Results** page (from the JUnit publisher) and the archived `playwright-report` artifact.

## 8. GitHub Actions setup checklist

1. Push the project to a GitHub repository.
2. The workflow at `.github/workflows/playwright.yml` runs on every push, pull request, and manual trigger.
3. Optional: add repository secrets (Settings > Secrets and variables > Actions) named `SAUCE_USERNAME` and `SAUCE_PASSWORD`, then map them in the workflow `env:` block.
4. Open the Actions tab, click a run, and download the `playwright-report` artifact.

## 9. Notes and limits

- The `lint` script runs the TypeScript compiler in type-check mode. It does not run ESLint. This keeps the setup small for beginners.
- Some selectors and error messages come from SauceDemo's public markup. If the site changes, check the failing selector in browser DevTools and update the page object.
- The practice-site tests depend on third-party sites (the-internet.herokuapp.com, demoqa.com, jsonplaceholder.typicode.com). If one is down, those tests fail for reasons outside this project.
