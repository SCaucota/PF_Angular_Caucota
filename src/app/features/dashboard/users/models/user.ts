export type UserRole = 'ADMIN' | 'CLIENT';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    token: string;
}