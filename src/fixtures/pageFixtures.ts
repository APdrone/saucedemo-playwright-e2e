import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';
import { InventoryPage } from '../pom/InventoryPage';
import { CartPage } from '../pom/CartPage';
import { CheckoutStepOnePage } from '../pom/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pom/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pom/CheckoutCompletePage';

type CustomFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
};

export const test = baseTest.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutStepOnePage: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },
  checkoutStepTwoPage: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

export { expect };
