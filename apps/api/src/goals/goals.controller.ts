import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth';
import { GetUser, JwtAuthGuard } from '../auth';
import { CreateGoalDto, UpdateGoalDto } from './dto';
import { GoalsService } from './goals.service';

@ApiTags('goals')
@Controller({
  path: 'goals',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class GoalsController {
  constructor(@Inject(GoalsService) private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a goal for the authenticated user' })
  @ApiBody({ type: CreateGoalDto })
  create(@GetUser() user: AuthenticatedUser, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(user, createGoalDto);
  }

  @Get()
  @ApiOperation({ summary: 'List goals for the authenticated user' })
  findAll(@GetUser() user: AuthenticatedUser) {
    return this.goalsService.findAll(user);
  }

  @Get('shared')
  @ApiOperation({ summary: 'List goals linked to accountability partners' })
  findShared(@GetUser() user: AuthenticatedUser) {
    return this.goalsService.findShared(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one goal with habits' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.goalsService.findOne(user, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one goal' })
  @ApiBody({ type: UpdateGoalDto })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(user, id, updateGoalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one goal' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.goalsService.remove(user, id);
  }
}
