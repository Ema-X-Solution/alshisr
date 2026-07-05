#!/usr/bin/env bash
# Full VPS fix script — run: bash scripts/vps-fix.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== 1. Fix Dockerfiles ==="

mkdir -p frontend/public dashboard/public
touch frontend/public/.gitkeep dashboard/public/.gitkeep

# Dashboard Dockerfile (monorepo standalone path)
cat > docker/Dockerfile.dashboard << 'DOCKERFILE'
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY dashboard/package.json ./dashboard/
RUN npm ci --workspace=dashboard --workspace=@alshisr/shared --include=dev

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/dashboard/node_modules ./dashboard/node_modules
COPY packages/shared ./packages/shared
COPY dashboard ./dashboard
COPY package.json ./
RUN npm run build --workspace=@alshisr/shared
WORKDIR /app/dashboard
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL=http://alshisr.com/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN mkdir -p public
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/dashboard/.next/static ./dashboard/.next/static
COPY --from=builder /app/dashboard/public ./dashboard/public

WORKDIR /app/dashboard
USER nextjs
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
DOCKERFILE

echo "=== 2. Show container logs (last errors) ==="
docker compose -f docker/docker-compose.yml logs backend --tail=20 2>/dev/null || true
docker compose -f docker/docker-compose.yml logs frontend --tail=10 2>/dev/null || true
docker compose -f docker/docker-compose.yml logs dashboard --tail=10 2>/dev/null || true

echo ""
echo "=== 3. Rebuild & restart ==="
docker compose -f docker/docker-compose.yml up -d --build

echo ""
echo "=== Done. Wait 30s then run: ==="
echo "  docker compose -f docker/docker-compose.yml ps"
echo "  curl http://localhost/api/v1/health"
