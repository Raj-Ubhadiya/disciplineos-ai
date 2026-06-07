import type { ApiHealthResponse, AppMetadata } from '@disciplineos/types';

import { AppDashboard } from '@/components/app-dashboard';
import { FocusDashboard } from '@/components/focus-dashboard';
import { env } from '@/env';
import { getApiV1BaseUrl } from '@/lib/api';

async function getHealth() {
  try {
    const response = await fetch(`${getApiV1BaseUrl(env.NEXT_PUBLIC_API_URL)}/health`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ApiHealthResponse;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const health = await getHealth();
  const app: AppMetadata = {
    name: env.NEXT_PUBLIC_APP_NAME,
    description: env.NEXT_PUBLIC_APP_DESCRIPTION,
    environment: env.NODE_ENV,
  };

  return (
    <main className="min-h-screen px-5 py-6 text-foreground md:px-10 lg:px-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-black/20 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent/80">
              {app.environment}
            </p>
            <p className="mt-1 text-xl font-black text-white">{app.name}</p>
          </div>
          <div className="border border-white/10 bg-white/6 px-4 py-3 font-mono text-sm text-muted">
            API: {health ? `${health.status} / db:${health.database}` : 'offline'}
          </div>
        </header>

        <FocusDashboard />
        <AppDashboard apiUrl={env.NEXT_PUBLIC_API_URL} />

        <section className="grid gap-4 md:grid-cols-3">
          {[
            'Phase 1: database models for profiles, goals, habits, and distractions.',
            'Phase 2: protected NestJS APIs with Prisma and JWT authentication.',
            'Phase 3: polished Next.js dashboard for habit tracking and AI planning.',
          ].map((item) => (
            <div key={item} className="border border-white/10 bg-black/24 p-5 text-sm leading-7 text-muted">
              {item}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
