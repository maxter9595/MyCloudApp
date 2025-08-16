#!/bin/bash
set -e

cd /home/myclouduser/MyCloudApp || exit

git fetch origin
git reset --hard origin/main

if [ -d "frontend" ]; then
    echo "Сборка фронтенда..."
    cd frontend
    npm install
    npm run build
    cd ..
fi

docker compose down --remove-orphans
docker compose up -d --build

sudo systemctl restart nginx
