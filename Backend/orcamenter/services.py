from datetime import timedelta

from django.utils import timezone

from .models import Plan, Subscription


def activate_subscription(user, cycle):
    plan = Plan.objects.get(code="premium")

    if cycle == Subscription.MONTHLY:
        duration = 30
        price = 29.90
    else:
        duration = 365
        price = 299.00

    Subscription.objects.update_or_create(
        user=user,
        defaults={
            "plan": plan,
            "cycle": cycle,
            "price": price,
            "started_at": timezone.now(),
            "expires_at": timezone.now() + timedelta(days=duration),
            "active": True,
        },
    )
