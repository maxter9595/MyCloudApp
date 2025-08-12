import os

from celery import Celery


os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'mycloud.settings.local'
)

app = Celery('mycloud')
app.config_from_object(
    'django.conf:settings',
    namespace='CELERY'
)

app.autodiscover_tasks(['apps.storage'])
app.conf.beat_schedule = {
    'cleanup-files': {
        'task': 'storage.tasks.cleanup_files_task',
        'schedule': 60.0,
        'options': {
            'expires': 30.0
        }
    },
}

app.conf.timezone = 'Europe/Moscow'
