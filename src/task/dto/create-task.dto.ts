import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}