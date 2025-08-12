# Этап сборки
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Финальный образ с Nginx
FROM nginx:1.23-alpine

# Устанавливаем curl для healthcheck (в alpine-образе его нет по умолчанию)
RUN apk add --no-cache curl

# Копируем собранный фронтенд
COPY --from=builder /app/build /usr/share/nginx/html

# Копируем конфиг Nginx (убедитесь, что файл nginx.conf существует)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Healthcheck для фронтенда
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
