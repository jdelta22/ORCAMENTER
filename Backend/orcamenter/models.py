import uuid

from django.conf import settings
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify


class BaseOwnedModel(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True, related_name="orcaments"
    )

    class Meta:
        abstract = True


class Material(BaseOwnedModel):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True, related_name="materials"
    )
    description = models.TextField()
    unit_value = models.DecimalField(max_digits=20, decimal_places=2)
    unit_description = models.CharField(max_length=20, default="")

    def __str__(self):
        return self.description[:50]


class Service(BaseOwnedModel):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True, related_name="services"
    )
    description = models.TextField()
    unit_value = models.DecimalField(max_digits=20, decimal_places=2)
    unit_description = models.CharField(max_length=20, default="serviço")

    def __str__(self):
        return f"{self.description} ({self.unit_description})"


class Client(BaseOwnedModel):
    CPF = "CPF"
    CNPJ = "CNPJ"

    DOCUMENT_TYPE_CHOICES = [
        (CPF, "Pessoa Física"),
        (CNPJ, "Pessoa Jurídica"),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    document_type = models.CharField(max_length=4, choices=DOCUMENT_TYPE_CHOICES)
    document_number = models.CharField(max_length=14, unique=True)

    def __str__(self):
        return f"{self.name} ({self.document_number})"

    def clean(self):
        if self.document_type == self.CPF and len(self.document_number) != 11:
            raise ValidationError("CPF deve conter 11 dígitos")

        if self.document_type == self.CNPJ and len(self.document_number) != 14:
            raise ValidationError("CNPJ deve conter 14 dígitos")


class Orcament(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True, related_name="orcamentss"
    )
    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)

    client = models.ForeignKey(Client, on_delete=models.CASCADE)

    total_value = models.DecimalField(max_digits=20, decimal_places=2, default=0)

    materials = models.ManyToManyField(
        Material, through="OrcamentMaterial", related_name="orcamentos"
    )

    services = models.ManyToManyField(
        Service, through="OrcamentService", related_name="orcamentos"
    )

    def calculate_total(self):
        material_total = sum(item.total_value for item in self.material_items.all())
        service_total = sum(item.total_value for item in self.service_items.all())
        self.total_value = material_total + service_total
        self.save(update_fields=["total_value"])

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title) or "orcamento"
            self.slug = f"{base}-{uuid.uuid4().hex[:8]}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class OrcamentMaterial(models.Model):
    orcament = models.ForeignKey(
        Orcament, on_delete=models.CASCADE, related_name="material_items"
    )
    material = models.ForeignKey(Material, on_delete=models.CASCADE)

    quantity = models.PositiveIntegerField(default=1)
    unit_value = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True
    )
    total_value = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if self.unit_value is None:
            self.unit_value = self.material.unit_value

        self.total_value = self.unit_value * self.quantity
        super().save(*args, **kwargs)


class OrcamentService(models.Model):
    orcament = models.ForeignKey(
        "Orcament", on_delete=models.CASCADE, related_name="service_items"
    )
    service = models.ForeignKey(Service, on_delete=models.CASCADE)

    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Quantidade em m², horas, etc.",
    )

    unit_value = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True
    )
    total_value = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if self.unit_value is None:
            self.unit_value = self.service.unit_value

        self.total_value = self.unit_value * self.quantity
        super().save(*args, **kwargs)


class Plan(models.Model):
    FREE = "free"
    PREMIUM = "premium"

    PLAN_CHOICES = (
        (FREE, "Grátis"),
        (PREMIUM, "Premium"),
    )

    code = models.CharField(
        max_length=20,
        choices=PLAN_CHOICES,
        unique=True,
        default=FREE,
    )

    name = models.CharField(max_length=50)

    max_orcaments = models.PositiveIntegerField()
    can_emit_invoice = models.BooleanField(default=False)

    price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0,
    )

    def __str__(self):
        return self.name


class UserPlan(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="plan",
    )
    plan = models.ForeignKey(
        Plan,
        on_delete=models.PROTECT,
    )
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.plan.name}"


class Subscription(models.Model):
    MONTHLY = "monthly"
    YEARLY = "yearly"

    CYCLE_CHOICES = (
        (MONTHLY, "Mensal"),
        (YEARLY, "Anual"),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)
    cycle = models.CharField(max_length=10, choices=CYCLE_CHOICES)

    price = models.DecimalField(max_digits=8, decimal_places=2)
    active = models.BooleanField(default=True)

    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
