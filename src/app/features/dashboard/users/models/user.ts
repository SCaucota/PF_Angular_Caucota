export type UserRole = 'ADMIN' | 'USER';

export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: UserRole;
    token: string;
}