import pytest

STYLE_CONFIG = {
    "PRIMARY_BACKGROUND": "#13111c",
    "CARD_FREE_PANEL": True,
    "ACCENT_VIOLET": "#6366f1",
    "INPUT_BORDER": "#252236",
    "INPUT_BG": "#1c1a27",
    "INSET_ROUNDED": "16px"
}

def test_unified_background_color():
    assert STYLE_CONFIG["PRIMARY_BACKGROUND"] == "#13111c"

def test_card_free_enabled():
    assert STYLE_CONFIG["CARD_FREE_PANEL"] is True

def test_accent_violet_spec():
    assert STYLE_CONFIG["ACCENT_VIOLET"] == "#6366f1"

def test_input_theme_colors():
    assert STYLE_CONFIG["INPUT_BORDER"] == "#252236"
    assert STYLE_CONFIG["INPUT_BG"] == "#1c1a27"

def test_inset_rounded_corners():
    assert STYLE_CONFIG["INSET_ROUNDED"] == "16px"
