import pytest

VISUAL_CONFIG = {
    "SPLIT_SCREEN_LAYOUT": True,
    "LEFT_PANE_IMAGE_LOGIN": "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1600&q=80",
    "LEFT_PANE_IMAGE_REGISTER": "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1200&q=80",
    "CAPTION_TEXT": "APOLLO 11 · JULY 20, 1969 · SEA OF TRANQUILITY",
    "ATTRIBUTION_TEXT": "NASA / NEIL ARMSTRONG — PUBLIC DOMAIN"
}

def test_split_screen_layout_enabled():
    assert VISUAL_CONFIG["SPLIT_SCREEN_LAYOUT"] is True

def test_left_pane_images():
    assert "photo-1516849841032-87cbac4d88f7" in VISUAL_CONFIG["LEFT_PANE_IMAGE_LOGIN"]
    assert "photo-1454789548928-9efd52dc4031" in VISUAL_CONFIG["LEFT_PANE_IMAGE_REGISTER"]

def test_cinematic_captions():
    assert VISUAL_CONFIG["CAPTION_TEXT"] == "APOLLO 11 · JULY 20, 1969 · SEA OF TRANQUILITY"
    assert "NEIL ARMSTRONG" in VISUAL_CONFIG["ATTRIBUTION_TEXT"]
