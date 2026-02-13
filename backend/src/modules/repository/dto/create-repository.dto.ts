// import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// export class CreateRepositoryDto {
//   @IsString()
//   @IsNotEmpty()
//   text: string;

//   @IsString()
//   @IsNotEmpty()
//   type: string;
//   @IsString()
//   @IsOptional()
//   category: string;
// }

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
  category?: string;

  @IsString()
  @IsOptional()
  educationLevel?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  book?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsString()
  @IsOptional()
  resourceType?: string;
}
