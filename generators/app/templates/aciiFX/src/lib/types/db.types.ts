export interface UsersTable {
    uuid: string;
    username: string;
    email: string;
    password?: string;
    registered: Date;
    lastLogin?: Date;
    verified?: 1 | 0;
    isAdmin?: 1 | 0;
}
