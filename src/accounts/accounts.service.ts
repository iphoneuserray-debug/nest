import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Account } from './entity/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountsRepository: Repository<Account>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(dto: CreateAccountDto) {
        const exists = await this.accountsRepository.findOneBy({ email: dto.email });
        if (exists) throw new BadRequestException('Account already exists');

        let user = await this.usersRepository.findOneBy({ email: dto.email });
        // If user not existed, create one
        if (!user) {
            user = this.usersRepository.create({
                id: randomUUID(),
                name: '',
                age: 0,
                email: dto.email,
                role: 'User',
                status: 'Online'
            } as User);
            user = await this.usersRepository.save(user);
        }
        // Create account
        const account = this.accountsRepository.create({
            email: dto.email,
            password: dto.password,
            phone: dto.phone,
            address: dto.address,
            state: dto.state,
            city: dto.city,
            postcode: dto.postcode,
            about: dto.about,
            country: dto.country,
            user,
        } as Account);

        return await this.accountsRepository.save(account);
    }

    findAll(): Promise<Account[]> {
        return this.accountsRepository.find();
    }

    async findOne(email: string): Promise<Account> {
        const account = await this.accountsRepository.findOneBy({ email: email });
        if (!account) throw new NotFoundException;
        return account;
    }

    async update(email: string, dto: UpdateAccountDto): Promise<UpdateAccountDto> {
        // Disable updating email
        if (dto.email && dto.email !== email) {
            throw new BadRequestException('Email cannot be updated');
        }
        const account = await this.accountsRepository.findOneBy({ email });
        if (!account) throw new NotFoundException();
        // Merge change into existed user 
        const merged = this.accountsRepository.merge(account, dto as any);
        const saved = await this.accountsRepository.save(merged);
        // Map changed property to result
        const result: UpdateAccountDto = {};
        Object.keys(dto).forEach((k) => { result[k] = saved[k]; });
        return result;
    }

    async remove(email: string): Promise<void> {
        const affected = (await this.accountsRepository.delete(email)).affected;
        if (affected === 0) throw new NotFoundException;
    }
}
