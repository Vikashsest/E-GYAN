import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateCurrentAffairDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string; // news category

  @IsString()
  @IsNotEmpty()
  mainCategory: string; // frontend wala "Current Affairs"

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  link?: string;
}
