import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_cors_preflight_headers():
    response = client.options(
        "/api/auth/register", 
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST"
        }
    )
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers

def test_app_version_online():
    response = client.get("/")
    assert response.status_code == 200
    assert "online" in response.json()["message"]
