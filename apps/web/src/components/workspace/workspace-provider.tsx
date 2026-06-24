'use client';

import type {
  AiPlan,
  AiPlanActivationResult,
  AnalyticsSummary,
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
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useTransition } from 'react';

import { apiRequest, fetchWorkspaceSnapshot } from '@/lib/web-api';

type WorkspaceContextValue = {
  user: AuthUser | null;
  profile: UserProfile | null;
  goals: Goal[];
  habits: Habit[];
  distractionLogs: DistractionLog[];
  distractionSummary: DistractionSummary | null;
  relationships: Relationship[];
  aiPlans: AiPlan[];
  analyticsSummary: AnalyticsSummary | null;
  dailyPlan: DailyPlan | null;
  reminders: Reminder[];
  reflections: DailyReflection[];
  reflectionSummary: DailyReflectionSummary | null;
  focusSessions: FocusSession[];
  focusSessionSummary: FocusSessionSummary | null;
  token: string | null;
  isPending: boolean;
  isBooting: boolean;
  feedback: { tone: 'success' | 'error' | 'info'; text: string } | null;
  refreshWorkspace: () => Promise<void>;
  signOut: () => void;
  updateProfile: (payload: {
    mainDream: string;
    currentLifeFocus: string;
    biggestDistractions: string;
    dailyFocusMinutes: string;
    preferredReminderTone: string;
  }) => void;
  createGoal: (payload: {
    title: string;
    category: string;
    whyItMatters: string;
    relationshipId: string;
  }) => void;
  createHabit: (payload: { title: string; goalId: string; reminderTime: string }) => void;
  completeHabit: (id: string) => void;
  createDistractionLog: (payload: {
    platform: string;
    minutesLost: string;
    triggerReason: string;
    moodBefore: string;
    moodAfter: string;
    replacementAction: string;
  }) => void;
  createRelationship: (payload: { partnerEmail: string; partnerName: string }) => void;
  createRelationshipCheckIn: (payload: {
    relationshipId: string;
    mood: string;
    appreciation: string;
    concern: string;
    commitment: string;
  }) => void;
  createAiPlan: (payload: {
    dream: string;
    currentSituation: string;
    mainObstacle: string;
    roleModel: string;
  }) => void;
  activateAiPlan: (id: string) => void;
  createReminder: (payload: {
    title: string;
    type: string;
    scheduledAt: string;
    note: string;
  }) => void;
  completeReminder: (id: string) => void;
  createReflection: (payload: {
    mood: string;
    wins: string;
    blockers: string;
    distractions: string;
    tomorrowCommitment: string;
    focusScore: string;
  }) => void;
  createFocusSession: (payload: {
    title: string;
    durationMinutes: string;
    goalId: string;
    habitId: string;
    energyLevel: string;
    distractionFree: boolean;
    note: string;
  }) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  apiUrl,
  children,
}: {
  apiUrl: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isBooting, setIsBooting] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<WorkspaceContextValue['feedback']>({
    tone: 'info',
    text: 'Syncing your discipline workspace...',
  });
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

  function clearWorkspaceState() {
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
  }

  function redirectToLogin(message?: string) {
    window.localStorage.removeItem('disciplineos_token');
    clearWorkspaceState();
    setIsBooting(true);
    setFeedback(message ? { tone: 'info', text: message } : null);
    router.replace('/login');
  }

  useEffect(() => {
    const savedToken = window.localStorage.getItem('disciplineos_token');

    if (!savedToken) {
      redirectToLogin();
      return;
    }

    setToken(savedToken);
    void hydrateWorkspace(savedToken);
  }, [router]);

  async function hydrateWorkspace(activeToken: string) {
    let shouldFinishBoot = true;

    try {
      const snapshot = await fetchWorkspaceSnapshot(apiUrl, activeToken);
      setUser(snapshot.user);
      setProfile(snapshot.profile);
      setGoals(snapshot.goals);
      setHabits(snapshot.habits);
      setDistractionLogs(snapshot.distractionLogs);
      setDistractionSummary(snapshot.distractionSummary);
      setRelationships(snapshot.relationships);
      setAiPlans(snapshot.aiPlans);
      setAnalyticsSummary(snapshot.analyticsSummary);
      setDailyPlan(snapshot.dailyPlan);
      setReminders(snapshot.reminders);
      setReflections(snapshot.reflections);
      setReflectionSummary(snapshot.reflectionSummary);
      setFocusSessions(snapshot.focusSessions);
      setFocusSessionSummary(snapshot.focusSessionSummary);
      setFeedback({ tone: 'success', text: 'Workspace synced and ready.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sync workspace.';

      if (message.toLowerCase().includes('401') || message.toLowerCase().includes('unauthorized')) {
        shouldFinishBoot = false;
        redirectToLogin('Your session expired. Please sign in again.');
        return;
      }

      setFeedback({ tone: 'error', text: message });
    } finally {
      if (shouldFinishBoot) {
        setIsBooting(false);
      }
    }
  }

  async function refreshWorkspace() {
    if (!token) {
      return;
    }

    await hydrateWorkspace(token);
  }

  function signOut() {
    window.localStorage.removeItem('disciplineos_token');
    clearWorkspaceState();
    setIsBooting(false);
    setFeedback({ tone: 'info', text: 'You have been signed out.' });
    router.replace('/login');
  }

  function runAction(task: () => Promise<void>) {
    startTransition(async () => {
      try {
        await task();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Something went wrong.';

        if (message.toLowerCase().includes('401') || message.toLowerCase().includes('unauthorized')) {
          redirectToLogin('Your session expired. Please sign in again.');
          return;
        }

        setFeedback({
          tone: 'error',
          text: message,
        });
      }
    });
  }

  const value: WorkspaceContextValue = {
    user,
    profile,
    goals,
    habits,
    distractionLogs,
    distractionSummary,
    relationships,
    aiPlans,
    analyticsSummary,
    dailyPlan,
    reminders,
    reflections,
    reflectionSummary,
    focusSessions,
    focusSessionSummary,
    token,
    isPending,
    isBooting,
    feedback,
    refreshWorkspace,
    signOut,
    updateProfile(payload) {
      runAction(async () => {
        const updatedProfile = await apiRequest<UserProfile>(apiUrl, '/profile', {
          method: 'PATCH',
          body: JSON.stringify({
            mainDream: payload.mainDream,
            currentLifeFocus: payload.currentLifeFocus,
            biggestDistractions: payload.biggestDistractions
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
            dailyFocusMinutes: Number(payload.dailyFocusMinutes),
            preferredReminderTone: payload.preferredReminderTone,
          }),
        }, token);

        setProfile(updatedProfile);
        setFeedback({ tone: 'success', text: 'Profile updated. Your focus settings are saved.' });
      });
    },
    createGoal(payload) {
      runAction(async () => {
        await apiRequest<Goal>(apiUrl, '/goals', {
          method: 'POST',
          body: JSON.stringify({
            title: payload.title,
            category: payload.category,
            whyItMatters: payload.whyItMatters || undefined,
            relationshipId: payload.relationshipId || undefined,
          }),
        }, token);
        await refreshWorkspace();
        setFeedback({ tone: 'success', text: 'Goal created.' });
      });
    },
    createHabit(payload) {
      runAction(async () => {
        await apiRequest<Habit>(apiUrl, '/habits', {
          method: 'POST',
          body: JSON.stringify({
            title: payload.title,
            goalId: payload.goalId || undefined,
            reminderTime: payload.reminderTime || undefined,
          }),
        }, token);
        await refreshWorkspace();
        setFeedback({ tone: 'success', text: 'Habit created.' });
      });
    },
    completeHabit(id) {
      runAction(async () => {
        await apiRequest(apiUrl, `/habits/${id}/complete`, {
          method: 'POST',
          body: JSON.stringify({ note: 'Completed from dashboard' }),
        }, token);
        await refreshWorkspace();
        setFeedback({ tone: 'success', text: 'Habit completed for today.' });
      });
    },
    createDistractionLog(payload) {
      runAction(async () => {
        await apiRequest<DistractionLog>(apiUrl, '/distractions', {
          method: 'POST',
          body: JSON.stringify({
            platform: payload.platform,
            minutesLost: Number(payload.minutesLost),
            triggerReason: payload.triggerReason || undefined,
            moodBefore: payload.moodBefore || undefined,
            moodAfter: payload.moodAfter || undefined,
            replacementAction: payload.replacementAction || undefined,
          }),
        }, token);
        await refreshWorkspace();
        setFeedback({ tone: 'success', text: 'Distraction logged. Pattern awareness improved.' });
      });
    },
    createRelationship(payload) {
      runAction(async () => {
        await apiRequest<Relationship>(apiUrl, '/relationships', {
          method: 'POST',
          body: JSON.stringify({
            partnerEmail: payload.partnerEmail || undefined,
            partnerName: payload.partnerName || undefined,
          }),
        }, token);
        await refreshWorkspace();
        setFeedback({ tone: 'success', text: 'Accountability partner added.' });
      });
    },
    createRelationshipCheckIn(payload) {
      runAction(async () => {
        await apiRequest(apiUrl, `/relationships/${payload.relationshipId}/check-ins`, {
          method: 'POST',
          body: JSON.stringify({
            mood: payload.mood,
            appreciation: payload.appreciation || undefined,
            concern: payload.concern || undefined,
            commitment: payload.commitment || undefined,
          }),
        }, token);
        await refreshWorkspace();
        setFeedback({ tone: 'success', text: 'Accountability check-in saved.' });
      });
    },
    createAiPlan(payload) {
      runAction(async () => {
        await apiRequest<AiPlan>(apiUrl, '/ai-plans', {
          method: 'POST',
          body: JSON.stringify({
            dream: payload.dream,
            currentSituation: payload.currentSituation || undefined,
            mainObstacle: payload.mainObstacle || undefined,
            roleModel: payload.roleModel || undefined,
          }),
        }, token);
        await refreshWorkspace();
        setFeedback({ tone: 'success', text: 'AI discipline plan generated and saved.' });
      });
    },
    activateAiPlan(id) {
      runAction(async () => {
        const result = await apiRequest<AiPlanActivationResult>(apiUrl, `/ai-plans/${id}/activate`, {
          method: 'POST',
        }, token);
        await refreshWorkspace();
        setFeedback({
          tone: 'success',
          text: `Plan activated: ${result.createdGoals.length} goals, ${result.createdHabits.length} habits, and ${result.createdReminders.length} reminders created.`,
        });
      });
    },
    createReminder(payload) {
      runAction(async () => {
        await apiRequest<Reminder>(apiUrl, '/reminders', {
          method: 'POST',
          body: JSON.stringify({
            title: payload.title,
            type: payload.type,
            scheduledAt: new Date(payload.scheduledAt).toISOString(),
            note: payload.note || undefined,
          }),
        }, token);
        await refreshWorkspace();
        setFeedback({ tone: 'success', text: 'Reminder created.' });
      });
    },
    completeReminder(id) {
      runAction(async () => {
        await apiRequest<Reminder>(apiUrl, `/reminders/${id}/complete`, {
          method: 'POST',
        }, token);
        await refreshWorkspace();
        setFeedback({ tone: 'success', text: 'Reminder completed.' });
      });
    },
    createReflection(payload) {
      runAction(async () => {
        await apiRequest<DailyReflection>(apiUrl, '/reflections', {
          method: 'POST',
          body: JSON.stringify({
            mood: payload.mood,
            wins: payload.wins || undefined,
            blockers: payload.blockers || undefined,
            distractions: payload.distractions || undefined,
            tomorrowCommitment: payload.tomorrowCommitment || undefined,
            focusScore: Number(payload.focusScore),
          }),
        }, token);
        await refreshWorkspace();
        setFeedback({ tone: 'success', text: 'Reflection saved. Tomorrow has a clearer start.' });
      });
    },
    createFocusSession(payload) {
      runAction(async () => {
        await apiRequest<FocusSession>(apiUrl, '/focus-sessions', {
          method: 'POST',
          body: JSON.stringify({
            title: payload.title,
            durationMinutes: Number(payload.durationMinutes),
            goalId: payload.goalId || undefined,
            habitId: payload.habitId || undefined,
            energyLevel: payload.energyLevel || undefined,
            distractionFree: payload.distractionFree,
            note: payload.note || undefined,
          }),
        }, token);
        await refreshWorkspace();
        setFeedback({ tone: 'success', text: 'Focus session logged. You chose progress over scroll.' });
      });
    },
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext);

  if (!value) {
    throw new Error('useWorkspace must be used inside WorkspaceProvider.');
  }

  return value;
}
