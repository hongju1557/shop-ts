import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import type { User, NewUser, LoginForm, UserUpdateForm } from "../types/user";
import { getUsers, requestLogin, createUser, modifyuser, getCurrentUser, requestLogout } from "../api/users";

const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [users, setUsers] = useState<User[]>([]); //빈 배열
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isRestoringSession, setIsRestoringSession] = useState(true);

    useEffect(() => {
        let active = true;
        getCurrentUser()
            .then(user => { if (active) setCurrentUser(user); })
            .catch(err => console.error("로그인 상태 복원 오류!", err))
            .finally(() => { if (active) setIsRestoringSession(false); });
        return () => { active = false; };
    }, []);

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
    const logout = async () => {
        await requestLogout();
        setCurrentUser(null);
    }

    const updateUser = async(form: UserUpdateForm) => {
        if (!currentUser) throw new Error("로그인이 필요합니다.");
        const updatedUser = await modifyuser(currentUser.id, form);
        setCurrentUser(user => user?.id === updatedUser.id ? updatedUser : user);
        setUsers(users => users.map(user =>
            user.id === updatedUser.id ? updatedUser : user
        ));
    }

    // 복원 전에 보호된 페이지가 로그인 화면으로 이동하지 않도록 대기
    if (isRestoringSession) return <p>로그인 상태 확인 중...</p>;

    return(
        <UserContext.Provider value={{ 
            users, 
            signup,
            currentUser,
            login,
            logout,
            updateUser
         }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;
