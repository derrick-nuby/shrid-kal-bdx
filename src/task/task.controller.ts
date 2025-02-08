import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';


@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  async create(@Body() data: CreateTaskDto) {
    const task = await this.taskService.create(data);

    return {
      message: 'Task has been created successfully',
      data: task,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  async findAll() {
    const tasks = await this.taskService.findAll();
    return {
      message: 'Tasks retrieved successfully',
      data: tasks,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findOne(id);
    return {
      message: 'Task retrieved successfully',
      data: task,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task by id' })
  async update(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    const task = await this.taskService.update(id, data);
    return {
      message: 'Task updated successfully',
      data: task,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by id' })
  async delete(@Param('id') id: string) {
    const task = await this.taskService.delete(id);
    return {
      message: 'Task deleted successfully',
      data: task,
    };
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark a task as completed or uncompleted' })
  async complete(@Param('id') id: string) {
    const task = await this.taskService.complete(id);
    return {
      message: 'Task status changed successfully',
      data: task,
    };
  }
}
