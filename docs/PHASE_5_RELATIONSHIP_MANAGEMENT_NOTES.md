# Phase 5 - Accountability Partner Notes

## What We Built

This phase adds accountability partner management to DisciplineOS AI.

Backend endpoints:

- `POST /api/v1/relationships`
- `GET /api/v1/relationships`
- `GET /api/v1/relationships/:id`
- `PATCH /api/v1/relationships/:id`
- `POST /api/v1/relationships/:id/check-ins`
- `DELETE /api/v1/relationships/:id`

Frontend features:

- Add an accountability partner by name.
- Optionally connect to an existing user by email.
- Save partner check-ins with mood, appreciation, concern, and commitment.
- Show partner status and latest check-in on the dashboard.

## Why This Matters For The Product

Discipline is easier when the user has accountability. This module supports the product idea that DisciplineOS AI should not only track goals, but also help users stay consistent with trusted accountability partners.

This is useful for:

- Study partners
- Fitness partners
- Business accountability partners
- Personal commitment reflection
- Mentor/student check-ins

## Backend Flow

1. The frontend sends a request with the JWT token in the `Authorization` header.
2. `JwtAuthGuard` verifies the token and attaches the authenticated user to `request.user`.
3. `RelationshipsController` receives the request. The internal name is still `RelationshipsController`, but the product feature is called Accountability Partners.
4. DTO classes validate the request body.
5. `RelationshipsService` applies business rules.
6. `PrismaService` writes or reads data from PostgreSQL.
7. NestJS serializes the returned object as JSON.

## Important Business Rules

- A user can only update or delete accountability partner records they own.
- A user can create check-ins if they are the owner or the linked partner.
- A user cannot add themselves as an accountability partner.
- If `partnerEmail` belongs to an existing user, Prisma stores `partnerId`.
- If the partner has not joined yet, the app can still store `partnerName`.

## Prisma Models Used

`Relationship` stores the connection:

- `ownerId`: the user who created the relationship.
- `partnerId`: optional linked user account.
- `partnerName`: optional name when partner has not joined.
- `status`: active, paused, or ended.

`RelationshipCheckIn` stores reflection history:

- `mood`
- `appreciation`
- `concern`
- `commitment`

## Interview Explanation

You can explain it like this:

DisciplineOS AI includes an accountability partner module. I modeled partner accountability in Prisma with an owner user, an optional linked partner user, and check-in records. In NestJS, I created a protected controller using JWT auth, DTO validation for payload safety, and a service layer for ownership rules. The frontend calls these APIs with the saved JWT token and displays partner check-ins inside the dashboard.

## What We Learned

- How to build a new NestJS feature module.
- How controller, DTO, service, and Prisma work together.
- How to protect routes with JWT auth.
- How to enforce authorization at the service layer.
- How Prisma relations represent owner and accountability partner records.
- How frontend state refreshes after protected API mutations.

## Next Improvement Ideas

- Add shared goals between partners.
- Add partner invitation links.
- Add weekly partner accountability summaries.
- Add AI-generated reflection prompts.
- Add notification reminders for missed check-ins.
