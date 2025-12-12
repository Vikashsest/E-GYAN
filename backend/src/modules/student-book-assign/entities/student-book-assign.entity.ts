import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Book } from '../../book/entities/book.entity';
import { User } from '../../user/entities/user.entity';

@Entity('student_book_assign')
export class StudentBookAssign {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Student, { onDelete: 'CASCADE', eager: true })
  // @Index()
  // student: Student;

  @ManyToOne(() => Book, { onDelete: 'CASCADE', eager: true })
  @Index()
  book: Book;

  @ManyToOne(() => User, { nullable: true, eager: true })
  assignedBy: User | null;

  @CreateDateColumn()
  assignedAt: Date;
  @Column({ type: 'varchar', default: 'assigned' })
  status: string;
  @ManyToOne(() => User, (user) => user.assignedBooks)
  @JoinColumn({ name: 'studentId' })
  student: User;
}
