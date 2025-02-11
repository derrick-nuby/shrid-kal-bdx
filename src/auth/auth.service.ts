import { BadRequestException, Injectable, NotFoundException, Req, UnauthorizedException } from "@nestjs/common";
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "src/mail/mail.service";
import { createEncryptedToken, decryptToken } from "src/utils/verify-token.util";
import { v4 as uuidV4 } from "uuid";

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) { }


  async register(RegisterUserDto: RegisterUserDto) {
    try {
      const existingUser = await this.userModel.findOne({ email: RegisterUserDto.email });

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      const user = await this.userModel.create(RegisterUserDto);
      const { password, ...result } = user.toObject();

      const encryptedToken = createEncryptedToken(user._id, user.email);

      await this.mailService.sendVerificationEmail(
        user.email,
        user.name,
        encryptedToken
      );

      return result;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async login(LoginUserDto: LoginUserDto) {
    try {
      const user = await this.userModel.findOne({ email: LoginUserDto.email }).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const passwordMatch = await bcrypt.compare(LoginUserDto.password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user._id };

      const token = this.jwtService.sign(payload);

      const { password, ...result } = user.toObject();
      return {
        ...result,
        access_token: token,
      };

    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async getProfile(@Req() req) {
    try {
      const { id } = req.user;

      const user = await this.userModel.findById(id).select('-password').exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async verifyEmail(token: string) {
    try {
      const { userId, email } = decryptToken(token);

      const user = await this.userModel.findOne({ _id: userId, email }).select('-password');

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isVerified) {
        throw new NotFoundException('User is already verified');
      }

      user.isVerified = true;
      await user.save();

      return user;

    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }
}

