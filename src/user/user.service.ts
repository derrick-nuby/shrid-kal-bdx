import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userModel.findOne({ email: createUserDto.email });

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      const user = await this.userModel.create(createUserDto);
      const { password, ...result } = user.toObject();

      return result;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async findAll() {
    try {
      const users = await this.userModel.find().select('-password').exec();

      return users;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async findOne(id: string) {
    try {

      const user = await this.userModel.findById(id).select('-password').exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {

      const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password').exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);

    }

  }

  async remove(id: string) {
    try {

      const user = await this.userModel.findByIdAndDelete(id).select('-password').exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }
}
