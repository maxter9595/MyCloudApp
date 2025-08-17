from .base import *

## ================= ##
## 1. Debug settings ##
## ================= ##
DEBUG = True


## =========================== ##
## 2. Cookie and CSRF settings ##
## =========================== ##
CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_HTTPONLY = True

SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

## =========================== ##
## 3. Development applications ##
## =========================== ##
DEV_APPS = [
    'drf_spectacular',
    'django_extensions',
]
INSTALLED_APPS += DEV_APPS


## =========================== ##
## 4. DRF Spectacular settings ##
## =========================== ##
SPECTACULAR_SETTINGS = {
    'TITLE': 'MyCloud API (Development)',
    'DESCRIPTION': 'API documentation for development environment',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'SCHEMA_PATH_PREFIX': '/api/',
}


## =================== ##
## 5. Logging settings ##
## =================== ##
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG' if DEBUG else 'INFO',
    },
}
