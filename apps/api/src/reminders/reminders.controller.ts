import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth';
import { GetUser, JwtAuthGuard } from '../auth';
import { CreateReminderDto, UpdateReminderDto } from './dto';
import { RemindersService } from './reminders.service';

@ApiTags('reminders')
@Controller({
  path: 'reminders',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class RemindersController {
  constructor(@Inject(RemindersService) private readonly remindersService: RemindersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an in-app discipline reminder' })
  @ApiBody({ type: CreateReminderDto })
  create(@GetUser() user: AuthenticatedUser, @Body() createReminderDto: CreateReminderDto) {
    return this.remindersService.create(user, createReminderDto);
  }

  @Get()
  @ApiOperation({ summary: 'List reminders for the authenticated user' })
  findAll(@GetUser() user: AuthenticatedUser) {
    return this.remindersService.findAll(user);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'List upcoming pending reminders' })
  findUpcoming(@GetUser() user: AuthenticatedUser) {
    return this.remindersService.findUpcoming(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one reminder' })
  @ApiBody({ type: UpdateReminderDto })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
  ) {
    return this.remindersService.update(user, id, updateReminderDto);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark one reminder complete' })
  complete(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.remindersService.complete(user, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one reminder' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.remindersService.remove(user, id);
  }
}
