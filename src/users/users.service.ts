import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { mockUsers } from '../../test/resources/users.fixture';

@Injectable()
export class UsersService {
  private readonly users: User[] = mockUsers;

  findAll(): User[] {
    return this.users;
  }

  update(id: string, updatedUser: CreateUserDto) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
        const newUser = { ...updatedUser };
        this.users.push(newUser);
    } else {this.users[index] = updatedUser;}
  }

  delete(id: string) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return;
    this.users.splice(index, 1);
  }
}
