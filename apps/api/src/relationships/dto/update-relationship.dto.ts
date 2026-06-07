import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRelationshipDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  partnerName?: string;

  @IsOptional()
  @IsIn(['active', 'paused', 'ended'])
  status?: string;
}
