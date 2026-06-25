'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui';
import { useWorkspace } from '@/components/workspace/workspace-provider';
import {
  Button,
  Card,
  EmptyState,
  Field,
  MissionCard,
  PageHeader,
  ProgressBar,
  SectionTitle,
  Select,
  StatCard,
  Textarea,
} from '@/components/workspace/workspace-ui';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function getPartnerLabel(relationship: {
  partner?: { name: string | null; email: string } | null;
  partnerName: string | null;
}) {
  return relationship.partner?.name ?? relationship.partnerName ?? relationship.partner?.email ?? 'Partner';
}

function formatGoalCount(count: number) {
  return `${count} ${count === 1 ? 'goal' : 'goals'}`;
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-indigo-100 text-indigo-700 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.08)]'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[22px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,249,255,0.92)_100%)] px-4 py-3 shadow-[0_16px_34px_rgba(15,23,42,0.05)]">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}

export function DashboardPage() {
  const { analyticsSummary, habits, goals, focusSessionSummary, reflections, dailyPlan, user } =
    useWorkspace();

  const completedHabitsToday = habits.filter((habit) =>
    habit.completions?.some(
      (completion) => new Date(completion.completedAt).toDateString() === new Date().toDateString(),
    ),
  ).length;

  const recentActivity = reflections.slice(0, 3).map((item) => ({
    title: `Reflection: ${item.mood}`,
    detail: item.tomorrowCommitment ?? item.wins ?? 'Reflection saved',
    timestamp: item.createdAt,
  }));

  const focusScore = analyticsSummary?.focusScore ?? 0;
  const streak = analyticsSummary?.totalStreak ?? 0;
  const focusMinutes = focusSessionSummary?.totalMinutes ?? 0;
  const topAction = dailyPlan?.primaryGoal?.title ?? "Create today's target";
  const morningAction =
    dailyPlan?.nextHabits[0]?.title ?? dailyPlan?.primaryGoal?.title ?? 'Pick one clear target for today';

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back${user?.name ? `, ${user.name}` : ''}`}
        description="See today's priority, protect one focus block, and keep momentum steady."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/today"
              className="rounded-2xl bg-[linear-gradient(135deg,var(--color-brand)_0%,var(--color-brand-secondary)_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.22)]"
            >
              Open today plan
            </Link>
            <Link
              href="/app/focus-sessions"
              className="rounded-2xl border border-white/80 bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--color-text)] shadow-[0_14px_32px_rgba(15,23,42,0.06)] backdrop-blur"
            >
              Start focus session
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="relative overflow-hidden border-indigo-300/35 bg-[linear-gradient(135deg,#101a44_0%,#2e3ec8_52%,#5f6dff_100%)] text-white shadow-[0_30px_90px_rgba(67,56,202,0.26)]">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.95)_50%,transparent_100%)]" />
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-white/14 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-36 w-36 rounded-full bg-cyan-300/16 blur-3xl" />
          <div className="absolute right-10 top-16 h-24 w-24 rounded-full border border-white/12 bg-white/6 blur-2xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-100 backdrop-blur">
                Today&apos;s priority
              </div>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                {dailyPlan?.headline ?? 'Choose one meaningful win before the day gets noisy.'}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100">
                {dailyPlan?.primaryGoal?.whyItMatters ??
                  'Make the next action obvious, small enough to finish, and linked to something that matters.'}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-indigo-100">Focus score</p>
                  <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-white">{focusScore}</p>
                </div>
                <div className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-indigo-100">Current streak</p>
                  <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-white">{streak}</p>
                </div>
                <div className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-indigo-100">Focus minutes</p>
                  <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-white">{focusMinutes}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/app/focus-sessions"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-[0_16px_36px_rgba(255,255,255,0.18)]"
                >
                  Start focus
                </Link>
                <Link
                  href="/app/habits"
                  className="rounded-2xl border border-white/18 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur"
                >
                  Review habits
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                ['Start here', morningAction],
                ['Focus block', `${dailyPlan?.focusMinutesDone ?? 0}/${dailyPlan?.focusMinutes ?? 25} minutes protected`],
                [
                  'Close the day',
                  dailyPlan?.latestReflection?.tomorrowCommitment ??
                    'Write one sentence about what would make today feel complete.',
                ],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-100">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-indigo-100">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <SectionTitle
            title="Momentum snapshot"
            copy="The essentials for today."
          />
          <div className="grid gap-3">
            <DetailRow
              label="Active goals"
              value={formatGoalCount(analyticsSummary?.activeGoals ?? goals.length)}
            />
            <DetailRow
              label="Focus minutes"
              value={`${focusSessionSummary?.totalMinutes ?? 0} minutes logged`}
            />
            <DetailRow label="Reflections" value={`${reflections.length} entries saved`} />
            <DetailRow label="Habits" value={`${habits.length} active habits`} />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Focus score"
          value={focusScore}
          detail="Your current momentum."
        />
        <StatCard
          label="Current streak"
          value={streak}
          detail="Days of consistency."
          tone="success"
        />
        <StatCard
          label="Habits today"
          value={completedHabitsToday}
          detail="Finished so far."
          tone="success"
        />
        <StatCard
          label="Focus minutes"
          value={focusMinutes}
          detail="Protected today."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <SectionTitle
            title="Quick actions"
            copy="Jump into the next action."
          />
          <div className="grid gap-3 md:grid-cols-2">
            {([
              ['Complete habit', '/app/habits'],
              ['Open today plan', '/app/today'],
              ['Write reflection', '/app/reflections'],
              ['Adjust profile', '/app/profile'],
            ] as const).map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="group rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#f4f8ff_100%)] p-5 text-sm font-semibold text-[var(--color-text)] shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(23,32,51,0.1)]"
              >
                <span className="block text-base text-slate-950">{label}</span>
                <span className="mt-2 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400 transition group-hover:text-indigo-600">
                  Open page
                </span>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <SectionTitle
            title="Today&apos;s target"
            copy="Keep one outcome visible."
          />
          <div className="rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
            <p className="text-lg font-semibold text-[var(--color-text)]">{topAction}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
              {dailyPlan?.primaryGoal?.whyItMatters ??
                'Choose one clear goal so the day feels directed instead of scattered.'}
            </p>
            <div className="mt-5 grid gap-3">
              <DetailRow
                label="Active goals"
                value={formatGoalCount(analyticsSummary?.activeGoals ?? goals.length)}
              />
              <DetailRow
                label="Reflection average"
                value={`${analyticsSummary?.averageReflectionScore ?? 0}`}
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
        <SectionTitle title="Recent activity" copy="Your latest updates." />
        {recentActivity.length ? (
          <div className="grid gap-3 md:grid-cols-3">
            {recentActivity.map((item) => (
              <div
                key={`${item.title}-${item.timestamp}`}
                className="rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)]"
              >
                <p className="font-semibold text-[var(--color-text)]">{item.title}</p>
                <p className="mt-2 text-sm text-[var(--color-text-soft)]">{item.detail}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                  {formatDateTime(item.timestamp)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recent activity yet"
            copy="Start one habit or one focus session to begin."
            ctaHref="/app/today"
            ctaLabel="Open today plan"
          />
        )}
      </Card>
    </div>
  );
}

export function TodayPlanPage() {
  const { dailyPlan, reminders, completeReminder } = useWorkspace();

  const progress =
    dailyPlan && dailyPlan.focusMinutes > 0
      ? (dailyPlan.focusMinutesDone / dailyPlan.focusMinutes) * 100
      : 20;

  const steps = [
    {
      step: '1',
      title: 'Complete priority habit',
      copy:
        dailyPlan?.nextHabits[0]?.title ??
        'Choose the smallest habit that proves today has started well.',
    },
    {
      step: '2',
      title: 'Start a focus session',
      copy: `${dailyPlan?.focusMinutesDone ?? 0}/${dailyPlan?.focusMinutes ?? 25} minutes logged toward today's mission.`,
      progress,
    },
    {
      step: '3',
      title: 'Protect your focus block',
      copy:
        dailyPlan?.distractionShield.replacementAction ??
        'Reduce interruptions and keep the current task small enough to finish.',
    },
    {
      step: '4',
      title: 'Write evening reflection',
      copy:
        dailyPlan?.latestReflection?.tomorrowCommitment ??
        'End the day by naming what worked and what tomorrow needs.',
    },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Today plan"
        title="Your plan for today"
        description="Move through the day in a simple order: start, focus, finish, reflect."
      />

      <Card className="relative overflow-hidden border-indigo-300/35 bg-[linear-gradient(135deg,#171f58_0%,#4f46e5_58%,#22c55e_150%)] text-white shadow-[0_30px_90px_rgba(79,70,229,0.24)]">
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.92)_50%,transparent_100%)]" />
        <div className="absolute -right-10 top-0 h-36 w-36 rounded-full bg-white/14 blur-3xl" />
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-100">Today&apos;s headline</p>
        <h2 className="mt-3 text-3xl font-black">
          {dailyPlan?.headline ?? "Generate today's plan after logging in and creating your first goals."}
        </h2>
        <div className="mt-6 max-w-xl">
          <ProgressBar value={progress} />
        </div>
        <p className="mt-3 text-sm text-indigo-100">
          {dailyPlan?.focusMinutesDone ?? 0} / {dailyPlan?.focusMinutes ?? 25} focus minutes completed
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/app/focus-sessions"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-[0_16px_36px_rgba(255,255,255,0.18)]"
          >
            Start focus session
          </Link>
          <Link
            href="/app/reflections"
            className="rounded-2xl border border-white/18 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur"
          >
            Write reflection
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4">
          {steps.map((item) => (
            <MissionCard key={item.step} {...item} />
          ))}
        </div>

        <div className="grid gap-4">
          <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <SectionTitle title="Today's priority goal" />
            <p className="text-lg font-semibold text-[var(--color-text)]">
              {dailyPlan?.primaryGoal?.title ?? 'No priority goal selected yet'}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
              {dailyPlan?.primaryGoal?.whyItMatters ??
                'Create a goal that is clear enough to guide today.'}
            </p>
          </Card>

          <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <SectionTitle title="Daily checklist" />
            <div className="grid gap-3">
              <DetailRow label="Priority habit" value={dailyPlan?.nextHabits[0]?.title ?? 'Choose one habit'} />
              <DetailRow
                label="Focus block"
                value={`${dailyPlan?.focusMinutes ?? 25} minutes planned`}
              />
              <DetailRow
                label="Reflection"
                value={dailyPlan?.latestReflection ? 'Prompt ready' : 'Write one short review tonight'}
              />
            </div>
          </Card>

          <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <SectionTitle title="Reminder list" />
            <div className="grid gap-3">
              {(dailyPlan?.dueReminders ?? reminders.slice(0, 3)).map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#f4f8ff_100%)] p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)]"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">{reminder.title}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                      {formatDateTime(reminder.scheduledAt)}
                    </p>
                  </div>
                  <Button type="button" variant="secondary" onClick={() => completeReminder(reminder.id)}>
                    Complete
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function AiPlannerPage() {
  const { aiPlans, activateAiPlan, createAiPlan, isPending } = useWorkspace();
  const [form, setForm] = useState({
    dream: '',
    currentSituation: '',
    mainObstacle: 'social media distraction',
    roleModel: '',
  });

  const latestPlan = aiPlans[0];

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="AI planner"
        title="Generate a discipline plan"
        description="Turn your goal and obstacle into a practical plan."
      />

      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(246,249,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <SectionTitle
            title="Plan input"
            copy="Describe what you want help building."
          />
          <div className="mb-5 flex flex-wrap gap-2">
            {['Ship my portfolio', 'Study without phone relapse', 'Build deep work consistency'].map(
              (prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setForm({ ...form, dream: prompt })}
                  className="rounded-full border border-indigo-100/80 bg-indigo-50/90 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100"
                >
                  {prompt}
                </button>
              ),
            )}
          </div>
          <div className="grid gap-4">
            <Field label="Dream">
              <Textarea
                value={form.dream}
                onChange={(event) => setForm({ ...form, dream: event.target.value })}
                placeholder="Describe the disciplined life or outcome you want."
              />
            </Field>
            <Field label="Current situation">
              <Input
                value={form.currentSituation}
                onChange={(event) => setForm({ ...form, currentSituation: event.target.value })}
                placeholder="What is true today?"
              />
            </Field>
            <Field label="Main obstacle">
              <Input
                value={form.mainObstacle}
                onChange={(event) => setForm({ ...form, mainObstacle: event.target.value })}
                placeholder="What keeps breaking momentum?"
              />
            </Field>
            <Field label="Role model">
              <Input
                value={form.roleModel}
                onChange={(event) => setForm({ ...form, roleModel: event.target.value })}
                placeholder="Optional: who inspires your discipline?"
              />
            </Field>
            <Button type="button" disabled={isPending || form.dream.length < 5} onClick={() => createAiPlan(form)}>
              {isPending ? 'Generating...' : 'Generate plan'}
            </Button>
          </div>
        </Card>

        {latestPlan ? (
          <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(244,248,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <SectionTitle
            title={latestPlan.dream}
              copy="Review the plan, then activate it."
              action={
                <Button type="button" onClick={() => activateAiPlan(latestPlan.id)} disabled={isPending}>
                  Activate plan
                </Button>
              }
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#f5f8ff_100%)] p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
                <p className="text-sm font-semibold text-[var(--color-brand)]">Suggested goals</p>
                <div className="mt-3 grid gap-3">
                  {latestPlan.suggestedGoals.map((goal) => (
                    <div key={goal.title} className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#eef3ff_100%)] p-4">
                      <p className="font-semibold text-[var(--color-text)]">{goal.title}</p>
                      <p className="mt-2 text-sm text-[var(--color-text-soft)]">{goal.whyItMatters}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="border-white/80 bg-[linear-gradient(180deg,#ffffff_0%,#f5fbff_100%)] p-5 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
                <p className="text-sm font-semibold text-emerald-700">Suggested habits</p>
                <div className="mt-3 grid gap-3">
                  {latestPlan.suggestedHabits.map((habit) => (
                    <div key={habit.title} className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#eefbff_100%)] p-4">
                      <p className="font-semibold text-[var(--color-text)]">{habit.title}</p>
                      <p className="mt-2 text-sm text-[var(--color-text-soft)]">
                        {habit.frequency}
                        {habit.reminderTime ? ` / ${habit.reminderTime}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Card>
        ) : (
          <EmptyState
            title="No AI plan generated yet"
            copy="Describe your goal to generate your first plan."
          />
        )}
      </div>
    </div>
  );
}

export function GoalsPage() {
  const { createGoal, goals, relationships, isPending } = useWorkspace();
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    title: '',
    category: 'personal',
    whyItMatters: '',
    relationshipId: '',
  });

  const visibleGoals = goals.filter((goal) => {
    if (filter === 'shared') {
      return Boolean(goal.relationshipId);
    }
    if (filter === 'active') {
      return goal.status === 'active';
    }
    if (filter === 'completed') {
      return goal.status === 'completed';
    }
    return true;
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Goals"
        title="Goals that guide the week"
        description="Keep goals clear, practical, and easy to review."
      />

      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <SectionTitle title="Create a goal" copy="Add one goal that matters right now." />
          <div className="grid gap-4">
            <Field label="Goal title">
              <Input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Finish my portfolio launch"
              />
            </Field>
            <Field label="Category">
              <Input
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                placeholder="personal"
              />
            </Field>
            <Field label="Share with accountability partner">
              <Select
                value={form.relationshipId}
                onChange={(event) => setForm({ ...form, relationshipId: event.target.value })}
              >
                <option value="">Private goal</option>
                {relationships.map((relationship) => (
                  <option key={relationship.id} value={relationship.id}>
                    {getPartnerLabel(relationship)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Why it matters">
              <Textarea
                value={form.whyItMatters}
                onChange={(event) => setForm({ ...form, whyItMatters: event.target.value })}
                placeholder="Why is this worth your time and attention?"
              />
            </Field>
            <Button type="button" disabled={isPending || form.title.length < 3} onClick={() => createGoal(form)}>
              Add goal
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <SectionTitle title="Goal filter" />
            <div className="flex flex-wrap gap-3">
              {['all', 'active', 'completed', 'shared'].map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  active={filter === option}
                  onClick={() => setFilter(option)}
                />
              ))}
            </div>
          </Card>

          {visibleGoals.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {visibleGoals.map((goal) => (
                <Card key={goal.id} className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(244,248,255,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.05)]">
                  <p className="text-lg font-semibold text-[var(--color-text)]">{goal.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-soft)]">
                    {goal.whyItMatters ?? goal.category}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 font-semibold text-indigo-700">
                      {goal.status}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                      {goal.category}
                    </span>
                    {goal.relationship ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                        Shared with {getPartnerLabel(goal.relationship)}
                      </span>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No goals yet"
              copy="Create your first goal so your daily work has a clear direction."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function HabitsPage() {
  const { habits, goals, completeHabit, createHabit, isPending } = useWorkspace();
  const [form, setForm] = useState({
    title: '',
    goalId: '',
    reminderTime: '',
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Habits"
        title="Habits that keep you moving"
        description="Track simple actions you want to repeat every day."
      />

      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <SectionTitle title="Add a habit" copy="Start with one habit you can actually finish." />
          <div className="grid gap-4">
            <Field label="Habit title">
              <Input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Code before checking social apps"
              />
            </Field>
            <Field label="Linked goal">
              <Select value={form.goalId} onChange={(event) => setForm({ ...form, goalId: event.target.value })}>
                <option value="">No linked goal</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Reminder time">
              <Input
                value={form.reminderTime}
                onChange={(event) => setForm({ ...form, reminderTime: event.target.value })}
                placeholder="07:30"
              />
            </Field>
            <Button type="button" disabled={isPending || form.title.length < 3} onClick={() => createHabit(form)}>
              Add habit
            </Button>
          </div>
        </Card>

        {habits.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {habits.map((habit) => (
              <Card key={habit.id} className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(244,248,255,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.05)]">
                <p className="text-lg font-semibold text-[var(--color-text)]">{habit.title}</p>
                <p className="mt-2 text-sm text-[var(--color-text-soft)]">
                  Streak: {habit.currentStreak} / {habit.goal?.title ?? 'No linked goal'}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <ProgressBar value={Math.min(100, habit.currentStreak * 10)} />
                  </div>
                  <Button type="button" variant="secondary" onClick={() => completeHabit(habit.id)}>
                    Complete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No habits yet"
            copy="Add your first habit to start building a repeatable routine."
          />
        )}
      </div>
    </div>
  );
}

export function FocusSessionsPage() {
  const { createFocusSession, focusSessions, focusSessionSummary, goals, habits, isPending } =
    useWorkspace();
  const [form, setForm] = useState({
    title: '',
    durationMinutes: '25',
    goalId: '',
    habitId: '',
    energyLevel: 'steady',
    distractionFree: true,
    note: '',
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Focus sessions"
        title="Protect time for focused work"
        description="Start a session, stay with one task, and log the work clearly."
      />

      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(238,242,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <SectionTitle
            title="Start focus session"
            copy="Use this when you want to protect a block of attention."
          />
          <div className="relative mb-5 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1f2454_0%,#4338ca_58%,#6d6eff_100%)] p-6 text-white shadow-[0_26px_70px_rgba(67,56,202,0.18)]">
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.85)_50%,transparent_100%)]" />
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-100">Focus timer</p>
            <p className="mt-3 text-5xl font-black">{form.durationMinutes}:00</p>
            <p className="mt-3 text-sm text-indigo-100">
              Set the next block of work before you begin.
            </p>
          </div>
          <div className="grid gap-4">
            <Field label="Session title">
              <Input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Ship a visible weekly milestone"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Duration minutes">
                <Input
                  type="number"
                  value={form.durationMinutes}
                  onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })}
                />
              </Field>
              <Field label="Energy level">
                <Input
                  value={form.energyLevel}
                  onChange={(event) => setForm({ ...form, energyLevel: event.target.value })}
                  placeholder="steady"
                />
              </Field>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Linked goal">
                <Select value={form.goalId} onChange={(event) => setForm({ ...form, goalId: event.target.value })}>
                  <option value="">No linked goal</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Linked habit">
                <Select value={form.habitId} onChange={(event) => setForm({ ...form, habitId: event.target.value })}>
                  <option value="">No linked habit</option>
                  {habits.map((habit) => (
                    <option key={habit.id} value={habit.id}>
                      {habit.title}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Note">
              <Textarea
                value={form.note}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
                placeholder="What should this session help you finish?"
              />
            </Field>
            <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)]">
              <input
                type="checkbox"
                checked={form.distractionFree}
                onChange={(event) => setForm({ ...form, distractionFree: event.target.checked })}
              />
              Mark as distraction-free
            </label>
            <Button type="button" disabled={isPending || form.title.length < 3} onClick={() => createFocusSession(form)}>
              Log focus session
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Sessions" value={focusSessionSummary?.totalSessions ?? 0} detail="Total logged focus sessions." />
            <StatCard label="Hours" value={focusSessionSummary?.totalHours ?? 0} detail="Focused work time in hours." />
            <StatCard label="Distraction-free" value={focusSessionSummary?.distractionFreeSessions ?? 0} detail="Sessions marked as protected." tone="success" />
          </div>
          {focusSessions.length ? (
            <div className="grid gap-4">
              {focusSessions.map((session) => (
              <Card key={session.id} className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(244,248,255,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.05)]">
                  <p className="text-lg font-semibold text-[var(--color-text)]">{session.title}</p>
                  <p className="mt-2 text-sm text-[var(--color-text-soft)]">
                    {session.durationMinutes} min / {session.energyLevel ?? 'steady energy'} /{' '}
                    {session.distractionFree ? 'distraction-free' : 'mixed focus'}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
                    {session.note ?? session.goal?.title ?? session.habit?.title ?? 'No note recorded'}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No focus sessions yet"
              copy="Start with one short session. A small start is enough."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function DistractionsPage() {
  const { createDistractionLog, distractionLogs, distractionSummary, isPending } = useWorkspace();
  const [form, setForm] = useState({
    platform: 'Instagram',
    minutesLost: '15',
    triggerReason: '',
    moodBefore: '',
    moodAfter: '',
    replacementAction: '',
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Distractions"
        title="Notice the pattern, then choose better"
        description="This page uses non-judgmental language and quick logging so awareness becomes useful instead of heavy."
      />

      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <SectionTitle title="Log a distraction" copy="Capture what happened without making the page feel like punishment." />
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Platform">
                <Input value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value })} />
              </Field>
              <Field label="Minutes lost">
                <Input type="number" value={form.minutesLost} onChange={(event) => setForm({ ...form, minutesLost: event.target.value })} />
              </Field>
            </div>
            <Field label="Trigger reason">
              <Input
                value={form.triggerReason}
                onChange={(event) => setForm({ ...form, triggerReason: event.target.value })}
                placeholder="What pulled you in?"
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Mood before">
                <Input value={form.moodBefore} onChange={(event) => setForm({ ...form, moodBefore: event.target.value })} />
              </Field>
              <Field label="Mood after">
                <Input value={form.moodAfter} onChange={(event) => setForm({ ...form, moodAfter: event.target.value })} />
              </Field>
            </div>
            <Field label="Replacement action">
              <Textarea
                value={form.replacementAction}
                onChange={(event) => setForm({ ...form, replacementAction: event.target.value })}
                placeholder="Walk, water, stretch, write one sentence, return to task..."
              />
            </Field>
            <Button type="button" disabled={isPending} onClick={() => createDistractionLog(form)}>
              Log distraction
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Total logs" value={distractionSummary?.totalLogs ?? 0} detail="Awareness entries recorded so far." tone="warning" />
            <StatCard label="Minutes lost" value={distractionSummary?.totalMinutesLost ?? 0} detail="Time noticed and measured." tone="warning" />
            <StatCard label="Top platform" value={distractionSummary?.topPlatform ?? 'None'} detail="The platform currently most associated with lost time." />
          </div>
          <Card className="bg-[linear-gradient(180deg,#fffdf5_0%,#ffffff_100%)]">
            <SectionTitle title="Pattern insight" />
            <p className="text-sm leading-7 text-[var(--color-text-soft)]">
              {distractionSummary?.latestReplacementAction ??
                'Notice the pattern. Choose a better action next time.'}
            </p>
          </Card>
          {distractionLogs.length ? (
            <div className="grid gap-4">
              {distractionLogs.map((log) => (
              <Card key={log.id} className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(244,248,255,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.05)]">
                  <p className="text-lg font-semibold text-[var(--color-text)]">
                    {log.platform} / {log.minutesLost} min
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-text-soft)]">
                    {log.triggerReason ?? 'No trigger noted'} / {log.moodBefore ?? 'unknown mood'} to{' '}
                    {log.moodAfter ?? 'unknown mood'}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
                    {log.replacementAction ?? 'No replacement action recorded'}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No distraction logs yet"
              copy="Log the first pattern you notice. Shame is not the goal; clarity is."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function AccountabilityPage() {
  const { createRelationship, createRelationshipCheckIn, relationships, isPending } =
    useWorkspace();
  const [partnerForm, setPartnerForm] = useState({
    partnerEmail: '',
    partnerName: '',
  });
  const [checkInForm, setCheckInForm] = useState({
    relationshipId: '',
    mood: 'focused',
    appreciation: '',
    concern: '',
    commitment: '',
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Accountability"
        title="Support the discipline system with real people"
        description="Partner cards and check-ins make progress social without turning the app into noisy chat."
      />

      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="grid gap-4">
          <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <SectionTitle title="Add partner" copy="Bring one encouraging person into the loop when shared follow-through helps." />
            <div className="grid gap-4">
              <Field label="Partner name">
                <Input
                  value={partnerForm.partnerName}
                  onChange={(event) => setPartnerForm({ ...partnerForm, partnerName: event.target.value })}
                />
              </Field>
              <Field label="Partner email">
                <Input
                  type="email"
                  value={partnerForm.partnerEmail}
                  onChange={(event) => setPartnerForm({ ...partnerForm, partnerEmail: event.target.value })}
                />
              </Field>
              <Button type="button" disabled={isPending} onClick={() => createRelationship(partnerForm)}>
                Add partner
              </Button>
            </div>
          </Card>

          <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <SectionTitle title="Send check-in" copy="Keep accountability lightweight and consistent." />
            <div className="grid gap-4">
              <Field label="Partner">
                <Select
                  value={checkInForm.relationshipId}
                  onChange={(event) => setCheckInForm({ ...checkInForm, relationshipId: event.target.value })}
                >
                  <option value="">Choose accountability partner</option>
                  {relationships.map((relationship) => (
                    <option key={relationship.id} value={relationship.id}>
                      {getPartnerLabel(relationship)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Mood">
                <Input
                  value={checkInForm.mood}
                  onChange={(event) => setCheckInForm({ ...checkInForm, mood: event.target.value })}
                />
              </Field>
              <Field label="Appreciation">
                <Input
                  value={checkInForm.appreciation}
                  onChange={(event) => setCheckInForm({ ...checkInForm, appreciation: event.target.value })}
                />
              </Field>
              <Field label="Concern">
                <Input
                  value={checkInForm.concern}
                  onChange={(event) => setCheckInForm({ ...checkInForm, concern: event.target.value })}
                />
              </Field>
              <Field label="Commitment">
                <Input
                  value={checkInForm.commitment}
                  onChange={(event) => setCheckInForm({ ...checkInForm, commitment: event.target.value })}
                />
              </Field>
              <Button
                type="button"
                disabled={isPending || !checkInForm.relationshipId}
                onClick={() => createRelationshipCheckIn(checkInForm)}
              >
                Save check-in
              </Button>
            </div>
          </Card>
        </div>

        {relationships.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {relationships.map((relationship) => (
              <Card key={relationship.id} className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(244,248,255,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.05)]">
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {getPartnerLabel(relationship)}
                </p>
                <p className="mt-2 text-sm capitalize text-[var(--color-text-soft)]">{relationship.status}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-soft)]">
                  {relationship.checkIns?.[0]?.commitment ??
                    relationship.checkIns?.[0]?.appreciation ??
                    'No check-in yet'}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No partners yet"
            copy="Add an accountability partner when you want a little more structure and shared follow-through."
          />
        )}
      </div>
    </div>
  );
}

export function ReflectionsPage() {
  const { createReflection, reflectionSummary, reflections, isPending } = useWorkspace();
  const [form, setForm] = useState({
    mood: 'focused',
    wins: '',
    blockers: '',
    distractions: '',
    tomorrowCommitment: '',
    focusScore: '70',
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Reflections"
        title="End the day with clarity"
        description="Review what worked, what got in the way, and what tomorrow needs."
      />

      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <SectionTitle title="Daily reflection" copy="Keep it short, honest, and useful." />
          <div className="grid gap-4">
            <Field label="Mood">
              <Input value={form.mood} onChange={(event) => setForm({ ...form, mood: event.target.value })} />
            </Field>
            <Field label="Wins">
              <Textarea value={form.wins} onChange={(event) => setForm({ ...form, wins: event.target.value })} />
            </Field>
            <Field label="Blockers">
              <Textarea value={form.blockers} onChange={(event) => setForm({ ...form, blockers: event.target.value })} />
            </Field>
            <Field label="Distractions">
              <Textarea value={form.distractions} onChange={(event) => setForm({ ...form, distractions: event.target.value })} />
            </Field>
            <Field label="Tomorrow commitment">
              <Textarea
                value={form.tomorrowCommitment}
                onChange={(event) => setForm({ ...form, tomorrowCommitment: event.target.value })}
              />
            </Field>
            <Field label="Focus score">
              <Input
                type="number"
                value={form.focusScore}
                onChange={(event) => setForm({ ...form, focusScore: event.target.value })}
              />
            </Field>
            <Button type="button" disabled={isPending} onClick={() => createReflection(form)}>
              Save reflection
            </Button>
          </div>
        </Card>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard label="Average score" value={reflectionSummary?.averageFocusScore ?? 0} detail="Average of your saved reflection scores." />
            <StatCard label="Latest mood" value={reflectionSummary?.latestMood ?? 'N/A'} detail="Most recent emotional check-in." tone="success" />
          </div>
          {reflections.length ? (
            <div className="grid gap-4">
              {reflections.map((reflection) => (
                <Card key={reflection.id} className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(244,248,255,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.05)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
                    {formatDate(reflection.createdAt)}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">
                    Mood: {reflection.mood}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-soft)]">
                    {reflection.wins ?? reflection.tomorrowCommitment ?? 'No reflection details recorded.'}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No reflections yet"
              copy="Start with a short reflection today. It only needs a few honest lines."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const { analyticsSummary, focusSessionSummary, reflectionSummary, distractionSummary } =
    useWorkspace();

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Analytics"
        title="See the discipline trend clearly"
        description="No chart library needed yet. Strong stat cards and progress bars already make the progress readable."
      />

      <Card className="border-white/80 bg-[linear-gradient(135deg,#eef2ff_0%,#ffffff_55%,#f0fdf4_100%)] shadow-[0_28px_80px_rgba(15,23,42,0.07)]">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">Hero metric</p>
            <h2 className="mt-3 text-5xl font-black tracking-[-0.05em] text-slate-950">
              {analyticsSummary?.focusScore ?? 0}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Focus score turns recent actions into one signal you can read at a glance.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailRow label="Active goals" value={`${analyticsSummary?.activeGoals ?? 0}`} />
            <DetailRow label="Total habits" value={`${analyticsSummary?.totalHabits ?? 0}`} />
            <DetailRow label="Reflection entries" value={`${analyticsSummary?.dailyReflections ?? 0}`} />
            <DetailRow
              label="Top distraction"
              value={analyticsSummary?.topDistractionPlatform ?? distractionSummary?.topPlatform ?? 'None yet'}
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Focus score" value={analyticsSummary?.focusScore ?? 0} detail="Hero metric for the whole system." />
        <StatCard label="Habit completions" value={analyticsSummary?.habitCompletions ?? 0} detail="How often habits have been marked complete." tone="success" />
        <StatCard label="Focus minutes" value={analyticsSummary?.focusSessionMinutes ?? 0} detail="Minutes spent in intentional work." />
        <StatCard label="Distraction minutes" value={analyticsSummary?.distractionMinutesLost ?? 0} detail="Minutes noticed as lost to distraction." tone="warning" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <SectionTitle title="Progress bars" />
          <div className="grid gap-5">
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--color-text)]">Focus score</p>
              <ProgressBar value={analyticsSummary?.focusScore ?? 0} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--color-text)]">Reflection average</p>
              <ProgressBar value={reflectionSummary?.averageFocusScore ?? 0} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--color-text)]">Distraction-free sessions</p>
              <ProgressBar
                value={
                  focusSessionSummary?.totalSessions
                    ? (100 * (focusSessionSummary.distractionFreeSessions / focusSessionSummary.totalSessions))
                    : 0
                }
              />
            </div>
          </div>
        </Card>
        <Card className="border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.96)_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
          <SectionTitle title="Summary" />
          <div className="grid gap-3 text-sm text-[var(--color-text-soft)]">
            <p>Active goals: {analyticsSummary?.activeGoals ?? 0}</p>
            <p>Total habits: {analyticsSummary?.totalHabits ?? 0}</p>
            <p>
              Top distraction platform:{' '}
              {analyticsSummary?.topDistractionPlatform ?? distractionSummary?.topPlatform ?? 'None yet'}
            </p>
            <p>Reflections logged: {analyticsSummary?.dailyReflections ?? 0}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { profile, updateProfile, isPending } = useWorkspace();
  const [form, setForm] = useState({
    mainDream: profile?.mainDream ?? '',
    currentLifeFocus: profile?.currentLifeFocus ?? '',
    biggestDistractions: profile?.biggestDistractions.join(', ') ?? '',
    dailyFocusMinutes: String(profile?.dailyFocusMinutes ?? 60),
    preferredReminderTone: profile?.preferredReminderTone ?? 'supportive',
  });

  useEffect(() => {
    setForm({
      mainDream: profile?.mainDream ?? '',
      currentLifeFocus: profile?.currentLifeFocus ?? '',
      biggestDistractions: profile?.biggestDistractions.join(', ') ?? '',
      dailyFocusMinutes: String(profile?.dailyFocusMinutes ?? 60),
      preferredReminderTone: profile?.preferredReminderTone ?? 'supportive',
    });
  }, [profile]);

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Profile"
        title="Profile and focus settings"
        description="Keep your main goal, current focus, and preferred settings updated."
      />

      <Card className="max-w-5xl border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(248,251,255,0.96)_100%)] shadow-[0_28px_80px_rgba(15,23,42,0.07)]">
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <DetailRow label="Preferred focus minutes" value={form.dailyFocusMinutes} />
          <DetailRow label="Reminder tone" value={form.preferredReminderTone} />
          <DetailRow
            label="Main distraction count"
            value={`${form.biggestDistractions
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean).length}`}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Main dream">
            <Textarea
              value={form.mainDream}
              onChange={(event) => setForm({ ...form, mainDream: event.target.value })}
            />
          </Field>
          <Field label="Current life focus">
            <Textarea
              value={form.currentLifeFocus}
              onChange={(event) => setForm({ ...form, currentLifeFocus: event.target.value })}
            />
          </Field>
          <Field label="Biggest distractions" hint="Separate multiple items with commas.">
            <Textarea
              value={form.biggestDistractions}
              onChange={(event) => setForm({ ...form, biggestDistractions: event.target.value })}
            />
          </Field>
          <div className="grid gap-4">
            <Field label="Preferred focus minutes">
              <Input
                type="number"
                value={form.dailyFocusMinutes}
                onChange={(event) => setForm({ ...form, dailyFocusMinutes: event.target.value })}
              />
            </Field>
            <Field label="Reminder tone">
              <Input
                value={form.preferredReminderTone}
                onChange={(event) => setForm({ ...form, preferredReminderTone: event.target.value })}
              />
            </Field>
          </div>
        </div>
        <Button type="button" className="mt-6" disabled={isPending} onClick={() => updateProfile(form)}>
          Save changes
        </Button>
      </Card>
    </div>
  );
}

export function RemindersBlock() {
  const { createReminder, reminders, isPending } = useWorkspace();
  const [form, setForm] = useState({
    title: '',
    type: 'habit',
    scheduledAt: '',
    note: '',
  });

  return (
    <Card>
      <SectionTitle title="Reminders" copy="Useful for today plan and habit support." />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </Field>
        <Field label="Type">
          <Select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option value="habit">habit</option>
            <option value="goal">goal</option>
            <option value="accountability">accountability</option>
            <option value="distraction_replacement">distraction replacement</option>
          </Select>
        </Field>
        <Field label="Scheduled at">
          <Input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(event) => setForm({ ...form, scheduledAt: event.target.value })}
          />
        </Field>
        <Field label="Note">
          <Input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} />
        </Field>
      </div>
      <Button
        type="button"
        className="mt-4"
        disabled={isPending || !form.scheduledAt || form.title.length < 2}
        onClick={() => createReminder(form)}
      >
        Add reminder
      </Button>
      <div className="mt-5 grid gap-3">
        {reminders.slice(0, 3).map((reminder) => (
          <div
            key={reminder.id}
            className="rounded-2xl bg-[var(--color-surface-alt)] p-4 text-sm text-[var(--color-text-soft)]"
          >
            {reminder.title} / {formatDateTime(reminder.scheduledAt)}
          </div>
        ))}
      </div>
    </Card>
  );
}
