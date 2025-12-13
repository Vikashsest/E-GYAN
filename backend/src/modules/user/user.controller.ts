import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  UnauthorizedException,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { User, UserRole } from './entities/user.entity';
import { RolesGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';

import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateRequestDto } from './dto/create-request.dto';
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.userService.createUser(dto, req.user);
  }
  @Post('request')
  async createRequest(@Body() dto: { message: string }, @Req() req: any) {
    const userId = req.user.id;

    return this.userService.createRequest({ ...dto, userId });
  }

  //ROLE MANAGEMET API
  @Patch('update-role/:id')
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  async updateRole(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    dto: UpdateRoleDto,
    @Req() req: Request,
  ) {
    const adminUser = req.user as User;
    return this.userService.updateUserRole(+id, dto, adminUser);
  }

  //MANAGE STUDENTS,TEACHER,PRINCIPAL

  @Get('filter')
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  async getUsers(@Query('role') role: UserRole, @Req() req) {
    return this.userService.findByRole(role);
  }
  //GET ALL  STUDENTS,TEACHER,STUDENTS

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER)
  getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
  //Delete role

  @Get('requests')
  fetchRequests() {
    return this.userService.fetchUserRequest();
  }

  @Delete('delete-role/:id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.PRINCIPAL)
  async deleteRole(@Param('id') id: number) {
    return this.userService.deleteRole(id);
  }
}
