import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AiPlannerModule } from './ai-planner';
import { AnalyticsModule } from './analytics';
import { AuthModule } from './auth';
import { configuration } from './configuration';
import { DailyPlanModule } from './daily-plan';
import { DistractionsModule } from './distractions';
import { FocusSessionsModule } from './focus-sessions';
import { GoalsModule } from './goals';
import { HabitsModule } from './habits';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaModule } from './prisma.module';
import { ProfileModule } from './profile/profile.module';
import { ReflectionsModule } from './reflections';
import { RelationshipsModule } from './relationships';
import { RemindersModule } from './reminders';
import { RootController } from './root.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    ProfileModule,
    FocusSessionsModule,
    GoalsModule,
    HabitsModule,
    DistractionsModule,
    RelationshipsModule,
    AiPlannerModule,
    AnalyticsModule,
    RemindersModule,
    DailyPlanModule,
    ReflectionsModule,
  ],
  controllers: [HealthController, RootController],
  providers: [HealthService],
})
export class AppModule {}
