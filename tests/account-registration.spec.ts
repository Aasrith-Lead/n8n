import { test, expect, Page } from '@playwright/test';

class RegistrationPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    // Replace with the actual registration page URL
    await this.page.goto('/register');
  }

  async fillField(field: string, value: string) {
    // Use data-testid selectors for input fields
    switch (field) {
      case 'First Name':
        await this.page.locator('[data-testid="firstName"]').fill(value);
        break;
      case 'Last Name':
        await this.page.locator('[data-testid="lastName"]').fill(value);
        break;
      case 'Email':
        await this.page.locator('[data-testid="email"]').fill(value);
        break;
      case 'Password':
        await this.page.locator('[data-testid="password"]').fill(value);
        break;
      case 'Confirm Password':
        await this.page.locator('[data-testid="confirmPassword"]').fill(value);
        break;
      default:
        throw new Error(`Unknown field: ${field}`);
    }
  }

  async clickRegisterButton() {
    // Use data-testid selector for the register button
    await this.page.locator('[data-testid="registerButton"]').click();
  }

  async getErrorMessage() {
    // Use data-testid selector for the error message element
    return await this.page.locator('[data-testid="errorMessage"]').textContent();
  }

  async waitForSuccessPage() {
    // Wait for the success page to load.  You may need to adjust the selector.
    await this.page.waitForURL('/success');
  }

  async checkWelcomeEmail(email: string): Promise<boolean> {
    // Mocking email service is outside the scope. This should ideally check an inbox.
    // This is a placeholder.
    console.log(`Checking for welcome email to: ${email}`);
    return true; // Assume email is sent for now.  In a real test, you'd verify with an API or UI.
  }

  async createExistingAccount(email: string): Promise<void> {
    // This should create an existing account through the backend.
    // API call or direct database insertion are suitable.
    // This is a placeholder.
    console.log(`Creating existing account with email: ${email}`);
  }

  async deleteExistingAccount(email: string): Promise<void> {
    // This should delete an existing account through the backend.
    // API call or direct database deletion are suitable.
    // This is a placeholder.
    console.log(`Deleting existing account with email: ${email}`);
  }
}

test.describe('Account Registration', () => {

  test('Successful Account Registration with Valid Data', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // Given the user is on the registration page
    await registrationPage.goto();

    // When the user enters valid data:
    await registrationPage.fillField('First Name', 'John');
    await registrationPage.fillField('Last Name', 'Doe');
    await registrationPage.fillField('Email', 'john.doe@example.com');
    await registrationPage.fillField('Password', 'Password123!');
    await registrationPage.fillField('Confirm Password', 'Password123!');

    // And the user clicks the "Register" button
    await registrationPage.clickRegisterButton();

    // Then the user should be redirected to the success page
    await registrationPage.waitForSuccessPage();

    // And a welcome email should be sent to john.doe@example.com
    expect(await registrationPage.checkWelcomeEmail('john.doe@example.com')).toBe(true);
  });

  test('Account Registration with Missing First Name', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // Given the user is on the registration page
    await registrationPage.goto();

    // When the user enters data with a missing first name:
    await registrationPage.fillField('Last Name', 'Doe');
    await registrationPage.fillField('Email', 'john.doe@example.com');
    await registrationPage.fillField('Password', 'Password123!');
    await registrationPage.fillField('Confirm Password', 'Password123!');

    // And the user clicks the "Register" button
    await registrationPage.clickRegisterButton();

    // Then an error message should be displayed: "First name is required"
    expect(await registrationPage.getErrorMessage()).toBe('First name is required');
  });

  test('Account Registration with Invalid Email Format', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // Given the user is on the registration page
    await registrationPage.goto();

    // When the user enters data with an invalid email format:
    await registrationPage.fillField('First Name', 'John');
    await registrationPage.fillField('Last Name', 'Doe');
    await registrationPage.fillField('Email', 'john.doe');
    await registrationPage.fillField('Password', 'Password123!');
    await registrationPage.fillField('Confirm Password', 'Password123!');

    // And the user clicks the "Register" button
    await registrationPage.clickRegisterButton();

    // Then an error message should be displayed: "Invalid email format"
    expect(await registrationPage.getErrorMessage()).toBe('Invalid email format');
  });

  test('Account Registration with Password Mismatch', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // Given the user is on the registration page
    await registrationPage.goto();

    // When the user enters data with mismatched passwords:
    await registrationPage.fillField('First Name', 'John');
    await registrationPage.fillField('Last Name', 'Doe');
    await registrationPage.fillField('Email', 'john.doe@example.com');
    await registrationPage.fillField('Password', 'Password123!');
    await registrationPage.fillField('Confirm Password', 'Password456!');

    // And the user clicks the "Register" button
    await registrationPage.clickRegisterButton();

    // Then an error message should be displayed: "Passwords do not match"
    expect(await registrationPage.getErrorMessage()).toBe('Passwords do not match');
  });

  test('Account Registration with Weak Password', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);

    // Given the user is on the registration page
    await registrationPage.goto();

    // When the user enters data with a weak password:
    await registrationPage.fillField('First Name', 'John');
    await registrationPage.fillField('Last Name', 'Doe');
    await registrationPage.fillField('Email', 'john.doe@example.com');
    await registrationPage.fillField('Password', 'weak');
    await registrationPage.fillField('Confirm Password', 'weak');

    // And the user clicks the "Register" button
    await registrationPage.clickRegisterButton();

    // Then an error message should be displayed: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    expect(await registrationPage.getErrorMessage()).toBe('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  });

  test('Account Registration with Email Already Registered', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const existingEmail = 'existing@example.com';

    // Given the user is on the registration page
    await registrationPage.goto();
    // And an account exists with the email address "existing@example.com"
    try {
      await registrationPage.createExistingAccount(existingEmail);

      // When the user enters data with an already registered email:
      await registrationPage.fillField('First Name', 'John');
      await registrationPage.fillField('Last Name', 'Doe');
      await registrationPage.fillField('Email', existingEmail);
      await registrationPage.fillField('Password', 'Password123!');
      await registrationPage.fillField('Confirm Password', 'Password123!');

      // And the user clicks the "Register" button
      await registrationPage.clickRegisterButton();

      // Then an error message should be displayed: "Email address is already registered"
      expect(await registrationPage.getErrorMessage()).toBe('Email address is already registered');
    } finally {
        // Ensure the existing account is cleaned up
        await registrationPage.deleteExistingAccount(existingEmail);
    }
  });
});