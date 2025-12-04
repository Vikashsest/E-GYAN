import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from '../user/dto/ForgotPasswordDto';
import { VerifyOtpDto } from '../user/dto/verify-otp.dto';
import { ResetPasswordDto } from '../user/dto/ResetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // async login(
  //   @Body() loginDTO: CreateUserDto,
  //   @Res() res: Response,
  // ) {
  //   return this.authService.login(loginDTO.username, loginDTO.password, res);
  // }
  @Post('login')
  async login(@Body() loginDTO: CreateUserDto, @Res() res: Response) {
    if (!loginDTO.username || !loginDTO.password) {
      throw new BadRequestException('Username and password are required');
    }

    return this.authService.login(loginDTO.username, loginDTO.password, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    const user = req.user!;
    return this.authService.getProfile(user['id']);
  }

  @Post('logout')
  async logout(@Req() req, @Res() res: Response): Promise<void> {
    return this.authService.logout(req, res);
  }

  // @Post('forgot-password')
  // async forgotPassword(@Body() dto: ForgotPasswordDto) {
  //   return this.authService.forgotPassword(dto);
  // }
  @Post('forgot-password')
  sendOtp(@Body() dto: ForgotPasswordDto) {
    console.log(dto);
    return this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
