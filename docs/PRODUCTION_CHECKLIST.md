# DisciplineOS AI - Production Checklist

Use this checklist before every real deployment.

## Code Quality

- `corepack pnpm install --frozen-lockfile` succeeds.
- `corepack pnpm typecheck` succeeds.
- `corepack pnpm lint` succeeds.
- `corepack pnpm build` succeeds.
- GitHub Actions CI is green.

## Backend Environment

- `NODE_ENV=production`
- `DATABASE_URL` points to hosted PostgreSQL.
- `DIRECT_URL` points to hosted PostgreSQL when required by provider.
- `JWT_SECRET` is unique, random, and at least 32 characters.
- `CORS_ORIGIN` is the deployed frontend URL.
- `SWAGGER_ENABLED=false` unless API docs are intentionally exposed.
- `OPENAI_API_KEY` is set only when real AI provider integration is enabled.

## Frontend Environment

- `NEXT_PUBLIC_API_URL` points to deployed backend `/api/v1`.
- `NEXT_PUBLIC_APP_NAME` is correct.
- `NEXT_PUBLIC_APP_DESCRIPTION` is correct.

## Database

- All migration folders are committed.
- `corepack pnpm db:status` shows database is up to date locally.
- Production deploy runs:

```bash
corepack pnpm db:deploy
```

## Security

- No `.env` file is committed.
- No production secret is written in README/docs.
- API rejects unknown DTO fields.
- API uses Helmet.
- API CORS allows only expected frontend origins.
- Passwords are hashed before storage.
- Protected routes use JWT guard.

## Smoke Test

After deployment:

- Open frontend URL.
- API health returns `status: "ok"` and `database: "up"`.
- Signup works.
- Login works.
- Create goal and habit.
- Log focus session.
- Log distraction.
- Save reflection.
- Generate AI plan.
- Analytics updates.
- Today Focus Plan updates.

## Rollback Plan

- Keep previous frontend deployment available in hosting provider.
- Keep previous backend deployment available if provider supports rollback.
- Do not manually edit production database tables.
- If migration fails, inspect logs before retrying.
- Restore database from provider backup only when data corruption occurs.

## Interview Explanation

You can explain it like this:

Production readiness is not only deployment. I added strict environment validation, production-safe migration commands, CI checks, health checks, CORS/security configuration, env examples, and deployment documentation. This makes the app easier to deploy, safer to operate, and easier for a team to maintain.
