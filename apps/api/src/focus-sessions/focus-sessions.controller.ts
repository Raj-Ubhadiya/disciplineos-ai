import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth';
import { GetUser, JwtAuthGuard } from '../auth';
import { CreateFocusSessionDto } from './dto';
import { FocusSessionsService } from './focus-sessions.service';

@ApiTags('focus-sessions')
@Controller({
  path: 'focus-sessions',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class FocusSessionsController {
  constructor(
    @Inject(FocusSessionsService)
    private readonly focusSessionsService: FocusSessionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Log a focused work session' })
  @ApiBody({ type: CreateFocusSessionDto })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createFocusSessionDto: CreateFocusSessionDto,
  ) {
    return this.focusSessionsService.create(user, createFocusSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'List recent focused work sessions' })
  findRecent(@GetUser() user: AuthenticatedUser) {
    return this.focusSessionsService.findRecent(user);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get focus session summary' })
  getSummary(@GetUser() user: AuthenticatedUser) {
    return this.focusSessionsService.getSummary(user);
  }
}
