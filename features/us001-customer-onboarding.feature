Feature: Customer Onboarding
  As a CSR, I want to create a new customer profile so that I can onboard them into the CRM.

  Background:
    Given I am logged in as a CSR

  @smoke @regression
  Scenario: Successfully create a new customer with valid details
    Given I navigate to the "New Customer" page
    When I enter the following customer details:
      | Field       | Value            |
      | First Name  | John             |
      | Last Name   | Doe              |
      | Email       | john.doe@example.com |
      | Phone Number | 123-456-7890     |
      | Address     | 123 Main Street  |
    And I submit the form
    Then a new customer ID is generated
    And a success message is displayed

  @regression @validation
  Scenario: Fail to create a customer with missing required fields
    Given I navigate to the "New Customer" page
    When I submit the form without filling in any required fields
    Then an error message is displayed indicating missing required fields

  @regression @validation
  Scenario Outline: Fail to create a customer with invalid email format
    Given I navigate to the "New Customer" page
    When I enter the following customer details:
      | Field       | Value            |
      | First Name  | John             |
      | Last Name   | Doe              |
      | Email       | <email>          |
      | Phone Number | 123-456-7890     |
      | Address     | 123 Main Street  |
    And I submit the form
    Then an error message is displayed indicating an invalid email format

    Examples:
      | email                 |
      | john.doe              |
      | john.doe@             |
      | john.doe@example      |
      | @example.com         |

  @regression @validation
  Scenario Outline: Fail to create a customer with invalid phone number format
    Given I navigate to the "New Customer" page
    When I enter the following customer details:
      | Field       | Value            |
      | First Name  | John             |
      | Last Name   | Doe              |
      | Email       | john.doe@example.com |
      | Phone Number | <phone>          |
      | Address     | 123 Main Street  |
    And I submit the form
    Then an error message is displayed indicating an invalid phone number format

    Examples:
      | phone            |
      | 123456789        |
      | 123-456-789      |
      | 123.456.7890     |
      | abc-def-ghij     |

  @regression @edge
  Scenario: Create a customer with maximum allowed length for name fields
    Given I navigate to the "New Customer" page
    When I enter a First Name with the maximum allowed length
    And I enter a Last Name with the maximum allowed length
    And I enter a valid Email
    And I enter a valid Phone Number
    And I enter a valid Address
    And I submit the form
    Then a new customer ID is generated
    And a success message is displayed

  @regression @edge
  Scenario: Create a customer with special characters in address
    Given I navigate to the "New Customer" page
    When I enter the following customer details:
      | Field       | Value                      |
      | First Name  | John                       |
      | Last Name   | Doe                        |
      | Email       | john.doe@example.com       |
      | Phone Number | 123-456-7890               |
      | Address     | 123 Main St, Apt #2B!@#$%^ |
    And I submit the form
    Then a new customer ID is generated
    And a success message is displayed

  @regression @data
  Scenario: Create a customer with different address formats
    Given I navigate to the "New Customer" page
    When I enter the following customer details:
      | Field       | Value                                    |
      | First Name  | Jane                                     |
      | Last Name   | Smith                                    |
      | Email       | jane.smith@example.com                    |
      | Phone Number | 987-654-3210                             |
      | Address     | 456 Oak Avenue, Suite 100, Anytown, USA |
    And I submit the form
    Then a new customer ID is generated
    And a success message is displayed

  @regression @security
  Scenario: Attempt to create a customer with a potentially malicious email address
    Given I navigate to the "New Customer" page
    When I enter the following customer details:
      | Field       | Value                                      |
      | First Name  | Hack                                       |
      | Last Name   | Me                                         |
      | Email       | <script>alert('XSS')</script>@example.com |
      | Phone Number | 111-222-3333                               |
      | Address     | 789 Pine Street                             |
    And I submit the form
    Then an error message is displayed indicating an invalid email format