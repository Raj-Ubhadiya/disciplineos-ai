import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma.module';
import { ReflectionsController } from './reflections.controller';
import { ReflectionsService } from './reflections.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReflectionsController],
  providers: [ReflectionsService],
})
export class ReflectionsModule {}
