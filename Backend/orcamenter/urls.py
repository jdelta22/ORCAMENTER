from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from .views import (
    ClientViewSet,
    MaterialViewSet,
    OrcamentMaterialViewSet,
    OrcamentServiceViewSet,
    OrcamentViewSet,
    RegisterUserView,
    ServiceViewSet,
    orcament_pdf,
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
router.register(
    r"orcament-services",
    OrcamentServiceViewSet,
    basename="orcament-services",
)
router.register(r"services", ServiceViewSet, basename="service")
router.register(r"clients", ClientViewSet, basename="client")
router.register(r"register", RegisterUserView, basename="register")


urlpatterns = [
    path("api/", include(router.urls)),
    path("api/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/orcaments/<int:orcament_id>/pdf/", orcament_pdf, name="orcament_pdf"),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='orcamenter:schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='orcamenter:schema'), name='redoc'),
]

