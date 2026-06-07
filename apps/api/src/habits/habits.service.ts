import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth';
import { PrismaService } from '../prisma.service';
import type { CompleteHabitDto, CreateHabitDto, UpdateHabitDto } from './dto';

@Injectable()
export class HabitsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, createHabitDto: CreateHabitDto) {
    await this.ensureGoalBelongsToUserWhenProvided(user, createHabitDto.goalId);

    return this.prisma.habit.create({
      data: {
        userId: user.id,
        title: createHabitDto.title,
        frequency: createHabitDto.frequency ?? 'daily',
        ...(createHabitDto.goalId ? { goalId: createHabitDto.goalId } : {}),
        ...(createHabitDto.reminderTime ? { reminderTime: createHabitDto.reminderTime } : {}),
      },
      include: {
        goal: true,
        completions: {
          orderBy: { completedAt: 'desc' },
          take: 7,
        },
      },
    });
  }

  findAll(user: AuthenticatedUser) {
    return this.prisma.habit.findMany({
      where: { userId: user.id },
      orderBy: [{ currentStreak: 'desc' }, { createdAt: 'desc' }],
      include: {
        goal: true,
        completions: {
          orderBy: { completedAt: 'desc' },
          take: 7,
        },
      },
    });
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        goal: true,
        completions: {
          orderBy: { completedAt: 'desc' },
          take: 14,
        },
      },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return habit;
  }

  async update(user: AuthenticatedUser, id: string, updateHabitDto: UpdateHabitDto) {
    await this.ensureHabitBelongsToUser(user, id);
    await this.ensureGoalBelongsToUserWhenProvided(user, updateHabitDto.goalId);

    return this.prisma.habit.update({
      where: { id },
      data: updateHabitDto,
      include: {
        goal: true,
        completions: {
          orderBy: { completedAt: 'desc' },
          take: 7,
        },
      },
    });
  }

  async complete(user: AuthenticatedUser, id: string, completeHabitDto: CompleteHabitDto) {
    await this.ensureHabitBelongsToUser(user, id);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const existingCompletion = await this.prisma.habitCompletion.findFirst({
      where: {
        habitId: id,
        userId: user.id,
        completedAt: {
          gte: todayStart,
        },
      },
    });

    if (existingCompletion) {
      throw new BadRequestException('Habit already completed today');
    }

    return this.prisma.$transaction(async (tx) => {
      const completion = await tx.habitCompletion.create({
        data: {
          habitId: id,
          userId: user.id,
          ...(completeHabitDto.note ? { note: completeHabitDto.note } : {}),
        },
      });

      await tx.habit.update({
        where: { id },
        data: {
          currentStreak: {
            increment: 1,
          },
        },
      });

      return completion;
    });
  }

  async remove(user: AuthenticatedUser, id: string) {
    await this.ensureHabitBelongsToUser(user, id);

    return this.prisma.habit.delete({
      where: { id },
    });
  }

  private async ensureHabitBelongsToUser(user: AuthenticatedUser, id: string) {
    const habit = await this.prisma.habit.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }
  }

  private async ensureGoalBelongsToUserWhenProvided(user: AuthenticatedUser, goalId?: string | null) {
    if (!goalId) {
      return;
    }

    const goal = await this.prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
  }
}
