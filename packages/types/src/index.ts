export type Environment = 'development' | 'test' | 'production';

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface ApiHealthResponse {
  status: 'ok' | 'degraded';
  service: 'api';
  environment: Environment;
  database: 'up' | 'down';
  timestamp: string;
}

export interface AppMetadata {
  name: string;
  description: string;
  environment: Environment;
}

export interface AuthUser {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface OtpRequestResponse {
  message: string;
  debugCode?: string;
}

export type OtpChannel = 'email' | 'phone';

export type GoalCategory =
  | 'career'
  | 'study'
  | 'health'
  | 'business'
  | 'relationship'
  | 'finance'
  | 'personal';

export type GoalStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface UserProfile {
  id: string;
  userId: string;
  mainDream: string | null;
  currentLifeFocus: string | null;
  biggestDistractions: string[];
  dailyFocusMinutes: number;
  preferredReminderTone: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitCompletion {
  id: string;
  userId: string;
  habitId: string;
  completedAt: string;
  note: string | null;
}

export interface Goal {
  id: string;
  userId: string;
  relationshipId: string | null;
  title: string;
  description: string | null;
  category: GoalCategory | string;
  priority: number;
  whyItMatters: string | null;
  status: GoalStatus | string;
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
  habits?: Habit[];
  relationship?: Relationship | null;
}

export interface Habit {
  id: string;
  userId: string;
  goalId: string | null;
  title: string;
  frequency: string;
  reminderTime: string | null;
  currentStreak: number;
  createdAt: string;
  updatedAt: string;
  goal?: Goal | null;
  completions?: HabitCompletion[];
}

export interface FocusSession {
  id: string;
  userId: string;
  goalId: string | null;
  habitId: string | null;
  title: string;
  durationMinutes: number;
  energyLevel: string | null;
  distractionFree: boolean;
  note: string | null;
  startedAt: string;
  createdAt: string;
  goal?: Goal | null;
  habit?: Habit | null;
}

export interface FocusSessionSummary {
  totalSessions: number;
  totalMinutes: number;
  totalHours: number;
  distractionFreeSessions: number;
  latestSessionTitle: string | null;
}

export interface DistractionLog {
  id: string;
  userId: string;
  platform: string;
  minutesLost: number;
  triggerReason: string | null;
  moodBefore: string | null;
  moodAfter: string | null;
  replacementAction: string | null;
  createdAt: string;
}

export interface DistractionSummary {
  totalLogs: number;
  totalMinutesLost: number;
  topPlatform: string | null;
  platformTotals: Record<string, number>;
  latestReplacementAction: string | null;
}

export type RelationshipStatus = 'active' | 'paused' | 'ended';

export interface RelationshipPartner {
  id: string;
  email: string;
  name: string | null;
}

export interface RelationshipCheckIn {
  id: string;
  relationshipId: string;
  userId: string;
  mood: string;
  appreciation: string | null;
  concern: string | null;
  commitment: string | null;
  createdAt: string;
}

export interface Relationship {
  id: string;
  ownerId: string;
  partnerId: string | null;
  partnerName: string | null;
  status: RelationshipStatus | string;
  createdAt: string;
  updatedAt: string;
  partner?: RelationshipPartner | null;
  checkIns?: RelationshipCheckIn[];
}

export interface AiPlanGoal {
  title: string;
  category: string;
  priority: number;
  whyItMatters: string;
}

export interface AiPlanHabit {
  title: string;
  frequency: string;
  reminderTime: string;
}

export interface AiPlanDistractionStrategy {
  trigger: string;
  replacementAction: string;
  environmentRule: string;
}

export interface AiPlanWeeklyItem {
  day: string;
  focus: string;
  action: string;
}

export interface AiPlan {
  id: string;
  userId: string;
  dream: string;
  currentSituation: string | null;
  mainObstacle: string | null;
  suggestedGoals: AiPlanGoal[];
  suggestedHabits: AiPlanHabit[];
  distractionStrategy: AiPlanDistractionStrategy;
  weeklyPlan: AiPlanWeeklyItem[];
  mentorStory: string;
  createdAt: string;
}

export interface AiPlanActivationResult {
  aiPlanId: string;
  createdGoals: Goal[];
  createdHabits: Habit[];
  createdReminders: Reminder[];
}

export interface AnalyticsSummary {
  focusScore: number;
  activeGoals: number;
  totalGoals: number;
  totalHabits: number;
  habitCompletions: number;
  totalStreak: number;
  distractionMinutesLost: number;
  topDistractionPlatform: string | null;
  accountabilityCheckIns: number;
  aiPlansGenerated: number;
  focusSessionMinutes: number;
  distractionFreeFocusSessions: number;
  dailyReflections: number;
  averageReflectionScore: number;
}

export interface DailyPlanDistractionShield {
  platform: string | null;
  minutesLost: number;
  replacementAction: string;
}

export interface DailyPlanPartnerNudge {
  partnerName: string | null;
  message: string;
}

export interface DailyPlan {
  date: string;
  headline: string;
  focusMinutes: number;
  focusMinutesDone: number;
  latestReflection: DailyReflection | null;
  primaryGoal: Goal | null;
  nextHabits: Habit[];
  dueReminders: Reminder[];
  distractionShield: DailyPlanDistractionShield;
  partnerNudge: DailyPlanPartnerNudge;
  actionSteps: string[];
}

export interface DailyReflection {
  id: string;
  userId: string;
  mood: string;
  wins: string | null;
  blockers: string | null;
  distractions: string | null;
  tomorrowCommitment: string | null;
  focusScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyReflectionSummary {
  totalReflections: number;
  averageFocusScore: number;
  latestMood: string | null;
  latestCommitment: string | null;
}

export type ReminderType = 'habit' | 'goal' | 'accountability' | 'distraction_replacement';

export type ReminderStatus = 'pending' | 'completed' | 'skipped';

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  type: ReminderType | string;
  scheduledAt: string;
  note: string | null;
  status: ReminderStatus | string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
