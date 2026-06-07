# Phase 4 Notes - Distraction Tracker

## What We Built

Protected distraction tracking feature for reducing social media attraction.

Backend endpoints:

- `POST /api/v1/distractions`
- `GET /api/v1/distractions`
- `GET /api/v1/distractions/summary`
- `PATCH /api/v1/distractions/:id`
- `DELETE /api/v1/distractions/:id`

Frontend dashboard:

- Log platform name.
- Log minutes lost.
- Log trigger reason.
- Log mood before and after.
- Log replacement action.
- Show total minutes lost.
- Show top platform.
- Show latest replacement action.
- Show recent logs.

## Files Added Or Updated

Backend:

- `apps/api/src/distractions/distractions.module.ts`
- `apps/api/src/distractions/distractions.controller.ts`
- `apps/api/src/distractions/distractions.service.ts`
- `apps/api/src/distractions/dto/create-distraction-log.dto.ts`
- `apps/api/src/distractions/dto/update-distraction-log.dto.ts`

Frontend:

- `apps/web/src/components/app-dashboard.tsx`
- `packages/types/src/index.ts`

## Concepts To Learn

### Product Logic

The feature is not just "track time". It records:

- Platform
- Minutes lost
- Trigger
- Mood before
- Mood after
- Replacement action

This helps users understand the pattern behind distraction.

### Summary Endpoint

`GET /distractions/summary` calculates:

- Total logs
- Total minutes lost
- Top platform
- Platform totals
- Latest replacement action

Interview answer:

> I added a summary endpoint so the frontend can show analytics without duplicating aggregation logic in the browser.

### Ownership Check

Every update/delete checks:

```ts
where: {
  id,
  userId: user.id,
}
```

This prevents one user from modifying another user's logs.

### DTO Validation

`CreateDistractionLogDto` validates user input.

Examples:

- `minutesLost` must be between 1 and 1440.
- `platform` must be a string.
- notes are length-limited.

### Frontend State

The dashboard now stores:

- `distractionForm`
- `distractionLogs`
- `distractionSummary`

These are synced in `refreshWorkspace()`.

## Interview Summary

> The distraction tracker is a protected feature where authenticated users log social media distraction events. The backend validates input with DTOs, stores logs with Prisma, checks ownership before update/delete, and provides a summary endpoint for analytics. The frontend uses shared types and JWT-authenticated API calls to show recent logs and focus metrics.

