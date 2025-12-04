import { Injectable } from '@nestjs/common';
import { CreateAuthSessionModuleDto } from './dto/create-auth-session-module.dto';
import { UpdateAuthSessionModuleDto } from './dto/update-auth-session-module.dto';

@Injectable()
export class AuthSessionModuleService {
  create(createAuthSessionModuleDto: CreateAuthSessionModuleDto) {
    return 'This action adds a new authSessionModule';
  }

  findAll() {
    return `This action returns all authSessionModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authSessionModule`;
  }

  update(id: number, updateAuthSessionModuleDto: UpdateAuthSessionModuleDto) {
    return `This action updates a #${id} authSessionModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} authSessionModule`;
  }
}
