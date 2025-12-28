from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
import uuid
from .serializers import *
from .models import Orcament
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

MAX_ANON_ORCAMENTS = 1

# Create your views here.
class OrcamentViewSet(ModelViewSet):
    queryset = Orcament.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return OrcamentWriteSerializer
        return OrcamentReadSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated:
            return Orcament.objects.filter(owner=user)

        visitor_id = self.request.COOKIES.get('visitor_id')
        if visitor_id:
            return Orcament.objects.filter(visitor_id=visitor_id)

        return Orcament.objects.none()

    def perform_create(self, serializer):
        request = self.request

        if request.user.is_authenticated:
            serializer.save(owner=request.user)
            return

        visitor_id = request.COOKIES.get('visitor_id')

        if visitor_id:
            count = Orcament.objects.filter(visitor_id=visitor_id).count()
            if count >= MAX_ANON_ORCAMENTS:
                raise PermissionDenied(
                    'Limite de orçamentos gratuitos atingido'
                )
        else:
            visitor_id = uuid.uuid4()

        serializer.save(visitor_id=visitor_id)
        self._visitor_id = str(visitor_id)  # guarda para o create()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if not request.user.is_authenticated:
            if not request.COOKIES.get('visitor_id'):
                response.set_cookie(
                    'visitor_id',
                    self._visitor_id,
                    max_age=60 * 60 * 24 * 30,
                    httponly=True,
                    samesite='Lax'
                )

        return response

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj



