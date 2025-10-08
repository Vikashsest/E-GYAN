import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { AssessmentQuestion } from "./assessment-question.entity";
import { AssessmentAttempt } from "./assessment-attempt.entity";

@Entity("assessments")
export class Assessment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "int" })
  duration: number; // minutes

  @Column({ type: "varchar", length: 50 })
  class: string;

  @ManyToOne(() => User, (user) => user.assessments)
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => AssessmentQuestion, (q) => q.assessment, { cascade: true })
  questions: AssessmentQuestion[];

  @OneToMany(() => AssessmentAttempt, (a) => a.assessment)
  attempts: AssessmentAttempt[];
}
