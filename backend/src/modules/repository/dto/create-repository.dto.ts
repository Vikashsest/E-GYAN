import { IsString } from "class-validator";

export class CreateRepositoryDto {
   @IsString()
  type: string;

  @IsString()
  value: string;
}
