from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from weasyprint import HTML

from .models import Orcament
from .serializers import *


# Create your views here.
class OrcamentViewSet(ModelViewSet):
    serializer_class = OrcamentReadSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return OrcamentWriteSerializer
        return OrcamentReadSerializer

    def get_queryset(self):
        return Orcament.objects.filter(owner=self.request.user).order_by("created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class RegisterUserView(ModelViewSet):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = RegisterUserSerializer
    queryset = User.objects.all()
    http_method_names = ["post"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "User registered successfully."}, status=status.HTTP_201_CREATED
        )


class MaterialViewSet(ModelViewSet):
    serializer_class = MaterialSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Material.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ServiceViewSet(ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Service.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ClientViewSet(ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Client.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class OrcamentMaterialViewSet(ModelViewSet):
    serializer_class = OrcamentMaterialCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return OrcamentMaterial.objects.filter(orcament__owner=user)

    def perform_create(self, serializer):
        orcament = serializer.validated_data["orcament"]

        if orcament.owner != self.request.user:
            raise PermissionDenied("Você não pode alterar este orçamento")

        serializer.save()
        orcament.calculate_total()


class OrcamentServiceViewSet(ModelViewSet):
    serializer_class = OrcamentServiceCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return OrcamentService.objects.filter(orcament__owner=user)

    def perform_create(self, serializer):
        orcament = serializer.validated_data["orcament"]

        if orcament.owner != self.request.user:
            raise PermissionDenied("Você não pode alterar este orçamento")

        serializer.save()
        orcament.calculate_total()


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def orcament_pdf(request, orcament_id):
    orcament = get_object_or_404(Orcament, id=orcament_id, owner=request.user)

    html_string = render_to_string(
        "orcamentos/orcamento_pdf.html", {"orcament": orcament}
    )

    pdf = HTML(string=html_string).write_pdf()

    response = HttpResponse(pdf, content_type="application/pdf")
    response["Content-Disposition"] = f'inline; filename="orcamento_{orcament.id}.pdf"'
    return response
