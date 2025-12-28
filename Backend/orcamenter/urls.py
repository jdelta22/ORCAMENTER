from django.urls import path
from django.urls import include
from rest_framework.routers import DefaultRouter
from .views import(
    OrcamentViewSet,
    RegisterUserView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = 'orcamenter'

router = DefaultRouter()
router.register(r'orcaments', OrcamentViewSet, basename='orcament')

RegisterUserRoute = router.register(r'auth/register', RegisterUserView, basename='register')


print( router.urls)
urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

