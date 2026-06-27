Feature: Separate Logins and Admin Role Management

  As an administrator,
  I want separate login channels for admins and users,
  And the capability to edit user roles from the HR dashboard.

  Scenario: User navigates to user login page
    Given a user navigates to "/login"
    Then the page has title "Authorize access"
    And it displays a link to Admin Portal

  Scenario: User logs in successfully with valid credentials
    Given a registered user account
    When they enter credentials on "/login"
    And submit login
    Then they are logged in and redirected to dashboard

  Scenario: User login fails with invalid credentials
    Given a user on "/login"
    When they enter invalid credentials
    And submit login
    Then login fails with warning

  Scenario: Admin navigates to admin login page
    Given a user navigates to "/login/admin"
    Then the page has title "Admin portal access"
    And it does not display registration links

  Scenario: Admin logs in successfully with valid credentials
    Given a registered admin account
    When they enter credentials on "/login/admin"
    And submit login
    Then they are logged in and redirected to dashboard

  Scenario: Admin login fails with invalid credentials
    Given a user on "/login/admin"
    When they enter invalid credentials
    And submit login
    Then login fails with warning

  Scenario: User registration is restricted to regular roles
    Given a user navigates to "/register"
    Then registration does not allow admin role selection

  Scenario: Admin selects employee profile to edit
    Given an authenticated admin user on HR page
    When they view the employee directory
    Then they see edit role controls for each employee

  Scenario: Admin edits employee role to Director
    Given an admin on HR page
    When they change employee role to "Director"
    Then the employee role is successfully updated to "Director"

  Scenario: Admin edits employee role to Finance Officer
    Given an admin on HR page
    When they change employee role to "Finance Officer"
    Then the employee role is successfully updated to "Finance Officer"

  Scenario: Admin edits employee role to HR Officer
    Given an admin on HR page
    When they change employee role to "HR Officer"
    Then the employee role is successfully updated to "HR Officer"

  Scenario: Admin edits employee role to Operations Lead
    Given an admin on HR page
    When they change employee role to "Operations Lead"
    Then the employee role is successfully updated to "Operations Lead"

  Scenario: Admin edits employee role to General Staff
    Given an admin on HR page
    When they change employee role to "General Staff"
    Then the employee role is successfully updated to "General Staff"

  Scenario: Admin edits employee role to System Administrator
    Given an admin on HR page
    When they change employee role to "System Administrator"
    Then the employee role is successfully updated to "System Administrator"

  Scenario: User cannot access role management API
    Given a standard user session
    When they attempt to update a user role via API
    Then the role update request is rejected with access denied
