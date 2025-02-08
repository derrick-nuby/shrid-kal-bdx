import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: 'The title of the task',
    type: String,
    required: false,
    example: '',
  })
  title?: string;

  @ApiProperty({
    description: 'The description of the task',
    type: String,
    required: false,
    example: '',
  })
  description?: string;
}