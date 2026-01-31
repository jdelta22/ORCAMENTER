from django.contrib.auth.models import User
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import OrcamentMaterial, OrcamentService, Plan, UserPlan


@receiver([post_save, post_delete], sender=OrcamentMaterial)
@receiver([post_save, post_delete], sender=OrcamentService)
def update_orcament_total(sender, instance, **kwargs):
    orcament = instance.orcament
    total = orcament.calculate_total()

    if total != orcament.total_value:
        orcament.total_value = total
        orcament.save(update_fields=["total_value"])


@receiver(post_save, sender=User)
def create_user_plan(sender, instance, created, **kwargs):
    if not created:
        return

    free_plan = Plan.objects.get(code=Plan.FREE)

    UserPlan.objects.create(
        user=instance,
        plan=free_plan,
    )
