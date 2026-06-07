# Phase 11 - Daily Reflections Notes

## What We Built

This phase adds evening discipline reflections.

Backend endpoints:

- `POST /api/v1/reflections`
- `GET /api/v1/reflections`
- `GET /api/v1/reflections/summary`

Frontend features:

- Save mood, wins, blockers, distractions, tomorrow commitment, and focus score.
- Show recent reflections.
- Show average reflection focus score.

## Why We Built It

Discipline is not only planning the day.

The full product loop is:

```text
Plan today -> act -> log distractions -> reflect -> improve tomorrow
```

Reflections help users notice patterns and make tomorrow easier.

## Database Change

We added a `DailyReflection` table.

Simple meaning:

```text
One user can have many daily reflections.
Each reflection belongs to one user.
```

Important fields:

- `mood`
- `wins`
- `blockers`
- `distractions`
- `tomorrowCommitment`
- `focusScore`

## Backend Flow

When user saves a reflection:

1. Frontend sends reflection payload.
2. `JwtAuthGuard` authenticates the user.
3. DTO validates mood and focus score.
4. `ReflectionsController` receives the request.
5. `ReflectionsService` writes the record using Prisma.
6. PostgreSQL stores the reflection.
7. Dashboard refreshes reflection list and summary.

## Why We Used A Table Here

The Today Focus Plan can be calculated from existing data, so it does not need a table yet.

Daily reflections are different because the user writes new thoughts and commitments. That data cannot be derived from other tables.

So we store it permanently.

## Prisma Migration

We created a real migration:

```bash
prisma migrate dev --name add_daily_reflections
```

This created:

```text
apps/api/prisma/migrations/20260605103807_add_daily_reflections/migration.sql
```

## Interview Explanation

You can explain it like this:

I added a daily reflections module with a new Prisma model, migration, NestJS controller/service, DTO validation, protected JWT routes, shared TypeScript types, and dashboard UI. The feature stores user-written reflection data and also provides a summary endpoint for average focus score and latest commitment.

## Files To Revise

- `apps/api/prisma/schema.prisma`
- `apps/api/src/reflections/reflections.controller.ts`
- `apps/api/src/reflections/reflections.service.ts`
- `apps/api/src/reflections/dto/create-daily-reflection.dto.ts`
- `apps/web/src/components/app-dashboard.tsx`
- `packages/types/src/index.ts`

## Future Improvements

- Prevent duplicate reflection for the same day.
- Add weekly reflection summary.
- Add AI-generated improvement suggestions.
- Connect reflection score to analytics focus score.
- Show a reflection streak.
