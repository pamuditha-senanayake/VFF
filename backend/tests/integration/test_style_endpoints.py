import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_style_route_responses():
    response = client.get("/")
    assert response.status_code == 200

def test_api_headers_security():
    response = client.get("/")
    assert response.headers.get("content-type") == "application/json"

def test_static_auth_options():
    response = client.options("/api/auth/login", headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"})
    assert response.status_code == 200
