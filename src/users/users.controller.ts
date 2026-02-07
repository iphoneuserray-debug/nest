import { User } from './entity/user.entity';
import { Body, Controller, Delete, Get, Param, Put, BadRequestException, NotFoundException, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @ApiOkResponse({ description: 'List of all users', type: CreateUserDto, isArray: true })
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get('by-email/:email')
    @ApiOkResponse({ description: 'Returns the user with given email', type: CreateUserDto })
    @ApiNotFoundResponse({ description: 'User not found' })
    async findByEmail(@Param('email') email: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    @Put()
    @ApiOkResponse({ description: 'Creates or updates and returns success indicator' })
    @ApiBadRequestResponse({ description: 'Invalid user payload' })
    async update(@Body() createUserDto: CreateUserDto): Promise<User> {
        if (!createUserDto || typeof createUserDto !== 'object') throw new BadRequestException();
        const user = { ...createUserDto };
        return await this.usersService.update(user);
    }

    @Patch(':email')
    @ApiOkResponse({ description: 'User updated' })
    @ApiNotFoundResponse({ description: 'User not found' })
    async updateByEmail(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.usersService.updateByEmail(email, updateUserDto);
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'User deleted' })
    @ApiNotFoundResponse({ description: 'User not found' })
    async delete(@Param('id') id: string) {
        await this.usersService.remove(id as string);
    }
}
