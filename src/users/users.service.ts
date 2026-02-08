import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async findAll(): Promise<User[]> {
        let result: User[] | undefined = await this.cacheManager.get('users');
        if (!result) {
            result = await this.usersRepository.find();
            await this.cacheManager.set('users', result, 10000);
        }
        return result;
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOneBy({ email: email });
    }

    async update(createUser: CreateUserDto): Promise<User> {
        const existing = await this.usersRepository.findOneBy({ id: createUser.id });
        if (existing && existing.email !== createUser.email) {
            throw new BadRequestException('Email cannot be updated');
        }
        await this.cacheManager.del('users');
        return await this.usersRepository.save(createUser as User);
    }

    async updateByEmail(email: string, updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
        if (updateUserDto.email && updateUserDto.email !== email) {
            throw new BadRequestException('Email cannot be updated');
        }
        await this.cacheManager.del('users');
        const user = await this.usersRepository.findOneBy({ email: email });
        if (!user) throw new NotFoundException;
        const merged = this.usersRepository.merge(user, updateUserDto);
        return await this.usersRepository.save(merged);
    }

    async remove(id: string): Promise<void> {
        const affected = (await this.usersRepository.delete(id)).affected;
        await this.cacheManager.del('users');
        if (affected === 0) throw new NotFoundException;
    }
}
