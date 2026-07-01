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
    <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-5 shadow-[var(--app-shadow)] md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--app-primary)]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[var(--app-text)] md:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--app-text-muted)]">
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
    <Card className="relative overflow-hidden rounded-xl border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--app-shadow)] transition duration-200 hover:border-[var(--app-border-strong)]">
      <div
        className={cx(
          'absolute left-0 top-0 h-full w-1',
          tone === 'brand' && 'bg-[var(--app-primary)]',
          tone === 'success' && 'bg-[var(--app-success)]',
          tone === 'warning' && 'bg-amber-500',
        )}
      />
      <Badge tone={tone}>{label}</Badge>
      <p className="mt-4 text-3xl font-bold text-[var(--app-text)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--app-text-muted)]">{detail}</p>
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
    <Card className="rounded-xl border-dashed border-[var(--app-border-strong)] bg-[var(--app-surface)] text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--app-primary-soft)] text-sm font-black text-[var(--app-primary)]">
        DO
      </div>
      <p className="mt-5 text-lg font-semibold text-[var(--app-text)]">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--app-text-muted)]">{copy}</p>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--app-primary)] px-5 text-sm font-semibold text-[var(--app-primary-text)]"
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
    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-[var(--app-text)]">{title}</h2>
        {copy ? <p className="mt-1 text-sm leading-6 text-[var(--app-text-muted)]">{copy}</p> : null}
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
        'rounded-lg border px-4 py-3 text-sm',
        tone === 'success' &&
          'border-emerald-200 bg-[var(--app-success-soft)] text-[var(--app-success)]',
        tone === 'error' && 'border-rose-200 bg-rose-50 text-rose-700',
        tone === 'info' &&
          'border-[var(--app-border)] bg-[var(--app-primary-soft)] text-[var(--app-primary)]',
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
    <Card className="rounded-xl border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--app-shadow)] transition duration-200 hover:border-[var(--app-border-strong)]">
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--app-primary-soft)] font-bold text-[var(--app-primary)]">
          {step}
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold text-[var(--app-text)]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--app-text-muted)]">{copy}</p>
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
    <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3">
      <p className="text-xs font-semibold text-[var(--app-text-muted)]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[var(--app-text)]">{value}</p>
    </div>
  );
}

export { Button, Card, Field, ProgressBar, Select, Textarea };
