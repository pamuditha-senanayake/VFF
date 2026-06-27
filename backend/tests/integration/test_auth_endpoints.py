import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from app.main import app
from app.core.supabase import get_supabase

client = TestClient(app)

# Helper mock setup
def get_mock_supabase():
    mock_client = MagicMock()
    # Mock auth sign up
    mock_client.auth.sign_up.return_value = MagicMock(user=MagicMock(id="mock-user-id"))
    # Mock auth sign in
    mock_session = MagicMock()
    mock_session.access_token = "mock-access-token"
    mock_session.refresh_token = "mock-refresh-token"
    mock_client.auth.sign_in_with_password.return_value = MagicMock(
        session=mock_session,
        user=MagicMock(id="mock-user-id")
    )
    # Mock database responses
    mock_table = MagicMock()
    mock_table.insert.return_value.execute.return_value = MagicMock()
    mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
        data={"id": "mock-user-id", "role_id": 2, "roles": {"role_name": "Director"}}
    )
    mock_client.table.return_value = mock_table
    return mock_client

@pytest.fixture
def override_supabase():
    mock_db = get_mock_supabase()
    app.dependency_overrides[get_supabase] = lambda: mock_db
    yield mock_db
    app.dependency_overrides.clear()


# --- Endpoint Integration Tests (21 tests) ---

def test_endpoint_register_success(override_supabase):
    response = client.post("/api/auth/register", json={
        "email": "test@vff.org",
        "password": "securepassword",
        "role_id": 2
    })
    assert response.status_code == 200
    assert response.json()["message"] == "User registered successfully"
    assert response.json()["user_id"] == "mock-user-id"

def test_endpoint_register_invalid_email(override_supabase):
    response = client.post("/api/auth/register", json={
        "email": "invalid-email",
        "password": "securepassword"
    })
    assert response.status_code == 422 # Pydantic ValidationError

def test_endpoint_register_missing_password(override_supabase):
    response = client.post("/api/auth/register", json={
        "email": "test@vff.org"
    })
    assert response.status_code == 422

def test_endpoint_register_missing_email(override_supabase):
    response = client.post("/api/auth/register", json={
        "password": "securepassword"
    })
    assert response.status_code == 422

def test_endpoint_register_default_role(override_supabase):
    # Tests that default role_id is optional but defaultable
    response = client.post("/api/auth/register", json={
        "email": "test@vff.org",
        "password": "securepassword"
    })
    assert response.status_code == 200
    override_supabase.table("users").insert.assert_called_once()

def test_endpoint_register_provider_failure(override_supabase):
    override_supabase.auth.sign_up.return_value = MagicMock(user=None)
    response = client.post("/api/auth/register", json={
        "email": "test@vff.org",
        "password": "securepassword"
    })
    assert response.status_code == 400
    assert "Registration failed" in response.json()["detail"]

def test_endpoint_register_db_exception(override_supabase):
    override_supabase.table().insert().execute.side_effect = Exception("DB Error")
    response = client.post("/api/auth/register", json={
        "email": "test@vff.org",
        "password": "securepassword"
    })
    assert response.status_code == 400
    assert "DB Error" in response.json()["detail"]

def test_endpoint_login_success(override_supabase):
    response = client.post("/api/auth/login", json={
        "email": "test@vff.org",
        "password": "securepassword"
    })
    assert response.status_code == 200
    assert response.json()["access_token"] == "mock-access-token"
    assert response.json()["user"]["role"] == "Director"

def test_endpoint_login_invalid_email(override_supabase):
    response = client.post("/api/auth/login", json={
        "email": "invalid-email",
        "password": "securepassword"
    })
    assert response.status_code == 422

def test_endpoint_login_missing_password(override_supabase):
    response = client.post("/api/auth/login", json={
        "email": "test@vff.org"
    })
    assert response.status_code == 422

def test_endpoint_login_missing_email(override_supabase):
    response = client.post("/api/auth/login", json={
        "password": "securepassword"
    })
    assert response.status_code == 422

def test_endpoint_login_incorrect_credentials(override_supabase):
    override_supabase.auth.sign_in_with_password.return_value = MagicMock(session=None)
    response = client.post("/api/auth/login", json={
        "email": "test@vff.org",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert "Invalid credentials" in response.json()["detail"]

def test_endpoint_login_exception_raised(override_supabase):
    override_supabase.auth.sign_in_with_password.side_effect = Exception("Network Timeout")
    response = client.post("/api/auth/login", json={
        "email": "test@vff.org",
        "password": "securepassword"
    })
    assert response.status_code == 401
    assert "Network Timeout" in response.json()["detail"]

def test_endpoint_login_db_user_missing(override_supabase):
    override_supabase.table().select().eq().single().execute.return_value = MagicMock(data=None)
    response = client.post("/api/auth/login", json={
        "email": "test@vff.org",
        "password": "securepassword"
    })
    assert response.status_code == 200
    assert response.json()["user"]["role"] == "Director"

def test_endpoint_login_role_admin(override_supabase):
    override_supabase.table().select().eq().single().execute.return_value = MagicMock(
        data={"id": "mock-user-id", "role_id": 1, "roles": {"role_name": "Admin"}}
    )
    response = client.post("/api/auth/login", json={
        "email": "test@vff.org",
        "password": "securepassword"
    })
    assert response.status_code == 200
    assert response.json()["user"]["role"] == "Admin"

def test_endpoint_login_role_staff(override_supabase):
    override_supabase.table().select().eq().single().execute.return_value = MagicMock(
        data={"id": "mock-user-id", "role_id": 3, "roles": {"role_name": "Staff"}}
    )
    response = client.post("/api/auth/login", json={
        "email": "test@vff.org",
        "password": "securepassword"
    })
    assert response.status_code == 200
    assert response.json()["user"]["role"] == "Staff"

def test_endpoint_login_db_error(override_supabase):
    override_supabase.table().select().eq().single().execute.side_effect = Exception("DB Connect Error")
    response = client.post("/api/auth/login", json={
        "email": "test@vff.org",
        "password": "securepassword"
    })
    assert response.status_code == 401

def test_cors_headers_present():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "VFF Integrated Management System" in response.json()["message"]

def test_invalid_http_method():
    response = client.get("/api/auth/login")
    assert response.status_code == 405

def test_endpoint_register_extra_fields(override_supabase):
    response = client.post("/api/auth/register", json={
        "email": "test@vff.org",
        "password": "securepassword",
        "role_id": 2,
        "extra_field": "ignore_me"
    })
    assert response.status_code == 200
