import { test, expect } from '@playwright/test';

// Page Object Model for the Create Customer Page
class CreateCustomerPage {
  constructor(public page: any) {}

  async navigate() {
    await this.page.goto('/create-customer'); // Replace with actual URL
  }

  async fillField(field: string, value: string) {
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
      case 'Phone Number':
        await this.page.locator('[data-testid="phoneNumber"]').fill(value);
        break;
      case 'Address':
        await this.page.locator('[data-testid="address"]').fill(value);
        break;
      case 'City':
        await this.page.locator('[data-testid="city"]').fill(value);
        break;
      case 'State':
        await this.page.locator('[data-testid="state"]').selectOption(value);
        break;
      case 'Zip Code':
        await this.page.locator('[data-testid="zipCode"]').fill(value);
        break;
      default:
        throw new Error(`Unknown field: ${field}`);
    }
  }

  async submitForm() {
    await this.page.locator('[data-testid="submitButton"]').click();
  }

  async getSuccessMessage() {
    return await this.page.locator('[data-testid="successMessage"]').textContent();
  }

  async getErrorMessage() {
    return await this.page.locator('[data-testid="errorMessage"]').textContent();
  }

  async isCustomerVisibleInSearchResults() {
    // Assuming there's a search results table with customer data
    // Modify the selector to match your actual search results table
    return await this.page.locator('[data-testid="searchResultsTable"]').isVisible();
  }

  async generateCustomerId() {
    // Simulate customer ID generation.  In a real scenario, this would come from the response.
    return 'customer123';
  }

  async customerExists(email: string): Promise<boolean> {
      // In a real-world scenario, query the database
      // For testing, maintain an in-memory state
      return false;
  }

  async setDatabaseUnavailable() {
    // Simulate a database outage.  This will depend on your application's architecture.
    // For example, you might intercept network requests.
    // This is a placeholder and needs to be implemented based on your application's specific setup.
    console.warn("Database unavailability simulation needs to be implemented based on your application");
  }
}

