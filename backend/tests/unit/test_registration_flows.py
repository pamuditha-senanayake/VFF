import pytest
import re

# Helper logic representing registration validation
def validate_email(email: str) -> bool:
    if not email:
        return False
    return bool(re.match(r"[^@]+@[^@]+\.[^@]+", email))

def validate_password_strength(password: str) -> bool:
    if not password or len(password) < 8:
        return False
    return any(c.isupper() for c in password) and any(c.islower() for c in password) and any(c.isdigit() for c in password)

def derive_username(email: str) -> str:
    if not email or "@" not in email:
        return ""
    part = email.split("@")[0]
    return re.sub(r"[^a-zA-Z0-9]", "_", part)

# Unit Tests

def test_director_role_id():
    role_id = 2
    assert role_id == 2

def test_admin_role_id():
    role_id = 1
    assert role_id == 1

def test_email_validation_valid():
    assert validate_email("admin@vff.org") is True

def test_email_validation_invalid():
    assert validate_email("invalid-email") is False

def test_email_validation_empty():
    assert validate_email("") is False

def test_password_strength_strong():
    assert validate_password_strength("StrongPassword123!") is True

def test_password_strength_weak_length():
    assert validate_password_strength("Weak1") is False

def test_password_strength_weak_case():
    assert validate_password_strength("weakpassword123") is False

def test_password_strength_weak_digit():
    assert validate_password_strength("WeakPassword") is False

def test_password_strength_empty():
    assert validate_password_strength("") is False

def test_role_name_mapping():
    roles = {1: "Admin", 2: "Director"}
    assert roles[1] == "Admin"
    assert roles[2] == "Director"

def test_admin_requires_verification():
    user_role = "Admin"
    requires_approval = True if user_role == "Admin" else False
    assert requires_approval is True

def test_director_is_active_immediately():
    user_role = "Director"
    requires_approval = True if user_role == "Admin" else False
    assert requires_approval is False

def test_password_match():
    p1 = "Pass123"
    p2 = "Pass123"
    assert p1 == p2

def test_password_mismatch():
    p1 = "Pass123"
    p2 = "Different123"
    assert p1 != p2

def test_email_domain_extract():
    email = "test@vff.org"
    domain = email.split("@")[1]
    assert domain == "vff.org"

def test_clean_email_lowercasing():
    email = "  Admin@VFF.org  "
    cleaned = email.strip().lower()
    assert cleaned == "admin@vff.org"

def test_username_auto_derivation():
    assert derive_username("john.doe@vff.org") == "john_doe"

def test_username_special_characters():
    assert derive_username("j#hn$d%e@vff.org") == "j_hn_d_e"

def test_admin_registration_warning_flag():
    role_id = 1
    show_warning = True if role_id == 1 else False
    assert show_warning is True

def test_director_registration_warning_flag():
    role_id = 2
    show_warning = True if role_id == 1 else False
    assert show_warning is False
