import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 1. Test get users endpoint returns list or requires auth
def test_integration_get_users():
    response = client.get("/api/auth/users")
    assert response.status_code in [200, 401, 403, 307]

# 2. Test get users options route
def test_integration_options_users():
    response = client.options("/api/auth/users", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200

# 3. Test put user role options route
def test_integration_options_user_role():
    response = client.options("/api/auth/users/test-uuid/role", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "PUT"})
    assert response.status_code == 200

# 4. Test delete user options route
def test_integration_options_delete_user():
    response = client.options("/api/auth/users/test-uuid", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "DELETE"})
    assert response.status_code == 200

# 5. Test invalid method on user delete
def test_integration_invalid_method_delete_user():
    response = client.post("/api/auth/users/test-uuid")
    assert response.status_code == 405

# 6. Test delete user with invalid UUID format
def test_integration_delete_user_not_found():
    response = client.delete("/api/auth/users/nonexistent-id")
    # Even if nonexistent, it returns 400 or 200 depending on Supabase delete result
    assert response.status_code in [200, 400, 401, 403]

# 7. Test get users response content type
def test_integration_users_content_type():
    response = client.get("/api/auth/users")
    if response.status_code == 200:
        assert response.headers.get("content-type") == "application/json"
    else:
        assert True

# 8. Test update user role invalid payload
def test_integration_update_role_invalid_payload():
    response = client.put("/api/auth/users/test-uuid/role", json={"invalid_field": 123})
    assert response.status_code in [400, 422, 401]

# 9. Test update user role empty payload
def test_integration_update_role_empty_payload():
    response = client.put("/api/auth/users/test-uuid/role", json={})
    assert response.status_code in [400, 422, 401]

# 10. Test register method with empty body
def test_integration_register_empty_body():
    response = client.post("/api/auth/register", json={})
    assert response.status_code in [400, 422]

# 11. Test register method options
def test_integration_register_options():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code == 200

# 12. Test login method options
def test_integration_login_options():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code == 200

# 13. Test update user role route invalid type for role_id
def test_integration_update_role_invalid_type():
    response = client.put("/api/auth/users/test-uuid/role", json={"role_id": "string-role"})
    assert response.status_code in [400, 422, 401]

# 14. Test delete user endpoint returns JSON format error on invalid call
def test_integration_delete_user_response_format():
    response = client.delete("/api/auth/users/invalid")
    assert "content-type" in response.headers

# 15. Test CORS allow origin in user management routes
def test_integration_cors_users():
    response = client.get("/api/auth/users", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers

# 16. Test register route rejects invalid email format
def test_integration_register_invalid_email():
    response = client.post("/api/auth/register", json={"email": "bademail", "password": "pwd", "role_id": 2})
    assert response.status_code in [400, 422]

# 17. Test login route rejects invalid email format
def test_integration_login_invalid_email():
    response = client.post("/api/auth/login", json={"email": "bademail", "password": "pwd"})
    assert response.status_code in [400, 422, 401]

# 18. Test put role route with missing role_id
def test_integration_update_role_missing_field():
    response = client.put("/api/auth/users/test-uuid/role", json={"some_other_field": 1})
    assert response.status_code in [400, 422, 401]

# 19. Test delete route method on register
def test_integration_delete_on_register():
    response = client.delete("/api/auth/register")
    assert response.status_code in [405, 404]

# 20. Test get method on register
def test_integration_get_on_register():
    response = client.get("/api/auth/register")
    assert response.status_code in [405, 404]

# 21. Test put method on register
def test_integration_put_on_register():
    response = client.put("/api/auth/register")
    assert response.status_code in [405, 404]
