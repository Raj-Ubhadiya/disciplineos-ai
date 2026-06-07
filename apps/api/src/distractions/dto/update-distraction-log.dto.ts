import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateDistractionLogDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  platform?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440)
  minutesLost?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  triggerReason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  moodBefore?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  moodAfter?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  replacementAction?: string;
}
