import { UsersTable } from "./types/db.types";

export interface UserData {
    uuid: UsersTable["uuid"];
    username: UsersTable["username"];
    isAdmin: UsersTable["isAdmin"];
    lastLogin: UsersTable["lastLogin"];
    registered: UsersTable["registered"];
}

export namespace Base {}
