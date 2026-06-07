# DisciplineOS AI - Tech Stack Deep Dive

This document explains the technologies used in the project, why we use them, how they work here, and what alternatives exist.

## 1. TypeScript

### What It Is

TypeScript is JavaScript with static types.

### Why We Use It

- Catches many bugs before runtime.
- Gives better autocomplete.
- Makes frontend and backend contracts clearer.
- Helps interviewers see professional engineering habits.

### How We Use It Here

- Backend files use `.ts`.
- Frontend React files use `.tsx`.
- Shared interfaces live in `packages/types`.
- Strict type settings are enabled through shared `tsconfig` files.

### Alternatives

- JavaScript: simpler, but less type safety.
- Flow: older Facebook type checker, rarely used now.

### Interview Answer

> I use TypeScript because it gives compile-time safety, better refactoring, and clearer API contracts between frontend and backend.

## 2. Monorepo Architecture

### What It Is

A monorepo keeps multiple apps and packages in one repository.

### Why We Use It

- Frontend and backend live together.
- Shared types and config can be reused.
- One command can check the whole project.
- Easier to maintain consistency.

### How We Use It Here

```text
apps/web       -> Next.js frontend
apps/api       -> NestJS backend
packages/types -> shared TypeScript types
packages/config -> shared config and tsconfig presets
docs           -> learning and product docs
```

### Alternatives

- Separate frontend and backend repositories.
- Nx monorepo.
- Turborepo monorepo.
- npm or yarn workspaces.

### Interview Answer

> I chose a monorepo so frontend, backend, shared types, and shared config stay synchronized in one codebase.

## 3. pnpm

### What It Is

pnpm is a fast JavaScript package manager.

### Why We Use It

- Strong workspace support.
- Faster and more disk-efficient than npm in many projects.
- Strict dependency structure catches missing dependency mistakes.

### How We Use It Here

- `pnpm-workspace.yaml` defines workspace packages.
- Root `package.json` runs commands across packages.
- Apps import local packages like `@disciplineos/types`.

### Alternatives

- npm
- Yarn
- Bun

### Interview Answer

> pnpm gives fast installs and strong workspace linking, which is useful for monorepo projects.

## 4. Next.js

### What It Is

Next.js is a React framework for building production web applications.

### Why We Use It

- File-based routing.
- Server Components.
- Production build optimization.
- Good developer experience.
- Strong industry adoption.

### How We Use It Here

- `apps/web/src/app/page.tsx` is the homepage.
- `apps/web/src/app/layout.tsx` is the root layout.
- `AppDashboard` is a Client Component because it uses state, forms, localStorage, and button actions.

### Alternatives

- Vite + React.
- Remix.
- Angular.
- Vue/Nuxt.

### Interview Answer

> I use Next.js because it gives React a production-ready structure with routing, rendering options, optimization, and a scalable app architecture.

## 5. React

### What It Is

React is a UI library for building component-based interfaces.

### Why We Use It

- Component reuse.
- Strong ecosystem.
- Works naturally with Next.js.
- Good for interactive dashboards.

### How We Use It Here

- `FocusDashboard` shows the product hero.
- `AppDashboard` handles auth, profile, goals, and habits UI.
- React state stores form data and API results.

### Alternatives

- Vue
- Angular
- Svelte
- Solid

### Interview Answer

> React helps break UI into reusable components and manage interactive state cleanly.

## 6. Tailwind CSS

### What It Is

Tailwind CSS is a utility-first CSS framework.

### Why We Use It

- Fast UI development.
- Consistent spacing, colors, and responsive styles.
- No need to create many custom CSS class names.

### How We Use It Here

- Styling is mostly inline class utilities.
- Global theme variables are in `apps/web/src/app/globals.css`.

### Alternatives

- Plain CSS modules.
- Sass.
- Styled Components.
- Chakra UI.
- Material UI.

### Interview Answer

> Tailwind helps build consistent UI quickly using utility classes while still allowing custom visual direction.

## 7. NestJS

### What It Is

NestJS is a Node.js backend framework built around modules, controllers, services, decorators, and dependency injection.

### Why We Use It

- Scalable backend structure.
- Familiar architecture for developers from Angular/Spring-like backgrounds.
- Great for REST APIs.
- Works well with validation, guards, Swagger, and Prisma.

### How We Use It Here

- `AuthModule` handles authentication.
- `ProfileModule` handles user profile.
- `GoalsModule` handles goals.
- `HabitsModule` handles habits.
- `PrismaModule` provides database access.

