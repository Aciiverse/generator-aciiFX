export interface UserData {
    uuid:       string,
    username:   string,
    email:      string,
    password?:  string,
    registered: Date,
    lastLogin:  Date,
    isAdmin:    boolean
}

export module Base {

}