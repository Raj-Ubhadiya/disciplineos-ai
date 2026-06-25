import { IsEmail, IsIn, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class VerifyOtpDto {
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

  @IsString()
  @Length(6, 6)
  code!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;
}
