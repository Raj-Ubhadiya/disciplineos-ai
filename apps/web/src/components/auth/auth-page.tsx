'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { Badge, Button, ButtonLink, Card, cx, Field, Input, Toast } from '@/components/ui';
import { fetchAuthenticatedUser, requestOtp, verifyOtp } from '@/lib/web-api';

type AuthPageProps = {
  apiUrl: string;
  mode: 'login' | 'signup';
};

type AuthStep = 'entry' | 'otp';
type AuthChannel = 'email' | 'phone';

const authContent = {
  login: {
    eyebrow: 'Welcome back',
    title: 'Sign in',
    subtitle: 'Use email or mobile to continue to your workspace.',
    cta: 'Send secure code',
    otpTitle: 'Check your verification code',
    otpCopy: 'Enter the 6-digit code we just sent so you can continue.',
    switchPrompt: 'New here?',
    switchLabel: 'Create an account',
  },
  signup: {
    eyebrow: 'Create account',
    title: 'Create your account.',
    subtitle: 'Add your details once, verify your code, and start using your workspace.',
    cta: 'Send secure code',
    otpTitle: 'Verify and create account',
    otpCopy: 'Enter the 6-digit code we sent to finish creating your account securely.',
    switchPrompt: 'Already have an account?',
    switchLabel: 'Log in',
  },
} as const;

function formatChannelLabel(channel: AuthChannel) {
  return channel === 'email' ? 'Email OTP' : 'Mobile OTP';
}

function normalizePhoneInput(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  return trimmed
    .replace(/[^\d+]/g, '')
    .replace(/(?!^)\+/g, '');
}

