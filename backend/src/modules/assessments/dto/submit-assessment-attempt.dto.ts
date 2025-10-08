import { IsUUID, IsInt, Min } from 'class-validator';

export class SubmitAssessmentAttemptDto {
  @IsUUID()
  assessmentId: string;

  @IsInt({ each: true })
  @Min(0, { each: true })
  answers: number[]; // yahan aap marks ya question-answer mapping bhej sakte ho
}
