import pytest

REDESIGN_CONFIG = {
    "PRIMARY_ACCENT": "#EF9F27",
    "ACCENT_SOFT": "#FDEBCB",
    "LIGHT_BACKGROUND": "#FFFFFF",
    "LIGHT_BG_SUBTLE": "#F7F8FA",
    "LIGHT_SURFACE": "#FFFFFF",
    "LIGHT_BORDER": "#E5E7EB",
    "TEXT_PRIMARY": "#111318",
    "TEXT_SECONDARY": "#6B7280",
    "TEXT_MUTED": "#9CA3AF",
    "POSITIVE_DELTA": "#16A34A",
    "NEGATIVE_DELTA": "#DC2626",
    "DARK_BACKGROUND": "#0B0D12",
    "DARK_BG_SUBTLE": "#14161C",
    "DARK_SURFACE": "#14161C",
    "DARK_BORDER": "#232730",
    "HEADING_FONT": "Space Grotesk",
    "BODY_FONT": "Inter",
    "MONO_FONT": "JetBrains Mono",
    "CARD_RADIUS": "12px",
    "SIDEBAR_WIDTH_EXPANDED": "260px",
    "SIDEBAR_WIDTH_COLLAPSED": "80px",
    "SEARCH_SHORTCUT": "meta+k",
    "SECTIONS": ["MENU", "MANAGEMENT"],
    "NOTIFICATIONS_ENABLED": True,
    "PROFILE_MENU_ITEMS": ["Edit profile", "Account settings", "Support", "Sign out"]
}

# 1. Accent color validation
def test_accent_color():
    assert REDESIGN_CONFIG["PRIMARY_ACCENT"] == "#EF9F27"

# 2. Accent soft color validation
def test_accent_soft_color():
    assert REDESIGN_CONFIG["ACCENT_SOFT"] == "#FDEBCB"

# 3. Light background validation
def test_light_background():
    assert REDESIGN_CONFIG["LIGHT_BACKGROUND"] == "#FFFFFF"

# 4. Light bg subtle validation
def test_light_bg_subtle():
    assert REDESIGN_CONFIG["LIGHT_BG_SUBTLE"] == "#F7F8FA"

# 5. Light surface validation
def test_light_surface():
    assert REDESIGN_CONFIG["LIGHT_SURFACE"] == "#FFFFFF"

# 6. Light border validation
def test_light_border():
    assert REDESIGN_CONFIG["LIGHT_BORDER"] == "#E5E7EB"

# 7. Text primary validation
def test_text_primary():
    assert REDESIGN_CONFIG["TEXT_PRIMARY"] == "#111318"

# 8. Text secondary validation
def test_text_secondary():
    assert REDESIGN_CONFIG["TEXT_SECONDARY"] == "#6B7280"

# 9. Text muted validation
def test_text_muted():
    assert REDESIGN_CONFIG["TEXT_MUTED"] == "#9CA3AF"

# 10. Positive delta validation
def test_positive_delta():
    assert REDESIGN_CONFIG["POSITIVE_DELTA"] == "#16A34A"

# 11. Negative delta validation
def test_negative_delta():
    assert REDESIGN_CONFIG["NEGATIVE_DELTA"] == "#DC2626"

# 12. Dark background validation
def test_dark_background():
    assert REDESIGN_CONFIG["DARK_BACKGROUND"] == "#0B0D12"

# 13. Dark bg subtle validation
def test_dark_bg_subtle():
    assert REDESIGN_CONFIG["DARK_BG_SUBTLE"] == "#14161C"

# 14. Dark surface validation
def test_dark_surface():
    assert REDESIGN_CONFIG["DARK_SURFACE"] == "#14161C"

# 15. Dark border validation
def test_dark_border():
    assert REDESIGN_CONFIG["DARK_BORDER"] == "#232730"

# 16. Heading font validation
def test_heading_font():
    assert REDESIGN_CONFIG["HEADING_FONT"] == "Space Grotesk"

# 17. Body font validation
def test_body_font():
    assert REDESIGN_CONFIG["BODY_FONT"] == "Inter"

# 18. Mono font validation
def test_mono_font():
    assert REDESIGN_CONFIG["MONO_FONT"] == "JetBrains Mono"

# 19. Card radius validation
def test_card_radius():
    assert REDESIGN_CONFIG["CARD_RADIUS"] == "12px"

# 20. Sidebar expanded width validation
def test_sidebar_expanded_width():
    assert REDESIGN_CONFIG["SIDEBAR_WIDTH_EXPANDED"] == "260px"

# 21. Sidebar collapsed width validation
def test_sidebar_collapsed_width():
    assert REDESIGN_CONFIG["SIDEBAR_WIDTH_COLLAPSED"] == "80px"

# 22. Search shortcut validation
def test_search_shortcut_key():
    assert REDESIGN_CONFIG["SEARCH_SHORTCUT"] == "meta+k"
