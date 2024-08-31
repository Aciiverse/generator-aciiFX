import { ResultSetHeader } from "mysql2";

export interface UsersTable {
    uuid: string;
    username: string;
    email: string;
    password?: string;
    registered: Date;
    lastLogin?: Date;
    verified: boolean;
    isAdmin: boolean;
}
export interface UsersResult extends Array<UsersTable>, ResultSetHeader {}
