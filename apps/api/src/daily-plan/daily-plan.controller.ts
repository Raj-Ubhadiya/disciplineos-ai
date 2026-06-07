import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth';
import { GetUser, JwtAuthGuard } from '../auth';
import { DailyPlanService } from './daily-plan.service';

@ApiTags('daily-plan')
@Controller({
  path: 'daily-plan',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class DailyPlanController {
  constructor(@Inject(DailyPlanService) private readonly dailyPlanService: DailyPlanService) {}

  @Get('today')
  @ApiOperation({ summary: 'Get a focused action plan for today' })
  getToday(@GetUser() user: AuthenticatedUser) {
    return this.dailyPlanService.getToday(user);
  }
}
