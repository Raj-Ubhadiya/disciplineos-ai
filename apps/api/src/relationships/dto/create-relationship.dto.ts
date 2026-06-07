import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRelationshipDto {
  @IsOptional()
  @IsEmail()
  partnerEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  partnerName?: string;
}
