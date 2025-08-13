FROM python:3.11-slim-bookworm

RUN mkdir -p /etc/apt/sources.list.d && \
    echo "deb http://mirror.yandex.ru/debian bookworm main" > /etc/apt/sources.list && \
    echo "deb http://mirror.yandex.ru/debian bookworm-updates main" >> /etc/apt/sources.list && \
    echo "deb http://mirror.yandex.ru/debian-security bookworm-security main" >> /etc/apt/sources.list && \
    apt-get update -o Acquire::Retries=3 && \
    apt-get install --yes --no-install-recommends \
    curl \
    git \
    wget \
    unzip \
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
