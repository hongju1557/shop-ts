import api from "./api"
import type { User, LoginForm, NewUser } from "../types/user";

// 로그인 반환 타입 정의
interface LoginResponse{
    message: string;
    user: User;
}

// 로그인
export const requestLogin = async (loginForm: LoginForm) => {
    const response = 
        await api.post<LoginResponse>('/users/login', loginForm);
        return response.data.user;
}

// 회원 목록 조회
export const getUsers = async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
}

// 회원 가입(id, role 자동 저장)
export const createUser = async (newUser: NewUser) => {
    const { username, password, name, email } = newUser;
    await api.post("/users", { username, password, name, email});
}
