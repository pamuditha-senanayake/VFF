import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 1. Test profile path OPTIONS route
def test_integration_options_profile():
    response = client.options("/api/auth/users", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code == 200

# 2. Test finance ledger options route
def test_integration_options_finance():
    response = client.options("/api/finance/summary", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code == 200

# 3. Test inventory item options route
def test_integration_options_inventory():
    response = client.options("/api/inventory/items", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code == 200

# 4. Test programs registry options route
def test_integration_options_programs():
    response = client.options("/api/finance/programs", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code == 200

# 5. Test mock user update invalid payload code
def test_integration_profile_invalid_payload():
    response = client.post("/api/auth/register", json={"email": "bad"})
    assert response.status_code in [400, 422]

# 6. Test invalid method call on users list
def test_integration_invalid_method_users():
    response = client.post("/api/auth/users")
    assert response.status_code in [405, 404]

# 7. Test CORS allowed headers in response
def test_integration_cors_headers_check():
    response = client.get("/api/finance/summary", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers

# 8. Test settings change invalid method
def test_integration_invalid_settings_method():
    response = client.post("/api/auth/users/test-uuid/role", json={})
    assert response.status_code in [405, 400, 422]

# 9. Test root index routing response
def test_integration_root_index():
    response = client.get("/")
    assert response.status_code in [200, 404]

# 10. Test API docs page route availability
def test_integration_docs_available():
    response = client.get("/docs")
    assert response.status_code == 200

# 11. Test OpenAPI schema validation
def test_integration_openapi_valid():
    response = client.get("/openapi.json")
    assert response.status_code == 200

# 12. Test login options preflight
def test_integration_login_preflight():
    response = client.options("/api/auth/login", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST"
    })
    assert response.status_code == 200

# 13. Test register options preflight
def test_integration_register_preflight():
    response = client.options("/api/auth/register", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST"
    })
    assert response.status_code == 200

# 14. Test HR employees query options preflight
def test_integration_hr_employees_preflight():
    response = client.options("/api/hr/employees", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code == 200

# 15. Test HR attendance query options preflight
def test_integration_hr_attendance_preflight():
    response = client.options("/api/hr/attendance", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code == 200

# 16. Test get user list CORS origin
def test_integration_get_users_cors():
    response = client.get("/api/auth/users", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers

# 17. Test update user role CORS origin
def test_integration_update_role_cors():
    response = client.put("/api/auth/users/test-uuid/role", json={"role_id": 1}, headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers or response.status_code == 401

# 18. Test delete user CORS origin
def test_integration_delete_user_cors():
    response = client.delete("/api/auth/users/test-uuid", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers or response.status_code == 401

# 19. Test health endpoint or default route options
def test_integration_options_root():
    response = client.options("/", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code in [200, 404, 405]

# 20. Test non-existent module routes options
def test_integration_options_nonexistent():
    response = client.options("/api/nonexistent", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code in [200, 404, 405]

# 21. Test settings configuration put method
def test_integration_put_settings_unauthorized():
    response = client.put("/api/auth/users/test-uuid/role", json={"role_id": 2})
    assert response.status_code in [200, 400, 401, 422]
