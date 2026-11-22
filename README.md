# SauceDemo E2E Automation Suite (Playwright + TypeScript)

Automated UI test suite for [SauceDemo](https://www.saucedemo.com/), prepared for the **Senior QA Engineer** Real Work Challenge at **Sparkrock**.

- **Author:** Aman Patwal
- **Video Walkthrough:** [SauceDemo Automation Walkthrough](https://www.youtube.com/watch?v=rmM89p3I0Hc)
- **Documentation:** [Test Design & Strategy Document](docs/test-design-document.md)

---

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/APdrone/saucedemo-playwright-e2e.git
cd saucedemo-playwright-e2e

# Install dependencies (Chromium installs automatically via postinstall hook)
npm install

# Copy environment config
cp .env.example .env
```

### 3. Run Tests
```bash
# Run all tests headless across Chromium
npm test

# Run in interactive UI mode (great for step-by-step debugging)
npm run test:ui

# Run with visible browser
npm run test:headed

# Run smoke tests only
npm run test:smoke

# View test report
npm run report
```

---

## Framework & Architecture

I built this framework using **Playwright with TypeScript**, focusing on maintainability, speed, and zero flakiness.

### Key Implementation Choices

1. **Page Object Model (POM)**:
   - Each view (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutStepOnePage`, etc.) lives under `src/pom/` and encapsulates its own locators and interaction methods.
   - Tests read cleanly as business actions without leaking raw selectors into spec files.

2. **Custom Fixtures (`test.extend`)**:
   - Instead of manually instantiating `new LoginPage(page)` inside `beforeEach` or inside every test, page objects are injected via Playwright fixtures in `src/fixtures/pageFixtures.ts`.
   - Each test gets isolated, cleanly initialized page objects with automatic context teardown.

3. **Resilient Selectors**:
   - Prioritized SauceDemo's native `data-test` attributes (`[data-test="username"]`, `[data-test="checkout"]`) and semantic accessibility roles (`getByRole`). Avoided brittle XPath or deep CSS chains.

4. **Configuration & Credentials**:
   - Credentials and environment URLs are read from `process.env` (configured via `.env`) with safe fallback defaults in `src/data/testData.ts`. This allows running against different environments or secrets in CI without breaking out-of-the-box local execution.

5. **CI/CD Ready**:
   - Includes a working GitHub Actions workflow in `.github/workflows/playwright.yml` that runs on push and pull requests, generating and uploading HTML test reports as build artifacts.

---

## Test Strategy & Test Cases

The detailed test design, risk assessment, and Testing Pyramid rationale are documented here:
👉 **[docs/test-design-document.md](docs/test-design-document.md)**

### Coverage Summary

| File | Test ID | Description | Tag |
| :--- | :--- | :--- | :--- |
| `tests/checkout.spec.ts` | `TC-E2E-01` | Full end-to-end checkout purchase (revenue path) | `@smoke`, `@regression` |
| `tests/checkout.spec.ts` | `TC-E2E-02` | Mandatory customer field validations on checkout | `@regression` |
| `tests/auth.spec.ts` | `TC-AUTH-01` | Valid login and redirect to inventory | `@smoke` |
| `tests/auth.spec.ts` | `TC-AUTH-02` | Locked-out user security error banner check | `@regression` |
| `tests/auth.spec.ts` | `TC-AUTH-03` | Invalid credentials error message check | `@regression` |
| `tests/auth.spec.ts` | `TC-AUTH-04` | Empty username and password validations | `@regression` |
| `tests/auth.spec.ts` | `TC-AUTH-05` | User logout and session cleanup | `@smoke` |
| `tests/cart.spec.ts` | `TC-CART-01` | Adding/removing items and dynamic cart badge count | `@smoke` |
| `tests/cart.spec.ts` | `TC-CART-02` | In-cart item removal and state persistence | `@regression` |
| `tests/inventory.spec.ts` | `TC-SORT-01` | Product price sorting: Low to High | `@regression` |
| `tests/inventory.spec.ts` | `TC-SORT-02` | Product price sorting: High to Low | `@regression` |
| `tests/inventory.spec.ts` | `TC-SORT-03` | Product alphabetical sorting: A to Z & Z to A | `@regression` |

---

## Project Structure

```
saucedemo-playwright-e2e/
├── .github/workflows/
│   └── playwright.yml             # GitHub Actions CI pipeline
├── docs/
│   └── test-design-document.md    # Test design, testing pyramid, and test case specs
├── src/
│   ├── data/
│   │   └── testData.ts            # User accounts, constants, and checkout payloads
│   ├── fixtures/
│   │   └── pageFixtures.ts        # Custom Playwright fixtures (dependency injection)
│   └── pom/                       # Page Object Model classes
│       ├── BasePage.ts
│       ├── LoginPage.ts
│       ├── InventoryPage.ts
│       ├── CartPage.ts
│       ├── CheckoutStepOnePage.ts
│       ├── CheckoutStepTwoPage.ts
│       └── CheckoutCompletePage.ts
├── tests/                         # Test specifications
│   ├── auth.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── inventory.spec.ts
├── .env.example                   # Environment variable template
├── package.json                   # Scripts and project dependencies
├── playwright.config.ts           # Playwright test runner configuration
└── tsconfig.json                  # TypeScript compiler options
```

---

## All Available NPM Scripts

| Command | What it does |
| :--- | :--- |
| `npm test` | Runs the full test suite headless |
| `npm run test:headed` | Runs tests with visible browser windows |
| `npm run test:ui` | Opens Playwright UI mode for interactive debugging |
| `npm run test:chromium` | Runs tests only in Chromium |
| `npm run test:firefox` | Runs tests only in Firefox |
| `npm run test:webkit` | Runs tests only in WebKit (Safari engine) |
| `npm run test:smoke` | Runs tests tagged with `@smoke` |
| `npm run test:regression` | Runs tests tagged with `@regression` |
| `npm run install:browsers` | Installs all browser engines (Chromium, Firefox, WebKit) |
| `npm run report` | Opens the local HTML test execution report |
