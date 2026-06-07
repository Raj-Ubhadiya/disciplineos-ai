import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAiPlanDto {
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  dream!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  currentSituation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  mainObstacle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  roleModel?: string;
}
