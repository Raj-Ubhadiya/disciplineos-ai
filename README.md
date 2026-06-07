# DisciplineOS AI

DisciplineOS AI is a full-stack discipline and focus platform for reducing social media distraction, planning meaningful goals, tracking habits, logging focus sessions, reflecting daily, and using accountability partners.

## Core Features

- JWT authentication and protected workspace
- User profile and dream/focus setup
- Goals, habits, and habit completion tracking
- Focus sessions as a replacement behavior for social media scrolling
- Distraction logs with trigger and replacement-action tracking
- AI-style discipline planner with plan activation into goals, habits, and reminders
- Accountability partners, check-ins, and shared goals
- Reminders and Today Focus Plan
- Daily reflections and integrated analytics/focus score

## Application Goal

DisciplineOS AI helps users reduce social media attraction and become more disciplined by converting dreams into daily action. The app does not only store goals; it guides the user through a full discipline loop:

```text
Dream -> AI plan -> Goals -> Habits -> Focus sessions -> Reflection -> Analytics -> Better next day
```

The product is designed for students, developers, entrepreneurs, creators, and anyone who wants to stay focused on long-term goals instead of getting pulled into short-term digital distractions.

## Frontend Features

The frontend is a Next.js dashboard that gives the user one focused workspace.

- Landing/focus hero explaining the DisciplineOS concept.
- Authentication UI for signup and login.
- Protected dashboard after JWT login.
- User profile form for dream, life focus, distractions, reminder tone, and focus minutes.
- Analytics panel showing focus score, goals, habits, streaks, distraction minutes, focus minutes, reflection average, and distraction-free sessions.
- Today Focus Plan showing the user's current action plan and focus progress.
- Reminder creation and upcoming reminder list.
- Focus session form to log deep-work blocks with duration, energy, linked goal, linked habit, and distraction-free status.
- Evening reflection form for mood, wins, blockers, distractions, tomorrow commitment, and focus score.
- AI planner form to generate a discipline plan and activate it into real goals, habits, and reminders.
- Goal creation with private/shared accountability partner selection.
- Habit creation with linked goal and completion button.
- Accountability partner management with check-ins.
- Distraction logging with platform, minutes lost, trigger, mood, and replacement action.
- Recent activity cards for goals, habits, focus sessions, reflections, reminders, relationships, and distractions.

## Backend Features

The backend is a NestJS API with PostgreSQL persistence through Prisma.

- JWT authentication with signup, login, and authenticated user endpoint.
- Password hashing with bcrypt.
- Global DTO validation with whitelist and unknown-field rejection.
- API versioning under `/api/v1`.
- Helmet security middleware.
- CORS configuration for frontend/backend deployment.
- Swagger API documentation in development.
- Health check endpoint with database connectivity status.
- Prisma ORM integration with PostgreSQL.
- Production migration scripts using `prisma migrate deploy`.
- User profile module.
- Goals module with CRUD and shared accountability goal support.
- Habits module with CRUD and daily completion tracking.
- Focus sessions module with summary metrics and ownership checks.
- Distraction tracker module with summary aggregation.
- AI planner module with deterministic plan generation and plan activation.
- Reminders module with create, update, complete, delete, and upcoming reminders.
- Accountability relationships module with partner records and check-ins.
- Daily reflections module with summary metrics.
- Analytics module that calculates focus score from goals, habits, distractions, partners, AI plans, focus sessions, and reflections.
- Today Focus Plan module that aggregates user data into daily action steps.

## Main User Flow

1. User signs up or logs in.
2. User defines their dream, focus area, and biggest distractions.
3. User generates an AI discipline plan.
4. User activates the plan into goals, habits, and reminders.
5. User logs focus sessions instead of scrolling social media.
6. User tracks distractions and replacement actions.
7. User works with accountability partners and shared goals.
8. User saves an evening reflection.
9. Analytics and Today Focus Plan update based on real activity.
10. User repeats the loop with better clarity the next day.

## API Modules

- `auth`: signup, login, JWT authentication, current user.
- `profile`: user dream, focus, distractions, reminder preferences.
- `goals`: private/shared goals and goal management.
- `habits`: habits, goal-linked habits, completion tracking.
- `focus-sessions`: deep-work session tracking.
- `distractions`: social media/distraction logs and summaries.
- `ai-planner`: generated plans and activation into trackable records.
- `reminders`: discipline reminders and completion.
- `relationships`: accountability partners and check-ins.
- `reflections`: daily reflection history and summary.
- `analytics`: focus score and productivity metrics.
- `daily-plan`: today's recommended action plan.
- `health`: API/database health status.

## Tech Stack

- Frontend: Next.js, React, TypeScript
- Backend: NestJS, JWT, Swagger, Helmet, DTO validation
- Database: PostgreSQL
- ORM: Prisma
- Monorepo: pnpm workspaces
- Shared packages: `@disciplineos/types`, `@disciplineos/config`

## Local Setup

```bash
corepack pnpm install
```

Create local env files:

```bash
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env.local
```

Start PostgreSQL locally or use Docker:

```bash
docker compose up -d
```

Run migrations:

```bash
corepack pnpm db:migrate
```

Start both apps:

```bash
corepack pnpm dev
```

Local URLs:

- Web: `http://localhost:3000`
- API health: `http://localhost:4000/api/v1/health`
- Swagger docs: `http://localhost:4000/api/docs`

## Production Commands

Use migration deploy in production, not migration dev:

```bash
corepack pnpm db:deploy
corepack pnpm build
corepack pnpm --filter @disciplineos/api start:prod
corepack pnpm --filter @disciplineos/web start
```

Full local verification:

```bash
corepack pnpm verify
```

## Environment Files

Development examples:

- `apps/api/.env.example`
- `apps/web/.env.example`

Production examples:

- `apps/api/.env.production.example`
- `apps/web/.env.production.example`

Production must use:

- Strong unique `JWT_SECRET`
- Hosted PostgreSQL `DATABASE_URL`
- Deployed frontend domain in `CORS_ORIGIN`
- Deployed backend URL in `NEXT_PUBLIC_API_URL`
- `SWAGGER_ENABLED=false` unless API docs are intentionally public

## Deployment

Read [DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full frontend, backend, and database launch checklist.

Read [PRODUCTION_CHECKLIST.md](docs/PRODUCTION_CHECKLIST.md) before each release.

For our selected provider setup, read [NEON_RENDER_VERCEL_RUNBOOK.md](docs/NEON_RENDER_VERCEL_RUNBOOK.md).

## Learning Docs

Read [LEARNING_GUIDE_INDEX.md](docs/LEARNING_GUIDE_INDEX.md) to revise the architecture, stack, and phase-by-phase implementation.
