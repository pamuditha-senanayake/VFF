import pytest

THEME_CONFIGS = {
    "default_theme": "dark",
    "dark": {
        "class": "dark",
        "bg": "#0B0D12",
        "bg_subtle": "#14161C",
        "surface": "#14161C",
        "border": "#232730",
        "text_primary": "#F9FAFB",
        "text_secondary": "#9CA3AF",
        "swal_bg": "#0F1520",
        "swal_color": "#F9FAFB",
        "swal_cancel_btn": "#232730"
    },
    "light": {
        "class": "light",
        "bg": "#FFFFFF",
        "bg_subtle": "#F7F8FA",
        "surface": "#FFFFFF",
        "border": "#E5E7EB",
        "text_primary": "#111318",
        "text_secondary": "#6B7280",
        "swal_bg": "#FFFFFF",
        "swal_color": "#111318",
        "swal_cancel_btn": "#E5E7EB"
    }
}

def test_default_theme_value():
    assert THEME_CONFIGS["default_theme"] == "dark"

def test_dark_mode_class():
    assert THEME_CONFIGS["dark"]["class"] == "dark"

def test_light_mode_class():
    assert THEME_CONFIGS["light"]["class"] == "light"

def test_dark_mode_background():
    assert THEME_CONFIGS["dark"]["bg"] == "#0B0D12"

def test_light_mode_background():
    assert THEME_CONFIGS["light"]["bg"] == "#FFFFFF"

def test_dark_mode_bg_subtle():
    assert THEME_CONFIGS["dark"]["bg_subtle"] == "#14161C"

def test_light_mode_bg_subtle():
    assert THEME_CONFIGS["light"]["bg_subtle"] == "#F7F8FA"

def test_dark_mode_surface():
    assert THEME_CONFIGS["dark"]["surface"] == "#14161C"

def test_light_mode_surface():
    assert THEME_CONFIGS["light"]["surface"] == "#FFFFFF"

def test_dark_mode_border():
    assert THEME_CONFIGS["dark"]["border"] == "#232730"

def test_light_mode_border():
    assert THEME_CONFIGS["light"]["border"] == "#E5E7EB"

def test_dark_mode_text_primary():
    assert THEME_CONFIGS["dark"]["text_primary"] == "#F9FAFB"

def test_light_mode_text_primary():
    assert THEME_CONFIGS["light"]["text_primary"] == "#111318"

def test_dark_mode_text_secondary():
    assert THEME_CONFIGS["dark"]["text_secondary"] == "#9CA3AF"

def test_light_mode_text_secondary():
    assert THEME_CONFIGS["light"]["text_secondary"] == "#6B7280"

def test_dark_mode_swal_bg():
    assert THEME_CONFIGS["dark"]["swal_bg"] == "#0F1520"

def test_light_mode_swal_bg():
    assert THEME_CONFIGS["light"]["swal_bg"] == "#FFFFFF"

def test_dark_mode_swal_color():
    assert THEME_CONFIGS["dark"]["swal_color"] == "#F9FAFB"

def test_light_mode_swal_color():
    assert THEME_CONFIGS["light"]["swal_color"] == "#111318"

def test_dark_mode_swal_cancel_btn():
    assert THEME_CONFIGS["dark"]["swal_cancel_btn"] == "#232730"

def test_light_mode_swal_cancel_btn():
    assert THEME_CONFIGS["light"]["swal_cancel_btn"] == "#E5E7EB"

def test_theme_mode_toggle_options():
    assert len(THEME_CONFIGS) == 3
