import uuid

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import Orcament
from .permissions import IsOwnerOrVisitor
from .serializers import *  # noqa

MAX_ANON_ORCAMENTS = 5


# Create your views here.
class OrcamentViewSet(ModelViewSet):
    queryset = Orcament.objects.all()

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return OrcamentWriteSerializer
        return OrcamentReadSerializer

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated:
            return Orcament.objects.filter(owner=user).order_by("created_at")

        visitor_id = self.request.COOKIES.get("visitor_id")
        if visitor_id:
            return Orcament.objects.filter(visitor_id=visitor_id).order_by("created_at")

        return Orcament.objects.none().order_by("created_at")

    def perform_create(self, serializer):
        user = self.request.user

        if user.is_authenticated:
            user_plan = user.plan.plan
            total = Orcament.objects.filter(owner=user).count()

            if total >= user_plan.max_orcaments:
                raise PermissionDenied("Limite de orçamentos do seu plano atingido")

            serializer.save(owner=user)
            return

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if not request.user.is_authenticated:
            if not request.COOKIES.get("visitor_id"):
                response.set_cookie(
                    "visitor_id",
                    self._visitor_id,
                    max_age=60 * 60 * 24 * 30,
                    httponly=True,
                    samesite="Lax",
                )

        return response

    def get_object(self):
        obj = super().get_object()
        self.check_object_permissions(self.request, obj)
        return obj


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

    def perform_create(self, serializer):
        user = serializer.save()

        request = self.request
        visitor_id = request.COOKIES.get("visitor_id")

        if visitor_id:
            self._migrate_visitor_data(visitor_id, user)


class MaterialViewSet(ModelViewSet):
    serializer_class = MaterialSerializer
    permission_classes = [IsOwnerOrVisitor]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated:
            return Material.objects.filter(owner=user)

        visitor_id = self.request.COOKIES.get("visitor_id")
        if visitor_id:
            return Material.objects.filter(visitor_id=visitor_id)

        return Material.objects.none()

    def perform_create(self, serializer):
        request = self.request

        if request.user.is_authenticated:
            serializer.save(owner=request.user)
            return

        visitor_id = request.COOKIES.get("visitor_id")

        if visitor_id:
            count = Material.objects.filter(visitor_id=visitor_id).count()
            if count >= MAX_ANON_OBJECTS:
                raise PermissionDenied("Limite de materiais atingido")
        else:
            visitor_id = uuid.uuid4()

        serializer.save(visitor_id=visitor_id)
        self._visitor_id = str(visitor_id)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if not request.user.is_authenticated:
            if not request.COOKIES.get("visitor_id"):
                response.set_cookie(
                    "visitor_id",
                    self._visitor_id,
                    max_age=60 * 60 * 24 * 30,
                    httponly=True,
                    samesite="Lax",
                )
        return response


class ServiceViewSet(ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [IsOwnerOrVisitor]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated:
            return Service.objects.filter(owner=user)

        visitor_id = self.request.COOKIES.get("visitor_id")
        if visitor_id:
            return Service.objects.filter(visitor_id=visitor_id)

        return Service.objects.none()

    def perform_create(self, serializer):
        request = self.request

        if request.user.is_authenticated:
            serializer.save(owner=request.user)
            return

        visitor_id = request.COOKIES.get("visitor_id") or uuid.uuid4()
        serializer.save(visitor_id=visitor_id)
        self._visitor_id = str(visitor_id)


class ClientViewSet(ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [IsOwnerOrVisitor]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated:
            return Client.objects.filter(owner=user)

        visitor_id = self.request.COOKIES.get("visitor_id")
        if visitor_id:
            return Client.objects.filter(visitor_id=visitor_id)

        return Client.objects.none()

    def perform_create(self, serializer):
        request = self.request

        if request.user.is_authenticated:
            serializer.save(owner=request.user)
            return

        visitor_id = request.COOKIES.get("visitor_id") or uuid.uuid4()
        serializer.save(visitor_id=visitor_id)
        self._visitor_id = str(visitor_id)


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
        plan = request.user.plan.plan
        return Response(PlanSerializer(plan).data)


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
