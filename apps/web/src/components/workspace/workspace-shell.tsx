'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button, Card, cx } from '@/components/ui';
import { useWorkspace } from '@/components/workspace/workspace-provider';
import { ToneBanner } from '@/components/workspace/workspace-ui';

const navItems = [
  ['Dashboard', '/app/dashboard', 'DB'],
  ['Today Plan', '/app/today', 'TD'],
  ['Goals', '/app/goals', 'GL'],
  ['Habits', '/app/habits', 'HB'],
  ['Focus Sessions', '/app/focus-sessions', 'FC'],
  ['Reflections', '/app/reflections', 'RF'],
  ['Profile', '/app/profile', 'PR'],
] as const;

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, feedback, isBooting, signOut, analyticsSummary, dailyPlan, focusSessionSummary } =
    useWorkspace();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const focusScore = analyticsSummary?.focusScore ?? 0;
  const focusMinutes = focusSessionSummary?.totalMinutes ?? 0;
  const currentTarget = dailyPlan?.primaryGoal?.title ?? "Choose today's target";

  if (isBooting) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <Card className="w-full max-w-lg border-white/70 bg-white/92 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">
            Loading workspace
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            Bringing today&apos;s discipline board online
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Syncing goals, habits, focus sessions, reminders, and reflections.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen">
        <aside
          className={cx(
            'fixed inset-y-0 left-0 z-40 w-[min(286px,calc(100vw-2rem))] overflow-y-auto overflow-x-hidden border-r border-slate-200 bg-white p-4 shadow-2xl shadow-slate-950/10 transition duration-300 lg:sticky lg:top-0 lg:block lg:h-screen lg:shadow-none',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0',
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <Link href="/app/dashboard" className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                DO
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">DisciplineOS AI</p>
                <p className="text-xs text-slate-500">Daily discipline</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              className="min-h-10 rounded-lg px-3 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              Close
            </Button>
          </div>

          <div className="mt-8">
            <p className="mb-2 px-2 text-xs font-semibold text-slate-500">
              Workspace
            </p>
            <div className="grid gap-1">
              {navItems.map(([label, href, short]) => {
                const isActive = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cx(
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                      isActive
                        ? 'bg-slate-950 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                    )}
                  >
                    <span
                      className={cx(
                        'flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-bold uppercase transition',
                        isActive
                          ? 'bg-white text-slate-950'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-white',
                      )}
                    >
                      {short}
                    </span>
                    <span className="flex-1">{label}</span>
                    {isActive ? (
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold text-slate-500">Account</p>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                Ready
              </span>
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-slate-950">
              {user?.name ?? user?.email ?? 'Discipline builder'}
            </p>
            <p className="mt-1 truncate text-xs text-slate-500">{user?.email ?? ''}</p>
            <Button
              type="button"
              variant="secondary"
              onClick={signOut}
              className="mt-4 min-h-10 w-full rounded-lg border-slate-200 bg-white px-4 text-slate-700 shadow-none hover:bg-slate-100"
            >
              Log out
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-10 rounded-lg border-slate-200 bg-white px-3 text-slate-950 shadow-none lg:hidden"
                  onClick={() => setIsSidebarOpen((value) => !value)}
                >
                  Menu
                </Button>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Synced
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {new Intl.DateTimeFormat('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    }).format(new Date())}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                  {focusScore} focus score
                </div>
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                  {focusMinutes} min logged
                </div>
                <div className="hidden max-w-xs truncate rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 md:block">
                  {currentTarget}
                </div>
              </div>
            </div>
            {feedback ? (
              <div className="mt-4">
                <ToneBanner tone={feedback.tone}>{feedback.text}</ToneBanner>
              </div>
            ) : null}
          </header>

          <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
