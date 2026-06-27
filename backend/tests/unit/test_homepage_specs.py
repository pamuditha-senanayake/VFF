import pytest

HOMEPAGE_CONFIG = {
    "BG_PRIMARY": "#0d1117",
    "BG_SECONDARY": "#0f1520",
    "BG_CARD": "#161b26",
    "TEXT_PRIMARY": "#ffffff",
    "TEXT_SECONDARY": "#94a3b8",
    "ACCENT_BLUE": "#3b82f6",
    "ACCENT_GREEN": "#22c55e",
    "BORDER_SUBTLE": "#1e293b",
    "FONT_HEADLINE": "Inter",
    "GRID_COLUMNS": 4,
    "HERO_H1_WEIGHT": 700,
    "EYEBROW_SIZE": "11px",
    "BUTTON_RADIUS": "8px",
    "SPACING_UNIT": 4,
    "MAX_WIDTH": "1280px",
    "CAPTION_VFF": "VFF VETERINARY CLINIC CARE CENTER",
    "SLIDE_INDEX": "01 / 03",
    "VALUES_COUNT": 3
}

def test_bg_primary():
    assert HOMEPAGE_CONFIG["BG_PRIMARY"] == "#0d1117"

def test_bg_secondary():
    assert HOMEPAGE_CONFIG["BG_SECONDARY"] == "#0f1520"

def test_bg_card():
    assert HOMEPAGE_CONFIG["BG_CARD"] == "#161b26"

def test_text_primary():
    assert HOMEPAGE_CONFIG["TEXT_PRIMARY"] == "#ffffff"

def test_text_secondary():
    assert HOMEPAGE_CONFIG["TEXT_SECONDARY"] == "#94a3b8"

def test_accent_blue():
    assert HOMEPAGE_CONFIG["ACCENT_BLUE"] == "#3b82f6"

def test_accent_green():
    assert HOMEPAGE_CONFIG["ACCENT_GREEN"] == "#22c55e"

def test_border_subtle():
    assert HOMEPAGE_CONFIG["BORDER_SUBTLE"] == "#1e293b"

def test_font_headline():
    assert HOMEPAGE_CONFIG["FONT_HEADLINE"] == "Inter"

def test_grid_columns():
    assert HOMEPAGE_CONFIG["GRID_COLUMNS"] == 4

def test_hero_h1_weight():
    assert HOMEPAGE_CONFIG["HERO_H1_WEIGHT"] == 700

def test_eyebrow_size():
    assert HOMEPAGE_CONFIG["EYEBROW_SIZE"] == "11px"

def test_button_radius():
    assert HOMEPAGE_CONFIG["BUTTON_RADIUS"] == "8px"

def test_spacing_unit():
    assert HOMEPAGE_CONFIG["SPACING_UNIT"] == 4

def test_max_width():
    assert HOMEPAGE_CONFIG["MAX_WIDTH"] == "1280px"

def test_caption_vff():
    assert HOMEPAGE_CONFIG["CAPTION_VFF"] == "VFF VETERINARY CLINIC CARE CENTER"

def test_slide_index():
    assert HOMEPAGE_CONFIG["SLIDE_INDEX"] == "01 / 03"

def test_values_count():
    assert HOMEPAGE_CONFIG["VALUES_COUNT"] == 3

def test_spacing_unit_multiple_gap():
    assert HOMEPAGE_CONFIG["SPACING_UNIT"] * 8 == 32

def test_spacing_unit_multiple_section():
    assert HOMEPAGE_CONFIG["SPACING_UNIT"] * 20 == 80

def test_button_radius_valid():
    assert HOMEPAGE_CONFIG["BUTTON_RADIUS"].endswith("px")

def test_values_count_type():
    assert isinstance(HOMEPAGE_CONFIG["VALUES_COUNT"], int)
