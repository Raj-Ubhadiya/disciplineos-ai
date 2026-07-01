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
    auth: {
      googleClientId: env.GOOGLE_CLIENT_ID,
      fromEmail: env.AUTH_FROM_EMAIL,
      fromName: env.AUTH_FROM_NAME,
      resendApiKey: env.AUTH_RESEND_API_KEY,
      smtpHost: env.AUTH_SMTP_HOST,
      smtpPort: env.AUTH_SMTP_PORT,
      smtpSecure: env.AUTH_SMTP_SECURE,
      smtpUser: env.AUTH_SMTP_USER,
      smtpPass: env.AUTH_SMTP_PASS,
      smsProvider: env.AUTH_SMS_PROVIDER,
      twilioAccountSid: env.AUTH_TWILIO_ACCOUNT_SID,
      twilioAuthToken: env.AUTH_TWILIO_AUTH_TOKEN,
      twilioFromPhone: env.AUTH_TWILIO_FROM_PHONE,
      otpTtlMinutes: env.AUTH_OTP_TTL_MINUTES,
    },
    openai: {
      apiKey: env.OPENAI_API_KEY,
    },
  };
};
