import os
from pathlib import Path

import environ

## ======================== ##
## 1. Environment variables ##
## ======================== ##
env = environ.Env(
    SECRET_KEY=(str, 'dummy-key-for-dev-only!change-me!'),
    ALLOWED_HOSTS=(list, ['127.0.0.1', 'localhost']),
    DB_NAME=(str, 'postgres'),
    DB_USER=(str, 'postgres'),
    DB_PASSWORD=(str, 'postgres'),
    DB_HOST=(str, 'localhost'),
    DB_PORT=(int, 5432),
    CORS_ALLOWED_ORIGINS=(list, ['http://localhost:3000']),
    CSRF_TRUSTED_ORIGINS=(list, ['http://localhost:3000']),
    REDIS_URL=(str, 'redis://localhost:6379/0'),
    REDIS_CACHE_URL=(str, 'redis://localhost:6379/1'),
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env.read_env(
    os.path.join(BASE_DIR, '.env'),
    overwrite=True
)


## ================= ##
## 2. Basic settings ##
## ================= ##
SECRET_KEY = env('SECRET_KEY')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')

ROOT_URLCONF = 'mycloud.urls'
WSGI_APPLICATION = 'mycloud.wsgi.application'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'accounts.CustomUser'


## ================= ##
## 3. Installed Apps ##
## ================= ##
INSTALLED_APPS = [
    ## Django Core ##
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    ## Third Party ##
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'django_celery_beat',
    'django_redis',

    ## Local Apps ##
    'apps.accounts',
    'apps.storage',
]


## ============= ##
## 4. Middleware ##
## ============= ##
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


## ============ ##
## 5. Databases ##
## ============ ##
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env.int('DB_PORT'),
    }
}


## ================= ##
## 6. Authentication ##
## ================= ##
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {'min_length': 6}
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]


## ================= ##
## 7. REST Framework ##
## ================= ##
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100000/day',
        'user': '500000/hour',
        'register': '5000/hour',
        'login': '5000/hour',
    }
}


## ================== ##
## 8. CORS & Security ##
## ================== ##
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS')
CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS')

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS=True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE=False


## ======================= ##
## 9. Internationalization ##
## ======================= ##
LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_L10N = True
USE_TZ = True


## ======================== ##
## 10. Static & Media Files ##
## ======================== ##
MEDIA_ROOT = '/app/backend/media'
STATIC_ROOT = '/app/backend/static'
MEDIA_URL = '/media/'
STATIC_URL = '/static/'


## ============= ##
## 11. Templates ##
## ============= ##
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


## ======================== ##
## 12. File Upload Settings ##
## ======================== ##
FILE_UPLOAD_MAX_MEMORY_SIZE = 2147483648  # 2GB
DATA_UPLOAD_MAX_MEMORY_SIZE = 2147483648  # 2GB
DATA_UPLOAD_MAX_NUMBER_FIELDS = 1000


## ================== ##
## 13. Storage Quotas ##
## ================== ##
DEFAULT_USER_BYTES = 5368709120  # 5GB
MIN_USER_BYTES = 1048576  # 1MB
MAX_ADMIN_BYTES = 10737418240  # 10GB


## =================== ##
## 14. Celery settings ##
## =================== ##
CELERY_BROKER_URL = env('REDIS_URL')
CELERY_RESULT_BACKEND = env('REDIS_URL')

CELERY_TIMEZONE = 'Europe/Moscow'
CELERY_BEAT_SCHEDULE_FILENAME = os.path.join(
    BASE_DIR,
    'celerybeat-schedule'
)

CELERY_IMPORTS = ('apps.storage.tasks',)
CELERY_TASK_ALWAYS_EAGER = False
CELERY_TASK_CREATE_MISSING_QUEUES = True
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'


## ================== ##
## 15. Cache settings ##
## ================== ##
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": env('REDIS_CACHE_URL'),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "SOCKET_CONNECT_TIMEOUT": 5,
            "SOCKET_TIMEOUT": 5,
        },
        "KEY_PREFIX": "mycloud"
    }
}

CACHE_TTL = 60 * 60
