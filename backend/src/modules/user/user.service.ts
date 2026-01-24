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
import * as bcrypt from 'bcrypt';
import { log } from 'console';
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
    if (dto.isActive !== undefined) {
      user.isActive = dto.isActive;
    }

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

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      Object.assign(user, updateUserDto);
      const updateUser = await this.userRepository.save(user);
      return {
        message: 'User update successfully',
        user: updateUser,
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
  async createRequest(dto: CreateRequestDto) {
    try {
      // 1️⃣ Find the user by ID
      const user = await this.userRepository.findOne({
        where: { id: dto.userId },
      });
      if (!user) {
        throw new NotFoundException(`User not found with id ${dto.userId}`);
      }

      // 2️⃣ Validate message
      if (!dto.message || dto.message.trim() === '') {
        throw new BadRequestException('Message is required');
      }

      // 3️⃣ Create new request
      const newRequest = this.requestRepository.create({
        message: dto.message,
        user: user,
      });

      // 4️⃣ Save to database
      const savedRequest = await this.requestRepository.save(newRequest);

      return {
        ...savedRequest,
        id: savedRequest.id,
      };
    } catch (error) {
      console.error(error); // log actual error
      throw new InternalServerErrorException('Failed to create request');
    }
  }

  // Example in RequestsService
  async fetchUserRequest() {
    const requests = await this.requestRepository.find({
      relations: ['user'],
    });

    // Map to include _id for frontend
    return requests.map((r) => ({
      id: r.id, // unique id for frontend
      message: r.message,
      status: r.status,
      user: {
        username: r.user.username,
        role: r.user.role,
      },
    }));
  }

  async deleteRequest(requestId: number) {
    try {
      const user = await this.requestRepository.findOne({
        where: { id: requestId },
      });

      if (!user) {
        throw new NotFoundException(`Request not found with id ${requestId}`);
      }
      const del = await this.requestRepository.delete(requestId);
      return del;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update request');
    }
  }
  async updateRequestStatus(requestId: number, status: 'pending' | 'resolved') {
    const request = await this.requestRepository.findOne({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(`Request not found with id ${requestId}`);
    }

    if (!status || !['pending', 'resolved'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    request.status = status;

    return await this.requestRepository.save(request);
  }
}
