import { test, expect, Page } from '@playwright/test';

// Page Object Model for the New Customer page
class NewCustomerPage {
  constructor(public page: Page) {}

  async navigate() {
    await this.page.goto('/new-customer'); // Replace with the actual URL
  }

  async enterCustomerDetails(details: { [key: string]: string }) {
    for (const field in details) {
      try {
        const testId = `customer-${field.toLowerCase().replace(/\s+/g, '-')}`;
        await this.page.locator(`[data-testid="${testId}"]`).fill(details[field]);
      } catch (error) {
        // Fallback to role selector if data-testid is not found
        await this.page.getByRole('textbox', { name: field }).fill(details[field]);
      }
    }
  }

  async submitForm() {
    await this.page.getByRole('button', { name: 'Submit' }).click(); // Replace with the actual submit button text
  }

  async getNewCustomerId() {
    // Assuming the customer ID is displayed on the page after successful submission
    try {
      return await this.page.locator('[data-testid="customer-id"]').textContent();
    } catch (error) {
      // Fallback to text selector if data-testid is not found
      return await this.page.locator('text=Customer ID:').textContent();
    }
  }

  async getSuccessMessage() {
    try {
      return await this.page.locator('[data-testid="success-message"]').textContent();
    } catch (error) {
      return await this.page.locator('text=Customer created successfully').textContent();
    }
  }

  async getErrorMessage() {
    try {
      return await this.page.locator('[data-testid="error-message"]').textContent();
    } catch (error) {
      return await this.page.locator('text=Error').textContent();
    }
  }

    async enterFirstName(firstName: string) {
      try {
          await this.page.locator('[data-testid="customer-first-name"]').fill(firstName);
      } catch (error) {
          await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
      }
    }

    async enterLastName(lastName: string) {
        try {
            await this.page.locator('[data-testid="customer-last-name"]').fill(lastName);
        } catch (error) {
            await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
        }
    }

    async enterEmail(email: string) {
        try {
            await this.page.locator('[data-testid="customer-email"]').fill(email);
        } catch (error) {
            await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
        }
    }

    async enterPhoneNumber(phoneNumber: string) {
        try {
            await this.page.locator('[data-testid="customer-phone-number"]').fill(phoneNumber);
        } catch (error) {
            await this.page.getByRole('textbox', { name: 'Phone Number' }).fill(phoneNumber);
        }
    }

    async enterAddress(address: string) {
        try {
            await this.page.locator('[data-testid="customer-address"]').fill(address);
        } catch (error) {
            await this.page.getByRole('textbox', { name: 'Address' }).fill(address);
        }
    }
}

