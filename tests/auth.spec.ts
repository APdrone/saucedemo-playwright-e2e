import { test, expect } from '../src/fixtures/pageFixtures';
import { USERS, ERROR_MESSAGES } from '../src/data/testData';

test.describe('Authentication & Security Scenarios', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-AUTH-01: Standard user should log in successfully and redirect to inventory @smoke', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await expect(inventoryPage.pageTitle).toBeVisible();
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('TC-AUTH-02: Locked out user should be prevented from logging in with descriptive error @regression', async ({
    loginPage,
  }) => {
    await loginPage.login(USERS.LOCKED_OUT.username, USERS.LOCKED_OUT.password);
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toBe(ERROR_MESSAGES.LOCKED_OUT);
  });

  test('TC-AUTH-03: Invalid credentials should display error message @regression', async ({
    loginPage,
  }) => {
    await loginPage.login(USERS.INVALID_USER.username, USERS.INVALID_USER.password);
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('TC-AUTH-04: Empty username and password should prompt required field validation @regression', async ({
    loginPage,
  }) => {
    // Attempt login without entering anything
    await loginPage.login();
    expect(await loginPage.getErrorMessage()).toBe(ERROR_MESSAGES.USERNAME_REQUIRED);

    // Enter username only
    await loginPage.login(USERS.STANDARD.username, '');
    expect(await loginPage.getErrorMessage()).toBe(ERROR_MESSAGES.PASSWORD_REQUIRED);
  });

  test('TC-AUTH-05: Authenticated user can log out successfully @smoke', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
    await expect(inventoryPage.pageTitle).toHaveText('Products');

    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
