Feature: Separate Director and Admin Registration

  As a user,
  I want separate registration routes for director and admin accounts,
  So that registration parameters are explicit and secure.

  Scenario: Director navigates to director registration page
    Given a user navigates to "/register/director"
    Then the page title is "Create a Director account"

  Scenario: Director successfully registers with valid details
    Given a user on director registration page
    When they enter valid registration details
    And submit director registration
    Then the account is created
    And they are redirected to login

  Scenario: Director registration fails with duplicate email
    Given a user on director registration page
    When they enter an already registered email
    And submit director registration
    Then registration fails with error

  Scenario: Director registration fails with mismatched passwords
    Given a user on director registration page
    When they enter mismatched passwords
    And submit director registration
    Then password match error is displayed

  Scenario: Director registration fails with weak password
    Given a user on director registration page
    When they enter a weak password
    And submit director registration
    Then weak password validation error is shown

  Scenario: Admin navigates to admin registration page
    Given a user navigates to "/register/admin"
    Then the page title is "Create an Admin account"

  Scenario: Admin successfully registers with valid details
    Given a user on admin registration page
    When they enter valid registration details
    And submit admin registration
    Then the account is created
    And they are redirected to login

  Scenario: Admin registration fails with duplicate email
    Given a user on admin registration page
    When they enter an already registered email
    And submit admin registration
    Then registration fails with error

  Scenario: Admin registration fails with mismatched passwords
    Given a user on admin registration page
    When they enter mismatched passwords
    And submit admin registration
    Then password match error is displayed

  Scenario: Admin registration fails with weak password
    Given a user on admin registration page
    When they enter a weak password
    And submit admin registration
    Then weak password validation error is shown

  Scenario: Selector page displays options for director and admin registration
    Given a user navigates to "/register"
    Then they see options for Director and Admin registration

  Scenario: Selector page redirects to director registration
    Given a user on registration choice page
    When they choose Director registration
    Then they are redirected to "/register/director"

  Scenario: Selector page redirects to admin registration
    Given a user on registration choice page
    When they choose Admin registration
    Then they are redirected to "/register/admin"

  Scenario: Unified login authenticates registered director
    Given a registered director user
    When they enter login credentials on unified login
    And submit unified login
    Then authentication succeeds
    And they access the system dashboard

  Scenario: Unified login authenticates registered admin
    Given a registered admin user
    When they enter login credentials on unified login
    And submit unified login
    Then authentication succeeds
    And they access the system dashboard

  Scenario: Admin registration shows manual verification warning
    Given a user on admin registration page
    Then manual verification warning message is displayed
