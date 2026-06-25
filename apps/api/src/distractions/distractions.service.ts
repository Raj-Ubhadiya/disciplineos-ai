import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth';
import { PrismaService } from '../prisma.service';
import type { CreateDistractionLogDto, UpdateDistractionLogDto } from './dto';

type DistractionLogRecord = {
  platform: string;
  minutesLost: number;
  replacementAction: string | null;
};

@Injectable()
export class DistractionsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  create(user: AuthenticatedUser, createDistractionLogDto: CreateDistractionLogDto) {
    return this.prisma.distractionLog.create({
      data: {
        userId: user.id,
        platform: createDistractionLogDto.platform,
        minutesLost: createDistractionLogDto.minutesLost,
        ...(createDistractionLogDto.triggerReason
          ? { triggerReason: createDistractionLogDto.triggerReason }
          : {}),
        ...(createDistractionLogDto.moodBefore
          ? { moodBefore: createDistractionLogDto.moodBefore }
          : {}),
        ...(createDistractionLogDto.moodAfter
          ? { moodAfter: createDistractionLogDto.moodAfter }
          : {}),
        ...(createDistractionLogDto.replacementAction
          ? { replacementAction: createDistractionLogDto.replacementAction }
          : {}),
      },
    });
  }

  findAll(user: AuthenticatedUser) {
    return this.prisma.distractionLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async getSummary(user: AuthenticatedUser) {
    const logs = await this.prisma.distractionLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }) as DistractionLogRecord[];

    const totalMinutesLost = logs.reduce(
      (total: number, log: DistractionLogRecord) => total + log.minutesLost,
      0,
    );
    const platformTotals = logs.reduce(
      (totals: Record<string, number>, log: DistractionLogRecord) => {
        totals[log.platform] = (totals[log.platform] ?? 0) + log.minutesLost;
        return totals;
      },
      {} as Record<string, number>,
    );
    const topPlatform = Object.entries(platformTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      totalLogs: logs.length,
      totalMinutesLost,
      topPlatform,
      platformTotals,
      latestReplacementAction:
        logs.find((log: DistractionLogRecord) => log.replacementAction)?.replacementAction ?? null,
    };
  }

  async update(
    user: AuthenticatedUser,
    id: string,
    updateDistractionLogDto: UpdateDistractionLogDto,
  ) {
    await this.ensureLogBelongsToUser(user, id);

    return this.prisma.distractionLog.update({
      where: { id },
      data: updateDistractionLogDto,
    });
  }

  async remove(user: AuthenticatedUser, id: string) {
    await this.ensureLogBelongsToUser(user, id);

    return this.prisma.distractionLog.delete({
      where: { id },
    });
  }

  private async ensureLogBelongsToUser(user: AuthenticatedUser, id: string) {
    const log = await this.prisma.distractionLog.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!log) {
      throw new NotFoundException('Distraction log not found');
    }
  }
}
