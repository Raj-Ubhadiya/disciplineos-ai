import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth';
import { PrismaService } from '../prisma.service';
import type { CreateGoalDto, UpdateGoalDto } from './dto';

@Injectable()
export class GoalsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, createGoalDto: CreateGoalDto) {
    await this.ensureRelationshipBelongsToUserWhenProvided(user, createGoalDto.relationshipId);

    return this.prisma.goal.create({
      data: {
        userId: user.id,
        title: createGoalDto.title,
        category: createGoalDto.category,
        priority: createGoalDto.priority ?? 3,
        ...(createGoalDto.relationshipId ? { relationshipId: createGoalDto.relationshipId } : {}),
        ...(createGoalDto.description ? { description: createGoalDto.description } : {}),
        ...(createGoalDto.whyItMatters ? { whyItMatters: createGoalDto.whyItMatters } : {}),
        ...(createGoalDto.targetDate ? { targetDate: new Date(createGoalDto.targetDate) } : {}),
      },
      include: {
        habits: true,
        relationship: {
          include: {
            partner: true,
          },
        },
      },
    });
  }

  findAll(user: AuthenticatedUser) {
    return this.prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        habits: true,
        relationship: {
          include: {
            partner: true,
          },
        },
      },
    });
  }

  findShared(user: AuthenticatedUser) {
    return this.prisma.goal.findMany({
      where: {
        userId: user.id,
        relationshipId: {
          not: null,
        },
      },
      orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        habits: true,
        relationship: {
          include: {
            partner: true,
            checkIns: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        habits: {
          orderBy: { createdAt: 'desc' },
        },
        relationship: {
          include: {
            partner: true,
          },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    return goal;
  }

  async update(user: AuthenticatedUser, id: string, updateGoalDto: UpdateGoalDto) {
    await this.ensureGoalBelongsToUser(user, id);
    await this.ensureRelationshipBelongsToUserWhenProvided(user, updateGoalDto.relationshipId);

    const { targetDate, relationshipId, ...goalData } = updateGoalDto;

    return this.prisma.goal.update({
      where: { id },
      data: {
        ...goalData,
        ...(relationshipId !== undefined ? { relationshipId } : {}),
        ...(targetDate ? { targetDate: new Date(targetDate) } : {}),
      },
      include: {
        habits: true,
        relationship: {
          include: {
            partner: true,
          },
        },
      },
    });
  }

  async remove(user: AuthenticatedUser, id: string) {
    await this.ensureGoalBelongsToUser(user, id);

    return this.prisma.goal.delete({
      where: { id },
    });
  }

  private async ensureGoalBelongsToUser(user: AuthenticatedUser, id: string) {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }
  }

  private async ensureRelationshipBelongsToUserWhenProvided(
    user: AuthenticatedUser,
    relationshipId?: string,
  ) {
    if (!relationshipId) {
      return;
    }

    const relationship = await this.prisma.relationship.findFirst({
      where: {
        id: relationshipId,
        OR: [{ ownerId: user.id }, { partnerId: user.id }],
      },
      select: { id: true },
    });

    if (!relationship) {
      throw new NotFoundException('Accountability partner not found');
    }
  }
}
