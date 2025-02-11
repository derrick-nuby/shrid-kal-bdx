import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService

  ) { }

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const user = await this.authService.getProfile(req);

    return {
      message: 'User profile',
      data: user,
    };
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const verifiedUser = await this.authService.verifyEmail(token);

    return {
      message: 'User email verified',
      data: verifiedUser,
    };
  }

}
