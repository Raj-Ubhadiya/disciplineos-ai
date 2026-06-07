# Phase 7 - Analytics And Focus Score Notes

## What We Built

This phase adds analytics to DisciplineOS AI.

Backend endpoint:

- `GET /api/v1/analytics/summary`

Frontend features:

- Focus score card.
- Active goals count.
- Total habits count.
- Total streak count.
- Distraction minutes lost.
- Top distraction platform.

## Why We Built It

Goals, habits, distractions, AI plans, and partner check-ins create data. Analytics turns that data into feedback.

Without analytics, the user only logs activity. With analytics, the user can understand whether discipline is improving.

## Backend Flow

1. Frontend calls `GET /api/v1/analytics/summary`.
2. `JwtAuthGuard` authenticates the user.
3. `AnalyticsController` receives the request.
4. `AnalyticsService` queries multiple Prisma models.
5. Service calculates totals and focus score.
6. NestJS returns summary JSON to the dashboard.

## Models Used

Analytics reads from existing tables:

- `Goal`
- `Habit`
- `HabitCompletion`
- `DistractionLog`
- `RelationshipCheckIn`
- `AiPlan`

No new database table was needed because this summary is derived from existing records.

## Focus Score Logic

The score rewards positive discipline signals:

- Active goals
- Habits
- Habit completions
- Streaks
- Accountability check-ins
- AI plans generated

The score penalizes distraction minutes.

The result is clamped between `0` and `100`.

## Interview Explanation

You can explain it like this:

I added an analytics module that aggregates user activity across goals, habits, distractions, AI plans, and accountability check-ins. The endpoint is protected by JWT and uses Prisma queries to calculate a focus score. I kept analytics as a derived read model first, instead of adding extra tables prematurely.
