# Phase 3 Notes - Frontend Dashboard And Local DB Setup

## What We Built

Frontend dashboard connected to the protected backend APIs.

Dashboard features:

- Signup and login.
- Local JWT storage.
- Protected workspace sync.
- Profile update form.
- Goal creation and goal list.
- Habit creation and habit list.
- Habit completion button.

## Files Added Or Updated

- `apps/web/src/components/app-dashboard.tsx`
- `apps/web/src/components/focus-dashboard.tsx`
- `apps/web/src/app/page.tsx`
- `packages/types/src/index.ts`
- `apps/api/.env`

## Concepts To Learn

### Client Component

`AppDashboard` uses `'use client'` because it needs browser-only features:

- `localStorage`
- `useState`
- `useEffect`
- button clicks
- form inputs

Interview answer:

> In Next.js App Router, components are Server Components by default. I use Client Components only when browser interactivity is required.

### Local JWT Storage

The dashboard stores the access token in `localStorage`.

Why:

- Simple for MVP.
- Easy to understand while learning auth flow.

Production note:

- For stronger security, an HTTP-only cookie session is often better because JavaScript cannot read HTTP-only cookies.

### Frontend API Helper

`getApiV1BaseUrl` normalizes API URL formats.

Why:

- The app works whether the env value is `http://localhost:4000`, `http://localhost:4000/api`, or `http://localhost:4000/api/v1`.

### Shared Types

We added frontend-facing types:

- `UserProfile`
- `Goal`
- `Habit`
- `HabitCompletion`

Why:

- The frontend can type API responses.
- Backend and frontend share the same language for data.

### Dashboard API Flow

The frontend calls:

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `GET /profile`
- `PATCH /profile`
- `GET /goals`
- `POST /goals`
- `GET /habits`
- `POST /habits`
- `POST /habits/:id/complete`

## Local Database Setup

Docker was not available in the current terminal, so migration was not run yet.

When Docker is available:

```bash
docker compose up -d postgres
corepack pnpm --filter @disciplineos/api prisma:migrate -- --name init
corepack pnpm --filter @disciplineos/api prisma:generate
```

If Docker is not installed:

1. Install Docker Desktop.
2. Restart the terminal.
3. Run the commands above.

Alternative:

- Install PostgreSQL locally.
- Keep the same `DATABASE_URL` in `apps/api/.env`.

## Interview Notes

### Why Next.js For Frontend?

Next.js gives routing, rendering, build optimization, and React Server Components. It is more production-oriented than plain React.

### Why NestJS For Backend?

NestJS gives a structured backend architecture with modules, controllers, services, decorators, guards, and dependency injection.

### Why Prisma?

Prisma gives typed database access and migrations. It reduces raw SQL for CRUD-heavy features.

### Why PostgreSQL?

PostgreSQL is a production-grade relational database with strong support for relationships, indexes, transactions, and structured data.

## Verification Completed

- `@disciplineos/types typecheck`
- `@disciplineos/web typecheck`
- `@disciplineos/web lint`
- `@disciplineos/api typecheck`
- `@disciplineos/api lint`

