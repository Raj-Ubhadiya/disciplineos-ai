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
        'inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold leading-none whitespace-nowrap transition duration-200',
        'disabled:cursor-not-allowed disabled:opacity-55',
        variant === 'primary' &&
          'bg-[linear-gradient(135deg,var(--color-brand)_0%,var(--color-brand-secondary)_100%)] text-white shadow-[0_18px_45px_rgba(79,70,229,0.24)] hover:-translate-y-0.5 hover:shadow-[0_26px_55px_rgba(79,70,229,0.3)]',
        variant === 'secondary' &&
          'border border-[var(--color-border)] bg-white/92 text-slate-900 shadow-[0_12px_30px_rgba(23,32,51,0.05)] hover:border-[var(--color-border-strong)] hover:bg-white',
        variant === 'ghost' &&
          'bg-transparent text-slate-700 hover:bg-white/85 hover:text-slate-950',
        variant === 'danger' &&
          'bg-[linear-gradient(135deg,#fb7185_0%,#e11d48_100%)] text-white shadow-[0_18px_40px_rgba(225,29,72,0.2)] hover:-translate-y-0.5',
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
        'inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold leading-none whitespace-nowrap transition duration-200',
        variant === 'primary' &&
          'bg-[linear-gradient(135deg,var(--color-brand)_0%,var(--color-brand-secondary)_100%)] text-white shadow-[0_18px_45px_rgba(79,70,229,0.24)] hover:-translate-y-0.5 hover:shadow-[0_26px_55px_rgba(79,70,229,0.3)]',
        variant === 'secondary' &&
          'border border-[var(--color-border)] bg-white/92 text-slate-900 shadow-[0_12px_30px_rgba(23,32,51,0.05)] hover:border-[var(--color-border-strong)] hover:bg-white',
        variant === 'ghost' &&
          'bg-transparent text-slate-700 hover:bg-white/85 hover:text-slate-950',
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
        'rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm',
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
        tone === 'neutral' && 'bg-slate-100 text-slate-700',
        tone === 'brand' && 'bg-indigo-100 text-indigo-700',
        tone === 'success' && 'bg-emerald-100 text-emerald-700',
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
        'min-h-[3.25rem] w-full rounded-[22px] border border-[var(--color-border)] bg-white/96 px-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-slate-400',
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
        'min-h-[3.25rem] w-full rounded-[22px] border border-[var(--color-border)] bg-white/96 px-4 text-sm text-[var(--color-text)] outline-none transition',
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
        'min-h-28 w-full rounded-[22px] border border-[var(--color-border)] bg-white/96 px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-slate-400',
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
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      {children}
      {hint ? <span className="text-xs text-[var(--color-text-soft)]">{hint}</span> : null}
    </label>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 rounded-full bg-slate-100">
      <div
        className="h-3 rounded-full bg-[linear-gradient(90deg,#4f46e5_0%,#7c3aed_48%,#0ea5e9_100%)] transition-all duration-500"
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
        'pointer-events-auto rounded-[24px] border px-4 py-3 shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl',
        tone === 'neutral' && 'border-indigo-200/80 bg-white/95 text-slate-700',
        tone === 'success' && 'border-emerald-200 bg-emerald-50/95 text-emerald-800',
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
