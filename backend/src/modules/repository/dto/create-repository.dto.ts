import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRepositoryDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
