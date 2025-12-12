import { IsString } from 'class-validator';

export class CreateAnnoucementDto {
  @IsString()
  text: string;
}
