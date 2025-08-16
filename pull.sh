#!/bin/bash
set -e  # Прекращать выполнение при любой ошибке
cd /home/myclouduser/MyCloudApp || exit

echo "Обновляем код..."
git fetch origin
git reset --hard origin/main

if [ -d "frontend" ]; then
    echo "Сборка фронтенда..."
    cd frontend
    npm install
    npm run build
    cd ..
fi

# Перезапуск Docker
echo "Перезапуск Docker..."
docker compose down
docker compose up -d --build

# Перезапуск nginx
echo "Перезапуск Nginx..."
sudo systemctl restart nginx

echo "Обновление завершено!"
