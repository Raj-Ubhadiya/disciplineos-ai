'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { Badge, Button, Card, cx, Field, ProgressBar, Select, Textarea } from '@/components/ui';

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(245,249,255,0.95)_38%,rgba(235,243,255,0.92)_100%)] px-6 py-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-sm ui-reveal md:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(99,102,241,0.55)_20%,rgba(14,165,233,0.5)_50%,rgba(34,197,94,0.45)_80%,transparent_100%)]" />
      <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-[rgba(79,70,229,0.14)] blur-3xl" />
      <div className="absolute bottom-0 left-10 h-28 w-28 rounded-full bg-[rgba(14,165,233,0.12)] blur-3xl" />
      <div className="absolute right-1/3 top-6 h-16 w-16 rounded-full border border-white/60 bg-white/25 blur-2xl" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-700">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 md:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-[15px]">
            {description}
          </p>
        </div>
        {action}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  detail,
  tone = 'brand',
}: {
  label: string;
  value: ReactNode;
  detail: string;
  tone?: 'brand' | 'success' | 'warning';
}) {
  return (
    <Card className="relative overflow-hidden border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(247,250,255,0.97)_45%,rgba(240,246,255,0.96)_100%)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_75px_rgba(23,32,51,0.12)]">
      <div
        className={cx(
          'absolute inset-x-0 top-0 h-1',
          tone === 'brand' && 'bg-[linear-gradient(90deg,#4f46e5_0%,#7c3aed_100%)]',
          tone === 'success' && 'bg-[linear-gradient(90deg,#22c55e_0%,#14b8a6_100%)]',
          tone === 'warning' && 'bg-[linear-gradient(90deg,#f59e0b_0%,#fb7185_100%)]',
        )}
      />
      <div className="absolute -right-8 top-5 h-24 w-24 rounded-full bg-[rgba(79,70,229,0.08)] blur-2xl" />
      <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.9)_50%,transparent_100%)]" />
      <Badge tone={tone}>{label}</Badge>
      <p className="mt-5 text-4xl font-black tracking-[-0.05em] text-slate-950">{value}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{detail}</p>
    </Card>
  );
}

export function EmptyState({
  title,
  copy,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  copy: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <Card className="border-dashed border-slate-300 bg-[linear-gradient(180deg,#fbfcff_0%,#f5f8ff_100%)] text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#eef2ff_0%,#e0f2fe_100%)] text-lg font-black text-indigo-700 ui-float-soft">
        DO
      </div>
      <p className="mt-5 text-lg font-semibold text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{copy}</p>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-brand)_0%,var(--color-brand-secondary)_100%)] px-6 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(79,70,229,0.22)]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </Card>
  );
}

export function SectionTitle({
  title,
  copy,
  action,
}: {
  title: string;
  copy?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-[-0.02em] text-slate-950">{title}</h2>
        {copy ? <p className="mt-2 text-sm leading-7 text-slate-600">{copy}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ToneBanner({
  tone,
  children,
}: {
  tone: 'success' | 'error' | 'info';
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        'rounded-[22px] border px-4 py-3 text-sm shadow-[0_8px_24px_rgba(23,32,51,0.04)]',
        tone === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
        tone === 'error' && 'border-rose-200 bg-rose-50 text-rose-700',
        tone === 'info' && 'border-indigo-200 bg-indigo-50 text-indigo-700',
      )}
    >
      {children}
    </div>
  );
}

export function MissionCard({
  step,
  title,
  copy,
  progress,
}: {
  step: string;
  title: string;
  copy: string;
  progress?: number;
}) {
  return (
    <Card className="rounded-[32px] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,248,255,0.95)_100%)] shadow-[0_24px_60px_rgba(23,32,51,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(23,32,51,0.12)]">
      <div className="flex items-start gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#eef2ff_0%,#dbeafe_100%)] font-black text-indigo-700 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.08)]">
          {step}
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-slate-950">{title}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">{copy}</p>
          {typeof progress === 'number' ? (
            <div className="mt-4">
              <ProgressBar value={progress} />
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function PillStat({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(248,251,255,0.8)_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export { Button, Card, Field, ProgressBar, Select, Textarea };
