import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async userRegistration(@Body() RegisterUserDto: RegisterUserDto) {
    const user = await this.authService.register(RegisterUserDto);

    return {
      message: 'User registration successful',
      data: user,
    };
  }

  @Post('login')
  async userLogin(@Body() LoginUserDto: LoginUserDto) {
    const user = await this.authService.login(LoginUserDto);

    return {
      message: 'User logged in successful',
      data: user,
    };
  }

  @Get('profile')
  getProfile() {
    return this.authService.getProfile();
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

}
