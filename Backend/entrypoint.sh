#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."
python << 'EOF'
import os
import socket
import time
from urllib.parse import urlparse

url = os.environ.get("DATABASE_URL", "")
parsed = urlparse(url)
host = parsed.hostname or "db"
port = parsed.port or 5432

for _ in range(60):
    try:
        with socket.create_connection((host, port), timeout=2):
            print(f"PostgreSQL is available at {host}:{port}")
            break
    except OSError:
        time.sleep(1)
else:
    raise SystemExit(f"Could not connect to PostgreSQL at {host}:{port}")
EOF

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3
