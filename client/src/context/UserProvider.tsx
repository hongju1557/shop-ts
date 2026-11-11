import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import type { User, NewUser, LoginForm } from "../types/user";
import { getUsers, requestLogin, createUser } from "../api/users";

const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [users, setUsers] = useState<User[]>([]); //빈 배열
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // 회원 목록 조회
    useEffect(() => {
        getUsers()   //함수 호출
            .then(setUsers)
            .catch(err => console.log("회원목록 조회 오류!", err));
    }, []);

    // 회원가입 함수
    const signup = async ( newUser: NewUser) => {
        await createUser(newUser); // DB 저장
        setUsers(await getUsers()); // 회원 배열에 저장
    }

    // 로그인 함수 - loginForm(username, password)
    const login = async (loginForm: LoginForm) => {
       try{
          const user = await requestLogin(loginForm);
          setCurrentUser(user);  //로그인한 유저를 저장
          return true;
       }catch{
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