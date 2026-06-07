'use client';

import type {
  AiPlan,
  AiPlanActivationResult,
  AnalyticsSummary,
  AuthResponse,
  AuthUser,
  DailyPlan,
  DailyReflection,
  DailyReflectionSummary,
  DistractionLog,
  DistractionSummary,
  FocusSession,
  FocusSessionSummary,
  Goal,
  Habit,
  Relationship,
  Reminder,
  UserProfile,
} from '@disciplineos/types';
import { useEffect, useState, useTransition } from 'react';

import { getApiV1BaseUrl } from '@/lib/api';

type AppDashboardProps = {
  apiUrl: string;
};

type AuthMode = 'signup' | 'login';

type AuthForm = {
  name: string;
  email: string;
  password: string;
};

type ProfileForm = {
  mainDream: string;
  currentLifeFocus: string;
  biggestDistractions: string;
  dailyFocusMinutes: string;
  preferredReminderTone: string;
};

type GoalForm = {
  title: string;
  category: string;
  whyItMatters: string;
  relationshipId: string;
};

type HabitForm = {
  title: string;
  goalId: string;
  reminderTime: string;
};

type DistractionForm = {
  platform: string;
  minutesLost: string;
  triggerReason: string;
  moodBefore: string;
  moodAfter: string;
  replacementAction: string;
};

type RelationshipForm = {
  partnerEmail: string;
  partnerName: string;
};

type RelationshipCheckInForm = {
  relationshipId: string;
  mood: string;
  appreciation: string;
  concern: string;
  commitment: string;
};

type AiPlanForm = {
  dream: string;
  currentSituation: string;
  mainObstacle: string;
  roleModel: string;
};

type ReminderForm = {
  title: string;
  type: string;
  scheduledAt: string;
  note: string;
};

type ReflectionForm = {
  mood: string;
  wins: string;
  blockers: string;
  distractions: string;
  tomorrowCommitment: string;
  focusScore: string;
};

type FocusSessionForm = {
  title: string;
  durationMinutes: string;
  goalId: string;
  habitId: string;
  energyLevel: string;
  distractionFree: boolean;
  note: string;
};

const initialAuthForm: AuthForm = {
  name: '',
  email: '',
  password: '',
};

const initialProfileForm: ProfileForm = {
  mainDream: '',
  currentLifeFocus: '',
  biggestDistractions: '',
  dailyFocusMinutes: '60',
  preferredReminderTone: 'supportive',
};

const initialGoalForm: GoalForm = {
  title: '',
  category: 'personal',
  whyItMatters: '',
  relationshipId: '',
};

const initialHabitForm: HabitForm = {
  title: '',
  goalId: '',
  reminderTime: '',
};

const initialDistractionForm: DistractionForm = {
  platform: 'Instagram',
  minutesLost: '15',
  triggerReason: '',
  moodBefore: '',
  moodAfter: '',
  replacementAction: '',
};

const initialRelationshipForm: RelationshipForm = {
  partnerEmail: '',
  partnerName: '',
};

const initialRelationshipCheckInForm: RelationshipCheckInForm = {
  relationshipId: '',
  mood: 'focused',
  appreciation: '',
  concern: '',
  commitment: '',
};

const initialAiPlanForm: AiPlanForm = {
  dream: '',
  currentSituation: '',
  mainObstacle: 'social media distraction',
  roleModel: '',
};

const initialReminderForm: ReminderForm = {
  title: '',
  type: 'habit',
  scheduledAt: '',
  note: '',
};

const initialReflectionForm: ReflectionForm = {
  mood: 'focused',
  wins: '',
  blockers: '',
  distractions: '',
  tomorrowCommitment: '',
  focusScore: '70',
};

const initialFocusSessionForm: FocusSessionForm = {
  title: '',
  durationMinutes: '25',
  goalId: '',
  habitId: '',
  energyLevel: 'steady',
  distractionFree: true,
  note: '',
};

