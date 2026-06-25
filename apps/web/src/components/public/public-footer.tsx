import Link from 'next/link';

import { Badge } from '@/components/ui';

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(243,247,255,0.94)_100%)] backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 text-sm text-slate-600 md:grid-cols-[1.2fr_0.55fr_0.55fr_0.7fr] md:px-8">
        <div>
          <p className="text-base font-semibold text-slate-950">DisciplineOS AI</p>
          <p className="mt-3 max-w-md leading-7 text-slate-600">
            A cleaner way to build focus, habits, and follow-through.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge tone="brand">AI planner</Badge>
            <Badge tone="success">Focus score</Badge>
            <Badge tone="warning">Daily plan</Badge>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-950">Product</p>
          <div className="mt-3 grid gap-2">
            <a href="#features" className="transition hover:text-slate-950">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-slate-950">
              How it works
            </a>
            <a href="#experience" className="transition hover:text-slate-950">
              Experience
            </a>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-950">Built for</p>
          <div className="mt-3 grid gap-2 text-slate-600">
            <p>Students</p>
            <p>Developers</p>
            <p>Creators</p>
            <p>Entrepreneurs</p>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-950">Account</p>
          <div className="mt-3 grid gap-2">
            <Link href="/signup" className="transition hover:text-slate-950">
              Create account
            </Link>
            <Link href="/login" className="transition hover:text-slate-950">
              Log in
            </Link>
            <a href="#faq" className="transition hover:text-slate-950">
              Read FAQ
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-[var(--color-border)] px-5 py-4 text-xs text-slate-500 md:px-8">
        Built to make the next step clear.
      </div>
    </footer>
  );
}
