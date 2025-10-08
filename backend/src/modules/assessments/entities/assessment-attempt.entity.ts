import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Assessment } from "./assessment.entity";
import { User } from "../../user/entities/user.entity";

@Entity("assessment_attempts")
export class AssessmentAttempt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Assessment, (assessment) => assessment.attempts, { onDelete: "CASCADE" })
  assessment: Assessment;

  @ManyToOne(() => User, (user) => user.assessmentAttempts, { onDelete: "CASCADE" })
  student: User;

  @CreateDateColumn()
  submitted_at: Date;

  @Column({ type: "int", default: 0 })
  score: number;
}
