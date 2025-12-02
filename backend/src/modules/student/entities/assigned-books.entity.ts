// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Student } from "./student.entity";
// import { Book } from "src/modules/book/entities/book.entity";

// @Entity('student_book_assign')
// export class StudentBookAssign {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => Student, (student) => student.assignedBooks, { eager: true })
//   student: Student;

//   @ManyToOne(() => Book, (book) => book.assignedBooks, { eager: true })
//   book: Book;

//   @Column({ nullable: true })
//   assignedBy: number;
// }
