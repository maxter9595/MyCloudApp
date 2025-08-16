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

chmod +x backend/entrypoint.sh

sudo chmod o+x /home/myclouduser
sudo chmod o+x /home/myclouduser/MyCloudApp
sudo chmod o+x /home/myclouduser/MyCloudApp/frontend
sudo chmod o+x /home/myclouduser/MyCloudApp/frontend/build

sudo chmod -R o+r /home/myclouduser/MyCloudApp/frontend/build
sudo chown -R myclouduser:www-data /home/myclouduser/MyCloudApp/frontend/build
sudo chmod -R 750 /home/myclouduser/MyCloudApp/frontend/build

# Перезапуск nginx
echo "Перезапуск Nginx..."
sudo systemctl restart nginx

echo "Обновление завершено!"
