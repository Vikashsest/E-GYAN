import { Module } from '@nestjs/common';
import { StudentBookAssignService } from './student-book-assign.service';
import { StudentBookAssignController } from './student-book-assign.controller';
import { StudentBookAssign } from './entities/student-book-assign.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Book } from '../book/entities/book.entity';
import { Student } from '../student/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentBookAssign, User, Book, Student])],
  controllers: [StudentBookAssignController],
  providers: [StudentBookAssignService],
})
export class StudentBookAssignModule {}
