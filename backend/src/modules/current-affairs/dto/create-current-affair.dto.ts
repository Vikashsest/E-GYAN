
import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateCurrentAffairDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string; 
  @IsOptional()
  @IsDateString()
  date?: string; 

  @IsOptional()
  @IsString()
  link?: string; 
}
