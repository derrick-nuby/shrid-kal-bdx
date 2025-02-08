import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {

  @ApiProperty({
    description: 'The title of the task',
    type: String,
    required: true,
    example: 'Task 1',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    type: String,
    required: false,
    example: 'This is the first task',
  })
  @IsString()
  @IsOptional()
  description?: string;
}