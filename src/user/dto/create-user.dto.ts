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

  @ApiProperty({
    description: 'The password of the user',
    type: String,
    required: true,
    minLength: 8,
    example: 'Wx9AP^P^Hxji134Q',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  password: string;
}
