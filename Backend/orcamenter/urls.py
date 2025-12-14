from django.urls import path
from django.urls import include
from rest_framework.routers import DefaultRouter
from .views import(
    OrcamentViewSet,
)

app_name = 'orcamenter'

router = DefaultRouter()
router.register(r'orcaments', OrcamentViewSet, basename='orcament')

urlpatterns = [
    path('', include(router.urls)),
]

