import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Quiz } from "./quiz.entity";
import { User } from "../../user/entities/user.entity"

@Entity("quiz_attempts")
export class QuizAttempt {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.attempts, { onDelete: "CASCADE" })
  quiz: Quiz;

  @ManyToOne(() => User, (user) => user.quizAttempts, { onDelete: "CASCADE" })
  student: User;

  @CreateDateColumn()
  submitted_at: Date;

  @Column({ type: "int", default: 0 })
  score: number;
}
