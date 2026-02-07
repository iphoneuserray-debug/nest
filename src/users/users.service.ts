import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findOne({ where: { email } });
    }

    async update(createUser: CreateUserDto): Promise<User> {
        const existing = await this.usersRepository.findOneBy({ id: createUser.id });
        if (existing && existing.email !== createUser.email) {
            throw new BadRequestException('Email cannot be updated');
        }
        return await this.usersRepository.save(createUser as User);
    }

    async updateByEmail(email: string, updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
        if (updateUserDto.email && updateUserDto.email !== email) {
            throw new BadRequestException('Email cannot be updated');
        }
        const user = await this.usersRepository.findOneBy({ email: email });
        if (!user) throw new NotFoundException;
        const merged = this.usersRepository.merge(user, updateUserDto);
        return await this.usersRepository.save(merged);
    }

    async remove(id: string): Promise<void> {
        const affected = (await this.usersRepository.delete(id)).affected;
        if (affected === 0) throw new NotFoundException;
    }
}
