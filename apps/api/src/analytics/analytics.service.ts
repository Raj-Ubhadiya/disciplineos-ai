import { Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getSummary(user: AuthenticatedUser) {
    const [
      activeGoals,
      totalGoals,
      habits,
      habitCompletions,
      distractionLogs,
      accountabilityCheckIns,
      aiPlansGenerated,
      focusSessions,
      dailyReflections,
    ] = await Promise.all([
      this.prisma.goal.count({ where: { userId: user.id, status: 'active' } }),
      this.prisma.goal.count({ where: { userId: user.id } }),
      this.prisma.habit.findMany({
        where: { userId: user.id },
        select: { currentStreak: true },
      }),
      this.prisma.habitCompletion.count({ where: { userId: user.id } }),
      this.prisma.distractionLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      this.prisma.relationshipCheckIn.count({ where: { userId: user.id } }),
      this.prisma.aiPlan.count({ where: { userId: user.id } }),
      this.prisma.focusSession.findMany({
        where: { userId: user.id },
        orderBy: { startedAt: 'desc' },
        take: 30,
      }),
      this.prisma.dailyReflection.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 14,
      }),
    ]);

    const totalHabits = habits.length;
    const totalStreak = habits.reduce((total, habit) => total + habit.currentStreak, 0);
    const distractionMinutesLost = distractionLogs.reduce(
      (total, log) => total + log.minutesLost,
      0,
    );
    const focusSessionMinutes = focusSessions.reduce(
      (total, session) => total + session.durationMinutes,
      0,
    );
    const distractionFreeFocusSessions = focusSessions.filter(
      (session) => session.distractionFree,
    ).length;
    const averageReflectionScore =
      dailyReflections.length > 0
        ? Math.round(
            dailyReflections.reduce((total, reflection) => total + reflection.focusScore, 0) /
              dailyReflections.length,
          )
        : 0;
    const platformTotals = distractionLogs.reduce<Record<string, number>>((totals, log) => {
      totals[log.platform] = (totals[log.platform] ?? 0) + log.minutesLost;
      return totals;
    }, {});
    const topDistractionPlatform =
      Object.entries(platformTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      focusScore: this.calculateFocusScore({
        activeGoals,
        totalHabits,
        habitCompletions,
        totalStreak,
        distractionMinutesLost,
        accountabilityCheckIns,
        aiPlansGenerated,
        focusSessionMinutes,
        distractionFreeFocusSessions,
        dailyReflections: dailyReflections.length,
        averageReflectionScore,
      }),
      activeGoals,
      totalGoals,
      totalHabits,
      habitCompletions,
      totalStreak,
      distractionMinutesLost,
      topDistractionPlatform,
      accountabilityCheckIns,
      aiPlansGenerated,
      focusSessionMinutes,
      distractionFreeFocusSessions,
      dailyReflections: dailyReflections.length,
      averageReflectionScore,
    };
  }

  private calculateFocusScore(metrics: {
    activeGoals: number;
    totalHabits: number;
    habitCompletions: number;
    totalStreak: number;
    distractionMinutesLost: number;
    accountabilityCheckIns: number;
    aiPlansGenerated: number;
    focusSessionMinutes: number;
    distractionFreeFocusSessions: number;
    dailyReflections: number;
    averageReflectionScore: number;
  }) {
    const positiveScore =
      metrics.activeGoals * 8 +
      metrics.totalHabits * 7 +
      metrics.habitCompletions * 4 +
      metrics.totalStreak * 3 +
      metrics.accountabilityCheckIns * 4 +
      metrics.aiPlansGenerated * 5 +
      Math.floor(metrics.focusSessionMinutes / 30) * 5 +
      metrics.distractionFreeFocusSessions * 3 +
      metrics.dailyReflections * 3 +
      Math.floor(metrics.averageReflectionScore / 20) * 2;
    const distractionPenalty = Math.min(40, Math.floor(metrics.distractionMinutesLost / 15));
    const score = 35 + positiveScore - distractionPenalty;

    return Math.max(0, Math.min(100, score));
  }
}
