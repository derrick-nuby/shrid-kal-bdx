import {BadRequestException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { MailService } from "src/mail/mail.service";
import { createEncryptedToken } from "src/utils/verify-token.util";
import { createDefaultPassword } from 'src/utils/createDefaultPassword';
import {Cron} from "@nestjs/schedule";

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly mailService: MailService,
  ) { }

  private readonly BATCH_SIZE = 1000; // I supposed we have a large data set of users

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userModel.findOne({ email: createUserDto.email });

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      const defaultPassword = createDefaultPassword(createUserDto.name);

      console.log('defaultPassword', defaultPassword);

      const userToCreate = {
        ...createUserDto,
        password: defaultPassword
      };

      const user = await this.userModel.create(userToCreate);

      const token = createEncryptedToken(user._id, user.email);

      await this.mailService.sendUserCreatedSetPassword(user.email, user.name, token);

      return user;
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

  @Cron('0 0 * * *') //This cron job will run every day at midnight
  async handleDeActivateCron(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);

    const notificationDate = new Date();
    notificationDate.setDate(notificationDate.getDate() - 28);

    try {
      await this.notifyUsersBeforeDeactivation(notificationDate);

      await this.deactivateInactiveUsers(cutoffDate);

      this.logger.log('Deactivation and notification process completed successfully.');
    } catch (error) {
      this.logger.error('Failed to process deactivation and notifications', error.stack);
    }

  }

  private async notifyUsersBeforeDeactivation(notificationDate: Date) {
    let skip = 0;
    let hasMoreUsers = true;

    while (hasMoreUsers) {
      const usersToNotify = await this.userModel
          .find(
              {
                $or: [
                  { 'lastLogin.date': { $lt: notificationDate, $ne: null } },
                  { 'lastLogin.date': null },
                ],
                isActive: true,
              },
              { email: 1, name: 1, lastLogin: 1 },
          )
          .skip(skip)
          .limit(this.BATCH_SIZE)
          .exec();

      if (usersToNotify.length === 0) {
        hasMoreUsers = false;
        break;
      }

      for (const user of usersToNotify) {
        this.logger.log(`Sending deactivation warning email to ${user.email}`); // Aha nagumishijemo logger, ushiremo emailService
      }

      skip += this.BATCH_SIZE;
    }
  }

  private async deactivateInactiveUsers(cutoffDate: Date) {
    let skip = 0;
    let hasMoreUsers = true;

    while (hasMoreUsers) {
      const result = await this.userModel
          .updateMany(
              {
                $or: [
                  { 'lastLogin.date': { $lt: cutoffDate, $ne: null } },
                  { 'lastLogin.date': null },
                ],
                isActive: true,
              },
              { $set: { isActive: false } },
          )
          .skip(skip)
          .limit(this.BATCH_SIZE)
          .exec();

      if (result.modifiedCount === 0) {
        hasMoreUsers = false;
        break;
      }

      this.logger.log(`Deactivated ${result.modifiedCount} users in this batch.`);
      skip += this.BATCH_SIZE;
    }
  }


}
