import { AuthPage } from '@/components/auth/auth-page';
import { env } from '@/env';

export default function LoginPage() {
  return <AuthPage apiUrl={env.NEXT_PUBLIC_API_URL} mode="login" />;
}
