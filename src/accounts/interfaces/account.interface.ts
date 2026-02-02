export type Role = 'Admin' | 'Manager' | 'User';

export type Account = {
    email: string;
    password: string;
    // optional account fields
    phone?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    postcode?: string;
    about?: string;
};

export function isAccount(value: any): value is Account {
    return (
        value !== null &&
        typeof value === 'object' &&
        typeof value.id === 'string' &&
        typeof value.email === 'string'
    );
}
