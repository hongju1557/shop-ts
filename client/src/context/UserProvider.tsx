import { useState } from "react";
import { UserContext } from "./UserContext";
import type { User, NewUser, LoginForm } from "../types/user";
import { initialUsers } from "../datas/users";

const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // 회원가입 함수
    const signup = ( newUser: NewUser) => {
        // 가입한 1명 회원
        const user: User = {...newUser, id: Date.now()}
        setUsers([...users, user])
    }

    // 로그인 함수
    const login = (loginForm: LoginForm) => {
        // 회원 목록에서 로그인한 1명의 회원 검색
        const found = users.find(user => 
            user.username === loginForm.username && 
                user.password === loginForm.password)
        if(!found) 
            return false; // 회원이 없어서 false로 반환함
        setCurrentUser(found);  //회원이 있는경우 true 반환
        return true;
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