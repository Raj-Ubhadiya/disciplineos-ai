import Link from 'next/link';

import { ButtonLink } from '@/components/ui';

const navItems = [
  ['Features', '#features'],
  ['How it works', '#how-it-works'],
  ['Experience', '#experience'],
  ['FAQ', '#faq'],
] as const;

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-[rgba(250,252,255,0.8)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 py-4 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4f46e5_0%,#0ea5e9_100%)] text-sm font-black text-white shadow-[0_14px_32px_rgba(79,70,229,0.24)]">
              DO
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">DisciplineOS AI</p>
              <p className="text-xs text-slate-500">Turn intention into visible progress</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} className="transition hover:text-slate-950">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink href="/login" variant="ghost" className="hidden min-h-10 px-4 sm:inline-flex">
              Log in
            </ButtonLink>
            <ButtonLink href="/signup" className="min-h-10 px-4 sm:px-6">
              Start Building Discipline
            </ButtonLink>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 rounded-full border border-[var(--color-border)] bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_8px_20px_rgba(23,32,51,0.04)]"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
