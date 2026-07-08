Feature: Collapsible Sidebar, Profile, Settings, Notifications and Help Center

  Scenario: Main layout adjusts when sidebar collapses
    Given the dashboard layout is loaded
    When the user toggles the sidebar to collapsed
    Then the main content margin should shrink to 80px
    And the layout should occupy all available screen width

  Scenario: Display admin sub-items in sidebar
    Given the user is logged in as an Admin
    When looking at the sidebar navigation
    Then the "Admin Panel" section should show sub-items
    And "User Registry" should be visible under it

  Scenario: Navigate to User Registry sub-item
    Given the admin sub-items are visible in sidebar
    When the user clicks "User Registry"
    Then the router should navigate to "/admin"

  Scenario: Search users in admin panel
    Given the user is on the admin page
    When the user types a query in the search input
    Then the user list should filter matching rows

  Scenario: Navigate to profile page from dropdown
    Given the topbar profile menu is open
    When the user clicks "Edit profile"
    Then the router should navigate to "/profile"

  Scenario: Load user profile details
    Given the user is on the profile page
    When the page completes loading
    Then the profile card should display current user information

  Scenario: Edit user information on profile page
    Given the user is on the profile page
    When the user edits their name and saves
    Then the profile should update successfully
    And show a success toast notification

  Scenario: Navigate to settings page from dropdown
    Given the topbar profile menu is open
    When the user clicks "Account settings"
    Then the router should navigate to "/settings"

  Scenario: Toggle theme setting in settings page
    Given the user is on the settings page
    When the user toggles the "Light Mode" switch
    Then the application theme classes should update in the DOM

  Scenario: Toggle notifications in settings page
    Given the user is on the settings page
    When the user toggles off the "Finance Notifications"
    Then the corresponding notification settings should save

  Scenario: Suspend notifications for multiple modules
    Given the user is on the settings page
    When the user toggles off "HR" and "Inventory" notifications
    Then both module settings should save successfully

  Scenario: Load support center page
    Given the topbar profile menu is open
    When the user clicks "Support"
    Then the router should navigate to "/support"

  Scenario: Search support center documentation
    Given the user is on the support page
    When the user searches for "RBAC validation"
    Then matching documentation sections should display

  Scenario: Home page button goes to dashboard
    Given the user is on the website home page
    And is authenticated in the system
    When the user clicks the "Go to Dashboard" button
    Then the router should navigate to "/dashboard"

  Scenario: Dashboard logo goes back to homepage
    Given the user is on the dashboard overview
    When the user clicks the logo section
    Then the router should navigate to "/"
