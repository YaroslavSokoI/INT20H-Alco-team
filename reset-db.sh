#!/bin/bash
# Скидає тільки PostgreSQL і Redis дані.
# Nominatim НЕ чіпається — не треба чекати 40 хвилин.

set -e

echo "Stopping containers..."
docker-compose down

echo "Removing postgres and redis volumes..."
docker volume rm phase-1_postgres_data phase-1_redis_data 2>/dev/null || true

echo "Starting containers..."
docker-compose up -d

echo "Done! Backend will run migrations automatically on startup."
echo "Check: docker logs tax_backend --tail=10"
