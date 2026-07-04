#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "❌ Missing .env — run: cp .env.example .env && nano .env"
  exit 1
fi

# Load domain vars for build args
set -a
# shellcheck disable=SC1091
source .env
set +a

export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-alshisr_secret}"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost/api/v1}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://localhost}"

echo "▶ Building images..."
docker compose -f docker/docker-compose.yml build \
  --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
  --build-arg NEXT_PUBLIC_SITE_URL="$NEXT_PUBLIC_SITE_URL"

echo "▶ Starting services..."
docker compose -f docker/docker-compose.yml up -d

echo "▶ Waiting for backend..."
sleep 10

echo "▶ Running migrations..."
docker exec alshisr-backend npx prisma migrate deploy

echo "▶ Seeding (first deploy only — safe to re-run)..."
docker exec alshisr-backend npx prisma db seed || true

echo ""
echo "✅ Deploy complete"
echo "   HTTP health: curl http://localhost/api/v1/health"
echo "   Containers:  docker compose -f docker/docker-compose.yml ps"
