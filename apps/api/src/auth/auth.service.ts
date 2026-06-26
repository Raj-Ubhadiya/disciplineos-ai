import type { OtpRequestResponse } from '@disciplineos/types';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomInt } from 'crypto';
import * as nodemailer from 'nodemailer';

import { PrismaService } from '../prisma.service';
import type { AuthResponseDto, GoogleAuthDto, LoginDto, RequestOtpDto, SignupDto, VerifyOtpDto } from './dto';

type AuthChannel = 'email' | 'phone';
type AuthPurpose = 'login' | 'signup';

type NormalizedOtpInput = {
  channel: AuthChannel;
  purpose: AuthPurpose;
  email: string | null;
  phone: string | null;
  target: string;
  name: string | null;
};

type UserRecord = {
  id: string;
  email: string;
  phone: string | null;
  password: string | null;
  googleId: string | null;
  name: string | null;
  role: string;
  authProvider: string;
  emailVerifiedAt: Date | null;
  phoneVerifiedAt: Date | null;
};

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;
  private readonly logger = new Logger(AuthService.name);
  private mailTransporter?: nodemailer.Transporter | null;

  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const email = this.normalizeEmail(signupDto.email);
    const phone = signupDto.phone ? this.normalizePhone(signupDto.phone) : null;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        existingUser.email === email ? 'Email already registered' : 'Phone number already registered',
      );
    }

    const password = await bcrypt.hash(signupDto.password, this.saltRounds);
    const user = await this.prisma.user.create({
      data: {
        email,
        ...(phone ? { phone } : {}),
        name: signupDto.name ?? null,
        password,
        authProvider: 'password',
        emailVerifiedAt: new Date(),
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
    const user = (await this.prisma.user.findUnique({
      where: { email: this.normalizeEmail(loginDto.email) },
    })) as UserRecord | null;

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.password) {
      throw new UnauthorizedException('Use Google Sign-In, email code, or phone code for this account.');
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

  async requestOtp(requestOtpDto: RequestOtpDto): Promise<OtpRequestResponse> {
    const input = this.normalizeOtpInput(requestOtpDto);
    const existingByTarget = (await this.findUserByChannel(input.channel, input.target)) as UserRecord | null;

    if (input.purpose === 'signup') {
      if (!input.name) {
        throw new BadRequestException('Name is required for signup.');
      }

      if (!input.email) {
        throw new BadRequestException('Email is required for signup.');
      }

      if (!input.phone) {
        throw new BadRequestException('Phone number is required for signup.');
      }

      const conflictingUser = (await this.prisma.user.findFirst({
        where: {
          OR: [{ email: input.email }, { phone: input.phone }],
        },
      })) as UserRecord | null;

      if (conflictingUser) {
        if (conflictingUser.email === input.email) {
          throw new BadRequestException('Email already registered');
        }

        throw new BadRequestException('Phone number already registered');
      }
    }

    if (input.purpose === 'login' && !existingByTarget) {
      throw new BadRequestException(
        input.channel === 'email' ? 'No account found for this email' : 'No account found for this phone number',
      );
    }

    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + this.getOtpTtlMinutes() * 60_000);

    await this.prisma.authOtp.updateMany({
      where: {
        channel: input.channel,
        target: input.target,
        purpose: input.purpose,
        consumedAt: null,
      },
      data: {
        consumedAt: new Date(),
      },
    });

    await this.prisma.authOtp.create({
      data: {
        channel: input.channel,
        target: input.target,
        email: input.email,
        phone: input.phone,
        codeHash: this.hashOtpCode(code),
        purpose: input.purpose,
        name: input.name,
        expiresAt,
        ...(existingByTarget ? { userId: existingByTarget.id } : {}),
      },
    });

    const delivered =
      input.channel === 'email'
        ? await this.sendOtpEmail(input.email!, code, input.purpose)
        : await this.sendOtpSms(input.phone!, code, input.purpose);
    return {
      message: delivered
        ? `Verification code sent to your ${input.channel === 'email' ? 'email' : 'phone'}.`
        : `Verification code generated. ${input.channel === 'email' ? 'Email' : 'SMS'} delivery is not configured, so the code is available in development logs.`,
      debugCode: code,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    const input = this.normalizeOtpInput(verifyOtpDto);
    const otpRecord = await this.prisma.authOtp.findFirst({
      where: {
        channel: input.channel,
        target: input.target,
        purpose: input.purpose,
        consumedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('No active verification code found.');
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Verification code has expired.');
    }

    if (otpRecord.codeHash !== this.hashOtpCode(verifyOtpDto.code)) {
      throw new UnauthorizedException('Invalid verification code.');
    }

    const email = input.email ?? otpRecord.email ?? null;
    const phone = input.phone ?? otpRecord.phone ?? null;
    const verifiedAt = new Date();

    let user = (await this.findUserByChannel(input.channel, input.target)) as UserRecord | null;

    if (input.purpose === 'signup') {
      if (!email) {
        throw new BadRequestException('Email is required for signup.');
      }

      if (!phone) {
        throw new BadRequestException('Phone number is required for signup.');
      }

      const conflictingUser = (await this.prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      })) as UserRecord | null;

      if (conflictingUser) {
        if (conflictingUser.email === email) {
          throw new BadRequestException('Email already registered');
        }

        throw new BadRequestException('Phone number already registered');
      }

      user = (await this.prisma.user.create({
        data: {
          email,
          phone,
          name: input.name ?? otpRecord.name ?? null,
          password: null,
          authProvider: 'otp',
          emailVerifiedAt: input.channel === 'email' ? verifiedAt : null,
          phoneVerifiedAt: input.channel === 'phone' ? verifiedAt : null,
          profile: {
            create: {},
          },
        },
      })) as UserRecord;
    } else {
      if (!user) {
        throw new UnauthorizedException(
          input.channel === 'email' ? 'No account found for this email.' : 'No account found for this phone number.',
        );
      }

      user = (await this.prisma.user.update({
        where: { id: user.id },
        data: {
          ...(input.channel === 'email'
            ? { emailVerifiedAt: user.emailVerifiedAt ?? verifiedAt }
            : { phoneVerifiedAt: user.phoneVerifiedAt ?? verifiedAt }),
          authProvider: user.authProvider === 'password' ? 'hybrid' : user.authProvider,
        },
      })) as UserRecord;
    }

    await this.prisma.authOtp.updateMany({
      where: {
        channel: input.channel,
        target: input.target,
        consumedAt: null,
      },
      data: {
        consumedAt: verifiedAt,
      },
    });

    return {
      accessToken: this.generateAccessToken(user),
      user: this.sanitizeUser(user),
    };
  }

  async loginWithGoogle(googleAuthDto: GoogleAuthDto): Promise<AuthResponseDto> {
    const googleProfile = await this.verifyGoogleIdToken(googleAuthDto.idToken);
    const email = googleProfile.email.toLowerCase();

    let user = (await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleProfile.sub }, { email }],
      },
    })) as UserRecord | null;

    if (!user) {
      user = (await this.prisma.user.create({
        data: {
          email,
          googleId: googleProfile.sub,
          name: googleProfile.name ?? null,
          password: null,
          authProvider: 'google',
          emailVerifiedAt: googleProfile.email_verified ? new Date() : null,
          profile: {
            create: {},
          },
        },
      })) as UserRecord;
    } else {
      user = (await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: user.googleId ?? googleProfile.sub,
          name: user.name ?? googleProfile.name ?? null,
          emailVerifiedAt: user.emailVerifiedAt ?? (googleProfile.email_verified ? new Date() : null),
          authProvider:
            user.authProvider === 'password' || user.authProvider === 'otp' ? 'hybrid' : user.authProvider,
        },
      })) as UserRecord;
    }

    return {
      accessToken: this.generateAccessToken(user),
      user: this.sanitizeUser(user),
    };
  }

  async validateToken(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = (await this.prisma.user.findUnique({
      where: { id: payload.sub },
    })) as UserRecord | null;

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return this.sanitizeUser(user);
  }

  private async findUserByChannel(channel: AuthChannel, target: string): Promise<UserRecord | null> {
    if (channel === 'email') {
      return (await this.prisma.user.findUnique({
        where: { email: target },
      })) as UserRecord | null;
    }

    return (await this.prisma.user.findUnique({
      where: { phone: target },
    })) as UserRecord | null;
  }

  private normalizeOtpInput(input: RequestOtpDto | VerifyOtpDto): NormalizedOtpInput {
    const email = input.email ? this.normalizeEmail(input.email) : null;
    const phone = input.phone ? this.normalizePhone(input.phone) : null;
    const channel = input.channel;
    const target = channel === 'email' ? email : phone;

    if (!target) {
      throw new BadRequestException(
        channel === 'email' ? 'Email is required for this OTP request.' : 'Phone number is required for this OTP request.',
      );
    }

    return {
      channel,
      purpose: input.purpose,
      email,
      phone,
      target,
      name: input.name?.trim() ?? null,
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizePhone(phone: string): string {
    const normalized = phone.replace(/[^\d+]/g, '');

    if (!/^\+?[1-9]\d{7,14}$/.test(normalized)) {
      throw new BadRequestException('Phone number must be in a valid international format.');
    }

    return normalized.startsWith('+') ? normalized : `+${normalized}`;
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
    phone: string | null;
    name: string | null;
    role: string;
  }): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
    };
  }

  private getOtpTtlMinutes(): number {
    return this.configService.get<number>('auth.otpTtlMinutes') ?? 10;
  }

  private generateOtpCode(): string {
    return String(randomInt(0, 1_000_000)).padStart(6, '0');
  }

  private hashOtpCode(code: string): string {
    return createHash('sha256').update(code).digest('hex');
  }

  private async sendOtpEmail(email: string, code: string, purpose: AuthPurpose): Promise<boolean> {
    const transporter = this.getMailTransporter();
    const fromEmail =
      this.configService.get<string | undefined>('auth.fromEmail') ?? 'no-reply@disciplineos.local';
    const fromName =
      this.configService.get<string | undefined>('auth.fromName') ?? 'DisciplineOS AI';

    if (!transporter) {
      this.logger.warn(`Email OTP for ${email}: ${code}`);
      return false;
    }

    try {
      await transporter.sendMail({
        from: `${fromName} <${fromEmail}>`,
        to: email,
        subject:
          purpose === 'login' ? 'Your DisciplineOS AI login code' : 'Verify your DisciplineOS AI account',
        text:
          purpose === 'login'
            ? `Your DisciplineOS AI login code is ${code}. It expires in ${this.getOtpTtlMinutes()} minutes.`
            : `Your DisciplineOS AI signup code is ${code}. It expires in ${this.getOtpTtlMinutes()} minutes.`,
        html: `<div style="font-family:Arial,sans-serif;color:#172033">
  <h2>Your DisciplineOS AI verification code</h2>
  <p>Use this code to ${purpose === 'login' ? 'log in' : 'finish creating your account'}:</p>
  <p style="font-size:32px;font-weight:700;letter-spacing:8px">${code}</p>
  <p>This code expires in ${this.getOtpTtlMinutes()} minutes.</p>
</div>`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send OTP email: ${message}`);
      throw new InternalServerErrorException('Could not send verification email right now.');
    }

    return true;
  }

  private getMailTransporter(): nodemailer.Transporter | null {
    if (this.mailTransporter !== undefined) {
      return this.mailTransporter;
    }

    const smtpHost = this.configService.get<string | undefined>('auth.smtpHost');
    const smtpPort = this.configService.get<number | undefined>('auth.smtpPort') ?? 587;
    const smtpSecure = this.configService.get<boolean | undefined>('auth.smtpSecure') ?? false;
    const smtpUser = this.configService.get<string | undefined>('auth.smtpUser');
    const smtpPass = this.configService.get<string | undefined>('auth.smtpPass');

    if (!smtpHost) {
      this.mailTransporter = null;
      return this.mailTransporter;
    }

    this.mailTransporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
      requireTLS: !smtpSecure && smtpPort === 587,
      ...(smtpUser && smtpPass
        ? {
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          }
        : {}),
    });

    return this.mailTransporter;
  }

  private async sendOtpSms(phone: string, code: string, purpose: AuthPurpose): Promise<boolean> {
    const smsProvider = this.configService.get<string | undefined>('auth.smsProvider') ?? 'log';
    const twilioAccountSid = this.configService.get<string | undefined>('auth.twilioAccountSid');
    const twilioAuthToken = this.configService.get<string | undefined>('auth.twilioAuthToken');
    const twilioFromPhone = this.configService.get<string | undefined>('auth.twilioFromPhone');

    if (smsProvider !== 'twilio' || !twilioAccountSid || !twilioAuthToken || !twilioFromPhone) {
      this.logger.warn(`Phone OTP for ${phone}: ${code}`);
      return false;
    }

    const body = new URLSearchParams({
      To: phone,
      From: twilioFromPhone,
      Body:
        purpose === 'login'
          ? `Your DisciplineOS AI login code is ${code}. It expires in ${this.getOtpTtlMinutes()} minutes.`
          : `Your DisciplineOS AI signup code is ${code}. It expires in ${this.getOtpTtlMinutes()} minutes.`,
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(twilioAccountSid)}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Failed to send OTP SMS: ${errorText}`);
      throw new InternalServerErrorException('Could not send verification SMS right now.');
    }

    return true;
  }

  private async verifyGoogleIdToken(idToken: string): Promise<{
    sub: string;
    email: string;
    email_verified: boolean;
    name?: string;
    aud?: string;
  }> {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
    );

    if (!response.ok) {
      throw new UnauthorizedException('Invalid Google token.');
    }

    const payload = (await response.json()) as {
      sub?: string;
      email?: string;
      email_verified?: string | boolean;
      name?: string;
      aud?: string;
    };

    const expectedAudience = this.configService.get<string | undefined>('auth.googleClientId');

    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Google token did not include a valid account.');
    }

    if (expectedAudience && payload.aud !== expectedAudience) {
      throw new UnauthorizedException('Google token audience did not match this application.');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      email_verified: payload.email_verified === true || payload.email_verified === 'true',
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.aud ? { aud: payload.aud } : {}),
    };
  }
}
