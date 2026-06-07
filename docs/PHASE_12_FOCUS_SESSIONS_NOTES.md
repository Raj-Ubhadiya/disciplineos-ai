# Phase 12 - Focus Sessions Notes

## What We Built

This phase adds focus session tracking.

Backend endpoints:

- `POST /api/v1/focus-sessions`
- `GET /api/v1/focus-sessions`
- `GET /api/v1/focus-sessions/summary`

Frontend features:

- Log a focused work block.
- Save duration, energy level, distraction-free status, note, linked goal, and linked habit.
- Show recent focus sessions.
- Show total focused hours.

## Why We Built It

The product goal is to reduce social media attraction.

To reduce a bad behavior, the app should help users replace it with a better behavior.

Focus sessions are that replacement behavior.

The loop becomes:

```text
Distraction urge -> start focus block -> log proof -> build identity
```

## Database Change

We added a `FocusSession` table.

Simple meaning:

```text
One user can have many focus sessions.
A focus session can optionally connect to one goal and one habit.
```

Important fields:

- `title`
- `durationMinutes`
- `energyLevel`
- `distractionFree`
- `note`
- `goalId`
- `habitId`

## Backend Flow

When user logs a focus session:

1. Frontend sends focus session payload.
2. `JwtAuthGuard` authenticates the user.
3. DTO validates duration, title, and optional fields.
4. `FocusSessionsController` receives the request.
5. `FocusSessionsService` verifies linked goal/habit ownership.
6. Prisma stores the session in PostgreSQL.
7. Dashboard refreshes recent sessions and summary.

## Why Ownership Checks Matter

The user can send any `goalId` or `habitId` from the browser.

So the backend must check:

```text
Does this goal/habit belong to the logged-in user?
```

This prevents one user from linking sessions to another user's records.

## Prisma Migration

We created a real migration:

```bash
prisma migrate dev --name add_focus_sessions
```

This created:

```text
apps/api/prisma/migrations/20260605104606_add_focus_sessions/migration.sql
```

## Interview Explanation

You can explain it like this:

I added a focus session module to track deep-work blocks as a positive replacement for social media distraction. I modeled it in Prisma with optional relations to goals and habits, added NestJS protected endpoints with DTO validation and ownership checks, exposed shared TypeScript types, and connected it to the Next.js dashboard.

## Files To Revise

- `apps/api/prisma/schema.prisma`
- `apps/api/src/focus-sessions/focus-sessions.controller.ts`
- `apps/api/src/focus-sessions/focus-sessions.service.ts`
- `apps/api/src/focus-sessions/dto/create-focus-session.dto.ts`
- `apps/web/src/components/app-dashboard.tsx`
- `packages/types/src/index.ts`

## Future Improvements

- Start/stop live timer.
- Pomodoro mode.
- Focus session streaks.
- Weekly focus charts.
- Connect focus minutes to analytics focus score.
