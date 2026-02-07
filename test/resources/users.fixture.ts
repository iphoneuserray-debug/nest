import { User } from '../../src/users/entity/user.entity';

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Snow',
        age: 25,
        email: 'snow@example.com',
        role: 'Admin',
        status: 'Online',
    },
    {
        id: '2',
        name: 'Lannister',
        age: 42,
        email: 'lannister@example.com',
        role: 'Manager',
        status: 'Online',
    },
    {
        id: '3',
        name: 'Stark',
        age: 35,
        email: 'stark@example.com',
        role: 'User',
        status: 'Offline',
    },
    {
        id: '4',
        name: 'Targaryen',
        age: 28,
        email: 'targaryen@example.com',
        role: 'User',
        status: 'Online',
    },
    {
        id: '5',
        name: 'Baratheon',
        age: 45,
        email: 'baratheon@example.com',
        role: 'Manager',
        status: 'Offline',
    },
];
