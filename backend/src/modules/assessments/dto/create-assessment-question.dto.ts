import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateAssessmentQuestionDto {
  @IsString()
  @IsNotEmpty()
  question_text: string;

  @IsInt()
  @Min(1)
  marks: number;
}
