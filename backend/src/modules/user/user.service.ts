import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateRoleDto } from './dto/update-role.dto';
import { User, UserRole } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from './entities/user.request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Student } from '../student/entities/student.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

  async createUser(Dto: CreateUserDto, admin: User) {
    // if(admin.role !== UserRole.ADMIN){
    //    throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    // }
    const isExist = await this.userRepository.findOneBy({
      email: Dto.username,
    });
    if (isExist) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const newUser = this.userRepository.create({
      ...Dto,
      isActive: Dto.isActive ?? true,
    });
    const save = await this.userRepository.save(newUser);
    return {
      message: 'User created successfully',
      user: instanceToPlain(save),
    };
  }

  async updateUserRole(userId: number, dto: UpdateRoleDto, adminUser: User) {
    if (adminUser.role !== UserRole.ADMIN) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.role = dto.role;
    const updateUser = await this.userRepository.save(user);
    return instanceToPlain(updateUser);
  }

  //secrvice for managee teacher.students,principal
  async findByRole(role: UserRole) {
    const users = await this.userRepository.find({
      where: { role },
      order: { username: 'ASC' },
    });

    return plainToInstance(User, users);
  }
  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({ order: { id: 'ASC' } });
    // return plainToInstance(User, users);
    return users;
  }

  //UPDATE ROLE MANAGEMENT
  async updateRole(
    id: number,
    role: UserRole,
    isActive: boolean,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    user.isActive = isActive;
    await this.userRepository.save(user);
    return { message: 'User update successfully' };
  }
  async deleteRole(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found ');
    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }
  //   async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  //   const user = await this.userRepository.findOne({ where: { id } });

  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }

  //   Object.assign(user, updateUserDto);
  //   return this.userRepository.save(user);
  // }
  //   async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  //   const user = await this.userRepository.findOne({
  //     where: { id },
  //     relations: ['studentProfile'],
  //   });

  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }

  //   Object.assign(user, updateUserDto);
  //   if (user.studentProfile) {
  //     if (updateUserDto.className) {
  //       user.studentProfile.className = updateUserDto.className;
  //     }
  //     if (updateUserDto.rollNo) {
  //       user.studentProfile.rollNo = +updateUserDto.rollNo;
  //     }
  //   }

  //   return await this.userRepository.save(user);
  // }
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['studentProfile'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);

    if (user.studentProfile) {
      if (updateUserDto.className) {
        user.studentProfile.className = updateUserDto.className;
      }
      if (updateUserDto.rollNo) {
        user.studentProfile.rollNo = +updateUserDto.rollNo;
      }

      await this.studentRepository.save(user.studentProfile);
    }

    return await this.userRepository.save(user);
  }
  async createRequest(dto: CreateRequestDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: dto.userId },
      });
      if (!user) {
        throw new NotFoundException(`user not found this ${dto.userId} id`);
      }
      if (!dto.message || dto.message.trim() === '') {
        throw new BadRequestException('Message is required');
      }

      const newRequest = this.requestRepository.create({
        message: dto.message,
        user: user,
      });
      return this.requestRepository.save(newRequest);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create  request');
    }
  }
  async fetchUserRequest() {
    try {
      const requests = await this.requestRepository.find({
        relations: ['user'],
        select: {
          message: true,
          status: true,
          user: {
            username: true,
            role: true,
          },
        },
      });
      return requests;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch requests');
    }
  }
}
