# Phase 6 - AI Planner Notes

## What We Built

This phase adds an AI Planner module that turns a user dream into a structured discipline plan.

Backend endpoints:

- `POST /api/v1/ai-plans`
- `GET /api/v1/ai-plans`
- `POST /api/v1/ai-plans/:id/activate`

Frontend features:

- User enters dream, current situation, obstacle, and optional role model.
- App generates a discipline plan.
- App saves generated plans in PostgreSQL.
- Dashboard shows the latest plan, first suggested goal, and first suggested habit.
- User can activate the plan into real Goal, Habit, and Reminder records.

## Why We Built It

The main product idea is not just tracking tasks. DisciplineOS AI should help a user decide what to do next.

The AI Planner gives the user:

- Suggested goals
- Suggested habits
- Distraction strategy
- Weekly action plan
- Mentor-style discipline story

Activation then converts selected suggestions into actionable records in the existing Goals, Habits, and Reminders modules.

## Important Production Note

In this first version, the planner uses deterministic generation logic inside `AiPlannerService`.

That means the feature works without an OpenAI API key. Later, we can replace the internal generation function with a real AI provider while keeping the same controller, DTO, database model, and frontend UI.

This is a good architecture because the app feature is not tightly coupled to one AI vendor.

## Backend Flow

1. Frontend sends a protected request to `POST /api/v1/ai-plans`.
2. `JwtAuthGuard` authenticates the user.
3. `CreateAiPlanDto` validates request body.
4. `AiPlannerController` passes the request to service.
5. `AiPlannerService` generates structured plan data.
6. Prisma saves the plan in the `AiPlan` table.
7. NestJS returns saved plan JSON to the frontend.

## Activation Flow

1. Frontend calls `POST /api/v1/ai-plans/:id/activate`.
2. Backend confirms the plan belongs to the authenticated user.
3. `AiPlannerService` reads `suggestedGoals` and `suggestedHabits`.
4. Prisma transaction creates multiple `Goal`, `Habit`, and `Reminder` records.
5. If any create fails, the transaction rolls back.
6. Frontend refreshes workspace and shows the new goals, habits, and reminders.

This makes the AI Planner useful because suggestions become real trackable actions with reminders attached.

## Database Change

We added a new Prisma model:

```prisma
model AiPlan {
  id                  String   @id @default(cuid())
  userId              String
  dream               String
  currentSituation    String?
  mainObstacle        String?
  suggestedGoals      Json
  suggestedHabits     Json
  distractionStrategy Json
  weeklyPlan          Json
  mentorStory         String
  createdAt           DateTime @default(now())
}
```

We created this using a real migration:

```bash
prisma migrate dev --name add_ai_plans
```

This is the team/industry approach because schema changes are saved as migration files in Git.

## Interview Explanation

You can explain it like this:

I built an AI Planner feature that accepts a user dream and generates a structured discipline plan. The backend uses NestJS with protected JWT routes, DTO validation, and a service layer. The generated plan is stored in PostgreSQL through Prisma. I also added an activation endpoint that converts AI suggestions into real goals, habits, and reminders using a Prisma transaction. I used a deterministic planner first so the feature works without external API dependency, but the service is designed so an OpenAI provider can be plugged in later.

## What We Learned

- How to add a new Prisma model.
- How to create a real migration instead of using `db push`.
- How to store structured JSON in PostgreSQL using Prisma `Json`.
- How to create a new NestJS feature module.
- How to keep AI/provider logic inside the service layer.
- How frontend calls protected AI planner endpoints.
