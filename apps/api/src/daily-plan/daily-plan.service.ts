import { Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth';
import { PrismaService } from '../prisma.service';

type UserProfileRecord = {
  mainDream: string | null;
  dailyFocusMinutes: number | null;
};

type HabitRecord = {
  id: string;
  title: string;
  currentStreak: number;
  createdAt: Date;
};

type HabitCompletionRecord = { habitId: string };
type ReminderRecord = { title: string };
type FocusSessionRecord = { durationMinutes: number };
type DailyReflectionRecord = { tomorrowCommitment: string | null };
type DistractionLogRecord = {
  platform: string;
  minutesLost: number;
  replacementAction: string | null;
};
type RelationshipRecord = {
  partnerName: string | null;
  partner: { name: string | null; email: string } | null;
  checkIns: { commitment: string | null; appreciation: string | null }[];
};

@Injectable()
export class DailyPlanService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getToday(user: AuthenticatedUser) {
    type ActiveGoal = {
      id: string;
      title: string;
      priority: number;
      createdAt: Date;
      relationship: {
        partner: {
          name: string | null;
          email: string;
        } | null;
      } | null;
    };

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(startOfToday.getDate() + 1);

    const [
      profile,
      activeGoals,
      habits,
      todaysCompletions,
      todaysReminders,
      todaysFocusSessions,
      latestReflection,
      recentDistractions,
      relationships,
    ] = await Promise.all([
      this.prisma.userProfile.findUnique({
        where: { userId: user.id },
      }),
      this.prisma.goal.findMany({
        where: { userId: user.id, status: 'active' },
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        take: 3,
        include: {
          relationship: {
            include: {
              partner: true,
            },
          },
        },
      }),
      this.prisma.habit.findMany({
        where: { userId: user.id },
        orderBy: [{ currentStreak: 'desc' }, { createdAt: 'desc' }],
        take: 5,
      }),
      this.prisma.habitCompletion.findMany({
        where: {
          userId: user.id,
          completedAt: {
            gte: startOfToday,
            lt: endOfToday,
          },
        },
        select: { habitId: true },
      }),
      this.prisma.reminder.findMany({
        where: {
          userId: user.id,
          status: 'pending',
          scheduledAt: {
            gte: startOfToday,
            lt: endOfToday,
          },
        },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
      }),
      this.prisma.focusSession.findMany({
        where: {
          userId: user.id,
          startedAt: {
            gte: startOfToday,
            lt: endOfToday,
          },
        },
        orderBy: { startedAt: 'desc' },
        take: 5,
      }),
      this.prisma.dailyReflection.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.distractionLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.relationship.findMany({
        where: {
          OR: [{ ownerId: user.id }, { partnerId: user.id }],
          status: 'active',
        },
        include: {
          partner: true,
          checkIns: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        take: 3,
      }),
    ]) as [
      UserProfileRecord | null,
      ActiveGoal[],
      HabitRecord[],
      HabitCompletionRecord[],
      ReminderRecord[],
      FocusSessionRecord[],
      DailyReflectionRecord | null,
      DistractionLogRecord[],
      RelationshipRecord[],
    ];

    const completedHabitIds = new Set(
      todaysCompletions.map((completion: HabitCompletionRecord) => completion.habitId),
    );
    const incompleteHabits = habits.filter((habit: HabitRecord) => !completedHabitIds.has(habit.id));
    const topDistraction = this.getTopDistraction(recentDistractions);
    const primaryGoal = activeGoals[0] ?? null;
    const focusMinutesDone = todaysFocusSessions.reduce(
      (total: number, session: FocusSessionRecord) => total + session.durationMinutes,
      0,
    );

    return {
      date: startOfToday.toISOString(),
      headline: this.buildHeadline(profile?.mainDream, primaryGoal?.title),
      focusMinutes: profile?.dailyFocusMinutes ?? 60,
      focusMinutesDone,
      latestReflection,
      primaryGoal,
      nextHabits: incompleteHabits.slice(0, 3),
      dueReminders: todaysReminders,
      distractionShield: {
        platform: topDistraction?.platform ?? null,
        minutesLost: topDistraction?.minutesLost ?? 0,
        replacementAction:
          recentDistractions.find((log: DistractionLogRecord) => Boolean(log.replacementAction))
            ?.replacementAction ??
          this.getDefaultReplacementAction(topDistraction?.platform),
      },
      partnerNudge: this.buildPartnerNudge(relationships),
      actionSteps: this.buildActionSteps({
        primaryGoalTitle: primaryGoal?.title,
        nextHabitTitle: incompleteHabits[0]?.title,
        reminderTitle: todaysReminders[0]?.title,
        topPlatform: topDistraction?.platform,
        partnerName: relationships[0] ? this.getPartnerName(relationships[0]) : null,
        focusMinutesDone,
        reflectionCommitment: latestReflection?.tomorrowCommitment,
      }),
    };
  }

  private getTopDistraction(logs: { platform: string; minutesLost: number }[]) {
    const totals = logs.reduce<Record<string, number>>((result, log) => {
      result[log.platform] = (result[log.platform] ?? 0) + log.minutesLost;
      return result;
    }, {});
    const [platform, minutesLost] =
      Object.entries(totals).sort((a, b) => b[1] - a[1])[0] ?? [];

    if (!platform || !minutesLost) {
      return null;
    }

    return { platform, minutesLost };
  }

  private buildHeadline(mainDream?: string | null, primaryGoalTitle?: string) {
    if (primaryGoalTitle) {
      return `Today, protect attention for: ${primaryGoalTitle}`;
    }

    if (mainDream) {
      return `Today, move one step toward: ${mainDream}`;
    }

    return 'Today, protect your attention and complete one visible action.';
  }

  private getDefaultReplacementAction(platform?: string) {
    if (!platform) {
      return 'Before opening social media, do one 10-minute focus sprint.';
    }

    return `When you feel pulled toward ${platform}, stand up, breathe, and do one tiny task first.`;
  }

  private buildPartnerNudge(
    relationships: Array<{
      partnerName: string | null;
      partner: { name: string | null; email: string } | null;
      checkIns: { commitment: string | null; appreciation: string | null }[];
    }>,
  ) {
    const relationship = relationships[0];

    if (!relationship) {
      return {
        partnerName: null,
        message: 'Add an accountability partner when you want extra discipline pressure.',
      };
    }

    return {
      partnerName: this.getPartnerName(relationship),
      message:
        relationship.checkIns[0]?.commitment ??
        relationship.checkIns[0]?.appreciation ??
        'Send one honest progress update to your accountability partner today.',
    };
  }

  private buildActionSteps(input: {
    primaryGoalTitle: string | undefined;
    nextHabitTitle: string | undefined;
    reminderTitle: string | undefined;
    topPlatform: string | undefined;
    partnerName?: string | null;
    focusMinutesDone: number;
    reflectionCommitment: string | null | undefined;
  }) {
    return [
      input.focusMinutesDone > 0
        ? `You already logged ${input.focusMinutesDone} focused minutes today. Add one smaller second block.`
        : input.primaryGoalTitle
        ? `Work on "${input.primaryGoalTitle}" for one focused block.`
        : 'Create or choose one active goal for today.',
      input.nextHabitTitle
        ? `Complete habit: ${input.nextHabitTitle}.`
        : 'Create one small daily habit that supports your dream.',
      input.reminderTitle
        ? `Handle reminder: ${input.reminderTitle}.`
        : 'Schedule one reminder before the day gets noisy.',
      input.topPlatform
        ? `Use your replacement action before opening ${input.topPlatform}.`
        : 'Keep social media closed until your first focus block is finished.',
      input.partnerName
        ? `Send ${input.partnerName} a short accountability update.`
        : 'If discipline feels hard alone, add one accountability partner.',
      input.reflectionCommitment
        ? `Respect yesterday's commitment: ${input.reflectionCommitment}.`
        : 'End the day with one honest reflection.',
    ];
  }

  private getPartnerName(relationship: {
    partnerName: string | null;
    partner: { name: string | null; email: string } | null;
  }) {
    return (
      relationship.partner?.name ??
      relationship.partner?.email ??
      relationship.partnerName ??
      'your partner'
    );
  }
}
