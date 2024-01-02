export interface RegistrationRequest {
    name: string,
    status: number,
    email: string,
    password: string,
}

export interface LoginRequest {
    email: string,
    password: string,
}

export interface UserData {
    id: string,
    name: string,
    status: number,
    email: string,
    password: string,
}