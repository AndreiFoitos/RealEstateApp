import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch

from app.main import app

client = TestClient(app)


FAKE_PROPERTY = {
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "Test Apartment",
    "address": "Grote Markt 1, Groningen",
    "type": "apartment",
    "floor_area_m2": 85.0,
    "year_of_construction": 2000,
    "number_of_inhabitants": 2,
    "ceiling_height_m": 2.5,
    "created_at": "2025-01-01T00:00:00",
}

FAKE_ENERGY = [
    {"date": "2025-01-01", "kwh": 12.5},
    {"date": "2025-01-02", "kwh": 11.8},
]


def make_supabase_mock(data=None, single=False):
    """
    Builds a mock that mimics the Supabase client's chained call pattern:
    supabase.table("x").select("*").eq("id", y).execute()
    Every method returns the same mock so chaining works.
    """
    mock = MagicMock()
    execute_result = MagicMock()
    execute_result.data = data if data is not None else []

    mock.table.return_value = mock
    mock.select.return_value = mock
    mock.insert.return_value = mock
    mock.update.return_value = mock
    mock.delete.return_value = mock
    mock.eq.return_value = mock
    mock.order.return_value = mock
    mock.single.return_value = mock
    mock.execute.return_value = execute_result

    return mock


def test_list_properties_returns_200():
    mock = make_supabase_mock(data=[FAKE_PROPERTY])
    with patch("app.routes.properties.supabase", mock):
        response = client.get("/properties")
    assert response.status_code == 200


def test_list_properties_returns_list():
    mock = make_supabase_mock(data=[FAKE_PROPERTY])
    with patch("app.routes.properties.supabase", mock):
        response = client.get("/properties")
    assert isinstance(response.json(), list)
    assert len(response.json()) == 1


def test_get_property_returns_200():
    mock = make_supabase_mock(data=FAKE_PROPERTY)
    with patch("app.routes.properties.supabase", mock):
        response = client.get(f"/properties/{FAKE_PROPERTY['id']}")
    assert response.status_code == 200


def test_get_property_returns_404_when_not_found():
    mock = make_supabase_mock(data=None)
    with patch("app.routes.properties.supabase", mock):
        response = client.get(f"/properties/{FAKE_PROPERTY['id']}")
    assert response.status_code == 404

VALID_PAYLOAD = {
    "name": "Test Apartment",
    "address": "Grote Markt 1, Groningen",
    "type": "apartment",
    "floor_area_m2": 85.0,
    "year_of_construction": 2000,
    "number_of_inhabitants": 2,
    "ceiling_height_m": 2.5,
}

def test_create_property_returns_201():
    mock = make_supabase_mock(data=[FAKE_PROPERTY])
    with patch("app.routes.properties.supabase", mock):
        response = client.post("/properties", json=VALID_PAYLOAD)
    assert response.status_code == 201


def test_create_property_rejects_negative_floor_area():
    payload = {**VALID_PAYLOAD, "floor_area_m2": -10}
    response = client.post("/properties", json=payload)
    assert response.status_code == 422


def test_create_property_rejects_missing_name():
    payload = {k: v for k, v in VALID_PAYLOAD.items() if k != "name"}
    response = client.post("/properties", json=payload)
    assert response.status_code == 422


def test_create_property_rejects_invalid_year():
    payload = {**VALID_PAYLOAD, "year_of_construction": 1700}
    response = client.post("/properties", json=payload)
    assert response.status_code == 422


def test_delete_property_returns_200():
    mock = make_supabase_mock(data=[FAKE_PROPERTY])
    with patch("app.routes.properties.supabase", mock):
        response = client.delete(f"/properties/{FAKE_PROPERTY['id']}")
    assert response.status_code == 200


def test_get_energy_returns_200():
    mock = make_supabase_mock(data=FAKE_ENERGY)
    with patch("app.routes.properties.supabase", mock):
        response = client.get(f"/properties/{FAKE_PROPERTY['id']}/energy")
    assert response.status_code == 200


def test_get_energy_response_shape():
    mock = make_supabase_mock(data=FAKE_ENERGY)
    with patch("app.routes.properties.supabase", mock):
        response = client.get(f"/properties/{FAKE_PROPERTY['id']}/energy")
    body = response.json()
    assert "property_id" in body
    assert "readings" in body
    assert len(body["readings"]) == 2
    assert "date" in body["readings"][0]
    assert "kwh" in body["readings"][0]