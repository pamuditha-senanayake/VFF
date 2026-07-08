Feature: SweetAlert Alerts, Modals Redesign, Scroll Animations and Form Actions

  Scenario: Render new transaction popup in brand colors
    Given the finance page has loaded
    When the user clicks the "New Transaction" button
    Then the popup background should be dark surface "#0F1520"
    And inputs should use brand borders "#232730"

  Scenario: Render edit transaction popup in brand colors
    Given the finance page has loaded
    When the user clicks the "Edit" button for a transaction
    Then the edit popup background should match brand design2 specification

  Scenario: Confirm transaction voiding via SweetAlert
    Given the finance page has loaded
    When the user clicks "Void" for a transaction
    Then a SweetAlert2 confirmation dialog should appear

  Scenario: Add Employee button triggers details prompt
    Given the HR page has loaded
    When the user clicks "Add Employee"
    Then a SweetAlert2 input form dialog should open
    And prompt for First Name, Last Name, NIC, and Salary

  Scenario: Add Employee SweetAlert registers employee
    Given the Add Employee SweetAlert dialog is open
    When the user enters valid employee details and submits
    Then the system should trigger createEmployee mutation
    And refresh the employees list

  Scenario: Initialize Program button triggers prompt
    Given the programs page has loaded
    When the user clicks "Initialize Program"
    Then a SweetAlert2 input form dialog should open

  Scenario: Initialize Program SweetAlert registers program
    Given the Initialize Program SweetAlert dialog is open
    When the user enters program details and submits
    Then the system should trigger createProgram mutation
    And refresh the programs registry list

  Scenario: Add Inventory Item button triggers prompt
    Given the inventory page has loaded
    When the user clicks "Add Item"
    Then a SweetAlert2 input form dialog should open

  Scenario: Add Inventory Item registers item
    Given the Add Item SweetAlert dialog is open
    When the user enters item name, stock, and unit cost
    Then the system should trigger createItem mutation
    And refresh the inventory list

  Scenario: Issue or Return items button triggers prompt
    Given the inventory page has loaded
    When the user clicks "Issue/Return"
    Then a SweetAlert2 transaction select form should open

  Scenario: Issue or Return items registers transaction
    Given the Issue or Return SweetAlert dialog is open
    When the user selects item, quantity, transaction type and submits
    Then the system should trigger createInventoryTransaction mutation
    And update current stock values

  Scenario: Remove design2.md from repository
    Given the design2.md file is in workspace root
    When the git remove command is executed
    Then the file should be removed from git tracking

  Scenario: Highlight homepage dashboard link with glowing hover
    Given the user is on the redesigned homepage
    When hover action is performed on the dashboard button
    Then a glowing amber drop-shadow outline should render

  Scenario: Hide homepage navbar when scrolling down
    Given the user is on the redesigned homepage at the top
    When the user scrolls down by more than 80px
    Then the navbar container should hide with translate class

  Scenario: Show homepage navbar when scrolling up
    Given the user has scrolled down the redesigned homepage
    When the user scrolls up in the page viewport
    Then the navbar container should animate back into view
