import { parseWebEnv } from '@disciplineos/config';

export const env = parseWebEnv({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
