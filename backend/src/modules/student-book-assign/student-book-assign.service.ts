import { Injectable } from '@nestjs/common';
import { CreateStudentBookAssignDto } from './dto/create-student-book-assign.dto';
import { UpdateStudentBookAssignDto } from './dto/update-student-book-assign.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Book } from '../book/entities/book.entity';
import { Student } from '../student/entities/student.entity';
import { StudentBookAssign } from './entities/student-book-assign.entity';

@Injectable()
export class StudentBookAssignService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(StudentBookAssign)
    private readonly studentBookAssign: Repository<StudentBookAssign>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}
  create(createStudentBookAssignDto: CreateStudentBookAssignDto) {
    try {
    } catch (error) {
      console.log(error.message);
    }
  }

  async getAllStudents() {
    try {
      const students = await this.userRepository.find({
        where: { role: UserRole.STUDENT },
      });
      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }
  async getAllBooks() {
    try {
      const totalBook = await this.bookRepo.find();
      return totalBook;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async assignBook(studentId: number, bookId: number) {
    const student = await this.studentRepository.findOneBy({ id: studentId });
    if (!student) throw new Error('Student not found');

    const book = await this.bookRepo.findOneBy({ id: bookId });
    if (!book) throw new Error('Book not found');

    const assign = this.studentBookAssign.create({
      student,
      book,
    });

    await this.studentBookAssign.save(assign);

    return {
      message: 'Book assigned successfully',
      assignment: assign,
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} studentBookAssign`;
  }

  update(id: number, updateStudentBookAssignDto: UpdateStudentBookAssignDto) {
    return `This action updates a #${id} studentBookAssign`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentBookAssign`;
  }
}
