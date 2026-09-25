from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import OrcamentMaterial, OrcamentService


@receiver([post_save, post_delete], sender=OrcamentMaterial)
@receiver([post_save, post_delete], sender=OrcamentService)
def update_orcament_total(sender, instance, **kwargs):
    orcament = instance.orcament
    total = orcament.calculate_total() or 0

    if total != orcament.total_value:
        orcament.total_value = total
        orcament.save(update_fields=["total_value"])
