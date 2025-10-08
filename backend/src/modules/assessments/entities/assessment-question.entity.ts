import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Assessment } from "./assessment.entity";

@Entity("assessment_questions")
export class AssessmentQuestion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.questions, { onDelete: "CASCADE" })
  assessment: Assessment;

  @Column({ type: "text" })
  question_text: string;

  @Column({ type: "int" })
  marks: number;
}