test.describe('Customer Onboarding', () => {
  let page: Page;
  let newCustomerPage: NewCustomerPage;

  test.beforeEach(async ({ browser }) => {
    // Launch browser and navigate to login page.
    page = await browser.newPage();
    await page.goto('/login'); // Replace with the actual login URL

    // Login as a CSR
    await page.locator('[data-testid="username"]').fill('csr'); // Replace with the actual username field selector
    await page.locator('[data-testid="password"]').fill('password'); // Replace with the actual password field selector
    await page.getByRole('button', { name: 'Login' }).click(); // Replace with the actual login button text

    // Initialize the NewCustomerPage object
    newCustomerPage = new NewCustomerPage(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Successfully create a new customer with valid details @smoke @regression', async () => {
    // Given I navigate to the "New Customer" page
    await newCustomerPage.navigate();

    // When I enter the following customer details:
    await newCustomerPage.enterCustomerDetails({
      'First Name': 'John',
      'Last Name': 'Doe',
      'Email': 'john.doe@example.com',
      'Phone Number': '123-456-7890',
      'Address': '123 Main Street',
    });

    // And I submit the form
    await newCustomerPage.submitForm();

    // Then a new customer ID is generated
    const customerId = await newCustomerPage.getNewCustomerId();
    expect(customerId).not.toBeNull();

    // And a success message is displayed
    const successMessage = await newCustomerPage.getSuccessMessage();
    expect(successMessage).toContain('Customer created successfully');
  });

  test('Fail to create a customer with missing required fields @regression @validation', async () => {
    // Given I navigate to the "New Customer" page
    await newCustomerPage.navigate();

    // When I submit the form without filling in any required fields
    await newCustomerPage.submitForm();

    // Then an error message is displayed indicating missing required fields
    const errorMessage = await newCustomerPage.getErrorMessage();
    expect(errorMessage).toContain('required');
  });

  const invalidEmails = ['john.doe', 'john.doe@', 'john.doe@example', '@example.com'];
  for (const email of invalidEmails) {
    test(`Fail to create a customer with invalid email format: ${email} @regression @validation`, async () => {
      // Given I navigate to the "New Customer" page
      await newCustomerPage.navigate();

      // When I enter the following customer details:
      await newCustomerPage.enterCustomerDetails({
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email': email,
        'Phone Number': '123-456-7890',
        'Address': '123 Main Street',
      });

      // And I submit the form
      await newCustomerPage.submitForm();

      // Then an error message is displayed indicating an invalid email format
      const errorMessage = await newCustomerPage.getErrorMessage();
      expect(errorMessage).toContain('invalid email');
    });
  }

  const invalidPhones = ['123456789', '123-456-789', '123.456.7890', 'abc-def-ghij'];
  for (const phone of invalidPhones) {
    test(`Fail to create a customer with invalid phone number format: ${phone} @regression @validation`, async () => {
      // Given I navigate to the "New Customer" page
      await newCustomerPage.navigate();

      // When I enter the following customer details:
      await newCustomerPage.enterCustomerDetails({
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email': 'john.doe@example.com',
        'Phone Number': phone,
        'Address': '123 Main Street',
      });

      // And I submit the form
      await newCustomerPage.submitForm();

      // Then an error message is displayed indicating an invalid phone number format
      const errorMessage = await newCustomerPage.getErrorMessage();
      expect(errorMessage).toContain('invalid phone');
    });
  }

    test('Create a customer with maximum allowed length for name fields @regression @edge', async () => {
        // Assuming maximum length is 50 for name fields
        const maxLength = 50;
        const longName = 'a'.repeat(maxLength);

        // Given I navigate to the "New Customer" page
        await newCustomerPage.navigate();

        // When I enter a First Name with the maximum allowed length
        await newCustomerPage.enterFirstName(longName);

        // And I enter a Last Name with the maximum allowed length
        await newCustomerPage.enterLastName(longName);

        // And I enter a valid Email
        await newCustomerPage.enterEmail('valid@example.com');

        // And I enter a valid Phone Number
        await newCustomerPage.enterPhoneNumber('123-456-7890');

        // And I enter a valid Address
        await newCustomerPage.enterAddress('123 Main Street');

        // And I submit the form
        await newCustomerPage.submitForm();

        // Then a new customer ID is generated
        const customerId = await newCustomerPage.getNewCustomerId();
        expect(customerId).not.toBeNull();

        // And a success message is displayed
        const successMessage = await newCustomerPage.getSuccessMessage();
        expect(successMessage).toContain('Customer created successfully');
    });

    test('Create a customer with special characters in address @regression @edge', async () => {
        // Given I navigate to the "New Customer" page
        await newCustomerPage.navigate();

        // When I enter the following customer details:
        await newCustomerPage.enterCustomerDetails({
            'First Name': 'John',
            'Last Name': 'Doe',
            'Email': 'john.doe@example.com',
            'Phone Number': '123-456-7890',
            'Address': '123 Main St, Apt #2B!@#$%^',
        });

        // And I submit the form
        await newCustomerPage.submitForm();

        // Then a new customer ID is generated
        const customerId = await newCustomerPage.getNewCustomerId();
        expect(customerId).not.toBeNull();

        // And a success message is displayed
        const successMessage = await newCustomerPage.getSuccessMessage();
        expect(successMessage).toContain('Customer created successfully');
    });

    test('Create a customer with different address formats @regression @data', async () => {
        // Given I navigate to the "New Customer" page
        await newCustomerPage.navigate();

        // When I enter the following customer details:
        await newCustomerPage.enterCustomerDetails({
            'First Name': 'Jane',
            'Last Name': 'Smith',
            'Email': 'jane.smith@example.com',
            'Phone Number': '987-654-3210',
            'Address': '456 Oak Avenue, Suite 100, Anytown, USA',
        });

        // And I submit the form
        await newCustomerPage.submitForm();

        // Then a new customer ID is generated
        const customerId = await newCustomerPage.getNewCustomerId();
        expect(customerId).not.toBeNull();

        // And a success message is displayed
        const successMessage = await newCustomerPage.getSuccessMessage();
        expect(successMessage).toContain('Customer created successfully');
    });

    test('Attempt to create a customer with a potentially malicious email address @regression @security', async () => {
        // Given I navigate to the "New Customer" page
        await newCustomerPage.navigate();

        // When I enter the following customer details:
        await newCustomerPage.enterCustomerDetails({
            'First Name': 'Hack',
            'Last Name': 'Me',
            'Email': '<script>alert(\'XSS\')</script>@example.com',
            'Phone Number': '111-222-3333',
            'Address': '789 Pine Street',
        });

        // And I submit the form
        await newCustomerPage.submitForm();

        // Then an error message is displayed indicating an invalid email format
        const errorMessage = await newCustomerPage.getErrorMessage();
        expect(errorMessage).toContain('invalid email');
    });
});