export function AppDashboard({ apiUrl }: AppDashboardProps) {
  const apiBaseUrl = getApiV1BaseUrl(apiUrl);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [authForm, setAuthForm] = useState<AuthForm>(initialAuthForm);
  const [profileForm, setProfileForm] = useState<ProfileForm>(initialProfileForm);
  const [goalForm, setGoalForm] = useState<GoalForm>(initialGoalForm);
  const [habitForm, setHabitForm] = useState<HabitForm>(initialHabitForm);
  const [distractionForm, setDistractionForm] =
    useState<DistractionForm>(initialDistractionForm);
  const [relationshipForm, setRelationshipForm] =
    useState<RelationshipForm>(initialRelationshipForm);
  const [relationshipCheckInForm, setRelationshipCheckInForm] =
    useState<RelationshipCheckInForm>(initialRelationshipCheckInForm);
  const [aiPlanForm, setAiPlanForm] = useState<AiPlanForm>(initialAiPlanForm);
  const [reminderForm, setReminderForm] = useState<ReminderForm>(initialReminderForm);
  const [reflectionForm, setReflectionForm] =
    useState<ReflectionForm>(initialReflectionForm);
  const [focusSessionForm, setFocusSessionForm] =
    useState<FocusSessionForm>(initialFocusSessionForm);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [distractionLogs, setDistractionLogs] = useState<DistractionLog[]>([]);
  const [distractionSummary, setDistractionSummary] = useState<DistractionSummary | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [aiPlans, setAiPlans] = useState<AiPlan[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reflections, setReflections] = useState<DailyReflection[]>([]);
  const [reflectionSummary, setReflectionSummary] =
    useState<DailyReflectionSummary | null>(null);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [focusSessionSummary, setFocusSessionSummary] =
    useState<FocusSessionSummary | null>(null);
  const [message, setMessage] = useState('Sign up or log in to start building discipline.');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const savedToken = window.localStorage.getItem('disciplineos_token');

    if (!savedToken) {
      return;
    }

    setToken(savedToken);
    void refreshWorkspace(savedToken);
  }, []);

  function authHeaders(activeToken = token) {
    return {
      'Content-Type': 'application/json',
      ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
    };
  }

  async function apiRequest<T>(path: string, init?: RequestInit, activeToken = token): Promise<T> {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        ...authHeaders(activeToken),
        ...init?.headers,
      },
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(error?.message ?? `Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  }

  async function refreshWorkspace(activeToken = token) {
    if (!activeToken) {
      return;
    }

    const [
      currentUser,
      currentProfile,
      currentGoals,
      currentHabits,
      currentDistractionLogs,
      currentDistractionSummary,
      currentRelationships,
      currentAiPlans,
      currentAnalyticsSummary,
      currentDailyPlan,
      currentReminders,
      currentReflections,
      currentReflectionSummary,
      currentFocusSessions,
      currentFocusSessionSummary,
    ] = await Promise.all([
      apiRequest<AuthUser>('/auth/me', undefined, activeToken),
      apiRequest<UserProfile>('/profile', undefined, activeToken),
      apiRequest<Goal[]>('/goals', undefined, activeToken),
      apiRequest<Habit[]>('/habits', undefined, activeToken),
      apiRequest<DistractionLog[]>('/distractions', undefined, activeToken),
      apiRequest<DistractionSummary>('/distractions/summary', undefined, activeToken),
      apiRequest<Relationship[]>('/relationships', undefined, activeToken),
      apiRequest<AiPlan[]>('/ai-plans', undefined, activeToken),
      apiRequest<AnalyticsSummary>('/analytics/summary', undefined, activeToken),
      apiRequest<DailyPlan>('/daily-plan/today', undefined, activeToken),
      apiRequest<Reminder[]>('/reminders/upcoming', undefined, activeToken),
      apiRequest<DailyReflection[]>('/reflections', undefined, activeToken),
      apiRequest<DailyReflectionSummary>('/reflections/summary', undefined, activeToken),
      apiRequest<FocusSession[]>('/focus-sessions', undefined, activeToken),
      apiRequest<FocusSessionSummary>('/focus-sessions/summary', undefined, activeToken),
    ]);

    setUser(currentUser);
    setProfile(currentProfile);
    setGoals(currentGoals);
    setHabits(currentHabits);
    setDistractionLogs(currentDistractionLogs);
    setDistractionSummary(currentDistractionSummary);
    setRelationships(currentRelationships);
    setAiPlans(currentAiPlans);
    setAnalyticsSummary(currentAnalyticsSummary);
    setDailyPlan(currentDailyPlan);
    setReminders(currentReminders);
    setReflections(currentReflections);
    setReflectionSummary(currentReflectionSummary);
    setFocusSessions(currentFocusSessions);
    setFocusSessionSummary(currentFocusSessionSummary);
    setProfileForm({
      mainDream: currentProfile.mainDream ?? '',
      currentLifeFocus: currentProfile.currentLifeFocus ?? '',
      biggestDistractions: currentProfile.biggestDistractions.join(', '),
      dailyFocusMinutes: String(currentProfile.dailyFocusMinutes),
      preferredReminderTone: currentProfile.preferredReminderTone,
    });
    setMessage('Workspace synced from the protected API.');
  }

  function submitAuth() {
    startTransition(async () => {
      try {
        const payload =
          authMode === 'signup'
            ? authForm
            : {
                email: authForm.email,
                password: authForm.password,
              };
        const result = await apiRequest<AuthResponse>(`/auth/${authMode}`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        window.localStorage.setItem('disciplineos_token', result.accessToken);
        setToken(result.accessToken);
        setUser(result.user);
        setMessage(`${authMode === 'signup' ? 'Signup' : 'Login'} successful.`);
        await refreshWorkspace(result.accessToken);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Authentication failed.');
      }
    });
  }

  function updateProfile() {
    startTransition(async () => {
      try {
        const updatedProfile = await apiRequest<UserProfile>('/profile', {
          method: 'PATCH',
          body: JSON.stringify({
            mainDream: profileForm.mainDream,
            currentLifeFocus: profileForm.currentLifeFocus,
            biggestDistractions: profileForm.biggestDistractions
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
            dailyFocusMinutes: Number(profileForm.dailyFocusMinutes),
            preferredReminderTone: profileForm.preferredReminderTone,
          }),
        });

        setProfile(updatedProfile);
        setMessage('Profile updated. Your dream and focus are saved.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Profile update failed.');
      }
    });
  }

  function createGoal() {
    startTransition(async () => {
      try {
        await apiRequest<Goal>('/goals', {
          method: 'POST',
          body: JSON.stringify({
            title: goalForm.title,
            category: goalForm.category,
            whyItMatters: goalForm.whyItMatters || undefined,
            relationshipId: goalForm.relationshipId || undefined,
          }),
        });

        setGoalForm(initialGoalForm);
        await refreshWorkspace();
        setMessage('Goal created.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Goal creation failed.');
      }
    });
  }

  function createHabit() {
    startTransition(async () => {
      try {
        await apiRequest<Habit>('/habits', {
          method: 'POST',
          body: JSON.stringify({
            title: habitForm.title,
            goalId: habitForm.goalId || undefined,
            reminderTime: habitForm.reminderTime || undefined,
          }),
        });

        setHabitForm(initialHabitForm);
        await refreshWorkspace();
        setMessage('Habit created.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Habit creation failed.');
      }
    });
  }

  function completeHabit(id: string) {
    startTransition(async () => {
      try {
        await apiRequest(`/habits/${id}/complete`, {
          method: 'POST',
          body: JSON.stringify({ note: 'Completed from dashboard' }),
        });
        await refreshWorkspace();
        setMessage('Habit completed for today.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Habit completion failed.');
      }
    });
  }

  function createDistractionLog() {
    startTransition(async () => {
      try {
        await apiRequest<DistractionLog>('/distractions', {
          method: 'POST',
          body: JSON.stringify({
            platform: distractionForm.platform,
            minutesLost: Number(distractionForm.minutesLost),
            triggerReason: distractionForm.triggerReason || undefined,
            moodBefore: distractionForm.moodBefore || undefined,
            moodAfter: distractionForm.moodAfter || undefined,
            replacementAction: distractionForm.replacementAction || undefined,
          }),
        });

        setDistractionForm(initialDistractionForm);
        await refreshWorkspace();
        setMessage('Distraction logged. Pattern awareness improved.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Distraction logging failed.');
      }
    });
  }

  function createRelationship() {
    startTransition(async () => {
      try {
        await apiRequest<Relationship>('/relationships', {
          method: 'POST',
          body: JSON.stringify({
            partnerEmail: relationshipForm.partnerEmail || undefined,
            partnerName: relationshipForm.partnerName || undefined,
          }),
        });

        setRelationshipForm(initialRelationshipForm);
        await refreshWorkspace();
        setMessage('Accountability partner added for discipline check-ins.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Partner creation failed.');
      }
    });
  }

  function createRelationshipCheckIn() {
    startTransition(async () => {
      try {
        await apiRequest(`/relationships/${relationshipCheckInForm.relationshipId}/check-ins`, {
          method: 'POST',
          body: JSON.stringify({
            mood: relationshipCheckInForm.mood,
            appreciation: relationshipCheckInForm.appreciation || undefined,
            concern: relationshipCheckInForm.concern || undefined,
            commitment: relationshipCheckInForm.commitment || undefined,
          }),
        });

        setRelationshipCheckInForm(initialRelationshipCheckInForm);
        await refreshWorkspace();
        setMessage('Accountability check-in saved.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Accountability check-in failed.');
      }
    });
  }

  function createAiPlan() {
    startTransition(async () => {
      try {
        await apiRequest<AiPlan>('/ai-plans', {
          method: 'POST',
          body: JSON.stringify({
            dream: aiPlanForm.dream,
            currentSituation: aiPlanForm.currentSituation || undefined,
            mainObstacle: aiPlanForm.mainObstacle || undefined,
            roleModel: aiPlanForm.roleModel || undefined,
          }),
        });

        setAiPlanForm(initialAiPlanForm);
        await refreshWorkspace();
        setMessage('AI discipline plan generated and saved.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'AI plan generation failed.');
      }
    });
  }

  function activateAiPlan(id: string) {
    startTransition(async () => {
      try {
        const result = await apiRequest<AiPlanActivationResult>(`/ai-plans/${id}/activate`, {
          method: 'POST',
        });

        await refreshWorkspace();
        setMessage(
          `AI plan activated: ${result.createdGoals.length} goals, ${result.createdHabits.length} habits, and ${result.createdReminders.length} reminders created.`,
        );
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'AI plan activation failed.');
      }
    });
  }

  function createReminder() {
    startTransition(async () => {
      try {
        await apiRequest<Reminder>('/reminders', {
          method: 'POST',
          body: JSON.stringify({
            title: reminderForm.title,
            type: reminderForm.type,
            scheduledAt: new Date(reminderForm.scheduledAt).toISOString(),
            note: reminderForm.note || undefined,
          }),
        });

        setReminderForm(initialReminderForm);
        await refreshWorkspace();
        setMessage('Reminder created.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Reminder creation failed.');
      }
    });
  }

  function completeReminder(id: string) {
    startTransition(async () => {
      try {
        await apiRequest<Reminder>(`/reminders/${id}/complete`, {
          method: 'POST',
        });

        await refreshWorkspace();
        setMessage('Reminder completed.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Reminder completion failed.');
      }
    });
  }

  function createReflection() {
    startTransition(async () => {
      try {
        await apiRequest<DailyReflection>('/reflections', {
          method: 'POST',
          body: JSON.stringify({
            mood: reflectionForm.mood,
            wins: reflectionForm.wins || undefined,
            blockers: reflectionForm.blockers || undefined,
            distractions: reflectionForm.distractions || undefined,
            tomorrowCommitment: reflectionForm.tomorrowCommitment || undefined,
            focusScore: Number(reflectionForm.focusScore),
          }),
        });

        setReflectionForm(initialReflectionForm);
        await refreshWorkspace();
        setMessage('Evening reflection saved. Tomorrow has a cleaner starting point.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Reflection creation failed.');
      }
    });
  }

  function createFocusSession() {
    startTransition(async () => {
      try {
        await apiRequest<FocusSession>('/focus-sessions', {
          method: 'POST',
          body: JSON.stringify({
            title: focusSessionForm.title,
            durationMinutes: Number(focusSessionForm.durationMinutes),
            goalId: focusSessionForm.goalId || undefined,
            habitId: focusSessionForm.habitId || undefined,
            energyLevel: focusSessionForm.energyLevel || undefined,
            distractionFree: focusSessionForm.distractionFree,
            note: focusSessionForm.note || undefined,
          }),
        });

        setFocusSessionForm(initialFocusSessionForm);
        await refreshWorkspace();
        setMessage('Focus session logged. You replaced distraction with proof.');
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Focus session creation failed.');
      }
    });
  }

  function signOut() {
    window.localStorage.removeItem('disciplineos_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setGoals([]);
    setHabits([]);
    setDistractionLogs([]);
    setDistractionSummary(null);
    setRelationships([]);
    setAiPlans([]);
    setAnalyticsSummary(null);
    setDailyPlan(null);
    setReminders([]);
    setReflections([]);
    setReflectionSummary(null);
    setFocusSessions([]);
    setFocusSessionSummary(null);
    setMessage('Signed out locally.');
  }

  const latestAiPlan = aiPlans[0];

  function getPartnerLabel(relationship: Relationship) {
    return (
      relationship.partner?.name ??
      relationship.partner?.email ??
      relationship.partnerName ??
      'Accountability partner'
    );
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="grid gap-5">
        <div className="border border-white/10 bg-panel p-5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent/80">
                Account
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">Auth workspace</h2>
            </div>
            {token ? (
              <button
                type="button"
                onClick={signOut}
                className="min-h-10 border border-white/15 px-4 text-sm font-bold text-white"
              >
                Sign out
              </button>
            ) : null}
          </div>

          <div className="mt-5 flex border border-white/10 bg-black/25 p-1">
            {(['signup', 'login'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAuthMode(mode)}
                className={`min-h-10 flex-1 px-4 text-sm font-bold ${
                  authMode === mode ? 'bg-accent text-black' : 'text-muted'
                }`}
              >
                {mode === 'signup' ? 'Signup' : 'Login'}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3">
            {authMode === 'signup' ? (
              <input
                value={authForm.name}
                onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                placeholder="Name"
                className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
              />
            ) : null}
            <input
              value={authForm.email}
              onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              placeholder="Email"
              type="email"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={authForm.password}
              onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
              placeholder="Password"
              type="password"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <button
              type="button"
              onClick={submitAuth}
              disabled={isPending}
              className="min-h-12 bg-accent px-5 text-sm font-black text-black disabled:opacity-60"
            >
              {isPending ? 'Working...' : authMode === 'signup' ? 'Create account' : 'Login'}
            </button>
          </div>
        </div>

        <div className="border border-white/10 bg-black/24 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-warning">Session</p>
          <p className="mt-3 break-all text-xl font-black text-white">
            {user?.email ?? 'No active user'}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">{message}</p>
        </div>

        <div className="border border-white/10 bg-panel p-5 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent/80">
            Analytics
          </p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Focus score</p>
              <p className="mt-2 text-5xl font-black text-white">
                {analyticsSummary?.focusScore ?? 0}
              </p>
            </div>
            <div className="h-24 w-24 rounded-full border-8 border-accent/30 p-2">
              <div
                className="h-full rounded-full bg-accent"
                style={{
                  opacity: Math.max(0.18, (analyticsSummary?.focusScore ?? 0) / 100),
                }}
              />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="border border-white/10 bg-black/24 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Goals</p>
              <p className="mt-2 text-xl font-black text-white">
                {analyticsSummary?.activeGoals ?? 0}
              </p>
            </div>
            <div className="border border-white/10 bg-black/24 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Habits</p>
              <p className="mt-2 text-xl font-black text-white">
                {analyticsSummary?.totalHabits ?? 0}
              </p>
            </div>
            <div className="border border-white/10 bg-black/24 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Streak</p>
              <p className="mt-2 text-xl font-black text-white">
                {analyticsSummary?.totalStreak ?? 0}
              </p>
            </div>
            <div className="border border-white/10 bg-black/24 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Lost min</p>
              <p className="mt-2 text-xl font-black text-warning">
                {analyticsSummary?.distractionMinutesLost ?? 0}
              </p>
            </div>
            <div className="border border-white/10 bg-black/24 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Focus min</p>
              <p className="mt-2 text-xl font-black text-accent">
                {analyticsSummary?.focusSessionMinutes ?? 0}
              </p>
            </div>
            <div className="border border-white/10 bg-black/24 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Reflect avg</p>
              <p className="mt-2 text-xl font-black text-white">
                {analyticsSummary?.averageReflectionScore ?? 0}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Top distraction:{' '}
            <span className="font-bold text-white">
              {analyticsSummary?.topDistractionPlatform ?? 'None yet'}
            </span>
            {' '}| Distraction-free sessions:{' '}
            <span className="font-bold text-accent">
              {analyticsSummary?.distractionFreeFocusSessions ?? 0}
            </span>
          </p>
        </div>

        <div className="border border-accent/25 bg-accent/10 p-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent/80">
                Today focus plan
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                {dailyPlan?.headline ?? 'Log in to generate today plan'}
              </h2>
            </div>
            <div className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-muted">
              Focus:{' '}
              <span className="font-black text-accent">
                {dailyPlan?.focusMinutesDone ?? 0}/{dailyPlan?.focusMinutes ?? 0}m
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {(dailyPlan?.actionSteps ?? ['Create your first goal, habit, reminder, and distraction log.'])
              .slice(0, 5)
              .map((step, index) => (
                <div key={step} className="flex gap-3 border border-white/10 bg-black/24 p-4">
                  <span className="flex size-8 shrink-0 items-center justify-center bg-accent font-mono text-sm font-black text-black">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-100">{step}</p>
                </div>
              ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="border border-white/10 bg-black/24 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Distraction shield</p>
              <p className="mt-3 text-sm leading-6 text-white">
                {dailyPlan?.distractionShield.replacementAction ??
                  'Your replacement action appears after logging distractions.'}
              </p>
            </div>
            <div className="border border-white/10 bg-black/24 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Partner nudge</p>
              <p className="mt-3 text-sm leading-6 text-white">
                {dailyPlan?.partnerNudge.message ??
                  'Add a partner to receive accountability nudges.'}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-white/10 bg-panel p-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent/80">
                Focus sessions
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">Replace scroll with proof</h2>
            </div>
            <div className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-muted">
              Hours:{' '}
              <span className="font-black text-accent">
                {focusSessionSummary?.totalHours ?? 0}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <input
              value={focusSessionForm.title}
              onChange={(event) =>
                setFocusSessionForm({ ...focusSessionForm, title: event.target.value })
              }
              placeholder="Focus session title"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={focusSessionForm.durationMinutes}
                onChange={(event) =>
                  setFocusSessionForm({
                    ...focusSessionForm,
                    durationMinutes: event.target.value,
                  })
                }
                placeholder="Minutes"
                type="number"
                min="1"
                max="720"
                className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
              />
              <input
                value={focusSessionForm.energyLevel}
                onChange={(event) =>
                  setFocusSessionForm({ ...focusSessionForm, energyLevel: event.target.value })
                }
                placeholder="Energy level"
                className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
              />
            </div>
            <select
              value={focusSessionForm.goalId}
              onChange={(event) =>
                setFocusSessionForm({ ...focusSessionForm, goalId: event.target.value })
              }
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            >
              <option value="">No linked goal</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
            <select
              value={focusSessionForm.habitId}
              onChange={(event) =>
                setFocusSessionForm({ ...focusSessionForm, habitId: event.target.value })
              }
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            >
              <option value="">No linked habit</option>
              {habits.map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.title}
                </option>
              ))}
            </select>
            <textarea
              value={focusSessionForm.note}
              onChange={(event) =>
                setFocusSessionForm({ ...focusSessionForm, note: event.target.value })
              }
              placeholder="What did you complete?"
              className="min-h-20 border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            />
            <label className="flex items-center gap-3 border border-white/10 bg-black/24 px-4 py-3 text-sm font-bold text-white">
              <input
                checked={focusSessionForm.distractionFree}
                onChange={(event) =>
                  setFocusSessionForm({
                    ...focusSessionForm,
                    distractionFree: event.target.checked,
                  })
                }
                type="checkbox"
                className="size-4 accent-[var(--accent)]"
              />
              Distraction-free block
            </label>
            <button
              type="button"
              onClick={createFocusSession}
              disabled={
                !token ||
                isPending ||
                !focusSessionForm.title ||
                Number(focusSessionForm.durationMinutes) < 1
              }
              className="min-h-11 bg-accent px-5 text-sm font-black text-black disabled:opacity-50"
            >
              Log focus session
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {focusSessions.slice(0, 4).map((session) => (
              <article key={session.id} className="border border-white/10 bg-white/6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black text-white">{session.title}</p>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    {session.durationMinutes}m
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {session.goal?.title ?? session.habit?.title ?? session.note ?? 'Focused block'}
                </p>
                {session.distractionFree ? (
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    Distraction free
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </div>

        <div className="border border-white/10 bg-panel p-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-warning">
                Evening reflection
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">Close the day honestly</h2>
            </div>
            <div className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-muted">
              Avg:{' '}
              <span className="font-black text-warning">
                {reflectionSummary?.averageFocusScore ?? 0}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={reflectionForm.mood}
                onChange={(event) =>
                  setReflectionForm({ ...reflectionForm, mood: event.target.value })
                }
                placeholder="Mood, e.g. focused, tired, calm"
                className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
              />
              <input
                value={reflectionForm.focusScore}
                onChange={(event) =>
                  setReflectionForm({ ...reflectionForm, focusScore: event.target.value })
                }
                placeholder="Focus score 0-100"
                type="number"
                min="0"
                max="100"
                className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
              />
            </div>
            <textarea
              value={reflectionForm.wins}
              onChange={(event) =>
                setReflectionForm({ ...reflectionForm, wins: event.target.value })
              }
              placeholder="What went well today?"
              className="min-h-20 border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            />
            <textarea
              value={reflectionForm.blockers}
              onChange={(event) =>
                setReflectionForm({ ...reflectionForm, blockers: event.target.value })
              }
              placeholder="What blocked your focus?"
              className="min-h-20 border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            />
            <textarea
              value={reflectionForm.distractions}
              onChange={(event) =>
                setReflectionForm({ ...reflectionForm, distractions: event.target.value })
              }
              placeholder="Which distractions pulled you most?"
              className="min-h-20 border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            />
            <input
              value={reflectionForm.tomorrowCommitment}
              onChange={(event) =>
                setReflectionForm({
                  ...reflectionForm,
                  tomorrowCommitment: event.target.value,
                })
              }
              placeholder="Tomorrow commitment"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <button
              type="button"
              onClick={createReflection}
              disabled={!token || isPending || !reflectionForm.mood}
              className="min-h-11 bg-warning px-5 text-sm font-black text-black disabled:opacity-50"
            >
              Save reflection
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {reflections.slice(0, 3).map((reflection) => (
              <article key={reflection.id} className="border border-white/10 bg-white/6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black text-white">{reflection.mood}</p>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    Score {reflection.focusScore} -{' '}
                    {new Date(reflection.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {reflection.tomorrowCommitment ??
                    reflection.wins ??
                    'Reflection saved for discipline history.'}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="border border-white/10 bg-panel p-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-warning">
                Reminders
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">Next discipline nudge</h2>
            </div>
            <div className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-muted">
              Due: <span className="font-black text-warning">{reminders.length}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <input
              value={reminderForm.title}
              onChange={(event) =>
                setReminderForm({ ...reminderForm, title: event.target.value })
              }
              placeholder="Reminder title"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <select
              value={reminderForm.type}
              onChange={(event) =>
                setReminderForm({ ...reminderForm, type: event.target.value })
              }
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            >
              <option value="habit">Habit</option>
              <option value="goal">Goal</option>
              <option value="accountability">Accountability</option>
              <option value="distraction_replacement">Distraction replacement</option>
            </select>
            <input
              value={reminderForm.scheduledAt}
              onChange={(event) =>
                setReminderForm({ ...reminderForm, scheduledAt: event.target.value })
              }
              type="datetime-local"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={reminderForm.note}
              onChange={(event) => setReminderForm({ ...reminderForm, note: event.target.value })}
              placeholder="Optional note"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <button
              type="button"
              onClick={createReminder}
              disabled={!token || isPending || !reminderForm.title || !reminderForm.scheduledAt}
              className="min-h-11 bg-warning px-5 text-sm font-black text-black disabled:opacity-50"
            >
              Add reminder
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {reminders.slice(0, 4).map((reminder) => (
              <article key={reminder.id} className="border border-white/10 bg-white/6 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-white">{reminder.title}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                      {reminder.type} - {new Date(reminder.scheduledAt).toLocaleString()}
                    </p>
                    {reminder.note ? (
                      <p className="mt-2 text-sm leading-6 text-muted">{reminder.note}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => completeReminder(reminder.id)}
                    className="min-h-9 bg-accent px-3 text-xs font-black text-black"
                  >
                    Done
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="border border-white/10 bg-panel p-5 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent/80">Profile</p>
          <h2 className="mt-2 text-2xl font-black text-white">Your discipline identity</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input
              value={profileForm.mainDream}
              onChange={(event) =>
                setProfileForm({ ...profileForm, mainDream: event.target.value })
              }
              placeholder="Main dream"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={profileForm.currentLifeFocus}
              onChange={(event) =>
                setProfileForm({ ...profileForm, currentLifeFocus: event.target.value })
              }
              placeholder="Current life focus"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={profileForm.biggestDistractions}
              onChange={(event) =>
                setProfileForm({ ...profileForm, biggestDistractions: event.target.value })
              }
              placeholder="Distractions, comma separated"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={profileForm.dailyFocusMinutes}
              onChange={(event) =>
                setProfileForm({ ...profileForm, dailyFocusMinutes: event.target.value })
              }
              placeholder="Daily focus minutes"
              type="number"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
          </div>
          <button
            type="button"
            onClick={updateProfile}
            disabled={!token || isPending}
            className="mt-4 min-h-11 bg-warning px-5 text-sm font-black text-black disabled:opacity-50"
          >
            Save profile
          </button>
          <p className="mt-3 text-sm text-muted">
            Saved dream: {profile?.mainDream ?? 'Not set yet'}
          </p>
        </div>

        <div className="border border-white/10 bg-panel p-5 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-warning">
                AI planner
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Turn a dream into a discipline plan
              </h2>
            </div>
            <div className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-muted">
              Plans: <span className="font-black text-warning">{aiPlans.length}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input
              value={aiPlanForm.dream}
              onChange={(event) => setAiPlanForm({ ...aiPlanForm, dream: event.target.value })}
              placeholder="Dream, e.g. become a strong full-stack developer"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none md:col-span-2"
            />
            <input
              value={aiPlanForm.currentSituation}
              onChange={(event) =>
                setAiPlanForm({ ...aiPlanForm, currentSituation: event.target.value })
              }
              placeholder="Current situation"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={aiPlanForm.mainObstacle}
              onChange={(event) =>
                setAiPlanForm({ ...aiPlanForm, mainObstacle: event.target.value })
              }
              placeholder="Main obstacle"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={aiPlanForm.roleModel}
              onChange={(event) =>
                setAiPlanForm({ ...aiPlanForm, roleModel: event.target.value })
              }
              placeholder="Role model, optional"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <button
              type="button"
              onClick={createAiPlan}
              disabled={!token || isPending || aiPlanForm.dream.length < 5}
              className="min-h-12 bg-warning px-5 text-sm font-black text-black disabled:opacity-50"
            >
              Generate plan
            </button>
          </div>

          {latestAiPlan ? (
            <article className="mt-5 border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Latest plan</p>
              <h3 className="mt-3 text-xl font-black text-white">{latestAiPlan.dream}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{latestAiPlan.mentorStory}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="border border-white/10 bg-black/24 p-4">
                  <p className="text-sm font-black text-warning">First goal</p>
                  <p className="mt-2 text-sm text-white">
                    {latestAiPlan.suggestedGoals[0]?.title ?? 'No goal generated'}
                  </p>
                </div>
                <div className="border border-white/10 bg-black/24 p-4">
                  <p className="text-sm font-black text-warning">First habit</p>
                  <p className="mt-2 text-sm text-white">
                    {latestAiPlan.suggestedHabits[0]?.title ?? 'No habit generated'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => activateAiPlan(latestAiPlan.id)}
                disabled={!token || isPending}
                className="mt-4 min-h-11 bg-accent px-5 text-sm font-black text-black disabled:opacity-50"
              >
                Activate plan into goals and habits
              </button>
            </article>
          ) : null}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="border border-white/10 bg-black/24 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent/80">Goals</p>
            <div className="mt-4 grid gap-3">
              <input
                value={goalForm.title}
                onChange={(event) => setGoalForm({ ...goalForm, title: event.target.value })}
                placeholder="Goal title"
                className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
              />
              <input
                value={goalForm.category}
                onChange={(event) => setGoalForm({ ...goalForm, category: event.target.value })}
                placeholder="Category"
                className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
              />
              <select
                value={goalForm.relationshipId}
                onChange={(event) =>
                  setGoalForm({ ...goalForm, relationshipId: event.target.value })
                }
                className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
              >
                <option value="">Private goal</option>
                {relationships.map((relationship) => (
                  <option key={relationship.id} value={relationship.id}>
                    Share with {getPartnerLabel(relationship)}
                  </option>
                ))}
              </select>
              <textarea
                value={goalForm.whyItMatters}
                onChange={(event) =>
                  setGoalForm({ ...goalForm, whyItMatters: event.target.value })
                }
                placeholder="Why this matters"
                className="min-h-24 border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
              <button
                type="button"
                onClick={createGoal}
                disabled={!token || isPending}
                className="min-h-11 bg-accent px-5 text-sm font-black text-black disabled:opacity-50"
              >
                Add goal
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              {goals.map((goal) => (
                <article key={goal.id} className="border border-white/10 bg-white/6 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-base font-black text-white">{goal.title}</p>
                    <span className="border border-white/10 bg-black/25 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                      {goal.relationship ? 'Shared' : 'Private'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{goal.whyItMatters ?? goal.category}</p>
                  {goal.relationship ? (
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                      With {getPartnerLabel(goal.relationship)}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-black/24 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent/80">Habits</p>
            <div className="mt-4 grid gap-3">
              <input
                value={habitForm.title}
                onChange={(event) => setHabitForm({ ...habitForm, title: event.target.value })}
                placeholder="Habit title"
                className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
              />
              <select
                value={habitForm.goalId}
                onChange={(event) => setHabitForm({ ...habitForm, goalId: event.target.value })}
                className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
              >
                <option value="">No linked goal</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
              <input
                value={habitForm.reminderTime}
                onChange={(event) =>
                  setHabitForm({ ...habitForm, reminderTime: event.target.value })
                }
                placeholder="Reminder time, e.g. 07:30"
                className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
              />
              <button
                type="button"
                onClick={createHabit}
                disabled={!token || isPending}
                className="min-h-11 bg-accent px-5 text-sm font-black text-black disabled:opacity-50"
              >
                Add habit
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              {habits.map((habit) => (
                <article key={habit.id} className="border border-white/10 bg-white/6 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-black text-white">{habit.title}</p>
                      <p className="mt-2 text-sm text-muted">Streak: {habit.currentStreak}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => completeHabit(habit.id)}
                      className="min-h-10 bg-warning px-3 text-xs font-black text-black"
                    >
                      Complete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-white/10 bg-panel p-5 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent/80">
                Accountability partner
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">Discipline check-ins</h2>
            </div>
            <div className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-muted">
              Partners:{' '}
              <span className="font-black text-accent">{relationships.length}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <input
              value={relationshipForm.partnerName}
              onChange={(event) =>
                setRelationshipForm({ ...relationshipForm, partnerName: event.target.value })
              }
              placeholder="Partner name"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={relationshipForm.partnerEmail}
              onChange={(event) =>
                setRelationshipForm({ ...relationshipForm, partnerEmail: event.target.value })
              }
              placeholder="Partner email if they joined"
              type="email"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <button
              type="button"
              onClick={createRelationship}
              disabled={!token || isPending}
              className="min-h-12 bg-accent px-5 text-sm font-black text-black disabled:opacity-50"
            >
              Add partner
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <select
              value={relationshipCheckInForm.relationshipId}
              onChange={(event) =>
                setRelationshipCheckInForm({
                  ...relationshipCheckInForm,
                  relationshipId: event.target.value,
                })
              }
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            >
              <option value="">Choose accountability partner</option>
              {relationships.map((relationship) => (
                <option key={relationship.id} value={relationship.id}>
                  {getPartnerLabel(relationship)}
                </option>
              ))}
            </select>
            <input
              value={relationshipCheckInForm.mood}
              onChange={(event) =>
                setRelationshipCheckInForm({
                  ...relationshipCheckInForm,
                  mood: event.target.value,
                })
              }
              placeholder="Mood"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={relationshipCheckInForm.appreciation}
              onChange={(event) =>
                setRelationshipCheckInForm({
                  ...relationshipCheckInForm,
                  appreciation: event.target.value,
                })
              }
              placeholder="Appreciation"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={relationshipCheckInForm.commitment}
              onChange={(event) =>
                setRelationshipCheckInForm({
                  ...relationshipCheckInForm,
                  commitment: event.target.value,
                })
              }
              placeholder="Next commitment"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={relationshipCheckInForm.concern}
              onChange={(event) =>
                setRelationshipCheckInForm({
                  ...relationshipCheckInForm,
                  concern: event.target.value,
                })
              }
              placeholder="Concern to discuss"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none md:col-span-2"
            />
            <button
              type="button"
              onClick={createRelationshipCheckIn}
              disabled={!token || isPending || !relationshipCheckInForm.relationshipId}
              className="min-h-12 bg-warning px-5 text-sm font-black text-black disabled:opacity-50"
            >
              Save check-in
            </button>
          </div>

          <div className="mt-5 grid gap-3">
            {relationships.map((relationship) => (
              <article key={relationship.id} className="border border-white/10 bg-white/6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black text-white">
                    {getPartnerLabel(relationship)}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    {relationship.status}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Latest:{' '}
                  {relationship.checkIns?.[0]?.commitment ??
                    relationship.checkIns?.[0]?.appreciation ??
                    'No check-in yet'}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="border border-white/10 bg-panel p-5 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-warning">
                Distraction tracker
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">Reduce social pull</h2>
            </div>
            <div className="border border-white/10 bg-black/30 px-4 py-3 text-sm text-muted">
              Lost:{' '}
              <span className="font-black text-warning">
                {distractionSummary?.totalMinutesLost ?? 0} min
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <input
              value={distractionForm.platform}
              onChange={(event) =>
                setDistractionForm({ ...distractionForm, platform: event.target.value })
              }
              placeholder="Platform"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={distractionForm.minutesLost}
              onChange={(event) =>
                setDistractionForm({ ...distractionForm, minutesLost: event.target.value })
              }
              placeholder="Minutes lost"
              type="number"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={distractionForm.moodBefore}
              onChange={(event) =>
                setDistractionForm({ ...distractionForm, moodBefore: event.target.value })
              }
              placeholder="Mood before"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={distractionForm.triggerReason}
              onChange={(event) =>
                setDistractionForm({ ...distractionForm, triggerReason: event.target.value })
              }
              placeholder="Trigger reason"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none md:col-span-2"
            />
            <input
              value={distractionForm.moodAfter}
              onChange={(event) =>
                setDistractionForm({ ...distractionForm, moodAfter: event.target.value })
              }
              placeholder="Mood after"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none"
            />
            <input
              value={distractionForm.replacementAction}
              onChange={(event) =>
                setDistractionForm({
                  ...distractionForm,
                  replacementAction: event.target.value,
                })
              }
              placeholder="Replacement action"
              className="min-h-12 border border-white/10 bg-black/30 px-4 text-white outline-none md:col-span-2"
            />
            <button
              type="button"
              onClick={createDistractionLog}
              disabled={!token || isPending}
              className="min-h-12 bg-warning px-5 text-sm font-black text-black disabled:opacity-50"
            >
              Log distraction
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="border border-white/10 bg-black/24 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Top platform</p>
              <p className="mt-3 text-xl font-black text-white">
                {distractionSummary?.topPlatform ?? 'None yet'}
              </p>
            </div>
            <div className="border border-white/10 bg-black/24 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Latest replacement</p>
              <p className="mt-3 text-sm leading-6 text-white">
                {distractionSummary?.latestReplacementAction ?? 'Log an action to build a pattern.'}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {distractionLogs.slice(0, 5).map((log) => (
              <article key={log.id} className="border border-white/10 bg-white/6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black text-white">
                    {log.platform} - {log.minutesLost} min
                  </p>
                  <p className="font-mono text-xs text-muted">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {log.triggerReason ?? 'No trigger noted'} {'->'}{' '}
                  {log.replacementAction ?? 'No replacement action yet'}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
