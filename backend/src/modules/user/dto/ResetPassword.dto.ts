import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class ResetPasswordDto {
 @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  newPassword: string;
  @IsNotEmpty()
  confirmPassword: string;
  @IsNotEmpty()
  otp:string
}