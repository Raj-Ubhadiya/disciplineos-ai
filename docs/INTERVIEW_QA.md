# DisciplineOS AI - Interview Q&A

This file contains interview questions and answers based on this project.

## Project Overview

### Q: What is this project?

DisciplineOS AI is a full-stack AI productivity platform that helps users reduce social media distraction, plan goals, track habits, and use accountability partners for consistency.

### Q: Why did you build this project?

I wanted to build a real SaaS-style application that solves a personal productivity problem and demonstrates full-stack engineering skills: frontend, backend, database, authentication, APIs, and eventually AI integration.

### Q: What tech stack did you use?

I used Next.js for frontend, NestJS for backend, PostgreSQL for database, Prisma as ORM, JWT for auth, bcrypt for password hashing, pnpm workspaces for monorepo, and TypeScript across the stack.

## Monorepo

### Q: What is a monorepo?

A monorepo is a single repository that contains multiple apps and packages. In this project, the frontend, backend, shared types, shared config, and docs live together.

### Q: Why use a monorepo here?

It keeps frontend and backend aligned. Shared types and config can be reused without publishing packages. It also makes project-wide linting, typechecking, and builds easier.

### Q: What is `pnpm-workspace.yaml`?

It tells pnpm which folders are workspace packages. Here it includes `apps/*` and `packages/*`.

## package.json

### Q: What is the purpose of `package.json`?

It is the project manifest. It defines scripts, dependencies, package name, version, package manager, and engine requirements.

### Q: Why does every app/package have its own `package.json`?

Because each workspace package has its own dependencies and scripts. The web app, API app, config package, and types package are separate packages inside one monorepo.

## TypeScript

### Q: Why TypeScript?

TypeScript catches type errors before runtime and makes code easier to refactor. It is especially useful in full-stack apps where frontend and backend share data contracts.

### Q: What is `tsconfig.json`?

It configures TypeScript compilation and typechecking. It defines strictness, module resolution, path aliases, and project references.

### Q: What is `exactOptionalPropertyTypes`?

It makes optional properties stricter. A missing property and a property set to `undefined` are treated differently. This helped us avoid passing accidental `undefined` values to Prisma.

## Next.js

### Q: Why use Next.js instead of plain React?

Next.js provides routing, layouts, server rendering, build optimization, and production conventions on top of React.

### Q: What is a Server Component?

In Next.js App Router, components are Server Components by default. They run on the server and are good for data fetching and static rendering.

### Q: What is a Client Component?

A Client Component runs in the browser and is needed for interactivity like forms, state, effects, localStorage, and click handlers.

### Q: Why is `AppDashboard` a Client Component?

Because it uses `useState`, `useEffect`, form inputs, button clicks, and `localStorage`.

## NestJS

### Q: Why use NestJS?

NestJS gives a structured backend architecture using modules, controllers, services, guards, decorators, and dependency injection.

### Q: What is a module?

A module groups related controllers and providers. For example, `AuthModule` contains auth controller, auth service, JWT strategy, and JWT setup.

### Q: What is a controller?

A controller handles HTTP requests and maps routes to service methods.

### Q: What is a service?

A service contains business logic. Controllers should stay thin and call services.

### Q: What is dependency injection?

Dependency injection means NestJS provides class dependencies automatically. For example, `AuthService` receives `PrismaService` and `JwtService`.

## DTO And Validation

### Q: What is a DTO?

DTO means Data Transfer Object. It defines the expected shape of request data.

### Q: Why use DTOs?

DTOs make API contracts clear and work with validation decorators to reject invalid requests.

### Q: What is `ValidationPipe`?

It validates incoming request bodies against DTO decorators before controller logic runs.

## Authentication

### Q: How does auth work in this project?

The user signs up or logs in. The backend validates credentials and returns a JWT. The frontend sends that JWT in the Authorization header for protected routes.

### Q: Why use bcrypt?

bcrypt hashes passwords before saving them. It prevents storing plain-text passwords.

### Q: Why use JWT?

JWT is a simple stateless way to authenticate API requests. It works well for REST APIs.

### Q: What is `JwtAuthGuard`?

It protects routes by requiring a valid JWT token.

### Q: What is `JwtStrategy`?

It tells Passport how to extract and validate the JWT from the request.

### Q: What is `@GetUser()`?

It is a custom decorator that extracts the authenticated user from the request object.

## Prisma And Database

### Q: Why use Prisma?

Prisma provides type-safe database queries, schema-based models, and migrations.

### Q: What is `schema.prisma`?

It defines the database models, fields, relations, and indexes.

### Q: Why PostgreSQL?

PostgreSQL is reliable, production-grade, and good for relational data with transactions and indexes.

### Q: What is a relation in Prisma?

A relation connects models. For example, one user has many goals, and one goal has many habits.

### Q: What is a migration?

A migration is a versioned database schema change generated from Prisma schema changes.

### Q: What is Prisma Client?

Prisma Client is the generated TypeScript client used to query the database.

## Authorization

### Q: What is the difference between authentication and authorization?

Authentication verifies who the user is. Authorization decides what that user is allowed to access.

### Q: How do you prevent users from accessing other users' data?

Every user-owned query includes `userId: user.id`. For example, finding a goal uses both the goal ID and authenticated user ID.

## Transactions

### Q: Why use a transaction when completing a habit?

Completing a habit creates a completion record and increments the streak. A transaction ensures both writes succeed together or fail together.

## Config

### Q: Why use Zod for environment variables?

Zod validates env values at startup. It also converts values like `JWT_EXPIRATION` from string to number.

### Q: What happens if an env variable is missing?

The app fails early during startup instead of failing later during a request.

## Linting And Formatting

### Q: What is ESLint used for?

ESLint checks code quality rules, import sorting, and type-only imports.

### Q: What is Prettier used for?

Prettier formats code consistently.

### Q: Difference between ESLint and Prettier?

ESLint checks code correctness and conventions. Prettier handles formatting.

## Docker

### Q: Why Docker?

Docker makes local infrastructure repeatable. In this project, it runs PostgreSQL locally.

### Q: What if Docker is not available?

You can install PostgreSQL locally or use a cloud Postgres database and update `DATABASE_URL`.

## Alternatives

### Q: What could replace Next.js?

Vite + React, Remix, Angular, Vue/Nuxt.

### Q: What could replace NestJS?

Express, Fastify, Hono, AdonisJS.

### Q: What could replace Prisma?

Drizzle ORM, TypeORM, Sequelize, raw SQL with `pg`.

### Q: What could replace PostgreSQL?

MySQL, SQLite, MongoDB, Supabase Postgres.

### Q: What could replace JWT auth?

Cookie-based sessions, OAuth, Clerk, Auth0, Supabase Auth.
