const focusCards = [
  {
    label: 'Dream',
    value: 'Build a disciplined life',
    detail: 'AI breaks big dreams into weekly goals and daily habits.',
  },
  {
    label: 'Distraction',
    value: 'Social media control',
    detail: 'Track triggers, time lost, mood changes, and replacement actions.',
  },
  {
    label: 'Partner',
    value: 'Partner accountability',
    detail: 'Shared goals, emotional check-ins, and appreciation reminders.',
  },
];

const dailyPlan = [
  "Define today's highest-value task",
  'Complete one habit before opening social apps',
  'Log one distraction trigger honestly',
  'Send one appreciation note to your partner',
];

export function FocusDashboard() {
  return (
    <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="border border-white/10 bg-panel p-6 shadow-[0_28px_90px_rgba(0,0,0,0.26)] backdrop-blur md:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent/80">
          Discipline operating system
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
          Turn your phone's pull into progress toward your real life.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
          DisciplineOS AI combines goals, habits, distraction awareness, partner check-ins,
          and AI planning into one focused daily workspace.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {focusCards.map((card) => (
            <article key={card.label} className="border border-white/10 bg-white/7 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-warning">
                {card.label}
              </p>
              <h2 className="mt-3 text-lg font-bold text-white">{card.value}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{card.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <aside className="border border-accent/25 bg-accent/10 p-6 backdrop-blur md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent/80">
              Today
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">Focus plan</h2>
          </div>
          <div className="border border-white/10 bg-black/25 px-3 py-2 font-mono text-sm text-accent">
            0.1
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {dailyPlan.map((item, index) => (
            <div key={item} className="flex gap-3 border border-white/10 bg-black/24 p-4">
              <span className="flex size-8 shrink-0 items-center justify-center bg-accent font-mono text-sm font-bold text-black">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-slate-100">{item}</p>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}
