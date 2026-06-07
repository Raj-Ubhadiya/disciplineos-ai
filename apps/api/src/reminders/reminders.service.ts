import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth';
import { PrismaService } from '../prisma.service';
import type { CreateReminderDto, UpdateReminderDto } from './dto';

@Injectable()
export class RemindersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  create(user: AuthenticatedUser, createReminderDto: CreateReminderDto) {
    return this.prisma.reminder.create({
      data: {
        userId: user.id,
        title: createReminderDto.title,
        type: createReminderDto.type,
        scheduledAt: new Date(createReminderDto.scheduledAt),
        ...(createReminderDto.note ? { note: createReminderDto.note } : {}),
      },
    });
  }

  findAll(user: AuthenticatedUser) {
    return this.prisma.reminder.findMany({
      where: { userId: user.id },
      orderBy: [{ status: 'asc' }, { scheduledAt: 'asc' }],
      take: 50,
    });
  }

  findUpcoming(user: AuthenticatedUser) {
    const now = new Date();
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);

    return this.prisma.reminder.findMany({
      where: {
        userId: user.id,
        status: 'pending',
        scheduledAt: {
          gte: now,
          lte: sevenDaysFromNow,
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 10,
    });
  }

  async update(user: AuthenticatedUser, id: string, updateReminderDto: UpdateReminderDto) {
    await this.ensureReminderBelongsToUser(user, id);
    const { scheduledAt, status, ...reminderData } = updateReminderDto;

    return this.prisma.reminder.update({
      where: { id },
      data: {
        ...reminderData,
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
        ...(status
          ? {
              status,
              completedAt: status === 'completed' ? new Date() : null,
            }
          : {}),
      },
    });
  }

  async complete(user: AuthenticatedUser, id: string) {
    await this.ensureReminderBelongsToUser(user, id);

    return this.prisma.reminder.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
  }

  async remove(user: AuthenticatedUser, id: string) {
    await this.ensureReminderBelongsToUser(user, id);

    return this.prisma.reminder.delete({
      where: { id },
    });
  }

  private async ensureReminderBelongsToUser(user: AuthenticatedUser, id: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }
  }
}
