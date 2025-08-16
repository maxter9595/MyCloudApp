#!/bin/bash
set -e  # Прекращать выполнение при любой ошибке

# Основные пути
APP_DIR="/home/myclouduser/MyCloudApp"
FRONTEND_DIR="$APP_DIR/frontend"
BUILD_DIR="$FRONTEND_DIR/build"

# 1. Обновление кода
echo "Обновляем код..."
cd "$APP_DIR" || { echo "Ошибка: Не удалось перейти в $APP_DIR"; exit 1; }
git fetch origin
git reset --hard origin/main

# 2. Сборка фронтенда
if [ -d "$FRONTEND_DIR" ]; then
    echo "Сборка фронтенда..."
    cd "$FRONTEND_DIR" || exit
    
    # Проверяем, нужно ли обновлять зависимости
    if [ ! -d "node_modules" ] || [ "package-lock.json" -nt "node_modules" ]; then
        npm install
    fi
    
    # Удаляем старую сборку
    [ -d "$BUILD_DIR" ] && rm -rf "$BUILD_DIR"
    
    npm run build
    
    # Проверяем успешность сборки
    if [ ! -f "$BUILD_DIR/index.html" ]; then
        echo "Ошибка: Сборка фронтенда не удалась (index.html не найден)"
        exit 1
    fi
fi

# 3. Настройка прав
echo "Настройка прав доступа..."
sudo chmod o+x /home/myclouduser
sudo chmod o+x "$APP_DIR"
sudo chmod o+x "$FRONTEND_DIR"
sudo chmod o+x "$BUILD_DIR"

sudo chmod -R o+r "$BUILD_DIR"
sudo chown -R myclouduser:www-data "$BUILD_DIR"
sudo chmod -R 750 "$BUILD_DIR"

# 4. Перезапуск Docker
echo "Перезапуск Docker..."
cd "$APP_DIR" || exit
docker compose down
docker compose up -d --build

# 5. Перезапуск Nginx
echo "Перезапуск Nginx..."
sudo systemctl restart nginx

echo "Обновление успешно завершено!"
