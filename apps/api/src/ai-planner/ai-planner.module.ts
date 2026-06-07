import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma.module';
import { AiPlannerController } from './ai-planner.controller';
import { AiPlannerService } from './ai-planner.service';

@Module({
  imports: [PrismaModule],
  controllers: [AiPlannerController],
  providers: [AiPlannerService],
})
export class AiPlannerModule {}
