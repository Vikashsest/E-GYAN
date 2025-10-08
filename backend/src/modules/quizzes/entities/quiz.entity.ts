import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { QuizQuestion } from "./quiz-question.entity";
import { QuizAttempt } from "./quiz-attempt.entity";

@Entity("quizzes")
export class Quiz {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "int" })
  duration: number;

  @Column({ type: "varchar", length: 50 })
  class: string;

  @ManyToOne(() => User, (user) => user.quizzes)
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => QuizQuestion, (q) => q.quiz, { cascade: true })
  questions: QuizQuestion[];

  @OneToMany(() => QuizAttempt, (a) => a.quiz)
  attempts: QuizAttempt[];
}
