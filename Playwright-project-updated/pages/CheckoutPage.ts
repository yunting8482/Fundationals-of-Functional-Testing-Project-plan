import { expect, type Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async openCart() {
    await this.page.getByTestId('shopping-cart-link').click();
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  async startCheckout() {
    await this.page.getByTestId('checkout').click();
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
  }

  async fillCustomerInformation(firstName: string, lastName: string, postalCode: string) {
    await this.page.getByTestId('firstName').fill(firstName);
    await this.page.getByTestId('lastName').fill(lastName);
    await this.page.getByTestId('postalCode').fill(postalCode);
  }

  async continueToOverview() {
    await this.page.getByTestId('continue').click();
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
  }

  async finishOrder() {
    await this.page.getByTestId('finish').click();
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
  }
}
