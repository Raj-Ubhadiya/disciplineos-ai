# NestJS + Prisma + PostgreSQL + Auth Flow Revision

This document is for quick revision before interviews or while reading the code.

## 1. Big Picture Flow

When frontend sends a request to the backend:

```text
Frontend
-> main.ts
-> AppModule
-> Feature Module
-> Controller
-> DTO Validation
-> Guard if protected
-> Service
-> PrismaService
-> Prisma Client
-> PostgreSQL
-> Response back to frontend
```

Example login flow:

```text
POST /api/v1/auth/login
-> AuthController.login()
-> LoginDto validates payload
-> AuthService.login()
-> PrismaService.user.findUnique()
-> bcrypt.compare()
-> JwtService.sign()
-> JSON response
```

## 2. `main.ts`

Purpose:

Starts the NestJS backend application.

Important responsibilities:

- Creates Nest app from `AppModule`.
- Enables CORS.
- Adds global route prefix `/api`.
- Enables API versioning like `/api/v1`.
- Adds Helmet security headers.
- Enables global DTO validation.
- Sets up Swagger docs.
- Starts server on configured port.

Interview answer:

> `main.ts` is the bootstrap file. It creates the NestJS application, configures global middleware/pipes/security/docs, and starts listening on the configured port.

## 3. `AppModule`

Purpose:

Root module of the backend.

It imports feature modules:

- `ConfigModule`
- `PrismaModule`
- `AuthModule`
- `HealthModule`
- Later modules like `GoalsModule`, `HabitsModule`

Interview answer:

> `AppModule` is the root module that wires together global configuration, database access, and feature modules.

## 4. Metadata In NestJS

Decorators add metadata.

Example:

```ts
@Module({
  imports: [AuthModule],
})
export class AppModule {}
```

Metadata tells NestJS:

```text
This is a module.
It imports AuthModule.
```

NestJS reads metadata from:

- `@Module`
- `@Controller`
- `@Injectable`
- `@Get`
- `@Post`
- `@UseGuards`

Interview answer:

> Metadata is runtime information attached by decorators. NestJS reads it to build the dependency injection container and route graph.

## 5. Dependency Injection Container

NestJS creates and manages class instances.

Example:

```ts
constructor(private readonly authService: AuthService) {}
```

We do not write:

```ts
new AuthService()
```

NestJS provides it because `AuthService` is registered in providers.

Interview answer:

> Dependency injection lets NestJS create and provide class dependencies automatically, making code more modular and testable.

## 6. Route Graph

NestJS scans controllers and builds route map.

Example:

```ts
@Controller('auth')
export class AuthController {
  @Post('login')
  login() {}
}
```

Route becomes:

```text
POST /api/v1/auth/login
```

Interview answer:

> Route graph is the internal mapping of HTTP methods and URLs to controller methods.

## 7. `AuthModule`

Purpose:

Groups authentication feature.

It imports:

- `PassportModule`
- `JwtModule`
- `PrismaModule`

It registers:

- `AuthController`
- `AuthService`
- `JwtStrategy`

Interview answer:

> `AuthModule` configures JWT authentication, registers auth routes and business logic, imports Prisma for database access, and registers JWT strategy for protected routes.

## 8. Controller

Purpose:

Handles HTTP request and delegates to service.

Example:

