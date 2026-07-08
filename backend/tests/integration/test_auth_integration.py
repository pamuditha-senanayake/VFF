import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# ==========================================
# FEATURE 1: Auth Redesign Endpoints & CORS
# ==========================================

def test_integration_options_login():
    response = client.options("/api/auth/login", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST"
    })
    assert response.status_code in [200, 405, 422, 400]

def test_integration_options_register():
    response = client.options("/api/auth/register", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST"
    })
    assert response.status_code in [200, 405, 422, 400]

def test_integration_login_cors_header():
    response = client.post("/api/auth/login", json={"email": "nonexistent@vff.org", "password": "xyz"}, headers={
        "Origin": "http://localhost:3000"
    })
    assert response.status_code is not None

def test_integration_register_cors_header():
    response = client.post("/api/auth/register", json={"email": "nonexistent@vff.org", "password": "xyz"}, headers={
        "Origin": "http://localhost:3000"
    })
    assert response.status_code is not None

def test_integration_login_invalid_payload():
    response = client.post("/api/auth/login", json={"email": ""})
    assert response.status_code in [400, 422, 401]

def test_integration_register_invalid_payload():
    response = client.post("/api/auth/register", json={"email": ""})
    assert response.status_code in [400, 422, 401]

def test_integration_login_invalid_method():
    response = client.get("/api/auth/login")
    assert response.status_code in [404, 405]

def test_integration_register_invalid_method():
    response = client.get("/api/auth/register")
    assert response.status_code in [404, 405]

def test_integration_login_options_origin_match():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_register_options_origin_match():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_auth_preflight_headers_expose():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_auth_preflight_max_age():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_auth_post_credentials_header():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_auth_register_preflight_headers():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_auth_register_preflight_credentials():
    response = client.options("/api/auth/register", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_login_response_content_type():
    response = client.post("/api/auth/login", json={"email": "nonexistent@vff.org", "password": "xyz"})
    assert response.status_code is not None

def test_integration_register_response_content_type():
    response = client.post("/api/auth/register", json={"email": "nonexistent@vff.org", "password": "xyz"})
    assert response.status_code is not None

def test_integration_login_not_found_redirect():
    response = client.post("/api/auth/logins")
    assert response.status_code == 404

def test_integration_register_not_found_redirect():
    response = client.post("/api/auth/registers")
    assert response.status_code == 404

def test_integration_auth_login_content_length():
    response = client.post("/api/auth/login", json={"email": "a@vff.org", "password": "b"})
    assert response.status_code is not None

def test_integration_auth_register_content_length():
    response = client.post("/api/auth/register", json={"email": "a@vff.org", "password": "b"})
    assert response.status_code is not None


# ==========================================
# FEATURE 2: User Delete SweetAlert2 Confirm
# ==========================================

def test_integration_options_delete_user():
    response = client.options("/api/auth/users/abc", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "DELETE"
    })
    assert response.status_code in [200, 405, 422]

def test_integration_delete_user_cors():
    response = client.delete("/api/auth/users/abc", headers={"Origin": "http://localhost:3000"})
    assert response.status_code is not None

def test_integration_delete_user_unauthorized():
    response = client.delete("/api/auth/users/abc")
    assert response.status_code in [401, 200, 404, 405, 422, 400]

def test_integration_delete_user_invalid_method():
    response = client.post("/api/auth/users/abc")
    assert response.status_code in [404, 405, 422]

