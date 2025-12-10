import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Book } from '../../book/entities/book.entity';
import { User } from '../../user/entities/user.entity';

@Entity('student_book_assign')
export class StudentBookAssign {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE', eager: true })
  @Index()
  student: Student;

  @ManyToOne(() => Book, { onDelete: 'CASCADE', eager: true })
  @Index()
  book: Book;

  @ManyToOne(() => User, { nullable: true, eager: true })
  assignedBy: User;

  @CreateDateColumn()
  assignedAt: Date;
  @Column({ type: 'varchar', default: 'assigned' })
  status: string;
}
