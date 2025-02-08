import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({
    description: 'The name of the user',
    type: String,
    required: true,
    example: 'John Doe',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
    required: true,
    example: '',
  })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
    required: true,
    example: '',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  password: string;
}
