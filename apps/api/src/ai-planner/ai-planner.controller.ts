import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth';
import { GetUser, JwtAuthGuard } from '../auth';
import { AiPlannerService } from './ai-planner.service';
import { CreateAiPlanDto } from './dto';

@ApiTags('ai-planner')
@Controller({
  path: 'ai-plans',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class AiPlannerController {
  constructor(@Inject(AiPlannerService) private readonly aiPlannerService: AiPlannerService) {}

  @Post()
  @ApiOperation({ summary: 'Generate and save a discipline plan' })
  @ApiBody({ type: CreateAiPlanDto })
  create(@GetUser() user: AuthenticatedUser, @Body() createAiPlanDto: CreateAiPlanDto) {
    return this.aiPlannerService.create(user, createAiPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'List generated discipline plans' })
  findAll(@GetUser() user: AuthenticatedUser) {
    return this.aiPlannerService.findAll(user);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Convert an AI plan into goals and habits' })
  activate(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.aiPlannerService.activate(user, id);
  }
}
