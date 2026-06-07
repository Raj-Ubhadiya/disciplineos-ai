import { IsDateString, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  @MaxLength(160)
  title!: string;

  @IsIn(['habit', 'goal', 'accountability', 'distraction_replacement'])
  type!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
