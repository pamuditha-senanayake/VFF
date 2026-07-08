import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_integration_root_status():
    response = client.get("/")
    assert response.status_code == 200

def test_integration_content_type():
    response = client.get("/")
    assert "application/json" in response.headers.get("content-type", "")

def test_options_auth_login():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code == 200

def test_options_auth_register():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code == 200

def test_options_finance_transactions():
    response = client.options("/api/finance/transactions", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200

def test_options_finance_summary():
    response = client.options("/api/finance/summary", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200

def test_options_finance_programs():
    response = client.options("/api/finance/programs", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200

def test_options_inventory_items():
    response = client.options("/api/inventory/items", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200

def test_options_inventory_transactions():
    response = client.options("/api/inventory/transactions", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200

def test_options_hr_employees():
    response = client.options("/api/hr/employees", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200

def test_options_hr_attendance():
    response = client.options("/api/hr/attendance", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200

def test_options_hr_payroll():
    response = client.options("/api/hr/payroll", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code == 200

def test_options_admin_users():
    response = client.options("/api/admin/users", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200

def test_cors_preflight_headers_origin():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"

def test_cors_preflight_headers_methods():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.headers.get("access-control-allow-methods") is not None

def test_cors_preflight_headers_credentials():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.headers.get("access-control-allow-credentials") == "true"

def test_options_custom_theme():
    response = client.options("/api/settings/theme", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code in [200, 404]

def test_options_profile_settings():
    response = client.options("/api/profile", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "PUT"})
    assert response.status_code in [200, 404]

def test_options_notifications_settings():
    response = client.options("/api/notifications", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code in [200, 404]

def test_options_support_details():
    response = client.options("/api/support", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code in [200, 404]

def test_options_dashboard_summary():
    response = client.options("/api/dashboard/summary", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"})
    assert response.status_code in [200, 404]

def test_api_version_precheck():
    response = client.get("/")
    data = response.json()
    assert "status" in data or "message" in data
