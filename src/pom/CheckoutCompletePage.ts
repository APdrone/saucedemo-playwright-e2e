import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly pageTitle: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async getConfirmationHeader(): Promise<string> {
    return (await this.completeHeader.textContent()) || '';
  }

  async getConfirmationMessage(): Promise<string> {
    return (await this.completeText.textContent()) || '';
  }

  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
