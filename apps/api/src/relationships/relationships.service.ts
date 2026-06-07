import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth';
import { PrismaService } from '../prisma.service';
import type {
  CreateRelationshipCheckInDto,
  CreateRelationshipDto,
  UpdateRelationshipDto,
} from './dto';

@Injectable()
export class RelationshipsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, createRelationshipDto: CreateRelationshipDto) {
    const partner = await this.findPartnerWhenProvided(user, createRelationshipDto.partnerEmail);

    return this.prisma.relationship.create({
      data: {
        ownerId: user.id,
        ...(partner ? { partnerId: partner.id } : {}),
        ...(createRelationshipDto.partnerName
          ? { partnerName: createRelationshipDto.partnerName }
          : {}),
      },
      include: this.relationshipInclude,
    });
  }

  findAll(user: AuthenticatedUser) {
    return this.prisma.relationship.findMany({
      where: {
        OR: [{ ownerId: user.id }, { partnerId: user.id }],
      },
      orderBy: { updatedAt: 'desc' },
      include: this.relationshipInclude,
    });
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const relationship = await this.findRelationshipForUser(user, id);

    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    return relationship;
  }

  async update(user: AuthenticatedUser, id: string, updateRelationshipDto: UpdateRelationshipDto) {
    await this.ensureRelationshipOwner(user, id);

    return this.prisma.relationship.update({
      where: { id },
      data: updateRelationshipDto,
      include: this.relationshipInclude,
    });
  }

  async createCheckIn(
    user: AuthenticatedUser,
    id: string,
    createRelationshipCheckInDto: CreateRelationshipCheckInDto,
  ) {
    await this.ensureRelationshipParticipant(user, id);

    return this.prisma.relationshipCheckIn.create({
      data: {
        relationshipId: id,
        userId: user.id,
        mood: createRelationshipCheckInDto.mood,
        ...(createRelationshipCheckInDto.appreciation
          ? { appreciation: createRelationshipCheckInDto.appreciation }
          : {}),
        ...(createRelationshipCheckInDto.concern
          ? { concern: createRelationshipCheckInDto.concern }
          : {}),
        ...(createRelationshipCheckInDto.commitment
          ? { commitment: createRelationshipCheckInDto.commitment }
          : {}),
      },
    });
  }

  async remove(user: AuthenticatedUser, id: string) {
    await this.ensureRelationshipOwner(user, id);

    return this.prisma.relationship.delete({
      where: { id },
    });
  }

  private readonly relationshipInclude = {
    partner: {
      select: {
        id: true,
        email: true,
        name: true,
      },
    },
    checkIns: {
      orderBy: { createdAt: 'desc' },
      take: 5,
    },
  } as const;

  private async findPartnerWhenProvided(user: AuthenticatedUser, partnerEmail?: string) {
    if (!partnerEmail) {
      return null;
    }

    const partner = await this.prisma.user.findUnique({
      where: { email: partnerEmail },
      select: { id: true },
    });

    if (!partner) {
      return null;
    }

    if (partner.id === user.id) {
      throw new BadRequestException('You cannot add yourself as an accountability partner');
    }

    return partner;
  }

  private findRelationshipForUser(user: AuthenticatedUser, id: string) {
    return this.prisma.relationship.findFirst({
      where: {
        id,
        OR: [{ ownerId: user.id }, { partnerId: user.id }],
      },
      include: this.relationshipInclude,
    });
  }

  private async ensureRelationshipOwner(user: AuthenticatedUser, id: string) {
    const relationship = await this.prisma.relationship.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
      select: { id: true },
    });

    if (!relationship) {
      throw new NotFoundException('Accountability partner not found');
    }
  }

  private async ensureRelationshipParticipant(user: AuthenticatedUser, id: string) {
    const relationship = await this.prisma.relationship.findFirst({
      where: {
        id,
        OR: [{ ownerId: user.id }, { partnerId: user.id }],
      },
      select: { id: true },
    });

    if (!relationship) {
      throw new NotFoundException('Accountability partner not found');
    }
  }
}
