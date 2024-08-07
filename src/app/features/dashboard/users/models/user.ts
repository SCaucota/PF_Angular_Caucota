export type UserRole = 'ADMIN' | 'CLIENT';

export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: UserRole;
    token: string;
}