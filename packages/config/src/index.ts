import { z } from 'zod';

const nodeEnvSchema = z.enum(['development', 'test', 'production']).default('development');

export const apiEnvSchema = z
  .object({
    NODE_ENV: nodeEnvSchema,
    PORT: z.coerce.number().int().positive().default(4000),
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),
    CORS_ORIGIN: z.string().default('http://localhost:3000'),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRATION: z.coerce.number().int().positive().default(3600),
    SWAGGER_ENABLED: z.coerce.boolean().default(true),
    OPENAI_API_KEY: z.string().optional(),
  })
  .superRefine((env, context) => {
    if (env.NODE_ENV !== 'production') {
      return;
    }

    const unsafeJwtSecretFragments = ['replace-this', 'local-development', 'dev-secret'];

    if (unsafeJwtSecretFragments.some((fragment) => env.JWT_SECRET.includes(fragment))) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['JWT_SECRET'],
        message: 'Production JWT_SECRET must be a strong unique secret, not a local placeholder.',
      });
    }

    if (env.CORS_ORIGIN.includes('localhost')) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CORS_ORIGIN'],
        message: 'Production CORS_ORIGIN must point to the deployed frontend domain.',
      });
    }

    if (env.DATABASE_URL.includes('postgres:postgres')) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['DATABASE_URL'],
        message: 'Production DATABASE_URL must not use the local postgres/postgres credentials.',
      });
    }
  });

export const webEnvSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('DisciplineOS AI'),
  NEXT_PUBLIC_APP_DESCRIPTION: z
    .string()
    .min(1)
    .default('AI-powered discipline, goals, habits, and accountability partners.'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:4000/api/v1'),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;
export type WebEnv = z.infer<typeof webEnvSchema>;

export const parseApiEnv = (env: Record<string, string | undefined>): ApiEnv =>
  apiEnvSchema.parse(env);

export const parseWebEnv = (env: Record<string, string | undefined>): WebEnv =>
  webEnvSchema.parse(env);
