import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { mockUsers } from '../../test/resources/users.fixture';

@Injectable()
export class UsersService {
    private readonly users: User[] = mockUsers;

    findAll(): User[] {
        return this.users;
    }

    update(id: string, updatedUser: CreateUserDto): User {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) {
            const newUser = { ...updatedUser };
            this.users.push(newUser);
            return newUser;
        } else {
            this.users[index] = updatedUser;
            return this.users[index];
        }
    }

    delete(id: string) {
        const index = this.users.findIndex((u) => u.id === id);
        if (index === -1) throw new NotFoundException('User not found');
        this.users.splice(index, 1);
    }
}
