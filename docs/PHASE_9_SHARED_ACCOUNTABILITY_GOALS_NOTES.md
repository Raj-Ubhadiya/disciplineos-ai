# Phase 9 - Shared Accountability Goals Notes

## What We Built

This phase connects goals with accountability partners.

Backend features:

- A goal can now optionally store `relationshipId`.
- `GET /api/v1/goals/shared` lists only goals linked to an accountability partner.
- Goal create/update validates that the selected relationship belongs to the logged-in user.
- Goal responses include partner details so the frontend can show who the goal is shared with.

Frontend features:

- The goal form has a `Private goal` / `Share with partner` selector.
- Goal cards show whether a goal is private or shared.
- Shared goal cards display the partner name or email.

## Why We Built It

DisciplineOS is not only a goal tracker. The product idea includes accountability and relationship management.

Private goals help the user focus personally.

Shared goals help the user involve a trusted partner for motivation, discipline, and emotional support.

## Database Change

We added an optional relation between `Goal` and `Relationship`.

Simple meaning:

```text
One relationship can have many goals.
One goal can optionally belong to one relationship.
```

Prisma shape:

```prisma
model Goal {
  relationshipId String?
  relationship   Relationship? @relation(fields: [relationshipId], references: [id], onDelete: SetNull)
}

model Relationship {
  goals Goal[]
}
```

## Backend Request Flow

When user creates a shared goal:

1. Frontend sends `title`, `category`, `whyItMatters`, and optional `relationshipId`.
2. `JwtAuthGuard` checks the JWT token.
3. `GetUser` gives the logged-in user to the controller.
4. DTO validates the payload shape.
5. `GoalsController` passes request data to `GoalsService`.
6. `GoalsService` checks that the relationship belongs to the user.
7. Prisma creates the goal in PostgreSQL.
8. API sends back the goal with habits and relationship data.

## Why Authorization Check Matters

The frontend can be changed by anyone in the browser.

So this is not safe:

```text
If frontend sends relationshipId, trust it.
```

This is safe:

```text
If frontend sends relationshipId, backend checks that this relationship belongs to the logged-in user.
```

That prevents one user from attaching goals to another user's relationship.

## Prisma Migration

We created a migration for this schema change:

```bash
prisma migrate dev --name add_shared_goal_relationship
```

In industry/team work, this migration file is committed to Git. Other developers do not manually change the database. They pull the code and run migrations, so everyone gets the same database structure.

## Interview Explanation

You can explain it like this:

I implemented shared accountability goals by adding an optional Prisma relation from goals to relationships. On the backend, I added service-layer authorization so users can only link a goal to relationships they own or participate in. On the frontend, I added a partner selector in the goal form and displayed whether each goal is private or shared.

## Files To Revise

- `apps/api/prisma/schema.prisma`
- `apps/api/src/goals/goals.controller.ts`
- `apps/api/src/goals/goals.service.ts`
- `apps/api/src/goals/dto/create-goal.dto.ts`
- `apps/api/src/goals/dto/update-goal.dto.ts`
- `apps/web/src/components/app-dashboard.tsx`
- `packages/types/src/index.ts`

## Future Improvements

- Allow partners to comment on shared goals.
- Add shared goal progress history.
- Add partner approval before sharing a goal.
- Add notifications when a shared goal is completed.
- Show shared goals in a dedicated partner dashboard.
