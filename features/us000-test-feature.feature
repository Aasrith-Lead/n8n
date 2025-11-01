Feature: Customer Onboarding - Create New Customer Profile
  As a CSR, I want to create a new customer profile so that I can onboard them into the CRM.

  Background:
    Given I am logged in as a CSR
    And I navigate to the "New Customer" form

  @smoke @regression
  Scenario: Successfully create a new customer with valid details
    Given I enter valid customer details:
      | Field       | Value                |
      | First Name  | John                 |
      | Last Name   | Doe                  |
      | Email       | john.doe@example.com |
      | Phone       | 555-123-4567         |
      | Address     | 123 Main St          |
      | City        | Anytown              |
      | State       | CA                   |
      | Zip Code    | 91234                |
    When I submit the form
    Then a new customer ID is generated
    And the customer is visible in search results
    And a success message is displayed "Customer created successfully with ID: <customer_id>"

  @regression @validation
  Scenario Outline: Attempt to create a customer with invalid email format
    Given I enter customer details with an invalid email "<email>"
      | Field       | Value                |
      | First Name  | John                 |
      | Last Name   | Doe                  |
      | Email       | <email>              |
      | Phone       | 555-123-4567         |
      | Address     | 123 Main St          |
      | City        | Anytown              |
      | State       | CA                   |
      | Zip Code    | 91234                |
    When I submit the form
    Then an error message is displayed "Invalid email format"
    And the customer is not created

    Examples:
      | email                 |
      | john.doe             |
      | john.doe@            |
      | @example.com          |
      | john.doe@example      |

  @regression @validation
  Scenario Outline: Attempt to create a customer with missing required fields
    Given I enter customer details with missing "<field>"
      | Field       | Value                |
      | First Name  | John                 |
      | Last Name   | Doe                  |
      | Email       | john.doe@example.com |
      | Phone       | 555-123-4567         |
      | Address     | 123 Main St          |
      | City        | Anytown              |
      | State       | CA                   |
      | Zip Code    | 91234                |
    When I clear the "<field>" field
    And I submit the form
    Then an error message is displayed "Please fill in all required fields"
    And the customer is not created

    Examples:
      | field       |
      | First Name  |
      | Last Name   |
      | Email       |

  @regression @edge
  Scenario: Attempt to create a customer with maximum length allowed for name fields
    Given I enter customer details with maximum length name fields
      | Field       | Value                                                            |
      | First Name  | Johnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn |
      | Last Name   | Doeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee |
      | Email       | john.doe@example.com                                             |
      | Phone       | 555-123-4567                                                     |
      | Address     | 123 Main St                                                      |
      | City        | Anytown                                                          |
      | State       | CA                                                               |
      | Zip Code    | 91234                                                            |
    When I submit the form
    Then a new customer ID is generated
    And the customer is visible in search results
    And a success message is displayed "Customer created successfully with ID: <customer_id>"

  @regression @negative
  Scenario: Attempt to create a customer with an existing email address
    Given I enter customer details with an existing email address
      | Field       | Value                |
      | First Name  | John                 |
      | Last Name   | Doe                  |
      | Email       | existing@example.com |
      | Phone       | 555-123-4567         |
      | Address     | 123 Main St          |
      | City        | Anytown              |
      | State       | CA                   |
      | Zip Code    | 91234                |
    When I submit the form
    Then an error message is displayed "Email address already exists"
    And the customer is not created

  @regression @validation
  Scenario Outline: Attempt to create a customer with invalid zip code format
    Given I enter customer details with an invalid zip code "<zip_code>"
      | Field       | Value                |
      | First Name  | John                 |
      | Last Name   | Doe                  |
      | Email       | john.doe@example.com |
      | Phone       | 555-123-4567         |
      | Address     | 123 Main St          |
      | City        | Anytown              |
      | State       | CA                   |
      | Zip Code    | <zip_code>           |
    When I submit the form
    Then an error message is displayed "Invalid zip code format"
    And the customer is not created

    Examples:
      | zip_code |
      | 1234     |
      | 123456   |
      | ABCDE    |

  @regression @validation
  Scenario: Attempt to create a customer with invalid phone number format
    Given I enter customer details with an invalid phone number "1234567890"
      | Field       | Value                |
      | First Name  | John                 |
      | Last Name   | Doe                  |
      | Email       | john.doe@example.com |
      | Phone       | 1234567890           |
      | Address     | 123 Main St          |
      | City        | Anytown              |
      | State       | CA                   |
      | Zip Code    | 91234                |
    When I submit the form
    Then an error message is displayed "Invalid phone number format"
    And the customer is not created

  @regression @edge
  Scenario: Create a customer with special characters in address fields
    Given I enter customer details with special characters in address
      | Field       | Value                            |
      | First Name  | John                             |
      | Last Name   | Doe                              |
      | Email       | john.doe@example.com             |
      | Phone       | 555-123-4567                     |
      | Address     | 123 Main St #$%^&*()_+=-`       |
      | City        | Anytown !@#$%^                    |
      | State       | CA                               |
      | Zip Code    | 91234                            |
    When I submit the form
    Then a new customer ID is generated
    And the customer is visible in search results
    And a success message is displayed "Customer created successfully with ID: <customer_id>"