import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  async create(@Body() data: CreateTaskDto) {
    const task = await this.taskService.create(data);

    return {
      message: 'Task has been created successfully',
      task,
    };
  }

  @Get()
  async findAll() {
    const tasks = await this.taskService.findAll();
    return {
      message: 'Tasks retrieved successfully',
      tasks,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findOne(id);
    return {
      message: 'Task retrieved successfully',
      task,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    const task = await this.taskService.update(id, data);
    return {
      message: 'Task updated successfully',
      task,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const task = await this.taskService.delete(id);
    return {
      message: 'Task deleted successfully',
      task,
    };
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string) {
    const task = await this.taskService.complete(id);
    return {
      message: 'Task status changed successfully',
      task,
    };
  }
}
