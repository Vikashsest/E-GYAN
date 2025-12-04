import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserSession } from '../auth-session-module/entities/auth-session-module.entity';
import { AuthSessionModuleModule } from '../auth-session-module/auth-session-module.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSession]),
    AuthSessionModuleModule,
    UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [TypeOrmModule, PassportModule, AuthService],
})
export class AuthModule {}
