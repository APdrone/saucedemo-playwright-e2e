import { test, expect } from '../src/fixtures/pageFixtures';
import { USERS, PRODUCTS } from '../src/data/testData';

test.describe('Shopping Cart & State Management', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
  });

  test('TC-CART-01: Adding and removing items updates cart badge dynamically @smoke', async ({
    inventoryPage,
  }) => {
    // Initially badge is not displayed
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);

    // Add first item
    await inventoryPage.addItemToCartByName(PRODUCTS.BACKPACK);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    // Add second item
    await inventoryPage.addItemToCartByName(PRODUCTS.BOLT_T_SHIRT);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    // Remove first item
    await inventoryPage.removeItemFromCartByName(PRODUCTS.BACKPACK);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('TC-CART-02: Item removed from Cart page updates cart state and list @regression', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addItemToCartByName(PRODUCTS.FLEECE_JACKET);
    await inventoryPage.addItemToCartByName(PRODUCTS.ONESIE);
    await inventoryPage.goToCart();

    let items = await cartPage.getItemNames();
    expect(items).toEqual([PRODUCTS.FLEECE_JACKET, PRODUCTS.ONESIE]);

    // Remove Fleece Jacket from cart
    await cartPage.removeItemByName(PRODUCTS.FLEECE_JACKET);
    items = await cartPage.getItemNames();
    expect(items).toEqual([PRODUCTS.ONESIE]);

    // Continue shopping takes user back to products
    await cartPage.continueShopping();
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });
});
