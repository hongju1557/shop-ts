import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import type { User, NewUser, LoginForm } from "../types/user";
import { getUsers, requestLogin, createUser } from "../api/users";

const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        getUsers()
        .then(setUsers)
        .catch(err => console.log("회원 목록 조회 오류", err));
        ;
    },[]);

    // 회원가입 함수
    const signup = async (newUser: NewUser) => {
        const user = await createUser(newUser);
        setUsers(previous => [...previous, user]);
    }

    // 로그인 함수
    const login = async (loginForm: LoginForm) => {
        try {
            const user = await requestLogin(loginForm)
            setCurrentUser(user);
            return true;
        } catch {
            return false;
        }
    }

    // 로그아웃 함수
    const logout = () => {
        setCurrentUser(null);
    }

    return(
        <UserContext.Provider value={{ 
            users, 
            signup,
            currentUser,
            login,
            logout
         }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;
