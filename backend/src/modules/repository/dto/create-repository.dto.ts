import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRepositoryDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  type: string;
  @IsString()
  @IsOptional()
  category: string;
}
