# AL SHISR - Luxury E-Commerce Platform

Premium Arabic-first luxury e-commerce platform with full admin dashboard.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TailwindCSS, Shadcn UI |
| Dashboard | Next.js 15, React 19, TailwindCSS, Shadcn UI |
| Backend | NestJS, Prisma, PostgreSQL, Redis, BullMQ |
| DevOps | Docker, Nginx, PM2, GitHub Actions |

## Project Structure

```
alshisr/
├── frontend/     # Customer-facing store
├── dashboard/    # Admin panel
├── backend/      # NestJS API
├── packages/     # Shared utilities
├── docker/       # Docker configuration
├── nginx/        # Nginx configuration
└── docs/         # Documentation
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)

### Development

```bash
# Copy environment variables
cp .env.example .env

# Start infrastructure
npm run docker:up

# Install dependencies
npm install

# Run database migrations and seed
npm run db:generate
npm run db:migrate
npm run db:seed

# Start all services
npm run dev
```

### URLs

| Service | URL |
|---------|-----|
| Store | http://localhost:3000 |
| Dashboard | http://localhost:3001 |
| API | http://localhost:4000 |
| API Docs | http://localhost:4000/api/docs |

### Default Admin Credentials

- Email: `admin@alshisr.com`
- Password: `Admin@123456`

## Brand Colors

- Primary: `#5C1D16`
- Secondary: `#C8A46B`
- Background: `#FAF7F2`
- Text: `#222222`

## License

Proprietary - AL SHISR © 2026
