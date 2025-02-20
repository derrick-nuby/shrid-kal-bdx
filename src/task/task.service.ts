import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Model } from 'mongoose';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {

  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
  ) { }

  async create(data: CreateTaskDto, userId: string) {
    try {
      const existingTask = await this.taskModel.findOne({ title: data.title });

      if (existingTask) {
        throw new BadRequestException('Task already exists');
      }

      const task = new this.taskModel({
        ...data,
        createdBy: userId,
      });

      await task.save();

      return task;

    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async findAll(userId: string) {
    try {
      const tasks = await this.taskModel.find({ createdBy: userId }).exec();

      return tasks;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async findOne(id: string, userId: string) {
    try {

      const task = await this.taskModel.findOne({ _id: id, createdBy: userId }).exec();

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return task;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async update(id: string, data: UpdateTaskDto, userId: string) {
    try {


      const task = await this.taskModel.findOneAndUpdate(
        { _id: id, createdBy: userId },
        data,
        { new: true }
      ).exec();

      if (!task) {
        throw new BadRequestException('Task not found');
      }

      return task;

    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async delete(id: string, userId: string) {
    try {


      const deletedTask = await this.taskModel.findOneAndDelete({ _id: id, createdBy: userId }).exec();

      if (!deletedTask) {
        throw new BadRequestException('Task not found');
      }

      return deletedTask;

    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }

  async complete(id: string, userId: string) {
    try {


      const task = await this.taskModel.findOne({ _id: id, createdBy: userId }).exec();

      if (!task) {
        throw new BadRequestException('Task not found');
      }

      task.completed = !task.completed;
      await task.save();

      return task;
    } catch (error) {
      throw new BadRequestException(`${error.message}`);
    }
  }
}
