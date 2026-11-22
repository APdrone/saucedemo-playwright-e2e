import { test, expect } from '../src/fixtures/pageFixtures';
import { USERS, CHECKOUT_DATA, PRODUCTS, ERROR_MESSAGES } from '../src/data/testData';

test.describe('E2E Checkout Workflow', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
  });
  
  test('TC-E2E-01: Should complete end-to-end purchase successfully for standard user @smoke @regression', async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    // 1. Verify landed on inventory page
    await expect(inventoryPage.pageTitle).toHaveText('Products');

    // 2. Add multiple items to cart
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK);
    await inventoryPage.addItemToCartByName(PRODUCTS.BIKE_LIGHT);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // 3. Navigate to Cart and verify items
    await inventoryPage.goToCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    const cartItems = await cartPage.getItemNames();
    expect(cartItems).toContain(PRODUCTS.BACKPACK);
    expect(cartItems).toContain(PRODUCTS.BIKE_LIGHT);

    // 4. Proceed to Checkout Step 1
    await cartPage.proceedToCheckout();
    await expect(checkoutStepOnePage.pageTitle).toHaveText('Checkout: Your Information');

    // 5. Fill customer details and continue
    await checkoutStepOnePage.fillCustomerInformation(CHECKOUT_DATA.VALID);
    await checkoutStepOnePage.clickContinue();

    // 6. Verify Checkout Step 2 (Overview)
    await expect(checkoutStepTwoPage.pageTitle).toHaveText('Checkout: Overview');
    const overviewItems = await checkoutStepTwoPage.getItemNames();
    expect(overviewItems).toContain(PRODUCTS.BACKPACK);
    expect(overviewItems).toContain(PRODUCTS.BIKE_LIGHT);

    const subtotal = await checkoutStepTwoPage.getSubtotal();
    const tax = await checkoutStepTwoPage.getTax();
    const total = await checkoutStepTwoPage.getTotal();
    expect(subtotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThan(0);
    expect(Number((subtotal + tax).toFixed(2))).toBe(total);

    // 7. Complete the purchase
    await checkoutStepTwoPage.clickFinish();

    // 8. Verify Confirmation on Complete page
    await expect(checkoutCompletePage.pageTitle).toHaveText('Checkout: Complete!');
    await expect(checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutCompletePage.completeText).toContainText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    );

    // 9. Back to products
    await checkoutCompletePage.clickBackHome();
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('TC-E2E-02: Should validate mandatory customer information fields during checkout @regression', async ({
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
  }) => {
    // Add item and go to checkout step 1
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Case A: Missing First Name
    await checkoutStepOnePage.fillCustomerInformation(CHECKOUT_DATA.MISSING_FIRST_NAME);
    await checkoutStepOnePage.clickContinue();
    expect(await checkoutStepOnePage.getErrorMessage()).toBe(ERROR_MESSAGES.CHECKOUT_FIRST_NAME_REQUIRED);

    // Case B: Missing Last Name
    await checkoutStepOnePage.fillCustomerInformation(CHECKOUT_DATA.MISSING_LAST_NAME);
    await checkoutStepOnePage.clickContinue();
    expect(await checkoutStepOnePage.getErrorMessage()).toBe(ERROR_MESSAGES.CHECKOUT_LAST_NAME_REQUIRED);

    // Case C: Missing Postal Code
    await checkoutStepOnePage.fillCustomerInformation(CHECKOUT_DATA.MISSING_POSTAL_CODE);
    await checkoutStepOnePage.clickContinue();
    expect(await checkoutStepOnePage.getErrorMessage()).toBe(ERROR_MESSAGES.CHECKOUT_POSTAL_CODE_REQUIRED);
  });
});
