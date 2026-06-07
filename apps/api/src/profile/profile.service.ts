import { Inject, Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../auth';
import { PrismaService } from '../prisma.service';
import type { UpdateProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getProfile(user: AuthenticatedUser) {
    return this.prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });
  }

  async updateProfile(user: AuthenticatedUser, updateProfileDto: UpdateProfileDto) {
    return this.prisma.userProfile.upsert({
      where: { userId: user.id },
      update: updateProfileDto,
      create: {
        userId: user.id,
        ...updateProfileDto,
      },
    });
  }
}
