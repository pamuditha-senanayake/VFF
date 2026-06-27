Feature: User management system

  Scenario: Register as director successfully
    Given a new user email
    When they register as director
    Then the registration succeeds

  Scenario: Register as admin successfully
    Given a new user email
    When they register as admin
    Then the registration succeeds

  Scenario: Register as staff successfully
    Given a new user email
    When they register as staff
    Then the registration succeeds

  Scenario: Register with invalid email
    Given an invalid user email
    When they try to register
    Then registration fails with error

  Scenario: Register with weak password
    Given a short password string
    When they try to register
    Then registration fails with error

  Scenario: Register with missing email
    Given empty email field value
    When they try to register
    Then registration fails with error

  Scenario: Register with duplicate email
    Given an already registered email
    When they try to register
    Then registration fails with error

  Scenario: Login with valid credentials
    Given a registered user account
    When they submit correct credentials
    Then login succeeds with token

  Scenario: Login with incorrect password
    Given a registered user account
    When they submit wrong password
    Then login fails with error

  Scenario: Login with unregistered email
    Given an unregistered user email
    When they submit login details
    Then login fails with error

  Scenario: Login with missing fields
    Given empty login field values
    When they submit login details
    Then login fails with error

  Scenario: Admin accesses dashboard
    Given an authenticated admin user
    When they access admin panel
    Then page access is allowed

  Scenario: Director accesses dashboard
    Given an authenticated director user
    When they access admin panel
    Then page access is denied

  Scenario: Staff accesses dashboard
    Given an authenticated staff user
    When they access admin panel
    Then page access is denied

  Scenario: Admin updates user role
    Given an authenticated admin user
    When they change user role
    Then user role is updated

  Scenario: Non admin updates role
    Given an authenticated staff user
    When they change user role
    Then role update is denied

  Scenario: Login page meets style requirements
    Given a user navigates to login
    Then the page layout matches specifications

  Scenario: User management has split screen layout
    Given a user navigates to login
    Then the page has a split screen layout

  Scenario: User management container has unified background
    Given a user navigates to login
    Then the panel background color is unified

  Scenario: User management container does not use generic card
    Given a user navigates to login
    Then the layout does not use generic cards

  Scenario: Back to website button is currently disabled
    Given a user navigates to login
    Then the back to website button is disabled
