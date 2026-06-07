import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth';
import { GetUser, JwtAuthGuard } from '../auth';
import {
  CreateRelationshipCheckInDto,
  CreateRelationshipDto,
  UpdateRelationshipDto,
} from './dto';
import { RelationshipsService } from './relationships.service';

@ApiTags('relationships')
@Controller({
  path: 'relationships',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class RelationshipsController {
  constructor(
    @Inject(RelationshipsService)
    private readonly relationshipsService: RelationshipsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add an accountability partner' })
  @ApiBody({ type: CreateRelationshipDto })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createRelationshipDto: CreateRelationshipDto,
  ) {
    return this.relationshipsService.create(user, createRelationshipDto);
  }

  @Get()
  @ApiOperation({ summary: 'List accountability partners for the authenticated user' })
  findAll(@GetUser() user: AuthenticatedUser) {
    return this.relationshipsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one accountability partner with recent check-ins' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.relationshipsService.findOne(user, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an accountability partner owned by the authenticated user' })
  @ApiBody({ type: UpdateRelationshipDto })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateRelationshipDto: UpdateRelationshipDto,
  ) {
    return this.relationshipsService.update(user, id, updateRelationshipDto);
  }

  @Post(':id/check-ins')
  @ApiOperation({ summary: 'Create an accountability check-in' })
  @ApiBody({ type: CreateRelationshipCheckInDto })
  createCheckIn(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() createRelationshipCheckInDto: CreateRelationshipCheckInDto,
  ) {
    return this.relationshipsService.createCheckIn(user, id, createRelationshipCheckInDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an accountability partner owned by the authenticated user' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.relationshipsService.remove(user, id);
  }
}
