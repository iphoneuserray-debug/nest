import type { User } from './interfaces/user.interface';
import { Body, Controller, Delete, Get, Param, Put, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @ApiOkResponse({ description: 'List of all users', type: CreateUserDto, isArray: true })
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Put(':id')
    @ApiOkResponse({ description: 'Creates or updates and returns success indicator' })
    @ApiBadRequestResponse({ description: 'Invalid user payload' })
    async update(@Param('id') id: string, @Body() createUserDto: CreateUserDto): Promise<User> {
        if (!createUserDto || typeof createUserDto !== 'object') throw new BadRequestException();
        const user = { ...createUserDto, id };
        // prevent changing the email of an existing user
        const existing = this.usersService.findAll().find((u) => u.id === id);
        if (existing && (user.email && user.email !== existing.email || user.id && user.id !== existing.id)) {
            throw new BadRequestException('Email or Id cannot be changed');
        }
        return await this.usersService.update(id, user);
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'User deleted (false if not found)' })
    @ApiNotFoundResponse({ description: 'User not found' })
    async delete(@Param('id') id: string) {
        await this.usersService.delete(id as string);
        return { deleted: true };
    }
}
