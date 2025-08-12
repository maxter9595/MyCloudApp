#!/bin/sh

# Ждём готовности PostgreSQL
echo "Waiting for PostgreSQL..."
until pg_isready -h db -U postgres; do
    sleep 2
done

# Создаем папки если их нет
mkdir -p /app/backend/media
mkdir -p /app/backend/static

# Устанавливаем права
chmod -R 777 /app/backend/media
chown -R 1000:1000 /app/backend/media

# Миграции и статика
python manage.py makemigrations accounts
python manage.py makemigrations storage
python manage.py migrate django_celery_beat zero
python manage.py makemigrations django_celery_beat
python manage.py migrate
python manage.py migrate django_celery_beat
python manage.py collectstatic --noinput

# Запуск основной команды
exec "$@"
