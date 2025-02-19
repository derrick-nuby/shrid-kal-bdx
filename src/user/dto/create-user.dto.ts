import { IsString, IsNotEmpty, Matches, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({
    description: 'The name of the user',
    type: String,
    required: true,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
    required: true,
    example: '',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
