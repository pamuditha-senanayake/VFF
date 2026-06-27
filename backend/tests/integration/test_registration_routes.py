import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 21 Registration Integration Tests

def test_cors_preflight_director_register():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers

def test_cors_preflight_admin_register():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code == 200

def test_register_endpoint_method_not_allowed():
    response = client.get("/api/auth/register")
    assert response.status_code == 405

def test_register_endpoint_empty_payload():
    response = client.post("/api/auth/register", json={})
    assert response.status_code == 422

def test_register_payload_invalid_email_type():
    response = client.post("/api/auth/register", json={"email": 1234, "password": "Pass", "role_id": 2})
    assert response.status_code == 422

def test_register_payload_invalid_password_type():
    response = client.post("/api/auth/register", json={"email": "test@vff.org", "password": 123, "role_id": 2})
    assert response.status_code == 422

def test_register_payload_invalid_role_type():
    response = client.post("/api/auth/register", json={"email": "test@vff.org", "password": "Pass", "role_id": "Director"})
    assert response.status_code == 422

def test_health_check_returns_api_status():
    response = client.get("/")
    assert response.status_code == 200

def test_preflight_headers_expose_origin():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"

def test_preflight_headers_expose_methods():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert "POST" in response.headers.get("access-control-allow-methods", "")

def test_api_options_unsupported_method():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "DELETE"})
    assert response.status_code == 200

def test_preflight_headers_expose_credentials():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.headers.get("access-control-allow-credentials") == "true"

def test_root_endpoint_content_type():
    response = client.get("/")
    assert "application/json" in response.headers.get("content-type", "")

def test_auth_login_preflight():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code == 200

def test_auth_login_method_not_allowed():
    response = client.get("/api/auth/login")
    assert response.status_code == 405

def test_auth_login_empty_payload():
    response = client.post("/api/auth/login", json={})
    assert response.status_code == 422

def test_auth_login_invalid_email_type():
    response = client.post("/api/auth/login", json={"email": True, "password": "Pass"})
    assert response.status_code == 422

def test_auth_login_invalid_password_type():
    response = client.post("/api/auth/login", json={"email": "test@vff.org", "password": False})
    assert response.status_code == 422

def test_auth_login_cors_origin_match():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"

def test_root_message_online():
    response = client.get("/")
    assert "VFF" in response.json()["message"]

def test_preflight_allow_headers():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type"})
    assert "content-type" in response.headers.get("access-control-allow-headers", "").lower()

def test_get_users_list_route():
    response = client.get("/api/auth/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_put_user_role_route_invalid_user():
    response = client.put("/api/auth/users/invalid-uuid-format/role", json={"role_id": 2})
    # Since mock db will fail to find user, we expect a 400 bad request or exception
    assert response.status_code == 400

def test_put_user_role_route_validation_error():
    response = client.put("/api/auth/users/dee79473-fb77-4e8d-9818-06b4d0f85d0d/role", json={"role_id": "InvalidRoleID"})
    assert response.status_code == 422
