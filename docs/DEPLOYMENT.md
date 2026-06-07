# DisciplineOS AI - Production Deployment Guide

## Goal

Deploy DisciplineOS AI as a real production-style app:

```text
Next.js frontend -> NestJS API -> PostgreSQL database
```

## Recommended Hosting Split

Use three services:

- Frontend: Vercel.
- Backend: Render.
- Database: Neon PostgreSQL.

For exact provider steps, read `NEON_RENDER_VERCEL_RUNBOOK.md`.

## Production Environment Variables

Backend variables:

```text
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://USER:PASSWORD@HOST-POOLER:5432/DATABASE?schema=public
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
CORS_ORIGIN=https://your-frontend-domain.com
JWT_SECRET=strong-random-secret-minimum-32-characters
JWT_EXPIRATION=3600
SWAGGER_ENABLED=false
OPENAI_API_KEY=
```

Frontend variables:

```text
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=DisciplineOS AI
NEXT_PUBLIC_APP_DESCRIPTION=AI-powered discipline, goals, habits, and accountability partners.
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

## Database Deployment

Production database steps:

1. Create a managed PostgreSQL database.
2. Copy the pooled connection string into backend `DATABASE_URL`.
3. Copy the direct connection string into backend `DIRECT_URL`.
4. Run production migrations:

```bash
corepack pnpm db:deploy
```

Important:

- Use `prisma migrate dev` only for local development.
- Use `prisma migrate deploy` for production.
- Commit migration folders to version control.

## Backend Deployment

Backend build command:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm --filter @disciplineos/api prisma:generate
corepack pnpm --filter @disciplineos/api build
```

Backend start command:

```bash
corepack pnpm --filter @disciplineos/api start:prod
```

Health check:

```text
https://your-api-domain.com/api/v1/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "api",
  "environment": "production",
  "database": "up"
}
```

## Frontend Deployment

Frontend build command:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm --filter @disciplineos/web build
```

Frontend start command:

```bash
corepack pnpm --filter @disciplineos/web start
```

Make sure `NEXT_PUBLIC_API_URL` points to:

```text
https://your-api-domain.com/api/v1
```

## Production Safety Checklist

- `NODE_ENV=production`
- `JWT_SECRET` is strong and unique.
- `DATABASE_URL` does not use local credentials.
- `CORS_ORIGIN` is the real frontend domain.
- `NEXT_PUBLIC_API_URL` is the real backend API URL.
- `SWAGGER_ENABLED=false` unless intentionally exposed.
- `corepack pnpm db:deploy` has been run.
- API health returns `database: "up"`.
- Frontend can sign up, log in, and load dashboard data.

## Release Checklist

Before each production release:

```bash
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm build
corepack pnpm db:status
```

Then deploy:

```bash
corepack pnpm db:deploy
```

Finally verify:

- Open frontend URL.
- Check API health URL.
- Create a test account.
- Create a goal, habit, focus session, and reflection.
- Confirm analytics updates.

## Interview Explanation

You can explain it like this:

I prepared the app for production by separating frontend, backend, and database deployment concerns. The backend uses strict environment validation, production migration deployment, CORS restrictions, Helmet, global validation, and health checks. The frontend consumes the deployed API through `NEXT_PUBLIC_API_URL`. Database schema changes are managed through committed Prisma migrations and deployed using `prisma migrate deploy`.
