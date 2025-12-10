import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentBookAssignService } from './student-book-assign.service';
import { CreateStudentBookAssignDto } from './dto/create-student-book-assign.dto';
import { UpdateStudentBookAssignDto } from './dto/update-student-book-assign.dto';

@Controller('student-book-assign')
export class StudentBookAssignController {
  constructor(
    private readonly studentBookAssignService: StudentBookAssignService,
  ) {}

  @Post()
  create(@Body() createStudentBookAssignDto: CreateStudentBookAssignDto) {
    return this.studentBookAssignService.create(createStudentBookAssignDto);
  }
  @Post('assign')
  async assignBook(@Body() body: { studentId: number; bookId: number }) {
    const { studentId, bookId } = body;
    return await this.studentBookAssignService.assignBook(studentId, bookId);
  }
  @Get()
  findAll() {
    return this.studentBookAssignService.getAllStudents();
  }
  @Get('books')
  getAllBooks() {
    return this.studentBookAssignService.getAllBooks();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentBookAssignService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudentBookAssignDto: UpdateStudentBookAssignDto,
  ) {
    return this.studentBookAssignService.update(
      +id,
      updateStudentBookAssignDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentBookAssignService.remove(+id);
  }
}
