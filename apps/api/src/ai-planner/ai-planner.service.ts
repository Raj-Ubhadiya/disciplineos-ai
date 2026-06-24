import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { AuthenticatedUser } from '../auth';
import { PrismaService } from '../prisma.service';
import type { CreateAiPlanDto } from './dto';

type SuggestedGoal = {
  title: string;
  category: string;
  priority: number;
  whyItMatters: string;
};

type SuggestedHabit = {
  title: string;
  frequency: string;
  reminderTime: string;
};

type DistractionStrategy = {
  trigger: string;
  replacementAction: string;
  environmentRule: string;
};

type WeeklyPlanItem = {
  day: string;
  focus: string;
  action: string;
};

@Injectable()
export class AiPlannerService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, createAiPlanDto: CreateAiPlanDto) {
    const plan = this.generatePlan(createAiPlanDto);

    return this.prisma.aiPlan.create({
      data: {
        userId: user.id,
        dream: createAiPlanDto.dream,
        currentSituation: createAiPlanDto.currentSituation ?? null,
        mainObstacle: createAiPlanDto.mainObstacle ?? null,
        suggestedGoals: plan.suggestedGoals,
        suggestedHabits: plan.suggestedHabits,
        distractionStrategy: plan.distractionStrategy,
        weeklyPlan: plan.weeklyPlan,
        mentorStory: plan.mentorStory,
      },
    });
  }

  findAll(user: AuthenticatedUser) {
    return this.prisma.aiPlan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async activate(user: AuthenticatedUser, id: string) {
    const aiPlan = await this.prisma.aiPlan.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!aiPlan) {
      throw new NotFoundException('AI plan not found');
    }

    const suggestedGoals = aiPlan.suggestedGoals as SuggestedGoal[];
    const suggestedHabits = aiPlan.suggestedHabits as SuggestedHabit[];

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdGoals = await Promise.all(
        suggestedGoals.slice(0, 3).map((goal) =>
          tx.goal.create({
            data: {
              userId: user.id,
              title: goal.title,
              category: goal.category,
              priority: goal.priority,
              whyItMatters: goal.whyItMatters,
            },
          }),
        ),
      );

      const primaryGoal = createdGoals[0];
      const createdHabits = await Promise.all(
        suggestedHabits.slice(0, 3).map((habit) =>
          tx.habit.create({
            data: {
              userId: user.id,
              title: habit.title,
              frequency: habit.frequency,
              reminderTime: habit.reminderTime,
              ...(primaryGoal ? { goalId: primaryGoal.id } : {}),
            },
          }),
        ),
      );
      const createdReminders = await Promise.all(
        createdHabits.map((habit, index) =>
          tx.reminder.create({
            data: {
              userId: user.id,
              title: `Reminder: ${habit.title}`,
              type: 'habit',
              scheduledAt: this.getNextReminderDate(suggestedHabits[index]?.reminderTime),
              note: 'Auto-created from AI plan activation.',
            },
          }),
        ),
      );

      return {
        aiPlanId: aiPlan.id,
        createdGoals,
        createdHabits,
        createdReminders,
      };
    });
  }

  private getNextReminderDate(reminderTime?: string) {
    const reminderDate = new Date();
    const [hour = '7', minute = '30'] = (reminderTime || '07:30').split(':');
    reminderDate.setHours(Number(hour), Number(minute), 0, 0);

    if (reminderDate.getTime() <= Date.now()) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    return reminderDate;
  }

  private generatePlan(createAiPlanDto: CreateAiPlanDto) {
    const dream = createAiPlanDto.dream.trim();
    const obstacle = createAiPlanDto.mainObstacle?.trim() || 'lack of consistency';
    const roleModel = createAiPlanDto.roleModel?.trim() || 'high-performing people';

    const suggestedGoals: SuggestedGoal[] = [
      {
        title: `Build a 30-day execution system for ${dream}`,
        category: 'personal',
        priority: 5,
        whyItMatters: 'A dream becomes believable when it has a daily operating system.',
      },
      {
        title: `Remove the biggest blocker: ${obstacle}`,
        category: 'personal',
        priority: 4,
        whyItMatters: 'Progress accelerates when the main obstacle is made visible and measurable.',
      },
      {
        title: `Create proof of progress for ${dream}`,
        category: 'career',
        priority: 4,
        whyItMatters: 'Visible proof builds confidence, motivation, and portfolio value.',
      },
    ];

    const suggestedHabits: SuggestedHabit[] = [
      {
        title: 'Deep focus block before social media',
        frequency: 'daily',
        reminderTime: '07:30',
      },
      {
        title: 'Evening 10-minute goal review',
        frequency: 'daily',
        reminderTime: '21:30',
      },
      {
        title: 'Weekly proof-of-work review',
        frequency: 'weekly',
        reminderTime: '18:00',
      },
    ];

    const distractionStrategy: DistractionStrategy = {
      trigger: obstacle,
      replacementAction:
        'When the urge for social media starts, open the goal dashboard and complete a 10-minute task first.',
      environmentRule:
        'Keep distracting apps away during the first focus block and reward yourself only after progress is logged.',
    };

    const weeklyPlan: WeeklyPlanItem[] = [
      { day: 'Monday', focus: 'Clarify the target', action: `Write the exact outcome for ${dream}.` },
      { day: 'Tuesday', focus: 'Remove friction', action: `Prepare tools and block ${obstacle}.` },
      { day: 'Wednesday', focus: 'Deep work', action: 'Complete one focused task before checking social media.' },
      { day: 'Thursday', focus: 'Feedback', action: 'Review what worked and adjust the next action.' },
      { day: 'Friday', focus: 'Proof', action: 'Create visible proof: note, screenshot, commit, or demo.' },
      { day: 'Saturday', focus: 'Recovery', action: 'Do a lighter session and reflect honestly.' },
      { day: 'Sunday', focus: 'Plan next week', action: 'Choose three high-impact actions for the next 7 days.' },
    ];

    return {
      suggestedGoals,
      suggestedHabits,
      distractionStrategy,
      weeklyPlan,
      mentorStory: `${roleModel} usually win by repeating boring fundamentals: clear goals, protected focus time, honest review, and fast correction after mistakes.`,
    };
  }
}
