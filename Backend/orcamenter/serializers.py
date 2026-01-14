from django.contrib.auth.models import User
from rest_framework import serializers

from .models import (
    Client,
    Material,
    Orcament,
    OrcamentMaterial,
    OrcamentService,
    Plan,
    Service,
)


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = (
            "id",
            "description",
            "unit_description",
            "unit_value",
        )


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = (
            "id",
            "description",
            "unit_description",
            "unit_value",
        )


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = (
            "id",
            "name",
            "email",
            "phone",
            "document_type",
            "document_number",
        )


class OrcamentMaterialSerializer(serializers.ModelSerializer):
    total_value = serializers.SerializerMethodField()
    material_detail = MaterialSerializer(source="material", read_only=True)

    class Meta:
        model = OrcamentMaterial
        fields = (
            "id",
            "material",
            "material_detail",
            "quantity",
            "unit_value",
            "total_value",
        )

    def get_total_value(self, obj):
        return obj.quantity * obj.unit_value


class OrcamentServiceSerializer(serializers.ModelSerializer):
    total_value = serializers.SerializerMethodField()
    service_detail = ServiceSerializer(source="service", read_only=True)

    class Meta:
        model = OrcamentService
        fields = (
            "id",
            "service",
            "service_detail",
            "quantity",
            "unit_value",
            "total_value",
        )

    def get_total_value(self, obj):
        return obj.quantity * obj.unit_value


class OrcamentReadSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    materials = OrcamentMaterialSerializer(
        source="material_items", many=True, read_only=True
    )
    services = OrcamentServiceSerializer(
        source="service_items", many=True, read_only=True
    )

    class Meta:
        model = Orcament
        fields = (
            "id",
            "title",
            "slug",
            "created_at",
            "description",
            "client",
            "materials",
            "services",
            "total_value",
        )


class OrcamentMaterialWriteSerializer(serializers.Serializer):
    material = serializers.PrimaryKeyRelatedField(queryset=Material.objects.all())
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    unit_value = serializers.DecimalField(max_digits=10, decimal_places=2)


class OrcamentServiceWriteSerializer(serializers.Serializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    unit_value = serializers.DecimalField(max_digits=10, decimal_places=2)


class OrcamentWriteSerializer(serializers.ModelSerializer):
    materials = OrcamentMaterialWriteSerializer(
        source="material_items", many=True, write_only=True
    )
    services = OrcamentServiceWriteSerializer(
        source="service_items", many=True, write_only=True
    )

    class Meta:
        model = Orcament
        fields = (
            "title",
            "description",
            "client",
            "materials",
            "services",
        )

    def create(self, validated_data):
        materials = validated_data.pop("material_items", [])
        services = validated_data.pop("service_items", [])

        orcament = Orcament.objects.create(**validated_data)

        for material in materials:
            OrcamentMaterial.objects.create(orcament=orcament, **material)

        for service in services:
            OrcamentService.objects.create(orcament=orcament, **service)

        orcament.calculate_total()
        return orcament

    def update(self, instance, validated_data):
        materials = validated_data.pop("materials", None)
        services = validated_data.pop("services", None)

        instance = super().update(instance, validated_data)

        if materials is not None:
            instance.material_items.all().delete()
            for item in materials:
                OrcamentMaterial.objects.create(orcament=instance, **item)

        if services is not None:
            instance.service_items.all().delete()
            for item in services:
                OrcamentService.objects.create(orcament=instance, **item)

        instance.calculate_total()
        return instance


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = (
            "name",
            "max_orcaments",
            "can_emit_invoice",
            "price",
        )


class OrcamentMaterialCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrcamentMaterial
        fields = (
            "id",
            "orcament",
            "material",
            "quantity",
            "unit_value",
        )


class OrcamentServiceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrcamentService
        fields = (
            "id",
            "orcament",
            "service",
            "quantity",
            "unit_value",
        )
