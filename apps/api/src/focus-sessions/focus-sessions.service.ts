import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import type { AuthenticatedUser } from '../auth';
import { PrismaService } from '../prisma.service';
import type { CreateFocusSessionDto } from './dto';

type FocusSessionRecord = {
  durationMinutes: number;
  distractionFree: boolean;
  title: string;
};

@Injectable()
export class FocusSessionsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, createFocusSessionDto: CreateFocusSessionDto) {
    await Promise.all([
      this.ensureGoalBelongsToUserWhenProvided(user, createFocusSessionDto.goalId),
      this.ensureHabitBelongsToUserWhenProvided(user, createFocusSessionDto.habitId),
    ]);

    return this.prisma.focusSession.create({
      data: {
        userId: user.id,
        title: createFocusSessionDto.title,
        durationMinutes: createFocusSessionDto.durationMinutes,
        distractionFree: createFocusSessionDto.distractionFree ?? false,
        ...(createFocusSessionDto.goalId ? { goalId: createFocusSessionDto.goalId } : {}),
        ...(createFocusSessionDto.habitId ? { habitId: createFocusSessionDto.habitId } : {}),
        ...(createFocusSessionDto.energyLevel
          ? { energyLevel: createFocusSessionDto.energyLevel }
          : {}),
        ...(createFocusSessionDto.note ? { note: createFocusSessionDto.note } : {}),
        ...(createFocusSessionDto.startedAt
          ? { startedAt: new Date(createFocusSessionDto.startedAt) }
          : {}),
      },
      include: {
        goal: true,
        habit: true,
      },
    });
  }

  findRecent(user: AuthenticatedUser) {
    return this.prisma.focusSession.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: 'desc' },
      take: 20,
      include: {
        goal: true,
        habit: true,
      },
    });
  }

  async getSummary(user: AuthenticatedUser) {
    const sessions = await this.prisma.focusSession.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: 'desc' },
      take: 30,
    }) as FocusSessionRecord[];

    const totalMinutes = sessions.reduce(
      (total: number, session: FocusSessionRecord) => total + session.durationMinutes,
      0,
    );
    const distractionFreeSessions = sessions.filter(
      (session: FocusSessionRecord) => session.distractionFree,
    ).length;

    return {
      totalSessions: sessions.length,
      totalMinutes,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      distractionFreeSessions,
      latestSessionTitle: sessions[0]?.title ?? null,
    };
  }

  private async ensureGoalBelongsToUserWhenProvided(user: AuthenticatedUser, goalId?: string) {
    if (!goalId) {
      return;
    }

    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId: user.id },
      select: { id: true },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
  }

  private async ensureHabitBelongsToUserWhenProvided(user: AuthenticatedUser, habitId?: string) {
    if (!habitId) {
      return;
    }

    const habit = await this.prisma.habit.findFirst({
      where: { id: habitId, userId: user.id },
      select: { id: true },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }
  }
}
