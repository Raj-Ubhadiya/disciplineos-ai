# Phase 1 Notes - Auth And Profile

## What We Built

Backend modules added:

- `AuthModule`
- `ProfileModule`

Auth endpoints:

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

Profile endpoints:

- `GET /api/v1/profile`
- `PATCH /api/v1/profile`

## Files Added

Auth:

- `apps/api/src/auth/auth.module.ts`
- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/auth/auth.service.ts`
- `apps/api/src/auth/strategies/jwt.strategy.ts`
- `apps/api/src/auth/guards/jwt-auth.guard.ts`
- `apps/api/src/auth/decorators/get-user.decorator.ts`
- `apps/api/src/auth/dto/signup.dto.ts`
- `apps/api/src/auth/dto/login.dto.ts`
- `apps/api/src/auth/dto/auth-response.dto.ts`

Profile:

- `apps/api/src/profile/profile.module.ts`
- `apps/api/src/profile/profile.controller.ts`
- `apps/api/src/profile/profile.service.ts`
- `apps/api/src/profile/dto/update-profile.dto.ts`

Docs:

- `docs/PROJECT_STRUCTURE_AND_CONFIG_GUIDE.md`
- `docs/PHASE_1_AUTH_PROFILE_NOTES.md`

## Concepts To Learn

### NestJS Module

A module groups related code. `AuthModule` groups auth controller, service, JWT config, and strategy.

Interview answer:

> A NestJS module is a boundary for related providers and controllers. It helps organize features and control dependency injection.

### Controller

A controller receives HTTP requests and returns responses.

Example:

- `AuthController` handles signup, login, and current-user routes.
- `ProfileController` handles profile read/update.

Interview answer:

> Controllers should stay thin. They validate route input and call services. Business logic belongs in services.

### Service

A service contains business logic.

Example:

- `AuthService` hashes passwords, validates credentials, signs JWTs.
- `ProfileService` reads and updates profile data through Prisma.

Interview answer:

> Services keep business rules reusable and testable instead of placing logic directly inside controllers.

### DTO

DTO means Data Transfer Object. It defines and validates incoming request data.

Example:

- `SignupDto`
- `LoginDto`
- `UpdateProfileDto`

Interview answer:

> DTOs define request shape and combine well with validation pipes to reject invalid input before business logic runs.

### Guard

A guard decides whether a request can access a route.

Example:

- `JwtAuthGuard` protects routes that require login.

Interview answer:

> Guards are used for authorization and route protection. In this project, the JWT guard checks whether the request has a valid bearer token.

### Strategy

A Passport strategy defines how authentication works.

Example:

- `JwtStrategy` extracts bearer token, validates it, and attaches the user to the request.

Interview answer:

> The strategy handles token extraction and validation. The guard triggers the strategy on protected routes.

### Decorator

A decorator adds reusable behavior or metadata.

Example:

- `@GetUser()` extracts the authenticated user from the request.

Interview answer:

> Custom decorators reduce repeated request-access code and make controllers cleaner.

### JWT

JWT means JSON Web Token.

Why we use it:

- After login, backend signs a token.
- Frontend sends token in `Authorization: Bearer <token>`.
- Backend verifies the token for protected routes.

Alternative:

- Cookie-based sessions.
- OAuth provider sessions.
- External auth providers like Clerk/Auth0.

### Bcrypt

Bcrypt hashes passwords before saving them.

Why we use it:

- Passwords must never be stored as plain text.
- Bcrypt adds salt and computational cost.

Alternative:

- Argon2, often considered stronger for modern password hashing.

### Prisma

Prisma is the ORM.

Why we use it:

- Type-safe database queries.
- Models are defined in `schema.prisma`.
- Prisma Client gives autocomplete and compile-time checks.

Alternative:

- Drizzle ORM.
- TypeORM.
- Raw SQL with `pg`.

## Important Config Learning

### `JWT_EXPIRATION`

Environment values are strings by default. We parse `JWT_EXPIRATION` with `z.coerce.number()` in `packages/config`.

Why:

- `.env` gives `"3600"`.
- `@nestjs/jwt` expects a typed number or duration.
- Shared config converts and validates it once.

Interview answer:

> I use Zod for environment validation so bad config fails at startup, not later in production.

## Verification Completed

- `@disciplineos/api lint`
- `@disciplineos/api typecheck`
- `@disciplineos/api build`
- Full monorepo `typecheck`

