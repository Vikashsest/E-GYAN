import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Quiz } from "./quiz.entity";

@Entity("quiz_questions")
export class QuizQuestion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: "CASCADE" })
  quiz: Quiz;

  @Column({ type: "text" })
  question_text: string;

  @Column("text", { array: true })
  options: string[];

  @Column({ type: "varchar", length: 255 })
  answer: string;
}