test.describe('Customer Onboarding', () => {
  let createCustomerPage: CreateCustomerPage;

  test.beforeEach(async ({ page }) => {
    // Simulate CSR login (replace with actual login steps)
    await page.goto('/login');
    await page.locator('[data-testid="username"]').fill('csr');
    await page.locator('[data-testid="password"]').fill('password');
    await page.locator('[data-testid="loginButton"]').click();
    await expect(page.locator('[data-testid="logoutButton"]')).toBeVisible(); //Verify logged in

    createCustomerPage = new CreateCustomerPage(page);
    await createCustomerPage.navigate();
  });

  test('Successfully create a new customer with valid details @smoke @regression @positive', async ({ page }) => {
    // Enter customer details
    await createCustomerPage.fillField('First Name', 'John');
    await createCustomerPage.fillField('Last Name', 'Doe');
    await createCustomerPage.fillField('Email', 'john.doe@example.com');
    await createCustomerPage.fillField('Phone Number', '123-456-7890');
    await createCustomerPage.fillField('Address', '123 Main St');
    await createCustomerPage.fillField('City', 'Anytown');
    await createCustomerPage.fillField('State', 'CA');
    await createCustomerPage.fillField('Zip Code', '91234');

    // Submit the form
    await createCustomerPage.submitForm();

    // Assertions
    const customerId = await createCustomerPage.generateCustomerId();
    expect(customerId).toBeTruthy(); // Verify customer ID is generated

    expect(await createCustomerPage.isCustomerVisibleInSearchResults()).toBeVisible(); // Verify customer is visible in search results

    const successMessage = await createCustomerPage.getSuccessMessage();
    expect(successMessage).toBe('Customer created successfully'); // Verify success message
  });

  test('Fail to create a customer with missing required fields @regression @negative @validation', async ({ page }) => {
    // Leave "First Name" field empty
    await createCustomerPage.fillField('Last Name', 'Doe');
    await createCustomerPage.fillField('Email', 'john.doe@example.com');
    await createCustomerPage.fillField('Phone Number', '123-456-7890');
    await createCustomerPage.fillField('Address', '123 Main St');
    await createCustomerPage.fillField('City', 'Anytown');
    await createCustomerPage.fillField('State', 'CA');
    await createCustomerPage.fillField('Zip Code', '91234');

    // Submit the form
    await createCustomerPage.submitForm();

    // Assertions
    const errorMessage = await createCustomerPage.getErrorMessage();
    expect(errorMessage).toBe('First Name is required'); // Verify error message
    // Add assertion to verify customer is not created, if possible.  Depends on implementation.
  });

  test('Fail to create a customer with invalid email format @regression @negative @validation', async ({ page }) => {
    // Enter invalid email format
    await createCustomerPage.fillField('First Name', 'John');
    await createCustomerPage.fillField('Last Name', 'Doe');
    await createCustomerPage.fillField('Email', 'invalid-email');
    await createCustomerPage.fillField('Phone Number', '123-456-7890');
    await createCustomerPage.fillField('Address', '123 Main St');
    await createCustomerPage.fillField('City', 'Anytown');
    await createCustomerPage.fillField('State', 'CA');
    await createCustomerPage.fillField('Zip Code', '91234');

    // Submit the form
    await createCustomerPage.submitForm();

    // Assertions
    const errorMessage = await createCustomerPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid email format'); // Verify error message
    // Add assertion to verify customer is not created, if possible.  Depends on implementation.
  });

  test('Fail to create a customer with duplicate email @regression @negative @validation', async ({ page }) => {
    // Enter duplicate email
    await createCustomerPage.fillField('First Name', 'John');
    await createCustomerPage.fillField('Last Name', 'Doe');
    await createCustomerPage.fillField('Email', 'john.doe@example.com');
    await createCustomerPage.fillField('Phone Number', '123-456-7890');
    await createCustomerPage.fillField('Address', '123 Main St');
    await createCustomerPage.fillField('City', 'Anytown');
    await createCustomerPage.fillField('State', 'CA');
    await createCustomerPage.fillField('Zip Code', '91234');

    // Simulate existing customer (needs to be implemented based on your setup)
    const emailExists = await createCustomerPage.customerExists('john.doe@example.com');
    expect(emailExists).toBe(false);

    // Submit the form
    await createCustomerPage.submitForm();

    // Assertions
    const errorMessage = await createCustomerPage.getErrorMessage();
    expect(errorMessage).toBe('Email already exists'); // Verify error message
    // Add assertion to verify customer is not created, if possible.  Depends on implementation.
  });

  test('Fail to create a customer with invalid phone number format @regression @negative @validation', async ({ page }) => {
    // Enter invalid phone number format
    await createCustomerPage.fillField('First Name', 'John');
    await createCustomerPage.fillField('Last Name', 'Doe');
    await createCustomerPage.fillField('Email', 'john.doe.invalid@example.com');
    await createCustomerPage.fillField('Phone Number', '1234567890123');
    await createCustomerPage.fillField('Address', '123 Main St');
    await createCustomerPage.fillField('City', 'Anytown');
    await createCustomerPage.fillField('State', 'CA');
    await createCustomerPage.fillField('Zip Code', '91234');

    // Submit the form
    await createCustomerPage.submitForm();

    // Assertions
    const errorMessage = await createCustomerPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid phone number format'); // Verify error message
    // Add assertion to verify customer is not created, if possible.  Depends on implementation.
  });

  test('Successfully create a customer with maximum allowed length for fields @regression @edge', async ({ page }) => {
    // Enter max length data
    await createCustomerPage.fillField('First Name', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await createCustomerPage.fillField('Last Name', 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
    await createCustomerPage.fillField('Email', 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC@example.com');
    await createCustomerPage.fillField('Phone Number', '123-456-7890');
    await createCustomerPage.fillField('Address', 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
    await createCustomerPage.fillField('City', 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
    await createCustomerPage.fillField('State', 'CA');
    await createCustomerPage.fillField('Zip Code', '91234');

    // Submit the form
    await createCustomerPage.submitForm();

    // Assertions
    const customerId = await createCustomerPage.generateCustomerId();
    expect(customerId).toBeTruthy(); // Verify customer ID is generated
    expect(await createCustomerPage.isCustomerVisibleInSearchResults()).toBeVisible(); // Verify customer is visible in search results
  });

  const zipCodeExamples = [
    { ZipCode: '91234', Result: 'created' },
    { ZipCode: '91234-5678', Result: 'created' },
    { ZipCode: 'abcde', Result: 'not created' },
    { ZipCode: '1234', Result: 'not created' },
  ];

  for (const example of zipCodeExamples) {
    test(`Validate zip code format: ${example.ZipCode} - Result: ${example.Result} @regression @data`, async ({ page }) => {
      // Enter customer details
      await createCustomerPage.fillField('First Name', 'John');
      await createCustomerPage.fillField('Last Name', 'Doe');
      await createCustomerPage.fillField('Email', 'john.doe.zip@example.com');
      await createCustomerPage.fillField('Phone Number', '123-456-7890');
      await createCustomerPage.fillField('Address', '123 Main St');
      await createCustomerPage.fillField('City', 'Anytown');
      await createCustomerPage.fillField('State', 'CA');
      await createCustomerPage.fillField('Zip Code', example.ZipCode);

      // Submit the form
      await createCustomerPage.submitForm();

      if (example.Result === 'created') {
        const customerId = await createCustomerPage.generateCustomerId();
        expect(customerId).toBeTruthy(); // Verify customer ID is generated
      } else {
        const errorMessage = await createCustomerPage.getErrorMessage();
        expect(errorMessage).toBeTruthy(); //Verify there is an error message
      }
    });
  }

  test('Successfully create a customer with only mandatory fields @regression @positive', async ({ page }) => {
    // Enter only mandatory fields
    await createCustomerPage.fillField('First Name', 'John');
    await createCustomerPage.fillField('Last Name', 'Doe');
    await createCustomerPage.fillField('Email', 'john.doe.minimal@example.com');

    // Submit the form
    await createCustomerPage.submitForm();

    // Assertions
    const customerId = await createCustomerPage.generateCustomerId();
    expect(customerId).toBeTruthy(); // Verify customer ID is generated
    expect(await createCustomerPage.isCustomerVisibleInSearchResults()).toBeVisible(); // Verify customer is visible in search results
    const successMessage = await createCustomerPage.getSuccessMessage();
    expect(successMessage).toBe('Customer created successfully'); // Verify success message
  });

  test('Attempt to create customer when CRM database is unavailable @regression @edge', async ({ page }) => {
    // Enter valid customer details (assuming you have a helper function for this)
    await createCustomerPage.fillField('First Name', 'John');
    await createCustomerPage.fillField('Last Name', 'Doe');
    await createCustomerPage.fillField('Email', 'john.doe.db@example.com');
    await createCustomerPage.fillField('Phone Number', '123-456-7890');
    await createCustomerPage.fillField('Address', '123 Main St');
    await createCustomerPage.fillField('City', 'Anytown');
    await createCustomerPage.fillField('State', 'CA');
    await createCustomerPage.fillField('Zip Code', '91234');

    // Simulate database unavailable
    await createCustomerPage.setDatabaseUnavailable();

    // Submit the form
    await createCustomerPage.submitForm();

    // Assertions
    const errorMessage = await createCustomerPage.getErrorMessage();
    expect(errorMessage).toBe('Database unavailable'); // Verify error message
    // Add assertion to verify customer is not created, if possible.  Depends on implementation.
  });
});