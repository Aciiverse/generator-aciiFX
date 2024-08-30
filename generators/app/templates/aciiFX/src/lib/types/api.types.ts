import { UsersTable } from "./db.types";

// Basic Response
export interface GetBaseRes {
    message: string;
}

// Users
export interface GetUsersLoginReq {
    username?: string;
    password?: string;
}
export interface GetUsersLoginRes extends GetBaseRes {
    token: string;
    tokenExp: number;
    user: Omit<UsersTable, "password">;
}

export interface GetUsersRegisterReq {
    username?: string;
    email?: string;
    password?: string;
    passwordRepeat?: string;
}
export interface GetUsersRegisterRes extends GetBaseRes {
    token: string;
    tokenExp: number;
    user: Omit<UsersTable, "password">;
}
