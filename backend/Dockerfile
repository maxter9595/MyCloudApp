FROM python:3.12-alpine

RUN apk add --no-cache \
    curl \
    postgresql-client \
    build-base \
    postgresql-dev \
    bash \
    git

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "mycloud.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
