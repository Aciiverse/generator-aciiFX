import { ResultSetHeader } from "mysql2";

export interface UserData {
    uuid: string,
    username: string,
    password?: string,
    registered: Date,
    lastLogin: Date,
    isAdmin: boolean
}

export interface UserResponse extends UserData, ResultSetHeader { }

export module Base {

}