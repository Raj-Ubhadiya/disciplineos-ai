# Neon + Render + Vercel Launch Runbook

This runbook deploys DisciplineOS AI with:

```text
Neon PostgreSQL -> Render NestJS API -> Vercel Next.js frontend
```

## 1. Create Neon Database

1. Open Neon and create a project named `disciplineos-ai`.
2. Create or use the default database.
3. Copy two connection strings:
   - Pooled connection string for API runtime.
   - Direct connection string for migrations.

Recommended env mapping:

```text
DATABASE_URL=pooled Neon connection string
DIRECT_URL=direct Neon connection string
```

Why:

- Runtime API can use pooled connections.
- Prisma migrations should use a direct connection.

## 2. Deploy Backend On Render

1. Push this repo to GitHub.
2. In Render, create a new Blueprint or Web Service from the repo.
3. If using Blueprint, Render reads `render.yaml`.
4. Set backend environment variables:

```text
NODE_ENV=production
PORT=4000
DATABASE_URL=<Neon pooled URL>
DIRECT_URL=<Neon direct URL>
CORS_ORIGIN=https://your-vercel-domain.vercel.app
JWT_SECRET=<strong random secret, minimum 32 characters>
JWT_EXPIRATION=3600
SWAGGER_ENABLED=false
OPENAI_API_KEY=
```

Render build command:

```bash
corepack enable && corepack pnpm install --frozen-lockfile && corepack pnpm --filter @disciplineos/api prisma:generate && corepack pnpm --filter @disciplineos/api build
```

Render start command:

```bash
corepack pnpm --filter @disciplineos/api start:prod
```

Health check path:

```text
/api/v1/health
```

## 3. Run Production Migrations

After Neon is created and env vars are ready, run migrations once against Neon.

Local PowerShell example:

```powershell
$env:DATABASE_URL="<Neon pooled URL>"
$env:DIRECT_URL="<Neon direct URL>"
corepack pnpm db:deploy
```

Render shell example:

```bash
corepack pnpm --filter @disciplineos/api prisma:deploy
```

Then verify:

```bash
corepack pnpm --filter @disciplineos/api prisma:status
```

## 4. Verify Backend

Open:

```text
https://your-render-api.onrender.com/api/v1/health
```

Expected:

```json
{
  "status": "ok",
  "service": "api",
  "environment": "production",
  "database": "up"
}
```

## 5. Deploy Frontend On Vercel

1. In Vercel, import the same GitHub repo.
2. Keep project root as repository root.
3. Vercel can use `vercel.json`.
4. Set frontend environment variables:

```text
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=DisciplineOS AI
NEXT_PUBLIC_APP_DESCRIPTION=AI-powered discipline, goals, habits, and accountability partners.
NEXT_PUBLIC_API_URL=https://your-render-api.onrender.com/api/v1
```

5. Deploy.

## 6. Update Backend CORS

After Vercel gives the final frontend URL, update Render:

```text
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

Redeploy backend.

Multiple allowed origins are comma-separated:

```text
CORS_ORIGIN=https://your-vercel-domain.vercel.app,https://your-custom-domain.com
```

## 7. Final Production Smoke Test

Open the Vercel frontend and test:

1. Signup.
2. Login.
3. Update profile.
4. Create goal.
5. Create habit.
6. Log focus session.
7. Log distraction.
8. Save reflection.
9. Generate AI plan.
10. Confirm analytics and Today Focus Plan update.

## Common Errors

### API Fails At Startup

Check:

- `JWT_SECRET` is at least 32 characters.
- `CORS_ORIGIN` is not localhost in production.
- `DATABASE_URL` is not local placeholder.

### Frontend Says API Offline

Check:

- `NEXT_PUBLIC_API_URL` includes `/api/v1`.
- Backend health URL works.
- Backend CORS includes Vercel URL.

### Prisma Migration Fails

Check:

- `DIRECT_URL` uses direct Neon connection.
- `DATABASE_URL` uses pooled Neon connection for runtime.
- Migration folders exist in `apps/api/prisma/migrations`.

## Interview Explanation

You can explain it like this:

I deployed the app with a separated production architecture: Neon for managed PostgreSQL, Render for the NestJS API, and Vercel for the Next.js frontend. I used Prisma migrations for database schema deployment, strict production environment validation for safety, CORS restrictions for frontend/backend communication, and health checks to verify API and database readiness.
