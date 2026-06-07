import { parseApiEnv } from '@disciplineos/config';

export const configuration = () => {
  const env = parseApiEnv(process.env);

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    databaseUrl: env.DATABASE_URL,
    corsOrigin: env.CORS_ORIGIN,
    swaggerEnabled: env.SWAGGER_ENABLED,
    jwt: {
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRATION,
    },
    openai: {
      apiKey: env.OPENAI_API_KEY,
    },
  };
};
