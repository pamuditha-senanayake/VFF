Feature: Frontend Redesign to Design2 Specifications

  Scenario: Load electric amber primary color
    Given the application is loaded
    When checking brand token variables
    Then the accent color should be "#EF9F27"

  Scenario: Verify Space Grotesk font loading
    Given the application is loaded
    When checking headings typography style
    Then the font family should include "Space Grotesk"

  Scenario: Verify Inter font loading
    Given the application is loaded
    When checking user interface body typography
    Then the font family should include "Inter"

  Scenario: Verify JetBrains Mono font loading
    Given the application is loaded
    When checking tabular numbers and currency data
    Then the font family should include "JetBrains Mono"

  Scenario: Toggle sidebar collapse state
    Given the sidebar is visible on desktop
    When the user clicks the collapse button
    Then the sidebar width should change to 80px

  Scenario: Sidebar active item decoration
    Given the user is on the Finance page
    When checking the Finance navigation item
    Then it should have an amber left border
    And it should have an amber-tinted background

  Scenario: Sidebar uppercase group labels
    Given the sidebar is expanded
    When looking at navigation sections
    Then sections should display uppercase muted labels

  Scenario: Topbar global search render
    Given the user is logged in
    When looking at the topbar
    Then a search input must be visible
    And it must show the Command-K shortcut hint

  Scenario: Topbar notifications bell display
    Given the user has unread notifications
    When looking at the topbar
    Then the notification bell must display an unread dot

  Scenario: Topbar user avatar dropdown toggle
    Given the user is logged in
    When the user clicks their avatar
    Then a dropdown menu should open with profile options

  Scenario: Command palette keyboard shortcut activation
    Given the user is on the dashboard
    When the user presses Command and K keys
    Then a search modal overlay should open

  Scenario: Command palette search results navigation
    Given the command palette is open
    When the user types a query
    Then navigation links should list matching pages

  Scenario: Primary trend chart duration toggle
    Given the user is on the Finance dashboard
    When the user toggles the range control to "30 days"
    Then the trend chart data should slice to 30 points

  Scenario: KPI strip cards responsive grid layout
    Given the user is on a mobile screen
    When viewing the KPI strip row
    Then cards should snap scroll horizontally

  Scenario: Data table row hover style
    Given the recent transactions table is visible
    When the user hovers over a table row
    Then the row background should display a subtle highlight

  Scenario: Badge status color soft-tint styling
    Given a pending transaction is shown
    When looking at its status badge
    Then it should have an amber soft-tint background
    And it should have solid amber text

  Scenario: Dark mode color scheme inversion
    Given the application theme is set to dark
    When checking the page background style
    Then the background color should be near-black
