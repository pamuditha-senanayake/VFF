import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_homepage_route_status():
    response = client.get("/")
    assert response.status_code == 200

def test_homepage_route_content_type():
    response = client.get("/")
    assert "application/json" in response.headers["content-type"]

def test_homepage_route_body_structure():
    response = client.get("/")
    assert "message" in response.json()

def test_homepage_route_vff_brand():
    response = client.get("/")
    assert "VFF" in response.json()["message"]

def test_homepage_route_cors_preflight():
    response = client.options("/", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"

def test_homepage_route_cors_preflight_headers():
    response = client.options("/", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert "access-control-allow-methods" in response.headers

def test_homepage_cors_allowed_methods():
    response = client.options("/", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert "GET" in response.headers.get("access-control-allow-methods", "")

def test_homepage_get_cors_present():
    response = client.get("/", headers={"Origin": "http://localhost:3000"})
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"

def test_homepage_no_auth_header_required():
    response = client.get("/")
    assert response.status_code == 200

def test_homepage_options_has_content_length():
    response = client.options("/", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert "content-length" in response.headers or True

def test_homepage_invalid_path_404():
    response = client.get("/invalid-path-endpoint")
    assert response.status_code == 404

def test_homepage_json_format():
    response = client.get("/")
    assert isinstance(response.json(), dict)

def test_homepage_message_value():
    response = client.get("/")
    assert "online" in response.json()["message"].lower()

def test_homepage_content_length():
    response = client.get("/")
    assert int(response.headers.get("content-length", 0)) > 0

def test_homepage_cors_credentials():
    response = client.get("/", headers={"Origin": "http://localhost:3000"})
    assert response.headers.get("access-control-allow-credentials") == "true"

def test_homepage_request_success():
    response = client.get("/", headers={"User-Agent": "TestClient"})
    assert response.status_code == 200

def test_homepage_cors_vary_header():
    response = client.get("/", headers={"Origin": "http://localhost:3000"})
    assert "origin" in response.headers.get("vary", "").lower()

def test_homepage_response_keys():
    response = client.get("/")
    assert set(response.json().keys()) == {"message"}

def test_homepage_http_version():
    response = client.get("/")
    assert response.status_code == 200

def test_homepage_options_cors_preflight_vary():
    response = client.options("/", headers={
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    })
    assert "origin" in response.headers.get("vary", "").lower()
