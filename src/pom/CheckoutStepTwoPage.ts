import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async getItemNames(): Promise<string[]> {
    return await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.textContent();
    const match = text?.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async getTax(): Promise<number> {
    const text = await this.taxLabel.textContent();
    const match = text?.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async getTotal(): Promise<number> {
    const text = await this.totalLabel.textContent();
    const match = text?.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