### Alternatives

- Express.
- Fastify.
- Hono.
- AdonisJS.

### Interview Answer

> NestJS gives a structured backend architecture, making large APIs easier to organize, test, and maintain.

## 8. Prisma ORM

### What It Is

Prisma is an ORM that generates a type-safe database client from a schema file.

### Why We Use It

- Type-safe database queries.
- Easy model definitions.
- Migration support.
- Good TypeScript experience.

### How We Use It Here

- Database models are in `apps/api/prisma/schema.prisma`.
- `PrismaService` wraps Prisma Client for NestJS dependency injection.
- Services use `this.prisma.goal.findMany()`, `this.prisma.habit.create()`, etc.

### Alternatives

- Drizzle ORM.
- TypeORM.
- Sequelize.
- Raw SQL with `pg`.

### Interview Answer

> Prisma gives type-safe database access and migrations, which reduces mistakes when working with relational data.

## 9. PostgreSQL

### What It Is

PostgreSQL is a relational database.

### Why We Use It

- Production-grade.
- Strong relational data support.
- Transactions.
- Indexes.
- Reliable for SaaS applications.

### How We Use It Here

Data stored includes:

- Users
- Profiles
- Goals
- Habits
- Habit completions
- Distraction logs
- Relationships

### Alternatives

- MySQL.
- SQLite.
- MongoDB.
- Supabase Postgres.

### Interview Answer

> PostgreSQL is reliable for structured relational data and supports transactions, indexes, and relations needed by SaaS applications.

## 10. JWT

### What It Is

JWT means JSON Web Token. It is a signed token used to prove user identity.

### Why We Use It

- Simple auth for APIs.
- Works with mobile/web clients.
- Stateless token verification.

### How We Use It Here

- User signs up or logs in.
- Backend signs JWT with user ID and email.
- Frontend sends token as `Authorization: Bearer <token>`.
- `JwtAuthGuard` protects routes.

### Alternatives

- Server-side sessions.
- HTTP-only cookie auth.
- OAuth providers.
- Clerk/Auth0/Supabase Auth.

### Interview Answer

> JWT is used to authenticate API requests. The backend signs the token and validates it on protected routes.

## 11. bcrypt

### What It Is

bcrypt is a password hashing library.

### Why We Use It

- Passwords must not be stored in plain text.
- bcrypt salts and hashes passwords.
- It is intentionally slow to resist brute force attacks.

### How We Use It Here

- Signup hashes the password.
- Login compares plain password with stored hash.

### Alternatives

- Argon2.
- scrypt.

### Interview Answer

> bcrypt protects passwords by storing only salted hashes, not plain-text passwords.

## 12. Zod

### What It Is

Zod is a TypeScript-first validation library.

### Why We Use It

- Validates environment variables.
- Converts strings into correct types.
- Fails fast when config is wrong.

### How We Use It Here

- `packages/config/src/index.ts` validates API and web env variables.
- `JWT_EXPIRATION` is converted from string to number with `z.coerce.number()`.

### Alternatives

- Joi.
- Yup.
- Valibot.
- envalid.

### Interview Answer

> I use Zod for env validation so configuration errors are caught during startup instead of causing runtime bugs.

## 13. ESLint

### What It Is

ESLint checks code quality and rules.

### Why We Use It

- Finds problematic patterns.
- Enforces import sorting.
- Enforces type-only imports.

### Alternatives

- Biome.
- StandardJS.
- No linting.

### Interview Answer

> ESLint keeps code quality consistent and catches issues beyond TypeScript type errors.

## 14. Prettier

### What It Is

Prettier formats code.

### Why We Use It

- Avoids formatting debates.
- Keeps code style consistent.

### Alternatives

- Biome formatter.
- dprint.

### Interview Answer

> Prettier handles formatting, while ESLint handles code quality rules.

## 15. Docker

### What It Is

Docker runs applications and services in containers.

### Why We Use It

- Easy local PostgreSQL setup.
- Same database environment across machines.
- Helpful for production-like development.

### How We Use It Here

`docker-compose.yml` defines a PostgreSQL container.

### Alternatives

- Install PostgreSQL locally.
- Use a cloud database.
- Use SQLite for local-only learning.

### Interview Answer

> Docker makes local infrastructure reproducible. In this project, it runs PostgreSQL without requiring manual database installation.

