import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from './auth.service';
import { AuthService } from './auth.service';
import { GetUser } from './decorators';
import { AuthResponseDto, LoginDto, SignupDto } from './dto';
import { JwtAuthGuard } from './guards';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthResponseDto })
  signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, type: AuthResponseDto })
  login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get the authenticated user' })
  me(@GetUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
