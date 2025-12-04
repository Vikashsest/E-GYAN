import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthSessionModuleService } from './auth-session-module.service';
import { CreateAuthSessionModuleDto } from './dto/create-auth-session-module.dto';
import { UpdateAuthSessionModuleDto } from './dto/update-auth-session-module.dto';

@Controller('auth-session-module')
export class AuthSessionModuleController {
  constructor(private readonly authSessionModuleService: AuthSessionModuleService) {}

  @Post()
  create(@Body() createAuthSessionModuleDto: CreateAuthSessionModuleDto) {
    return this.authSessionModuleService.create(createAuthSessionModuleDto);
  }

  @Get()
  findAll() {
    return this.authSessionModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authSessionModuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthSessionModuleDto: UpdateAuthSessionModuleDto) {
    return this.authSessionModuleService.update(+id, updateAuthSessionModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authSessionModuleService.remove(+id);
  }
}
