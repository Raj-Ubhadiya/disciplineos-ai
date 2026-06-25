import { Badge, ButtonLink, Card, ProgressBar } from '@/components/ui';

const features = [
  {
    title: 'Set your direction',
    copy: 'Start with one clear goal you want to improve.',
    accent: 'bg-indigo-50 text-indigo-700',
  },
  {
    title: 'Follow today’s plan',
    copy: 'See the next steps, habits, and focus actions for today.',
    accent: 'bg-sky-50 text-sky-700',
  },
  {
    title: 'Do focused work',
    copy: 'Use focused sessions to turn plans into real progress.',
    accent: 'bg-violet-50 text-violet-700',
  },
  {
    title: 'Reflect and continue',
    copy: 'Review the day and return tomorrow with more clarity.',
    accent: 'bg-amber-50 text-amber-700',
  },
];

const personas = [
  ['Students', 'Build a calmer study rhythm.'],
  ['Developers', 'Protect deep work that ships.'],
  ['Creators', 'Keep momentum through distractions.'],
  ['Entrepreneurs', 'Stay consistent on what matters.'],
] as const;

const faq = [
  [
    'Is this only a habit tracker?',
    'No. It connects planning, habits, focus, reflection, and progress in one system.',
  ],
  [
    'Will this replace my planner?',
    'It works best beside your calendar or task manager.',
  ],
  [
    'Does it help with social media distraction?',
    'Yes. It helps you notice patterns and choose better replacement actions.',
  ],
] as const;

const productStats = [
  ['Sign up', 'Start your account'],
  ['Today plan', 'See what to do next'],
  ['Reflect', 'Improve tomorrow'],
] as const;

