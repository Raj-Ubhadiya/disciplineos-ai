import { AuthPage } from '@/components/auth/auth-page';
import { env } from '@/env';

export default function SignupPage() {
  return <AuthPage apiUrl={env.NEXT_PUBLIC_API_URL} mode="signup" />;
}
