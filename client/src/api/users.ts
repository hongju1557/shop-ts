import type { LoginForm, User, NewUser } from "../types/user";
import api from "./api";

interface LoginResponse {
    message: string;
    user: User;
}

export const getUsers = async() => {
    const response = await api.get<User[]>('/users')
    return response.data;
}

export const createUser = async (newUser: NewUser) => {
    const response = await api.post<User>('/users', newUser);
    return response.data;
};

export const requestLogin = async (loginForm: LoginForm) => {
    const response = 
        await api.post<LoginResponse>('users/login', loginForm);
        return response.data.user;
}
