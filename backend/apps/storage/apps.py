from django.apps import AppConfig


class StorageConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.storage'
    verbose_name = 'File storage'

    def ready(self):
        from . import tasks
        super().ready()
