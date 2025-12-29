from .models import Orcament, Client, Material, Service

def migrate_visitor_to_user(visitor_id, user):
    """
    Converte todos os dados criados como visitante
    para um usuário autenticado.
    """

    Orcament.objects.filter(
        visitor_id=visitor_id,
        owner__isnull=True
    ).update(
        owner=user,
        visitor_id=None
    )

    Client.objects.filter(
        visitor_id=visitor_id,
        owner__isnull=True
    ).update(
        owner=user,
        visitor_id=None
    )

    Material.objects.filter(
        visitor_id=visitor_id,
        owner__isnull=True
    ).update(
        owner=user,
        visitor_id=None
    )

    Service.objects.filter(
        visitor_id=visitor_id,
        owner__isnull=True
    ).update(
        owner=user,
        visitor_id=None
    )