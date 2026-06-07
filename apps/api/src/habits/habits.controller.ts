import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth';
import { GetUser, JwtAuthGuard } from '../auth';
import { CompleteHabitDto, CreateHabitDto, UpdateHabitDto } from './dto';
import { HabitsService } from './habits.service';

@ApiTags('habits')
@Controller({
  path: 'habits',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class HabitsController {
  constructor(@Inject(HabitsService) private readonly habitsService: HabitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a habit for the authenticated user' })
  @ApiBody({ type: CreateHabitDto })
  create(@GetUser() user: AuthenticatedUser, @Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.create(user, createHabitDto);
  }

  @Get()
  @ApiOperation({ summary: 'List habits for the authenticated user' })
  findAll(@GetUser() user: AuthenticatedUser) {
    return this.habitsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one habit with completion history' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.habitsService.findOne(user, id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark one habit complete for today' })
  @ApiBody({ type: CompleteHabitDto })
  complete(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() completeHabitDto: CompleteHabitDto,
  ) {
    return this.habitsService.complete(user, id, completeHabitDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one habit' })
  @ApiBody({ type: UpdateHabitDto })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
  ) {
    return this.habitsService.update(user, id, updateHabitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one habit' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.habitsService.remove(user, id);
  }
}
