import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth';
import { GetUser, JwtAuthGuard } from '../auth';
import { DistractionsService } from './distractions.service';
import { CreateDistractionLogDto, UpdateDistractionLogDto } from './dto';

@ApiTags('distractions')
@Controller({
  path: 'distractions',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class DistractionsController {
  constructor(
    @Inject(DistractionsService)
    private readonly distractionsService: DistractionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Log a social media distraction event' })
  @ApiBody({ type: CreateDistractionLogDto })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createDistractionLogDto: CreateDistractionLogDto,
  ) {
    return this.distractionsService.create(user, createDistractionLogDto);
  }

  @Get()
  @ApiOperation({ summary: 'List recent distraction logs' })
  findAll(@GetUser() user: AuthenticatedUser) {
    return this.distractionsService.findAll(user);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get distraction summary metrics' })
  getSummary(@GetUser() user: AuthenticatedUser) {
    return this.distractionsService.getSummary(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a distraction log' })
  @ApiBody({ type: UpdateDistractionLogDto })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateDistractionLogDto: UpdateDistractionLogDto,
  ) {
    return this.distractionsService.update(user, id, updateDistractionLogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a distraction log' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.distractionsService.remove(user, id);
  }
}
