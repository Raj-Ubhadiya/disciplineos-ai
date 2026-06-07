import { IsDateString, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @MaxLength(160)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @MaxLength(40)
  category!: string;

  @IsOptional()
  @IsString()
  relationshipId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  whyItMatters?: string;

  @IsOptional()
  @IsDateString()
  targetDate?: string;
}
