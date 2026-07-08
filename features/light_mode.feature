Feature: Light Mode support across every page, component, and popup

  Scenario: Redesign sidebar using CSS variables
    Given the dashboard sidebar is rendered
    Then the background should match "bg-bg-brand" variable
    And the border should match "border-border-brand" variable

  Scenario: Redesign topbar using CSS variables
    Given the dashboard topbar is rendered
    Then the container background should match "bg-bg-brand/80"

  Scenario: Add theme toggle menu item to profile dropdown
    Given the topbar profile menu is open
    Then a theme toggle button should be visible
    And display "Light Mode" or "Dark Mode" relative to current state

  Scenario: Persist theme mode preference
    Given the user changes theme state
    Then the Zustand store should persist choice to localstorage

  Scenario: Register ThemeProvider wrapper
    Given the RootLayout is mounted
    Then the children should be wrapped by ThemeProvider

  Scenario: Remove dark class in light mode
    Given the global theme state is set to "light"
    Then the html root element should not contain class "dark"
    And contain class "light"

  Scenario: Add dark class in dark mode
    Given the global theme state is set to "dark"
    Then the html root element should contain class "dark"
    And not contain class "light"

  Scenario: Set light mode variables in settings
    Given the user is on the settings page
    When the user toggles the theme switch to light
    Then the global theme state should update to "light"

  Scenario: Set dark mode variables in settings
    Given the user is on the settings page
    When the user toggles the theme switch to dark
    Then the global theme state should update to "dark"

  Scenario: Render SweetAlert2 user delete in light mode
    Given the user is in light mode
    When the user clicks delete user
    Then SweetAlert2 should use background "#FFFFFF" and text "#111318"

  Scenario: Render SweetAlert2 user delete in dark mode
    Given the user is in dark mode
    When the user clicks delete user
    Then SweetAlert2 should use background "#0F1520" and text "#F9FAFB"

  Scenario: Render SweetAlert2 add employee in light mode
    Given the user is in light mode
    When the user clicks add employee
    Then SweetAlert2 dialog should adapt background to white

  Scenario: Render SweetAlert2 add employee in dark mode
    Given the user is in dark mode
    When the user clicks add employee
    Then SweetAlert2 dialog should adapt background to dark slate

  Scenario: Render SweetAlert2 initialize program in light mode
    Given the user is in light mode
    When the user clicks initialize program
    Then SweetAlert2 dialog background should be light

  Scenario: Render SweetAlert2 initialize program in dark mode
    Given the user is in dark mode
    When the user clicks initialize program
    Then SweetAlert2 dialog background should be dark
