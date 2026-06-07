# Project Structure And Config Guide

This guide explains the files interviewers commonly ask about. Keep updating it as we build.

## Root Folder

The root folder is the monorepo workspace. It does not contain one single app. It contains multiple apps and shared packages.

Important folders:

- `apps/web`: Next.js frontend.
- `apps/api`: NestJS backend.
- `packages/types`: shared TypeScript types used by both frontend and backend.
- `packages/config`: shared environment validation and TypeScript config presets.
- `docs`: product, learning, and architecture documentation.

Why monorepo:

- Frontend and backend live in one repository.
- Shared types prevent duplicate interfaces.
- One command can run checks across the whole project.
- Easier to keep app, API, and docs aligned.

Alternatives:

- Separate frontend and backend repositories.
- Turborepo or Nx for more advanced monorepo orchestration.
- npm/yarn workspaces instead of pnpm workspaces.

## `package.json`

Purpose:

- Defines the project name.
- Defines scripts such as `dev`, `build`, `lint`, and `typecheck`.
- Defines dependencies and dev dependencies.
- Defines package manager and Node version expectations.

Why we need it:

- Node projects use `package.json` as their manifest.
- Interviewers often ask how scripts are wired.
- In a monorepo, every app/package has its own `package.json`.

Replacement:

- Not really replaceable in Node.js projects.
- Other ecosystems have equivalents, such as `pom.xml` in Java Maven or `pyproject.toml` in Python.

## `pnpm-workspace.yaml`

Purpose:

- Tells pnpm which folders are workspace packages.
- Lets apps import local packages like `@disciplineos/types`.

Why pnpm:

- Fast installation.
- Strict dependency linking.
- Great workspace support.

Alternatives:

- npm workspaces.
- yarn workspaces.
- Nx or Turborepo on top of a package manager.

## `tsconfig.json`

Purpose:

- Configures TypeScript.
- Controls strict type checking.
- Defines path aliases.
- Defines project references in the root config.

Why we need it:

- TypeScript does not know how to compile/check a project without configuration.
- Strict settings catch bugs before runtime.

Alternatives:

- JavaScript without TypeScript, but we lose type safety.
- Different TypeScript settings depending on project maturity.

## `eslint.config.mjs`

Purpose:

- Configures ESLint.
- Enforces code quality rules.
- Enforces sorted imports and type-only imports.

Why we need it:

- Keeps code style consistent.
- Catches mistakes TypeScript may not catch.
- Helps large projects stay maintainable.

Alternatives:

- Biome.
- StandardJS.
- No linting, which is not recommended for professional projects.

## `.prettierrc.json`

Purpose:

- Configures Prettier formatting.
- Keeps spacing, quotes, and commas consistent.

ESLint vs Prettier:

- ESLint checks code correctness and conventions.
- Prettier formats code appearance.

Alternatives:

- Biome formatter.
- dprint.

## `docker-compose.yml`

Purpose:

- Runs PostgreSQL locally in a container.
- Makes local database setup easier and repeatable.

Why we need it:

- Everyone can run the same database version.
- No need to install PostgreSQL manually.

Alternatives:

- Local PostgreSQL installation.
- Cloud database.
- SQLite for simpler learning projects.

## `apps/api`

This is the backend API.

Main technologies:

- NestJS for structured backend architecture.
- Prisma for database access.
- PostgreSQL for data storage.
- JWT for authentication.

NestJS concepts:

- Module: groups related backend code.
- Controller: handles HTTP routes.
- Service: contains business logic.
- DTO: validates request body shape.
- Guard: protects routes.
- Strategy: tells Passport how to validate a token.

## `apps/api/prisma/schema.prisma`

Purpose:

- Defines database models.
- Defines relations between tables.
- Used by Prisma to generate typed database client.

Why Prisma:

- Type-safe database queries.
- Easier migrations.
- Less raw SQL for normal CRUD.

Alternatives:

- TypeORM.
- Drizzle ORM.
- Sequelize.
- Raw SQL with node-postgres.

## `apps/web`

This is the frontend app.

Main technologies:

- Next.js for React app framework.
- Tailwind CSS for styling.
- TypeScript for type safety.

Next.js concepts:

- `app/page.tsx`: route page.
- `app/layout.tsx`: shared layout.
- Server Component: runs on server by default.
- Client Component: interactive component using hooks/events.

Alternatives:

- Vite + React.
- Remix.
- Angular.
- Vue/Nuxt.

## Current Learning Focus

Phase 1 learning topics:

- How modules/controllers/services work in NestJS.
- How DTO validation protects APIs.
- How JWT auth creates protected routes.
- How Prisma models map to database tables.
- How shared types move data contracts across frontend and backend.

