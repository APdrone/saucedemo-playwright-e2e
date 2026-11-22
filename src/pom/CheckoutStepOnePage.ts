import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutCustomerInfo } from '../data/testData';

export class CheckoutStepOnePage extends BasePage {
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillCustomerInformation(info: Partial<CheckoutCustomerInfo>): Promise<void> {
    if (info.firstName !== undefined) {
      await this.firstNameInput.fill(info.firstName);
    }
    if (info.lastName !== undefined) {
      await this.lastNameInput.fill(info.lastName);
    }
    if (info.postalCode !== undefined) {
      await this.postalCodeInput.fill(info.postalCode);
    }
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.textContent()) || '';
  }
}
