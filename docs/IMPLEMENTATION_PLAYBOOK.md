# DisciplineOS AI - Implementation Playbook

This document explains how we build features in this project.

## Standard Backend Feature Pattern

For each backend feature, we usually create:

```text
feature/
  dto/
    create-feature.dto.ts
    update-feature.dto.ts
    index.ts
  feature.controller.ts
  feature.service.ts
  feature.module.ts
  index.ts
```

## Why This Pattern

- DTO files validate request data.
- Controller files define HTTP routes.
- Service files contain business logic.
- Module files register everything with NestJS.
- `index.ts` files make imports cleaner.

## Step-by-Step: Adding A New Backend Module

### Step 1: Add Prisma Model

Example:

```prisma
model Goal {
  id        String   @id @default(cuid())
  userId    String
  title     String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Step 2: Run Migration

```bash
corepack pnpm --filter @disciplineos/api prisma:migrate -- --name add_goals
```

### Step 3: Create DTOs

DTOs define request body shape.

```ts
export class CreateGoalDto {
  title!: string;
}
```

### Step 4: Create Service

Service contains business logic and Prisma calls.

```ts
create(user: AuthenticatedUser, dto: CreateGoalDto) {
  return this.prisma.goal.create({
    data: {
      userId: user.id,
      title: dto.title,
    },
  });
}
```

### Step 5: Create Controller

Controller maps HTTP routes to service methods.

```ts
@Post()
create(@GetUser() user: AuthenticatedUser, @Body() dto: CreateGoalDto) {
  return this.goalsService.create(user, dto);
}
```

### Step 6: Protect Routes

Use:

```ts
@UseGuards(JwtAuthGuard)
```

Why:

- Only logged-in users can access the route.

### Step 7: Register Module

Add the feature module to `AppModule`.

```ts
imports: [GoalsModule]
```

### Step 8: Verify

Run:

```bash
corepack pnpm --filter @disciplineos/api lint
corepack pnpm --filter @disciplineos/api typecheck
corepack pnpm --filter @disciplineos/api build
```

## Standard Frontend Feature Pattern

For frontend features, we usually create:

```text
components/
  feature-dashboard.tsx
lib/
  api.ts
app/
  page.tsx
```

## Client Component Rule

Use `'use client'` only when a component needs:

- `useState`
- `useEffect`
- `localStorage`
- button clicks
- form input state
- browser APIs

Do not use Client Components for static display-only UI unless needed.

## API Request Pattern

Frontend calls backend like this:

```ts
await fetch(`${apiBaseUrl}/goals`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(payload),
});
```

## Auth Flow

1. User signs up or logs in.
2. Backend returns JWT.
3. Frontend stores JWT.
4. Frontend sends JWT to protected routes.
5. Backend guard validates JWT.
6. Controller receives authenticated user.

## Ownership Flow

Every user-owned resource must include `userId`.

When reading/updating/deleting:

```ts
where: {
  id,
  userId: user.id,
}
```

Why:

- Prevents one user from accessing another user's data.

## Transaction Rule

Use a transaction when multiple writes must succeed together.

Example:

- Create habit completion.
- Increment habit streak.

Both should happen together, so we use:

```ts
this.prisma.$transaction(...)
```

## Strict TypeScript Rule

Do not pass accidental `undefined` into Prisma data.

Good:

```ts
data: {
  title: dto.title,
  ...(dto.description ? { description: dto.description } : {}),
}
```

Risky:

```ts
data: {
  title: dto.title,
  description: dto.description,
}
```

Why:

- With `exactOptionalPropertyTypes`, optional fields are stricter.
- Prisma expects actual values or null for nullable fields.

## Feature Build Checklist

Use this checklist for every new feature:

- Add/update Prisma model.
- Run migration.
- Add DTOs.
- Add service.
- Add controller.
- Add module.
- Add ownership checks.
- Add frontend types.
- Add frontend UI.
- Run lint.
- Run typecheck.
- Run build.
- Add phase notes.

