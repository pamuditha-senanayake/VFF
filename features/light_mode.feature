Feature: Light Mode enhancements and default state settings

  Scenario: Redesign sidebar logo text color for light mode
    Given the dashboard sidebar is rendered
    Then the logo text should change to dark color in light mode

  Scenario: Redesign sidebar active links for light mode
    Given the dashboard sidebar is rendered
    When the active link is displayed in light mode
    Then the active link background should be dark block color
    And the active link text color should be white

  Scenario: Redesign login page background
    Given the login page is rendered
    Then the outer container should match "bg-bg-brand"
    And the text should match "text-text-primary"

  Scenario: Redesign register page background
    Given the register page is rendered
    Then the outer container should match "bg-bg-brand"
    And the text should match "text-text-primary"

  Scenario: Redesign admin login page background
    Given the admin login page is rendered
    Then the outer container should match "bg-bg-brand"
    And the text should match "text-text-primary"

  Scenario: Redesign admin register page background
    Given the admin register page is rendered
    Then the outer container should match "bg-bg-brand"
    And the text should match "text-text-primary"

  Scenario: Set default theme mode to light
    Given the theme store is initialized
    Then the default theme value should be "light"

  Scenario: Ensure input text is visible in dark mode login form
    Given the user is on the login page in dark mode
    When the user types inside an input
    Then the input text color should be "text-text-primary"

  Scenario: Ensure input text is visible in dark mode register form
    Given the user is on the register page in dark mode
    When the user types inside an input
    Then the input text color should be "text-text-primary"

  Scenario: Ensure input text is visible in dark mode admin login form
    Given the user is on the admin login page in dark mode
    When the user types inside an input
    Then the input text color should be "text-text-primary"

  Scenario: Ensure input text is visible in dark mode admin register form
    Given the user is on the admin register page in dark mode
    When the user types inside an input
    Then the input text color should be "text-text-primary"

  Scenario: Redesign homepage background using theme variables
    Given the homepage is rendered
    Then the root container should match "bg-bg-brand"
    And the text should match "text-text-primary"

  Scenario: Redesign homepage navigation header background
    Given the homepage is rendered
    Then the header background should match "bg-bg-brand/90"
    And the border should match "border-border-brand"

  Scenario: Redesign homepage about section using theme variables
    Given the homepage about section is rendered
    Then the container background should match "bg-bg-subtle"
    And the border should match "border-border-brand"

  Scenario: Redesign homepage impact cards using theme variables
    Given the homepage impact section is rendered
    Then the cards background should match "bg-surface"
    And the card borders should match "border-border-brand"
