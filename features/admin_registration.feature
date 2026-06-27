Feature: Secret Admin Registration
  As a System Administrator
  I want to register an administrative account via a secret URL
  So that I can access the System Admin dashboard features safely

  Scenario: Admin accesses secret registration page
    Given an administrator on the secret registration URL "/register/admin"
    Then the page title should read "Create an administrator account"
    And it should display an email input field
    And it should display password and confirm password inputs

  Scenario: Successful admin registration submits role_id 1
    Given an administrator on the secret registration URL "/register/admin"
    When they enter a valid admin email "new_admin@vetsforfuture.org"
    And they enter a valid password "securePassword123"
    And they confirm the password "securePassword123"
    And they click the submit button
    Then the request is sent with role_id 1
    And they are redirected to the user login page "/login"
