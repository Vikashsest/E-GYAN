import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { Type } from 'class-transformer';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}
