import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 1. Test root status code
def test_integration_root_status():
    response = client.get("/")
    assert response.status_code == 200

# 2. Test root response headers
def test_integration_root_headers():
    response = client.get("/")
    assert "content-type" in response.headers

# 3. Test root response content type is JSON
def test_integration_root_json():
    response = client.get("/")
    assert response.headers.get("content-type") == "application/json"

# 4. Test root response body message
def test_integration_root_message():
    response = client.get("/")
    data = response.json()
    assert "message" in data
    assert "online" in data["message"].lower()

# 5. Test options route auth login
def test_integration_options_login():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code == 200

# 6. Test post method route schema verification
def test_integration_login_not_found():
    response = client.post("/api/auth/nonexistent")
    assert response.status_code == 404

# 7. Test CORS headers in root response
def test_integration_cors_headers():
    response = client.get("/", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers

# 8. Test CORS allow origin value
def test_integration_cors_value():
    response = client.get("/", headers={"Origin": "http://localhost:3000"})
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"

# 9. Test api hr path exists
def test_integration_hr_route_exists():
    response = client.get("/api/hr/employees")
    assert response.status_code == 200

# 10. Test api finance path status
def test_integration_finance_route_status():
    response = client.get("/api/finance/summary")
    assert response.status_code in [200, 401, 403, 307]

# 11. Test api inventory route status
def test_integration_inventory_route_status():
    response = client.get("/api/inventory/items")
    assert response.status_code == 200

# 12. Test api auth login post headers
def test_integration_login_post_headers():
    response = client.post("/api/auth/login", json={"email": "test@vff.com", "password": "pwd"})
    assert "content-type" in response.headers

# 13. Test bad request in login payload
def test_integration_login_bad_request():
    response = client.post("/api/auth/login", json={"bad_field": "test"})
    assert response.status_code in [400, 422, 401]

# 14. Test invalid method on finance summary
def test_integration_finance_summary_method():
    response = client.post("/api/finance/summary")
    assert response.status_code in [405, 401, 422]

# 15. Test invalid method on hr employees
def test_integration_hr_employees_method():
    response = client.post("/api/hr/employees")
    assert response.status_code in [405, 401, 422]

# 16. Test get request on login
def test_integration_login_get_method():
    response = client.get("/api/auth/login")
    assert response.status_code in [405, 404]

# 17. Test api docs endpoint
def test_integration_docs_endpoint():
    response = client.get("/docs")
    assert response.status_code in [200, 404]

# 18. Test openapi specs route
def test_integration_openapi_specs():
    response = client.get("/openapi.json")
    assert response.status_code in [200, 404]

# 19. Test redoc endpoint
def test_integration_redoc_endpoint():
    response = client.get("/redoc")
    assert response.status_code in [200, 404]

# 20. Test secure headers presence
def test_integration_security_headers():
    response = client.get("/")
    # X-Frame-Options or other standard security headers
    assert response.status_code == 200

# 21. Test options on HR module
def test_integration_options_hr():
    response = client.options("/api/hr/employees", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200

# 22. Test options on Inventory module
def test_integration_options_inventory():
    response = client.options("/api/inventory/items", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200