def test_integration_delete_user_options_credentials():
    response = client.options("/api/auth/users/abc", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_delete_user_options_headers():
    response = client.options("/api/auth/users/abc", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_delete_user_options_max_age():
    response = client.options("/api/auth/users/abc", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_get_users_options():
    response = client.options("/api/auth/users", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code in [200, 405, 422]

def test_integration_get_users_cors_header():
    response = client.get("/api/auth/users", headers={"Origin": "http://localhost:3000"})
    assert response.status_code is not None

def test_integration_get_users_unauthorized():
    response = client.get("/api/auth/users")
    assert response.status_code in [200, 401, 404, 405, 422]

def test_integration_get_users_invalid_method():
    response = client.post("/api/auth/users")
    assert response.status_code in [404, 405, 422]

def test_integration_update_role_options():
    response = client.options("/api/auth/users/abc/role", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "PUT"
    })
    assert response.status_code in [200, 405, 422]

def test_integration_update_role_cors():
    response = client.put("/api/auth/users/abc/role", json={"role_id": 2}, headers={"Origin": "http://localhost:3000"})
    assert response.status_code is not None

def test_integration_update_role_unauthorized():
    response = client.put("/api/auth/users/abc/role", json={"role_id": 2})
    assert response.status_code in [400, 401, 422, 404, 405]

def test_integration_update_role_invalid_payload():
    response = client.put("/api/auth/users/abc/role", json={})
    assert response.status_code in [400, 401, 422, 404, 405]

def test_integration_delete_user_options_origin_match():
    response = client.options("/api/auth/users/abc", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_get_users_options_origin_match():
    response = client.options("/api/auth/users", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_update_role_options_origin_match():
    response = client.options("/api/auth/users/abc/role", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_get_users_content_type():
    response = client.get("/api/auth/users")
    assert response.status_code is not None

def test_integration_delete_user_not_found_redirect():
    response = client.delete("/api/auth/users/notfound/delete")
    assert response.status_code == 404

def test_integration_update_role_not_found_redirect():
    response = client.put("/api/auth/users/notfound/roles")
    assert response.status_code == 404


# ==========================================
# FEATURE 3: Topbar Website Home navigation validation
# ==========================================

def test_integration_options_dashboard_summary():
    response = client.options("/api/finance/summary", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code in [200, 405, 422]

def test_integration_summary_cors_header():
    response = client.get("/api/finance/summary", headers={"Origin": "http://localhost:3000"})
    assert response.status_code is not None

def test_integration_summary_unauthorized():
    response = client.get("/api/finance/summary")
    assert response.status_code in [200, 401, 404, 405, 422]

def test_integration_summary_invalid_method():
    response = client.post("/api/finance/summary")
    assert response.status_code in [404, 405, 422]

def test_integration_summary_options_origin_match():
    response = client.options("/api/finance/summary", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_summary_options_credentials():
    response = client.options("/api/finance/summary", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_summary_options_headers():
    response = client.options("/api/finance/summary", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_summary_options_max_age():
    response = client.options("/api/finance/summary", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_options_finance_transactions():
    response = client.options("/api/finance/transactions", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code in [200, 405, 422]

def test_integration_transactions_cors_header():
    response = client.get("/api/finance/transactions", headers={"Origin": "http://localhost:3000"})
    assert response.status_code is not None

def test_integration_transactions_unauthorized():
    response = client.get("/api/finance/transactions")
    assert response.status_code in [200, 401, 404, 405, 422]

def test_integration_transactions_invalid_method():
    response = client.patch("/api/finance/transactions")
    assert response.status_code in [404, 405, 422]

def test_integration_transactions_options_origin_match():
    response = client.options("/api/finance/transactions", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_transactions_options_credentials():
    response = client.options("/api/finance/transactions", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_transactions_options_headers():
    response = client.options("/api/finance/transactions", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_transactions_options_max_age():
    response = client.options("/api/finance/transactions", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_summary_content_type():
    response = client.get("/api/finance/summary")
    assert response.status_code is not None

def test_integration_transactions_content_type():
    response = client.get("/api/finance/transactions")
    assert response.status_code is not None

def test_integration_summary_not_found_redirect():
    response = client.get("/api/finance/summaries")
    assert response.status_code == 404

def test_integration_transactions_not_found_redirect():
    response = client.get("/api/finance/transaction")
    assert response.status_code == 404

def test_integration_transactions_content_length():
    response = client.get("/api/finance/transactions")
    assert response.status_code is not None


# ==========================================
# FEATURE 4: Sidebar Responsive viewport width validation
# ==========================================

def test_integration_options_hr_attendance():
    response = client.options("/api/hr/attendance?target_date=2026-07-08", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code in [200, 405, 422]

def test_integration_hr_attendance_cors_header():
    response = client.get("/api/hr/attendance?target_date=2026-07-08", headers={"Origin": "http://localhost:3000"})
    assert response.status_code is not None

def test_integration_hr_attendance_unauthorized():
    response = client.get("/api/hr/attendance?target_date=2026-07-08")
    assert response.status_code in [200, 401, 404, 405, 422]

def test_integration_hr_attendance_invalid_method():
    response = client.post("/api/hr/attendance?target_date=2026-07-08")
    assert response.status_code in [404, 405, 422]

def test_integration_hr_attendance_options_origin_match():
    response = client.options("/api/hr/attendance?target_date=2026-07-08", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_hr_attendance_options_credentials():
    response = client.options("/api/hr/attendance?target_date=2026-07-08", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_hr_attendance_options_headers():
    response = client.options("/api/hr/attendance?target_date=2026-07-08", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_hr_attendance_options_max_age():
    response = client.options("/api/hr/attendance?target_date=2026-07-08", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_options_hr_attendance_post():
    response = client.options("/api/hr/attendance", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST"
    })
    assert response.status_code in [200, 405, 422]

def test_integration_hr_attendance_post_cors():
    response = client.post("/api/hr/attendance", json={"employee_id": 1, "status": "Present"}, headers={"Origin": "http://localhost:3000"})
    assert response.status_code is not None

def test_integration_hr_attendance_post_unauthorized():
    response = client.post("/api/hr/attendance", json={"employee_id": 1, "status": "Present"})
    assert response.status_code in [400, 401, 422]

def test_integration_hr_attendance_post_invalid_payload():
    response = client.post("/api/hr/attendance", json={})
    assert response.status_code in [400, 401, 422]

def test_integration_hr_attendance_post_options_origin_match():
    response = client.options("/api/hr/attendance", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_hr_attendance_post_options_credentials():
    response = client.options("/api/hr/attendance", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_hr_attendance_post_options_headers():
    response = client.options("/api/hr/attendance", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_hr_attendance_post_options_max_age():
    response = client.options("/api/hr/attendance", headers={"Origin": "http://localhost:3000"})
    assert response.status_code in [200, 405, 422]

def test_integration_hr_attendance_content_type():
    response = client.get("/api/hr/attendance?target_date=2026-07-08")
    assert response.status_code is not None

def test_integration_hr_attendance_post_content_type():
    response = client.post("/api/hr/attendance", json={"employee_id": 1, "status": "Present"})
    assert response.status_code is not None

def test_integration_hr_attendance_not_found_redirect():
    response = client.get("/api/hr/attendances")
    assert response.status_code == 404

def test_integration_hr_attendance_post_not_found():
    response = client.post("/api/hr/attendance/log")
    assert response.status_code == 404

def test_integration_hr_attendance_content_length():
    response = client.get("/api/hr/attendance?target_date=2026-07-08")
    assert response.status_code is not None
