from .base import *

## ================= ##
## 1. Debug settings ##
## ================= ##
DEBUG = False


## ==================== ##
## 2. Security Settings ##
## ==================== ##
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 3600

SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = (
    'HTTP_X_FORWARDED_PROTO',
    'https'
)


## =================== ##
## 3. Logging settings ##
## =================== ##
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'WARNING',
    },
}


## ====================== ##
## 4. Staticfiles storage ##
## ====================== ##
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'
