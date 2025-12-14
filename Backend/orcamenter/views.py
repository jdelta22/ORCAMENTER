from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .serializers import *
from .models import Orcament


# Create your views here.
class OrcamentViewSet(ModelViewSet):
    queryset = Orcament.objects.all()

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return OrcamentReadSerializer
        return OrcamentWriteSerializer
