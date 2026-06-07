import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma.module';
import { DistractionsController } from './distractions.controller';
import { DistractionsService } from './distractions.service';

@Module({
  imports: [PrismaModule],
  controllers: [DistractionsController],
  providers: [DistractionsService],
})
export class DistractionsModule {}
