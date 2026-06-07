import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth';
import { GetUser, JwtAuthGuard } from '../auth';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller({
  path: 'analytics',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class AnalyticsController {
  constructor(@Inject(AnalyticsService) private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get discipline analytics and focus score' })
  getSummary(@GetUser() user: AuthenticatedUser) {
    return this.analyticsService.getSummary(user);
  }
}
