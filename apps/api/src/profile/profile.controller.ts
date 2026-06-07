import { Body, Controller, Get, Inject, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '../auth';
import { GetUser, JwtAuthGuard } from '../auth';
import { UpdateProfileDto } from './dto';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@Controller({
  path: 'profile',
  version: '1',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class ProfileController {
  constructor(@Inject(ProfileService) private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  getProfile(@GetUser() user: AuthenticatedUser) {
    return this.profileService.getProfile(user);
  }

  @Patch()
  @ApiOperation({ summary: 'Update the authenticated user profile' })
  @ApiBody({ type: UpdateProfileDto })
  updateProfile(
    @GetUser() user: AuthenticatedUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(user, updateProfileDto);
  }
}
