import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateDailyReflectionDto {
  @IsString()
  @MaxLength(40)
  mood!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  wins?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  blockers?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  distractions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  tomorrowCommitment?: string;

  @IsInt()
  @Min(0)
  @Max(100)
  focusScore!: number;
}
