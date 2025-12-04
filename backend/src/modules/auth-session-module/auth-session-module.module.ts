import { Module } from '@nestjs/common';
import { AuthSessionModuleService } from './auth-session-module.service';
import { AuthSessionModuleController } from './auth-session-module.controller';
import { UserSession } from './entities/auth-session-module.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession])],
  controllers: [AuthSessionModuleController],
  providers: [AuthSessionModuleService],
  exports: [TypeOrmModule, AuthSessionModuleService],
})
export class AuthSessionModuleModule {}
