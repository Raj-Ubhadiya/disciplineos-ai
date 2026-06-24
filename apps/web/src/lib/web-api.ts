import type {
  AiPlan,
  AnalyticsSummary,
  ApiHealthResponse,
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
  OtpRequestResponse,
  OtpChannel,
  Relationship,
  Reminder,
  UserProfile,
} from '@disciplineos/types';

export type WorkspaceSnapshot = {
  user: AuthUser;
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
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = LoginPayload & {
  name: string;
  phone?: string;
};

export type OtpRequestPayload = {
  channel: OtpChannel;
  email?: string;
  phone?: string;
  purpose: 'login' | 'signup';
  name?: string;
};

export type OtpVerifyPayload = OtpRequestPayload & {
  code: string;
};

export type GoogleAuthPayload = {
  idToken: string;
};

export function getApiV1BaseUrl(apiUrl: string): string {
  const normalizedUrl = apiUrl.replace(/\/$/, '');

  if (normalizedUrl.endsWith('/api/v1')) {
    return normalizedUrl;
  }

  if (normalizedUrl.endsWith('/api')) {
    return `${normalizedUrl}/v1`;
  }

  return `${normalizedUrl}/api/v1`;
}

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

function getApiErrorMessage(error: ApiErrorBody | null, status: number): string {
  if (!error) {
    return `Request failed: ${status}`;
  }

  if (Array.isArray(error.message)) {
    return error.message.join(' ');
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  return `Request failed: ${status}`;
}

export async function apiRequest<T>(
  apiUrl: string,
  path: string,
  init?: RequestInit,
  token?: string | null,
): Promise<T> {
  const response = await fetch(`${getApiV1BaseUrl(apiUrl)}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new Error(getApiErrorMessage(error, response.status));
  }

  return (await response.json()) as T;
}

export async function fetchHealth(apiUrl: string): Promise<ApiHealthResponse | null> {
  try {
    const response = await fetch(`${getApiV1BaseUrl(apiUrl)}/health`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ApiHealthResponse;
  } catch {
    return null;
  }
}

export async function login(apiUrl: string, payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(apiUrl, '/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function signup(apiUrl: string, payload: SignupPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(apiUrl, '/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function requestOtp(
  apiUrl: string,
  payload: OtpRequestPayload,
): Promise<OtpRequestResponse> {
  return apiRequest<OtpRequestResponse>(apiUrl, '/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyOtp(apiUrl: string, payload: OtpVerifyPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(apiUrl, '/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginWithGoogle(
  apiUrl: string,
  payload: GoogleAuthPayload,
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(apiUrl, '/auth/google', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchAuthenticatedUser(
  apiUrl: string,
  token: string,
): Promise<AuthUser> {
  return apiRequest<AuthUser>(apiUrl, '/auth/me', undefined, token);
}

export async function fetchWorkspaceSnapshot(
  apiUrl: string,
  token: string,
): Promise<WorkspaceSnapshot> {
  const [
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
  ] = await Promise.all([
    apiRequest<AuthUser>(apiUrl, '/auth/me', undefined, token),
    apiRequest<UserProfile>(apiUrl, '/profile', undefined, token).catch(() => null),
    apiRequest<Goal[]>(apiUrl, '/goals', undefined, token),
    apiRequest<Habit[]>(apiUrl, '/habits', undefined, token),
    apiRequest<DistractionLog[]>(apiUrl, '/distractions', undefined, token),
    apiRequest<DistractionSummary>(apiUrl, '/distractions/summary', undefined, token).catch(
      () => null,
    ),
    apiRequest<Relationship[]>(apiUrl, '/relationships', undefined, token),
    apiRequest<AiPlan[]>(apiUrl, '/ai-plans', undefined, token),
    apiRequest<AnalyticsSummary>(apiUrl, '/analytics/summary', undefined, token).catch(
      () => null,
    ),
    apiRequest<DailyPlan>(apiUrl, '/daily-plan/today', undefined, token).catch(() => null),
    apiRequest<Reminder[]>(apiUrl, '/reminders/upcoming', undefined, token),
    apiRequest<DailyReflection[]>(apiUrl, '/reflections', undefined, token),
    apiRequest<DailyReflectionSummary>(apiUrl, '/reflections/summary', undefined, token).catch(
      () => null,
    ),
    apiRequest<FocusSession[]>(apiUrl, '/focus-sessions', undefined, token),
    apiRequest<FocusSessionSummary>(apiUrl, '/focus-sessions/summary', undefined, token).catch(
      () => null,
    ),
  ]);

  return {
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
  };
}
