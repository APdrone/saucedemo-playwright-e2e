import { test, expect } from '../src/fixtures/pageFixtures';
import { USERS } from '../src/data/testData';

test.describe('Product Catalog & Sorting', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.STANDARD.username, USERS.STANDARD.password);
  });

  test('TC-SORT-01: Sort products by price low to high @regression', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getAllItemPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('TC-SORT-02: Sort products by price high to low @regression', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getAllItemPrices();
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('TC-SORT-03: Sort products by name A to Z and Z to A @regression', async ({
    inventoryPage,
  }) => {
    // A to Z
    await inventoryPage.sortBy('az');
    const namesAZ = await inventoryPage.getAllItemNames();
    const sortedAZ = [...namesAZ].sort();
    expect(namesAZ).toEqual(sortedAZ);

    // Z to A
    await inventoryPage.sortBy('za');
    const namesZA = await inventoryPage.getAllItemNames();
    const sortedZA = [...namesZA].sort().reverse();
    expect(namesZA).toEqual(sortedZA);
  });
});
