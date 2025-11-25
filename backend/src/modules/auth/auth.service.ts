import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { ForgotPasswordDto } from '../user/dto/ForgotPasswordDto';

import * as nodemailer from 'nodemailer';
import { ResetPasswordDto } from '../user/dto/ResetPassword.dto';
import { VerifyOtpDto } from '../user/dto/verify-otp.dto';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  private throwError(message: string, status: number): void {
    throw new HttpException(message, status);
  }

  private generateToken(user: User): string {
    const JWT_SECRET = process.env.JWT_ACCESS_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
    }
    const payload = {
      id: user.id,
      name: user.username,
      role: user.role,
    };

    const options: jwt.SignOptions = {
      expiresIn: (process.env.JWT_EXPIRATION || '1d') as any,
    };

    return jwt.sign(payload, JWT_SECRET, options);
  }




  // async registerUser(createUserDto: CreateUserDto, res: Response): Promise<void> {
  //   try {
  //     const { name, email, password } = createUserDto;

  //     const existingUser = await this.userRepository.findOne({
  //       where: { email },
  //     });

  //     if (existingUser) {
  //       return this.throwError('Email already exists', HttpStatus.BAD_REQUEST);
  //     }

  //     const hashedPassword = await bcrypt.hash(password, 10);

  //     const newUser = this.userRepository.create({
  //       name,
  //       email,
  //       password: hashedPassword,
  //     });

  //     await this.userRepository.save(newUser);

  //     res.status(HttpStatus.CREATED).json({ user: newUser });
  //   } catch (error) {
  //     console.error(error);
  //     this.throwError('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }


  async login(username: string, password: string, @Res({ passthrough: true }) res: Response): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });
      if (!user) {
        return this.throwError(
          'Invalid username or password',
          HttpStatus.BAD_REQUEST,
        );
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return this.throwError(
          'Invalid username or password',
          HttpStatus.BAD_REQUEST,
        );
      }
      const access_token = this.generateToken(user);
  
   res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none', 
       maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
//   res.cookie('access_token', access_token, {
//   httpOnly: true,
//   secure: false,         // ✅ required for HTTP/IP
//   sameSite: 'lax',       // ✅ works without HTTPS
//   maxAge: 7 * 24 * 60 * 60 * 1000,
//    path: '/'
// });

      
      res.status(HttpStatus.OK).json({
        status: 'Login successful',
        access_token,
        role: user.role
      });
    } catch (error) {
      this.handleError(error);
    }
  }
  async logout(res: Response): Promise<void> {
    try {
   res.clearCookie('access_token', {
  httpOnly: true,
  sameSite: 'none',
  secure: true
}); 
 
      res.status(HttpStatus.OK).json({ messgae: "logout successfully" })
    } catch (error) {
      this.handleError(error)
    }
  }
  async getProfile(id: number) {
    const user = await this.userRepository.findOne(
      {
        where: {
          id
        },
        select: ['id', 'email', 'username', 'role'],

      })
    return {
      status: 'success',
      profile: user,
    };

  }


// async forgotPassword(dto: ForgotPasswordDto) {
//   const { email, dob, newPassword, confirmPassword } = dto;
//  console.log("dto is",dto);
 
//   if (newPassword !== confirmPassword) { 
//     throw new BadRequestException('Passwords do not match');
//   }

//   const user = await this.userRepository.findOne({ where: { email, dob: new Date(dob), } });


//   if (!user) {
//     throw new NotFoundException('User not found with provided email and DOB');
//   }

//   const hashed = await bcrypt.hash(newPassword, 10);
//   user.password = hashed;

//   await this.userRepository.save(user);

//   return { message: 'Password reset successful' };
// }

  private handleError(error: any): void {
    console.error(error);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }


async sendOtp(dto:ForgotPasswordDto) {
  const { email } = dto;

  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetOtp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await this.userRepository.save(user);

  const transporter = nodemailer.createTransport({
    host: 'sg2plzcpnl506692.prod.sin2.secureserver.net',
    port: 465,
    secure: true,
    auth: {
      user: 'egyan@pentagontech.in',
      pass: '8TF&~rVu4z7*',
    },
  });

  await transporter.sendMail({
    from: '"Egyan Library" <egyan@pentagontech.in>',
    to: email,
    subject: 'Egyan Library - Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
  });

  return { message: 'OTP sent to email' };
}
  async verifyOtp(dto: VerifyOtpDto) {
    const { email, otp } = dto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    if (user.resetOtp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.otpVerified = true;
    await this.userRepository.save(user);

    return { message: 'OTP verified successfully' };
  }


async resetPassword(dto: ResetPasswordDto) {
  const { email,otp,newPassword, confirmPassword } = dto;

  if (newPassword !== confirmPassword) {
    throw new BadRequestException('Passwords do not match');
  }

  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) throw new NotFoundException('User not found');

  if (user.resetOtp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    throw new BadRequestException('Invalid or expired OTP');
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  // user.resetOtp=null,
  // user.otpExpiry=null
  await this.userRepository.save(user);

  return { message: 'Password reset successful' };
}

}
