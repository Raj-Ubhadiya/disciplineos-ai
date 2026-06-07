import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma.module';
import { DailyPlanController } from './daily-plan.controller';
import { DailyPlanService } from './daily-plan.service';

@Module({
  imports: [PrismaModule],
  controllers: [DailyPlanController],
  providers: [DailyPlanService],
})
export class DailyPlanModule {}
