import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateFocusSessionDto {
  @IsString()
  @MaxLength(160)
  title!: string;

  @IsInt()
  @Min(1)
  @Max(720)
  durationMinutes!: number;

  @IsOptional()
  @IsString()
  goalId?: string;

  @IsOptional()
  @IsString()
  habitId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  energyLevel?: string;

  @IsOptional()
  @IsBoolean()
  distractionFree?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @IsOptional()
  @IsDateString()
  startedAt?: string;
}
