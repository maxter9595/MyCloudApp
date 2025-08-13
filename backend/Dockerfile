FROM python:3.11-slim-bookworm

RUN apt-get update && apt install -qq -y \
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
