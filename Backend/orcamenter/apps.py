from django.apps import AppConfig


class OrcamenterConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'orcamenter'

    def ready(self):
        import orcamenter.signals