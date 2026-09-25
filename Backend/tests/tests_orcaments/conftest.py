import sys
from unittest.mock import MagicMock

# 1. Cria um módulo falso (mock) para interceptar o WeasyPrint antes que o Django o chame
mock_weasyprint = MagicMock()
mock_weasyprint.HTML = MagicMock()
mock_weasyprint.CSS = MagicMock()

# 2. Injeta o mock no sistema de módulos do Python
sys.modules['weasyprint'] = mock_weasyprint

import pytest

from rest_framework.test import APIClient
from django.contrib.auth.models import User

from orcamenter.models import Material, Service, Client

@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        username="joao",
        email="teste1@example.com",
        password="123456"
    )


@pytest.fixture
def material(user):
    return Material.objects.create(
        owner = user,
        description = "Tijolo bahiano",
        unit_value = 3.50,
        unit_description= "unidade"
    )


@pytest.fixture
def service(user):
    return Service.objects.create(
        owner = user,
        description= "Fazer parede",
        unit_value= "100",
        unit_description= "metro quadrado"
    )


@pytest.fixture
def client(user):
    return Client.objects.create(
        owner = user,
        name = "Cliente de teste",
        email= "emailteste@teste.com.br",
        phone= "(12) 93456-7890",
        document_number= "12345678912"

    )