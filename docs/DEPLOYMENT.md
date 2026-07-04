# AL SHISR Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- PM2 (for production process management)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables for production:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` / `JWT_REFRESH_SECRET` - Strong random secrets
- `CLOUDINARY_*` - Image upload credentials
- `SMTP_*` - Email configuration
- `STRIPE_*` / `MYFATOORAH_*` - Payment gateways

## Docker Deployment

### Full Stack

```bash
# Build and start all services
npm run docker:build
npm run docker:up

# Run migrations and seed (first time)
docker exec alshisr-backend npx prisma migrate deploy
docker exec alshisr-backend npx prisma db seed
```

### Services

| Service | Port | Container |
|---------|------|-----------|
| Store | 3000 | alshisr-frontend |
| Dashboard | 3001 | alshisr-dashboard |
| API | 4000 | alshisr-backend |
| PostgreSQL | 5432 | alshisr-postgres |
| Redis | 6379 | alshisr-redis |
| Nginx | 80 | alshisr-nginx |

## PM2 Deployment (without Docker)

```bash
# Build all packages
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save
pm2 startup
```

## Nginx Reverse Proxy

The included Nginx configuration routes:
- `/` → Frontend (port 3000)
- `/admin` → Dashboard (port 3001)
- `/api/` → Backend (port 4000)

## CI/CD

GitHub Actions workflow at `.github/workflows/ci.yml` runs on push to `main` and `develop`:
- Backend build with PostgreSQL service
- Frontend build
- Dashboard build

## SSL/TLS

For production, add SSL certificates to Nginx and update `nginx/conf.d/default.conf` with HTTPS configuration.

## Health Check

```bash
curl http://localhost:4000/api/v1/health
```

Expected response:
```json
{ "success": true, "data": { "status": "ok", "timestamp": "..." } }
```
