import { PartialType } from '@nestjs/swagger';
import { CreateStudentBookAssignDto } from './create-student-book-assign.dto';

export class UpdateStudentBookAssignDto extends PartialType(CreateStudentBookAssignDto) {}
