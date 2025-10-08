import { IsString, IsNotEmpty, IsOptional, IsInt, Min, MaxLength, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAssessmentQuestionDto } from './create-assessment-question.dto';

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  duration: number; // in minutes

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  class: string;

  @ValidateNested({ each: true })
  @Type(() => CreateAssessmentQuestionDto)
  @ArrayMinSize(1)
  questions: CreateAssessmentQuestionDto[];
}

