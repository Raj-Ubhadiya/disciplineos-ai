import { Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth';
import { PrismaService } from '../prisma.service';
import type { CreateDailyReflectionDto } from './dto';

type DailyReflectionRecord = {
  focusScore: number;
  mood: string;
  tomorrowCommitment: string | null;
};

@Injectable()
export class ReflectionsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  create(user: AuthenticatedUser, createDailyReflectionDto: CreateDailyReflectionDto) {
    return this.prisma.dailyReflection.create({
      data: {
        userId: user.id,
        mood: createDailyReflectionDto.mood,
        focusScore: createDailyReflectionDto.focusScore,
        ...(createDailyReflectionDto.wins ? { wins: createDailyReflectionDto.wins } : {}),
        ...(createDailyReflectionDto.blockers
          ? { blockers: createDailyReflectionDto.blockers }
          : {}),
        ...(createDailyReflectionDto.distractions
          ? { distractions: createDailyReflectionDto.distractions }
          : {}),
        ...(createDailyReflectionDto.tomorrowCommitment
          ? { tomorrowCommitment: createDailyReflectionDto.tomorrowCommitment }
          : {}),
      },
    });
  }

  findRecent(user: AuthenticatedUser) {
    return this.prisma.dailyReflection.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 14,
    });
  }

  async getSummary(user: AuthenticatedUser) {
    const reflections = await this.prisma.dailyReflection.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 14,
    }) as DailyReflectionRecord[];

    const averageFocusScore =
      reflections.length > 0
        ? Math.round(
            reflections.reduce(
              (total: number, reflection: DailyReflectionRecord) => total + reflection.focusScore,
              0,
            ) / reflections.length,
          )
        : 0;

    return {
      totalReflections: reflections.length,
      averageFocusScore,
      latestMood: reflections[0]?.mood ?? null,
      latestCommitment: reflections[0]?.tomorrowCommitment ?? null,
    };
  }
}
