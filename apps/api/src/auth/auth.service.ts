import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma.service';
import type { AuthResponseDto, LoginDto, SignupDto } from './dto';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const password = await bcrypt.hash(signupDto.password, this.saltRounds);
    const user = await this.prisma.user.create({
      data: {
        email: signupDto.email,
        name: signupDto.name ?? null,
        password,
        profile: {
          create: {},
        },
      },
    });

    return {
      accessToken: this.generateAccessToken(user),
      user: this.sanitizeUser(user),
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(loginDto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      accessToken: this.generateAccessToken(user),
      user: this.sanitizeUser(user),
    };
  }

  async validateToken(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return this.sanitizeUser(user);
  }

  private generateAccessToken(user: { id: string; email: string }): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
  }

  private sanitizeUser(user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  }): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
