export interface User {
    id: string;
    name: string;
    age: number;
    email: string;
    role: 'Admin' | 'Manager' | 'User';
    status: string;
}