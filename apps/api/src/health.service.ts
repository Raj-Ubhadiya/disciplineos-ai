import type { ApiHealthResponse } from '@disciplineos/types';
import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Injectable()
export class HealthService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getHealth(): Promise<ApiHealthResponse> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        service: 'api',
        environment: (process.env.NODE_ENV as ApiHealthResponse['environment']) ?? 'development',
        database: 'up',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'degraded',
        service: 'api',
        environment: (process.env.NODE_ENV as ApiHealthResponse['environment']) ?? 'development',
        database: 'down',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
