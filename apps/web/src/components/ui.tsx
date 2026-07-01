import Link from 'next/link';
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}) {
  return (
    <button
      className={cx(
        'inline-flex min-h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold leading-none whitespace-nowrap transition duration-200',
        'disabled:cursor-not-allowed disabled:opacity-55',
        variant === 'primary' &&
          'bg-[var(--app-primary)] text-[var(--app-primary-text)] shadow-sm hover:bg-[var(--app-primary-hover)]',
        variant === 'secondary' &&
          'border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-muted)]',
        variant === 'ghost' &&
          'bg-transparent text-[var(--app-text-muted)] hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]',
        variant === 'danger' &&
          'bg-rose-600 text-white shadow-sm hover:bg-rose-700',
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  children,
  className,
  variant = 'primary',
  href,
}: {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cx(
        'inline-flex min-h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold leading-none whitespace-nowrap transition duration-200',
        variant === 'primary' &&
          'bg-[var(--app-primary)] text-[var(--app-primary-text)] shadow-sm hover:bg-[var(--app-primary-hover)]',
        variant === 'secondary' &&
          'border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] shadow-sm hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-muted)]',
        variant === 'ghost' &&
          'bg-transparent text-[var(--app-text-muted)] hover:bg-[var(--app-surface-muted)] hover:text-[var(--app-text)]',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Card({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cx(
        'rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--app-shadow)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'brand' | 'success' | 'warning';
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold',
        tone === 'neutral' && 'bg-[var(--app-surface-muted)] text-[var(--app-text-muted)]',
        tone === 'brand' && 'bg-[var(--app-primary-soft)] text-[var(--app-primary)]',
        tone === 'success' && 'bg-[var(--app-success-soft)] text-[var(--app-success)]',
        tone === 'warning' && 'bg-amber-100 text-amber-700',
      )}
    >
      {children}
    </span>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        'min-h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-sm text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-text-faint)]',
        'focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-100',
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={cx(
        'min-h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-sm text-[var(--app-text)] outline-none transition',
        'focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-100',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        'min-h-28 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-3 text-sm text-[var(--app-text)] outline-none transition placeholder:text-[var(--app-text-faint)]',
        'focus:border-[var(--color-brand)] focus:ring-4 focus:ring-indigo-100',
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2.5">
      <span className="text-sm font-medium text-[var(--app-text)]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[var(--app-text-muted)]">{hint}</span> : null}
    </label>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 rounded-full bg-[var(--app-surface-muted)]">
      <div
        className="h-3 rounded-full bg-[var(--app-primary)] transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function Toast({
  children,
  tone = 'neutral',
  className,
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'error';
}) {
  return (
    <div
      className={cx(
        'pointer-events-auto rounded-lg border px-4 py-3 shadow-lg backdrop-blur-xl',
        tone === 'neutral' &&
          'border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)]',
        tone === 'success' &&
          'border-emerald-200 bg-[var(--app-success-soft)] text-[var(--app-success)]',
        tone === 'error' && 'border-rose-200 bg-rose-50/95 text-rose-800',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {children}
    </div>
  );
}
