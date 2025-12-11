import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStudentBookAssignDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsInt()
  @IsNotEmpty()
  bookId: number;
  @IsInt()
  @IsOptional()
  assignedById?: number;
}
