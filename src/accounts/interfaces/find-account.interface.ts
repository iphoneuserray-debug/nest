import { Account } from "./account.interface";

export interface FindAccount extends Account {
    name: string;
    role: 'Admin' | 'Manager' | 'User';
}
