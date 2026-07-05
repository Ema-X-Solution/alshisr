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
# Via Nginx (recommended)
curl http://localhost/api/v1/health

# Direct backend (debug only)
curl http://127.0.0.1:4000/api/v1/health
```

Expected response:
```json
{ "success": true, "data": { "status": "ok", "timestamp": "..." } }
```

## Troubleshooting (VPS)

### `docker compose ps` shows no containers

Containers were never started or the build failed:

```bash
cd /var/www/alshisr
cp .env.example .env   # if missing
nano .env              # set JWT_SECRET, POSTGRES_PASSWORD, domain URLs

chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

If build fails, inspect logs:

```bash
docker compose -f docker/docker-compose.yml logs --tail=100
docker compose -f docker/docker-compose.yml up -d --build 2>&1 | tee deploy.log
```

### `curl https://domain` fails on port 443

HTTPS does **not** work until SSL certificates are installed. Test HTTP first:

```bash
curl http://alshisr.com/api/v1/health
curl http://$(curl -s ifconfig.me)/api/v1/health
```

Enable HTTPS after HTTP works:

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d alshisr.com -d www.alshisr.com -d admin.alshisr.com
# Then uncomment port 443 in docker/docker-compose.yml and add SSL server block
```

### Check DNS points to this server

```bash
dig +short alshisr.com
curl -s ifconfig.me   # should match DNS A record
```

### Host nginx conflicts with Docker nginx

If `curl` shows `nginx/1.24.0 (Ubuntu)` but Docker containers are empty, the **system nginx** is using port 80.

Option A — use Docker nginx (recommended):

```bash
sudo systemctl stop nginx
sudo systemctl disable nginx
docker compose -f docker/docker-compose.yml up -d
```

Option B — keep system nginx and proxy to Docker:

```nginx
# /etc/nginx/sites-available/alshisr
server {
    listen 80;
    server_name alshisr.com www.alshisr.com;

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}
```

Then expose backend/frontend ports on `127.0.0.1` only (already configured in docker-compose).

### Docker build fails: `backend/node_modules not found`

Monorepo hoists dependencies to root `node_modules`. Pull latest code and rebuild:

```bash
git pull
docker compose -f docker/docker-compose.yml build --no-cache backend
docker compose -f docker/docker-compose.yml up -d
```

