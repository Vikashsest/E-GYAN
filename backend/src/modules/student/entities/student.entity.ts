import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from 'src/modules/book/entities/book.entity';
// import { StudentBookAssign } from './assigned-books.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.studentProfile, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  user: User;

  @Column()
  className: string;
  @Column()
  rollNo: number;
  @Column({ name: 'book_id' })
  bookId: number;
  @OneToOne(() => Book, { eager: true, nullable: true })
  @JoinColumn({ name: 'book_id' })
  book: Book;
  // @OneToMany(() => StudentBookAssign, (assign) => assign.student)
  // assignedBooks: StudentBookAssign[];
}
