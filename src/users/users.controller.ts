import type { User } from './interfaces/user.interface';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() createUserDto: CreateUserDto) {
    const user = { ...createUserDto, id };
    return await this.usersService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id) {
    return await this.usersService.delete(id);
  }
}
