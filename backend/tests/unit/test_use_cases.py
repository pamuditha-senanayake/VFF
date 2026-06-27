import pytest
from unittest.mock import MagicMock
from app.domain.entities import User, UserRepository
from app.application.use_cases import RegisterUseCase, LoginUseCase

# --- Domain Entity Unit Tests (10 tests) ---

def test_user_entity_initialization():
    user = User(id="usr_1", email="test@vff.org", role_id=2, role_name="Director")
    assert user.id == "usr_1"
    assert user.email == "test@vff.org"
    assert user.role_id == 2
    assert user.role_name == "Director"

def test_user_entity_default_role():
    user = User(id="usr_1", email="test@vff.org")
    assert user.role_id == 2
    assert user.role_name is None

def test_user_entity_admin_role():
    user = User(id="usr_2", email="admin@vff.org", role_id=1, role_name="Admin")
    assert user.role_id == 1
    assert user.role_name == "Admin"

def test_user_entity_staff_role():
    user = User(id="usr_3", email="staff@vff.org", role_id=3, role_name="Staff")
    assert user.role_id == 3
    assert user.role_name == "Staff"

def test_user_entity_empty_id():
    with pytest.raises(ValueError):
        User(id="", email="test@vff.org")

def test_user_entity_invalid_email():
    with pytest.raises(ValueError):
        User(id="1", email="invalid-email")

def test_user_entity_repr():
    user = User(id="usr_1", email="test@vff.org", role_id=2)
    assert "test@vff.org" in repr(user)

def test_user_entity_equality():
    u1 = User(id="usr_1", email="test@vff.org")
    u2 = User(id="usr_1", email="test@vff.org")
    assert u1 == u2

def test_user_entity_inequality():
    u1 = User(id="usr_1", email="test@vff.org")
    u2 = User(id="usr_2", email="test@vff.org")
    assert u1 != u2

def test_user_entity_optional_fields():
    user = User(id="usr_1", email="test@vff.org", role_name=None)
    assert user.role_name is None


# --- Register Use Case Unit Tests (6 tests) ---

def test_register_use_case_success():
    repo = MagicMock(spec=UserRepository)
    expected_user = User(id="usr_123", email="new@vff.org", role_id=2)
    repo.register.return_value = expected_user

    use_case = RegisterUseCase(repo)
    result = use_case.execute("new@vff.org", "password123", 2)

    assert result == expected_user
    repo.register.assert_called_once_with("new@vff.org", "password123", 2)

def test_register_use_case_failure():
    repo = MagicMock(spec=UserRepository)
    repo.register.side_effect = Exception("Email already registered")

    use_case = RegisterUseCase(repo)
    with pytest.raises(Exception, match="Email already registered"):
        use_case.execute("new@vff.org", "password123", 2)

def test_register_use_case_weak_password():
    repo = MagicMock(spec=UserRepository)
    repo.register.side_effect = Exception("Password too weak")

    use_case = RegisterUseCase(repo)
    with pytest.raises(Exception, match="Password too weak"):
        use_case.execute("new@vff.org", "123", 2)

def test_register_use_case_empty_email():
    repo = MagicMock(spec=UserRepository)
    repo.register.side_effect = Exception("Email is required")

    use_case = RegisterUseCase(repo)
    with pytest.raises(Exception, match="Email is required"):
        use_case.execute("", "password123", 2)

def test_register_use_case_admin_role():
    repo = MagicMock(spec=UserRepository)
    expected_user = User(id="usr_999", email="new_admin@vff.org", role_id=1)
    repo.register.return_value = expected_user

    use_case = RegisterUseCase(repo)
    result = use_case.execute("new_admin@vff.org", "adminpass", 1)
    assert result.role_id == 1

def test_register_use_case_called_with_correct_args():
    repo = MagicMock(spec=UserRepository)
    use_case = RegisterUseCase(repo)
    use_case.execute("correct@vff.org", "correct_pass", 3)
    repo.register.assert_called_with("correct@vff.org", "correct_pass", 3)


# --- Login Use Case Unit Tests (6 tests) ---

def test_login_use_case_success():
    repo = MagicMock(spec=UserRepository)
    expected_user = User(id="usr_123", email="user@vff.org", role_id=2, role_name="Director")
    repo.login.return_value = ("access_token_123", "refresh_token_123", expected_user)

    use_case = LoginUseCase(repo)
    token, refresh, user = use_case.execute("user@vff.org", "correct_pass")

    assert token == "access_token_123"
    assert refresh == "refresh_token_123"
    assert user == expected_user
    repo.login.assert_called_once_with("user@vff.org", "correct_pass")

def test_login_use_case_invalid_credentials():
    repo = MagicMock(spec=UserRepository)
    repo.login.side_effect = Exception("Invalid credentials")

    use_case = LoginUseCase(repo)
    with pytest.raises(Exception, match="Invalid credentials"):
        use_case.execute("user@vff.org", "wrong_pass")

def test_login_use_case_empty_password():
    repo = MagicMock(spec=UserRepository)
    repo.login.side_effect = Exception("Password is required")

    use_case = LoginUseCase(repo)
    with pytest.raises(Exception, match="Password is required"):
        use_case.execute("user@vff.org", "")

def test_login_use_case_empty_email():
    repo = MagicMock(spec=UserRepository)
    repo.login.side_effect = Exception("Email is required")

    use_case = LoginUseCase(repo)
    with pytest.raises(Exception, match="Email is required"):
        use_case.execute("", "password123")

def test_login_use_case_returns_role():
    repo = MagicMock(spec=UserRepository)
    expected_user = User(id="usr_admin", email="admin@vff.org", role_id=1, role_name="Admin")
    repo.login.return_value = ("tok", "ref", expected_user)

    use_case = LoginUseCase(repo)
    _, _, user = use_case.execute("admin@vff.org", "pass")
    assert user.role_name == "Admin"

def test_login_use_case_repo_interaction():
    repo = MagicMock(spec=UserRepository)
    use_case = LoginUseCase(repo)
    try:
        use_case.execute("test@vff.org", "pass")
    except Exception:
        pass
    repo.login.assert_called_once_with("test@vff.org", "pass")
