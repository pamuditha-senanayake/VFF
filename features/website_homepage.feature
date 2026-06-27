Feature: Website Homepage VFF Design and Copy

  As a visitor,
  I want a premium dark website homepage,
  So that I can learn about the Vets For Future IMS, its achievements, and navigate to system portals.

  Scenario: User navigates to website homepage
    Given a visitor navigates to "/"
    Then the homepage is displayed successfully

  Scenario: Homepage renders navigation bar
    Given a visitor on homepage
    Then the navigation bar displays the brand logo "VFF"
    And it displays links to Login and Register



  Scenario: Homepage renders hero section header
    Given a visitor on homepage
    Then the hero header has line breaks
    And it reads "Empower welfare" and "with unified systems."

  Scenario: Homepage renders start challenge button
    Given a visitor on homepage
    Then the primary button "Access System" is visible
    And clicking it redirects to "/register"

  Scenario: Homepage renders discover platform button
    Given a visitor on homepage
    Then the secondary button "Documentation" is visible
    And clicking it redirects to "/login"

  Scenario: Homepage renders stats row metrics
    Given a visitor on homepage
    Then a stats bar with 4 metrics is displayed
    And the stats are separated by vertical dividers

  Scenario: Homepage renders visual veterinarian care image
    Given a visitor on homepage
    Then the visual container displays a veterinarian treating an animal
    And it features the caption "VFF VETERINARY CLINIC CARE CENTER"

  Scenario: Homepage renders About Us section
    Given a visitor on homepage
    Then the "About Vets For Future" section is visible
    And it describes the history and operational scope of VFF

  Scenario: Homepage renders Achievements section
    Given a visitor on homepage
    Then the Achievements section lists "15,000+ animals treated"
    And it lists "100% active operational tracking"

  Scenario: Homepage renders Contact Us section
    Given a visitor on homepage
    Then the Contact section displays the address "Colombo, Sri Lanka"
    And it displays the contact email "ops@vetsforfuture.org"
    And it displays the phone number "+94 11 234 5678"

  Scenario: Homepage renders rich 4-column footer
    Given a visitor on homepage
    Then the footer renders a 4-column grid layout
    And it includes quick links, portals, modules, and contact info

  Scenario: Back to website button redirects to homepage from login
    Given a user on "/login"
    When they click "Back to website →"
    Then they are redirected to "/"

  Scenario: Back to website button redirects to homepage from register
    Given a user on "/register"
    When they click "Back to website →"
    Then they are redirected to "/"

  Scenario: Authenticated user redirects to dashboard
    Given an authenticated user session
    When they navigate to "/"
    Then they see a shortcut button to their system dashboard
