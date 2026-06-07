# Phase 10 - Today Focus Plan Notes

## What We Built

This phase adds a daily command-center feature.

Backend endpoint:

- `GET /api/v1/daily-plan/today`

Frontend feature:

- Dashboard shows a Today Focus Plan with action steps, focus minutes, distraction shield, and partner nudge.

## Why We Built It

The app already stores many useful things:

- Goals
- Habits
- Habit completions
- Reminders
- Distractions
- Accountability partners

But users do not only need data. They need a clear next action.

The Today Focus Plan turns existing data into a practical daily plan.

## Important Architecture Idea

This feature does not need a new database table yet.

It is a derived read model.

Simple meaning:

```text
Read existing data -> calculate today's plan -> send response to frontend
```

This is useful when the output can be recalculated from existing records.

## Backend Flow

1. User calls `GET /api/v1/daily-plan/today`.
2. `JwtAuthGuard` authenticates the request.
3. `DailyPlanController` receives the request.
4. `DailyPlanService` queries profile, goals, habits, reminders, distractions, and relationships.
5. Service builds action steps.
6. API returns the daily plan.

## What The Service Calculates

- `headline`: main focus message for today.
- `focusMinutes`: preferred focus minutes from user profile.
- `primaryGoal`: highest-priority active goal.
- `nextHabits`: habits not completed today.
- `dueReminders`: pending reminders due today.
- `distractionShield`: top distraction and replacement action.
- `partnerNudge`: accountability message.
- `actionSteps`: simple checklist for today.

## Why This Is Good Product Design

Most productivity apps become storage systems.

DisciplineOS should become a decision system.

Instead of only saying:

```text
Here are your goals.
```

It says:

```text
Here is what to do today.
```

## Interview Explanation

You can explain it like this:

I added a Today Focus Plan endpoint as a derived read model. It aggregates data from profile, goals, habits, reminders, distractions, and partner relationships, then returns a practical daily plan. I kept it as a service-level calculation instead of creating a table because the data can be derived from existing records. This keeps the system simpler while still improving the product experience.

## Files To Revise

- `apps/api/src/daily-plan/daily-plan.controller.ts`
- `apps/api/src/daily-plan/daily-plan.service.ts`
- `apps/api/src/daily-plan/daily-plan.module.ts`
- `apps/api/src/app.module.ts`
- `apps/web/src/components/app-dashboard.tsx`
- `packages/types/src/index.ts`

## Future Improvements

- Save daily plans as history.
- Add AI-generated daily coaching messages.
- Add calendar view.
- Add morning/evening reflection.
- Send daily plan by email or push notification.
