Feature: Admin User Management and Page Redesign Compliance

  Scenario: Admin page restricted to Admin role
    Given a user with role "Director"
    When the user navigates to "/admin"
    Then they should see a "permission denied" error message

  Scenario: Access user registry as administrator
    Given an authenticated user with role "Admin"
    When the user navigates to "/admin"
    Then the user list must load successfully
    And it should display email, name, and current role

  Scenario: Update user role in administration panel
    Given the admin page has loaded
    When the admin selects a new role for a user
    Then the system should call the role update API
    And show a success toast notification

  Scenario: Delete user account
    Given the admin page has loaded
    When the admin clicks the delete button for a user
    Then a confirmation dialog should open
    And confirming should delete the user account

  Scenario: Verify redesigned style tokens on page
    Given the admin page has loaded
    When inspecting the component colors
    Then active items should use electric amber "#EF9F27"
    And cards should have card-radius of "12px"
