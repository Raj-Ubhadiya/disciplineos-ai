import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth';
import { GetUser, JwtAuthGuard } from '../auth';
import { CreateDailyReflectionDto } from './dto';
import { ReflectionsService } from './reflections.service';

@ApiTags('reflections')
@Controller({
  path: 'reflections',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class ReflectionsController {
  constructor(@Inject(ReflectionsService) private readonly reflectionsService: ReflectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an evening discipline reflection' })
  @ApiBody({ type: CreateDailyReflectionDto })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createDailyReflectionDto: CreateDailyReflectionDto,
  ) {
    return this.reflectionsService.create(user, createDailyReflectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'List recent discipline reflections' })
  findRecent(@GetUser() user: AuthenticatedUser) {
    return this.reflectionsService.findRecent(user);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get reflection consistency summary' })
  getSummary(@GetUser() user: AuthenticatedUser) {
    return this.reflectionsService.getSummary(user);
  }
}
