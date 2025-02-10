import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: user,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    const users = await this.userService.findAll();
    return {
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      data: user,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id);
    return {
      message: 'User deleted successfully',
      data: user,
    };
  }
}
