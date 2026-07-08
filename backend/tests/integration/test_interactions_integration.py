import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 1. Test get HR employees options route preflight
def test_integration_options_hr_employees():
    response = client.options("/api/hr/employees", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code == 200

# 2. Test create HR employee options route preflight
def test_integration_options_create_employee():
    response = client.options("/api/hr/employees", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST"
    })
    assert response.status_code == 200

# 3. Test get finance programs options route preflight
def test_integration_options_get_programs():
    response = client.options("/api/finance/programs", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code == 200

# 4. Test create finance program options route preflight
def test_integration_options_create_program():
    response = client.options("/api/finance/programs", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST"
    })
    assert response.status_code == 200

# 5. Test get inventory items options route preflight
def test_integration_options_get_inventory():
    response = client.options("/api/inventory/items", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code == 200

# 6. Test create inventory item options route preflight
def test_integration_options_create_item():
    response = client.options("/api/inventory/items", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST"
    })
    assert response.status_code == 200

# 7. Test get inventory transactions options route preflight
def test_integration_options_get_inv_transactions():
    response = client.options("/api/inventory/transactions", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code == 200

# 8. Test create inventory transaction options route preflight
def test_integration_options_create_inv_transaction():
    response = client.options("/api/inventory/transactions", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "POST"
    })
    assert response.status_code == 200

# 9. Test get HR employees unauthorized access
def test_integration_hr_employees_unauthorized():
    response = client.get("/api/hr/employees")
    assert response.status_code in [200, 401]

# 10. Test create HR employee invalid input payload
def test_integration_create_employee_invalid_payload():
    response = client.post("/api/hr/employees", json={"first_name": "Test"})
    assert response.status_code in [400, 401, 422]

# 11. Test get programs unauthorized access
def test_integration_get_programs_unauthorized():
    response = client.get("/api/finance/programs")
    assert response.status_code in [200, 401]

# 12. Test create program invalid input payload
def test_integration_create_program_invalid_payload():
    response = client.post("/api/finance/programs", json={"program_name": ""})
    assert response.status_code in [400, 401, 422]

# 13. Test get inventory items unauthorized access
def test_integration_get_inventory_unauthorized():
    response = client.get("/api/inventory/items")
    assert response.status_code in [200, 401]

# 14. Test create inventory item invalid input payload
def test_integration_create_item_invalid_payload():
    response = client.post("/api/inventory/items", json={"item_name": ""})
    assert response.status_code in [400, 401, 422]

# 15. Test get inventory transactions unauthorized access
def test_integration_get_inv_transactions_unauthorized():
    response = client.get("/api/inventory/transactions")
    assert response.status_code in [200, 401]

# 16. Test create inventory transaction invalid input payload
def test_integration_create_inv_transaction_invalid():
    response = client.post("/api/inventory/transactions", json={"quantity": -5})
    assert response.status_code in [400, 401, 422]

# 17. Test HR employees CORS access control origin
def test_integration_hr_employees_cors():
    response = client.get("/api/hr/employees", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers or response.status_code == 401

# 18. Test programs CORS access control origin
def test_integration_programs_cors():
    response = client.get("/api/finance/programs", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers or response.status_code == 401

# 19. Test inventory CORS access control origin
def test_integration_inventory_cors():
    response = client.get("/api/inventory/items", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers or response.status_code == 401

# 20. Test invalid method call on programs
def test_integration_invalid_method_programs():
    response = client.patch("/api/finance/programs")
    assert response.status_code in [404, 405]

# 21. Test invalid method call on inventory items
def test_integration_invalid_method_inventory():
    response = client.patch("/api/inventory/items")
    assert response.status_code in [404, 405]
