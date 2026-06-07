import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRelationshipCheckInDto {
  @IsString()
  @MaxLength(80)
  mood!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  appreciation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  concern?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  commitment?: string;
}
