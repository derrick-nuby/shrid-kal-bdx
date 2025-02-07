import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  create(data: unknown) {
    return 'This action adds a new task';
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, date: unknown) {
    return `This action updates a #${id} task`;
  }

  delete(id: number) {
    return `This action removes a #${id} task`;
  }

  complete(id: number) {
    return `This action completes a #${id} task`;
  }
}
