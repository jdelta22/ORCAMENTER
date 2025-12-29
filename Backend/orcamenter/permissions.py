from rest_framework.permissions import BasePermission

class IsOwnerOrVisitor(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated:
            return obj.owner == request.user
        return (
            obj.visitor_id
            and obj.visitor_id == request.COOKIES.get('visitor_id')
        )