import { PartialType } from '@nestjs/swagger';
import { CreateAuthSessionModuleDto } from './create-auth-session-module.dto';

export class UpdateAuthSessionModuleDto extends PartialType(CreateAuthSessionModuleDto) {}
