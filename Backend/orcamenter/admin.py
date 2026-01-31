from django.contrib import admin

from .models import (
    Client,
    Material,
    Orcament,
    OrcamentMaterial,
    OrcamentService,
    Plan,
    Service,
    Subscription,
)


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ("description", "unit_value", "unit_description")
    search_fields = ("description",)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "description",
        "unit_value",
        "unit_description",
        "price_per_unit",
    )
    search_fields = ("description",)

    def price_per_unit(self, obj):
        return f"R$ {obj.unit_value} / {obj.unit_description}"

    price_per_unit.short_description = "Preço"


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "document_type",
        "document_number",
        "email",
        "phone",
    )
    search_fields = ("name", "document_number")
    list_filter = ("document_type",)


class OrcamentMaterialInline(admin.TabularInline):
    model = OrcamentMaterial
    extra = 1


class OrcamentServiceInline(admin.TabularInline):
    model = OrcamentService
    extra = 1

    fields = (
        "service",
        "quantity",
        "unit_value",
        "total_display",
    )

    readonly_fields = ("total_display",)

    def total_display(self, obj):
        if obj.pk:
            return f"R$ {obj.total_value}"
        return "-"

    total_display.short_description = "Subtotal"


@admin.register(Orcament)
class OrcamentAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "client",
        "total_value",
        "created_at",
    )

    inlines = [
        OrcamentMaterialInline,
        OrcamentServiceInline,
    ]

    readonly_fields = ("total_value", "slug", "created_at")


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "can_emit_invoice")
    search_fields = ("name",)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user", "plan", "started_at", "expires_at")
    search_fields = ("user__username", "plan__name")
    list_filter = ("plan",)
