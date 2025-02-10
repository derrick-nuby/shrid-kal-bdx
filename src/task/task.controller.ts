import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';


@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  async create(@Body() data: CreateTaskDto, @Req() req) {
    const { id: userId } = req.user;
    const task = await this.taskService.create(data, userId);

    return {
      message: 'Task has been created successfully',
      data: task,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  async findAll(@Req() req) {
    const { id: userId } = req.user;
    const tasks = await this.taskService.findAll(userId);
    return {
      message: 'Tasks retrieved successfully',
      data: tasks,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  async findOne(@Param('id', ParseObjectIdPipe) id: string, @Req() req) {
    const { id: userId } = req.user;
    const task = await this.taskService.findOne(id, userId);
    return {
      message: 'Task retrieved successfully',
      data: task,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a task by id' })
  async update(@Param('id', ParseObjectIdPipe) id: string, @Body() data: UpdateTaskDto, @Req() req) {
    const { id: userId } = req.user;
    const task = await this.taskService.update(id, data, userId);
    return {
      message: 'Task updated successfully',
      data: task,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by id' })
  async delete(@Param('id', ParseObjectIdPipe) id: string, @Req() req) {
    const { id: userId } = req.user;
    const task = await this.taskService.delete(id, userId);
    return {
      message: 'Task deleted successfully',
      data: task,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark a task as completed or uncompleted' })
  async complete(@Param('id', ParseObjectIdPipe) id: string, @Req() req) {
    const { id: userId } = req.user;
    const task = await this.taskService.complete(id, userId);
    return {
      message: 'Task status changed successfully',
      data: task,
    };
  }
}
