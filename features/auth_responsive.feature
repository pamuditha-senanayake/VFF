Feature: Auth Pages Redesign, Responsive Layouts, SweetAlert user delete and Website navigation

  Scenario: Redesign login page in brand colors
    Given the login page is loaded
    Then the background should be dark "#0B0D12"
    And buttons should use electric amber `#EF9F27`

  Scenario: Redesign admin login page in brand colors
    Given the admin login page is loaded
    Then the styling should match brand design2 specifications

  Scenario: Redesign register page in brand colors
    Given the register page is loaded
    Then input borders should be "#232730"

  Scenario: Redesign admin register page in brand colors
    Given the admin register page is loaded
    Then background and theme colors should match brand specifications

  Scenario: Trigger SweetAlert2 delete user alert
    Given the user is on the admin page
    When the user clicks the "Delete" icon for a user
    Then a SweetAlert2 confirmation dialog should open

  Scenario: Confirm user deletion via SweetAlert2
    Given the delete user SweetAlert2 dialog is open
    When the user clicks the "Yes, Delete User" button
    Then the deleteUser service method should execute
    And refresh the system accounts list

  Scenario: Cancel user deletion via SweetAlert2
    Given the delete user SweetAlert2 dialog is open
    When the user clicks the cancel button
    Then the dialog should close
    And the user account should not be deleted

  Scenario: Navigate to homepage from topbar button
    Given the dashboard topbar is rendered
    When the user clicks the "Website Home" globe button
    Then the router should navigate to "/"

  Scenario: Navigate to homepage from avatar dropdown
    Given the topbar profile menu is open
    When the user clicks "Go to Website Home"
    Then the router should navigate to "/"

  Scenario: Hide sidebar on mobile viewports
    Given the dashboard layout is loaded in viewport less than 1024px
    Then the sidebar should have class "-translate-x-full"
    And not occupy visible screen space

  Scenario: Shift main layout margin to zero on mobile
    Given the dashboard layout is loaded in mobile viewport
    Then the main content container should have class "ml-0"

  Scenario: Toggle mobile sidebar drawer on menu click
    Given the dashboard layout is loaded in mobile viewport
    When the user clicks the hamburger menu button in topbar
    Then the sidebar should transition to visible "translate-x-0"

  Scenario: Close mobile sidebar drawer on backdrop click
    Given the mobile sidebar drawer is open
    When the user clicks the overlay backdrop
    Then the sidebar should transition to hidden
    And the backdrop should be removed from DOM

  Scenario: Shift layout margin to sixty four on desktop expanded
    Given the dashboard layout is loaded on screen >= 1024px
    And the sidebar is expanded
    Then the main content container should have class "lg:ml-64"

  Scenario: Shift layout margin to twenty on desktop collapsed
    Given the dashboard layout is loaded on screen >= 1024px
    And the sidebar is collapsed
    Then the main content container should have class "lg:ml-20"
