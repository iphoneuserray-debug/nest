import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Account } from './interfaces/account.interface';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { FindAccount } from './interfaces/find-account.interface';

@Injectable()
export class AccountsService {
    private accounts: Account[] = [];

    constructor(private readonly usersService: UsersService) { }

    create(dto: CreateAccountDto): Account {
        const idx = this.accounts.findIndex((a) => a.email === dto.email);
        if (idx !== -1) throw new BadRequestException();

        // create account record
        const { email, password, name, phone, address, state, city, postcode, about, country, role } = dto;
        const account: Account = {
            email, password, phone, address, state, city, postcode, about, country,
        };

        // create corresponding user record if not exists (matched by email)
        try {
            const users = this.usersService.findAll();
            const exists = users.find((u) => u.email === account.email);
            if (!exists) {
                const newUser = {
                    id: randomUUID(),
                    name: name ?? '',
                    age: 0,
                    email: account.email,
                    role: role ?? 'User',
                    status: 'active',
                } as any;
                // UsersService.update acts as create-or-update
                this.usersService.update(newUser.id, newUser);
            }
        } catch {
        }

        this.accounts.push(account);
        return account;
    }

    findAll(): Account[] {
        return this.accounts;
    }

    findOne(email: string): FindAccount {
        const acc = this.accounts.find((a) => a.email === email);
        if (!acc) throw new NotFoundException('Account not found');

        const users = this.usersService.findAll();
        const user = users.find((u) => u.email === email);
        if (!user) {
            const newUser = {
                id: randomUUID(),
                name: '',
                age: 0,
                email: email,
                role: 'User',
                status: 'active',
            } as any;
            // UsersService.update acts as create-or-update
            this.usersService.update(newUser.id, newUser);
            return { ...acc, name: newUser.name, role: newUser.role } as FindAccount;
        }
        return { ...acc, name: user.name, role: user.role } as FindAccount;

    }

    update(email: string, dto: UpdateAccountDto): FindAccount {
        const idx = this.accounts.findIndex((a) => a.email === email);
        if (idx === -1) throw new NotFoundException('Account not found');
        this.accounts[idx] = { ...this.accounts[idx], ...dto } as Account;
        if (dto.name || dto.role) {
            const users = this.usersService.findAll();
            const user = users.find((u) => u.email === email);
            if (!user) {
                const newUser = {
                    id: randomUUID(),
                    name: dto.name ?? '',
                    age: 0,
                    email: email,
                    role: dto.role ?? 'User',
                    status: 'active',
                }
                this.usersService.update(newUser.id, newUser)
            } else
                this.usersService.update(user.id, { ...user, role: dto.role ?? user.role, name: dto.name ?? user.name })
        }
        return { ...this.accounts[idx], role: dto.role, name: dto.name } as FindAccount;
    }

    remove(email: string): void {
        const idx = this.accounts.findIndex((a) => a.email === email);
        if (idx === -1) throw new NotFoundException('Account not found');
        this.accounts.splice(idx, 1);
    }
}
