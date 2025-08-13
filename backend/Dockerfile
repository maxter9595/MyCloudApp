FROM python:3.11-slim-bookworm

RUN echo "deb http://mirror.yandex.ru/debian bullseye main" > /etc/apt/sources.list && \
    echo "deb http://mirror.yandex.ru/debian bullseye-updates main" >> /etc/apt/sources.list && \
    echo "deb http://mirror.yandex.ru/debian-security bullseye-security main" >> /etc/apt/sources.list && \
    apt-get update -o Acquire::Retries=3 -o Acquire::http::Timeout=30 && \
    apt-get install -y --no-install-recommends \
    curl \
    postgresql-client \
    build-essential \
    libpq-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
