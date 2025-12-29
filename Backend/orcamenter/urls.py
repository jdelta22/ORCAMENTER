from django.urls import path
from django.urls import include
from rest_framework.routers import DefaultRouter
from .views import(
    OrcamentViewSet,
    RegisterUserView,
    MaterialViewSet,
    ServiceViewSet,
    ClientViewSet,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = 'orcamenter'


router = DefaultRouter()
router.register(r'orcaments', OrcamentViewSet, basename='orcament')
router.register(r'materials', MaterialViewSet, basename='material')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'auth/register', RegisterUserView, basename='register')



urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

