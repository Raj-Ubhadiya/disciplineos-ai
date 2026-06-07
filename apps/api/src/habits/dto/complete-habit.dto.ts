import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CompleteHabitDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
