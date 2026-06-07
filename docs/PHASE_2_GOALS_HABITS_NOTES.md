# Phase 2 Notes - Goals And Habits API

## What We Built

Protected backend APIs for goals and habits.

Goal endpoints:

- `POST /api/v1/goals`
- `GET /api/v1/goals`
- `GET /api/v1/goals/:id`
- `PATCH /api/v1/goals/:id`
- `DELETE /api/v1/goals/:id`

Habit endpoints:

- `POST /api/v1/habits`
- `GET /api/v1/habits`
- `GET /api/v1/habits/:id`
- `POST /api/v1/habits/:id/complete`
- `PATCH /api/v1/habits/:id`
- `DELETE /api/v1/habits/:id`

## Files Added

Goals:

- `apps/api/src/goals/goals.module.ts`
- `apps/api/src/goals/goals.controller.ts`
- `apps/api/src/goals/goals.service.ts`
- `apps/api/src/goals/dto/create-goal.dto.ts`
- `apps/api/src/goals/dto/update-goal.dto.ts`

Habits:

- `apps/api/src/habits/habits.module.ts`
- `apps/api/src/habits/habits.controller.ts`
- `apps/api/src/habits/habits.service.ts`
- `apps/api/src/habits/dto/create-habit.dto.ts`
- `apps/api/src/habits/dto/update-habit.dto.ts`
- `apps/api/src/habits/dto/complete-habit.dto.ts`

## Concepts To Learn

### Protected Resource APIs

Goals and habits are protected by `JwtAuthGuard`.

Interview answer:

> Protected APIs require the user to send a valid JWT token. The guard validates the token and the controller receives the authenticated user through a custom decorator.

### Ownership Check

The service checks `userId` before reading, updating, or deleting a record.

Why:

- User A must never access User B's goals or habits.
- This is authorization at the data level.

Interview answer:

> Authentication tells us who the user is. Authorization decides whether that user can access a specific resource.

### DTO Validation

`CreateGoalDto`, `UpdateGoalDto`, `CreateHabitDto`, and related DTOs validate request body shape.

Why:

- Prevents invalid payloads.
- Keeps service logic cleaner.
- Makes API contracts obvious.

### Prisma Relations

Goal relation:

- A user has many goals.
- A goal can have many habits.

Habit relation:

- A user has many habits.
- A habit may belong to one goal.
- A habit has many completions.

Interview answer:

> Prisma relations let us model real database relationships in TypeScript and fetch related data using `include`.

### Transactions

Habit completion uses `prisma.$transaction`.

Why:

- Create completion record.
- Increment habit streak.
- Both operations should succeed or fail together.

Interview answer:

> A database transaction keeps multiple related writes consistent. If one write fails, the whole transaction rolls back.

### `exactOptionalPropertyTypes`

We do not pass `undefined` into Prisma fields. We omit optional fields unless they have a real value.

Why:

- The project uses strict TypeScript.
- Prisma nullable fields expect `null` or a value, not accidental `undefined`.

Interview answer:

> Strict optional typing helps avoid ambiguous data writes. It forced us to build Prisma data objects carefully.

## Verification Completed

- `@disciplineos/api lint`
- `@disciplineos/api typecheck`

