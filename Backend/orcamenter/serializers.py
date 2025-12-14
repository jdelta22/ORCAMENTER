from rest_framework import serializers
from .models import Orcament, Material, Service, Client, OrcamentMaterial, OrcamentService

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = (
            'id',
            'description',
            'unit_value',
            'unit_description',
        )


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = (
            'id',
            'description',
            'unit_value',
            'unit_description',
        )


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = (
            'id',
            'name',
            'email',
            'phone',
            'document_type',
            'document_number',
        )


class OrcamentMaterialSerializer(serializers.ModelSerializer):
    total_value = serializers.ReadOnlyField()

    material_detail = MaterialSerializer(
        source='material',
        read_only=True
    )

    class Meta:
        model = OrcamentMaterial
        fields = (
            'id',
            'material',
            'material_detail',
            'quantity',
            'unit_value',
            'total_value',
        )


class OrcamentServiceSerializer(serializers.ModelSerializer):
    total_value = serializers.ReadOnlyField()

    service_detail = ServiceSerializer(
        source='service',
        read_only=True
    )

    class Meta:
        model = OrcamentService
        fields = (
            'id',
            'service',
            'service_detail',
            'quantity',
            'unit_value',
            'total_value',
        )


class OrcamentReadSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)

    materials = OrcamentMaterialSerializer(
        source='material_items',
        many=True,
        read_only=True
    )
    services = OrcamentServiceSerializer(
        source='service_items',
        many=True,
        read_only=True
    )

    class Meta:
        model = Orcament
        fields = (
            'id',
            'title',
            'slug',
            'created_at',
            'description',
            'client',
            'materials',
            'services',
            'total_value',
        )


class OrcamentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orcament
        fields = (
            'title',
            'description',
            'client',
        )
        



