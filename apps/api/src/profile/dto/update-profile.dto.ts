import { IsArray, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  mainDream?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  currentLifeFocus?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  biggestDistractions?: string[];

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(1440)
  dailyFocusMinutes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  preferredReminderTone?: string;
}