export function AuthPage({ apiUrl, mode }: AuthPageProps) {
  const router = useRouter();
  const [channel, setChannel] = useState<AuthChannel>('email');
  const [step, setStep] = useState<AuthStep>('entry');
  const [isPending, startTransition] = useTransition();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    code: '',
  });

  const content = authContent[mode];
  const hasValidEmail = /\S+@\S+\.\S+/.test(form.email.trim());
  const hasValidPhone = /^\+?[1-9]\d{7,14}$/.test(form.phone.trim());
  const canSendOtp =
    mode === 'signup'
      ? form.name.trim().length >= 2 && hasValidEmail && hasValidPhone
      : channel === 'email'
      ? hasValidEmail
      : hasValidPhone;

  useEffect(() => {
    let isMounted = true;

    async function validateStoredSession() {
      const savedToken = window.localStorage.getItem('disciplineos_token');

      if (!savedToken) {
        if (isMounted) {
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        await fetchAuthenticatedUser(apiUrl, savedToken);

        if (isMounted) {
          router.replace('/app/dashboard');
        }
      } catch {
        window.localStorage.removeItem('disciplineos_token');

        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    void validateStoredSession();

    return () => {
      isMounted = false;
    };
  }, [apiUrl, router]);

  function completeAuth(accessToken: string) {
    window.localStorage.setItem('disciplineos_token', accessToken);
    router.replace('/app/dashboard');
  }

  function resetMessages() {
    setError(null);
    setNotice(null);
  }

  useEffect(() => {
    if (!error && !notice) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setError(null);
      setNotice(null);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [error, notice]);

  function buildOtpPayload() {
    return {
      channel,
      purpose: mode,
      ...(mode === 'signup' || channel === 'email' ? { email: form.email.trim() } : {}),
      ...(mode === 'signup' || channel === 'phone' ? { phone: form.phone.trim() } : {}),
      ...(mode === 'signup' ? { name: form.name.trim() } : {}),
    } as const;
  }

  function sendOtpCode() {
    resetMessages();

    startTransition(async () => {
      try {
        const response = await requestOtp(apiUrl, buildOtpPayload());

        setStep('otp');
        setNotice(
          response.debugCode
            ? `${response.message} Development code: ${response.debugCode}`
            : response.message,
        );
      } catch (currentError) {
        setError(currentError instanceof Error ? currentError.message : 'Could not send the verification code.');
      }
    });
  }

  function submitOtp() {
    resetMessages();

    startTransition(async () => {
      try {
        const result = await verifyOtp(apiUrl, {
          ...buildOtpPayload(),
          code: form.code,
        });

        completeAuth(result.accessToken);
      } catch (currentError) {
        setError(currentError instanceof Error ? currentError.message : 'OTP verification failed.');
      }
    });
  }

  if (isCheckingSession) {
    return (
      <main className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_28%),linear-gradient(180deg,#fbfcff_0%,#eef4ff_100%)]" />
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-8 md:px-8">
          <Card className="w-full max-w-lg border-white/80 bg-white/92 text-center shadow-[0_35px_120px_rgba(40,53,108,0.14)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">
              Checking session
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950">
              Checking your saved session
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Please wait a moment.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="relative isolate overflow-hidden">
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        {notice ? (
          <Toast tone="success" className="w-full max-w-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Success</p>
                <p className="mt-1 text-sm leading-6">{notice}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="pointer-events-auto text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
              >
                Close
              </button>
            </div>
          </Toast>
        ) : null}

        {error ? (
          <Toast tone="error" className="w-full max-w-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">Action needed</p>
                <p className="mt-1 text-sm leading-6">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="pointer-events-auto text-sm font-semibold text-rose-700 transition hover:text-rose-900"
              >
                Close
              </button>
            </div>
          </Toast>
        ) : null}
      </div>

      <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_28%),linear-gradient(180deg,#fbfcff_0%,#eef4ff_100%)]" />
      <div className="absolute left-[-6rem] top-28 -z-10 h-64 w-64 rounded-full bg-[rgba(79,70,229,0.12)] blur-3xl" />
      <div className="absolute bottom-20 right-[-5rem] -z-10 h-56 w-56 rounded-full bg-[rgba(124,58,237,0.1)] blur-3xl" />

      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-6 md:px-8 lg:py-10">
        <Card className="relative mx-auto w-full max-w-xl overflow-hidden border-white/70 bg-white/92 p-0 shadow-[0_35px_120px_rgba(40,53,108,0.14)] backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-brand)_0%,#7c3aed_52%,#0ea5e9_100%)]" />
          <div className="p-5 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <ButtonLink
                href="/"
                variant="ghost"
                className="min-h-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700 hover:bg-slate-50 hover:text-slate-950"
              >
                DisciplineOS AI
              </ButtonLink>
              <Badge tone="brand">Secure access</Badge>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">
                  {content.eyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                  {step === 'otp' ? content.otpTitle : content.title}
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">
                  {step === 'otp' ? content.otpCopy : content.subtitle}
                </p>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {step === 'entry' ? formatChannelLabel(channel) : 'Verify code'}
              </div>
            </div>

            <div className="mt-7 grid gap-2 rounded-[24px] bg-slate-100 p-1 sm:flex sm:rounded-full">
              {[
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Mobile' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setChannel(item.key as AuthChannel);
                    setStep('entry');
                    resetMessages();
                  }}
                  className={cx(
                    'flex-1 rounded-full px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.18em]',
                    item.key === channel
                      ? 'bg-white text-slate-950 shadow-[0_6px_18px_rgba(23,32,51,0.08)]'
                      : 'text-slate-400',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {step === 'entry' ? (
              <div className="mt-7 rounded-[28px] border border-slate-200 bg-slate-50/88 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-950">
                      {channel === 'email' ? 'Continue with email' : 'Continue with mobile'}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {mode === 'signup'
                        ? 'Enter your details, then verify with a 6-digit code.'
                        : 'Enter your details to continue.'}
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                    6-digit code
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  {mode === 'signup' ? (
                    <Field label="Full name" hint="This will appear in your workspace.">
                      <Input
                        value={form.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                        placeholder="Natalie Carter"
                      />
                    </Field>
                  ) : null}

                  {mode === 'signup' || channel === 'email' ? (
                    <Field label="Email address">
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })}
                        placeholder="you@example.com"
                      />
                    </Field>
                  ) : null}

                  {mode === 'signup' || channel === 'phone' ? (
                    <Field label="Mobile number">
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={(event) =>
                          setForm({ ...form, phone: normalizePhoneInput(event.target.value) })
                        }
                        placeholder="+919876543210"
                      />
                    </Field>
                  ) : null}
                </div>

                <Button
                  type="button"
                  variant="primary"
                  className="mt-5 w-full"
                  disabled={!canSendOtp || isPending}
                  onClick={sendOtpCode}
                >
                  {isPending ? 'Sending code...' : content.cta}
                </Button>
              </div>
            ) : null}

            {step === 'otp' ? (
              <div className="mt-7 rounded-[28px] border border-indigo-100 bg-[linear-gradient(180deg,#fbfcff_0%,#f5f7ff_100%)] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">
                      Secure verification
                    </p>
                    <p className="mt-3 text-lg font-semibold text-slate-950">
                      {channel === 'email' ? form.email : form.phone}
                    </p>
                  </div>
                  <Badge tone="brand">{formatChannelLabel(channel)}</Badge>
                </div>

                <div className="mt-5 grid gap-4">
                  {mode === 'signup' ? (
                    <>
                      <Field label="Full name">
                        <Input value={form.name} disabled />
                      </Field>
                      <Field label="Email address">
                        <Input value={form.email} disabled />
                      </Field>
                      <Field label="Mobile number">
                        <Input value={form.phone} disabled />
                      </Field>
                    </>
                  ) : channel === 'email' ? (
                    <Field label="Email address">
                      <Input value={form.email} disabled />
                    </Field>
                  ) : (
                    <Field label="Mobile number">
                      <Input value={form.phone} disabled />
                    </Field>
                  )}

                  <Field label="Verification code" hint="Enter the 6-digit code we just sent.">
                    <Input
                      value={form.code}
                      onChange={(event) =>
                        setForm({ ...form, code: event.target.value.replace(/\D/g, '').slice(0, 6) })
                      }
                      placeholder="123456"
                      inputMode="numeric"
                      maxLength={6}
                      className="text-center text-xl font-bold tracking-[0.24em] sm:text-2xl sm:tracking-[0.35em]"
                    />
                  </Field>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    className="w-full"
                    disabled={isPending || form.code.length !== 6}
                    onClick={submitOtp}
                  >
                    {isPending ? 'Verifying...' : 'Verify and continue'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={isPending}
                    onClick={sendOtpCode}
                  >
                    Resend code
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="mt-4 px-0 text-indigo-700"
                  onClick={() => {
                    setStep('entry');
                    setForm({ ...form, code: '' });
                    resetMessages();
                  }}
                >
                  Change details
                </Button>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 text-sm text-slate-600">
              <div>
                {content.switchPrompt}{' '}
                <ButtonLink
                  href={mode === 'login' ? '/signup' : '/login'}
                  variant="ghost"
                  className="min-h-0 px-0 text-indigo-700 hover:bg-transparent hover:text-indigo-800"
                >
                  {content.switchLabel}
                </ButtonLink>
              </div>
              <ButtonLink
                href="/"
                variant="ghost"
                className="min-h-0 rounded-full border border-slate-200 px-4 py-2 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              >
                Back to home
              </ButtonLink>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
