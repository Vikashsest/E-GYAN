import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { User, UserRole } from '../user/entities/user.entity';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('assessments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

@Post()
//  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
async create(@Body() createAssessmentDto: CreateAssessmentDto, @Req() req: Request) {
  console.log(req.user)
  if (!req.user) throw new UnauthorizedException('User not found');
  
  // Explicit type cast to entity
  const teacher = req.user as User; 
  return this.assessmentsService.create(createAssessmentDto, teacher);
}


  @Get()
  findAll() {
    return this.assessmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssessmentDto: UpdateAssessmentDto) {
    return this.assessmentsService.update(+id, updateAssessmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(+id);
  }
}
