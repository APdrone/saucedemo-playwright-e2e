# SauceDemo Test Design & Strategy Document

**Author:** Aman Patwal  
**Role:** Senior QA Engineer Assessment (Sparkrock)  
**Target App:** SauceDemo ([saucedemo.com](https://www.saucedemo.com/))  
**Tech Stack:** Playwright (TypeScript), Node.js  

---

## 1. Overview & Objective

For this challenge, I chose **SauceDemo (Swag Labs)** as the target application. It represents a typical e-commerce storefront with user authentication, catalog browsing, cart operations, and a multi-step checkout funnel. 

My goal with this document is to outline:
1. What I am testing and what I chose to keep out of scope.
2. My test strategy and rationale, especially regarding the **Testing Pyramid**.
3. Why I chose Playwright with TypeScript.
4. The full test case suite covering happy paths, negative tests, and edge cases.

---

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Critical Business Journeys):
- **User Authentication & Session**: Valid login, locked-out user handling, invalid credentials, empty field validations, and logout.
- **Product Catalog & Sorting**: Name (A to Z, Z to A) and Price (Low to High, High to Low) sorting mechanics.
- **Cart Management**: Adding/removing items from both inventory and cart views, dynamic badge count verification, and state persistence.
- **Checkout Funnel (Revenue Path)**: Step 1 (Customer info), Step 2 (Order summary, calculation of subtotal + tax = total), and Step 3 (Order completion).

### Out-of-Scope:
- Static footer links (Twitter, Facebook, LinkedIn external redirections).
- Deep cross-browser visual regression testing (visual pixels), as the priority here is functional end-to-end reliability.
- Heavy performance/load testing (SauceDemo runs mostly client-side mock data; performance glitch user is covered functionally).

---

## 3. Test Strategy & The Testing Pyramid

When designing automated tests, my primary rule is to follow test pyramid (trying to automate every minor permutation through the browser UI).

```
UI / E2E Tests (Apex)
-> Critical happy paths, key error banners,
  cross-page user journeys (Login -> Checkout)

Integration & API Tests (Middle)
-> Business rules, tax logic, auth tokens,
  status code validations

Unit Tests (Base)
-> Regex validation, string formatting,
  discount math, state reducers
```

### How I applied this to SauceDemo:
1. **Focus UI tests on the "Revenue Path"**: In an e-commerce platform, the checkout funnel is where money is made. If checkout breaks, the business loses revenue immediately. Therefore, the E2E checkout journey is my top priority (P0) for browser automation.
2. **UI for Feedback, Unit/API for Permutations**: 
   - On the UI, I verify that empty checkout fields display the correct error banner (`Error: First Name is required`).
   - I do not automate 50 different variations of invalid zip code strings (alphanumeric, special characters, max lengths) on the UI. That belongs in unit tests for the input validator or API schema checks, keeping our UI test suite fast, deterministic, and cheap to run.
3. **Deterministic & Isolated**: Each test runs in its own browser context without depending on state left behind by previous tests.

---

## 4. Why Playwright with TypeScript?

I chose **Playwright + TypeScript** over Cypress or Selenium for practical reasons:

* **No Flaky Sleep Calls (`Auto-Waiting`)**: Playwright checks that elements are visible, enabled, and stable before clicking or filling. We don't have to litter our tests with `page.waitForTimeout(3000)`.
* **TypeScript Safety**: Catching typo errors in element locators, test data properties, or method names at compile time saves hours during development and test maintenance.
* **Custom Fixtures (`test.extend`)**: Instead of doing `const loginPage = new LoginPage(page)` at the top of every single test, Playwright lets us inject page objects directly into the test parameters. It keeps the spec files clean and handles setup/teardown automatically.
* **Trace Viewer & Native Reports**: If a test fails in CI (GitHub Actions), Playwright's Trace Viewer lets me inspect DOM snapshots, network calls, and console logs at the exact millisecond of failure.
* **Speed**: Tests run in parallel out of the box using worker threads.

---

## 5. Risk Assessment & Priority Breakdown

I categorized test cases using a simple risk-based priority scheme:

- **P0 (Critical / Smoke)**: The core revenue path and primary blocker scenarios. If these fail, the build is blocked.
  - Standard user login.
  - End-to-end checkout purchase flow.
  - Locked-out user security enforcement.
- **P1 (High / Core)**: Core user interactions that directly impact user experience.
  - Cart item additions, badge counter updates, and cart item removal.
  - Field validation messages on the checkout form.
  - User logout and session cleanup.
- **P2 (Medium / Regression)**: Functional features that improve usability.
  - Product catalog sorting (price low-to-high, high-to-low, alphabetical).
  - Empty field error handling on the login screen.

---

## 6. Detailed Test Cases

### Module 1: Authentication (`AUTH`)

#### TC-AUTH-01: Standard User Successful Login
- **Priority**: P0 (Smoke)
- **Preconditions**: User is on login page (`https://www.saucedemo.com/`).
- **Steps**:
  1. Enter `standard_user` into the Username field.
  2. Enter `secret_sauce` into the Password field.
  3. Click the Login button.
- **Expected Result**: User is redirected to `/inventory.html`. Header displays "Products" and product cards are visible.

#### TC-AUTH-02: Locked-Out User Security Check
- **Priority**: P0 (Regression / Security)
- **Preconditions**: User is on login page.
- **Steps**:
  1. Enter `locked_out_user` into the Username field.
  2. Enter `secret_sauce` into the Password field.
  3. Click the Login button.
- **Expected Result**: User remains on login page. An error message appears stating: `Epic sadface: Sorry, this user has been locked out.`

#### TC-AUTH-03: Invalid Credentials Rejection
- **Priority**: P1 (Regression)
- **Preconditions**: User is on login page.
- **Steps**:
  1. Enter `invalid_user` into Username.
  2. Enter `wrong_password` into Password.
  3. Click Login.
- **Expected Result**: Error banner shows: `Epic sadface: Username and password do not match any user in this service`.

#### TC-AUTH-04: Empty Fields Validation
- **Priority**: P2 (Regression)
- **Preconditions**: User is on login page.
- **Steps**:
  1. Click Login with both fields empty. Verify error message.
  2. Enter `standard_user` and leave Password empty. Click Login. Verify error message.
- **Expected Result**:
  - Sub-step 1: `Epic sadface: Username is required`.
  - Sub-step 2: `Epic sadface: Password is required`.

#### TC-AUTH-05: User Logout
- **Priority**: P1 (Smoke)
- **Preconditions**: User is logged in on `/inventory.html`.
- **Steps**:
  1. Click the burger menu button on top left.
  2. Click the "Logout" sidebar link.
- **Expected Result**: User is logged out and returned to the login screen. Login inputs are displayed.

---

### Module 2: Shopping Cart & Inventory (`CART`)

#### TC-CART-01: Add/Remove Items & Dynamic Cart Badge Update
- **Priority**: P1 (Smoke)
- **Preconditions**: User is logged in on `/inventory.html`. Cart is initially empty.
- **Steps**:
  1. Check that the shopping cart icon has no badge count.
  2. Click "Add to cart" for "Sauce Labs Backpack".
  3. Verify cart badge displays `1`.
  4. Click "Add to cart" for "Sauce Labs Bolt T-Shirt".
  5. Verify cart badge displays `2`.
  6. Click "Remove" for "Sauce Labs Backpack".
- **Expected Result**: The cart badge updates to `1`, and the backpack button reverts to "Add to cart".

#### TC-CART-02: Cart Item Verification and Removal Inside Cart Page
- **Priority**: P1 (Regression)
- **Preconditions**: User has added "Sauce Labs Fleece Jacket" and "Sauce Labs Onesie" to cart.
- **Steps**:
  1. Click the cart icon to navigate to `/cart.html`.
  2. Verify that both items are listed in the cart table with correct names.
  3. Click "Remove" on "Sauce Labs Fleece Jacket".
  4. Verify only "Sauce Labs Onesie" remains.
  5. Click "Continue Shopping".
- **Expected Result**: User is returned to `/inventory.html`. The Onesie still displays "Remove" on its card, confirming cart state was preserved.

---

### Module 3: Product Sorting (`SORT`)

#### TC-SORT-01: Sort Products by Price (Low to High)
- **Priority**: P2 (Regression)
- **Preconditions**: User is on `/inventory.html`.
- **Steps**:
  1. Select "Price (low to high)" from the sort dropdown.
  2. Read all price values on the page into a list.
- **Expected Result**: Prices are in ascending numerical order ($7.99, $9.99, $15.99, etc.).

#### TC-SORT-02: Sort Products by Price (High to Low)
- **Priority**: P2 (Regression)
- **Preconditions**: User is on `/inventory.html`.
- **Steps**:
  1. Select "Price (high to low)" from the sort dropdown.
  2. Read all price values on the page into a list.
- **Expected Result**: Prices are in descending numerical order ($49.99, $29.99, $15.99, etc.).

#### TC-SORT-03: Sort Products Alphabetically (A to Z and Z to A)
- **Priority**: P2 (Regression)
- **Preconditions**: User is on `/inventory.html`.
- **Steps**:
  1. Select "Name (A to Z)" and verify items are in alphabetical order.
  2. Select "Name (Z to A)" and verify items are in reverse alphabetical order.
- **Expected Result**: Item titles match the expected alphabetical sort orders.

---

### Module 4: Checkout Funnel (`E2E`)

#### TC-E2E-01: Complete End-to-End Purchase Journey (Happy Path)
- **Priority**: P0 (Smoke / Revenue Path)
- **Preconditions**: User is logged in as `standard_user`.
- **Steps**:
  1. From inventory, add "Sauce Labs Backpack" and "Sauce Labs Bike Light" to cart.
  2. Navigate to cart and verify both items are present.
  3. Click "Checkout".
  4. Fill in customer details: First Name (`John`), Last Name (`Doe`), Postal Code (`12345`).
  5. Click "Continue".
  6. On Step 2 (Overview):
     - Verify both items are listed in summary.
     - Verify item subtotal matches sum of item prices.
     - Check calculation: `Item total + Tax == Total`.
  7. Click "Finish".
  8. Verify the order confirmation screen displays:
     - Header: "Thank you for your order!"
     - Body: "Your order has been dispatched..."
  9. Click "Back Home".
- **Expected Result**: Order completes successfully without exceptions. User is returned to the inventory catalog with an empty shopping cart.

#### TC-E2E-02: Checkout Step 1 Mandatory Field Validations
- **Priority**: P1 (Regression)
- **Preconditions**: User is in checkout step 1 (`/checkout-step-one.html`) with at least one item in cart.
- **Steps**:
  1. Leave First Name empty, fill Last Name and Zip. Click "Continue".
  2. Fill First Name, leave Last Name empty, fill Zip. Click "Continue".
  3. Fill First Name and Last Name, leave Zip empty. Click "Continue".
- **Expected Result**:
  - Case 1: Displays `Error: First Name is required`.
  - Case 2: Displays `Error: Last Name is required`.
  - Case 3: Displays `Error: Postal Code is required`.

---

## 7. Notes on SauceDemo Personas & Edge Cases

SauceDemo provides several user personas that help test system quirks:
- `standard_user`: Normal, happy path testing.
- `locked_out_user`: Validates auth lockout behavior and security banners.
- `problem_user`: Has broken image URLs and buggy inventory item cards (great for detecting UI defects).
- `performance_glitch_user`: Has an artificial 5-second delay when loading the inventory page. Our Playwright framework handles this gracefully because of built-in actionability checks and auto-waiting rather than failing with hardcoded timeout exceptions.

---

## 8. Test Automation Architecture Summary

In the code repository:
- `src/pom/`: Houses individual Page Object classes (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutStepOnePage`, `CheckoutStepTwoPage`, `CheckoutCompletePage`). Locators use resilient `data-test` attributes and semantic roles.
- `src/fixtures/pageFixtures.ts`: Uses Playwright's `test.extend` so any test can simply declare `{ loginPage, cartPage }` in its arguments.
- `src/data/testData.ts`: Centralizes users, test data objects, and error message strings so if an error message changes, we only update it in one place.
- `.github/workflows/playwright.yml`: Runs the tests on Chromium, Firefox, and WebKit on push/PR.
