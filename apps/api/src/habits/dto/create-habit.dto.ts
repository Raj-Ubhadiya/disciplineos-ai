import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateHabitDto {
  @IsString()
  @MaxLength(160)
  title!: string;

  @IsOptional()
  @IsString()
  goalId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  frequency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  reminderTime?: string;
}
