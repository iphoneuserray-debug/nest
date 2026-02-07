import { Body, Controller, Delete, Get, Param, Patch, Post, BadRequestException, NotFoundException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
    constructor(private readonly service: AccountsService) { }

    @Post()
    @ApiCreatedResponse({ description: 'Account created successfully and returned' })
    @ApiBadRequestResponse({ description: 'Invalid account payload or account exist' })
    create(@Body() dto: CreateAccountDto) {
        if (!dto) throw new BadRequestException();
        return this.service.create(dto);
    }

    @Get()
    @ApiOkResponse({ description: 'List of all accounts', type: CreateAccountDto, isArray: true })
    findAll() {
        return this.service.findAll();
    }

    @Get(':email')
    @ApiOkResponse({ description: 'Returns the account with given email', type: CreateAccountDto })
    @ApiNotFoundResponse({ description: 'Account not found' })
    findOne(@Param('email') email: string) {
        const account = this.service.findOne(email);
        if (!account) throw new NotFoundException;
        return account;
    }

    @Patch(':email')
    @ApiOkResponse({ description: 'Account updated and returned', type: CreateAccountDto })
    @ApiNotFoundResponse({ description: 'Account not found' })
    @ApiBadRequestResponse({ description: 'Invalid update payload' })
    update(@Param('email') email: string, @Body() dto: UpdateAccountDto) {
        if (!dto) throw new BadRequestException();
        return this.service.update(email, dto);
    }

    @Delete(':email')
    @ApiOkResponse({ description: 'Account deleted successfully' })
    @ApiNotFoundResponse({ description: 'Account not found' })
    async remove(@Param('email') email: string) {
        await this.service.remove(email);
    }
}