```ts
@Post('login')
login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

Controller should:

- Receive request.
- Extract body/params/user.
- Call service.
- Return response.

Controller should not:

- Write complex business logic.
- Directly hash password.
- Directly write database logic.

Interview answer:

> Controllers should stay thin. They handle HTTP-level concerns and delegate business logic to services.

## 9. DTO

DTO stands for:

```text
Data Transfer Object
```

Purpose:

- Defines request body shape.
- Adds validation rules.
- Prevents invalid payload from reaching service.

Example:

```ts
export class SignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
```

Works with:

```ts
ValidationPipe
```

Interview answer:

> DTOs define and validate data moving between client and server. In NestJS they work with ValidationPipe and class-validator.

## 10. `AuthService`

Purpose:

Contains authentication business logic.

Signup does:

```text
Check duplicate email
-> hash password
-> create user
-> generate JWT
-> return sanitized user
```

Login does:

```text
Find user by email
-> compare password with bcrypt
-> generate JWT
-> return sanitized user
```

Token validation does:

```text
Read JWT payload
-> find user by payload.sub
-> return sanitized user
```

Interview answer:

> `AuthService` handles signup, login, password hashing, password verification, JWT generation, token validation, and user sanitization.

## 11. JWT Auth Flow

Signup/login response:

```json
{
  "accessToken": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

Frontend sends token:

```http
Authorization: Bearer <jwt-token>
```

Protected request flow:

```text
@UseGuards(JwtAuthGuard)
-> AuthGuard('jwt')
-> JwtStrategy
-> validate(payload)
-> AuthService.validateToken()
-> req.user
-> controller method runs
```

Interview answer:

> JWT proves user identity. The backend signs it during login, and protected routes verify it through JwtAuthGuard and JwtStrategy.

## 12. `JwtAuthGuard`

Purpose:

Protects routes.

Code idea:

```ts
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

It uses Passport strategy named `jwt`.

Interview answer:

> `JwtAuthGuard` is the gatekeeper for protected routes. It validates JWT before controller logic runs.

## 13. `JwtStrategy`

Purpose:

Extracts and validates JWT.

It:

- Reads token from `Authorization: Bearer <token>`.
- Checks expiration.
- Verifies signature using JWT secret.
- Calls `validate(payload)`.
- Returns authenticated user.

Interview answer:

> `JwtStrategy` converts a valid Bearer token into `req.user`.

## 14. `@GetUser()` Decorator

Purpose:

Clean shortcut for:

```ts
req.user
```

Instead of:

```ts
getProfile(@Request() req) {
  return req.user;
}
```

Use:

```ts
getProfile(@GetUser() user: AuthenticatedUser) {
  return user;
}
```

Interview answer:

> `@GetUser()` is a custom parameter decorator that extracts authenticated user from request after JWT validation.

## 15. Prisma + PostgreSQL Flow

NestJS does not directly talk to PostgreSQL.

Flow:

```text
NestJS Service
-> PrismaService
-> Prisma Client
-> PostgreSQL
```

Example:

```ts
this.prismaService.user.findUnique({
  where: { email },
});
```

Prisma converts this into SQL and queries PostgreSQL.

Interview answer:

> NestJS handles application structure and request flow. Prisma acts as the ORM and talks to PostgreSQL through generated typed client methods.

## 16. `schema.prisma`

Purpose:

Defines database models.

Example:

```prisma
model User {
  id       String @id @default(cuid())
  email    String @unique
  password String
}
```

Prisma uses this schema to:

- Generate Prisma Client.
- Create migrations.
- Type database queries.

Interview answer:

> `schema.prisma` is the source of truth for database structure.

## 17. `PrismaService`

Purpose:

Wraps Prisma Client as a NestJS injectable service.

It:

- Extends Prisma Client.
- Connects on module init.
- Disconnects on module destroy.
- Can be injected into services.

Interview answer:

> `PrismaService` integrates Prisma Client with NestJS dependency injection and lifecycle hooks.

## 18. Authentication vs Authorization

Authentication:

```text
Who is the user?
```

Example:

```text
JWT token is valid.
```

Authorization:

```text
Is this user allowed to access this resource?
```

Example:

```ts
where: {
  id,
  userId: user.id,
}
```

Interview answer:

> Authentication verifies identity. Authorization checks permissions and ownership.

## 19. Response Flow

Controller returns object:

```ts
return this.authService.login(loginDto);
```

NestJS automatically converts it to JSON.

No need to manually write:

```ts
res.json(...)
```

Interview answer:

> NestJS serializes returned controller values into HTTP responses automatically.

## 20. Full Auth Request Flow

Signup:

```text
POST /api/v1/auth/signup
-> SignupDto validation
-> AuthController.signup()
-> AuthService.signup()
-> Prisma checks existing email
-> bcrypt hashes password
-> Prisma creates user
-> JWT generated
-> sanitized response returned
```

Login:

```text
POST /api/v1/auth/login
-> LoginDto validation
-> AuthController.login()
-> AuthService.login()
-> Prisma finds user
-> bcrypt compares password
-> JWT generated
-> sanitized response returned
```

Protected profile:

```text
GET /api/v1/auth/profile
-> JwtAuthGuard
-> JwtStrategy
-> AuthService.validateToken()
-> req.user
-> AuthController.getProfile()
-> JSON response
```

## 21. Key Interview Summary

Use this answer when asked to explain backend flow:

> The request first enters the NestJS app configured in `main.ts`, where global prefix, versioning, validation, CORS, Helmet, and Swagger are configured. `AppModule` wires feature modules like Auth and Prisma. The controller receives the request, DTOs validate the payload, guards protect private routes, and services contain business logic. Services inject `PrismaService` to query PostgreSQL through Prisma Client. For auth, passwords are hashed with bcrypt, JWTs are generated with JwtService, and protected routes use JwtAuthGuard plus JwtStrategy to validate tokens and attach the authenticated user to the request.

