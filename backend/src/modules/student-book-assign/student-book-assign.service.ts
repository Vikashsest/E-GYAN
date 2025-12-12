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
  async assignBook(studentId: number, bookId: number, teacherId: number) {
    const student = await this.userRepository.findOne({
      where: { id: studentId },
    });
    const book = await this.bookRepo.findOne({ where: { id: bookId } });
    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
    });

    if (!student || !book) {
      throw new Error('Student or Book not found');
    }

    const assigned = this.studentBookAssign.create({
      student,
      book,
      assignedBy: teacher,
      status: 'assigned',
    });

    return await this.studentBookAssign.save(assigned);
  }

  async getAssignedBooks(studentId: number) {
    return this.studentBookAssign.find({
      where: { student: { id: studentId } },
      relations: ['book', 'assignedBy'],
    });
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
