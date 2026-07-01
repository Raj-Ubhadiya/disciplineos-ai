import { Controller, Get, Inject, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HealthService } from './health.service';

@Controller()
export class RootController {
  constructor(
    @Inject(HealthService) private readonly healthService: HealthService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  @Get()
  @Version(VERSION_NEUTRAL)
  async getRoot() {
    const health = await this.healthService.getHealth();
    const swaggerEnabled = this.configService.get<boolean>('swaggerEnabled') ?? false;

    return {
      name: 'DisciplineOS AI API',
      status: health.status,
      environment: health.environment,
      timestamp: health.timestamp,
      routes: {
        health: '/api/v1/health',
        authOtpRequest: '/api/v1/auth/otp/request',
        docs: swaggerEnabled ? '/api/docs' : null,
      },
    };
  }
}
