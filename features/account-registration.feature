Feature: Account Registration

  Scenario: Successful Account Registration with Valid Data
    Given the user is on the registration page
    When the user enters valid data:
      | Field       | Value               |
      | First Name  | John                |
      | Last Name   | Doe                 |
      | Email       | john.doe@example.com |
      | Password    | Password123!        |
      | Confirm Password | Password123!        |
    And the user clicks the "Register" button
    Then the user should be redirected to the success page
    And a welcome email should be sent to john.doe@example.com

  Scenario: Account Registration with Missing First Name
    Given the user is on the registration page
    When the user enters data with a missing first name:
      | Field       | Value               |
      | Last Name   | Doe                 |
      | Email       | john.doe@example.com |
      | Password    | Password123!        |
      | Confirm Password | Password123!        |
    And the user clicks the "Register" button
    Then an error message should be displayed: "First name is required"

  Scenario: Account Registration with Invalid Email Format
    Given the user is on the registration page
    When the user enters data with an invalid email format:
      | Field       | Value       |
      | First Name  | John        |
      | Last Name   | Doe         |
      | Email       | john.doe    |
      | Password    | Password123! |
      | Confirm Password | Password123! |
    And the user clicks the "Register" button
    Then an error message should be displayed: "Invalid email format"

  Scenario: Account Registration with Password Mismatch
    Given the user is on the registration page
    When the user enters data with mismatched passwords:
      | Field       | Value        |
      | First Name  | John         |
      | Last Name   | Doe          |
      | Email       | john.doe@example.com |
      | Password    | Password123! |
      | Confirm Password | Password456! |
    And the user clicks the "Register" button
    Then an error message should be displayed: "Passwords do not match"

  Scenario: Account Registration with Weak Password
    Given the user is on the registration page
    When the user enters data with a weak password:
      | Field       | Value                |
      | First Name  | John                 |
      | Last Name   | Doe                  |
      | Email       | john.doe@example.com  |
      | Password    | weak               |
      | Confirm Password | weak               |
    And the user clicks the "Register" button
    Then an error message should be displayed: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"

  Scenario: Account Registration with Email Already Registered
    Given the user is on the registration page
    And an account exists with the email address "existing@example.com"
    When the user enters data with an already registered email:
      | Field       | Value                |
      | First Name  | John                 |
      | Last Name   | Doe                  |
      | Email       | existing@example.com |
      | Password    | Password123!         |
      | Confirm Password | Password123!         |
    And the user clicks the "Register" button
    Then an error message should be displayed: "Email address is already registered"