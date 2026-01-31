from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

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
        user = self.request.user
        user_plan = user.plan.plan
        total = Orcament.objects.filter(owner=user).count()

        if total >= user_plan.max_orcaments:
            raise PermissionDenied("Limite de orçamentos do seu plano atingido")

        serializer.save(owner=user)


class RegisterUserView(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = RegisterUserSerializer
    queryset = User.objects.all()
    http_method_names = ["get", "post"]

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


class InvoiceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.plan.plan.can_emit_invoice:
            raise PermissionDenied("Seu plano não permite emissão de nota fiscal")

        # lógica da nota fiscal
        return Response({"status": "NF emitida"})


class MyPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_plan = request.user.plan.plan
        return Response(
            {
                "code": user_plan.code,
                "name": user_plan.name,
                "price": user_plan.price,
                "max_orcaments": user_plan.max_orcaments,
                "can_emit_invoice": user_plan.can_emit_invoice,
            }
        )


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
