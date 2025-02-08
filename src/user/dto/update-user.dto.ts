import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password', 'email'] as const)) {
  @ApiProperty({
    description: 'The name of the user',
    type: String,
    required: false,
    example: '',
  })
  name?: string;
}
