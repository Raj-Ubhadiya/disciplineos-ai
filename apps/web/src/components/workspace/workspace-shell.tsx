'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button, Card, cx } from '@/components/ui';
import { useWorkspace } from '@/components/workspace/workspace-provider';
import { PillStat, ToneBanner } from '@/components/workspace/workspace-ui';

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.16),transparent_22%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.08),transparent_28%),linear-gradient(180deg,#fbfcff_0%,#f3f7fc_52%,#edf2f8_100%)]">
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/28 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-4 md:px-6 lg:px-8">
        <aside
          className={cx(
            'fixed inset-y-4 left-3 z-40 w-[min(300px,calc(100vw-1.5rem))] overflow-y-auto overflow-x-hidden rounded-[36px] border border-slate-800/60 bg-[linear-gradient(180deg,#0b1434_0%,#15224d_46%,#101c41_100%)] p-5 text-white shadow-[0_30px_90px_rgba(15,23,42,0.32)] transition duration-300 lg:sticky lg:top-4 lg:block',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0',
          )}
        >
          <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_right,rgba(124,114,255,0.4),transparent_38%),radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_30%)]" />
          <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.7)_50%,transparent_100%)]" />
          <div className="relative flex items-center justify-between gap-3">
            <Link href="/app/dashboard" className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#6d6eff_0%,#22c55e_100%)] text-sm font-black text-white shadow-[0_16px_35px_rgba(79,70,229,0.35)] ring-1 ring-white/20">
                DO
              </div>
              <div>
                <p className="text-sm font-semibold text-white">DisciplineOS AI</p>
                <p className="text-xs text-slate-300">Clarity engine</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              className="border border-white/15 bg-white/10 text-white hover:bg-white/16 hover:text-white lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              Close
            </Button>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.05)_100%)] p-4 backdrop-blur-sm">
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)]" />
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                Today at a glance
              </p>
              <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Live
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              <PillStat label="Focus score" value={analyticsSummary?.focusScore ?? 0} />
              <PillStat
                label={"Today's priority"}
                value={dailyPlan?.primaryGoal?.title ?? 'Pick one clear target'}
              />
              <PillStat
                label="Focus minutes"
                value={`${focusSessionSummary?.totalMinutes ?? 0} min logged`}
              />
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Workspace
            </p>
            <div className="grid gap-2">
              {navItems.map(([label, href, short]) => {
                const isActive = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cx(
                      'group flex items-center gap-3 rounded-[24px] px-4 py-3 text-sm font-medium transition',
                      isActive
                        ? 'bg-[linear-gradient(135deg,rgba(109,110,255,0.28)_0%,rgba(14,165,233,0.22)_100%)] text-white shadow-[0_18px_34px_rgba(79,70,229,0.14),inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                        : 'text-slate-300 hover:bg-white/8 hover:text-white',
                    )}
                  >
                    <span
                      className={cx(
                        'flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-bold uppercase tracking-[0.18em] transition',
                        isActive
                          ? 'bg-white text-indigo-700 shadow-[0_10px_24px_rgba(255,255,255,0.2)]'
                          : 'bg-white/10 text-slate-200 group-hover:bg-white/14',
                      )}
                    >
                      {short}
                    </span>
                    <span className="flex-1">{label}</span>
                    {isActive ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)]" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_100%)] p-4 backdrop-blur-sm">
            <div className="absolute inset-x-10 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.45)_50%,transparent_100%)]" />
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Account</p>
              <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">
                Ready
              </span>
            </div>
            <p className="mt-2 text-base font-semibold text-white">
              {user?.name ?? user?.email ?? 'Discipline builder'}
            </p>
            <p className="mt-1 text-sm text-slate-300">{user?.email ?? ''}</p>
            <Button
              type="button"
              variant="secondary"
              onClick={signOut}
              className="mt-4 w-full border-white/70 bg-white text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.18)] hover:border-white hover:bg-slate-100 hover:text-slate-950"
            >
              Log out
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:pl-2">
          <header className="sticky top-4 z-30 mb-6 overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.88)_0%,rgba(248,251,255,0.86)_48%,rgba(240,246,255,0.82)_100%)] px-5 py-4 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ui-reveal">
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(99,102,241,0.55)_18%,rgba(14,165,233,0.45)_50%,rgba(34,197,94,0.4)_82%,transparent_100%)]" />
            <div className="absolute -right-10 top-0 h-24 w-24 rounded-full bg-[rgba(79,70,229,0.1)] blur-3xl" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="border-slate-300 bg-white text-slate-950 shadow-[0_12px_28px_rgba(15,23,42,0.08)] lg:hidden"
                  onClick={() => setIsSidebarOpen((value) => !value)}
                >
                  Menu
                </Button>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-700">
                      Workspace live
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-950">
                    {new Intl.DateTimeFormat('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    }).format(new Date())}
                  </p>
                  <p className="text-sm text-slate-600">
                    Keep the next action obvious, calm, and small enough to finish.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-full border border-indigo-200/70 bg-[linear-gradient(180deg,rgba(238,242,255,0.9)_0%,rgba(224,231,255,0.72)_100%)] px-4 py-2 text-sm font-semibold text-indigo-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                  {focusScore} focus score
                </div>
                <div className="rounded-full border border-cyan-200/70 bg-[linear-gradient(180deg,rgba(240,249,255,0.92)_0%,rgba(224,242,254,0.75)_100%)] px-4 py-2 text-sm font-semibold text-cyan-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  {focusMinutes} min logged
                </div>
                <div className="rounded-full border border-slate-200/80 bg-white/78 px-4 py-2 text-sm text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.05)] backdrop-blur">
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

          <div className="pb-8 ui-reveal-delayed">{children}</div>
        </div>
      </div>
    </div>
  );
}
