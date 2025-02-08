import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }


  async register(RegisterUserDto: RegisterUserDto) {
    try {
      const existingUser = await this.userModel.findOne({ email: RegisterUserDto.email });

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      const user = await this.userModel.create(RegisterUserDto);
      const { password, ...result } = user.toObject();

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
        throw new BadRequestException('Invalid credentials');
      }

      const { password, ...result } = user.toObject();
      return result;

    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  getProfile() {
    try {


    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  verifyEmail(token: string) {
    try {

    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }
}
