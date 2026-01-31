from django.utils import timezone
from rest_framework.permissions import BasePermission


class IsPremiumUser(BasePermission):
    message = "Este recurso é exclusivo para usuários premium"

    def has_permission(self, request, view):
        sub = getattr(request.user, "subscription", None)

        if not sub:
            return False

        return sub.active and sub.expires_at > timezone.now()
