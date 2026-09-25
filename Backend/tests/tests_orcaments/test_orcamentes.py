import pytest

@pytest.mark.django_db
def test_api_client_auth(api_client, user):
    api_client.force_authenticate(user=user)

    response = api_client.get("/api/materials/")

    assert response.status_code == 200