export function LandingPage() {
  return (
    <main className="pb-8">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.96)_0%,rgba(244,247,255,0.96)_46%,rgba(236,243,255,0.96)_100%)] p-6 shadow-[var(--shadow-strong)] ui-reveal md:p-10">
            <div className="absolute -left-10 top-20 h-44 w-44 rounded-full bg-[rgba(79,70,229,0.12)] blur-3xl" />
            <div className="absolute right-6 top-8 h-28 w-28 rounded-full bg-[rgba(14,165,233,0.14)] blur-3xl" />

            <div className="relative">
              <Badge tone="brand">Simple daily discipline system</Badge>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-5xl md:text-7xl">
                Turn goals into daily discipline.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                DisciplineOS AI helps you set a goal, follow a plan, build habits, stay focused, and reflect so progress becomes easier to repeat.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/signup" className="w-full sm:w-auto">
                  Start Building Discipline
                </ButtonLink>
                <ButtonLink href="#how-it-works" variant="secondary" className="w-full sm:w-auto">
                  See How It Works
                </ButtonLink>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/70 bg-white/88 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(23,32,51,0.05)]">
                  Sign up {'->'} Set goal {'->'} Start today
                </span>
                <span className="rounded-full border border-white/70 bg-white/88 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(23,32,51,0.05)]">
                  Habits {'->'} Focus {'->'} Reflection
                </span>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {productStats.map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-[26px] border border-white/70 bg-white/82 p-4 shadow-[0_16px_38px_rgba(23,32,51,0.06)] backdrop-blur-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {label}
                    </p>
                    <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-slate-950">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card className="relative overflow-hidden border-indigo-200/70 bg-[linear-gradient(165deg,#1d2457_0%,#4f46e5_54%,#6d6eff_100%)] p-6 text-white ui-reveal-delayed md:p-8">
            <div className="absolute -right-8 top-0 h-40 w-40 rounded-full bg-white/14 blur-3xl" />
            <div className="absolute bottom-0 left-4 h-36 w-36 rounded-full bg-cyan-300/12 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-100">
                Daily flow
              </p>
              <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl md:text-[2.3rem]">
                A simple app that tells you what to do next
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-indigo-100">
                Open the app, see today’s plan, complete the next step, and keep moving.
              </p>

              <div className="mt-8 grid gap-4">
                {[
                  ['Create your account', 'Step 1'],
                  ['Set your goal and today’s target', 'Step 2'],
                  ['Complete habits and focus work', 'Step 3'],
                  ['Finish with a short reflection', 'Step 4'],
                ].map(([copy, step], index) => (
                  <div
                    key={step}
                    className="flex items-center gap-4 rounded-[28px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-base font-black text-indigo-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-indigo-100">{step}</p>
                      <p className="mt-1 text-sm font-medium text-white">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/12 bg-white/10 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-100">
                    Product feel
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Clear and easy to follow
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/12 bg-white/10 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-100">
                    Result
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Better consistency
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-700">
              How users understand it
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-950">
              A few core actions, without the clutter
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            The app should feel simple on day one: know the goal, see the plan, do the work, and review the day.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="border-white/70 bg-white/86 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_64px_rgba(23,32,51,0.1)]"
            >
              <div className={`inline-flex rounded-2xl px-4 py-3 text-sm font-black ${feature.accent}`}>
                0{index + 1}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.copy}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <Card className="grid gap-8 border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(243,247,255,0.94)_100%)] lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-700">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-950">
              Simple from the first day
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              A first-time user should understand the app in one quick flow: sign up, set a goal, follow the day, and reflect.
            </p>
            <div className="mt-6 rounded-[28px] border border-[var(--color-border)] bg-white/88 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700">
                Everyday flow
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-950">
                Sign up {'->'} Set goal {'->'} Today plan {'->'} Habits {'->'} Focus {'->'} Reflection
              </p>
              <div className="mt-5">
                <ProgressBar value={84} />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              'Create your account',
              'Choose what you want to improve',
              'Complete daily habits and focus sessions',
              'Reflect and continue tomorrow',
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-[28px] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_16px_36px_rgba(23,32,51,0.05)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{item}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="experience" className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <Card className="overflow-hidden border-white/70 bg-[linear-gradient(145deg,#ffffff_0%,#eef3ff_100%)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-700">
                  Demo area
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                  Add your product video here later
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                  This section is ready for a short walkthrough video, GIF, or screen capture.
                </p>
              </div>
              <Badge tone="brand">Video placeholder</Badge>
            </div>
            <div className="mt-6 rounded-[30px] border border-white/70 bg-[linear-gradient(160deg,#0f1833_0%,#23356b_42%,#4f46e5_100%)] p-5 text-white shadow-[0_24px_60px_rgba(31,46,85,0.18)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-300" />
                  <span className="h-3 w-3 rounded-full bg-amber-300" />
                  <span className="h-3 w-3 rounded-full bg-emerald-300" />
                </div>
                <p className="text-xs uppercase tracking-[0.22em] text-indigo-100">
                  Future walkthrough area
                </p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.84fr]">
                <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                  <p className="text-lg font-semibold">Product walkthrough</p>
                  <p className="mt-3 text-sm leading-7 text-indigo-100">
                    Replace this block with your demo when it is ready.
                  </p>
                  <div className="mt-6 flex h-40 items-center justify-center rounded-[22px] border border-dashed border-white/22 bg-slate-950/16 text-sm text-indigo-100">
                    Product video / animated demo placeholder
                  </div>
                </div>
                <div className="grid gap-3">
                  {['Landing preview', 'Mission board', 'Dashboard'].map((item, index) => (
                    <div key={item} className="rounded-[22px] border border-white/10 bg-white/10 p-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-indigo-100">Scene {index + 1}</p>
                      <p className="mt-2 text-sm font-medium text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {personas.map(([title, copy]) => (
              <Card key={title} className="border-white/70 bg-white/86">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700">
                  {title}
                </p>
                <p className="mt-3 text-xl font-semibold text-slate-950">{copy}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-700">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-950">
            Simple answers
          </h2>
        </div>
        <div className="grid gap-4">
          {faq.map(([question, answer]) => (
            <Card
              key={question}
              className="border-white/70 bg-white/88 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(23,32,51,0.08)]"
            >
              <h3 className="text-lg font-semibold text-slate-950">{question}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
