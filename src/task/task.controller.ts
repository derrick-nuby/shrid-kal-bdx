import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  create(@Body() data: unknown) {
    return this.taskService.create(data);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: unknown) {
    return this.taskService.update(+id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.taskService.delete(+id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.taskService.complete(+id);
  }
}
