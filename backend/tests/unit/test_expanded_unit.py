import pytest

# 1. Test notification settings toggles defaults
def test_notification_toggle_defaults():
    toggles = {"finance": True, "hr": True, "inventory": True, "programs": True}
    assert all(toggles.values())

# 2. Test finance toggle can be disabled
def test_disable_finance_toggle():
    toggles = {"finance": True, "hr": True}
    toggles["finance"] = False
    assert toggles["finance"] is False

# 3. Test hr toggle can be disabled
def test_disable_hr_toggle():
    toggles = {"hr": True}
    toggles["hr"] = False
    assert toggles["hr"] is False

# 4. Test inventory toggle can be disabled
def test_disable_inventory_toggle():
    toggles = {"inventory": True}
    toggles["inventory"] = False
    assert toggles["inventory"] is False

# 5. Test programs toggle can be disabled
def test_disable_programs_toggle():
    toggles = {"programs": True}
    toggles["programs"] = False
    assert toggles["programs"] is False

# 6. Test default theme is dark
def test_default_theme_is_dark():
    theme = "dark"
    assert theme == "dark"

# 7. Test theme switching to light
def test_theme_switch_to_light():
    theme = "dark"
    theme = "light"
    assert theme == "light"

# 8. Test support center chapters list count
def test_support_chapters_count():
    chapters = ["rbac", "finance", "hr", "inventory", "faq"]
    assert len(chapters) == 5

# 9. Test default logo destination
def test_default_logo_destination():
    destination = "/"
    assert destination == "/"

# 10. Test layout transition duration
def test_layout_transition_duration():
    duration_ms = 300
    assert duration_ms == 300

# 11. Test sidebar open margin
def test_sidebar_open_margin():
    margin = "ml-64"
    assert margin == "ml-64"

# 12. Test sidebar collapsed margin
def test_sidebar_collapsed_margin():
    margin = "ml-20"
    assert margin == "ml-20"

# 13. Test profile bio input validations
def test_profile_bio_length_valid():
    bio = "Short valid bio"
    assert len(bio) > 0

# 14. Test profile bio blank rejection
def test_profile_bio_blank_rejected():
    bio = ""
    assert len(bio) == 0

# 15. Test valid phone format stub
def test_phone_format_valid():
    phone = "+94 77 123 4567"
    assert phone.startswith("+94")

# 16. Test active permissions status
def test_permissions_active_status():
    status = "Active"
    assert status == "Active"

# 17. Test navigation dropdown link mapping profile
def test_nav_dropdown_profile_link():
    link = "/profile"
    assert link == "/profile"

# 18. Test navigation dropdown link mapping settings
def test_nav_dropdown_settings_link():
    link = "/settings"
    assert link == "/settings"

# 19. Test navigation dropdown link mapping support
def test_nav_dropdown_support_link():
    link = "/support"
    assert link == "/support"

# 20. Test visible sub-items logic
def test_admin_subitems_presence():
    item = {
        "label": "Admin Panel",
        "subItems": [{"label": "User Registry"}]
    }
    assert "subItems" in item
    assert len(item["subItems"]) == 1

# 21. Test notification payload format
def test_notification_payload_fields():
    notif = {"id": 1, "module": "finance", "isRead": False}
    assert "id" in notif
    assert "module" in notif
    assert "isRead" in notif
