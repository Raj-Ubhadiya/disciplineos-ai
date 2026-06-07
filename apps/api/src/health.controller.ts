import type { ApiHealthResponse } from '@disciplineos/types';
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';

@ApiTags('health')
@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  constructor(@Inject(HealthService) private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({ description: 'Health check response.' })
  async getHealth(): Promise<ApiHealthResponse> {
    return this.healthService.getHealth();
  }
}
