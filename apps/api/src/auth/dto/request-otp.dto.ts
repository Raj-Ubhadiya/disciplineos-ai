import { IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RequestOtpDto {
  @IsIn(['email', 'phone'])
  channel!: 'email' | 'phone';

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/)
  phone?: string;

  @IsIn(['login', 'signup'])
  purpose!: 'login' | 'signup';

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;
}
