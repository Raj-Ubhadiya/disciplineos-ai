import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsString()
  goalId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  frequency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  reminderTime?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentStreak?: number;
}
