#!/bin/sh
set -e

echo "Загрузка переменных окружения..."
if [ -f /app/.env ]; then
    export $(grep -v '^#' /app/.env | xargs)
fi

echo "Ожидание PostgreSQL..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
    sleep 2
done

echo "Ожидание Redis..."
until nc -z redis 6379; do
    sleep 2
done

mkdir -p /app/backend/media /app/backend/static

if [ "$SET_PERMS" = "true" ]; then
    echo "Устанавливаю права на media и static..."
    chmod -R 777 /app/backend/media /app/backend/static
    chown -R 1000:1000 /app/backend/media /app/backend/static
fi

echo "Применение миграций..."
docker compose exec backend python manage.py migrate || \
docker compose exec backend python manage.py migrate --fake

echo "Сбор статики..."
python manage.py collectstatic --noinput

echo "Запуск приложения..."
exec "$@"
