from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    ClientViewSet,
    MaterialViewSet,
    OrcamentMaterialViewSet,
    OrcamentViewSet,
    RegisterUserView,
    ServiceViewSet,
)

app_name = "orcamenter"


router = DefaultRouter()
router.register(r"orcaments", OrcamentViewSet, basename="orcament")
router.register(r"materials", MaterialViewSet, basename="material")
router.register(
    r"orcament-materials",
    OrcamentMaterialViewSet,
    basename="orcament-materials",
)
router.register(r"services", ServiceViewSet, basename="service")
router.register(r"clients", ClientViewSet, basename="client")
router.register(r"auth/register", RegisterUserView, basename="register")


urlpatterns = [
    path("api/", include(router.urls)),
    path("api/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
